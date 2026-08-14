import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import type { TaskMetadata } from "../src/task.js";
import * as packageModule from "../src/package-authorization.js";
import {
  evaluatePackageAuthorization,
  evaluatePackageTaskConformance,
  evaluateStoredPackageAuthorization,
  packageApprovalId,
  packageAuthorizationPlanSchema,
  packageAuthorizationSigningPayload,
  packagePlanHash,
  packageRevocationId,
  packageRevocationSigningPayload,
  writePackageUseReceipt,
  type PackageAuthorizationPlan,
  type PackageAuthorizationReceipt,
  type PackageRevocationReceipt,
  type PackageUseReceipt,
} from "../src/package-authorization.js";

const { publicKey, privateKey } = generateKeyPairSync("ed25519");
const publicKeyPem = publicKey.export({ type: "spki", format: "pem" }).toString();
const baseline = "a".repeat(40);
const head = "b".repeat(40);
const observedAt = "2026-08-14T12:00:00.000Z";
const policy = {
  schema_version: 1 as const, policy_version: "1.0.0", mode: "SOLO_DURABLE" as const,
  repository: "delmacy/system-builder", max_age_seconds: 604800,
  receipt_directory_env: "SYSTEM_BUILDER_HUMAN_APPROVAL_DIR",
  authorized_approvers: [{ approver_identity: "owner", key_id: "owner-key", public_key_pem: publicKeyPem }],
};

function descriptor(index: number) {
  return {
    descriptor_id: `PWD-${String(index).padStart(3, "0")}`,
    work_package_id: "WP-I2-07",
    milestone: "I2",
    objective_id: `objective-${index}`,
    output_ids: [`output-${index}`],
    predecessor_ids: index === 1 ? ["TASK-037"] : [`PWD-${String(index - 1).padStart(3, "0")}`],
    governance_classes: ["ROUTINE" as const],
    allowed_paths: ["docs/out.md", "specs/tasks/**"],
    forbidden_paths: ["apps/**"],
    max_risk: "medium" as const,
    max_files: 4,
    max_attempts: 3,
    executor_preferences: ["opencode" as const],
    model_tiers: ["free" as const],
    validation_commands: ["npm run verify"],
    required_checks: ["validate"],
    dor_ids: ["DOR-READY"],
    dod_ids: ["DOD-VERIFIED"],
  };
}

function plan(overrides: Partial<PackageAuthorizationPlan> = {}): PackageAuthorizationPlan {
  return packageAuthorizationPlanSchema.parse({
    schema_version: 1, package_id: "PKG-I2-001", package_version: "1.0.0",
    repository: "delmacy/system-builder", approver_identity: "owner", key_id: "owner-key",
    baseline_commit: baseline, base_ref: "main",
    valid_from: "2026-08-13T00:00:00.000Z", expires_at: "2026-08-20T00:00:00.000Z",
    execution_focus: ["I2"], risk_ceiling: "medium", protected_paths: ["tooling/agent-harness/policies/**"],
    forbidden_paths: ["apps/**"], allowed_executors: ["opencode"], allowed_model_tiers: ["free"],
    total_action_budget: 40, total_attempt_budget: 60, total_task_budget: 20, max_consecutive_failures: 3,
    required_validation_commands: ["npm run verify"], required_checks: ["validate"],
    closure_policy_id: "STATE-CLOSURE-V1", evidence_policy_id: "EVIDENCE-V1", revocation_policy_id: "IMMEDIATE-V1",
    exception_classes: ["ARCHITECTURE", "CONTRACT", "SECURITY", "EVALUATOR", "DATA", "RELEASE", "WAIVER"],
    descriptors: Array.from({ length: 20 }, (_, index) => descriptor(index + 1)),
    governance_policy_version: "1.0.0", ...overrides,
  });
}

function metadata(planValue = plan(), overrides: Partial<TaskMetadata> = {}): TaskMetadata {
  return {
    id: "TASK-100", title: "fixture", status: "ready", priority: 1, milestone: "I2",
    model_tier: "free", risk: "medium", architecture_impact: false, executor_preference: "opencode",
    depends_on: ["TASK-037"], context_paths: ["AGENTS.md"], allowed_paths: ["docs/out.md"],
    forbidden_paths: ["apps/**"], max_files: 4, validation: ["npm run verify"],
    package_authorization: {
      package_id: planValue.package_id, package_version: planValue.package_version, plan_hash: packagePlanHash(planValue),
      descriptor_id: "PWD-001", objective_id: "objective-1", output_ids: ["output-1"], governance_classes: ["ROUTINE"],
      dor_ids: ["DOR-READY"], dod_ids: ["DOD-VERIFIED"],
    },
    ...overrides,
  };
}

function approval(planValue: PackageAuthorizationPlan): PackageAuthorizationReceipt {
  const semantic = {
    schema_version: 1 as const, authority_type: "PACKAGE_OWNER" as const, approver_identity: "owner", key_id: "owner-key",
    repository: planValue.repository, package_id: planValue.package_id, package_version: planValue.package_version,
    plan_hash: packagePlanHash(planValue), decision: "APPROVED" as const, rationale: "bounded package accepted",
    approved_at: "2026-08-14T10:00:00.000Z", governance_policy_version: "1.0.0",
  };
  return { ...semantic, approval_id: packageApprovalId(semantic), signature: sign(null, Buffer.from(packageAuthorizationSigningPayload(semantic)), privateKey).toString("base64") };
}

function revocation(planValue: PackageAuthorizationPlan): PackageRevocationReceipt {
  const semantic = {
    schema_version: 1 as const, authority_type: "PACKAGE_REVOCATION" as const, approver_identity: "owner", key_id: "owner-key",
    repository: planValue.repository, package_id: planValue.package_id, package_version: planValue.package_version,
    plan_hash: packagePlanHash(planValue), reason: "owner stop", revoked_at: "2026-08-14T11:00:00.000Z",
    governance_policy_version: "1.0.0",
  };
  return { ...semantic, revocation_id: packageRevocationId(semantic), signature: sign(null, Buffer.from(packageRevocationSigningPayload(semantic)), privateKey).toString("base64") };
}

function expected(planValue = plan(), metadataValue = metadata(planValue), overrides: Record<string, unknown> = {}) {
  return {
    repository: "delmacy/system-builder", taskId: "TASK-100", taskMetadata: metadataValue,
    action: "IMPLEMENTATION_PR" as const, sourceCommit: baseline, prNumber: 200, baseRef: "main",
    headRef: "task/100", headSha: head, observedAt, validation: "PASS" as const,
    checks: [{ name: "validate", status: "SUCCESS" as const }], baselineIsAncestor: true,
    changedProtectedPaths: [], totalAttempts: 0, consecutiveFailures: 0, ...overrides,
  };
}

describe("bounded package work authorization", () => {
  it("enforces 20-50 unique safe descriptors and strict budgets", () => {
    const base = plan();
    for (const descriptors of [base.descriptors.slice(0, 19), [...base.descriptors, ...Array.from({ length: 31 }, (_, index) => descriptor(index + 21))]]) {
      assert.equal(packageAuthorizationPlanSchema.safeParse({ ...base, descriptors }).success, false);
    }
    assert.equal(packageAuthorizationPlanSchema.safeParse({ ...base, descriptors: [base.descriptors[0], ...base.descriptors.slice(0, 19)] }).success, false);
    assert.equal(packageAuthorizationPlanSchema.safeParse({ ...base, total_action_budget: 0 }).success, false);
    assert.equal(packageAuthorizationPlanSchema.safeParse({ ...base, total_task_budget: 21 }).success, false);
    assert.equal(packageAuthorizationPlanSchema.safeParse({ ...base, total_action_budget: 41 }).success, false);
    assert.equal(packageAuthorizationPlanSchema.safeParse({ ...base, total_attempt_budget: 61 }).success, false);
    assert.equal(packageAuthorizationPlanSchema.safeParse({ ...base, unknown: true }).success, false);
    assert.equal(packageAuthorizationPlanSchema.safeParse({ ...base, forbidden_paths: ["../outside"] }).success, false);
  });

  it("accepts one exact signed routine descriptor and builds deterministic use evidence", () => {
    const planValue = plan();
    const first = evaluatePackageAuthorization(policy, planValue, approval(planValue), [], [], expected(planValue));
    const second = evaluatePackageAuthorization(policy, planValue, approval(planValue), [], [], expected(planValue));
    assert.equal(first.decision, "VALID");
    assert.deepEqual(second, first);
    assert.ok(first.use_receipt?.use_id.startsWith("PUSE-"));
    assert.equal(first.use_receipt?.descriptor_id, "PWD-001");
    const conformance = evaluatePackageTaskConformance(planValue, planValue.descriptors[0]!, expected(planValue), []);
    assert.equal(conformance.decision, "CONFORMING");
    assert.ok(conformance.conformance_id.startsWith("PCONF-"));
    assert.deepEqual(evaluatePackageTaskConformance(planValue, planValue.descriptors[0]!, expected(planValue), []), conformance);
  });

  it("fails closed for identity, signature, time and revocation failures", () => {
    const planValue = plan(); const signed = approval(planValue);
    const cases = [
      [planValue, { ...signed, signature: Buffer.alloc(64).toString("base64") }, [], expected(planValue), "SIGNATURE_INVALID"],
      [planValue, signed, [], expected(planValue, metadata(planValue), { observedAt: "2026-08-21T00:00:00.000Z" }), "PACKAGE_EXPIRED"],
      [planValue, signed, [revocation(planValue)], expected(planValue), "PACKAGE_REVOKED"],
      [planValue, signed, [], expected(planValue, metadata(planValue), { headSha: "c".repeat(40), baseRef: "other" }), "IDENTITY_MISMATCH"],
    ] as const;
    for (const [candidatePlan, candidateApproval, revocations, candidateExpected, reason] of cases) {
      const result = evaluatePackageAuthorization(policy, candidatePlan, candidateApproval, [...revocations], [], candidateExpected);
      assert.notEqual(result.decision, "VALID");
      assert.ok(result.reason_codes.includes(reason));
    }
  });

  it("detects deterministic task narrowing and protected baseline drift", () => {
    const planValue = plan(); const signed = approval(planValue);
    const variants: Array<[Partial<TaskMetadata>, string, Record<string, unknown>?]> = [
      [{ allowed_paths: ["docs/other.md"] }, "PATH_SCOPE_DRIFT"],
      [{ risk: "high" }, "RISK_EXCEEDED"],
      [{ depends_on: [] }, "DEPENDENCY_DRIFT"],
      [{ validation: ["npm test"] }, "VALIDATION_DRIFT"],
      [{ executor_preference: "codex" }, "EXECUTOR_MISMATCH"],
      [{ model_tier: "cheap" }, "MODEL_TIER_MISMATCH"],
      [{}, "PROTECTED_BASELINE_CHANGED", { changedProtectedPaths: ["tooling/agent-harness/policies/HUMAN_APPROVAL.json"] }],
    ];
    for (const [metadataOverrides, reason, expectedOverrides = {}] of variants) {
      const metadataValue = metadata(planValue, metadataOverrides);
      const result = evaluatePackageAuthorization(policy, planValue, signed, [], [], expected(planValue, metadataValue, expectedOverrides));
      assert.equal(result.decision, "INVALID");
      assert.ok(result.reason_codes.includes(reason as never));
    }
  });

  it("requires exact exceptions for sensitive governance classes", () => {
    const base = plan();
    const descriptors = [...base.descriptors];
    descriptors[0] = { ...descriptors[0]!, governance_classes: ["ARCHITECTURE"] };
    const planValue = plan({ descriptors });
    const metadataValue = metadata(planValue, { package_authorization: { ...metadata(planValue).package_authorization!, governance_classes: ["ARCHITECTURE"] } });
    const result = evaluatePackageAuthorization(policy, planValue, approval(planValue), [], [], expected(planValue, metadataValue));
    assert.equal(result.decision, "EXCEPTION_REQUIRED");
    assert.deepEqual(result.reason_codes, ["EXCEPTION_REQUIRED"]);
  });

  it("consumes a descriptor once and permits state only after its implementation use", () => {
    const planValue = plan(); const signed = approval(planValue);
    const implementation = evaluatePackageAuthorization(policy, planValue, signed, [], [], expected(planValue));
    assert.ok(implementation.use_receipt);
    const repeated = evaluatePackageAuthorization(policy, planValue, signed, [], [implementation.use_receipt], expected(planValue));
    assert.equal(repeated.decision, "VALID");
    assert.equal(repeated.use_receipt?.use_id, implementation.use_receipt.use_id);
    const divergent = evaluatePackageAuthorization(policy, planValue, signed, [], [implementation.use_receipt], expected(planValue, metadata(planValue), { prNumber: 999 }));
    assert.ok(divergent.reason_codes.includes("DESCRIPTOR_ALREADY_USED"));
    const stateExpected = expected(planValue, metadata(planValue), { action: "STATE_PR", prNumber: 201, headRef: "state/task-100-close", headSha: "c".repeat(40) });
    const missingImplementation = evaluatePackageAuthorization(policy, planValue, signed, [], [], stateExpected);
    assert.ok(missingImplementation.reason_codes.includes("STATE_WITHOUT_IMPLEMENTATION"));
    const state = evaluatePackageAuthorization(policy, planValue, signed, [], [implementation.use_receipt], stateExpected);
    assert.equal(state.decision, "VALID");
    assert.equal(state.use_receipt?.previous_use_id, implementation.use_receipt.use_id);
    const repeatedState = evaluatePackageAuthorization(policy, planValue, signed, [], [implementation.use_receipt, state.use_receipt], stateExpected);
    assert.equal(repeatedState.decision, "VALID");
    assert.equal(repeatedState.use_receipt?.use_id, state.use_receipt?.use_id);
  });

  it("requires an integrated descriptor predecessor and its exact task dependency", () => {
    const planValue = plan(); const signed = approval(planValue);
    const implementation = evaluatePackageAuthorization(policy, planValue, signed, [], [], expected(planValue));
    assert.ok(implementation.use_receipt);
    const stateExpected = expected(planValue, metadata(planValue), { action: "STATE_PR", prNumber: 201, headRef: "state/task-100-close", headSha: "c".repeat(40) });
    const state = evaluatePackageAuthorization(policy, planValue, signed, [], [implementation.use_receipt], stateExpected);
    assert.ok(state.use_receipt);
    const secondBinding = {
      package_id: planValue.package_id, package_version: planValue.package_version, plan_hash: packagePlanHash(planValue),
      descriptor_id: "PWD-002", objective_id: "objective-2", output_ids: ["output-2"], governance_classes: ["ROUTINE"],
      dor_ids: ["DOR-READY"], dod_ids: ["DOD-VERIFIED"],
    };
    const secondMetadata = metadata(planValue, { id: "TASK-101", depends_on: ["TASK-100"], package_authorization: secondBinding });
    const secondExpected = expected(planValue, secondMetadata, { taskId: "TASK-101", prNumber: 202, headRef: "task/101", headSha: "d".repeat(40) });
    const missingState = evaluatePackageAuthorization(policy, planValue, signed, [], [implementation.use_receipt], secondExpected);
    assert.ok(missingState.reason_codes.includes("DEPENDENCY_DRIFT"));
    const valid = evaluatePackageAuthorization(policy, planValue, signed, [], [implementation.use_receipt, state.use_receipt], secondExpected);
    assert.equal(valid.decision, "VALID");
    const missingTaskDependency = evaluatePackageAuthorization(policy, planValue, signed, [], [implementation.use_receipt, state.use_receipt], {
      ...secondExpected, taskMetadata: { ...secondMetadata, depends_on: [] },
    });
    assert.ok(missingTaskDependency.reason_codes.includes("DEPENDENCY_DRIFT"));
  });

  it("writes package use evidence idempotently and rejects divergent content", () => {
    const root = mkdtempSync(join(tmpdir(), "package-use-")); const planValue = plan();
    const evaluation = evaluatePackageAuthorization(policy, planValue, approval(planValue), [], [], expected(planValue));
    const receipt = evaluation.use_receipt!;
    const path = writePackageUseReceipt(root, receipt);
    assert.equal(writePackageUseReceipt(root, receipt), path);
    assert.equal(JSON.parse(readFileSync(path, "utf8")).use_id, receipt.use_id);
    assert.throws(() => writePackageUseReceipt(root, { ...receipt, pr_number: 999 } as PackageUseReceipt), /PACKAGE_USE_ID_MISMATCH/);
  });

  it("loads the exact package authority from the external read-only layout", () => {
    const root = mkdtempSync(join(tmpdir(), "package-root-")); const store = mkdtempSync(join(tmpdir(), "package-store-"));
    const planValue = plan(); const planHash = packagePlanHash(planValue);
    mkdirSync(join(root, "tooling/agent-harness/policies"), { recursive: true });
    mkdirSync(join(store, "packages", planValue.package_id, planHash), { recursive: true });
    writeFileSync(join(root, "tooling/agent-harness/policies/HUMAN_APPROVAL.json"), JSON.stringify(policy));
    writeFileSync(join(store, "packages", planValue.package_id, planHash, "plan.json"), JSON.stringify(planValue));
    writeFileSync(join(store, "packages", planValue.package_id, planHash, "approval.json"), JSON.stringify(approval(planValue)));
    const previous = process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR;
    try {
      process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR = store;
      const result = evaluateStoredPackageAuthorization(root, expected(planValue, metadata(planValue), { baselineIsAncestor: true, changedProtectedPaths: [] }));
      assert.equal(result.decision, "VALID");
    } finally {
      if (previous === undefined) delete process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR;
      else process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR = previous;
    }
  });

  it("exposes payload construction but no production signing capability", () => {
    assert.equal("signPackageAuthorization" in packageModule, false);
  });
});

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { generateKeyPairSync, sign } from "node:crypto";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { packageApprovalId, packageAuthorizationSigningPayload, packagePlanHash, type PackageAuthorizationPlan } from "../src/package-authorization.js";
import { advancePackageTaskMaterialization } from "../src/package-task-materializer.js";

describe("package-authorized rolling-wave task materializer", () => {
  it("validates before mutation, advances one action and never consumes the descriptor", () => {
    const fixture = repository();
    const first = advancePackageTaskMaterialization({ candidatePath: fixture.candidate, root: fixture.root, now: () => "2026-08-14T12:00:00.000Z" });
    assert.equal(first.action, "BRANCH_CREATED");
    assert.equal(git(["branch", "--show-current"], fixture.root), first.record.branch);
    assert.equal(existsSync(join(fixture.root, "specs/tasks", first.record.candidate_name)), false);
    assert.equal(existsSync(join(fixture.root, ".agent/package-uses")), false);
    const second = advancePackageTaskMaterialization({ candidatePath: fixture.candidate, root: fixture.root, now: () => "2026-08-14T12:00:00.000Z" });
    assert.equal(second.action, "SPEC_WRITTEN");
    assert.equal(readFileSync(join(fixture.root, "specs/tasks", second.record.candidate_name), "utf8"), readFileSync(fixture.candidate, "utf8"));
    assert.equal(existsSync(join(fixture.root, ".agent/package-uses")), false);
    const third = advancePackageTaskMaterialization({ candidatePath: fixture.candidate, root: fixture.root, now: () => "2026-08-14T12:00:00.000Z" });
    assert.equal(third.action, "SPEC_COMMITTED");
    assert.equal(existsSync(join(fixture.root, ".agent/package-uses")), false);
  });

  it("blocks a broadened candidate before creating a branch", () => {
    const fixture = repository("high");
    assert.throws(() => advancePackageTaskMaterialization({ candidatePath: fixture.candidate, root: fixture.root, now: () => "2026-08-14T12:00:00.000Z" }), /RISK_EXCEEDED/);
    assert.equal(git(["branch", "--show-current"], fixture.root), "main");
    assert.equal(git(["branch", "--list", "task-spec/*"], fixture.root), "");
  });
});

function repository(candidateRisk = "medium") {
  const root = mkdtempSync(join(tmpdir(), "package-task-root-"));
  const remote = mkdtempSync(join(tmpdir(), "package-task-remote-"));
  const store = mkdtempSync(join(tmpdir(), "package-task-store-"));
  const external = mkdtempSync(join(tmpdir(), "package-task-candidate-"));
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const publicKeyPem = publicKey.export({ type: "spki", format: "pem" }).toString();
  git(["init", "--bare", remote], root);
  git(["init", "-b", "main"], root);
  git(["config", "user.email", "test@example.com"], root); git(["config", "user.name", "Test"], root);
  git(["remote", "add", "origin", remote], root);
  mkdirSync(join(root, "specs/tasks"), { recursive: true });
  mkdirSync(join(root, "tooling/agent-harness/policies"), { recursive: true });
  writeFileSync(join(root, ".gitignore"), ".agent/\n");
  writeFileSync(join(root, "specs/tasks/TASK-037.md"), taskSource("TASK-037", "completed", "medium", "", ""));
  const policy = { schema_version: 1, policy_version: "1.0.0", mode: "SOLO_DURABLE", repository: remote,
    max_age_seconds: 604800, receipt_directory_env: "SYSTEM_BUILDER_HUMAN_APPROVAL_DIR",
    authorized_approvers: [{ approver_identity: "owner", key_id: "owner-key", public_key_pem: publicKeyPem }] };
  writeFileSync(join(root, "tooling/agent-harness/policies/HUMAN_APPROVAL.json"), JSON.stringify(policy));
  git(["add", "."], root); git(["commit", "-m", "baseline"], root); git(["push", "-u", "origin", "main"], root);
  const baseline = git(["rev-parse", "HEAD"], root);
  const descriptors = Array.from({ length: 20 }, (_, index) => ({
    descriptor_id: `PWD-${String(index + 1).padStart(3, "0")}`, work_package_id: "WP-I2-06", milestone: "I2",
    objective_id: `objective-${index + 1}`, output_ids: [`output-${index + 1}`], predecessor_ids: ["TASK-037"], governance_classes: ["ROUTINE"],
    allowed_paths: ["docs/out.md"], forbidden_paths: ["apps/**"], max_risk: "medium", max_files: 2, max_attempts: 3,
    executor_preferences: ["opencode"], model_tiers: ["free"], validation_commands: ["npm run verify"], required_checks: ["validate"],
    dor_ids: ["DOR-READY"], dod_ids: ["DOD-DONE"],
  }));
  const plan = { schema_version: 1, package_id: "PKG-I2-001", package_version: "1.0.0", repository: remote,
    approver_identity: "owner", key_id: "owner-key", baseline_commit: baseline, base_ref: "main",
    valid_from: "2026-08-13T00:00:00.000Z", expires_at: "2026-08-20T00:00:00.000Z", execution_focus: ["I2"],
    risk_ceiling: "medium", protected_paths: [], forbidden_paths: ["apps/**"], allowed_executors: ["opencode"], allowed_model_tiers: ["free"],
    total_action_budget: 40, total_attempt_budget: 60, total_task_budget: 20, max_consecutive_failures: 3,
    required_validation_commands: ["npm run verify"], required_checks: ["validate"], closure_policy_id: "CLOSE-V1", evidence_policy_id: "EVIDENCE-V1",
    revocation_policy_id: "REVOCATION-V1", exception_classes: ["ARCHITECTURE", "CONTRACT", "SECURITY", "EVALUATOR", "DATA", "RELEASE", "WAIVER"],
    descriptors, governance_policy_version: "1.0.0",
  } as PackageAuthorizationPlan;
  const planHash = packagePlanHash(plan);
  const semantic = { schema_version: 1 as const, authority_type: "PACKAGE_OWNER" as const, approver_identity: "owner", key_id: "owner-key",
    repository: remote, package_id: plan.package_id, package_version: plan.package_version, plan_hash: planHash, decision: "APPROVED" as const,
    rationale: "bounded test package", approved_at: "2026-08-14T10:00:00.000Z", governance_policy_version: "1.0.0" };
  const directory = join(store, "packages", plan.package_id, planHash); mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "plan.json"), JSON.stringify(plan));
  writeFileSync(join(directory, "approval.json"), JSON.stringify({ ...semantic, approval_id: packageApprovalId(semantic),
    signature: sign(null, Buffer.from(packageAuthorizationSigningPayload(semantic)), privateKey).toString("base64") }));
  const candidate = join(external, "TASK-100-PACKAGE-FIXTURE.md");
  const binding = `package_authorization:\n  package_id: ${plan.package_id}\n  package_version: ${plan.package_version}\n  plan_hash: ${planHash}\n  descriptor_id: PWD-001\n  objective_id: objective-1\n  output_ids: [output-1]\n  governance_classes: [ROUTINE]\n  dor_ids: [DOR-READY]\n  dod_ids: [DOD-DONE]`;
  writeFileSync(candidate, taskSource("TASK-100", "ready", candidateRisk, "  - TASK-037", binding));
  process.env.SYSTEM_BUILDER_HUMAN_APPROVAL_DIR = store;
  return { root, candidate };
}

function taskSource(id: string, status: string, risk: string, dependencies: string, binding: string) {
  return `---\nid: ${id}\ntitle: Package fixture\nstatus: ${status}\npriority: 1\nmilestone: I2\nmodel_tier: free\nrisk: ${risk}\narchitecture_impact: false\nexecutor_preference: opencode\ndepends_on:\n${dependencies || "  []"}\ncontext_paths: [AGENTS.md]\nallowed_paths: [docs/out.md]\nforbidden_paths: [apps/**]\nmax_files: 2\nvalidation: [npm run verify]\n${binding}\n---\n# ${id}\n\n## Objective\n\nFixture.\n\n## Context\n\nFixture.\n\n## Current behavior\n\nFixture.\n\n## Required change\n\nFixture.\n\n## Inputs / contracts\n\nFixture.\n\n## Outputs / contracts\n\nFixture.\n\n## Acceptance criteria\n\nFixture.\n\n## Non-goals\n\nFixture.\n\n## Evidence expected\n\nFixture.\n\n## Escalation\n\nFixture.\n`;
}

function git(args: string[], cwd: string): string { return execFileSync("git", args, { cwd, encoding: "utf8" }).trim(); }

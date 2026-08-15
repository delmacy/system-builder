import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { authorityClosureManifestSchema, type AuthorityClosureManifest } from "./authority-closure.js";
import {
  agentFactoryAttemptEvidenceEnvelopeSchema,
  agentFactoryEvidenceEnvelopeSchema,
  governanceResolutionSchema,
} from "./evidence-writer.js";
import { ledgerApplicationReceiptSchema } from "./ledger-engine.js";
import { readinessRecomputationReceiptSchema } from "./readiness-recompute.js";

const sha40 = z.string().regex(/^[0-9a-f]{40}$/);
const sha64 = z.string().regex(/^[0-9a-f]{64}$/);

export const freshI2AuthorityExpectationSchema = z.object({
  schema_version: z.literal(1),
  task_id: z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/),
  work_package_id: z.string().regex(/^WP-[A-Z0-9-]+$/),
  source_commit: sha40,
  implementation_head: sha40,
  implementation_pr: z.object({
    pr_number: z.number().int().positive(),
    branch: z.string().min(1),
    head_commit: sha40,
    decision: z.literal("ELIGIBLE"),
  }).strict(),
  state_branch: z.string().min(1),
  state_pr: z.object({
    pr_number: z.number().int().positive(),
    branch: z.string().min(1),
    head_commit: sha40,
    merge_commit: sha40,
    decision: z.literal("ELIGIBLE"),
  }).strict(),
  final_evidence_id: z.string().regex(/^AFEV-[0-9a-f]{64}$/),
  bundle_id: z.string().regex(/^AFCLOSE-[0-9a-f]{64}$/),
}).strict();

export type FreshI2AuthorityExpectation = z.infer<typeof freshI2AuthorityExpectationSchema>;

export const task040FreshAuthorities: FreshI2AuthorityExpectation = freshI2AuthorityExpectationSchema.parse({
  schema_version: 1,
  task_id: "TASK-040",
  work_package_id: "WP-I2-06",
  source_commit: "8fd6f7f019c6e1c063e9f734baf9c04fa9c54818",
  implementation_head: "97c2c8fd53b010078e46494a13b6c3f39647e48e",
  implementation_pr: {
    pr_number: 115,
    branch: "task/040-prove-prospective-authority-closure-regressions",
    head_commit: "97c2c8fd53b010078e46494a13b6c3f39647e48e",
    decision: "ELIGIBLE",
  },
  state_branch: "state/task-040-close",
  state_pr: {
    pr_number: 116,
    branch: "state/task-040-close",
    head_commit: "c3fc3da6d3c2622eccf0a27c8df9a94bde7d40c3",
    merge_commit: "8402647e235b65065176dfd61e37bea1c3bb356c",
    decision: "ELIGIBLE",
  },
  final_evidence_id: "AFEV-61371a1d2ff4b8b6849231d3d911fd4eb47d4fa9b95655b7567bb16413273abb",
  bundle_id: "AFCLOSE-2f4d08641b2aa6951fd12132349dfae21a35300586d04198cc8f2b894edec623",
});

export const i2AuthorityProofCheckSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["PASS", "FAIL", "SKIPPED"]),
  detail: z.string().nullable(),
}).strict();

export const i2AuthorityProofReceiptSchema = z.object({
  schema_version: z.literal(1),
  proof_id: z.string().regex(/^I2PROOF-[0-9a-f]{64}$/),
  content_sha256: sha64,
  decision: z.enum(["GO", "NO-GO"]),
  task_id: z.string().regex(/^TASK-[0-9]{3}(?:-[A-Z0-9-]+)?$/),
  work_package_id: z.string().regex(/^WP-[A-Z0-9-]+$/),
  source_commit: sha40,
  implementation_head: sha40,
  final_evidence_id: z.string().regex(/^AFEV-[0-9a-f]{64}$/),
  bundle_id: z.string().regex(/^AFCLOSE-[0-9a-f]{64}$/),
  selected_task_id: z.null(),
  checks: z.array(i2AuthorityProofCheckSchema),
  facts: z.object({
    lifecycle: z.object({
      approval_channel: z.string().nullable(),
      validation: z.string().nullable(),
      checks_status: z.array(z.string()),
      human_approval: z.string().nullable(),
    }).strict(),
    causal_ledger: z.object({
      accepted: z.boolean(),
      task_id: z.string(),
      state: z.string(),
      reason_code: z.string(),
      evidence_receipt_id: z.string(),
    }).strict(),
    attempted_history: z.object({
      attempt_receipt_id: z.string(),
      attempt_status: z.string(),
      failure_category: z.string().nullable(),
    }).strict(),
    readiness: z.object({
      previous_ready: z.array(z.string()),
      current_ready: z.array(z.string()),
      newly_ready: z.array(z.string()),
      changed_nodes: z.array(z.string()),
    }).strict(),
    governance: z.object({
      resolution_id: z.string().nullable(),
      decision: z.string().nullable(),
    }).strict(),
    bootstrap: z.object({
      completed: z.array(z.string()),
      ready: z.array(z.string()),
    }).strict(),
  }).strict(),
}).strict();

export type I2AuthorityProofReceipt = z.infer<typeof i2AuthorityProofReceiptSchema>;

export type I2AuthorityProofOptions = {
  root?: string;
  expected?: FreshI2AuthorityExpectation;
};

const checkIds = [
  "FILE_HASHES",
  "MANIFEST_BUNDLE_ID",
  "MANIFEST_IDENTITY",
  "IMPLEMENTATION_LIFECYCLE",
  "FINAL_EVIDENCE",
  "ATTEMPT_HISTORY",
  "CAUSAL_LEDGER",
  "READINESS",
  "GOVERNANCE_RESOLUTION",
  "BOOTSTRAP_RECONCILIATION",
  "STATE_PR_BINDING",
  "IMPLEMENTATION_PR_BINDING",
] as const;

type FailedCheck = { id: string; status: "FAIL"; detail: string };

export function proveFreshI2AuthorityReconciliation(options: I2AuthorityProofOptions = {}): I2AuthorityProofReceipt {
  const root = resolve(options.root ?? process.cwd());
  const expected = freshI2AuthorityExpectationSchema.parse(options.expected ?? task040FreshAuthorities);
  const failures: FailedCheck[] = [];

  const manifestPath = `docs/evidence/agentfactory/${expected.task_id}/manifest.json`;
  const readManifest = (): AuthorityClosureManifest | undefined => {
    const value = readJson(root, manifestPath);
    const parsed = authorityClosureManifestSchema.safeParse(value);
    return parsed.success ? parsed.data : undefined;
  };
  const manifest = readManifest();
  if (!manifest) {
    for (const id of ["FILE_HASHES", "MANIFEST_BUNDLE_ID", "MANIFEST_IDENTITY", "IMPLEMENTATION_LIFECYCLE", "FINAL_EVIDENCE", "ATTEMPT_HISTORY", "CAUSAL_LEDGER", "READINESS", "GOVERNANCE_RESOLUTION"]) {
      failures.push({ id, status: "FAIL", detail: "manifest is missing or does not match the schema" });
    }
  } else {
    verifyManifest(root, expected, manifest, failures);
  }

  const taskEvidence = readJson(root, `docs/evidence/tasks/${expected.task_id}.json`);
  const taskRecord = taskEvidence ? parseTaskEvidence(taskEvidence) : undefined;
  if (!taskRecord) {
    failures.push({ id: "MANIFEST_IDENTITY", status: "FAIL", detail: "integrated task evidence is missing or malformed" });
  } else {
    verifyTaskIdentity(expected, taskRecord, failures);
  }

  verifyBootstrap(expected, root, failures);
  verifyStatePrBinding(expected, root, failures);
  verifyImplementationPrBinding(expected, root, failures);

  const decision = failures.length === 0 ? "GO" : "NO-GO";
  const checks = checkIds.map((id): { id: string; status: "PASS"; detail: string | null } | FailedCheck => {
    const failed = failures.find((item) => item.id === id);
    return failed ?? { id, status: "PASS", detail: null };
  });

  const semantic = {
    schema_version: 1 as const,
    decision,
    task_id: expected.task_id,
    work_package_id: expected.work_package_id,
    source_commit: expected.source_commit,
    implementation_head: expected.implementation_head,
    final_evidence_id: expected.final_evidence_id,
    bundle_id: expected.bundle_id,
    selected_task_id: null,
    checks,
    facts: {
      lifecycle: lifecycleFacts(root, manifestPath, manifest),
      causal_ledger: causalLedgerFacts(root, manifestPath, manifest),
      attempted_history: attemptHistoryFacts(root, manifestPath, manifest),
      readiness: readinessFacts(root, manifestPath, manifest),
      governance: governanceFacts(root, manifestPath, manifest),
      bootstrap: bootstrapFacts(root),
    },
  };
  const contentHash = digest(stableJson(semantic));
  return i2AuthorityProofReceiptSchema.parse({
    ...semantic,
    proof_id: `I2PROOF-${contentHash}`,
    content_sha256: contentHash,
  });
}

function verifyManifest(root: string, expected: FreshI2AuthorityExpectation, manifest: AuthorityClosureManifest, failures: FailedCheck[]): void {
  const hashDivergence = manifest.files.map((file) => {
    const path = resolve(root, file.path);
    if (!existsSync(path)) return `${file.path}: missing`;
    const value = readJson(root, file.path);
    if (value === undefined) return `${file.path}: malformed or unreadable JSON`;
    const observed = digest(serialized(value));
    return observed === file.sha256 ? null : `${file.path}: expected ${file.sha256}, observed ${observed}`;
  }).filter((item): item is string => Boolean(item));
  if (hashDivergence.length > 0) {
    failures.push({ id: "FILE_HASHES", status: "FAIL", detail: hashDivergence.join("; ") });
  }

  if (expected.bundle_id !== manifest.bundle_id
    || !manifest.bundle_id.endsWith(digest(stableJson(bundleSemantic(manifest))))) {
    failures.push({ id: "MANIFEST_BUNDLE_ID", status: "FAIL", detail: "recorded bundle id does not recompute from the manifest semantic" });
  }

  const identityMismatches = [
    ["task_id", expected.task_id, manifest.task_id],
    ["work_package_id", expected.work_package_id, manifest.work_package_id],
    ["source_commit", expected.source_commit, manifest.source_commit],
    ["implementation_head", expected.implementation_head, manifest.implementation_head],
    ["state_branch", expected.state_branch, manifest.state_branch],
    ["final_evidence_id", expected.final_evidence_id, manifest.final_evidence_id],
    ["implementation_pr_number", String(expected.implementation_pr.pr_number), String(manifest.implementation_pr.pr_number)],
    ["implementation_pr_head", expected.implementation_pr.head_commit, manifest.implementation_pr.head_commit],
    ["implementation_pr_decision", "ELIGIBLE", manifest.implementation_pr.decision],
  ].filter(([, left, right]) => left !== right);
  if (identityMismatches.length > 0) {
    failures.push({ id: "MANIFEST_IDENTITY", status: "FAIL", detail: identityMismatches.map(([label, left, right]) => `${label}: expected ${left}, observed ${right}`).join("; ") });
  }

  const receipt = manifest.implementation_pr;
  const lifecycleMismatches: string[] = [];
  if (receipt.decision !== "ELIGIBLE") lifecycleMismatches.push(`decision ${receipt.decision}`);
  if (receipt.required_checks.some((name) => !receipt.checks.some((check) => check.name === name && check.status === "SUCCESS"))) {
    lifecycleMismatches.push("a required check did not succeed");
  }
  if (!["DURABLE_HUMAN_APPROVAL", "GITHUB_REVIEW", "PACKAGE_AUTHORIZATION"].includes(receipt.approval_channel)) {
    lifecycleMismatches.push(`approval channel ${receipt.approval_channel}`);
  }
  if (receipt.approval_channel === "DURABLE_HUMAN_APPROVAL" && (!receipt.human_approval || receipt.human_approval.decision !== "VALID")) {
    lifecycleMismatches.push("durable human approval is not valid");
  }
  if (lifecycleMismatches.length > 0) {
    failures.push({ id: "IMPLEMENTATION_LIFECYCLE", status: "FAIL", detail: lifecycleMismatches.join("; ") });
  }

  const evidenceHash = expected.final_evidence_id.slice("AFEV-".length);
  const evidenceFile = manifest.files.find((file) => file.path.endsWith(`${evidenceHash}.json`));
  if (!evidenceFile) {
    failures.push({ id: "FINAL_EVIDENCE", status: "FAIL", detail: "manifest does not list the final evidence file" });
  } else {
    const envelope = readJson(root, evidenceFile.path);
    const parsed = agentFactoryEvidenceEnvelopeSchema.safeParse(envelope);
    if (!parsed.success) {
      failures.push({ id: "FINAL_EVIDENCE", status: "FAIL", detail: "final evidence envelope fails the schema" });
    } else {
      const evidence = parsed.data;
      const evidenceMismatches: string[] = [];
      if (evidence.receipt_id !== expected.final_evidence_id) evidenceMismatches.push("receipt id");
      if (!evidence.content_sha256.endsWith(evidenceHash)) evidenceMismatches.push("content hash");
      if (evidence.head_commit !== expected.implementation_head) evidenceMismatches.push("head commit");
      if (evidence.result.task_id !== expected.task_id || evidence.result.status !== "DONE") evidenceMismatches.push("result identity");
      if (evidence.result.work_package_id !== expected.work_package_id) evidenceMismatches.push("work package");
      if (evidenceMismatches.length > 0) {
        failures.push({ id: "FINAL_EVIDENCE", status: "FAIL", detail: `final evidence diverges on ${evidenceMismatches.join(", ")}` });
      }
    }
  }

  const attemptFiles = manifest.files.filter((file) => /attempt-\d+-[0-9a-f]{64}\.json$/.test(file.path));
  const historyProbs: string[] = [];
  for (const file of attemptFiles) {
    const value = readJson(root, file.path);
    const evidence = agentFactoryEvidenceEnvelopeSchema.safeParse(value);
    const attempt = agentFactoryAttemptEvidenceEnvelopeSchema.safeParse(value);
    if (!evidence.success && !attempt.success) {
      historyProbs.push(`${file.path}: matches neither evidence schema`);
      continue;
    }
    if (attempt.success && attempt.data.result.status === "DONE") {
      historyProbs.push(`${file.path}: a DONE attempt must be the final evidence`);
    }
  }
  if (historyProbs.length > 0) {
    failures.push({ id: "ATTEMPT_HISTORY", status: "FAIL", detail: historyProbs.join("; ") });
  }

  const ledgerFile = manifest.files.find((file) => file.path.endsWith("ledger.json"));
  const ledgerParsed = ledgerFile ? ledgerApplicationReceiptSchema.safeParse(readJson(root, ledgerFile.path)) : undefined;
  if (!ledgerParsed?.success) {
    failures.push({ id: "CAUSAL_LEDGER", status: "FAIL", detail: "ledger is missing or fails the schema" });
  } else {
    const ledger = ledgerParsed.data;
    const ledgerProblems: string[] = [];
    if (!ledger.accepted) ledgerProblems.push(`not accepted: ${ledger.reason_codes.join(",")}`);
    if (ledger.authoritative_task.task_id !== expected.task_id || ledger.authoritative_task.state !== "DONE") ledgerProblems.push("task is not the expected DONE task");
    const final = ledger.attempts.at(-1);
    if (!final || final.status !== "ACCEPTED" || final.evidence_receipt_id !== expected.final_evidence_id) ledgerProblems.push("final attempt is not accepted against the final evidence");
    if (ledger.transition && ledger.transition.reason_code !== "INTEGRATION_ACCEPTED") ledgerProblems.push(`reason ${ledger.transition.reason_code}`);
    if (ledgerProblems.length > 0) {
      failures.push({ id: "CAUSAL_LEDGER", status: "FAIL", detail: ledgerProblems.join("; ") });
    }
  }

  const readinessFile = manifest.files.find((file) => file.path.endsWith("readiness.json"));
  const readinessParsed = readinessFile ? readinessRecomputationReceiptSchema.safeParse(readJson(root, readinessFile.path)) : undefined;
  if (!readinessParsed?.success) {
    failures.push({ id: "READINESS", status: "FAIL", detail: "readiness receipt is missing or fails the schema" });
  } else {
    const readiness = readinessParsed.data;
    const readinessProblems: string[] = [];
    const node = readiness.graph.nodes.find((candidate) => candidate.id === expected.task_id);
    if (!node || node.state !== "DONE") readinessProblems.push("TASK-040 DAG node is not DONE");
    if (!readiness.previous_ready.includes(expected.task_id) || readiness.current_ready.includes(expected.task_id)) readinessProblems.push("TASK-040 must leave the ready set on closure");
    if (!readiness.changed_nodes.includes(expected.task_id)) readinessProblems.push("changed_nodes must record TASK-040");
    if (JSON.stringify(readiness.evaluation.ready) !== JSON.stringify(readiness.current_ready)) readinessProblems.push("evaluation and receipt ready sets diverge");
    const nodeEvaluation = readiness.evaluation.nodes.find((candidate) => candidate.id === expected.task_id);
    if (!nodeEvaluation || nodeEvaluation.readiness !== "TERMINAL") readinessProblems.push("TASK-040 readiness must be TERMINAL");
    if (readinessProblems.length > 0) {
      failures.push({ id: "READINESS", status: "FAIL", detail: readinessProblems.join("; ") });
    }
  }

  const resolutionFile = manifest.files.find((file) => file.path.endsWith("governance-resolution.json"));
  if (!resolutionFile) {
    failures.push({ id: "GOVERNANCE_RESOLUTION", status: "FAIL", detail: "manifest does not record a governance resolution" });
  } else {
    const parsed = governanceResolutionSchema.safeParse(readJson(root, resolutionFile.path));
    if (!parsed.success) {
      failures.push({ id: "GOVERNANCE_RESOLUTION", status: "FAIL", detail: "governance resolution fails the schema" });
    } else {
      const resolution = parsed.data;
      const resolutionProblems: string[] = [];
      if (resolution.decision !== "RESOLVED") resolutionProblems.push(`decision ${resolution.decision}`);
      if (resolution.implementation_lifecycle.head_commit !== expected.implementation_head || resolution.implementation_lifecycle.decision !== "ELIGIBLE") {
        resolutionProblems.push("lifecycle diverges from the implementation head");
      }
      const { resolution_id: recordedId, ...semanticBody } = resolution;
      if (recordedId !== `AFGOV-${digest(stableJson(semanticBody))}` || resolution.validation_sha256 !== digest(stableJson(resolution.original_validation))) {
        resolutionProblems.push("id or validation hash does not recompute");
      }
      if (resolutionProblems.length > 0) {
        failures.push({ id: "GOVERNANCE_RESOLUTION", status: "FAIL", detail: resolutionProblems.join("; ") });
      }
    }
  }
}

function verifyTaskIdentity(expected: FreshI2AuthorityExpectation, record: { taskId: string; branch: string; commit: string; prNumber: number }, failures: FailedCheck[]): void {
  const mismatches = [
    ["task_id", expected.task_id, record.taskId],
    ["git_branch", expected.implementation_pr.branch, record.branch],
    ["git_commit", expected.implementation_head, record.commit],
    ["pr_number", String(expected.implementation_pr.pr_number), String(record.prNumber)],
  ].filter(([, left, right]) => left !== right);
  if (mismatches.length > 0) {
    failures.push({ id: "MANIFEST_IDENTITY", status: "FAIL", detail: mismatches.map(([label, left, right]) => `${label}: expected ${left}, observed ${right}`).join("; ") });
  }
}

function verifyBootstrap(expected: FreshI2AuthorityExpectation, root: string, failures: FailedCheck[]): void {
  const ledger = readJson(root, "docs/current/TASK_LEDGER.json") as Record<string, unknown> | undefined;
  const completed = stringArray(ledger?.completed);
  const ready = stringArray(ledger?.ready);
  const problems: string[] = [];
  if (!completed.includes(expected.task_id)) problems.push(`${expected.task_id} is not completed in the bootstrap ledger`);
  if (ready.includes(expected.task_id)) problems.push(`${expected.task_id} must not remain ready after closure`);
  if (problems.length > 0) failures.push({ id: "BOOTSTRAP_RECONCILIATION", status: "FAIL", detail: problems.join("; ") });
}

function verifyStatePrBinding(expected: FreshI2AuthorityExpectation, root: string, failures: FailedCheck[]): void {
  const merge = expected.state_pr.merge_commit;
  const parents = gitOptional(root, ["show", "-s", "--format=%P", merge]);
  if (!parents) {
    failures.push({ id: "STATE_PR_BINDING", status: "FAIL", detail: `state closure merge commit ${merge} is not present` });
    return;
  }
  if (!parents.split(/\s+/).includes(expected.state_pr.head_commit)) {
    failures.push({ id: "STATE_PR_BINDING", status: "FAIL", detail: "state branch head is not a parent of the state closure merge" });
    return;
  }
  if (!gitExitZero(root, ["merge-base", "--is-ancestor", merge, "HEAD"])) {
    failures.push({ id: "STATE_PR_BINDING", status: "FAIL", detail: "state closure merge is not an ancestor of HEAD" });
  }
}

function verifyImplementationPrBinding(expected: FreshI2AuthorityExpectation, root: string, failures: FailedCheck[]): void {
  if (!gitExitZero(root, ["cat-file", "-e", `${expected.implementation_head}^{commit}`])) {
    failures.push({ id: "IMPLEMENTATION_PR_BINDING", status: "FAIL", detail: `implementation head commit ${expected.implementation_head} is not present` });
  }
}

function parseTaskEvidence(value: unknown): { taskId: string; branch: string; commit: string; prNumber: number } | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const record = value as Record<string, unknown>;
  const git = record.git as Record<string, unknown> | undefined;
  const pr = git?.pullRequest as Record<string, unknown> | undefined;
  if (typeof record.taskId !== "string" || !git || typeof git.branch !== "string" || typeof git.commit !== "string" || !pr || typeof pr.number !== "number") {
    return undefined;
  }
  return { taskId: record.taskId, branch: git.branch, commit: git.commit, prNumber: pr.number };
}

function lifecycleFacts(root: string, manifestPath: string, manifest: AuthorityClosureManifest | undefined) {
  if (!manifest) return { approval_channel: null, validation: null, checks_status: [] as string[], human_approval: null };
  const receipt = manifest.implementation_pr;
  return {
    approval_channel: receipt.approval_channel,
    validation: receipt.validation,
    checks_status: receipt.checks.map((check) => `${check.name}:${check.status}`),
    human_approval: receipt.human_approval ? `${receipt.human_approval.decision}:${receipt.human_approval.approval_id}` : null,
  };
}

function causalLedgerFacts(root: string, manifestPath: string, manifest: AuthorityClosureManifest | undefined) {
  if (!manifest) return { accepted: false, task_id: "", state: "", reason_code: "", evidence_receipt_id: "" };
  const path = manifest.files.find((file) => file.path.endsWith("ledger.json"));
  const parsed = path ? ledgerApplicationReceiptSchema.safeParse(readJson(root, path.path)) : undefined;
  if (!parsed?.success) return { accepted: false, task_id: "", state: "", reason_code: "", evidence_receipt_id: "" };
  return {
    accepted: parsed.data.accepted,
    task_id: parsed.data.authoritative_task.task_id,
    state: parsed.data.authoritative_task.state,
    reason_code: parsed.data.transition?.reason_code ?? "",
    evidence_receipt_id: parsed.data.attempts.at(-1)?.evidence_receipt_id ?? "",
  };
}

function attemptHistoryFacts(root: string, manifestPath: string, manifest: AuthorityClosureManifest | undefined) {
  if (!manifest) return { attempt_receipt_id: "", attempt_status: "", failure_category: null };
  const attemptFile = manifest.files.find((file) => /attempt-\d+-[0-9a-f]{64}\.json$/.test(file.path) && !file.path.endsWith(manifest.final_evidence_id.slice("AFEV-".length) + ".json"));
  const parsed = attemptFile ? agentFactoryAttemptEvidenceEnvelopeSchema.safeParse(readJson(root, attemptFile.path)) : undefined;
  if (!parsed?.success) return { attempt_receipt_id: "", attempt_status: "", failure_category: null };
  return {
    attempt_receipt_id: parsed.data.receipt_id,
    attempt_status: parsed.data.result.status,
    failure_category: parsed.data.failure_category,
  };
}

function readinessFacts(root: string, manifestPath: string, manifest: AuthorityClosureManifest | undefined) {
  if (!manifest) return { previous_ready: [], current_ready: [], newly_ready: [], changed_nodes: [] };
  const path = manifest.files.find((file) => file.path.endsWith("readiness.json"));
  const parsed = path ? readinessRecomputationReceiptSchema.safeParse(readJson(root, path.path)) : undefined;
  if (!parsed?.success) return { previous_ready: [], current_ready: [], newly_ready: [], changed_nodes: [] };
  return {
    previous_ready: parsed.data.previous_ready,
    current_ready: parsed.data.current_ready,
    newly_ready: parsed.data.newly_ready,
    changed_nodes: parsed.data.changed_nodes,
  };
}

function governanceFacts(root: string, manifestPath: string, manifest: AuthorityClosureManifest | undefined) {
  if (!manifest) return { resolution_id: null, decision: null };
  const path = manifest.files.find((file) => file.path.endsWith("governance-resolution.json"));
  const parsed = path ? governanceResolutionSchema.safeParse(readJson(root, path.path)) : undefined;
  return parsed?.success ? { resolution_id: parsed.data.resolution_id, decision: parsed.data.decision } : { resolution_id: null, decision: null };
}

function bootstrapFacts(root: string) {
  const ledger = readJson(root, "docs/current/TASK_LEDGER.json") as Record<string, unknown> | undefined;
  return {
    completed: stringArray(ledger?.completed),
    ready: stringArray(ledger?.ready),
  };
}

function bundleSemantic(manifest: AuthorityClosureManifest) {
  return {
    schema_version: 1,
    task_id: manifest.task_id,
    work_package_id: manifest.work_package_id,
    source_commit: manifest.source_commit,
    implementation_head: manifest.implementation_head,
    implementation_pr: manifest.implementation_pr,
    state_branch: manifest.state_branch,
    final_evidence_id: manifest.final_evidence_id,
    files: manifest.files,
  };
}

function readJson(root: string, path: string): unknown {
  const absolute = resolve(root, path);
  if (!existsSync(absolute)) return undefined;
  try {
    return JSON.parse(readFileSync(absolute, "utf8"));
  } catch {
    return undefined;
  }
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function gitOptional(root: string, args: string[]): string {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8", shell: false }).trim();
  } catch {
    return "";
  }
}

function gitExitZero(root: string, args: string[]): boolean {
  try {
    execFileSync("git", args, { cwd: root, encoding: "utf8", shell: false, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function stableJson(value: unknown): string { return JSON.stringify(value, null, 2); }
function serialized(value: unknown): string { return `${stableJson(value)}\n`; }
function digest(value: string | Buffer): string { return createHash("sha256").update(value).digest("hex"); }
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { z } from "zod";
import { executionResultSchema, type ExecutionResult } from "./execution-contracts.js";
import type { ExecutionBoundaryCompletion } from "./execution-harness.js";
import { validationGateReceiptSchema, type ValidationGateReceipt } from "./validation-engine.js";

const acceptanceSchema = z.object({ id: z.string().regex(/^AC-[A-Z0-9-]+$/), status: z.literal("PASS"), evidence: z.string().min(1) }).strict();
const metricsSchema = z.object({
  attempts: z.number().int().positive(),
  execution_duration_seconds: z.number().nonnegative().nullable(),
  review_duration_seconds: z.number().nonnegative().nullable(),
  token_or_provider_cost: z.number().nonnegative().nullable(),
}).strict();

export const agentFactoryEvidenceEnvelopeSchema = z.object({
  schema_version: z.literal(1),
  receipt_id: z.string().regex(/^AFEV-[0-9a-f]{64}$/),
  content_sha256: z.string().regex(/^[0-9a-f]{64}$/),
  head_commit: z.string().regex(/^[0-9a-f]{40}$/),
  change_fingerprint: z.string().regex(/^[0-9a-f]{64}$/),
  validation: validationGateReceiptSchema,
  result: executionResultSchema,
}).strict();

export type AgentFactoryEvidenceEnvelope = z.infer<typeof agentFactoryEvidenceEnvelopeSchema>;
export type EvidenceWriterInput = {
  completion: ExecutionBoundaryCompletion;
  validation: ValidationGateReceipt;
  headCommit: string;
  changeFingerprint: string;
  acceptance: Array<z.infer<typeof acceptanceSchema>>;
  satisfiedGates: string[];
  blockedGates: string[];
  contractsChanged?: string[];
  migrationsChanged?: string[];
  risksDiscovered?: string[];
  issuesDiscovered?: string[];
  changeRequests?: string[];
  followUpCandidates?: string[];
  dagEffects?: string[];
  metrics: z.infer<typeof metricsSchema>;
  notes?: string;
};

export function buildAgentFactoryEvidence(input: EvidenceWriterInput): AgentFactoryEvidenceEnvelope {
  const validation = validationGateReceiptSchema.parse(input.validation);
  const acceptance = z.array(acceptanceSchema).min(1).parse(input.acceptance);
  const metrics = metricsSchema.parse(input.metrics);
  const { boundary, report, changedFiles, violations } = input.completion;
  const request = report.request ?? input.completion.rawReport.request;
  if (!request || report.status !== "completed" || report.result?.status !== "SUCCEEDED" || violations.length > 0) {
    throw new Error("EVIDENCE_EXECUTION_NOT_ACCEPTED: accepted structured execution is required");
  }
  if (validation.decision === "FAIL" || validation.commands.some((command) => command.status !== "PASS")) {
    throw new Error("EVIDENCE_VALIDATION_NOT_ACCEPTED: independent validation must not fail");
  }
  if (request.task_id !== boundary.taskId || request.work_package_id !== boundary.workPackageId
    || request.source_commit !== boundary.sourceCommit || request.attempt !== boundary.attempt
    || validation.task_id !== boundary.taskId || validation.work_package_id !== boundary.workPackageId
    || validation.source_commit !== boundary.sourceCommit
    || JSON.stringify(validation.changed_files) !== JSON.stringify(changedFiles)) {
    throw new Error("EVIDENCE_IDENTITY_MISMATCH: execution and validation identities diverge");
  }
  if (!/^[0-9a-f]{40}$/.test(input.headCommit) || !/^[0-9a-f]{64}$/.test(input.changeFingerprint)) {
    throw new Error("EVIDENCE_GIT_IDENTITY_INVALID: head commit and fingerprint are required");
  }
  const result: ExecutionResult = executionResultSchema.parse({
    schema_version: 1,
    task_id: boundary.taskId,
    work_package_id: boundary.workPackageId,
    source_commit: boundary.sourceCommit,
    executor: { adapter: request.route.executor, model: request.route.model },
    status: validation.decision === "PASS" ? "DONE" : "NEEDS_DECISION",
    changed_files: changedFiles,
    tests: validation.commands.map((command) => ({
      command: command.command,
      status: command.status,
      evidence: evidenceFor(command),
    })),
    acceptance,
    contracts_changed: input.contractsChanged ?? [],
    migrations_changed: input.migrationsChanged ?? [],
    risks_discovered: input.risksDiscovered ?? [],
    issues_discovered: input.issuesDiscovered ?? [],
    change_requests: input.changeRequests ?? [],
    follow_up_candidates: input.followUpCandidates ?? [],
    dependency_gates_satisfied: input.satisfiedGates,
    dependency_gates_blocked: input.blockedGates,
    dag_effects: input.dagEffects ?? [],
    metrics,
    notes: input.notes ?? "",
  });
  const semantic = {
    schema_version: 1 as const,
    head_commit: input.headCommit,
    change_fingerprint: input.changeFingerprint,
    validation,
    result,
  };
  const contentHash = hash(stableJson(semantic));
  return agentFactoryEvidenceEnvelopeSchema.parse({
    ...semantic,
    receipt_id: `AFEV-${contentHash}`,
    content_sha256: contentHash,
  });
}

export function writeAgentFactoryEvidence(envelope: AgentFactoryEvidenceEnvelope, root = process.cwd()): string {
  const receipt = agentFactoryEvidenceEnvelopeSchema.parse(envelope);
  const path = resolve(root, "docs/evidence/agentfactory", receipt.result.task_id, `attempt-${receipt.result.metrics.attempts}-${receipt.content_sha256}.json`);
  const content = `${stableJson(receipt)}\n`;
  if (existsSync(path)) {
    if (readFileSync(path, "utf8") !== content) throw new Error(`EVIDENCE_OVERWRITE_REFUSED: ${path}`);
    return path;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, { flag: "wx" });
  return path;
}

function evidenceFor(command: ValidationGateReceipt["commands"][number]): string {
  const detail = [command.stdout, command.stderr].filter(Boolean).join("\n").slice(0, 2_000);
  return detail || `exit_code=${command.exit_code}`;
}

function stableJson(value: unknown): string { return JSON.stringify(value, null, 2); }
function hash(value: string): string { return createHash("sha256").update(value).digest("hex"); }

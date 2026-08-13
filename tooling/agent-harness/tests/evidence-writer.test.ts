import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { executorAdapterResultSchema, executorRequestSchema } from "../src/execution-contracts.js";
import { buildAgentFactoryEvidence, writeAgentFactoryEvidence, type EvidenceWriterInput } from "../src/evidence-writer.js";
import type { ExecutionBoundaryCompletion } from "../src/execution-harness.js";
import type { ExecutorReport } from "../src/executor.js";
import { validationGateReceiptSchema } from "../src/validation-engine.js";

describe("AgentFactory evidence writer", () => {
  it("builds byte-identical TASK-012 evidence from identical semantic input", () => {
    const first = buildAgentFactoryEvidence(input());
    const second = buildAgentFactoryEvidence(input());
    assert.deepEqual(first, second);
    assert.equal(first.result.status, "DONE");
    assert.equal(first.receipt_id, `AFEV-${first.content_sha256}`);
  });

  it("rejects missing acceptance, failed validation and divergent identity", () => {
    assert.throws(() => buildAgentFactoryEvidence(input({ acceptance: [] })), /too_small/);
    assert.throws(() => buildAgentFactoryEvidence(input({ validation: validation({ decision: "FAIL", reason_codes: ["COMMAND_FAILED"] }) })), /VALIDATION_NOT_ACCEPTED/);
    assert.throws(() => buildAgentFactoryEvidence(input({ validation: validation({ task_id: "TASK-999" }) })), /IDENTITY_MISMATCH/);
  });

  it("preserves evaluator review as NEEDS_DECISION instead of DONE", () => {
    const evidence = buildAgentFactoryEvidence(input({
      validation: validation({ decision: "REVIEW_REQUIRED", reason_codes: ["EVALUATOR_CHANGED"], evaluator_changes: ["tests/a.test.ts"] }),
    }));
    assert.equal(evidence.result.status, "NEEDS_DECISION");
  });

  it("writes idempotently and refuses different content at an occupied receipt path", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-evidence-"));
    const evidence = buildAgentFactoryEvidence(input());
    const path = writeAgentFactoryEvidence(evidence, root);
    assert.equal(writeAgentFactoryEvidence(evidence, root), path);
    writeFileSync(path, "tampered\n");
    assert.throws(() => writeAgentFactoryEvidence(evidence, root), /OVERWRITE_REFUSED/);
    assert.equal(readFileSync(path, "utf8"), "tampered\n");
  });
});

const commit = "a".repeat(40);
const request = executorRequestSchema.parse({
  schema_version: 1, task_id: "TASK-100", work_package_id: "WP-I1-08", source_commit: commit, attempt: 1,
  task_pack_path: ".agent/TASK_PACK.md",
  route: { risk: "LOW", model_tier: "T1", executor: "opencode", model: "provider/model", architecture_impact: false, decision: "SELECTED", rationale_code: "BOUNDED_LOW_RISK" },
  scope: { allowed_paths: ["docs/**"], forbidden_paths: ["tooling/**"], max_files: 2 },
  validation_commands: ["npm run verify"],
});
const adapterResult = executorAdapterResultSchema.parse({ schema_version: 1, task_id: "TASK-100", attempt: 1, adapter: "opencode", status: "SUCCEEDED", exit_code: 0, stdout: "done", stderr: "", failure: null });
const report: ExecutorReport = { executor: "opencode", attempt: 1, status: "completed", summary: "done", result: adapterResult, request };
const completion: ExecutionBoundaryCompletion = {
  boundary: { version: 1, taskId: "TASK-100", workPackageId: "WP-I1-08", branch: "task/100", baseCommit: commit, headCommit: commit, sourceCommit: commit, taskPackPath: ".agent/TASK_PACK.md", taskPackHash: "b".repeat(64), attempt: 1, repair: false, initialChangedFiles: [] },
  changedFiles: ["docs/out.md"], violations: [], rawReport: report, report,
};

function validation(overrides: Record<string, unknown> = {}) {
  return validationGateReceiptSchema.parse({ schema_version: 1, task_id: "TASK-100", work_package_id: "WP-I1-08", source_commit: commit, changed_files: ["docs/out.md"], commands: [{ command: "npm run verify", status: "PASS", exit_code: 0, stdout: "ok", stderr: "" }], evaluator_changes: [], missing_evaluators: [], content_stable: true, decision: "PASS", reason_codes: [], ...overrides });
}
function input(overrides: Partial<EvidenceWriterInput> = {}): EvidenceWriterInput {
  return { completion, validation: validation(), headCommit: "c".repeat(40), changeFingerprint: "d".repeat(64), acceptance: [{ id: "AC-I1-001", status: "PASS", evidence: "verified" }], satisfiedGates: ["GATE-I1-001"], blockedGates: [], metrics: { attempts: 1, execution_duration_seconds: null, review_duration_seconds: null, token_or_provider_cost: null }, ...overrides };
}

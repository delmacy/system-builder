import test from "node:test";
import assert from "node:assert/strict";
import { normalizeDurableExecution } from "../../packages/contracts/workflow/index.js";

const rev = (revisionRef: string) => ({ semanticOwner: "workflow", revisionDimension: "definition", revisionRef });
const journal = (stages: Array<"ACCEPTED" | "PROCESSED" | "CONVERGED">, revisionRef = "r1") => stages.map((stage) => ({ executionId: "exec-1", producingRevision: rev(revisionRef), stage, completeness: "KNOWN" as const, evidenceRef: `evidence/${stage.toLowerCase()}` }));
const execution = (overrides: Record<string, unknown> = {}) => ({ contractVersion: "1.0.0", executionId: "exec-1", producingRevision: rev("r1"), currentRevision: rev("r2"), journal: journal(["ACCEPTED"]), accepted: "KNOWN" as const, processed: "UNKNOWN" as const, converged: "UNKNOWN" as const, ...overrides });

test("in-flight execution retains producing revision when a newer revision exists", () => {
  const normalized = normalizeDurableExecution(execution());
  assert.equal(normalized.producingRevision.revisionRef, "r1");
  assert.equal(normalized.currentRevision.revisionRef, "r2");
  assert.equal(normalized.journal[0]?.producingRevision.revisionRef, "r1");
});

test("accepted, processed and converged remain distinct", () => {
  assert.equal(normalizeDurableExecution(execution()).converged, "UNKNOWN");
  assert.throws(() => normalizeDurableExecution(execution({ processed: "KNOWN", converged: "KNOWN", journal: journal(["ACCEPTED"]) })), /processed KNOWN|converged KNOWN/);
});

test("PARTIAL or UNKNOWN evidence cannot strengthen completion", () => {
  assert.throws(() => normalizeDurableExecution(execution({ accepted: "PARTIAL", processed: "KNOWN", journal: journal(["ACCEPTED", "PROCESSED"]) })), /processed cannot be stronger/);
  assert.throws(() => normalizeDurableExecution(execution({ accepted: "KNOWN", processed: "UNKNOWN", converged: "KNOWN", journal: journal(["ACCEPTED", "CONVERGED"]) })), /converged cannot be stronger/);
});

test("journal evidence must preserve execution and producing-revision lineage", () => {
  assert.throws(() => normalizeDurableExecution(execution({ journal: [{ ...journal(["ACCEPTED"])[0], executionId: "exec-2" }] })), /execution lineage/);
  assert.throws(() => normalizeDurableExecution(execution({ journal: journal(["ACCEPTED"], "r2") })), /revision lineage/);
  assert.throws(() => normalizeDurableExecution(execution({ journal: [] })), /journal evidence is required/);
});

test("latest revision never silently reinterprets an existing execution", () => {
  const normalized = normalizeDurableExecution(execution({ currentRevision: rev("r99") }));
  assert.equal(normalized.producingRevision.revisionRef, "r1");
  assert.equal(normalized.currentRevision.revisionRef, "r99");
});

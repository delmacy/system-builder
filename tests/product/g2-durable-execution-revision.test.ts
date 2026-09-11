import assert from "node:assert/strict";
import test from "node:test";

import {
  assessDurableExecution,
  retainsProducingRevision,
  type DurableExecutionSnapshot,
  type ProducingRevisionRef,
} from "../../packages/contracts/workflow/durable-execution";

const revisionA: ProducingRevisionRef = {
  definitionRef: "workflow:order",
  revisionRef: "revision:a",
  contractVersion: "1",
};

const revisionB: ProducingRevisionRef = {
  definitionRef: "workflow:order",
  revisionRef: "revision:b",
  contractVersion: "1",
};

const snapshot = (overrides: Partial<DurableExecutionSnapshot> = {}): DurableExecutionSnapshot => ({
  executionRef: "execution:1",
  producingRevision: revisionA,
  stage: "CONVERGED",
  knowledge: "KNOWN",
  journal: [
    { executionRef: "execution:1", producingRevision: revisionA, sequence: 1, stage: "ACCEPTED", knowledge: "KNOWN", evidenceRefs: ["accept:1"] },
    { executionRef: "execution:1", producingRevision: revisionA, sequence: 2, stage: "PROCESSED", knowledge: "KNOWN", evidenceRefs: ["process:1"] },
    { executionRef: "execution:1", producingRevision: revisionA, sequence: 3, stage: "CONVERGED", knowledge: "KNOWN", evidenceRefs: ["converge:1"] },
  ],
  ...overrides,
});

test("pins in-flight execution to its producing revision", () => {
  const execution = snapshot();
  assert.equal(retainsProducingRevision(execution, revisionA), true);
  assert.equal(retainsProducingRevision(execution, revisionB), false);
  assert.equal(assessDurableExecution(execution).valid, true);
});

test("keeps accepted, processed and converged distinct", () => {
  const acceptedOnly = snapshot({
    stage: "ACCEPTED",
    journal: [{ executionRef: "execution:1", producingRevision: revisionA, sequence: 1, stage: "ACCEPTED", knowledge: "KNOWN", evidenceRefs: ["accept:1"] }],
  });
  assert.deepEqual(assessDurableExecution(acceptedOnly), {
    valid: true,
    accepted: true,
    processed: false,
    converged: false,
    reasons: [],
  });
});

test("rejects latest-revision reinterpretation", () => {
  const drifted = snapshot({
    journal: [{ executionRef: "execution:1", producingRevision: revisionB, sequence: 1, stage: "ACCEPTED", knowledge: "KNOWN", evidenceRefs: ["accept:1"] }],
    stage: "ACCEPTED",
  });
  assert.equal(assessDurableExecution(drifted).valid, false);
  assert.ok(assessDurableExecution(drifted).reasons.includes("PRODUCING_REVISION_MISMATCH"));
});

test("PARTIAL or UNKNOWN cannot strengthen terminal state", () => {
  for (const knowledge of ["PARTIAL", "UNKNOWN"] as const) {
    const result = assessDurableExecution(snapshot({ knowledge }));
    assert.equal(result.valid, false);
    assert.ok(result.reasons.includes("NON_KNOWN_CANNOT_STRENGTHEN_TERMINAL_STATE"));
  }
});

test("missing journal evidence cannot imply completion", () => {
  const result = assessDurableExecution(snapshot({ stage: "CONVERGED", journal: [] }));
  assert.equal(result.valid, false);
  assert.ok(result.reasons.includes("MISSING_JOURNAL_EVIDENCE"));
  assert.ok(result.reasons.includes("CONVERGED_WITHOUT_JOURNAL_EVIDENCE"));
});

import assert from "node:assert/strict";
import test from "node:test";
import { ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION } from "../../packages/contracts/elicitation-knowledge-base/index.js";
import { EKB_TRACE_AUTHORITY_MODE, normalizeEKBDerivedTraceabilityRecord, validateEKBDerivedTraceabilitySet } from "../../packages/contracts/elicitation-knowledge-base/derived-traceability.js";

const base = () => ({
  contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  traceRef: "trace:operator-answer:r1:story:r4",
  sourceOccurrenceRef: "occurrence:operator-interview:17",
  sourceArtifactRef: "information:operator-answer",
  sourceRevisionRef: "revision:operator-answer:r1",
  sourceInformationKind: "Claim",
  sourceCurrentness: "CURRENT",
  targetArtifactRef: "story:maintenance-screen",
  targetRevisionRef: "revision:story:maintenance-screen:r4",
  targetSemanticOwnerRef: "owner:product-backlog",
  derivationKind: "STORY",
  rationale: "Operator claim motivates a candidate story while remaining a Claim.",
  evidenceRefs: ["evidence:interview:17"],
  contradictionRefs: ["contradiction:operator-vs-supervisor"],
  negationRef: "negation:no-automatic-closure",
  traceState: "ACTIVE",
  authorityMode: EKB_TRACE_AUTHORITY_MODE,
  supersedesTraceRef: null,
} as const);

test("TASK-482 pins source/target revisions and preserves source epistemic status and external ownership", () => {
  const trace = normalizeEKBDerivedTraceabilityRecord(base());
  assert.equal(trace.sourceRevisionRef, "revision:operator-answer:r1");
  assert.equal(trace.targetRevisionRef, "revision:story:maintenance-screen:r4");
  assert.equal(trace.sourceInformationKind, "Claim");
  assert.equal(trace.targetSemanticOwnerRef, "owner:product-backlog");
  assert.equal(trace.authorityMode, "REFERENCE_ONLY");
  assert.deepEqual(trace.contradictionRefs, ["contradiction:operator-vs-supervisor"]);
  assert.equal(trace.negationRef, "negation:no-automatic-closure");
});

test("TASK-482 does not promote Claim Assumption or InferredCandidate through derived targets", () => {
  for (const sourceInformationKind of ["Claim", "Assumption", "InferredCandidate"] as const) {
    const trace = normalizeEKBDerivedTraceabilityRecord({ ...base(), sourceInformationKind, derivationKind: "REQUIREMENT", targetArtifactRef: `requirement:${sourceInformationKind}` });
    assert.equal(trace.sourceInformationKind, sourceInformationKind);
    assert.equal(trace.derivationKind, "REQUIREMENT");
    assert.throws(() => normalizeEKBDerivedTraceabilityRecord({ ...base(), sourceInformationKind, promotedKind: "Requirement" }), /unexpected field promotedKind/);
  }
});

test("TASK-482 keeps stale missing or unresolved sources explicitly unresolved", () => {
  for (const sourceCurrentness of ["STALE", "UNKNOWN", "UNRESOLVED"] as const) {
    const unresolved = normalizeEKBDerivedTraceabilityRecord({ ...base(), sourceCurrentness, traceState: "UNRESOLVED" });
    assert.equal(unresolved.traceState, "UNRESOLVED");
    assert.throws(() => normalizeEKBDerivedTraceabilityRecord({ ...base(), sourceCurrentness, traceState: "ACTIVE" }), /must yield UNRESOLVED/);
  }
});

test("TASK-482 preserves historical supersession without latest-revision substitution", () => {
  const historical = normalizeEKBDerivedTraceabilityRecord({ ...base(), traceState: "SUPERSEDED", supersedesTraceRef: "trace:operator-answer:r0:story:r3" });
  assert.equal(historical.sourceRevisionRef, "revision:operator-answer:r1");
  assert.equal(historical.targetRevisionRef, "revision:story:maintenance-screen:r4");
  assert.equal(historical.supersedesTraceRef, "trace:operator-answer:r0:story:r3");
  assert.throws(() => normalizeEKBDerivedTraceabilityRecord({ ...base(), latestSourceRevisionRef: "revision:operator-answer:r2" }), /unexpected field latestSourceRevisionRef/);
  assert.throws(() => normalizeEKBDerivedTraceabilityRecord({ ...base(), traceState: "SUPERSEDED", supersedesTraceRef: null }), /requires supersedesTraceRef/);
});

test("TASK-482 rejects traceability-as-authority, EKB target ownership and contradiction/negation erasure", () => {
  assert.throws(() => normalizeEKBDerivedTraceabilityRecord({ ...base(), authorityMode: "AUTHORITATIVE" }), /reference-only/);
  assert.throws(() => normalizeEKBDerivedTraceabilityRecord({ ...base(), semanticOwnerRef: "owner:ekb" }), /unexpected field semanticOwnerRef/);
  for (const targetSemanticOwnerRef of ["owner:ekb", "owner:ekb:derived", "owner:elicitation-knowledge-base", "owner:elicitation-knowledge-base:derived"] as const) {
    assert.throws(() => normalizeEKBDerivedTraceabilityRecord({ ...base(), targetSemanticOwnerRef }), /must remain external/);
  }
  const trace = normalizeEKBDerivedTraceabilityRecord(base());
  assert.deepEqual(trace.contradictionRefs, ["contradiction:operator-vs-supervisor"]);
  assert.equal(trace.negationRef, "negation:no-automatic-closure");
});

test("TASK-482 rejects implicit canonical fan-out from one source occurrence", () => {
  const first = normalizeEKBDerivedTraceabilityRecord(base());
  const duplicate = normalizeEKBDerivedTraceabilityRecord({ ...base(), traceRef: "trace:duplicate" });
  assert.throws(() => validateEKBDerivedTraceabilitySet([first, duplicate]), /cannot silently fan out/);
  const distinctTarget = normalizeEKBDerivedTraceabilityRecord({ ...base(), traceRef: "trace:distinct", targetArtifactRef: "acceptance:maintenance-screen", targetRevisionRef: "revision:acceptance:r1", derivationKind: "ACCEPTANCE" });
  assert.throws(() => validateEKBDerivedTraceabilitySet([first, distinctTarget]), /cannot silently fan out/);
  const distinctOccurrence = normalizeEKBDerivedTraceabilityRecord({ ...base(), traceRef: "trace:distinct-occurrence", sourceOccurrenceRef: "occurrence:operator-interview:18", targetArtifactRef: "acceptance:maintenance-screen", targetRevisionRef: "revision:acceptance:r1", derivationKind: "ACCEPTANCE" });
  assert.equal(validateEKBDerivedTraceabilitySet([first, distinctOccurrence]).length, 2);
});

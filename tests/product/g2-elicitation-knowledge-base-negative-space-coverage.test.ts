import assert from "node:assert/strict";
import test from "node:test";
import { ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION } from "../../packages/contracts/elicitation-knowledge-base/index.js";
import { collectEKBNegativeSpaceBlockers, normalizeEKBNegativeSpaceCoverageRecord } from "../../packages/contracts/elicitation-knowledge-base/negative-space-coverage.js";

const base = () => ({
  contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  negativeSpaceRef: "negative-space:station-a:operators",
  sourceCapabilityRouteRef: "lens-route:maintenance:1",
  kind: "STAKEHOLDER",
  expectedRef: "stakeholder-cohort:operators",
  populationScope: "population:station-a:operators",
  localityScope: "locality:station-a",
  state: "UNKNOWN",
  currentnessState: "UNKNOWN",
  severity: "HIGH",
  evidenceRef: null,
  applicabilityRef: null,
  rationale: "Expected local operator cohort has not yet been observed.",
  contradictionRefs: [],
} as const);

test("TASK-481 preserves explicit expected population/locality and conservative missing states", () => {
  const unknown = normalizeEKBNegativeSpaceCoverageRecord(base());
  const partial = normalizeEKBNegativeSpaceCoverageRecord({ ...base(), negativeSpaceRef: "negative-space:station-a:sources", kind: "SOURCE", expectedRef: "source:maintenance-log", state: "PARTIAL", currentnessState: "INSUFFICIENT" });
  const untouched = normalizeEKBNegativeSpaceCoverageRecord({ ...base(), negativeSpaceRef: "negative-space:station-a:dimension", kind: "APPLICABLE_DIMENSION", expectedRef: "dimension:night-shift", state: "UNTOUCHED" });
  assert.equal(unknown.populationScope, "population:station-a:operators");
  assert.equal(unknown.localityScope, "locality:station-a");
  assert.deepEqual([unknown.state, partial.state, untouched.state], ["UNKNOWN", "PARTIAL", "UNTOUCHED"]);
});

test("TASK-481 requires qualified current evidence for NOT_APPLICABLE", () => {
  const na = normalizeEKBNegativeSpaceCoverageRecord({ ...base(), state: "NOT_APPLICABLE", currentnessState: "CURRENT", evidenceRef: "evidence:station-a:no-night-shift", applicabilityRef: "applicability:station-a:no-night-shift", rationale: "Station A has no night-shift cohort by current staffing rule." });
  assert.equal(na.state, "NOT_APPLICABLE");
  assert.throws(() => normalizeEKBNegativeSpaceCoverageRecord({ ...base(), state: "NOT_APPLICABLE", currentnessState: "CURRENT", evidenceRef: null, applicabilityRef: "applicability:x" }), /qualified applicability evidence/);
  assert.throws(() => normalizeEKBNegativeSpaceCoverageRecord({ ...base(), state: "NOT_APPLICABLE", currentnessState: "STALE", evidenceRef: "evidence:old", applicabilityRef: "applicability:x" }), /CURRENT qualified/);
});

test("TASK-481 preserves conflicting stakeholder claims as separate records routed through one contradiction", () => {
  const contradictionRef = "contradiction:operator-vs-supervisor";
  const operatorClaim = normalizeEKBNegativeSpaceCoverageRecord({
    ...base(),
    negativeSpaceRef: "negative-space:station-a:operators:operator-claim",
    expectedRef: "stakeholder:operator",
    state: "CONFLICTED",
    currentnessState: "CURRENT",
    evidenceRef: "evidence:interview:operator",
    contradictionRefs: [contradictionRef],
  });
  const supervisorClaim = normalizeEKBNegativeSpaceCoverageRecord({
    ...base(),
    negativeSpaceRef: "negative-space:station-a:operators:supervisor-claim",
    expectedRef: "stakeholder:supervisor",
    state: "CONFLICTED",
    currentnessState: "CURRENT",
    evidenceRef: "evidence:interview:supervisor",
    contradictionRefs: [contradictionRef],
  });
  assert.notEqual(operatorClaim.negativeSpaceRef, supervisorClaim.negativeSpaceRef);
  assert.notEqual(operatorClaim.expectedRef, supervisorClaim.expectedRef);
  assert.notEqual(operatorClaim.evidenceRef, supervisorClaim.evidenceRef);
  assert.equal(operatorClaim.populationScope, supervisorClaim.populationScope);
  assert.equal(operatorClaim.localityScope, supervisorClaim.localityScope);
  assert.deepEqual(operatorClaim.contradictionRefs, [contradictionRef]);
  assert.deepEqual(supervisorClaim.contradictionRefs, [contradictionRef]);
  assert.throws(() => normalizeEKBNegativeSpaceCoverageRecord({ ...base(), state: "CONFLICTED", contradictionRefs: [] }), /explicit contradiction references/);
  assert.throws(() => normalizeEKBNegativeSpaceCoverageRecord({ ...base(), winnerClaimRef: "claim:supervisor" }), /unexpected field winnerClaimRef/);
});

test("TASK-481 keeps stale or insufficient evidence conservative and blocks HIGH/CRITICAL gaps", () => {
  const stale = normalizeEKBNegativeSpaceCoverageRecord({ ...base(), negativeSpaceRef: "negative-space:station-a:stale-interview", state: "PARTIAL", currentnessState: "STALE", evidenceRef: "evidence:interview:old" });
  const insufficient = normalizeEKBNegativeSpaceCoverageRecord({ ...base(), negativeSpaceRef: "negative-space:station-a:missing-log", kind: "SOURCE", expectedRef: "source:maintenance-log", state: "PARTIAL", currentnessState: "INSUFFICIENT", severity: "CRITICAL" });
  assert.deepEqual(collectEKBNegativeSpaceBlockers([stale, insufficient]), ["negative-space:station-a:missing-log", "negative-space:station-a:stale-interview"]);
});

test("TASK-481 rejects no-response/no-evidence coercion and Fleet masking of local cohorts", () => {
  assert.throws(() => normalizeEKBNegativeSpaceCoverageRecord({ ...base(), response: false }), /unexpected field response/);
  assert.throws(() => normalizeEKBNegativeSpaceCoverageRecord({ ...base(), evidenceCount: 0 }), /unexpected field evidenceCount/);
  assert.throws(() => normalizeEKBNegativeSpaceCoverageRecord({ ...base(), missingMeansNotApplicable: true }), /unexpected field missingMeansNotApplicable/);
  const fleet = normalizeEKBNegativeSpaceCoverageRecord({ ...base(), negativeSpaceRef: "negative-space:fleet:operators", populationScope: "population:fleet:operators", localityScope: "locality:fleet" });
  const local = normalizeEKBNegativeSpaceCoverageRecord(base());
  assert.notEqual(fleet.localityScope, local.localityScope);
  assert.notEqual(fleet.populationScope, local.populationScope);
});

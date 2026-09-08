import assert from "node:assert/strict";
import test from "node:test";

import { ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION } from "../../packages/contracts/elicitation-knowledge-base/index.js";
import {
  EKB_COVERAGE_STATES,
  assessEKBSufficiency,
  normalizeEKBCoverageRecord,
} from "../../packages/contracts/elicitation-knowledge-base/coverage.js";

const base = {
  contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  coverageRef: "coverage:process:station-a:r1",
  dimensionRef: "dimension:process",
  objectOrCapabilityRef: "capability:maintenance",
  revisionRef: "revision:r1",
  populationScope: "population:station-a",
  localityScope: "locality:station-a",
  state: "RESOLVED",
  requiredStages: ["SUFFICIENT_FOR_ABSTRACTION"],
  qualificationRef: "qualification:1",
  currentnessState: "CURRENT",
  applicabilityRef: "applicability:1",
  rationale: null,
  historicalResolvedEvidenceRef: "evidence:resolved:r1",
} as const;

test("TASK-477 preserves all eight dimensional coverage states", () => {
  assert.deepEqual(EKB_COVERAGE_STATES, ["UNTOUCHED", "DISCOVERING", "PARTIAL", "RESOLVED", "CONFLICTED", "BLOCKED", "NOT_APPLICABLE", "DEFERRED"]);
  const normalized = normalizeEKBCoverageRecord(base);
  assert.equal(normalized.dimensionRef, "dimension:process");
  assert.equal(normalized.objectOrCapabilityRef, "capability:maintenance");
  assert.equal(normalized.revisionRef, "revision:r1");
  assert.throws(() => normalizeEKBCoverageRecord({ ...base, percentage: 95 }), /unexpected field percentage/);
});

test("TASK-477 requires rationale and applicability for NOT_APPLICABLE", () => {
  assert.throws(() => normalizeEKBCoverageRecord({ ...base, state: "NOT_APPLICABLE", qualificationRef: null, applicabilityRef: null, rationale: null }), /requires applicability context and rationale/);
  assert.equal(normalizeEKBCoverageRecord({ ...base, state: "NOT_APPLICABLE", qualificationRef: null, applicabilityRef: "applicability:na", rationale: "Capability is outside this station scope." }).state, "NOT_APPLICABLE");
});

test("TASK-477 stale evidence reopens current coverage without erasing historical evidence", () => {
  assert.throws(() => normalizeEKBCoverageRecord({ ...base, currentnessState: "STALE" }), /RESOLVED coverage requires CURRENT qualified evidence/);
  const reopened = normalizeEKBCoverageRecord({ ...base, state: "PARTIAL", currentnessState: "STALE" });
  assert.equal(reopened.state, "PARTIAL");
  assert.equal(reopened.historicalResolvedEvidenceRef, "evidence:resolved:r1");
});

test("TASK-477 fails closed on one material unresolved obligation", () => {
  const coverage = [normalizeEKBCoverageRecord(base)];
  const assessment = assessEKBSufficiency({
    stage: "SUFFICIENT_FOR_ABSTRACTION",
    coverage,
    obligations: [{ obligationRef: "obligation:critical:1", contradictionRef: "contradiction:1", severity: "CRITICAL", routingOutcome: "UNRESOLVED", coverageState: "CONFLICTED", currentnessState: "CURRENT", applicable: true }],
  });
  assert.equal(assessment.result, "FAIL");
  assert.deepEqual(assessment.blockerRefs, ["obligation:critical:1"]);
});

test("TASK-477 prevents scalar masking and stage promotion", () => {
  const resolved = normalizeEKBCoverageRecord(base);
  const blocked = normalizeEKBCoverageRecord({ ...base, coverageRef: "coverage:authority:station-a:r1", dimensionRef: "dimension:authority", state: "BLOCKED", qualificationRef: null, currentnessState: "UNKNOWN" });
  assert.equal(assessEKBSufficiency({ stage: "SUFFICIENT_FOR_ABSTRACTION", coverage: [resolved, blocked], obligations: [] }).result, "FAIL");
  assert.equal(assessEKBSufficiency({ stage: "SUFFICIENT_FOR_IMPLEMENTATION", coverage: [resolved], obligations: [] }).result, "FAIL");
});

test("TASK-477 does not equate elicitation sufficiency with production readiness", () => {
  assert.throws(() => normalizeEKBCoverageRecord({ ...base, productionReadiness: "READY" }), /unexpected field productionReadiness/);
  const pass = assessEKBSufficiency({ stage: "SUFFICIENT_FOR_ABSTRACTION", coverage: [normalizeEKBCoverageRecord(base)], obligations: [] });
  assert.equal(pass.result, "PASS");
  assert.equal("productionReadiness" in pass, false);
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  allResidualBuildCohortsAreDrained,
  cacheEntryIsCurrentAndProvenanced,
  cacheHitEstablishesTrustedCurrentMaterial,
  evaluateReproducibilityClaim,
  residualCohortIsDrained,
  successfulBuildsEstablishReproducibility,
  type CacheLineage,
  type ReproducibilityObservation,
  type ResidualBuildCohort,
} from "../../packages/contracts/build-reproducibility/reproducibility-cache-drainage.js";

const evidence = { evidenceRef: "evidence:qualified:1", completeness: "KNOWN" as const, currentness: "CURRENT" as const };

const observation = (overrides: Partial<ReproducibilityObservation> = {}): ReproducibilityObservation => ({
  observationRef: "observation:1",
  buildRevisionRef: "revision:7",
  environmentRef: "environment:sha256:aaa",
  populationRef: "population:linux-x64",
  executionContextRef: "execution:qualified:1",
  materialBoundaryRef: "materials:sha256:bbb",
  outputDigest: "sha256:output",
  outcome: "SUCCEEDED",
  evidence,
  ...overrides,
});

const cache = (overrides: Partial<CacheLineage> = {}): CacheLineage => ({
  cacheEntryRef: "cache:entry:1",
  cacheEpochRef: "cache:epoch:4",
  producingRevisionRef: "revision:7",
  producingExecutionContextRef: "execution:qualified:1",
  producingMaterialBoundaryRef: "materials:sha256:bbb",
  contentDigest: "sha256:cache",
  provenance: evidence,
  ...overrides,
});

const cohort = (overrides: Partial<ResidualBuildCohort> = {}): ResidualBuildCohort => ({
  cohortRef: "cohort:runner:old",
  kind: "RUNNER",
  epochRef: "runner:epoch:3",
  populationRef: "population:legacy-runner",
  residualCount: 0,
  evidence,
  ...overrides,
});

test("TASK-537 reproducibility is revision environment population and material qualified", () => {
  const left = observation();
  const right = observation({ observationRef: "observation:2" });
  assert.equal(evaluateReproducibilityClaim({ claimRef: "claim:1", left, right }), "PASS");
  assert.equal(evaluateReproducibilityClaim({ claimRef: "claim:2", left, right: observation({ environmentRef: "environment:other" }) }), "INCONCLUSIVE");
  assert.equal(evaluateReproducibilityClaim({ claimRef: "claim:3", left, right: observation({ populationRef: "population:other" }) }), "INCONCLUSIVE");
  assert.equal(evaluateReproducibilityClaim({ claimRef: "claim:4", left, right: observation({ outputDigest: "sha256:different" }) }), "FAIL");
});

test("TASK-537 successful builds alone never establish reproducibility", () => {
  const left = observation();
  const right = observation({ observationRef: "observation:2" });
  assert.equal(successfulBuildsEstablishReproducibility(left, right), false);
  assert.equal(evaluateReproducibilityClaim({ claimRef: "claim:partial", left, right: observation({ evidence: { ...evidence, completeness: "PARTIAL" } }) }), "INCONCLUSIVE");
  assert.equal(evaluateReproducibilityClaim({ claimRef: "claim:unknown", left, right: observation({ evidence: { ...evidence, completeness: "UNKNOWN" } }) }), "INCONCLUSIVE");
});

test("TASK-537 cache hit is distinct from provenance and currentness proof", () => {
  assert.equal(cacheEntryIsCurrentAndProvenanced(cache()), true);
  assert.equal(cacheHitEstablishesTrustedCurrentMaterial(cache()), false);
  assert.equal(cacheEntryIsCurrentAndProvenanced(cache({ provenance: { ...evidence, currentness: "STALE" } })), false);
  assert.equal(cacheEntryIsCurrentAndProvenanced(cache({ provenance: { ...evidence, completeness: "UNKNOWN" } })), false);
  assert.equal(cacheEntryIsCurrentAndProvenanced(cache({ producingMaterialBoundaryRef: "" })), false);
});

test("TASK-537 residual runner and cache cohorts require explicit finite drainage evidence", () => {
  const runner = cohort();
  const cacheCohort = cohort({ cohortRef: "cohort:cache:old", kind: "CACHE", epochRef: "cache:epoch:3", populationRef: "population:legacy-cache" });
  assert.equal(residualCohortIsDrained(runner), true);
  assert.equal(allResidualBuildCohortsAreDrained([runner, cacheCohort]), true);
  assert.equal(residualCohortIsDrained(cohort({ populationRef: null })), false);
  assert.equal(residualCohortIsDrained(cohort({ residualCount: null })), false);
  assert.equal(residualCohortIsDrained(cohort({ residualCount: 1 })), false);
  assert.equal(residualCohortIsDrained(cohort({ evidence: { ...evidence, completeness: "PARTIAL" } })), false);
  assert.equal(residualCohortIsDrained(cohort({ evidence: { ...evidence, currentness: "STALE" } })), false);
  assert.equal(allResidualBuildCohortsAreDrained([]), false);
});

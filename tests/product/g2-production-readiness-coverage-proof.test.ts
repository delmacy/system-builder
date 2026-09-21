import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PRODUCTION_READINESS_DIMENSIONS,
  composeProductionReadinessEvidence,
  evaluateProductionReadinessCriticalGates,
  hasIndependentReadinessDimensions,
  qualifyProductionReadinessDimension,
  type ProductionReadinessDimensionAssessment,
} from "../../packages/contracts/production-readiness";

const current = {
  population: "station-a",
  environment: "production",
  currentness: "CURRENT" as const,
};

const assessment = (dimension: ProductionReadinessDimensionAssessment["dimension"]): ProductionReadinessDimensionAssessment => ({
  dimension,
  state: "PASS",
  qualification: current,
  evidence: [{
    id: `evidence:${dimension}`,
    revision: "r1",
    producer: "producer-owned",
    provenance: "runtime-evidence",
    qualification: current,
  }],
});

describe("G2 Production Readiness coverage", () => {
  it("keeps all eleven readiness dimensions independently represented", () => {
    const dimensions = PRODUCTION_READINESS_DIMENSIONS.map(assessment);
    assert.equal(hasIndependentReadinessDimensions({ revision: "r1", owner: "readiness-owner", dimensions }), true);
    assert.equal(new Set(dimensions.map((entry) => entry.dimension)).size, 11);
  });

  it("does not promote missing evidence to PASS", () => {
    const input = { ...assessment("OBSERVABILITY"), evidence: [] };
    assert.equal(qualifyProductionReadinessDimension(input, current).state, "UNKNOWN");
  });

  it("does not promote mismatched population or environment to PASS", () => {
    const input = assessment("RECOVERY");
    assert.equal(qualifyProductionReadinessDimension(input, { ...current, population: "fleet" }).state, "UNKNOWN");
    assert.equal(qualifyProductionReadinessDimension(input, { ...current, environment: "staging" }).state, "UNKNOWN");
  });

  it("does not promote stale evidence to PASS", () => {
    const input = {
      ...assessment("CURRENTNESS"),
      evidence: [{ ...assessment("CURRENTNESS").evidence[0]!, qualification: { ...current, currentness: "STALE" as const } }],
    };
    assert.equal(qualifyProductionReadinessDimension(input, current).state, "UNKNOWN");
  });

  it("preserves non-PASS epistemic states instead of strengthening them", () => {
    for (const state of ["UNKNOWN", "PARTIAL", "FAIL", "INCONCLUSIVE", "BLOCKED", "NA", "DEFERRED"] as const) {
      const input = { ...assessment("DOCUMENTATION"), state };
      assert.equal(qualifyProductionReadinessDimension(input, current).state, state);
    }
  });

  it("blocks a positive conclusion for every unresolved critical state", () => {
    for (const state of ["FAIL", "BLOCKED", "UNKNOWN", "PARTIAL", "INCONCLUSIVE"] as const) {
      const dimensions = PRODUCTION_READINESS_DIMENSIONS.map(assessment);
      const critical = { ...assessment("SECURITY"), state };
      const input = dimensions.map((entry) => entry.dimension === "SECURITY" ? critical : entry);
      const result = evaluateProductionReadinessCriticalGates(
        { revision: "r1", owner: "readiness-owner", dimensions: input },
        { criticality: { SECURITY: "CRITICAL" } },
      );
      assert.equal(result.conclusion, "BLOCKED");
      assert.deepEqual(result.blockingDimensions, [critical]);
    }
  });

  it("does not let successful noncritical siblings compensate for a critical failure", () => {
    const dimensions = PRODUCTION_READINESS_DIMENSIONS.map(assessment).map((entry) =>
      entry.dimension === "RECOVERY" ? { ...entry, state: "FAIL" as const } : entry,
    );
    const result = evaluateProductionReadinessCriticalGates(
      { revision: "r1", owner: "readiness-owner", dimensions },
      { criticality: { RECOVERY: "CRITICAL" } },
    );
    assert.equal(result.conclusion, "BLOCKED");
    assert.equal(result.blockingDimensions[0]?.dimension, "RECOVERY");
  });

  it("does not invent scalar or percentage authority for gate evaluation", () => {
    const dimensions = PRODUCTION_READINESS_DIMENSIONS.map(assessment);
    const result = evaluateProductionReadinessCriticalGates(
      { revision: "r1", owner: "readiness-owner", dimensions },
      { criticality: { SECURITY: "CRITICAL", RECOVERY: "CRITICAL" } },
    );
    assert.equal(result.conclusion, "PASS");
    assert.deepEqual(result.blockingDimensions, []);
    assert.equal("score" in result, false);
    assert.equal("percentage" in result, false);
  });

  it("composes qualified producer-owned readiness evidence without re-owning it", () => {
    const input = assessment("OBSERVABILITY");
    const result = composeProductionReadinessEvidence(input, current);
    assert.equal(result.state, "PASS");
    assert.deepEqual(result.evidence, input.evidence);
    assert.equal(result.evidence[0]?.producer, "producer-owned");
    assert.equal(result.evidence[0]?.revision, "r1");
    assert.equal(result.evidence[0]?.provenance, "runtime-evidence");
  });

  it("keeps Product Proof references distinct and unable to substitute for readiness evidence", () => {
    const productProofOnly = {
      ...assessment("RECOVERY"),
      evidence: [],
    };
    assert.equal(composeProductionReadinessEvidence(productProofOnly, current).state, "UNKNOWN");

    const related = {
      ...assessment("RECOVERY"),
      evidence: [{
        ...assessment("RECOVERY").evidence[0]!,
        relatedProductProof: {
          kind: "PRODUCT_PROOF" as const,
          id: "proof:recovery",
          revision: "proof-r1",
          producer: "product-proof-owner",
          provenance: "product-proof",
        },
      }],
    };
    const composed = composeProductionReadinessEvidence(related, current);
    assert.equal(composed.state, "PASS");
    assert.equal(composed.evidence[0]?.relatedProductProof?.kind, "PRODUCT_PROOF");
    assert.equal(composed.evidence[0]?.producer, "producer-owned");
  });

  it("weakens stale or mismatched PASS evidence and never strengthens PARTIAL or UNKNOWN", () => {
    const stale = {
      ...assessment("CURRENTNESS"),
      evidence: [{ ...assessment("CURRENTNESS").evidence[0]!, qualification: { ...current, currentness: "STALE" as const } }],
    };
    assert.equal(composeProductionReadinessEvidence(stale, current).state, "UNKNOWN");

    const mismatch = assessment("SECURITY");
    assert.equal(composeProductionReadinessEvidence(mismatch, { ...current, population: "fleet" }).state, "UNKNOWN");

    for (const state of ["PARTIAL", "UNKNOWN"] as const) {
      assert.equal(composeProductionReadinessEvidence({ ...assessment("OWNERSHIP"), state }, current).state, state);
    }
  });
});

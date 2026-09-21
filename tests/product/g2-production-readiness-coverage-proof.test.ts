import { describe, expect, it } from "vitest";
import {
  PRODUCTION_READINESS_DIMENSIONS,
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
    expect(hasIndependentReadinessDimensions({ revision: "r1", owner: "readiness-owner", dimensions })).toBe(true);
    expect(new Set(dimensions.map((entry) => entry.dimension)).size).toBe(11);
  });

  it("does not promote missing evidence to PASS", () => {
    const input = { ...assessment("OBSERVABILITY"), evidence: [] };
    expect(qualifyProductionReadinessDimension(input, current).state).toBe("UNKNOWN");
  });

  it("does not promote mismatched population or environment to PASS", () => {
    const input = assessment("RECOVERY");
    expect(qualifyProductionReadinessDimension(input, { ...current, population: "fleet" }).state).toBe("UNKNOWN");
    expect(qualifyProductionReadinessDimension(input, { ...current, environment: "staging" }).state).toBe("UNKNOWN");
  });

  it("does not promote stale evidence to PASS", () => {
    const input = {
      ...assessment("CURRENTNESS"),
      evidence: [{ ...assessment("CURRENTNESS").evidence[0]!, qualification: { ...current, currentness: "STALE" as const } }],
    };
    expect(qualifyProductionReadinessDimension(input, current).state).toBe("UNKNOWN");
  });

  it("preserves non-PASS epistemic states instead of strengthening them", () => {
    for (const state of ["UNKNOWN", "PARTIAL", "FAIL", "INCONCLUSIVE", "BLOCKED", "NA", "DEFERRED"] as const) {
      const input = { ...assessment("DOCUMENTATION"), state };
      expect(qualifyProductionReadinessDimension(input, current).state).toBe(state);
    }
  });
});

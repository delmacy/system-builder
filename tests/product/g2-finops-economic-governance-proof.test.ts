import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { allocateNormalizedCost, normalizeTechnologyCost, qualifyPlanningCost, type NormalizedCostEvidence, type PlanningCostEvidence, type ProviderCostEvidence } from "../../packages/contracts/finops/index.js";

const source: ProviderCostEvidence = { kind: "PROVIDER_COST_EVIDENCE", id: "provider-cost-1", revisionRef: "provider-cost-r1", sourceRef: "provider-invoice:1", scopeRef: "tenant:alpha", amountMinor: 1000, currency: "USD", effectiveAt: "2026-09-20T00:00:00Z", provenanceRef: "provider-export:sha256-1", currentness: "CURRENT", population: "COMPLETE" };
function normalized(): NormalizedCostEvidence { const result = normalizeTechnologyCost({ source, targetCurrency: "USD", revisionRef: "normalized-r1", provenanceRef: "normalizer-policy-r1" }); if (result.state !== "NORMALIZED") throw new Error("expected normalized cost evidence"); return result.evidence; }

describe("G2 FinOps economic-governance Product Proof", () => {
  it("normalizes qualified provider cost while preserving ancestry and commercial separation", () => {
    const result = normalizeTechnologyCost({ source, targetCurrency: "BRL", revisionRef: "normalized-r1", provenanceRef: "normalizer-policy-r1", conversion: { revisionRef: "fx-r1", fromCurrency: "USD", toCurrency: "BRL", numerator: 525, denominator: 100, effectiveAt: "2026-09-20T00:00:00Z", provenanceRef: "fx-source-r1", currentness: "CURRENT", population: "COMPLETE" } });
    assert.equal(result.state, "NORMALIZED"); if (result.state !== "NORMALIZED") throw new Error("expected normalized cost evidence");
    assert.deepEqual({ sourceEvidenceRevisionRef: result.evidence.sourceEvidenceRevisionRef, sourceRef: result.evidence.sourceRef, scopeRef: result.evidence.scopeRef, sourceCurrency: result.evidence.sourceCurrency, currency: result.evidence.currency, amountMinor: result.evidence.amountMinor, conversionRevisionRef: result.evidence.conversionRevisionRef, conversionProvenanceRef: result.evidence.conversionProvenanceRef, customerCommercialTruth: result.evidence.customerCommercialTruth }, { sourceEvidenceRevisionRef: "provider-cost-r1", sourceRef: "provider-invoice:1", scopeRef: "tenant:alpha", sourceCurrency: "USD", currency: "BRL", amountMinor: 5250, conversionRevisionRef: "fx-r1", conversionProvenanceRef: "fx-source-r1", customerCommercialTruth: false });
  });

  it("does not strengthen partial, unknown, or stale source evidence", () => {
    const cases: ReadonlyArray<readonly [ProviderCostEvidence["population"], ProviderCostEvidence["currentness"]]> = [["PARTIAL", "CURRENT"], ["UNKNOWN", "CURRENT"], ["COMPLETE", "STALE"], ["COMPLETE", "UNKNOWN"]];
    for (const [population, currentness] of cases) assert.deepEqual(normalizeTechnologyCost({ source: { ...source, population, currentness }, targetCurrency: "USD", revisionRef: "normalized-r2", provenanceRef: "normalizer-policy-r1" }), { state: "UNKNOWN", reason: "source-cost-evidence-not-qualified" });
  });

  it("does not infer missing or partial conversion evidence", () => {
    assert.deepEqual(normalizeTechnologyCost({ source, targetCurrency: "BRL", revisionRef: "normalized-r3", provenanceRef: "normalizer-policy-r1" }), { state: "UNKNOWN", reason: "missing-currency-conversion" });
    assert.deepEqual(normalizeTechnologyCost({ source, targetCurrency: "BRL", revisionRef: "normalized-r4", provenanceRef: "normalizer-policy-r1", conversion: { revisionRef: "fx-r2", fromCurrency: "USD", toCurrency: "BRL", numerator: 5, denominator: 1, effectiveAt: "2026-09-20T00:00:00Z", provenanceRef: "fx-source-r2", currentness: "CURRENT", population: "PARTIAL" } }), { state: "UNKNOWN", reason: "currency-conversion-not-qualified" });
  });

  it("fails closed when conversion effective time conflicts with source evidence", () => {
    assert.deepEqual(normalizeTechnologyCost({ source, targetCurrency: "BRL", revisionRef: "normalized-r5", provenanceRef: "normalizer-policy-r1", conversion: { revisionRef: "fx-r3", fromCurrency: "USD", toCurrency: "BRL", numerator: 5, denominator: 1, effectiveAt: "2026-09-19T00:00:00Z", provenanceRef: "fx-source-r3", currentness: "CURRENT", population: "COMPLETE" } }), { state: "UNKNOWN", reason: "currency-conversion-effective-time-conflict" });
  });

  it("conserves allocation including explicit rounding residual and locality", () => {
    const result = allocateNormalizedCost({ source: normalized(), targets: [{ dimensionRef: "station", targetRef: "station:a", weight: 1 }, { dimensionRef: "station", targetRef: "station:b", weight: 1 }, { dimensionRef: "station", targetRef: "station:c", weight: 1 }], revisionRef: "allocation-r1", provenanceRef: "allocation-policy-r1" });
    assert.equal(result.state, "ALLOCATED"); if (result.state !== "ALLOCATED") throw new Error("expected allocation evidence");
    const allocated = result.evidence.allocations.reduce((sum, item) => sum + item.amountMinor, 0);
    assert.equal(allocated + result.evidence.roundingResidualMinor, result.evidence.sourceAmountMinor);
    assert.equal(result.evidence.roundingResidualMinor, 1); assert.equal(result.evidence.scopeRef, "tenant:alpha"); assert.equal(result.evidence.sourceProvenanceRef, "normalizer-policy-r1"); assert.equal(result.evidence.provenanceRef, "allocation-policy-r1");
    assert.deepEqual(result.evidence.allocations.map(({ dimensionRef, targetRef }) => ({ dimensionRef, targetRef })), [{ dimensionRef: "station", targetRef: "station:a" }, { dimensionRef: "station", targetRef: "station:b" }, { dimensionRef: "station", targetRef: "station:c" }]);
  });

  it("keeps missing allocation populations and unqualified normalized evidence UNKNOWN", () => {
    assert.deepEqual(allocateNormalizedCost({ targets: [{ dimensionRef: "station", targetRef: "station:a", weight: 1 }], revisionRef: "allocation-r2", provenanceRef: "allocation-policy-r1" }), { state: "UNKNOWN", reason: "missing-normalized-cost-population" });
    assert.deepEqual(allocateNormalizedCost({ source: normalized(), targets: [], revisionRef: "allocation-r3", provenanceRef: "allocation-policy-r1" }), { state: "UNKNOWN", reason: "missing-allocation-population" });
    const stale = { ...normalized(), currentness: "STALE" } as unknown as NormalizedCostEvidence;
    assert.deepEqual(allocateNormalizedCost({ source: stale, targets: [{ dimensionRef: "station", targetRef: "station:a", weight: 1 }], revisionRef: "allocation-r4", provenanceRef: "allocation-policy-r1" }), { state: "UNKNOWN", reason: "normalized-cost-not-qualified" });
  });

  it("preserves budget forecast commitment and actual as distinct evidence kinds", () => {
    const base = { revisionRef: "plan-r1", scopeRef: "tenant:alpha", periodRef: "2026-09", amountMinor: 1000, currency: "USD", provenanceRef: "plan-source-r1", currentness: "CURRENT", population: "COMPLETE" } as const;
    for (const kind of ["BUDGET", "FORECAST", "COMMITMENT"] as const) { const result = qualifyPlanningCost({ ...base, kind }); assert.equal(result.kind, kind); assert.notEqual(result.kind, "ACTUAL"); }
    const actual = qualifyPlanningCost(normalized()); assert.equal(actual.kind, "ACTUAL");
  });

  it("does not strengthen PARTIAL UNKNOWN or stale planning evidence", () => {
    const cases: ReadonlyArray<Pick<PlanningCostEvidence, "population" | "currentness">> = [{ population: "PARTIAL", currentness: "CURRENT" }, { population: "UNKNOWN", currentness: "CURRENT" }, { population: "COMPLETE", currentness: "STALE" }, { population: "COMPLETE", currentness: "UNKNOWN" }];
    for (const state of cases) assert.deepEqual(qualifyPlanningCost({ kind: "BUDGET", revisionRef: "plan-r2", scopeRef: "tenant:alpha", periodRef: "2026-09", amountMinor: 1000, currency: "USD", provenanceRef: "plan-source-r2", ...state }), { kind: "UNKNOWN", reason: "planning-cost-not-qualified" });
  });
});

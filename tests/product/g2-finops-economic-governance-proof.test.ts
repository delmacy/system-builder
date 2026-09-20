import { describe, expect, it } from "vitest";
import { normalizeTechnologyCost, type ProviderCostEvidence } from "../../packages/contracts/finops/index.js";

const source: ProviderCostEvidence = {
  kind: "PROVIDER_COST_EVIDENCE",
  id: "provider-cost-1",
  revisionRef: "provider-cost-r1",
  sourceRef: "provider-invoice:1",
  scopeRef: "tenant:alpha",
  amountMinor: 1000,
  currency: "USD",
  effectiveAt: "2026-09-20T00:00:00Z",
  provenanceRef: "provider-export:sha256-1",
  currentness: "CURRENT",
  population: "COMPLETE",
};

describe("G2 FinOps economic-governance Product Proof", () => {
  it("normalizes qualified provider cost while preserving ancestry and commercial separation", () => {
    const result = normalizeTechnologyCost({
      source,
      targetCurrency: "BRL",
      revisionRef: "normalized-r1",
      provenanceRef: "normalizer-policy-r1",
      conversion: {
        revisionRef: "fx-r1",
        fromCurrency: "USD",
        toCurrency: "BRL",
        numerator: 525,
        denominator: 100,
        effectiveAt: "2026-09-20T00:00:00Z",
        provenanceRef: "fx-source-r1",
        currentness: "CURRENT",
        population: "COMPLETE",
      },
    });

    expect(result.state).toBe("NORMALIZED");
    expect(result.evidence).toMatchObject({
      sourceEvidenceRevisionRef: "provider-cost-r1",
      sourceRef: "provider-invoice:1",
      scopeRef: "tenant:alpha",
      sourceCurrency: "USD",
      currency: "BRL",
      amountMinor: 5250,
      conversionRevisionRef: "fx-r1",
      conversionProvenanceRef: "fx-source-r1",
      customerCommercialTruth: false,
    });
  });

  it.each([
    ["PARTIAL", "CURRENT"],
    ["UNKNOWN", "CURRENT"],
    ["COMPLETE", "STALE"],
    ["COMPLETE", "UNKNOWN"],
  ] as const)("does not strengthen %s/%s source evidence", (population, currentness) => {
    const result = normalizeTechnologyCost({
      source: { ...source, population, currentness },
      targetCurrency: "USD",
      revisionRef: "normalized-r2",
      provenanceRef: "normalizer-policy-r1",
    });
    expect(result).toEqual({ state: "UNKNOWN", reason: "source-cost-evidence-not-qualified" });
  });

  it("does not infer a missing currency conversion", () => {
    expect(normalizeTechnologyCost({ source, targetCurrency: "BRL", revisionRef: "normalized-r3", provenanceRef: "normalizer-policy-r1" }))
      .toEqual({ state: "UNKNOWN", reason: "missing-currency-conversion" });
  });

  it("does not strengthen partial conversion evidence", () => {
    const result = normalizeTechnologyCost({
      source,
      targetCurrency: "BRL",
      revisionRef: "normalized-r4",
      provenanceRef: "normalizer-policy-r1",
      conversion: {
        revisionRef: "fx-r2",
        fromCurrency: "USD",
        toCurrency: "BRL",
        numerator: 5,
        denominator: 1,
        effectiveAt: "2026-09-20T00:00:00Z",
        provenanceRef: "fx-source-r2",
        currentness: "CURRENT",
        population: "PARTIAL",
      },
    });
    expect(result).toEqual({ state: "UNKNOWN", reason: "currency-conversion-not-qualified" });
  });
});

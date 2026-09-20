import assert from "node:assert/strict";
import { describe, it } from "node:test";
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

    assert.equal(result.state, "NORMALIZED");
    if (result.state !== "NORMALIZED") throw new Error("expected normalized cost evidence");
    assert.deepEqual({
      sourceEvidenceRevisionRef: result.evidence.sourceEvidenceRevisionRef,
      sourceRef: result.evidence.sourceRef,
      scopeRef: result.evidence.scopeRef,
      sourceCurrency: result.evidence.sourceCurrency,
      currency: result.evidence.currency,
      amountMinor: result.evidence.amountMinor,
      conversionRevisionRef: result.evidence.conversionRevisionRef,
      conversionProvenanceRef: result.evidence.conversionProvenanceRef,
      customerCommercialTruth: result.evidence.customerCommercialTruth,
    }, {
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

  it("does not strengthen partial, unknown, or stale source evidence", () => {
    const cases: ReadonlyArray<readonly [ProviderCostEvidence["population"], ProviderCostEvidence["currentness"]]> = [
      ["PARTIAL", "CURRENT"],
      ["UNKNOWN", "CURRENT"],
      ["COMPLETE", "STALE"],
      ["COMPLETE", "UNKNOWN"],
    ];
    for (const [population, currentness] of cases) {
      const result = normalizeTechnologyCost({
        source: { ...source, population, currentness },
        targetCurrency: "USD",
        revisionRef: "normalized-r2",
        provenanceRef: "normalizer-policy-r1",
      });
      assert.deepEqual(result, { state: "UNKNOWN", reason: "source-cost-evidence-not-qualified" });
    }
  });

  it("does not infer a missing currency conversion", () => {
    assert.deepEqual(
      normalizeTechnologyCost({ source, targetCurrency: "BRL", revisionRef: "normalized-r3", provenanceRef: "normalizer-policy-r1" }),
      { state: "UNKNOWN", reason: "missing-currency-conversion" },
    );
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
    assert.deepEqual(result, { state: "UNKNOWN", reason: "currency-conversion-not-qualified" });
  });

  it("fails closed when conversion effective time conflicts with source evidence", () => {
    const result = normalizeTechnologyCost({
      source,
      targetCurrency: "BRL",
      revisionRef: "normalized-r5",
      provenanceRef: "normalizer-policy-r1",
      conversion: {
        revisionRef: "fx-r3",
        fromCurrency: "USD",
        toCurrency: "BRL",
        numerator: 5,
        denominator: 1,
        effectiveAt: "2026-09-19T00:00:00Z",
        provenanceRef: "fx-source-r3",
        currentness: "CURRENT",
        population: "COMPLETE",
      },
    });
    assert.deepEqual(result, { state: "UNKNOWN", reason: "currency-conversion-effective-time-conflict" });
  });
});

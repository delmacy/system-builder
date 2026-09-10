import assert from "node:assert/strict";
import test from "node:test";
import {
  DATA_SCHEMA_CONTRACT_VERSION,
  claimMatchesExactOperation,
  decideDirectionalSchemaCompatibility,
  normalizeCanonicalSchemaRevision,
  normalizeDirectionalSchemaCompatibilityClaim,
} from "../../packages/contracts/data-schema/index.js";

const revision = (revisionRef: string) => ({
  contractVersion: "1.0.0" as const,
  semanticOwner: "data-schema",
  semanticKind: "canonical-schema",
  canonicalRef: "customer-record",
  definitionRef: "customer-record-definition",
  revisionOwner: "data-schema",
  revisionDimension: "schema",
  revisionRef,
});

const evidence = () => ({
  extensionVersion: "1.0.0" as const,
  evidenceId: "evidence:compatibility/customer-r1-r2-read",
  sources: [{
    sourceId: "evidence-source:compatibility/customer-r1-r2-read",
    sourceType: "schema-compatibility-test",
    capturedAt: "2026-09-10T10:00:00Z",
  }],
  transformations: [],
  lineage: { predecessorEvidenceIds: [] },
});

const currentness = (
  subject: ReturnType<typeof revision>,
  state: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT" = "CURRENT",
  populationScope = "customers/r1",
) => ({
  contractVersion: "1.0.0" as const,
  subject,
  revisionVector: [{ revisionOwner: "data-schema", revisionDimension: "schema", revisionRef: subject.revisionRef }],
  temporal: {
    occurredAt: null,
    observedAt: "2026-09-10T10:00:00Z",
    evaluatedAt: "2026-09-10T10:01:00Z",
    effectiveFrom: null,
    effectiveUntil: null,
    reconciledAt: "2026-09-10T10:01:00Z",
  },
  populationScope,
  localityScope: "station-a",
  currentnessHorizon: { assessedAt: "2026-09-10T10:01:00Z", validUntil: "2026-09-10T11:01:00Z" },
  state,
  reason: "explicit verification",
});

const claimInput = (overrides: Record<string, unknown> = {}) => {
  const source = revision("r1");
  const target = revision("r2");
  const claimRevision = {
    ...revision("compat-r1-r2-read-v1"),
    semanticKind: "schema-compatibility",
    canonicalRef: "customer-record-r1-r2-read",
    definitionRef: "customer-record-r1-r2-read-claim",
  };
  return {
    contractVersion: DATA_SCHEMA_CONTRACT_VERSION,
    claimRevision,
    sourceRevision: source,
    targetRevision: target,
    direction: "READ",
    state: "COMPATIBLE",
    population: {
      populationScope: "customers/r1",
      producingRevision: source,
      state: "HISTORICAL",
      completeness: "KNOWN",
    },
    evidence: evidence(),
    currentness: currentness(claimRevision),
    ...overrides,
  };
};

test("canonical schema identity remains independent from provider realization ids", () => {
  const canonical = normalizeCanonicalSchemaRevision({
    contractVersion: DATA_SCHEMA_CONTRACT_VERSION,
    schema: revision("r1"),
    providerRealizations: [
      {
        contractVersion: "1.0.0",
        semanticOwner: "data-schema",
        semanticKind: "canonical-schema",
        realizationProvider: "postgres",
        realizationRef: "public.customer_v17",
      },
    ],
  });

  assert.equal(canonical.schema.canonicalRef, "customer-record");
  assert.equal(canonical.schema.revisionRef, "r1");
  assert.equal(canonical.providerRealizations[0]?.realizationRef, "public.customer_v17");
  assert.notEqual(canonical.schema.canonicalRef, canonical.providerRealizations[0]?.realizationRef);
});

test("compatibility is exact-direction and cannot infer reverse or read-to-write compatibility", () => {
  const claim = normalizeDirectionalSchemaCompatibilityClaim(claimInput());
  const source = revision("r1");
  const target = revision("r2");

  assert.equal(claimMatchesExactOperation(claim, source, target, "READ"), true);
  assert.equal(claimMatchesExactOperation(claim, target, source, "READ"), false);
  assert.equal(claimMatchesExactOperation(claim, source, target, "WRITE"), false);
  assert.deepEqual(decideDirectionalSchemaCompatibility(claim), {
    compatible: true,
    reason: "EXPLICIT_CURRENT_COMPATIBILITY",
  });
});

test("historical producing revision remains explicit and revision substitution is rejected", () => {
  const claim = normalizeDirectionalSchemaCompatibilityClaim(claimInput());
  assert.equal(claim.population.state, "HISTORICAL");
  assert.equal(claim.population.producingRevision.revisionRef, "r1");

  assert.throws(
    () => normalizeDirectionalSchemaCompatibilityClaim(claimInput({
      population: {
        populationScope: "customers/r1",
        producingRevision: revision("r0"),
        state: "HISTORICAL",
        completeness: "KNOWN",
      },
    })),
    /producing revision must exactly match/,
  );
});

test("PARTIAL UNKNOWN and INCONCLUSIVE are never promoted to compatible", () => {
  for (const state of ["PARTIAL", "UNKNOWN", "INCONCLUSIVE"] as const) {
    const claim = normalizeDirectionalSchemaCompatibilityClaim(claimInput({ state }));
    assert.deepEqual(decideDirectionalSchemaCompatibility(claim), { compatible: false, reason: "NOT_COMPATIBLE" });
  }

  const partialPopulation = normalizeDirectionalSchemaCompatibilityClaim(claimInput({
    population: {
      populationScope: "customers/r1",
      producingRevision: revision("r1"),
      state: "HISTORICAL",
      completeness: "PARTIAL",
    },
  }));
  assert.deepEqual(decideDirectionalSchemaCompatibility(partialPopulation), {
    compatible: false,
    reason: "POPULATION_NOT_KNOWN",
  });
});

test("stale or UNKNOWN evidence cannot promote compatibility", () => {
  for (const state of ["STALE", "UNKNOWN"] as const) {
    const base = claimInput();
    const claim = normalizeDirectionalSchemaCompatibilityClaim({
      ...base,
      currentness: currentness(base.claimRevision, state),
    });
    assert.deepEqual(decideDirectionalSchemaCompatibility(claim), {
      compatible: false,
      reason: "NON_CURRENT_EVIDENCE",
    });
  }
});

test("evidence and currentness are normalized and bound to the declared population", () => {
  const claim = normalizeDirectionalSchemaCompatibilityClaim(claimInput());
  assert.equal(claim.evidence.evidenceId, "evidence:compatibility/customer-r1-r2-read");
  assert.equal(claim.currentness.populationScope, claim.population.populationScope);

  const base = claimInput();
  assert.throws(
    () => normalizeDirectionalSchemaCompatibilityClaim({
      ...base,
      currentness: currentness(base.claimRevision, "CURRENT", "customers/other"),
    }),
    /population scope must exactly match/,
  );

  assert.throws(
    () => normalizeDirectionalSchemaCompatibilityClaim(claimInput({
      evidence: { ...evidence(), evidenceId: "not a uri" },
    })),
    /Invalid evidence provenance/,
  );
});

test("provider-id canonicalization and incompatible canonical definitions are rejected", () => {
  assert.throws(
    () => normalizeCanonicalSchemaRevision({
      contractVersion: DATA_SCHEMA_CONTRACT_VERSION,
      schema: revision("r1"),
      providerRealizations: [{
        contractVersion: "1.0.0",
        semanticOwner: "provider-native",
        semanticKind: "table",
        realizationProvider: "postgres",
        realizationRef: "public.customer",
      }],
    }),
    /preserve schema semantic owner and kind/,
  );

  assert.throws(
    () => normalizeDirectionalSchemaCompatibilityClaim(claimInput({
      targetRevision: { ...revision("r2"), canonicalRef: "different-schema" },
    })),
    /same canonical schema definition/,
  );
});

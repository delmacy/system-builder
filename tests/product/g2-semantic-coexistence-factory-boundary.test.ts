import assert from "node:assert/strict";
import test from "node:test";

import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  normalizeFactoryJourneyEnvelope,
} from "../../packages/contracts/factory-boundary/index.js";
import {
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeCurrentnessQualification,
  normalizeSemanticIdentity,
} from "../../packages/contracts/semantic-substrate/index.js";

const journey = {
  contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
  stages: [
    { kind: "approved-process", identityRef: "process:orders:r2", provenanceRef: "process:orders" },
    { kind: "analysis-definition", identityRef: "analysis:orders:r2", provenanceRef: "process:orders:r2" },
    { kind: "capability-assembly", identityRef: "assembly:orders:r2", provenanceRef: "system-definition:orders:r2" },
    { kind: "validation", identityRef: "validation:orders:r2", provenanceRef: "assembly:orders:r2" },
    { kind: "compiler-release", identityRef: "release:orders:r2", provenanceRef: "validation:orders:r2" },
    { kind: "deployment", identityRef: "deployment:orders:r2", provenanceRef: "release:orders:r2" },
  ],
} as const;

const semanticSubject = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "factory-boundary",
  semanticKind: "factory-journey",
  canonicalRef: "factory-journey:orders:r2",
} as const;

function qualifyFactoryJourney(input: { journey: unknown; semanticSubject: unknown; currentness: unknown }) {
  const canonicalJourney = normalizeFactoryJourneyEnvelope(input.journey);
  const subject = normalizeSemanticIdentity(input.semanticSubject);
  const currentness = normalizeCurrentnessQualification(input.currentness);

  if (subject.semanticOwner !== "factory-boundary") {
    throw new Error("factory semantic subject must remain owned by factory-boundary");
  }
  if (subject.semanticKind !== "factory-journey") {
    throw new Error("factory semantic subject must use factory-journey kind");
  }
  if (JSON.stringify(currentness.subject) !== JSON.stringify(subject)) {
    throw new Error("currentness subject must exactly match the factory semantic subject");
  }

  return Object.freeze({ canonicalJourney, subject, currentness });
}

function currentness(state: "CURRENT" | "STALE" | "UNKNOWN") {
  return {
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    subject: semanticSubject,
    revisionVector: [],
    temporal: {
      occurredAt: null,
      observedAt: "2026-09-07T21:00:00Z",
      evaluatedAt: "2026-09-07T21:01:00Z",
      effectiveFrom: null,
      effectiveUntil: null,
      reconciledAt: null,
    },
    populationScope: "factory:orders",
    localityScope: "station:alpha",
    currentnessHorizon: {
      assessedAt: "2026-09-07T21:01:00Z",
      validUntil: "2026-09-07T22:01:00Z",
    },
    state,
    reason: `semantic qualification is ${state.toLowerCase()}`,
  } as const;
}

test("factory journey lineage remains canonical while semantic qualification is additive", () => {
  const bound = qualifyFactoryJourney({ journey, semanticSubject, currentness: currentness("CURRENT") });

  assert.deepEqual(bound.canonicalJourney.stages, journey.stages);
  assert.equal(bound.canonicalJourney.stages[4]!.identityRef, "release:orders:r2");
  assert.equal(bound.canonicalJourney.stages[5]!.provenanceRef, "release:orders:r2");
  assert.equal(bound.subject.semanticOwner, "factory-boundary");
  assert.equal(bound.currentness.state, "CURRENT");
});

test("equal realization labels cannot collapse owner-qualified semantic identity", () => {
  const factory = normalizeSemanticIdentity(semanticSubject);
  const runtime = normalizeSemanticIdentity({
    ...semanticSubject,
    semanticOwner: "runtime-core",
    semanticKind: "runtime-realization",
  });

  assert.equal(factory.canonicalRef, runtime.canonicalRef);
  assert.notDeepEqual(factory, runtime);
  assert.notEqual(factory.semanticOwner, runtime.semanticOwner);
});

test("owner substitution and mismatched currentness fail closed", () => {
  assert.throws(
    () => qualifyFactoryJourney({ journey, semanticSubject: { ...semanticSubject, semanticOwner: "runtime-core" }, currentness: currentness("CURRENT") }),
    /must remain owned by factory-boundary/,
  );

  assert.throws(
    () => qualifyFactoryJourney({ journey, semanticSubject, currentness: { ...currentness("CURRENT"), subject: { ...semanticSubject, canonicalRef: "factory-journey:other" } } }),
    /currentness subject must exactly match/,
  );
});

test("stale or unknown semantic currentness cannot rewrite factory lineage or imply execution authority", () => {
  const stale = qualifyFactoryJourney({ journey, semanticSubject, currentness: currentness("STALE") });
  const unknown = qualifyFactoryJourney({ journey, semanticSubject, currentness: currentness("UNKNOWN") });

  for (const qualified of [stale, unknown]) {
    assert.deepEqual(qualified.canonicalJourney.stages, journey.stages);
    assert.equal(qualified.canonicalJourney.stages[5]!.identityRef, "deployment:orders:r2");
    assert.equal("executionAuthority" in qualified.subject, false);
    assert.equal("builderAuthority" in qualified.subject, false);
    assert.equal("runtimeAuthority" in qualified.subject, false);
  }
  assert.equal(stale.currentness.state, "STALE");
  assert.equal(unknown.currentness.state, "UNKNOWN");
});

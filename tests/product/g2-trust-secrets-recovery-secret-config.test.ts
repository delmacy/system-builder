import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeConsumerEffectiveSecretConfigState,
  normalizeDesiredSecretConfigState,
  normalizeMaterializedSecretConfigState,
  normalizeSecretConfigReference,
} from "../../packages/contracts/identity-authorization/secret-config.js";

const revision = (canonicalRef: string, definitionRef: string, revisionRef: string) => ({
  contractVersion: "1.0.0",
  semanticOwner: "g2-wp04",
  semanticKind: "secret-config",
  canonicalRef,
  definitionRef,
  revisionOwner: "g2-wp04",
  revisionDimension: "definition",
  revisionRef,
});

const locality = { scopeKind: "STATION", localityRef: "station-a" } as const;

const currentness = (subject: ReturnType<typeof revision>, state: "CURRENT" | "STALE" | "UNKNOWN" = "CURRENT") => ({
  contractVersion: "1.0.0",
  subject,
  revisionVector: [],
  temporal: {
    occurredAt: null,
    observedAt: "2026-09-10T01:00:00Z",
    evaluatedAt: null,
    effectiveFrom: null,
    effectiveUntil: null,
    reconciledAt: null,
  },
  populationScope: "consumer-set-a",
  localityScope: locality.localityRef,
  currentnessHorizon: {
    assessedAt: "2026-09-10T01:00:00Z",
    validUntil: "2026-09-10T02:00:00Z",
  },
  state,
  reason: "product proof",
});

const referenceDefinition = revision("secret/db-password", "db-password", "r1");
const desiredRevision = revision("secret/db-password", "db-password", "r2");
const materializedGeneration = revision("secret/db-password", "db-password", "r1");
const materializationEvidence = revision("evidence/materialization", "materialization", "e1");
const consumerEvidence = revision("evidence/consumer", "consumer", "e1");

const reference = {
  contractVersion: "1.0.0",
  definition: referenceDefinition,
  providerRealizationRef: "vault/path/db-password#42",
};

const desired = {
  contractVersion: "1.0.0",
  reference,
  desiredRevision,
  presence: "VALUE_REF",
  locality,
};

const materialized = {
  contractVersion: "1.0.0",
  desired,
  materializedGeneration,
  evidence: materializationEvidence,
  currentness: currentness(materializationEvidence),
  locality,
};

test("TASK-501 keeps desired, materialized, and consumer-effective state distinct", () => {
  const normalizedDesired = normalizeDesiredSecretConfigState(desired);
  const normalizedMaterialized = normalizeMaterializedSecretConfigState(materialized);
  const effective = normalizeConsumerEffectiveSecretConfigState({
    contractVersion: "1.0.0",
    materialized,
    consumerPopulation: "consumer-set-a",
    effectiveGeneration: materializedGeneration,
    adoption: "CURRENT",
    evidence: consumerEvidence,
    currentness: currentness(consumerEvidence),
    locality,
  });

  assert.equal(normalizedDesired.desiredRevision.revisionRef, "r2");
  assert.equal(normalizedMaterialized.materializedGeneration.revisionRef, "r1");
  assert.equal(effective.adoption, "CURRENT");
});

test("TASK-501 preserves presence intent and rejects embedded secret material", () => {
  for (const presence of ["VALUE_REF", "ABSENT", "NULL", "DEFAULT", "DELETE"] as const) {
    assert.equal(normalizeDesiredSecretConfigState({ ...desired, presence }).presence, presence);
  }
  assert.throws(() => normalizeSecretConfigReference({ ...reference, secretValue: "forbidden" }));
  assert.throws(() => normalizeSecretConfigReference({ ...reference, privateKey: "forbidden" }));
});

test("TASK-501 rejects provider canonicalization and revision substitution", () => {
  assert.throws(() =>
    normalizeSecretConfigReference({
      ...reference,
      providerRealizationRef: referenceDefinition.canonicalRef,
    }),
  );
  assert.throws(() =>
    normalizeDesiredSecretConfigState({
      ...desired,
      desiredRevision: revision("secret/other", "other", "r2"),
    }),
  );
  assert.throws(() =>
    normalizeMaterializedSecretConfigState({
      ...materialized,
      materializedGeneration: revision("secret/other", "other", "r1"),
    }),
  );
});

test("TASK-501 does not promote unknown or acknowledged materialization to effective success", () => {
  const unknown = normalizeConsumerEffectiveSecretConfigState({
    contractVersion: "1.0.0",
    materialized,
    consumerPopulation: "consumer-set-a",
    effectiveGeneration: materializedGeneration,
    adoption: "UNKNOWN",
    evidence: consumerEvidence,
    currentness: currentness(consumerEvidence, "UNKNOWN"),
    locality,
  });
  assert.equal(unknown.adoption, "UNKNOWN");

  assert.throws(() =>
    normalizeConsumerEffectiveSecretConfigState({
      contractVersion: "1.0.0",
      materialized,
      consumerPopulation: "consumer-set-a",
      effectiveGeneration: desiredRevision,
      adoption: "CURRENT",
      evidence: consumerEvidence,
      currentness: currentness(consumerEvidence),
      locality,
      acknowledgement: "ACK",
    }),
  );
});

test("TASK-501 rejects locality strengthening and effective revision substitution", () => {
  assert.throws(() =>
    normalizeConsumerEffectiveSecretConfigState({
      contractVersion: "1.0.0",
      materialized,
      consumerPopulation: "consumer-set-a",
      effectiveGeneration: materializedGeneration,
      adoption: "CURRENT",
      evidence: consumerEvidence,
      currentness: currentness(consumerEvidence),
      locality: { scopeKind: "FLEET", localityRef: "station-a" },
    }),
  );
  assert.throws(() =>
    normalizeConsumerEffectiveSecretConfigState({
      contractVersion: "1.0.0",
      materialized,
      consumerPopulation: "consumer-set-a",
      effectiveGeneration: revision("secret/other", "other", "r1"),
      adoption: "PARTIAL",
      evidence: consumerEvidence,
      currentness: currentness(consumerEvidence),
      locality,
    }),
  );
});

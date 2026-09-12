import assert from "node:assert/strict";
import test from "node:test";

import { type DrainageAssumptions, type FiniteFlowPopulationIdentity } from "../../packages/contracts/finite-flow/finite-flow.js";
import type { UnitReference } from "../../packages/contracts/mathematical-semantics/index.js";
import { STORAGE_DISPOSITION_CONTRACT_VERSION, assessStorageDisposition, normalizeStorageDispositionEvidence } from "../../packages/contracts/storage/storage-disposition.js";
import { STORAGE_IDENTITY_CONTRACT_VERSION, assessCanonicalAvailability, identitiesShareIntegrityEvidence, normalizeCanonicalStorageIdentity } from "../../packages/contracts/storage/storage-identity.js";
import { STORAGE_TRANSFER_CONTRACT_VERSION, assessQualifiedProviderCopyAvailability, normalizeStorageTransferEvidence, retryDisposition } from "../../packages/contracts/storage/storage-transfer.js";

const now = "2026-09-12T12:00:00Z";
const currentness = { state: "CURRENT", assessedAt: "2026-09-12T00:00:00Z", validUntil: "2026-09-13T00:00:00Z" } as const;
const rateUnit: UnitReference = {
  state: "KNOWN",
  unitRef: "copies-per-second",
  unitRevision: "1",
  dimension: { terms: [{ axis: "copy", exponent: 1 }, { axis: "time", exponent: -1 }] },
};
const population: FiniteFlowPopulationIdentity = { queueRef: "queue:storage", populationRef: "object:1:copies", scopeRef: "tenant:1" };

const identity = normalizeCanonicalStorageIdentity({
  contractVersion: STORAGE_IDENTITY_CONTRACT_VERSION,
  canonicalObjectRef: "object:1",
  canonicalRevisionRef: "object:1:r7",
  objectKind: "DOCUMENT",
  sourceOfTruth: { authorityRef: "authority:documents", authorityRevisionRef: "authority:documents:r4", providerCopyRef: "copy:source" },
  providerCopies: [
    { copyRef: "copy:source", providerRef: "provider:a", providerKey: "same-key", copyRevisionRef: "copy:source:r1", transportAttemptRef: "attempt:source", integrity: { algorithm: "sha256", digest: "same-digest" }, lifecycle: "ACTIVE", availability: "AVAILABLE", completeness: "KNOWN", currentness },
    { copyRef: "copy:residual", providerRef: "provider:b", providerKey: "residual-key", copyRevisionRef: "copy:residual:r1", transportAttemptRef: "attempt:residual", integrity: { algorithm: "sha256", digest: "residual-digest" }, lifecycle: "RESIDUAL", availability: "AVAILABLE", completeness: "KNOWN", currentness },
  ],
});

const transfer = (overrides: Record<string, unknown> = {}) => normalizeStorageTransferEvidence({
  contractVersion: STORAGE_TRANSFER_CONTRACT_VERSION,
  transferRef: "transfer:1",
  attemptRef: "attempt:1",
  lineageRootRef: "lineage:1",
  predecessorAttemptRef: null,
  canonicalObjectRef: "object:1",
  canonicalRevisionRef: "object:1:r7",
  providerCopyRef: "copy:source",
  providerRef: "provider:a",
  mode: "COMPLETE",
  state: "COMPLETED",
  acknowledgedAt: now,
  integrityVerified: true,
  durabilityEvidenceRef: "durability:1",
  resumeCheckpointRef: null,
  completeness: "KNOWN",
  currentness,
  providerQualification: { providerRef: "provider:a", qualificationRevisionRef: "qualification:r3", state: "QUALIFIED", currentness },
  ...overrides,
});

const flow = (items: number, overrides: Partial<DrainageAssumptions> = {}): DrainageAssumptions => ({
  horizonMs: 1000,
  arrival: { value: 1, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  service: { value: 5, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items, knowledge: "KNOWN", telemetryComplete: true },
  replay: { requestedItems: 0, maximumReplayItems: 2, deduplicationBoundItems: 2 },
  ...overrides,
});

const disposition = (residualRefs: readonly string[], overrides: Record<string, unknown> = {}) => normalizeStorageDispositionEvidence({
  contractVersion: STORAGE_DISPOSITION_CONTRACT_VERSION,
  dispositionRef: "disposition:1",
  canonicalObjectRef: "object:1",
  canonicalRevisionRef: "object:1:r7",
  target: {
    populationRef: population.populationRef,
    scopeRef: population.scopeRef,
    authorityRef: "authority:documents",
    authorityRevisionRef: "authority:documents:r4",
    providerCopyRefs: ["copy:residual"],
    transferLineageRefs: ["lineage:1"],
  },
  acknowledgedCopyRefs: ["copy:residual"],
  residualCohorts: [{ cohortRef: "cohort:1", populationRef: population.populationRef, scopeRef: population.scopeRef, providerCopyRefs: residualRefs, knowledge: "KNOWN", telemetryComplete: true }],
  knowledge: "KNOWN",
  sourceOfTruthEvidencePreserved: true,
  lifecycleEvidencePreserved: true,
  ...overrides,
});

test("TASK-526 composes canonical identity, qualified transfer and explicit zero-residual finite drainage", () => {
  assert.equal(assessCanonicalAvailability(identity, now), "AVAILABLE");
  assert.equal(assessQualifiedProviderCopyAvailability(transfer(), now), "AVAILABLE");
  const result = assessStorageDisposition(identity, disposition([]), population, flow(0));
  assert.equal(result.valid, true);
  assert.equal(result.residualCopyCount, 0);
  assert.equal(result.drainage, "DRAINED");
});

test("TASK-526 provider key/hash equality never collapses canonical identity or authority", () => {
  const other = normalizeCanonicalStorageIdentity({
    contractVersion: STORAGE_IDENTITY_CONTRACT_VERSION,
    canonicalObjectRef: "object:2",
    canonicalRevisionRef: "object:2:r1",
    objectKind: "DOCUMENT",
    sourceOfTruth: { authorityRef: "authority:other", authorityRevisionRef: "authority:other:r1", providerCopyRef: "copy:other" },
    providerCopies: [{ copyRef: "copy:other", providerRef: "provider:a", providerKey: "same-key", copyRevisionRef: "copy:other:r1", transportAttemptRef: "attempt:other", integrity: { algorithm: "sha256", digest: "same-digest" }, lifecycle: "ACTIVE", availability: "AVAILABLE", completeness: "KNOWN", currentness }],
  });
  assert.equal(identitiesShareIntegrityEvidence(identity, other), true);
  assert.notEqual(identity.canonicalObjectRef, other.canonicalObjectRef);
  assert.notEqual(identity.sourceOfTruth.authorityRef, other.sourceOfTruth.authorityRef);
});

test("TASK-526 ACK without qualified integrity/durability evidence never strengthens availability and unsafe uncertainty reconciles before retry", () => {
  const ackOnly = transfer({ state: "ACKNOWLEDGED", integrityVerified: null, durabilityEvidenceRef: null });
  assert.notEqual(assessQualifiedProviderCopyAvailability(ackOnly, now), "AVAILABLE");
  assert.equal(retryDisposition(ackOnly, now), "RECONCILE_REQUIRED");

  for (const completeness of ["PARTIAL", "UNKNOWN"] as const) {
    const uncertain = transfer({ completeness, state: "UNKNOWN", integrityVerified: null, durabilityEvidenceRef: null });
    assert.equal(assessQualifiedProviderCopyAvailability(uncertain, now), "UNKNOWN");
    assert.equal(retryDisposition(uncertain, now), "RECONCILE_REQUIRED");
  }
});

test("TASK-526 deletion ACK preserves residual visibility and cannot manufacture drainage", () => {
  const result = assessStorageDisposition(identity, disposition(["copy:residual"]), population, flow(1));
  assert.equal(result.residualCopyCount, 1);
  assert.equal(result.drainage, "DRAINABLE");
  assert.notEqual(result.drainage, "DRAINED");

  const unknown = assessStorageDisposition(identity, disposition([], { knowledge: "PARTIAL" }), population, flow(0));
  assert.equal(unknown.residualCopyCount, null);
  assert.equal(unknown.drainage, "UNKNOWN");
});

test("TASK-526 rejects population/currentness gaps and replay beyond the qualified finite-flow bound", () => {
  const staleTransfer = transfer({ currentness: { ...currentness, state: "STALE" } });
  assert.equal(assessQualifiedProviderCopyAvailability(staleTransfer, now), "UNKNOWN");
  assert.equal(retryDisposition(staleTransfer, now), "RECONCILE_REQUIRED");

  const wrongPopulation = { ...population, populationRef: "other-population" };
  assert.equal(assessStorageDisposition(identity, disposition(["copy:residual"]), wrongPopulation, flow(1)).drainage, "INVALID");

  const unboundedReplay = flow(1, { replay: { requestedItems: 3, maximumReplayItems: 3, deduplicationBoundItems: 2 } });
  const replayResult = assessStorageDisposition(identity, disposition(["copy:residual"]), population, unboundedReplay);
  assert.equal(replayResult.drainage, "INVALID");
  assert.ok(replayResult.reasons.includes("FINITE_FLOW_REPLAY_EXCEEDS_DEDUPLICATION_BOUND"));
});

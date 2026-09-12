import assert from "node:assert/strict";
import test from "node:test";

import type { DrainageAssumptions, FiniteFlowPopulationIdentity } from "../../packages/contracts/finite-flow/finite-flow.js";
import type { UnitReference } from "../../packages/contracts/mathematical-semantics/index.js";
import {
  providerAckProvesBusinessEffect,
  retryDisposition,
  type BusinessEffectEvidence,
  type DeliveryAttemptEvidence,
} from "../../packages/contracts/messaging/messaging-delivery-effect.js";
import {
  evidenceCanStrengthenMessagingCurrentness,
  normalizeMessagingIdentityEnvelope,
  sameCanonicalOccurrence,
  type EventOccurrenceIdentity,
  type MessagingIdentityEnvelope,
} from "../../packages/contracts/messaging/messaging-identity.js";
import {
  assessMessagingRecovery,
  compareOrderingEvidence,
  deriveBatchAggregate,
  dlqMovementProvesResolution,
  orderingEvidenceProvesGlobalOrder,
  replayPreservesCanonicalLineage,
  type OrderingEvidence,
  type ReplayEvidence,
  type ResidualReplayCohort,
} from "../../packages/contracts/messaging/messaging-ordering-replay.js";

const evaluatedAt = "2026-09-12T12:00:00Z";
const currentness = {
  state: "CURRENT" as const,
  assessedAt: "2026-09-12T00:00:00Z",
  validUntil: "2026-09-13T00:00:00Z",
};

const identityInput = (): MessagingIdentityEnvelope => normalizeMessagingIdentityEnvelope({
  contractVersion: "1.0.0",
  occurrence: {
    occurrenceRef: "occurrence:42",
    producerRef: "producer:billing",
    sourceRef: "source:invoice",
    subjectRef: "subject:invoice:42",
    producingRevisionRef: "revision:17",
    lineageRootOccurrenceRef: "occurrence:42",
    parentOccurrenceRef: null,
    completeness: "KNOWN",
    currentness,
  },
  message: {
    messageRef: "message:42",
    occurrenceRef: "occurrence:42",
    producingRevisionRef: "revision:17",
    providerEvidence: { providerRef: "provider:queue", providerMessageRef: "provider-message:42" },
  },
  subscription: {
    subscriptionRef: "subscription:invoice-worker",
    subscriptionRevisionRef: "subscription-revision:3",
    subscriberRef: "worker:invoice",
    subjectRef: "subject:invoice:42",
    completeness: "KNOWN",
    currentness,
  },
});

const delivery = (overrides: Partial<DeliveryAttemptEvidence> = {}): DeliveryAttemptEvidence => ({
  deliveryRef: "delivery:42:1",
  attemptRef: "attempt:42:1",
  messageRef: "message:42",
  occurrenceRef: "occurrence:42",
  subscriptionRef: "subscription:invoice-worker",
  providerRef: "provider:queue",
  providerQualificationRef: "qualification:queue:1",
  providerCurrentness: currentness,
  attemptOutcome: "ACKNOWLEDGED",
  providerAckRef: "ack:42:1",
  completeness: "KNOWN",
  ...overrides,
});

const effect = (overrides: Partial<BusinessEffectEvidence> = {}): BusinessEffectEvidence => ({
  effectRef: "effect:invoice:42",
  occurrenceRef: "occurrence:42",
  authorityRef: "invoice-ledger",
  authorityRevisionRef: "ledger-revision:8",
  scopeRef: "tenant:1",
  payloadFingerprint: "sha256:invoice-42",
  idempotencyRef: "idempotency:invoice:42",
  idempotencyScopeRef: "tenant:1",
  idempotencyValidUntil: "2026-09-13T00:00:00Z",
  state: "NOT_OBSERVED",
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

const ordering = (overrides: Partial<OrderingEvidence> = {}): OrderingEvidence => ({
  scopeRef: "tenant:1",
  partitionRef: "partition:invoice",
  epochRef: "epoch:9",
  sequence: 42,
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

const replay = (occurrence: EventOccurrenceIdentity, overrides: Partial<ReplayEvidence> = {}): ReplayEvidence => ({
  replayRef: "replay:42",
  occurrenceRef: occurrence.occurrenceRef,
  lineageRootOccurrenceRef: occurrence.lineageRootOccurrenceRef,
  producingRevisionRef: occurrence.producingRevisionRef,
  replayMessageRef: "message:42:replay",
  priorDeliveryRefs: ["delivery:42:1"],
  requestedAt: "2026-09-12T11:30:00Z",
  validUntil: "2026-09-12T13:00:00Z",
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

const rateUnit: UnitReference = {
  state: "KNOWN",
  unitRef: "messages-per-second",
  unitRevision: "1",
  dimension: { terms: [{ axis: "message", exponent: 1 }, { axis: "time", exponent: -1 }] },
};
const population: FiniteFlowPopulationIdentity = {
  queueRef: "queue:invoice-replay",
  populationRef: "population:invoice-replay",
  scopeRef: "tenant:1",
};
const flow = (overrides: Partial<DrainageAssumptions> = {}): DrainageAssumptions => ({
  horizonMs: 2000,
  arrival: { value: 1, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  service: { value: 5, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items: 2, knowledge: "KNOWN", telemetryComplete: true },
  replay: { requestedItems: 1, maximumReplayItems: 2, deduplicationBoundItems: 2 },
  ...overrides,
});
const cohorts = (overrides: Partial<ResidualReplayCohort> = {}): readonly ResidualReplayCohort[] => [{
  cohortRef: "cohort:invoice:1",
  populationRef: population.populationRef,
  scopeRef: population.scopeRef,
  items: 2,
  knowledge: "KNOWN",
  telemetryComplete: true,
  observedAt: evaluatedAt,
  ...overrides,
}];

test("TASK-530 positive composition preserves identity lineage while transport ACK remains non-authoritative", () => {
  const identity = identityInput();
  const replayEvidence = replay(identity.occurrence);

  assert.equal(evidenceCanStrengthenMessagingCurrentness(identity.occurrence.completeness, identity.occurrence.currentness, evaluatedAt), true);
  assert.equal(sameCanonicalOccurrence(identity, identity), true);
  assert.equal(replayPreservesCanonicalLineage(identity.occurrence, replayEvidence, [delivery()], evaluatedAt), true);
  assert.equal(providerAckProvesBusinessEffect(delivery()), false);
  assert.equal(retryDisposition(delivery(), effect(), evaluatedAt), "RECONCILE_BEFORE_RETRY");
  assert.equal(dlqMovementProvesResolution({
    movementRef: "dlq:42",
    occurrenceRef: identity.occurrence.occurrenceRef,
    messageRef: identity.message.messageRef,
    providerAckRef: "ack:dlq:42",
    completeness: "KNOWN",
    currentness,
  }), false);
});

test("TASK-530 historical replay cannot rewrite occurrence revision or lineage", () => {
  const identity = identityInput();
  assert.equal(replayPreservesCanonicalLineage(identity.occurrence, replay(identity.occurrence), [delivery()], evaluatedAt), true);
  assert.equal(replayPreservesCanonicalLineage(identity.occurrence, replay(identity.occurrence, { occurrenceRef: "occurrence:new" }), [delivery()], evaluatedAt), false);
  assert.equal(replayPreservesCanonicalLineage(identity.occurrence, replay(identity.occurrence, { producingRevisionRef: "revision:new" }), [delivery()], evaluatedAt), false);
  assert.equal(replayPreservesCanonicalLineage(identity.occurrence, replay(identity.occurrence, { lineageRootOccurrenceRef: "occurrence:other-root" }), [delivery()], evaluatedAt), false);
});

test("TASK-530 ordering stays partition and epoch qualified and never proves global order", () => {
  assert.equal(compareOrderingEvidence(ordering({ sequence: 41 }), ordering({ sequence: 42 }), evaluatedAt), "BEFORE");
  assert.equal(compareOrderingEvidence(ordering(), ordering({ partitionRef: "partition:other" }), evaluatedAt), "UNKNOWN");
  assert.equal(compareOrderingEvidence(ordering(), ordering({ epochRef: "epoch:10" }), evaluatedAt), "UNKNOWN");
  assert.equal(orderingEvidenceProvesGlobalOrder(ordering(), ordering({ partitionRef: "partition:other" })), false);
});

test("TASK-530 PARTIAL and UNKNOWN remain visible across batch and retry decisions", () => {
  assert.equal(deriveBatchAggregate([
    { itemRef: "item:1", occurrenceRef: "occurrence:1", state: "SUCCEEDED" },
    { itemRef: "item:2", occurrenceRef: "occurrence:2", state: "PARTIAL" },
  ]), "PARTIAL");
  assert.equal(deriveBatchAggregate([
    { itemRef: "item:1", occurrenceRef: "occurrence:1", state: "SUCCEEDED" },
    { itemRef: "item:2", occurrenceRef: "occurrence:2", state: "UNKNOWN" },
  ]), "UNKNOWN");
  assert.equal(retryDisposition(delivery({ attemptOutcome: "UNKNOWN" }), effect({ state: "UNKNOWN" }), evaluatedAt), "RECONCILE_BEFORE_RETRY");
  assert.equal(retryDisposition(delivery({ attemptOutcome: "REJECTED", completeness: "PARTIAL" }), effect(), evaluatedAt), "RECONCILE_BEFORE_RETRY");
});

test("TASK-530 unsafe ambiguous delivery reconciles before retry while authoritative rejection can retry", () => {
  assert.equal(retryDisposition(delivery({ attemptOutcome: "TIMEOUT", providerAckRef: null }), effect(), evaluatedAt), "RECONCILE_BEFORE_RETRY");
  assert.equal(retryDisposition(delivery({ attemptOutcome: "ACKNOWLEDGED" }), effect({ state: "NOT_OBSERVED" }), evaluatedAt), "RECONCILE_BEFORE_RETRY");
  assert.equal(retryDisposition(delivery({ attemptOutcome: "REJECTED", providerAckRef: null }), effect({ state: "NOT_OBSERVED" }), evaluatedAt), "SAFE_RETRY");
  assert.equal(retryDisposition(delivery({ attemptOutcome: "REJECTED", providerCurrentness: { ...currentness, state: "STALE" } }), effect(), evaluatedAt), "RECONCILE_BEFORE_RETRY");
});

test("TASK-530 recovery proves drainage only with qualified residual population telemetry units and time", () => {
  const healthy = assessMessagingRecovery(population, flow(), cohorts());
  assert.equal(healthy.valid, true);
  assert.equal(healthy.drainable, true);
  assert.equal(healthy.residualItemsUpperBound, 0);

  const telemetryGap = assessMessagingRecovery(
    population,
    flow({ backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items: 0, knowledge: "KNOWN", telemetryComplete: false } }),
    cohorts({ items: 0, telemetryComplete: false }),
  );
  assert.equal(telemetryGap.valid, false);
  assert.equal(telemetryGap.drainable, false);
  assert.ok(telemetryGap.reasons.includes("BACKLOG_TELEMETRY_INCOMPLETE"));
  assert.ok(telemetryGap.reasons.includes("RESIDUAL_COHORT_TELEMETRY_INCOMPLETE"));

  const wrongPopulation = assessMessagingRecovery(population, flow(), cohorts({ populationRef: "population:other" }));
  assert.equal(wrongPopulation.drainable, false);
  assert.ok(wrongPopulation.reasons.includes("RESIDUAL_COHORT_POPULATION_OR_SCOPE_MISMATCH"));

  const partialResidual = assessMessagingRecovery(population, flow(), cohorts({ knowledge: "PARTIAL" }));
  assert.equal(partialResidual.drainable, false);
  assert.ok(partialResidual.reasons.includes("RESIDUAL_COHORT_NOT_KNOWN"));
});

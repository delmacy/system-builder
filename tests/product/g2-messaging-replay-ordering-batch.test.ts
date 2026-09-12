import assert from "node:assert/strict";
import test from "node:test";

import type { DrainageAssumptions, FiniteFlowPopulationIdentity } from "../../packages/contracts/finite-flow/finite-flow.js";
import type { UnitReference } from "../../packages/contracts/mathematical-semantics/index.js";
import type { DeliveryAttemptEvidence } from "../../packages/contracts/messaging/messaging-delivery-effect.js";
import type { EventOccurrenceIdentity } from "../../packages/contracts/messaging/messaging-identity.js";
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

const currentness = { state: "CURRENT" as const, assessedAt: "2026-09-12T00:00:00Z", validUntil: "2026-09-13T00:00:00Z" };
const evaluatedAt = "2026-09-12T12:00:00Z";

const ordering = (overrides: Partial<OrderingEvidence> = {}): OrderingEvidence => ({
  scopeRef: "tenant:1",
  partitionRef: "partition:1",
  epochRef: "epoch:7",
  sequence: 10,
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

test("TASK-529 ordering is comparable only inside explicit scope partition and epoch", () => {
  assert.equal(compareOrderingEvidence(ordering({ sequence: 10 }), ordering({ sequence: 11 }), evaluatedAt), "BEFORE");
  assert.equal(compareOrderingEvidence(ordering({ partitionRef: "partition:1" }), ordering({ partitionRef: "partition:2" }), evaluatedAt), "UNKNOWN");
  assert.equal(compareOrderingEvidence(ordering({ epochRef: "epoch:7" }), ordering({ epochRef: "epoch:8" }), evaluatedAt), "UNKNOWN");
  assert.equal(orderingEvidenceProvesGlobalOrder(ordering(), ordering({ partitionRef: "partition:2" })), false);
});

test("TASK-529 stale partial or unknown ordering evidence cannot strengthen order", () => {
  assert.equal(compareOrderingEvidence(ordering({ completeness: "PARTIAL" }), ordering({ sequence: 11 }), evaluatedAt), "UNKNOWN");
  assert.equal(compareOrderingEvidence(ordering({ currentness: { ...currentness, state: "STALE" } }), ordering({ sequence: 11 }), evaluatedAt), "UNKNOWN");
});

const occurrence: EventOccurrenceIdentity = {
  occurrenceRef: "occurrence:1",
  producerRef: "producer:1",
  sourceRef: "source:1",
  subjectRef: "subject:1",
  producingRevisionRef: "revision:4",
  lineageRootOccurrenceRef: "occurrence:1",
  parentOccurrenceRef: null,
  completeness: "KNOWN",
  currentness,
};

const delivery = (deliveryRef: string): DeliveryAttemptEvidence => ({
  deliveryRef,
  attemptRef: `attempt:${deliveryRef}`,
  messageRef: "message:1",
  occurrenceRef: occurrence.occurrenceRef,
  subscriptionRef: "subscription:1",
  providerRef: "provider:1",
  providerQualificationRef: "qualification:1",
  providerCurrentness: currentness,
  attemptOutcome: "ACKNOWLEDGED",
  providerAckRef: `ack:${deliveryRef}`,
  completeness: "KNOWN",
});

const replay = (overrides: Partial<ReplayEvidence> = {}): ReplayEvidence => ({
  replayRef: "replay:1",
  occurrenceRef: occurrence.occurrenceRef,
  lineageRootOccurrenceRef: occurrence.lineageRootOccurrenceRef,
  producingRevisionRef: occurrence.producingRevisionRef,
  replayMessageRef: "message:replay:1",
  priorDeliveryRefs: ["delivery:1", "delivery:2"],
  requestedAt: "2026-09-12T11:00:00Z",
  validUntil: "2026-09-12T13:00:00Z",
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

test("TASK-529 replay preserves canonical occurrence revision lineage and prior delivery evidence", () => {
  const deliveries = [delivery("delivery:1"), delivery("delivery:2")];
  assert.equal(replayPreservesCanonicalLineage(occurrence, replay(), deliveries, evaluatedAt), true);
  assert.equal(replayPreservesCanonicalLineage(occurrence, replay({ occurrenceRef: "occurrence:new" }), deliveries, evaluatedAt), false);
  assert.equal(replayPreservesCanonicalLineage(occurrence, replay({ producingRevisionRef: "revision:new" }), deliveries, evaluatedAt), false);
  assert.equal(replayPreservesCanonicalLineage(occurrence, replay({ priorDeliveryRefs: ["delivery:1"] }), deliveries, evaluatedAt), false);
});

test("TASK-529 expired or partial replay evidence cannot authorize historical replay claims", () => {
  const deliveries = [delivery("delivery:1"), delivery("delivery:2")];
  assert.equal(replayPreservesCanonicalLineage(occurrence, replay({ validUntil: "2026-09-12T11:30:00Z" }), deliveries, evaluatedAt), false);
  assert.equal(replayPreservesCanonicalLineage(occurrence, replay({ completeness: "PARTIAL" }), deliveries, evaluatedAt), false);
});

test("TASK-529 DLQ provider acknowledgement is never business resolution proof", () => {
  assert.equal(dlqMovementProvesResolution({
    movementRef: "dlq:movement:1",
    occurrenceRef: occurrence.occurrenceRef,
    messageRef: "message:1",
    providerAckRef: "ack:dlq:1",
    completeness: "KNOWN",
    currentness,
  }), false);
});

test("TASK-529 batch aggregation cannot hide per-item failure partiality or unknown", () => {
  assert.equal(deriveBatchAggregate([
    { itemRef: "1", occurrenceRef: "o1", state: "SUCCEEDED" },
    { itemRef: "2", occurrenceRef: "o2", state: "SUCCEEDED" },
  ]), "SUCCEEDED");
  assert.equal(deriveBatchAggregate([
    { itemRef: "1", occurrenceRef: "o1", state: "SUCCEEDED" },
    { itemRef: "2", occurrenceRef: "o2", state: "FAILED" },
  ]), "PARTIAL");
  assert.equal(deriveBatchAggregate([{ itemRef: "1", occurrenceRef: "o1", state: "PARTIAL" }]), "PARTIAL");
  assert.equal(deriveBatchAggregate([{ itemRef: "1", occurrenceRef: "o1", state: "UNKNOWN" }]), "UNKNOWN");
});

const rateUnit: UnitReference = {
  state: "KNOWN",
  unitRef: "messages-per-second",
  unitRevision: "1",
  dimension: { terms: [{ axis: "message", exponent: 1 }, { axis: "time", exponent: -1 }] },
};
const population: FiniteFlowPopulationIdentity = { queueRef: "queue:replay", populationRef: "messages:replay", scopeRef: "tenant:1" };
const flow = (overrides: Partial<DrainageAssumptions> = {}): DrainageAssumptions => ({
  horizonMs: 2000,
  arrival: { value: 1, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  service: { value: 5, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items: 2, knowledge: "KNOWN", telemetryComplete: true },
  replay: { requestedItems: 1, maximumReplayItems: 2, deduplicationBoundItems: 2 },
  ...overrides,
});
const cohorts = (overrides: Partial<ResidualReplayCohort> = {}): readonly ResidualReplayCohort[] => [{
  cohortRef: "cohort:replay:1",
  populationRef: population.populationRef,
  scopeRef: population.scopeRef,
  items: 2,
  knowledge: "KNOWN",
  telemetryComplete: true,
  observedAt: evaluatedAt,
  ...overrides,
}];

test("TASK-529 replay recovery requires finite drainable units population and time qualified evidence", () => {
  const result = assessMessagingRecovery(population, flow(), cohorts());
  assert.equal(result.valid, true);
  assert.equal(result.drainable, true);
  assert.equal(result.residualItemsUpperBound, 0);
});

test("TASK-529 telemetry gaps cannot manufacture empty or drainable backlog", () => {
  const result = assessMessagingRecovery(
    population,
    flow({ backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items: 0, knowledge: "KNOWN", telemetryComplete: false } }),
    cohorts({ items: 0, telemetryComplete: false }),
  );
  assert.equal(result.valid, false);
  assert.equal(result.drainable, false);
  assert.equal(result.residualItemsUpperBound, null);
  assert.ok(result.reasons.includes("RESIDUAL_COHORT_TELEMETRY_INCOMPLETE"));
  assert.ok(result.reasons.includes("BACKLOG_TELEMETRY_INCOMPLETE"));
});

test("TASK-529 population or residual mismatch cannot establish finite drainage", () => {
  const wrongScope = assessMessagingRecovery(population, flow(), cohorts({ scopeRef: "tenant:other" }));
  assert.equal(wrongScope.drainable, false);
  assert.ok(wrongScope.reasons.includes("RESIDUAL_COHORT_POPULATION_OR_SCOPE_MISMATCH"));

  const mismatch = assessMessagingRecovery(population, flow(), cohorts({ items: 1 }));
  assert.equal(mismatch.drainable, false);
  assert.ok(mismatch.reasons.includes("RESIDUAL_COHORT_BACKLOG_MISMATCH"));
});

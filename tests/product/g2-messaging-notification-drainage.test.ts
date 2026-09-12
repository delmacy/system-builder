import assert from "node:assert/strict";
import test from "node:test";

import type { DrainageAssumptions, FiniteFlowPopulationIdentity } from "../../packages/contracts/finite-flow/finite-flow.js";
import type { UnitReference } from "../../packages/contracts/mathematical-semantics/index.js";
import {
  assessNotificationDrainage,
  notificationEffectIsAuthoritative,
  offlineBufferPreservesLineage,
  providerDeliveryProvesNotificationEffect,
  type NotificationEffectEvidence,
  type NotificationIntentEvidence,
  type OfflineBufferedCohort,
  type ResidualMessagingCohort,
} from "../../packages/contracts/messaging/messaging-notification-drainage.js";

const currentness = { state: "CURRENT" as const, assessedAt: "2026-09-12T00:00:00Z", validUntil: "2026-09-13T00:00:00Z" };
const stale = { ...currentness, state: "STALE" as const };
const evaluatedAt = "2026-09-12T12:00:00Z";

const intent: NotificationIntentEvidence = {
  intentRef: "notification:intent:1",
  occurrenceRef: "occurrence:1",
  producingRevisionRef: "revision:4",
  recipientRef: "recipient:1",
  completeness: "KNOWN",
  currentness,
};

const effect = (overrides: Partial<NotificationEffectEvidence> = {}): NotificationEffectEvidence => ({
  effectRef: "notification:effect:1",
  intentRef: intent.intentRef,
  effectState: "OBSERVED",
  authoritative: true,
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

test("TASK-533 provider delivery acknowledgement is never notification business effect proof", () => {
  assert.equal(providerDeliveryProvesNotificationEffect({
    deliveryRef: "delivery:1",
    intentRef: intent.intentRef,
    providerRef: "provider:1",
    providerAckRef: "ack:1",
    completeness: "KNOWN",
    currentness,
  }, effect()), false);
  assert.equal(notificationEffectIsAuthoritative(effect(), evaluatedAt), true);
  assert.equal(notificationEffectIsAuthoritative(effect({ completeness: "PARTIAL" }), evaluatedAt), false);
  assert.equal(notificationEffectIsAuthoritative(effect({ currentness: stale }), evaluatedAt), false);
  assert.equal(notificationEffectIsAuthoritative(effect({ effectState: "UNKNOWN" }), evaluatedAt), false);
});

const offline = (overrides: Partial<OfflineBufferedCohort> = {}): OfflineBufferedCohort => ({
  cohortRef: "offline:cohort:1",
  populationRef: "notification:population:1",
  scopeRef: "tenant:1",
  occurrenceRef: intent.occurrenceRef,
  producingRevisionRef: intent.producingRevisionRef,
  items: 2,
  knowledge: "KNOWN",
  telemetryComplete: true,
  observedAt: evaluatedAt,
  currentness,
  ...overrides,
});

test("TASK-533 offline buffering preserves occurrence and producing revision lineage", () => {
  assert.equal(offlineBufferPreservesLineage(intent, offline(), evaluatedAt), true);
  assert.equal(offlineBufferPreservesLineage(intent, offline({ occurrenceRef: "occurrence:other" }), evaluatedAt), false);
  assert.equal(offlineBufferPreservesLineage(intent, offline({ producingRevisionRef: "revision:new" }), evaluatedAt), false);
  assert.equal(offlineBufferPreservesLineage(intent, offline({ knowledge: "PARTIAL" }), evaluatedAt), false);
  assert.equal(offlineBufferPreservesLineage(intent, offline({ telemetryComplete: false }), evaluatedAt), false);
  assert.equal(offlineBufferPreservesLineage(intent, offline({ currentness: stale }), evaluatedAt), false);
});

const rateUnit: UnitReference = {
  state: "KNOWN",
  unitRef: "messages-per-second",
  unitRevision: "1",
  dimension: { terms: [{ axis: "message", exponent: 1 }, { axis: "time", exponent: -1 }] },
};
const population: FiniteFlowPopulationIdentity = {
  queueRef: "queue:notifications",
  populationRef: "notification:population:1",
  scopeRef: "tenant:1",
};
const flow = (overrides: Partial<DrainageAssumptions> = {}): DrainageAssumptions => ({
  horizonMs: 2000,
  arrival: { value: 1, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  service: { value: 6, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items: 3, knowledge: "KNOWN", telemetryComplete: true },
  replay: { requestedItems: 0, maximumReplayItems: 0, deduplicationBoundItems: 0 },
  ...overrides,
});
const residuals = (overrides: Partial<ResidualMessagingCohort> = {}): readonly ResidualMessagingCohort[] => [
  { cohortRef: "residual:subscription:1", kind: "SUBSCRIPTION", populationRef: population.populationRef, scopeRef: population.scopeRef, items: 1, knowledge: "KNOWN", telemetryComplete: true, observedAt: evaluatedAt, currentness },
  { cohortRef: "residual:message:1", kind: "MESSAGE", populationRef: population.populationRef, scopeRef: population.scopeRef, items: 1, knowledge: "KNOWN", telemetryComplete: true, observedAt: evaluatedAt, currentness },
  { cohortRef: "residual:callback:1", kind: "CALLBACK", populationRef: population.populationRef, scopeRef: population.scopeRef, items: 1, knowledge: "KNOWN", telemetryComplete: true, observedAt: evaluatedAt, currentness, ...overrides },
];

test("TASK-533 qualified subscription message and callback residuals can establish finite drainage", () => {
  const result = assessNotificationDrainage(population, flow(), residuals(), evaluatedAt);
  assert.equal(result.valid, true);
  assert.equal(result.drainable, true);
  assert.equal(result.residualItemsUpperBound, 0);
});

test("TASK-533 telemetry gaps partial cohorts and stale evidence cannot establish zero backlog or drainage", () => {
  const telemetryGap = assessNotificationDrainage(population, flow(), residuals({ telemetryComplete: false }), evaluatedAt);
  assert.equal(telemetryGap.drainable, false);
  assert.equal(telemetryGap.residualItemsUpperBound, null);
  assert.ok(telemetryGap.reasons.includes("RESIDUAL_COHORT_TELEMETRY_INCOMPLETE"));

  const partial = assessNotificationDrainage(population, flow(), residuals({ knowledge: "PARTIAL" }), evaluatedAt);
  assert.equal(partial.drainable, false);
  assert.ok(partial.reasons.includes("RESIDUAL_COHORT_NOT_KNOWN"));

  const staleEvidence = assessNotificationDrainage(population, flow(), residuals({ currentness: stale }), evaluatedAt);
  assert.equal(staleEvidence.drainable, false);
  assert.ok(staleEvidence.reasons.includes("RESIDUAL_COHORT_NOT_CURRENT"));
});

test("TASK-533 population mismatch and hidden residual count cannot establish completed drainage", () => {
  const wrongScope = assessNotificationDrainage(population, flow(), residuals({ scopeRef: "tenant:other" }), evaluatedAt);
  assert.equal(wrongScope.drainable, false);
  assert.ok(wrongScope.reasons.includes("RESIDUAL_COHORT_POPULATION_OR_SCOPE_MISMATCH"));

  const countMismatch = assessNotificationDrainage(population, flow(), residuals({ items: 2 }), evaluatedAt);
  assert.equal(countMismatch.drainable, false);
  assert.ok(countMismatch.reasons.includes("RESIDUAL_COHORT_BACKLOG_MISMATCH"));

  const incompleteBacklog = assessNotificationDrainage(population, flow({ backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items: 0, knowledge: "KNOWN", telemetryComplete: false } }), residuals({ items: 0 }), evaluatedAt);
  assert.equal(incompleteBacklog.drainable, false);
  assert.ok(incompleteBacklog.reasons.includes("BACKLOG_TELEMETRY_INCOMPLETE"));
});

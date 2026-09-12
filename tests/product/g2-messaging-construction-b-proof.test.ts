import assert from "node:assert/strict";
import test from "node:test";

import type { DrainageAssumptions, FiniteFlowPopulationIdentity } from "../../packages/contracts/finite-flow/finite-flow.js";
import type { UnitReference } from "../../packages/contracts/mathematical-semantics/index.js";
import {
  callbackRedeliveryPreservesMappingLineage,
  reconcileMappedCallback,
  type MessagingCallbackMappingEvidence,
} from "../../packages/contracts/messaging/messaging-callback-mapping.js";
import type { BusinessEffectEvidence } from "../../packages/contracts/messaging/messaging-delivery-effect.js";
import {
  assessNotificationDrainage,
  notificationEffectIsAuthoritative,
  offlineBufferPreservesLineage,
  providerDeliveryProvesNotificationEffect,
  type NotificationDeliveryEvidence,
  type NotificationEffectEvidence,
  type NotificationIntentEvidence,
  type OfflineBufferedCohort,
  type ResidualMessagingCohort,
} from "../../packages/contracts/messaging/messaging-notification-drainage.js";
import {
  substitutionPreservesHistoricalLineage,
  type MessagingProviderCoexistenceEnvelope,
} from "../../packages/contracts/messaging/messaging-provider-coexistence.js";

const evaluatedAt = "2026-09-12T12:00:00Z";
const currentness = {
  state: "CURRENT" as const,
  assessedAt: "2026-09-12T11:00:00Z",
  validUntil: "2026-09-12T13:00:00Z",
};

const callback = (overrides: Partial<MessagingCallbackMappingEvidence> = {}): MessagingCallbackMappingEvidence => ({
  callbackRef: "callback:invoice:42",
  occurrenceRef: "occurrence:42",
  messageRef: "message:42",
  subscriptionRef: "subscription:invoice",
  mappingRef: "mapping:invoice-ledger",
  mappingRevisionRef: "mapping-rev:7",
  sourceSemanticRef: "invoice:42",
  sourceRevisionRef: "invoice-schema:3",
  targetSemanticRef: "ledger-entry:42",
  targetRevisionRef: "ledger-schema:5",
  deliveryRef: "delivery:42:1",
  providerCallbackRef: "provider-callback:a",
  transportOutcome: "ACKNOWLEDGED",
  authority: "AUTHORITATIVE",
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

const businessEffect = (overrides: Partial<BusinessEffectEvidence> = {}): BusinessEffectEvidence => ({
  effectRef: "effect:ledger:42",
  occurrenceRef: "occurrence:42",
  authorityRef: "ledger-authority",
  authorityRevisionRef: "ledger-authority:5",
  scopeRef: "ledger/account:receivable",
  payloadFingerprint: "sha256:42",
  idempotencyRef: "idem:42",
  idempotencyScopeRef: "ledger/account:receivable",
  idempotencyValidUntil: "2026-09-12T13:00:00Z",
  state: "OBSERVED",
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

const providerEnvelope = (
  historicalProvider = "provider:queue-a",
): MessagingProviderCoexistenceEnvelope => ({
  contractVersion: "1.0.0",
  occurrenceRef: "occurrence:42",
  messageRef: "message:42",
  subscriptionRef: "subscription:invoice",
  bindings: [],
  historicalDeliveries: [{
    deliveryRef: "delivery:42:1",
    messageRef: "message:42",
    occurrenceRef: "occurrence:42",
    bindingRef: "binding:queue-a",
    providerRealizationRef: historicalProvider,
    substitutionEpochRef: "epoch:1",
  }],
});

const intent: NotificationIntentEvidence = {
  intentRef: "notification:intent:42",
  occurrenceRef: "occurrence:42",
  producingRevisionRef: "workflow-revision:9",
  recipientRef: "recipient:42",
  completeness: "KNOWN",
  currentness,
};

const delivery: NotificationDeliveryEvidence = {
  deliveryRef: "notification:delivery:42",
  intentRef: intent.intentRef,
  providerRef: "provider:queue-b",
  providerAckRef: "provider-ack:42",
  completeness: "KNOWN",
  currentness,
};

const notificationEffect = (overrides: Partial<NotificationEffectEvidence> = {}): NotificationEffectEvidence => ({
  effectRef: "notification:effect:42",
  intentRef: intent.intentRef,
  effectState: "OBSERVED",
  authoritative: true,
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

const offline: OfflineBufferedCohort = {
  cohortRef: "offline:42",
  populationRef: "notification:population:42",
  scopeRef: "tenant:42",
  occurrenceRef: intent.occurrenceRef,
  producingRevisionRef: intent.producingRevisionRef,
  items: 2,
  knowledge: "KNOWN",
  telemetryComplete: true,
  observedAt: evaluatedAt,
  currentness,
};

const rateUnit: UnitReference = {
  state: "KNOWN",
  unitRef: "messages-per-second",
  unitRevision: "1",
  dimension: { terms: [{ axis: "message", exponent: 1 }, { axis: "time", exponent: -1 }] },
};

const population: FiniteFlowPopulationIdentity = {
  queueRef: "queue:notifications",
  populationRef: "notification:population:42",
  scopeRef: "tenant:42",
};

const flow = (overrides: Partial<DrainageAssumptions> = {}): DrainageAssumptions => ({
  horizonMs: 2000,
  arrival: { value: 1, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  service: { value: 6, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items: 3, knowledge: "KNOWN", telemetryComplete: true },
  replay: { requestedItems: 0, maximumReplayItems: 0, deduplicationBoundItems: 0 },
  ...overrides,
});

const residuals = (callbackOverrides: Partial<ResidualMessagingCohort> = {}): readonly ResidualMessagingCohort[] => [
  { cohortRef: "residual:subscription:42", kind: "SUBSCRIPTION", populationRef: population.populationRef, scopeRef: population.scopeRef, items: 1, knowledge: "KNOWN", telemetryComplete: true, observedAt: evaluatedAt, currentness },
  { cohortRef: "residual:message:42", kind: "MESSAGE", populationRef: population.populationRef, scopeRef: population.scopeRef, items: 1, knowledge: "KNOWN", telemetryComplete: true, observedAt: evaluatedAt, currentness },
  { cohortRef: "residual:callback:42", kind: "CALLBACK", populationRef: population.populationRef, scopeRef: population.scopeRef, items: 1, knowledge: "KNOWN", telemetryComplete: true, observedAt: evaluatedAt, currentness, ...callbackOverrides },
];

test("TASK-534 composes provider substitution callback replay and canonical historical lineage", () => {
  const before = providerEnvelope();
  const after = providerEnvelope();
  assert.equal(substitutionPreservesHistoricalLineage(before, after), true);

  const original = callback();
  const replay = callback({ deliveryRef: "delivery:42:2", providerCallbackRef: "provider-callback:b" });
  assert.equal(callbackRedeliveryPreservesMappingLineage(original, replay), true);
  assert.equal(replay.occurrenceRef, before.occurrenceRef);
  assert.equal(replay.messageRef, before.messageRef);

  assert.equal(substitutionPreservesHistoricalLineage(before, providerEnvelope("provider:queue-b")), false);
  assert.equal(callbackRedeliveryPreservesMappingLineage(original, callback({ mappingRevisionRef: "mapping-rev:8" })), false);
});

test("TASK-534 keeps provider ACK callback ACK and business effect authority separate", () => {
  assert.equal(providerDeliveryProvesNotificationEffect(delivery, notificationEffect()), false);
  assert.equal(notificationEffectIsAuthoritative(notificationEffect(), evaluatedAt), true);
  assert.equal(reconcileMappedCallback(callback(), businessEffect({ state: "UNKNOWN" }), evaluatedAt), "RECONCILE_BEFORE_RETRY");
  assert.equal(reconcileMappedCallback(callback(), businessEffect(), evaluatedAt), "EFFECT_CONFIRMED");
});

test("TASK-534 ambiguous callback mutation reconciles before retry across provider substitution", () => {
  const before = providerEnvelope();
  const after = providerEnvelope();
  assert.equal(substitutionPreservesHistoricalLineage(before, after), true);
  assert.equal(reconcileMappedCallback(callback({ transportOutcome: "TIMEOUT" }), businessEffect({ state: "NOT_OBSERVED" }), evaluatedAt), "RECONCILE_BEFORE_RETRY");
  assert.equal(reconcileMappedCallback(callback({ transportOutcome: "UNKNOWN" }), businessEffect({ state: "UNKNOWN" }), evaluatedAt), "RECONCILE_BEFORE_RETRY");
});

test("TASK-534 notification intent delivery and effect remain distinct through offline buffering", () => {
  assert.notEqual(intent.intentRef, delivery.deliveryRef);
  assert.notEqual(delivery.deliveryRef, notificationEffect().effectRef);
  assert.equal(delivery.intentRef, intent.intentRef);
  assert.equal(notificationEffect().intentRef, intent.intentRef);
  assert.equal(providerDeliveryProvesNotificationEffect(delivery, notificationEffect()), false);
  assert.equal(offlineBufferPreservesLineage(intent, offline, evaluatedAt), true);
});

test("TASK-534 qualified residual subscription message callback cohorts compose with finite-flow drainage", () => {
  const result = assessNotificationDrainage(population, flow(), residuals(), evaluatedAt);
  assert.equal(result.valid, true);
  assert.equal(result.drainable, true);
  assert.equal(result.residualItemsUpperBound, 0);
});

test("TASK-534 evidence gaps prevent false residual drainage", () => {
  const telemetryGap = assessNotificationDrainage(population, flow(), residuals({ telemetryComplete: false }), evaluatedAt);
  assert.equal(telemetryGap.drainable, false);
  assert.equal(telemetryGap.residualItemsUpperBound, null);
  assert.ok(telemetryGap.reasons.includes("RESIDUAL_COHORT_TELEMETRY_INCOMPLETE"));

  const partial = assessNotificationDrainage(population, flow(), residuals({ knowledge: "PARTIAL" }), evaluatedAt);
  assert.equal(partial.drainable, false);
  assert.ok(partial.reasons.includes("RESIDUAL_COHORT_NOT_KNOWN"));

  const stale = assessNotificationDrainage(population, flow(), residuals({ currentness: { ...currentness, state: "STALE" } }), evaluatedAt);
  assert.equal(stale.drainable, false);
  assert.ok(stale.reasons.includes("RESIDUAL_COHORT_NOT_CURRENT"));

  const wrongPopulation = assessNotificationDrainage(population, flow(), residuals({ populationRef: "notification:population:other" }), evaluatedAt);
  assert.equal(wrongPopulation.drainable, false);
  assert.ok(wrongPopulation.reasons.includes("RESIDUAL_COHORT_POPULATION_OR_SCOPE_MISMATCH"));

  const unknownUnit = assessNotificationDrainage(population, flow({ service: { ...flow().service, unit: { state: "UNKNOWN", reason: "unit evidence unavailable" } } }), residuals(), evaluatedAt);
  assert.equal(unknownUnit.drainable, false);
  assert.ok(unknownUnit.reasons.length > 0);
});

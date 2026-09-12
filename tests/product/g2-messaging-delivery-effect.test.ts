import assert from "node:assert/strict";
import test from "node:test";
import {
  businessEffectEvidenceIsAuthoritative,
  providerAckProvesBusinessEffect,
  providerEvidenceIsCurrent,
  retryDisposition,
  sameBusinessOccurrence,
  type BusinessEffectEvidence,
  type DeliveryAttemptEvidence,
} from "../../packages/contracts/messaging/messaging-delivery-effect.js";

const currentness = (state: "CURRENT" | "STALE" | "UNKNOWN" = "CURRENT") => ({
  state,
  assessedAt: "2026-09-12T08:00:00Z",
  validUntil: "2026-09-12T10:00:00Z",
});

const delivery = (overrides: Partial<DeliveryAttemptEvidence> = {}): DeliveryAttemptEvidence => ({
  deliveryRef: "delivery:42",
  attemptRef: "attempt:42:1",
  messageRef: "message:invoice-issued:42:1",
  occurrenceRef: "occurrence:invoice-issued:42",
  subscriptionRef: "subscription:accounting",
  providerRef: "provider:a",
  providerQualificationRef: "provider:a:qualification:r3",
  providerCurrentness: currentness(),
  attemptOutcome: "ACKNOWLEDGED",
  providerAckRef: "ack:123",
  completeness: "KNOWN",
  ...overrides,
});

const effect = (overrides: Partial<BusinessEffectEvidence> = {}): BusinessEffectEvidence => ({
  effectRef: "effect:ledger:42",
  occurrenceRef: "occurrence:invoice-issued:42",
  authorityRef: "ledger",
  authorityRevisionRef: "ledger:r9",
  scopeRef: "tenant:alpha",
  payloadFingerprint: "sha256:abc",
  idempotencyRef: "idem:invoice:42",
  idempotencyScopeRef: "tenant:alpha",
  idempotencyValidUntil: "2026-09-12T10:00:00Z",
  state: "UNKNOWN",
  completeness: "KNOWN",
  currentness: currentness(),
  ...overrides,
});

test("TASK-528 provider ACK never proves business effect", () => {
  assert.equal(providerAckProvesBusinessEffect(delivery()), false);
  assert.equal(retryDisposition(delivery(), effect(), "2026-09-12T09:00:00Z"), "RECONCILE_BEFORE_RETRY");
});

test("TASK-528 timeout or unknown mutating outcome requires reconcile before unsafe retry", () => {
  assert.equal(retryDisposition(delivery({ attemptOutcome: "TIMEOUT", providerAckRef: null }), effect(), "2026-09-12T09:00:00Z"), "RECONCILE_BEFORE_RETRY");
  assert.equal(retryDisposition(delivery({ attemptOutcome: "UNKNOWN", providerAckRef: null }), effect(), "2026-09-12T09:00:00Z"), "RECONCILE_BEFORE_RETRY");
});

test("TASK-528 duplicate transport attempts preserve one business occurrence", () => {
  const first = delivery();
  const second = delivery({ attemptRef: "attempt:42:2", providerAckRef: "ack:456" });
  assert.notEqual(first.attemptRef, second.attemptRef);
  assert.equal(sameBusinessOccurrence(first, second), true);
});

test("TASK-528 stale provider evidence cannot strengthen current delivery evidence", () => {
  assert.equal(providerEvidenceIsCurrent(delivery(), "2026-09-12T09:00:00Z"), true);
  assert.equal(providerEvidenceIsCurrent(delivery({ providerCurrentness: currentness("STALE") }), "2026-09-12T09:00:00Z"), false);
  assert.equal(providerEvidenceIsCurrent(delivery({ completeness: "PARTIAL" }), "2026-09-12T09:00:00Z"), false);
});

test("TASK-528 authoritative effect evidence is scope payload revision horizon qualified", () => {
  assert.equal(businessEffectEvidenceIsAuthoritative(effect({ state: "OBSERVED" }), "2026-09-12T09:00:00Z"), true);
  assert.equal(businessEffectEvidenceIsAuthoritative(effect({ state: "OBSERVED", idempotencyScopeRef: null }), "2026-09-12T09:00:00Z"), false);
  assert.equal(businessEffectEvidenceIsAuthoritative(effect({ state: "OBSERVED", currentness: currentness("UNKNOWN") }), "2026-09-12T09:00:00Z"), false);
  assert.equal(businessEffectEvidenceIsAuthoritative(effect({ state: "OBSERVED", idempotencyValidUntil: "2026-09-12T08:30:00Z" }), "2026-09-12T09:00:00Z"), false);
});

test("TASK-528 observed authoritative effect prevents duplicate retry while explicit rejection without effect is retryable", () => {
  assert.equal(retryDisposition(delivery(), effect({ state: "OBSERVED" }), "2026-09-12T09:00:00Z"), "DO_NOT_RETRY");
  assert.equal(retryDisposition(delivery({ attemptOutcome: "REJECTED", providerAckRef: null }), effect({ state: "NOT_OBSERVED" }), "2026-09-12T09:00:00Z"), "SAFE_RETRY");
});

test("TASK-528 rejects effect reconciliation across different canonical occurrences", () => {
  assert.throws(() => retryDisposition(delivery(), effect({ occurrenceRef: "occurrence:other" }), "2026-09-12T09:00:00Z"), /same canonical occurrence/);
});

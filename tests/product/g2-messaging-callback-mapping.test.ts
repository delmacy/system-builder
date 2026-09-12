import assert from "node:assert/strict";
import test from "node:test";

import {
  callbackMappingCanStrengthenCurrentness,
  callbackRedeliveryPreservesMappingLineage,
  normalizeMessagingCallbackMappingEvidence,
  providerCallbackRefIsCanonicalBusinessIdentity,
  reconcileMappedCallback,
  type MessagingCallbackMappingEvidence,
} from "../../packages/contracts/messaging/messaging-callback-mapping.js";
import type { BusinessEffectEvidence } from "../../packages/contracts/messaging/messaging-delivery-effect.js";

const evaluatedAt = "2026-09-12T12:00:00Z";

const mapping = (overrides: Record<string, unknown> = {}): MessagingCallbackMappingEvidence => normalizeMessagingCallbackMappingEvidence({
  callbackRef: "callback:invoice:42",
  occurrenceRef: "occurrence:42",
  messageRef: "message:42",
  subscriptionRef: "subscription:invoice",
  mappingRef: "mapping:invoice-to-ledger",
  mappingRevisionRef: "mapping-rev:7",
  sourceSemanticRef: "invoice:42",
  sourceRevisionRef: "invoice-schema:3",
  targetSemanticRef: "ledger-entry:42",
  targetRevisionRef: "ledger-schema:5",
  deliveryRef: "delivery:42:1",
  providerCallbackRef: "provider-callback:abc",
  transportOutcome: "ACKNOWLEDGED",
  authority: "AUTHORITATIVE",
  completeness: "KNOWN",
  currentness: {
    state: "CURRENT",
    assessedAt: "2026-09-12T11:00:00Z",
    validUntil: "2026-09-12T13:00:00Z",
  },
  ...overrides,
});

const effect = (overrides: Partial<BusinessEffectEvidence> = {}): BusinessEffectEvidence => ({
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
  currentness: {
    state: "CURRENT",
    assessedAt: "2026-09-12T11:00:00Z",
    validUntil: "2026-09-12T13:00:00Z",
  },
  ...overrides,
});

test("TASK-532 preserves explicit callback identity and historical mapping revision", () => {
  const value = mapping();
  assert.equal(value.callbackRef, "callback:invoice:42");
  assert.equal(value.mappingRef, "mapping:invoice-to-ledger");
  assert.equal(value.mappingRevisionRef, "mapping-rev:7");
  assert.equal(callbackMappingCanStrengthenCurrentness(value, evaluatedAt), true);
});

test("TASK-532 provider callback ACK or provider callback ID never proves business identity/effect", () => {
  const value = mapping();
  assert.equal(providerCallbackRefIsCanonicalBusinessIdentity(value), false);
  assert.equal(reconcileMappedCallback(value, effect({ state: "UNKNOWN" }), evaluatedAt), "RECONCILE_BEFORE_RETRY");
  assert.equal(reconcileMappedCallback(value, effect({ state: "NOT_OBSERVED" }), evaluatedAt), "RECONCILE_BEFORE_RETRY");
});

test("TASK-532 timeout and ambiguous mutating callback reconcile before retry", () => {
  assert.equal(reconcileMappedCallback(mapping({ transportOutcome: "TIMEOUT" }), effect({ state: "NOT_OBSERVED" }), evaluatedAt), "RECONCILE_BEFORE_RETRY");
  assert.equal(reconcileMappedCallback(mapping({ transportOutcome: "UNKNOWN" }), effect({ state: "UNKNOWN" }), evaluatedAt), "RECONCILE_BEFORE_RETRY");
});

test("TASK-532 safe retry requires rejected transport plus authoritative current NOT_OBSERVED target effect", () => {
  assert.equal(reconcileMappedCallback(mapping({ transportOutcome: "REJECTED" }), effect({ state: "NOT_OBSERVED" }), evaluatedAt), "SAFE_RETRY");
  assert.equal(reconcileMappedCallback(mapping({ transportOutcome: "REJECTED", completeness: "PARTIAL" }), effect({ state: "NOT_OBSERVED" }), evaluatedAt), "RECONCILE_BEFORE_RETRY");
  assert.equal(reconcileMappedCallback(mapping({ transportOutcome: "REJECTED", currentness: { state: "STALE", assessedAt: "2026-09-12T10:00:00Z", validUntil: "2026-09-12T11:00:00Z" } }), effect({ state: "NOT_OBSERVED" }), evaluatedAt), "RECONCILE_BEFORE_RETRY");
});

test("TASK-532 authoritative current mapping plus authoritative target effect can confirm effect", () => {
  assert.equal(reconcileMappedCallback(mapping(), effect(), evaluatedAt), "EFFECT_CONFIRMED");
  assert.equal(reconcileMappedCallback(mapping({ authority: "INFERRED" }), effect(), evaluatedAt), "RECONCILE_BEFORE_RETRY");
  assert.equal(reconcileMappedCallback(mapping({ completeness: "UNKNOWN" }), effect(), evaluatedAt), "RECONCILE_BEFORE_RETRY");
});

test("TASK-532 redelivery preserves canonical occurrence and historical mapping lineage", () => {
  const original = mapping();
  const redelivery = mapping({ deliveryRef: "delivery:42:2", providerCallbackRef: "provider-callback:def" });
  assert.equal(callbackRedeliveryPreservesMappingLineage(original, redelivery), true);
  assert.equal(callbackRedeliveryPreservesMappingLineage(original, mapping({ mappingRevisionRef: "mapping-rev:8" })), false);
  assert.equal(callbackRedeliveryPreservesMappingLineage(original, mapping({ occurrenceRef: "occurrence:43" })), false);
});

test("TASK-532 latest mapping cannot reinterpret historical callback lineage", () => {
  const historical = mapping({ mappingRevisionRef: "mapping-rev:7", targetRevisionRef: "ledger-schema:5" });
  const latest = mapping({ mappingRevisionRef: "mapping-rev:8", targetRevisionRef: "ledger-schema:6" });
  assert.equal(callbackRedeliveryPreservesMappingLineage(historical, latest), false);
});

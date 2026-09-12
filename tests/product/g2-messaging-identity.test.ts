import assert from "node:assert/strict";
import test from "node:test";
import {
  MESSAGING_IDENTITY_CONTRACT_VERSION,
  evidenceCanStrengthenMessagingCurrentness,
  normalizeMessagingIdentityEnvelope,
  sameCanonicalOccurrence,
} from "../../packages/contracts/messaging/messaging-identity.js";

const currentness = (state: "CURRENT" | "STALE" | "UNKNOWN" = "CURRENT") => ({
  state,
  assessedAt: "2026-09-12T08:00:00Z",
  validUntil: "2026-09-12T10:00:00Z",
});

const envelope = (overrides: Record<string, unknown> = {}) => ({
  contractVersion: MESSAGING_IDENTITY_CONTRACT_VERSION,
  occurrence: {
    occurrenceRef: "occurrence:invoice-issued:42",
    producerRef: "service:billing",
    sourceRef: "invoice:42",
    subjectRef: "topic:invoice-issued",
    producingRevisionRef: "workflow:billing:r7",
    lineageRootOccurrenceRef: "occurrence:invoice-issued:42",
    parentOccurrenceRef: null,
    completeness: "KNOWN",
    currentness: currentness(),
  },
  message: {
    messageRef: "message:invoice-issued:42:1",
    occurrenceRef: "occurrence:invoice-issued:42",
    producingRevisionRef: "workflow:billing:r7",
    providerEvidence: { providerRef: "provider:a", providerMessageRef: "external:shared-123" },
  },
  subscription: {
    subscriptionRef: "subscription:accounting",
    subscriptionRevisionRef: "subscription:accounting:r3",
    subscriberRef: "service:accounting",
    subjectRef: "topic:invoice-issued",
    completeness: "KNOWN",
    currentness: currentness(),
  },
  ...overrides,
});

test("TASK-527 keeps occurrence, message and subscription identity distinct", () => {
  const normalized = normalizeMessagingIdentityEnvelope(envelope());
  assert.notEqual(normalized.occurrence.occurrenceRef, normalized.message.messageRef);
  assert.notEqual(normalized.message.messageRef, normalized.subscription.subscriptionRef);
  assert.equal(normalized.message.occurrenceRef, normalized.occurrence.occurrenceRef);
  assert.equal(normalized.message.producingRevisionRef, normalized.occurrence.producingRevisionRef);
});

test("TASK-527 preserves producing revision and occurrence lineage across redelivery messages", () => {
  const first = normalizeMessagingIdentityEnvelope(envelope());
  const redelivery = normalizeMessagingIdentityEnvelope(envelope({
    message: {
      messageRef: "message:invoice-issued:42:redelivery-2",
      occurrenceRef: "occurrence:invoice-issued:42",
      producingRevisionRef: "workflow:billing:r7",
      providerEvidence: { providerRef: "provider:b", providerMessageRef: "provider-b:987" },
    },
  }));
  assert.equal(sameCanonicalOccurrence(first, redelivery), true);
  assert.notEqual(first.message.messageRef, redelivery.message.messageRef);
  assert.equal(redelivery.occurrence.lineageRootOccurrenceRef, first.occurrence.lineageRootOccurrenceRef);
});

test("TASK-527 refuses provider message ID equality as canonical occurrence authority", () => {
  const first = normalizeMessagingIdentityEnvelope(envelope());
  const unrelated = normalizeMessagingIdentityEnvelope(envelope({
    occurrence: {
      occurrenceRef: "occurrence:invoice-issued:99",
      producerRef: "service:billing",
      sourceRef: "invoice:99",
      subjectRef: "topic:invoice-issued",
      producingRevisionRef: "workflow:billing:r7",
      lineageRootOccurrenceRef: "occurrence:invoice-issued:99",
      parentOccurrenceRef: null,
      completeness: "KNOWN",
      currentness: currentness(),
    },
    message: {
      messageRef: "message:invoice-issued:99:1",
      occurrenceRef: "occurrence:invoice-issued:99",
      producingRevisionRef: "workflow:billing:r7",
      providerEvidence: { providerRef: "provider:a", providerMessageRef: "external:shared-123" },
    },
  }));
  assert.equal(first.message.providerEvidence!.providerMessageRef, unrelated.message.providerEvidence!.providerMessageRef);
  assert.equal(sameCanonicalOccurrence(first, unrelated), false);
});

test("TASK-527 keeps historical producing revision authoritative instead of reinterpreting with latest revision", () => {
  assert.throws(() => normalizeMessagingIdentityEnvelope(envelope({
    message: {
      messageRef: "message:invoice-issued:42:latest",
      occurrenceRef: "occurrence:invoice-issued:42",
      producingRevisionRef: "workflow:billing:r8",
      providerEvidence: null,
    },
  })), /preserve the occurrence producing revision/);
});

test("TASK-527 rejects missing lineage and self-parent lineage", () => {
  const base = envelope();
  assert.throws(() => normalizeMessagingIdentityEnvelope({
    ...base,
    occurrence: { ...(base.occurrence as Record<string, unknown>), lineageRootOccurrenceRef: "" },
  }), /lineageRootOccurrenceRef/);
  assert.throws(() => normalizeMessagingIdentityEnvelope({
    ...base,
    occurrence: { ...(base.occurrence as Record<string, unknown>), parentOccurrenceRef: "occurrence:invoice-issued:42" },
  }), /own parent/);
});

test("TASK-527 prevents PARTIAL UNKNOWN stale or expired evidence from strengthening currentness", () => {
  assert.equal(evidenceCanStrengthenMessagingCurrentness("KNOWN", currentness("CURRENT"), "2026-09-12T09:00:00Z"), true);
  assert.equal(evidenceCanStrengthenMessagingCurrentness("PARTIAL", currentness("CURRENT"), "2026-09-12T09:00:00Z"), false);
  assert.equal(evidenceCanStrengthenMessagingCurrentness("UNKNOWN", currentness("CURRENT"), "2026-09-12T09:00:00Z"), false);
  assert.equal(evidenceCanStrengthenMessagingCurrentness("KNOWN", currentness("UNKNOWN"), "2026-09-12T09:00:00Z"), false);
  assert.equal(evidenceCanStrengthenMessagingCurrentness("KNOWN", currentness("STALE"), "2026-09-12T09:00:00Z"), false);
  assert.equal(evidenceCanStrengthenMessagingCurrentness("KNOWN", currentness("CURRENT"), "2026-09-12T11:00:00Z"), false);
});

test("TASK-527 preserves explicit historical subscription revision", () => {
  const normalized = normalizeMessagingIdentityEnvelope(envelope());
  assert.equal(normalized.subscription.subscriptionRef, "subscription:accounting");
  assert.equal(normalized.subscription.subscriptionRevisionRef, "subscription:accounting:r3");
  assert.equal(normalized.subscription.subscriberRef, "service:accounting");
});

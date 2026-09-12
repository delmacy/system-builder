import assert from "node:assert/strict";
import test from "node:test";

import { PROVIDER_QUALIFICATION_CONTRACT_VERSION } from "../../packages/contracts/provider/qualification.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";
import {
  MESSAGING_PROVIDER_COEXISTENCE_CONTRACT_VERSION,
  normalizeMessagingProviderCoexistenceEnvelope,
  providerBindingCanStrengthenAvailability,
  providerOverlapImpliesDuplicateBusinessOccurrence,
  substitutionPreservesHistoricalLineage,
  type MessagingProviderCoexistenceEnvelope,
} from "../../packages/contracts/messaging/messaging-provider-coexistence.js";

const evaluatedAt = "2026-09-12T12:00:00Z";
const rev = (canonicalRef: string, revisionRef: string, semanticKind: string) => ({
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "provider-owner",
  semanticKind,
  canonicalRef,
  definitionRef: `${canonicalRef}-definition`,
  revisionOwner: "provider-owner",
  revisionDimension: "definition",
  revisionRef,
});

const qualification = (canonicalRef: string, revisionRef: string, providerRealizationRef: string, state: "CURRENT" | "STALE" | "UNKNOWN" = "CURRENT") => {
  const binding = rev(canonicalRef, revisionRef, "provider-binding");
  const evidence = rev(`${canonicalRef}/evidence`, `evidence-${revisionRef}`, "provider-qualification-evidence");
  return {
    contractVersion: PROVIDER_QUALIFICATION_CONTRACT_VERSION,
    binding,
    providerRealizationRef,
    evidence,
    currentness: {
      contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
      subject: evidence,
      revisionVector: [{ revisionOwner: "provider-owner", revisionDimension: "definition", revisionRef: evidence.revisionRef }],
      temporal: { occurredAt: null, observedAt: evaluatedAt, evaluatedAt: null, effectiveFrom: null, effectiveUntil: null, reconciledAt: evaluatedAt },
      populationScope: `provider-binding/${canonicalRef}`,
      localityScope: "global",
      currentnessHorizon: { assessedAt: "2026-09-12T11:00:00Z", validUntil: "2026-09-12T13:00:00Z" },
      state,
      reason: "TASK-531 provider qualification proof",
    },
    evidenceAuthority: "AUTHORITATIVE" as const,
    dimensions: [{ dimension: "messaging", status: "SUPPORTED" as const, reason: "qualified messaging provider" }],
    disposition: state === "CURRENT" ? "SUPPORTED" as const : "UNKNOWN" as const,
  };
};

const envelope = (overrides: Record<string, unknown> = {}): MessagingProviderCoexistenceEnvelope => normalizeMessagingProviderCoexistenceEnvelope({
  contractVersion: MESSAGING_PROVIDER_COEXISTENCE_CONTRACT_VERSION,
  occurrenceRef: "occurrence:42",
  messageRef: "message:42",
  subscriptionRef: "subscription:invoice",
  bindings: [
    {
      bindingRef: "binding:queue-a",
      substitutionEpochRef: "epoch:1",
      phase: "DRAINING",
      qualification: qualification("binding:queue-a", "r1", "provider:queue-a"),
      completeness: "KNOWN",
      effectiveFrom: "2026-09-12T10:00:00Z",
      effectiveUntil: "2026-09-12T12:30:00Z",
    },
    {
      bindingRef: "binding:queue-b",
      substitutionEpochRef: "epoch:2",
      phase: "ACTIVE",
      qualification: qualification("binding:queue-b", "r2", "provider:queue-b"),
      completeness: "KNOWN",
      effectiveFrom: "2026-09-12T11:30:00Z",
      effectiveUntil: null,
    },
  ],
  historicalDeliveries: [{
    deliveryRef: "delivery:42:1",
    messageRef: "message:42",
    occurrenceRef: "occurrence:42",
    bindingRef: "binding:queue-a",
    providerRealizationRef: "provider:queue-a",
    substitutionEpochRef: "epoch:1",
  }],
  ...overrides,
});

test("TASK-531 represents qualified old/new provider overlap without duplicating canonical occurrence", () => {
  const value = envelope();
  assert.equal(value.bindings.length, 2);
  assert.equal(providerBindingCanStrengthenAvailability(value.bindings[1]!, evaluatedAt), true);
  assert.equal(providerOverlapImpliesDuplicateBusinessOccurrence(value, value), false);
});

test("TASK-531 stale PARTIAL or UNKNOWN evidence cannot strengthen availability", () => {
  const base = envelope();
  assert.equal(providerBindingCanStrengthenAvailability({ ...base.bindings[1]!, completeness: "PARTIAL" }, evaluatedAt), false);
  assert.equal(providerBindingCanStrengthenAvailability({ ...base.bindings[1]!, completeness: "UNKNOWN" }, evaluatedAt), false);
  const stale = envelope({ bindings: [{ ...base.bindings[1]!, qualification: qualification("binding:queue-b", "r2", "provider:queue-b", "STALE") }] });
  assert.equal(providerBindingCanStrengthenAvailability(stale.bindings[0]!, evaluatedAt), false);
});

test("TASK-531 provider realization equality never substitutes canonical binding identity", () => {
  const left = envelope();
  assert.throws(() => normalizeMessagingProviderCoexistenceEnvelope({
    ...left,
    bindings: [{ ...left.bindings[1]!, bindingRef: "binding:other" }],
  }), /preserve provider binding canonical identity/);
});

test("TASK-531 substitution preserves historical delivery lineage and rejects rewrite", () => {
  const before = envelope();
  const after = envelope({
    bindings: [before.bindings[1]],
    historicalDeliveries: [...before.historicalDeliveries],
  });
  assert.equal(substitutionPreservesHistoricalLineage(before, after), true);

  const rewritten = envelope({
    bindings: [before.bindings[1]],
    historicalDeliveries: [{ ...before.historicalDeliveries[0]!, providerRealizationRef: "provider:queue-b" }],
  });
  assert.equal(substitutionPreservesHistoricalLineage(before, rewritten), false);
});

test("TASK-531 substitution epoch and effective interval remain explicit", () => {
  const value = envelope();
  assert.equal(value.bindings[0]!.substitutionEpochRef, "epoch:1");
  assert.equal(value.bindings[1]!.substitutionEpochRef, "epoch:2");
  assert.equal(providerBindingCanStrengthenAvailability({ ...value.bindings[1]!, effectiveFrom: "2026-09-12T12:30:00Z" }, evaluatedAt), false);
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  assessExternalEffect,
  type ExternalEffectSnapshot,
  type RetryCandidate,
} from "../../packages/contracts/workflow/external-effect-reconciliation";
import type { ProducingRevisionRef } from "../../packages/contracts/workflow/durable-execution";

const revision: ProducingRevisionRef = {
  definitionRef: "workflow:order",
  revisionRef: "revision:a",
  contractVersion: "1",
};

const baseSnapshot = (overrides: Partial<ExternalEffectSnapshot> = {}): ExternalEffectSnapshot => ({
  effectRef: "effect:charge:order-1",
  executionRef: "execution:1",
  producingRevision: revision,
  currentRevision: revision,
  knowledge: "KNOWN",
  outcome: "NOT_APPLIED",
  reconciliation: "NOT_REQUIRED",
  attempts: [{ attemptRef: "attempt:1", deliveryRef: "delivery:1", providerAcknowledged: false }],
  idempotency: {
    key: "charge:order-1",
    authorityRef: "authority:payments",
    scopeRef: "merchant:1",
    payloadFingerprint: "sha256:payload-a",
    validUntil: "2026-09-12T00:00:00Z",
  },
  ...overrides,
});

const retry = (overrides: Partial<RetryCandidate> = {}): RetryCandidate => ({
  authorityRef: "authority:payments",
  scopeRef: "merchant:1",
  payloadFingerprint: "sha256:payload-a",
  evaluatedAt: "2026-09-11T20:00:00Z",
  currentRevision: revision,
  ...overrides,
});

test("keeps effect identity distinct from attempt and delivery identity", () => {
  const result = assessExternalEffect(baseSnapshot(), retry());
  assert.equal(result.valid, true);
  assert.equal(result.retryAllowed, true);

  const collapsed = assessExternalEffect(baseSnapshot({ effectRef: "attempt:1" }), retry());
  assert.equal(collapsed.retryAllowed, false);
  assert.ok(collapsed.reasons.includes("ATTEMPT_OR_DELIVERY_COLLAPSES_TO_EFFECT_IDENTITY"));
});

test("provider acknowledgement never proves the business effect", () => {
  const result = assessExternalEffect(baseSnapshot({
    knowledge: "UNKNOWN",
    outcome: "NOT_OBSERVED",
    reconciliation: "REQUIRED",
    attempts: [{ attemptRef: "attempt:1", providerAcknowledged: true }],
  }), retry());
  assert.equal(result.effectApplied, false);
  assert.equal(result.retryAllowed, false);
  assert.ok(result.reasons.includes("PROVIDER_ACK_IS_NOT_BUSINESS_EFFECT"));
  assert.ok(result.reasons.includes("UNKNOWN_REQUIRES_AUTHORITATIVE_RECONCILIATION"));
});

test("UNKNOWN becomes retryable only after authoritative reconciliation", () => {
  const blocked = assessExternalEffect(baseSnapshot({ knowledge: "UNKNOWN", outcome: "NOT_OBSERVED", reconciliation: "REQUIRED" }), retry());
  assert.equal(blocked.retryAllowed, false);

  const reconciled = assessExternalEffect(baseSnapshot({
    knowledge: "UNKNOWN",
    outcome: "NOT_APPLIED",
    reconciliation: "RECONCILED",
    authorityRef: "authority:payments",
  }), retry());
  assert.equal(reconciled.retryAllowed, true);
});

test("idempotency is qualified by authority scope payload and horizon", () => {
  for (const candidate of [
    retry({ authorityRef: "authority:other" }),
    retry({ scopeRef: "merchant:2" }),
    retry({ payloadFingerprint: "sha256:payload-b" }),
    retry({ evaluatedAt: "2026-09-13T00:00:00Z" }),
  ]) {
    assert.equal(assessExternalEffect(baseSnapshot(), candidate).retryAllowed, false);
  }
});

test("stale revision evidence cannot authorize retry", () => {
  const newer: ProducingRevisionRef = { ...revision, revisionRef: "revision:b" };
  const result = assessExternalEffect(baseSnapshot(), retry({ currentRevision: newer }));
  assert.equal(result.retryAllowed, false);
  assert.ok(result.reasons.includes("STALE_REVISION_EVIDENCE"));
});

test("known applied effect blocks duplicate retry", () => {
  const result = assessExternalEffect(baseSnapshot({ outcome: "APPLIED" }), retry());
  assert.equal(result.effectApplied, true);
  assert.equal(result.retryAllowed, false);
  assert.ok(result.reasons.includes("EFFECT_ALREADY_APPLIED"));
});

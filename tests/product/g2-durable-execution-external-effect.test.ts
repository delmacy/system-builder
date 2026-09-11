import assert from "node:assert/strict";
import test from "node:test";

import {
  assessExternalEffectRetry,
  type ExternalEffectIdentity,
  type EffectAttemptEvidence,
  type IdempotencyQualification,
  type RetryCandidate,
} from "../../packages/contracts/workflow/external-effect-reconciliation";
import type { ProducingRevisionRef } from "../../packages/contracts/workflow/durable-execution";

const revisionA: ProducingRevisionRef = { definitionRef: "workflow:order", revisionRef: "revision:a", contractVersion: "1" };
const revisionB: ProducingRevisionRef = { definitionRef: "workflow:order", revisionRef: "revision:b", contractVersion: "1" };
const identity: ExternalEffectIdentity = { executionRef: "execution:1", effectRef: "effect:charge:1", producingRevision: revisionA };
const attempt = (overrides: Partial<EffectAttemptEvidence> = {}): EffectAttemptEvidence => ({
  attemptRef: "attempt:1",
  deliveryRef: "delivery:1",
  effectRef: identity.effectRef,
  producingRevision: revisionA,
  transportAck: "REJECTED",
  observation: "ABSENT",
  knowledge: "KNOWN",
  authorityRef: "authority:payments",
  currentnessRef: "current:42",
  ...overrides,
});
const idempotency = (overrides: Partial<IdempotencyQualification> = {}): IdempotencyQualification => ({
  keyRef: "idem:charge:1",
  authorityRef: "authority:payments",
  scopeRef: "tenant:1",
  payloadDigest: "sha256:payload-a",
  validUntilEpochMs: 2000,
  ...overrides,
});
const candidate = (overrides: Partial<RetryCandidate> = {}): RetryCandidate => ({
  effectRef: identity.effectRef,
  producingRevision: revisionA,
  authorityRef: "authority:payments",
  scopeRef: "tenant:1",
  payloadDigest: "sha256:payload-a",
  nowEpochMs: 1000,
  expectedCurrentnessRef: "current:42",
  ...overrides,
});

test("authorizes retry only after authoritative current evidence proves effect absent", () => {
  const result = assessExternalEffectRetry(identity, attempt(), idempotency(), candidate());
  assert.equal(result.effectConfirmed, false);
  assert.equal(result.reconcileRequired, false);
  assert.equal(result.retryAuthorized, true);
});

test("provider or API ACK does not prove the business effect", () => {
  const result = assessExternalEffectRetry(identity, attempt({ transportAck: "ACKNOWLEDGED", observation: "UNKNOWN" }), idempotency(), candidate());
  assert.equal(result.effectConfirmed, false);
  assert.equal(result.retryAuthorized, false);
  assert.equal(result.reconcileRequired, true);
  assert.ok(result.reasons.includes("ACK_IS_NOT_BUSINESS_EFFECT"));
  assert.ok(result.reasons.includes("RECONCILE_BEFORE_RETRY"));
});

test("attempt or delivery identity cannot collapse into effect identity", () => {
  const result = assessExternalEffectRetry(identity, attempt({ attemptRef: identity.effectRef }), idempotency(), candidate());
  assert.equal(result.retryAuthorized, false);
  assert.ok(result.reasons.includes("ATTEMPT_OR_DELIVERY_ID_CANNOT_BE_EFFECT_ID"));
});

test("UNKNOWN or PARTIAL evidence requires reconciliation before retry", () => {
  for (const knowledge of ["UNKNOWN", "PARTIAL"] as const) {
    const result = assessExternalEffectRetry(identity, attempt({ knowledge }), idempotency(), candidate());
    assert.equal(result.retryAuthorized, false);
    assert.equal(result.reconcileRequired, true);
    assert.ok(result.reasons.includes("RECONCILE_BEFORE_RETRY"));
  }
});

test("stale producing revision cannot authorize retry", () => {
  const result = assessExternalEffectRetry(identity, attempt({ producingRevision: revisionB }), idempotency(), candidate());
  assert.equal(result.retryAuthorized, false);
  assert.equal(result.reconcileRequired, true);
  assert.ok(result.reasons.includes("PRODUCING_REVISION_MISMATCH"));
});

test("idempotency is qualified by authority scope payload and retention horizon", () => {
  for (const [qualification, retry, reason] of [
    [idempotency({ authorityRef: "authority:other" }), candidate(), "IDEMPOTENCY_AUTHORITY_MISMATCH"],
    [idempotency({ scopeRef: "tenant:2" }), candidate(), "IDEMPOTENCY_SCOPE_MISMATCH"],
    [idempotency({ payloadDigest: "sha256:payload-b" }), candidate(), "IDEMPOTENCY_PAYLOAD_MISMATCH"],
    [idempotency({ validUntilEpochMs: 999 }), candidate(), "IDEMPOTENCY_HORIZON_EXPIRED"],
  ] as const) {
    const result = assessExternalEffectRetry(identity, attempt(), qualification, retry);
    assert.equal(result.retryAuthorized, false);
    assert.ok(result.reasons.includes(reason));
  }
});

test("authoritative confirmation prevents duplicate retry", () => {
  const result = assessExternalEffectRetry(identity, attempt({ transportAck: "ACKNOWLEDGED", observation: "CONFIRMED" }), idempotency(), candidate());
  assert.equal(result.effectConfirmed, true);
  assert.equal(result.retryAuthorized, false);
  assert.equal(result.reconcileRequired, false);
});

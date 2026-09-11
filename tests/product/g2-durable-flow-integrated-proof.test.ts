import assert from "node:assert/strict";
import test from "node:test";

import {
  assessDurableExecution,
  type DurableExecutionSnapshot,
  type ProducingRevisionRef,
} from "../../packages/contracts/workflow/durable-execution";
import {
  assessExternalEffectRetry,
  type ExternalEffectIdentity,
  type EffectAttemptEvidence,
  type IdempotencyQualification,
  type RetryCandidate,
} from "../../packages/contracts/workflow/external-effect-reconciliation";
import {
  assessFiniteFlow,
  type DrainageAssumptions,
  type FiniteFlowPopulationIdentity,
} from "../../packages/contracts/finite-flow/finite-flow";
import type { UnitReference } from "../../packages/contracts/mathematical-semantics/index";

const revisionA: ProducingRevisionRef = { definitionRef: "workflow:order", revisionRef: "revision:a", contractVersion: "1" };
const revisionB: ProducingRevisionRef = { definitionRef: "workflow:order", revisionRef: "revision:b", contractVersion: "1" };
const effectIdentity: ExternalEffectIdentity = { executionRef: "execution:1", effectRef: "effect:charge:1", producingRevision: revisionA };
const population: FiniteFlowPopulationIdentity = { queueRef: "queue:orders", populationRef: "tenant:1:orders", scopeRef: "tenant:1" };
const rateUnit: UnitReference = {
  state: "KNOWN",
  unitRef: "items-per-second",
  unitRevision: "1",
  dimension: { terms: [{ axis: "item", exponent: 1 }, { axis: "time", exponent: -1 }] },
};

const execution = (overrides: Partial<DurableExecutionSnapshot> = {}): DurableExecutionSnapshot => ({
  executionRef: effectIdentity.executionRef,
  producingRevision: revisionA,
  stage: "PROCESSED",
  knowledge: "KNOWN",
  journal: [
    { executionRef: effectIdentity.executionRef, producingRevision: revisionA, sequence: 1, stage: "ACCEPTED", knowledge: "KNOWN", evidenceRefs: ["accept:1"] },
    { executionRef: effectIdentity.executionRef, producingRevision: revisionA, sequence: 2, stage: "PROCESSED", knowledge: "KNOWN", evidenceRefs: ["process:1"] },
  ],
  ...overrides,
});
const attempt = (overrides: Partial<EffectAttemptEvidence> = {}): EffectAttemptEvidence => ({
  attemptRef: "attempt:1",
  deliveryRef: "delivery:1",
  effectRef: effectIdentity.effectRef,
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
  scopeRef: population.scopeRef,
  payloadDigest: "sha256:payload-a",
  validUntilEpochMs: 2000,
  ...overrides,
});
const candidate = (overrides: Partial<RetryCandidate> = {}): RetryCandidate => ({
  effectRef: effectIdentity.effectRef,
  producingRevision: revisionA,
  authorityRef: "authority:payments",
  scopeRef: population.scopeRef,
  payloadDigest: "sha256:payload-a",
  nowEpochMs: 1000,
  expectedCurrentnessRef: "current:42",
  ...overrides,
});
const flow = (overrides: Partial<DrainageAssumptions> = {}): DrainageAssumptions => ({
  horizonMs: 10_000,
  arrival: { value: 5, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  service: { value: 10, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items: 20, knowledge: "KNOWN", telemetryComplete: true },
  replay: { requestedItems: 2, maximumReplayItems: 5, deduplicationBoundItems: 5 },
  ...overrides,
});

test("composes revision-pinned processing, authoritative retry and bounded drainage without strengthening convergence", () => {
  const durable = assessDurableExecution(execution());
  const retry = assessExternalEffectRetry(effectIdentity, attempt(), idempotency(), candidate());
  const finite = assessFiniteFlow(population, flow());

  assert.equal(durable.valid, true);
  assert.equal(durable.accepted, true);
  assert.equal(durable.processed, true);
  assert.equal(durable.converged, false);
  assert.equal(retry.retryAuthorized, true);
  assert.equal(retry.reconcileRequired, false);
  assert.equal(finite.drainable, true);
  assert.equal(finite.residualItemsUpperBound, 0);
});

test("revision drift cannot reinterpret in-flight execution or authorize its external-effect retry", () => {
  const durable = assessDurableExecution(execution({
    journal: [{ executionRef: effectIdentity.executionRef, producingRevision: revisionB, sequence: 1, stage: "ACCEPTED", knowledge: "KNOWN", evidenceRefs: ["accept:stale"] }],
    stage: "ACCEPTED",
  }));
  const retry = assessExternalEffectRetry(effectIdentity, attempt({ producingRevision: revisionB }), idempotency(), candidate());

  assert.equal(durable.valid, false);
  assert.ok(durable.reasons.includes("PRODUCING_REVISION_MISMATCH"));
  assert.equal(retry.retryAuthorized, false);
  assert.equal(retry.reconcileRequired, true);
  assert.ok(retry.reasons.includes("PRODUCING_REVISION_MISMATCH"));
});

test("ACK with UNKNOWN effect evidence forces reconcile-before-retry and cannot imply convergence", () => {
  const durable = assessDurableExecution(execution());
  const retry = assessExternalEffectRetry(effectIdentity, attempt({ transportAck: "ACKNOWLEDGED", observation: "UNKNOWN", knowledge: "UNKNOWN" }), idempotency(), candidate());

  assert.equal(durable.converged, false);
  assert.equal(retry.retryAuthorized, false);
  assert.equal(retry.reconcileRequired, true);
  assert.ok(retry.reasons.includes("ACK_IS_NOT_BUSINESS_EFFECT"));
  assert.ok(retry.reasons.includes("RECONCILE_BEFORE_RETRY"));
});

test("expired idempotency horizon blocks retry and therefore cannot strengthen finite-flow recovery", () => {
  const retry = assessExternalEffectRetry(effectIdentity, attempt(), idempotency({ validUntilEpochMs: 999 }), candidate());
  const finite = assessFiniteFlow(population, flow({ replay: { requestedItems: 2, maximumReplayItems: 5, deduplicationBoundItems: 5 } }));

  assert.equal(retry.retryAuthorized, false);
  assert.ok(retry.reasons.includes("IDEMPOTENCY_HORIZON_EXPIRED"));
  assert.equal(finite.drainable, true);
  assert.equal(finite.residualItemsUpperBound, 0);
  // Flow capacity being healthy is not authority to bypass the failed idempotency qualification.
  assert.equal(retry.retryAuthorized && finite.drainable, false);
});

test("population mismatch or telemetry gap keeps recovery closed even when effect retry is otherwise qualified", () => {
  const retry = assessExternalEffectRetry(effectIdentity, attempt(), idempotency(), candidate());
  const mismatched = assessFiniteFlow(population, flow({ service: { ...flow().service, populationRef: "all-tenants" } }));
  const telemetryGap = assessFiniteFlow(population, flow({ backlog: { ...flow().backlog, items: 0, telemetryComplete: false } }));

  assert.equal(retry.retryAuthorized, true);
  assert.equal(mismatched.drainable, false);
  assert.equal(mismatched.admission, "CLOSED");
  assert.ok(mismatched.reasons.includes("SERVICE_POPULATION_OR_SCOPE_MISMATCH"));
  assert.equal(telemetryGap.drainable, false);
  assert.equal(telemetryGap.admission, "CLOSED");
  assert.ok(telemetryGap.reasons.includes("BACKLOG_TELEMETRY_INCOMPLETE"));
});

test("PARTIAL or UNKNOWN evidence never strengthens terminal success, retry authority, capacity or drainage", () => {
  const durable = assessDurableExecution(execution({ knowledge: "PARTIAL" }));
  const retry = assessExternalEffectRetry(effectIdentity, attempt({ knowledge: "UNKNOWN" }), idempotency(), candidate());
  const finite = assessFiniteFlow(population, flow({ service: { ...flow().service, knowledge: "UNKNOWN" } }));

  assert.equal(durable.valid, false);
  assert.equal(durable.converged, false);
  assert.equal(retry.retryAuthorized, false);
  assert.equal(retry.reconcileRequired, true);
  assert.equal(finite.drainable, false);
  assert.equal(finite.admission, "CLOSED");
});

test("residual backlog remains explicit when the declared recovery horizon cannot drain it", () => {
  const finite = assessFiniteFlow(population, flow({ horizonMs: 1000, backlog: { ...flow().backlog, items: 20 } }));

  assert.equal(finite.drainable, false);
  assert.equal(finite.residualItemsUpperBound, 17);
  assert.equal(finite.admission, "BACKPRESSURE");
  assert.ok(finite.reasons.includes("DECLARED_HORIZON_DOES_NOT_DRAIN_POPULATION"));
});

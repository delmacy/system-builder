import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_USAGE_OBSERVATION_VERSION,
  normalizeModelUsageObservationEnvelope,
} from "../../packages/contracts/ai-gateway/usage-observation.js";

const policyId = "policy:usage-observation";

function baseObservation() {
  return {
    contractVersion: AI_GATEWAY_USAGE_OBSERVATION_VERSION,
    observationId: "observation:1",
    requestId: "request:1",
    responseId: "response:1",
    quality: { score: 0.98, scale: "ratio" },
    failure: null,
    cost: { amount: 0.012, unit: "usd" },
    evidenceRefs: ["evidence:b", "evidence:a"],
  };
}

test("usage observation normalizes provider-neutral quality and cost evidence", () => {
  assert.deepEqual(normalizeModelUsageObservationEnvelope({
    permissionPolicyId: policyId,
    permissions: { quality: true, failure: false, cost: true },
    observation: baseObservation(),
  }), {
    permissionPolicyId: policyId,
    permissions: { quality: true, failure: false, cost: true },
    observation: { ...baseObservation(), contractVersion: "1.0.0", evidenceRefs: ["evidence:a", "evidence:b"] },
  });
});

test("usage observation permits explicit failure evidence without requiring a response", () => {
  const normalized = normalizeModelUsageObservationEnvelope({
    permissionPolicyId: policyId,
    permissions: { quality: false, failure: true, cost: false },
    observation: {
      ...baseObservation(),
      responseId: null,
      quality: null,
      failure: { code: "timeout", category: "transport" },
      cost: null,
      evidenceRefs: ["evidence:failure"],
    },
  });
  assert.deepEqual(normalized.observation.failure, { code: "timeout", category: "transport" });
  assert.equal(normalized.observation.responseId, null);
});

test("denied measurements fail closed", () => {
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicyId: policyId,
    permissions: { quality: false, failure: false, cost: true },
    observation: baseObservation(),
  }), /quality observation must be null/);
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicyId: policyId,
    permissions: { quality: true, failure: false, cost: false },
    observation: baseObservation(),
  }), /cost observation must be null/);
});

test("malformed and non-canonical observation material fails closed", () => {
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicyId: policyId,
    permissions: { quality: true, failure: false, cost: true },
    observation: { ...baseObservation(), cost: { amount: -1, unit: "usd" } },
  }), /finite and non-negative/);
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicyId: policyId,
    permissions: { quality: true, failure: false, cost: true },
    observation: { ...baseObservation(), evidenceRefs: ["evidence:a", "evidence:a"] },
  }), /must not contain duplicates/);
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicyId: policyId,
    permissions: { quality: true, failure: false, cost: true },
    observation: { ...baseObservation(), providerPayload: { opaque: "forbidden" } },
  }), /unexpected field providerPayload/);
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicyId: policyId,
    permissions: { quality: true, failure: false, cost: true },
    observation: { ...baseObservation(), credential: "forbidden" },
  }), /unexpected field credential/);
});

test("usage observation does not become audit authority, approval, authorization or storage policy", () => {
  const normalized = normalizeModelUsageObservationEnvelope({
    permissionPolicyId: policyId,
    permissions: { quality: true, failure: false, cost: true },
    observation: baseObservation(),
  });
  for (const forbidden of ["approved", "authorized", "authority", "auditTrail", "providerId", "backend", "storage", "billing"]) {
    assert.equal(forbidden in normalized, false);
    assert.equal(forbidden in normalized.observation, false);
  }
});

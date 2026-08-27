import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_USAGE_OBSERVATION_VERSION,
  evaluateUsageObservationPermission,
  normalizeModelUsageObservationEnvelope,
} from "../../packages/contracts/ai-gateway/usage-observation.js";

const policyId = "policy:usage-observation";

function permissionPolicy(permittedMeasurements: readonly ("quality" | "failure" | "cost")[]) {
  return { policyId, permittedMeasurements } as const;
}

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

test("usage observation derives provider-neutral measurement permission from explicit policy", () => {
  assert.deepEqual(normalizeModelUsageObservationEnvelope({
    permissionPolicy: permissionPolicy(["quality", "cost"]),
    observation: baseObservation(),
  }), {
    permission: { permissionPolicyId: policyId, permittedMeasurements: ["cost", "quality"] },
    observation: { ...baseObservation(), contractVersion: "1.0.0", evidenceRefs: ["evidence:a", "evidence:b"] },
  });
});

test("usage observation permits explicit failure evidence only when policy grants failure measurement", () => {
  const normalized = normalizeModelUsageObservationEnvelope({
    permissionPolicy: permissionPolicy(["failure"]),
    observation: {
      ...baseObservation(),
      responseId: null,
      quality: null,
      failure: { code: "timeout", category: "transport" },
      cost: null,
      evidenceRefs: ["evidence:failure"],
    },
  });
  assert.deepEqual(normalized.permission, { permissionPolicyId: policyId, permittedMeasurements: ["failure"] });
  assert.deepEqual(normalized.observation.failure, { code: "timeout", category: "transport" });
  assert.equal(normalized.observation.responseId, null);
});

test("caller-supplied boolean permission claims are rejected", () => {
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicyId: policyId,
    permissions: { quality: true, failure: true, cost: true },
    observation: baseObservation(),
  }), /unexpected field permissionPolicyId|missing field permissionPolicy/);
});

test("measurements not granted by policy fail closed", () => {
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicy: permissionPolicy(["cost"]),
    observation: baseObservation(),
  }), /quality observation must be null/);
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicy: permissionPolicy(["quality"]),
    observation: baseObservation(),
  }), /cost observation must be null/);
});

test("permission policy is canonical, bounded and fail-closed", () => {
  assert.deepEqual(evaluateUsageObservationPermission(permissionPolicy(["quality", "cost"])), {
    permissionPolicyId: policyId,
    permittedMeasurements: ["cost", "quality"],
  });
  assert.throws(() => evaluateUsageObservationPermission({ policyId, permittedMeasurements: ["quality", "quality"] }), /must not contain duplicates/);
  assert.throws(() => evaluateUsageObservationPermission({ policyId, permittedMeasurements: ["quality", "billing"] }), /unsupported measurement/);
});

test("malformed and non-canonical observation material fails closed", () => {
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicy: permissionPolicy(["quality", "cost"]),
    observation: { ...baseObservation(), cost: { amount: -1, unit: "usd" } },
  }), /finite and non-negative/);
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicy: permissionPolicy(["quality", "cost"]),
    observation: { ...baseObservation(), evidenceRefs: ["evidence:a", "evidence:a"] },
  }), /must not contain duplicates/);
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicy: permissionPolicy(["quality", "cost"]),
    observation: { ...baseObservation(), providerPayload: { opaque: "forbidden" } },
  }), /unexpected field providerPayload/);
  assert.throws(() => normalizeModelUsageObservationEnvelope({
    permissionPolicy: permissionPolicy(["quality", "cost"]),
    observation: { ...baseObservation(), credential: "forbidden" },
  }), /unexpected field credential/);
});

test("usage observation does not become audit authority, approval, authorization or storage policy", () => {
  const normalized = normalizeModelUsageObservationEnvelope({
    permissionPolicy: permissionPolicy(["quality", "cost"]),
    observation: baseObservation(),
  });
  for (const forbidden of ["approved", "authorized", "authority", "auditTrail", "providerId", "backend", "storage", "billing"]) {
    assert.equal(forbidden in normalized, false);
    assert.equal(forbidden in normalized.observation, false);
  }
});

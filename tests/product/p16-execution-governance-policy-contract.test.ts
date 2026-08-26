import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  normalizeExecutionGovernancePolicyDescriptor,
  normalizeModelRequest,
} from "../../packages/contracts/ai-gateway/index.js";

test("execution governance policy descriptor is explicit, versioned and provider-neutral", () => {
  const descriptor = normalizeExecutionGovernancePolicyDescriptor({
    contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
    policyId: "policy:interactive-assist",
    intent: "interactive-assist",
    policyRef: "governance://interactive-assist/v1",
  });

  assert.deepEqual(descriptor, {
    contractVersion: "1.0.0",
    policyId: "policy:interactive-assist",
    intent: "interactive-assist",
    policyRef: "governance://interactive-assist/v1",
  });
  assert.equal("providerId" in descriptor, false);
  assert.equal("credential" in descriptor, false);
  assert.equal("authorized" in descriptor, false);
  assert.equal("endpoint" in descriptor, false);
});

test("execution governance policy normalization fails closed for invalid or unknown fields", () => {
  assert.throws(
    () => normalizeExecutionGovernancePolicyDescriptor({
      contractVersion: "2.0.0",
      policyId: "policy:a",
      intent: "assist",
      policyRef: "governance://a/v1",
    }),
    /unsupported AI Gateway execution governance contract version/,
  );
  assert.throws(
    () => normalizeExecutionGovernancePolicyDescriptor({
      contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
      policyId: "policy:a",
      intent: "",
      policyRef: "governance://a/v1",
    }),
    /intent must be a non-empty string/,
  );
  assert.throws(
    () => normalizeExecutionGovernancePolicyDescriptor({
      contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
      policyId: "policy:a",
      intent: "assist",
      policyRef: "governance://a/v1",
      providerId: "vendor-a",
    }),
    /unexpected field providerId/,
  );
});

test("execution governance policy contract preserves predecessor request compatibility", () => {
  const request = normalizeModelRequest({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:governance-compatibility-001",
    input: { prompt: "hello" },
  });
  assert.equal(request.requestId, "request:governance-compatibility-001");
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_METADATA_VERSION,
  normalizeModelExecutionMetadataEnvelope,
} from "../../packages/contracts/ai-gateway/execution-metadata.js";

const permissionPolicyId = "policy:metadata-contract";

test("execution metadata is accepted only when explicitly permitted and policy-linked", () => {
  assert.deepEqual(normalizeModelExecutionMetadataEnvelope({
    metadataPermitted: true,
    permissionPolicyId,
    metadata: {
      contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
      modelRef: "model:general",
      modelVersion: "2026-08",
      cost: { amount: 0.012, unit: "usd" },
      provenanceRefs: ["evidence:b", "evidence:a"],
    },
  }), {
    metadataPermitted: true,
    permissionPolicyId,
    metadata: {
      contractVersion: "1.0.0",
      modelRef: "model:general",
      modelVersion: "2026-08",
      cost: { amount: 0.012, unit: "usd" },
      provenanceRefs: ["evidence:a", "evidence:b"],
    },
  });
});

test("permission evidence is mandatory even when metadata is denied", () => {
  assert.deepEqual(normalizeModelExecutionMetadataEnvelope({ metadataPermitted: false, permissionPolicyId, metadata: null }), {
    metadataPermitted: false,
    permissionPolicyId,
    metadata: null,
  });
  assert.throws(() => normalizeModelExecutionMetadataEnvelope({ metadataPermitted: false, metadata: null }), /permissionPolicyId/);
  assert.throws(() => normalizeModelExecutionMetadataEnvelope({
    metadataPermitted: false,
    permissionPolicyId,
    metadata: {
      contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
      modelRef: "model:a",
      modelVersion: "v1",
      cost: null,
      provenanceRefs: [],
    },
  }), /metadata must be null/);
});

test("execution metadata fails closed for invalid cost, provenance and secret/provider material", () => {
  assert.throws(() => normalizeModelExecutionMetadataEnvelope({
    metadataPermitted: true,
    permissionPolicyId,
    metadata: {
      contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
      modelRef: "model:a",
      modelVersion: "v1",
      cost: { amount: -1, unit: "usd" },
      provenanceRefs: [],
    },
  }), /finite and non-negative/);
  assert.throws(() => normalizeModelExecutionMetadataEnvelope({
    metadataPermitted: true,
    permissionPolicyId,
    metadata: {
      contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
      modelRef: "model:a",
      modelVersion: "v1",
      cost: null,
      provenanceRefs: ["evidence:a", "evidence:a"],
    },
  }), /must not contain duplicates/);
  assert.throws(() => normalizeModelExecutionMetadataEnvelope({
    metadataPermitted: true,
    permissionPolicyId,
    metadata: {
      contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
      modelRef: "model:a",
      modelVersion: "v1",
      cost: null,
      provenanceRefs: [],
      credential: "secret",
    },
  }), /unexpected field credential/);
});

test("metadata result never implies approval or authorization", () => {
  const result = normalizeModelExecutionMetadataEnvelope({ metadataPermitted: true, permissionPolicyId, metadata: null });
  assert.equal("authorized" in result, false);
  assert.equal("approved" in result, false);
  assert.equal("providerId" in result, false);
});

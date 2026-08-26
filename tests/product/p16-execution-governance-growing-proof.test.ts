import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
} from "../../packages/contracts/ai-gateway/index.js";
import { AI_GATEWAY_EXECUTION_METADATA_VERSION } from "../../packages/contracts/ai-gateway/execution-metadata.js";
import {
  normalizeExecutionGovernanceComposition,
  proveExecutionGovernancePredecessorCompatibility,
} from "../../packages/contracts/ai-gateway/governance-composition.js";

const governance = {
  policy: {
    contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
    policyId: "policy:growing-proof",
    intent: "extract",
    policyRef: "policy-ref:growing-proof",
  },
  rules: {
    contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
    policyId: "policy:growing-proof",
    routingEligibility: [{ ruleId: "route:json", requiredCapabilities: ["json", "text"] }],
    budgetQuotas: [{ ruleId: "budget:tokens", metric: "tokens", limit: 4096, window: "request" }],
    fallbacks: [{ ruleId: "fallback:none", allowed: false, order: [] }],
  },
  structuredOutputSchema: {
    schemaRef: "schema:growing-proof",
    required: ["answer"],
    properties: { answer: "string" },
  },
  metadata: {
    metadataPermitted: true,
    metadata: {
      contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
      modelRef: "model:abstract",
      modelVersion: "v1",
      cost: { amount: 0.01, unit: "usd" },
      provenanceRefs: ["evidence:contract", "evidence:policy"],
    },
  },
} as const;

test("Construction A growing proof composes explicit governance without hidden provider or authority state", () => {
  const normalized = normalizeExecutionGovernanceComposition(governance);
  assert.equal(normalized.policy.policyId, "policy:growing-proof");
  assert.deepEqual(normalized.rules.routingEligibility[0]?.requiredCapabilities, ["json", "text"]);
  assert.equal(normalized.rules.fallbacks[0]?.allowed, false);
  assert.deepEqual(normalized.metadata.metadata?.provenanceRefs, ["evidence:contract", "evidence:policy"]);
  assert.equal("providerId" in normalized, false);
  assert.equal("credential" in normalized, false);
  assert.equal("authorized" in normalized, false);
});

test("Construction A growing proof preserves WBS 16.1 request/response compatibility and validates output explicitly", () => {
  const proof = proveExecutionGovernancePredecessorCompatibility({
    request: {
      contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
      requestId: "req:growing-proof",
      input: { prompt: "extract" },
    },
    response: {
      contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
      requestId: "req:growing-proof",
      responseId: "resp:growing-proof",
      output: { answer: "ok" },
    },
    capabilities: {
      contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
      capabilities: ["text", "json"],
      limits: { contextTokens: 8192 },
    },
    governance,
  });
  assert.equal(proof.request.requestId, "req:growing-proof");
  assert.equal(proof.response.responseId, "resp:growing-proof");
  assert.deepEqual(proof.capabilities.capabilities, ["json", "text"]);
  assert.deepEqual(proof.structuredOutput, { status: "valid", schemaRef: "schema:growing-proof" });
});

test("Construction A growing proof fails closed for policy, schema and metadata violations", () => {
  assert.throws(() => normalizeExecutionGovernanceComposition({
    ...governance,
    rules: { ...governance.rules, policyId: "policy:mismatch" },
  }), /policyId must match/);

  assert.throws(() => normalizeExecutionGovernanceComposition({
    ...governance,
    rules: {
      ...governance.rules,
      budgetQuotas: [{ ruleId: "budget:invalid", metric: "tokens", limit: 0, window: "request" }],
    },
  }), /finite positive number/);

  assert.throws(() => normalizeExecutionGovernanceComposition({
    ...governance,
    metadata: { metadataPermitted: false, metadata: governance.metadata.metadata },
  }), /metadata must be null/);

  const invalidOutput = proveExecutionGovernancePredecessorCompatibility({
    request: { contractVersion: AI_GATEWAY_MODEL_IO_VERSION, requestId: "req:invalid", input: null },
    response: {
      contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
      requestId: "req:invalid",
      responseId: "resp:invalid",
      output: { answer: 42 },
    },
    capabilities: { contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION, capabilities: [], limits: {} },
    governance,
  });
  assert.equal(invalidOutput.structuredOutput.status, "invalid");
});

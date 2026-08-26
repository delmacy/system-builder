import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
} from "../../packages/contracts/ai-gateway/index.js";
import {
  AI_GATEWAY_EXECUTION_METADATA_VERSION,
} from "../../packages/contracts/ai-gateway/execution-metadata.js";
import {
  normalizeExecutionGovernanceComposition,
  proveExecutionGovernancePredecessorCompatibility,
} from "../../packages/contracts/ai-gateway/governance-composition.js";

const governanceInput = {
  policy: {
    contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
    policyId: "policy:default",
    intent: "summarize",
    policyRef: "policy-ref:1",
  },
  rules: {
    contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
    policyId: "policy:default",
    routingEligibility: [
      { ruleId: "route:b", requiredCapabilities: ["tool", "text"] },
      { ruleId: "route:a", requiredCapabilities: ["json"] },
    ],
    budgetQuotas: [
      { ruleId: "budget:b", metric: "tokens", limit: 2000, window: "request" },
      { ruleId: "budget:a", metric: "cost", limit: 1, window: "request" },
    ],
    fallbacks: [
      { ruleId: "fallback:b", allowed: false, order: [] },
      { ruleId: "fallback:a", allowed: true, order: ["model:general", "model:backup"] },
    ],
  },
  structuredOutputSchema: {
    schemaRef: "schema:summary",
    required: ["summary", "score"],
    properties: { score: "number", summary: "string" },
  },
  metadata: {
    metadataPermitted: true,
    metadata: {
      contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
      modelRef: "model:general",
      modelVersion: "2026-08",
      cost: { amount: 0.02, unit: "usd" },
      provenanceRefs: ["evidence:b", "evidence:a"],
    },
  },
} as const;

test("composed governance normalization is deterministic and canonical", () => {
  const normalized = normalizeExecutionGovernanceComposition(governanceInput);
  assert.deepEqual(normalized.rules.routingEligibility.map((rule) => rule.ruleId), ["route:a", "route:b"]);
  assert.deepEqual(normalized.rules.routingEligibility[1]?.requiredCapabilities, ["text", "tool"]);
  assert.deepEqual(normalized.rules.budgetQuotas.map((rule) => rule.ruleId), ["budget:a", "budget:b"]);
  assert.deepEqual(normalized.rules.fallbacks.map((rule) => rule.ruleId), ["fallback:a", "fallback:b"]);
  assert.deepEqual(normalized.structuredOutputSchema.required, ["score", "summary"]);
  assert.deepEqual(normalized.metadata.metadata?.provenanceRefs, ["evidence:a", "evidence:b"]);
  assert.deepEqual(normalizeExecutionGovernanceComposition(normalized), normalized);
});

test("composition fails closed for inconsistent and malformed governance states", () => {
  assert.throws(() => normalizeExecutionGovernanceComposition({
    ...governanceInput,
    rules: { ...governanceInput.rules, policyId: "policy:other" },
  }), /policyId must match/);

  assert.throws(() => normalizeExecutionGovernanceComposition({
    ...governanceInput,
    rules: {
      ...governanceInput.rules,
      budgetQuotas: [{ ruleId: "budget:x", metric: "tokens", limit: 0, window: "request" }],
    },
  }), /finite positive number/);

  assert.throws(() => normalizeExecutionGovernanceComposition({
    ...governanceInput,
    structuredOutputSchema: {
      schemaRef: "schema:bad",
      required: ["missing"],
      properties: { summary: "string" },
    },
  }), /required property missing is not declared/);

  assert.throws(() => normalizeExecutionGovernanceComposition({
    ...governanceInput,
    metadata: {
      metadataPermitted: false,
      metadata: governanceInput.metadata.metadata,
    },
  }), /metadata must be null/);
});

test("predecessor WBS 16.1 request response and capability contracts remain compatible", () => {
  const proof = proveExecutionGovernancePredecessorCompatibility({
    request: {
      contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
      requestId: "req-1",
      input: { prompt: "summarize" },
    },
    response: {
      contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
      requestId: "req-1",
      responseId: "resp-1",
      output: { summary: "done", score: 1 },
    },
    capabilities: {
      contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
      capabilities: ["text", "json"],
      limits: { contextTokens: 8192 },
    },
    governance: governanceInput,
  });

  assert.equal(proof.request.requestId, "req-1");
  assert.equal(proof.response.responseId, "resp-1");
  assert.deepEqual(proof.capabilities.capabilities, ["json", "text"]);
  assert.deepEqual(proof.structuredOutput, { status: "valid", schemaRef: "schema:summary" });
  assert.equal("providerId" in proof, false);
  assert.equal("authorized" in proof, false);
  assert.equal("credential" in proof, false);
});

test("predecessor integration preserves explicit structured-output failure", () => {
  const proof = proveExecutionGovernancePredecessorCompatibility({
    request: { contractVersion: AI_GATEWAY_MODEL_IO_VERSION, requestId: "req-2", input: null },
    response: {
      contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
      requestId: "req-2",
      responseId: "resp-2",
      output: { summary: "done", score: "high" },
    },
    capabilities: {
      contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
      capabilities: [],
      limits: {},
    },
    governance: governanceInput,
  });
  assert.equal(proof.structuredOutput.status, "invalid");
});

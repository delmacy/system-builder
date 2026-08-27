import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  type ModelProviderAdapter,
} from "../../packages/contracts/ai-gateway/index.js";
import { AI_GATEWAY_EXECUTION_METADATA_VERSION } from "../../packages/contracts/ai-gateway/execution-metadata.js";
import { invokeGovernedModelProvider } from "../../packages/contracts/ai-gateway/governed-invocation.js";

const policyId = "policy:344";
const request = {
  contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
  requestId: "request:344",
  input: { prompt: "integrated proof" },
} as const;
const rules = {
  contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  policyId,
  routingEligibility: [{ ruleId: "route:structured", requiredCapabilities: ["json"] }],
  budgetQuotas: [{ ruleId: "budget:tokens", metric: "tokens", limit: 256, window: "request" }],
  fallbacks: [],
} as const;
const capabilities = {
  contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  capabilities: ["json"],
  limits: { contextTokens: 4096 },
} as const;
const structuredOutputSchema = {
  schemaRef: "schema:344",
  required: ["answer"],
  properties: { answer: "string" },
} as const;

function adapter(counter: { calls: number }): ModelProviderAdapter {
  return {
    async invoke(value) {
      counter.calls += 1;
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: value.requestId,
        responseId: `response:344:${counter.calls}`,
        output: { answer: "ok" },
      };
    },
  };
}

test("integrated WBS 16.2 governed invocation succeeds only through explicit eligible policy", async () => {
  const counter = { calls: 0 };
  const result = await invokeGovernedModelProvider(adapter(counter), {
    request,
    rules,
    capabilities,
    usage: { tokens: 128 },
    structuredOutputSchema,
    executionMetadata: {
      metadataPermitted: true,
      permissionPolicyId: policyId,
      metadata: {
        contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
        modelRef: "model:logical",
        modelVersion: "v1",
        cost: { amount: 0.01, unit: "credit" },
        provenanceRefs: ["evidence:b", "evidence:a"],
      },
    },
  });

  assert.equal(counter.calls, 1);
  assert.equal(result.governance.status, "eligible");
  assert.equal(result.structuredOutput.status, "valid");
  assert.equal(result.response.requestId, request.requestId);
  assert.deepEqual(result.executionMetadata?.metadata?.provenanceRefs, ["evidence:a", "evidence:b"]);
  assert.equal("providerId" in result, false);
  assert.equal("authorized" in result, false);
});

test("policy-limit failure remains fail-closed before adapter invocation", async () => {
  const counter = { calls: 0 };
  await assert.rejects(
    invokeGovernedModelProvider(adapter(counter), {
      request,
      rules,
      capabilities,
      usage: { tokens: 257 },
      structuredOutputSchema,
    }),
    /execution governance is ineligible/,
  );
  assert.equal(counter.calls, 0);
});

test("structured-output invalidity is explicit while metadata denial stays bounded", async () => {
  const invalidAdapter: ModelProviderAdapter = {
    async invoke(value) {
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: value.requestId,
        responseId: "response:344:invalid",
        output: { answer: 42 },
      };
    },
  };
  const result = await invokeGovernedModelProvider(invalidAdapter, {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema,
    executionMetadata: {
      metadataPermitted: false,
      permissionPolicyId: policyId,
      metadata: null,
    },
  });
  assert.equal(result.structuredOutput.status, "invalid");
  assert.deepEqual(result.executionMetadata, {
    metadataPermitted: false,
    permissionPolicyId: policyId,
    metadata: null,
  });
});

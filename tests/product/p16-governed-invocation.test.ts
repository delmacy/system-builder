import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  type ModelProviderAdapter,
} from "../../packages/contracts/ai-gateway/index.js";
import { invokeGovernedModelProvider } from "../../packages/contracts/ai-gateway/governed-invocation.js";

const rules = {
  contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  policyId: "policy:governed-invocation",
  routingEligibility: [
    { ruleId: "route:json", requiredCapabilities: ["json"] },
  ],
  budgetQuotas: [
    { ruleId: "budget:tokens", metric: "tokens", limit: 1024, window: "request" },
  ],
  fallbacks: [],
} as const;

const capabilities = {
  contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  capabilities: ["json"],
  limits: { contextTokens: 4096 },
} as const;

const schema = {
  schemaRef: "schema:answer",
  required: ["answer"],
  properties: { answer: "string" },
} as const;

const request = {
  contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
  requestId: "request:341",
  input: { prompt: "hello" },
} as const;

function adapterWithOutput(output: unknown, counter: { calls: number }): ModelProviderAdapter {
  return {
    async invoke(value) {
      counter.calls += 1;
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: value.requestId,
        responseId: "response:341",
        output,
      };
    },
  };
}

test("governed invocation evaluates policy before invoking the provider-neutral adapter", async () => {
  const counter = { calls: 0 };
  const result = await invokeGovernedModelProvider(adapterWithOutput({ answer: "ok" }, counter), {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
  });

  assert.equal(counter.calls, 1);
  assert.equal(result.governance.status, "eligible");
  assert.deepEqual(result.structuredOutput, { status: "valid", schemaRef: "schema:answer" });
  assert.equal(result.response.requestId, request.requestId);
  assert.equal("providerId" in result, false);
  assert.equal("authorized" in result, false);
});

test("ineligible governance fails closed before adapter invocation", async () => {
  const counter = { calls: 0 };
  await assert.rejects(
    invokeGovernedModelProvider(adapterWithOutput({ answer: "unused" }, counter), {
      request,
      rules,
      capabilities: { ...capabilities, capabilities: [] },
      usage: { tokens: 64 },
      structuredOutputSchema: schema,
    }),
    /execution governance is ineligible: route:json:missing-capability:json/,
  );
  assert.equal(counter.calls, 0);
});

test("existing request/response identity validation remains enforced", async () => {
  const adapter: ModelProviderAdapter = {
    async invoke() {
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: "request:mismatch",
        responseId: "response:341",
        output: { answer: "invalid identity" },
      };
    },
  };

  await assert.rejects(
    invokeGovernedModelProvider(adapter, {
      request,
      rules,
      capabilities,
      usage: { tokens: 64 },
      structuredOutputSchema: schema,
    }),
    /requestId must match invoked requestId/,
  );
});

test("structured output validation state is explicit after response normalization", async () => {
  const counter = { calls: 0 };
  const result = await invokeGovernedModelProvider(adapterWithOutput({ answer: 42 }, counter), {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
  });

  assert.equal(counter.calls, 1);
  assert.deepEqual(result.structuredOutput, {
    status: "invalid",
    schemaRef: "schema:answer",
    errors: ["property answer must be string"],
  });
});

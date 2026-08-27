import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  type ModelRequest,
  type ModelResponse,
} from "../../packages/contracts/ai-gateway/index.js";
import {
  AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
} from "../../packages/contracts/ai-gateway/provider-secret-reference.js";
import {
  invokeGovernedModelProvider,
  type GovernedModelProviderAdapter,
  type GovernedModelProviderInvocationContext,
} from "../../packages/contracts/ai-gateway/governed-invocation.js";

const rules = {
  contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  policyId: "policy:security-observation",
  routingEligibility: [{ ruleId: "route:json", requiredCapabilities: ["json"] }],
  budgetQuotas: [{ ruleId: "budget:tokens", metric: "tokens", limit: 1024, window: "request" }],
  fallbacks: [],
} as const;

const capabilities = {
  contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  capabilities: ["json"],
  limits: { contextTokens: 4096 },
} as const;

const request = {
  contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
  requestId: "request:351",
  input: { prompt: "hello" },
} as const;

const schema = {
  schemaRef: "schema:answer",
  required: ["answer"],
  properties: { answer: "string" },
} as const;

function adapter(capture: {
  request?: ModelRequest;
  context: GovernedModelProviderInvocationContext | undefined;
}): GovernedModelProviderAdapter {
  return {
    async invoke(value: ModelRequest, context?: GovernedModelProviderInvocationContext): Promise<ModelResponse> {
      capture.request = value;
      capture.context = context;
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: value.requestId,
        responseId: "response:351",
        output: { answer: "ok" },
      };
    },
  };
}

test("governed invocation carries only a normalized provider secret reference to the adapter seam", async () => {
  const capture: {
    request?: ModelRequest;
    context: GovernedModelProviderInvocationContext | undefined;
  } = { context: undefined };
  const result = await invokeGovernedModelProvider(adapter(capture), {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
    providerSecretReference: {
      contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
      secretRef: "secret-ref:provider-primary",
    },
  });

  assert.deepEqual(capture.context, {
    providerSecretReference: {
      contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
      secretRef: "secret-ref:provider-primary",
    },
  });
  assert.deepEqual(result.providerSecretReference, capture.context?.providerSecretReference);
  assert.deepEqual(capture.request, request);
  assert.equal(JSON.stringify(capture.request).includes("secret-ref:"), false);
  assert.equal(JSON.stringify(result.response).includes("secret-ref:"), false);
});

test("governed invocation rejects malformed provider secret references before adapter invocation", async () => {
  let calls = 0;
  const rejectingAdapter: GovernedModelProviderAdapter = {
    async invoke(value) {
      calls += 1;
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: value.requestId,
        responseId: "response:351",
        output: { answer: "ok" },
      };
    },
  };

  await assert.rejects(
    invokeGovernedModelProvider(rejectingAdapter, {
      request,
      rules,
      capabilities,
      usage: { tokens: 64 },
      structuredOutputSchema: schema,
      providerSecretReference: {
        contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
        secretRef: "provider-primary",
      },
    }),
    /secretRef must use the secret-ref:<opaque-id> reference form/,
  );
  assert.equal(calls, 0);
});

test("governed invocation rejects secret material disguised beside a valid reference", async () => {
  let calls = 0;
  const rejectingAdapter: GovernedModelProviderAdapter = {
    async invoke(value) {
      calls += 1;
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: value.requestId,
        responseId: "response:351",
        output: { answer: "ok" },
      };
    },
  };

  await assert.rejects(
    invokeGovernedModelProvider(rejectingAdapter, {
      request,
      rules,
      capabilities,
      usage: { tokens: 64 },
      structuredOutputSchema: schema,
      providerSecretReference: {
        contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
        secretRef: "secret-ref:provider-primary",
        secretValue: "must-not-cross-portable-contract",
      },
    }),
    /provider secret reference descriptor has unexpected field secretValue/,
  );
  assert.equal(calls, 0);
});

test("predecessor governed invocation remains compatible without a provider secret reference", async () => {
  const capture: {
    request?: ModelRequest;
    context: GovernedModelProviderInvocationContext | undefined;
  } = { context: undefined };
  const result = await invokeGovernedModelProvider(adapter(capture), {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
  });

  assert.equal(capture.context, undefined);
  assert.equal(result.providerSecretReference, null);
  assert.equal(result.response.requestId, request.requestId);
});

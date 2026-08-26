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

const rules = {
  contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  policyId: "policy:metadata-propagation",
  routingEligibility: [{ ruleId: "route:json", requiredCapabilities: ["json"] }],
  budgetQuotas: [{ ruleId: "budget:tokens", metric: "tokens", limit: 1024, window: "request" }],
  fallbacks: [],
} as const;

const capabilities = {
  contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  capabilities: ["json"],
  limits: { contextTokens: 4096 },
} as const;

const schema = {
  schemaRef: "schema:metadata-answer",
  required: ["answer"],
  properties: { answer: "string" },
} as const;

const request = {
  contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
  requestId: "request:342",
  input: { prompt: "hello" },
} as const;

const adapter: ModelProviderAdapter = {
  async invoke(value) {
    return {
      contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
      requestId: value.requestId,
      responseId: "response:342",
      output: { answer: "ok" },
    };
  },
};

function baseInput(executionMetadata?: unknown) {
  return {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
    ...(executionMetadata === undefined ? {} : { executionMetadata }),
  };
}

test("governed invocation propagates explicitly permitted normalized execution metadata", async () => {
  const result = await invokeGovernedModelProvider(adapter, baseInput({
    metadataPermitted: true,
    metadata: {
      contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
      modelRef: "model:logical-primary",
      modelVersion: "2026-08",
      cost: { amount: 0.0125, unit: "usd" },
      provenanceRefs: ["evidence:z", "evidence:a"],
    },
  }));

  assert.deepEqual(result.executionMetadata, {
    metadataPermitted: true,
    metadata: {
      contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
      modelRef: "model:logical-primary",
      modelVersion: "2026-08",
      cost: { amount: 0.0125, unit: "usd" },
      provenanceRefs: ["evidence:a", "evidence:z"],
    },
  });
  assert.deepEqual(result.structuredOutput, { status: "valid", schemaRef: "schema:metadata-answer" });
  assert.equal(result.governance.status, "eligible");
  assert.equal("providerId" in result.executionMetadata!.metadata!, false);
  assert.equal("credential" in result.executionMetadata!.metadata!, false);
  assert.equal("authorized" in result, false);
});

test("governed invocation preserves explicit metadata denial without synthesizing payload", async () => {
  const result = await invokeGovernedModelProvider(adapter, baseInput({ metadataPermitted: false, metadata: null }));
  assert.deepEqual(result.executionMetadata, { metadataPermitted: false, metadata: null });
});

test("governed invocation does not fabricate metadata when no permission envelope is supplied", async () => {
  const result = await invokeGovernedModelProvider(adapter, baseInput());
  assert.equal(result.executionMetadata, null);
});

test("malformed or forbidden execution metadata fails closed before adapter introspection can matter", async () => {
  await assert.rejects(
    invokeGovernedModelProvider(adapter, baseInput({
      metadataPermitted: false,
      metadata: {
        contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
        modelRef: "model:forbidden",
        modelVersion: "1",
        cost: null,
        provenanceRefs: [],
      },
    })),
    /metadata must be null when metadataPermitted is false/,
  );

  await assert.rejects(
    invokeGovernedModelProvider(adapter, baseInput({
      metadataPermitted: true,
      metadata: {
        contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
        modelRef: "model:logical-primary",
        modelVersion: "1",
        cost: null,
        provenanceRefs: [],
        providerId: "vendor-a",
      },
    })),
    /unexpected field providerId/,
  );
});

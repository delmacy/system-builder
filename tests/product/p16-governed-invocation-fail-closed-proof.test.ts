import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  invokeModelProvider,
  type ModelProviderAdapter,
} from "../../packages/contracts/ai-gateway/index.js";
import { AI_GATEWAY_EXECUTION_METADATA_VERSION } from "../../packages/contracts/ai-gateway/execution-metadata.js";
import { invokeGovernedModelProvider } from "../../packages/contracts/ai-gateway/governed-invocation.js";

const policyId = "policy:fail-closed-proof";
const rules = {
  contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  policyId,
  routingEligibility: [{ ruleId: "route:json", requiredCapabilities: ["json"] }],
  budgetQuotas: [{ ruleId: "budget:tokens", metric: "tokens", limit: 128, window: "request" }],
  fallbacks: [],
} as const;
const capabilities = {
  contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  capabilities: ["json"],
  limits: { contextTokens: 4096 },
} as const;
const request = {
  contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
  requestId: "request:343",
  input: { prompt: "prove boundaries" },
} as const;
const schema = {
  schemaRef: "schema:343",
  required: ["answer"],
  properties: { answer: "string" },
} as const;

function adapterWithOutput(output: unknown, counter: { calls: number }): ModelProviderAdapter {
  return {
    async invoke(value) {
      counter.calls += 1;
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: value.requestId,
        responseId: `response:343:${counter.calls}`,
        output,
      };
    },
  };
}

function governedInput(overrides: Record<string, unknown> = {}) {
  return {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
    ...overrides,
  };
}

test("governance failures stop before the provider-neutral adapter is invoked", async () => {
  for (const override of [
    { capabilities: { ...capabilities, capabilities: [] } },
    { usage: { tokens: 129 } },
  ]) {
    const counter = { calls: 0 };
    await assert.rejects(
      invokeGovernedModelProvider(adapterWithOutput({ answer: "unused" }, counter), governedInput(override)),
      /execution governance is ineligible/,
    );
    assert.equal(counter.calls, 0);
  }
});

test("metadata permission violations fail closed before invocation and never leak forbidden payload", async () => {
  const counter = { calls: 0 };
  await assert.rejects(
    invokeGovernedModelProvider(adapterWithOutput({ answer: "unused" }, counter), governedInput({
      executionMetadata: {
        metadataPermitted: false,
        permissionPolicyId: policyId,
        metadata: {
          contractVersion: AI_GATEWAY_EXECUTION_METADATA_VERSION,
          modelRef: "model:must-not-leak",
          modelVersion: "hidden",
          cost: null,
          provenanceRefs: [],
        },
      },
    })),
    /metadata must be null when metadataPermitted is false/,
  );
  assert.equal(counter.calls, 0);

  await assert.rejects(
    invokeGovernedModelProvider(adapterWithOutput({ answer: "unused" }, counter), governedInput({
      executionMetadata: {
        metadataPermitted: true,
        permissionPolicyId: "policy:mismatch",
        metadata: null,
      },
    })),
    /permissionPolicyId must match evaluated governance policyId/,
  );
  assert.equal(counter.calls, 0);
});

test("schema-invalid output remains explicitly invalid rather than being reported as valid", async () => {
  const counter = { calls: 0 };
  const result = await invokeGovernedModelProvider(
    adapterWithOutput({ answer: 42 }, counter),
    governedInput(),
  );
  assert.equal(counter.calls, 1);
  assert.equal(result.structuredOutput.status, "invalid");
  assert.equal(result.executionMetadata, null);
});

test("request and response identity mismatch remains an explicit predecessor boundary failure", async () => {
  const adapter: ModelProviderAdapter = {
    async invoke() {
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: "request:other",
        responseId: "response:343:mismatch",
        output: { answer: "never accepted" },
      };
    },
  };
  await assert.rejects(
    invokeGovernedModelProvider(adapter, governedInput()),
    /requestId must match invoked requestId/,
  );
});

test("legacy provider-neutral invocation remains backward-compatible and governance-free", async () => {
  const counter = { calls: 0 };
  const response = await invokeModelProvider(
    adapterWithOutput({ legacy: true }, counter),
    request,
  );
  assert.equal(counter.calls, 1);
  assert.equal(response.requestId, request.requestId);
  assert.deepEqual(response.output, { legacy: true });
  assert.equal("governance" in response, false);
  assert.equal("executionMetadata" in response, false);
});

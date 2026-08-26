import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  normalizeModelCapabilityDescriptor,
  normalizeModelRequest,
  normalizeModelResponse,
  type ModelCapabilityDescriptor,
  type ModelProviderAdapter,
  type ModelRequest,
} from "../../packages/contracts/ai-gateway/index.js";

type InMemoryProvider = Readonly<{
  adapter: ModelProviderAdapter;
  capabilities: ModelCapabilityDescriptor;
  implementationMetadata: Readonly<{ implementationName: string }>;
}>;

function createInMemoryProvider(implementationName: string, capabilities: readonly string[]): InMemoryProvider {
  const implementationMetadata = Object.freeze({ implementationName });
  const descriptor = normalizeModelCapabilityDescriptor({
    contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
    capabilities,
    limits: { contextMode: "bounded", maxInputTokens: 4096 },
  });

  return {
    implementationMetadata,
    capabilities: descriptor,
    adapter: {
      async invoke(request: ModelRequest) {
        return normalizeModelResponse({
          contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
          requestId: request.requestId,
          responseId: `response:${implementationMetadata.implementationName}`,
          output: { text: "ok" },
        });
      },
    },
  };
}

async function invokeRequiringCapability(
  provider: InMemoryProvider,
  request: ModelRequest,
  requiredCapability: string,
) {
  if (!provider.capabilities.capabilities.includes(requiredCapability)) {
    throw new Error(`provider capability mismatch: ${requiredCapability}`);
  }
  return provider.adapter.invoke(request);
}

test("changing in-memory provider preserves the canonical central request contract", async () => {
  const request = normalizeModelRequest({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:replaceability-001",
    input: { text: "same business input" },
  });
  const providerA = createInMemoryProvider("fake-a", ["text-generation"]);
  const providerB = createInMemoryProvider("fake-b", ["text-generation", "structured-output"]);

  const responseA = await invokeRequiringCapability(providerA, request, "text-generation");
  const responseB = await invokeRequiringCapability(providerB, request, "text-generation");

  assert.equal(responseA.requestId, request.requestId);
  assert.equal(responseB.requestId, request.requestId);
  assert.deepEqual(request, {
    contractVersion: "1.0.0",
    requestId: "request:replaceability-001",
    input: { text: "same business input" },
  });
  assert.equal("implementationName" in request, false);
  assert.equal("providerId" in request, false);
  assert.equal("authorized" in request, false);
  assert.equal("approved" in request, false);
});

test("capability mismatch and provider-specific request leakage fail explicitly", async () => {
  const request = normalizeModelRequest({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:replaceability-002",
    input: { text: "needs structure" },
  });
  const provider = createInMemoryProvider("text-only", ["text-generation"]);

  await assert.rejects(
    () => invokeRequiringCapability(provider, request, "structured-output"),
    /provider capability mismatch: structured-output/,
  );

  assert.throws(
    () => normalizeModelRequest({
      contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
      requestId: "request:replaceability-003",
      input: { text: "invalid provider leakage" },
      providerId: "fake-a",
    }),
    /unexpected field providerId/,
  );
});

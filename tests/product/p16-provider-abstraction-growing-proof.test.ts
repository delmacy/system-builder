import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  normalizeModelCapabilityDescriptor,
  normalizeModelRequest,
  normalizeModelResponse,
  type ModelProviderAdapter,
  type ModelRequest,
} from "../../packages/contracts/ai-gateway/index.js";

function adapterFor(implementationName: string): ModelProviderAdapter {
  const privateImplementationConfig = Object.freeze({ implementationName });
  return {
    async invoke(request: ModelRequest) {
      return normalizeModelResponse({
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: request.requestId,
        responseId: `response:${privateImplementationConfig.implementationName}`,
        output: { text: "provider-neutral-result" },
      });
    },
  };
}

test("P16 Construction A growing proof spans neutral I/O, capabilities, normalization and adapter replaceability", async () => {
  const request = normalizeModelRequest({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:growing-proof-001",
    input: { text: "same central request" },
  });
  const capabilities = normalizeModelCapabilityDescriptor({
    contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
    capabilities: ["text-generation", "structured-output"],
    limits: {
      maxOutputTokens: 2048,
      contextMode: "bounded",
      maxInputTokens: 8192,
    },
  });

  assert.deepEqual(capabilities.capabilities, ["structured-output", "text-generation"]);
  assert.deepEqual(Object.keys(capabilities.limits), ["contextMode", "maxInputTokens", "maxOutputTokens"]);

  const firstResponse = await adapterFor("fake-a").invoke(request);
  const secondResponse = await adapterFor("fake-b").invoke(request);

  assert.equal(firstResponse.requestId, request.requestId);
  assert.equal(secondResponse.requestId, request.requestId);
  assert.notEqual(firstResponse.responseId, secondResponse.responseId);
  assert.deepEqual(request, {
    contractVersion: "1.0.0",
    requestId: "request:growing-proof-001",
    input: { text: "same central request" },
  });

  for (const value of [request, firstResponse, secondResponse, capabilities]) {
    for (const forbidden of [
      "providerId",
      "provider",
      "endpoint",
      "credential",
      "secret",
      "routing",
      "budget",
      "authorized",
      "approved",
      "decisionCategory",
      "confidence",
    ] as const) {
      assert.equal(forbidden in value, false);
    }
  }
});

test("P16 Construction A growing proof keeps invalid provider leakage fail-closed", () => {
  assert.throws(
    () => normalizeModelRequest({
      contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
      requestId: "request:growing-proof-invalid",
      input: { text: "invalid" },
      providerId: "vendor-specific",
    }),
    /unexpected field providerId/,
  );

  assert.throws(
    () => normalizeModelCapabilityDescriptor({
      contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
      capabilities: ["text-generation", "text-generation"],
      limits: {},
    }),
    /must not contain duplicates/,
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  invokeModelProvider,
  normalizeModelCapabilityDescriptor,
  normalizeModelRequest,
  normalizeModelResponse,
  type ModelProviderAdapter,
} from "../../packages/contracts/ai-gateway/index.js";

const canonicalRequest = {
  contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
  requestId: "request:growing-proof-001",
  input: { prompt: "summarize", value: 42 },
};

const capabilityDescriptor = {
  contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  capabilities: ["structured-output", "text-generation"],
  limits: {
    maxInputTokens: 8192,
    maxOutputTokens: 2048,
  },
};

function adapter(responseId: string): ModelProviderAdapter {
  return {
    async invoke(request) {
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: request.requestId,
        responseId,
        output: { accepted: true, input: request.input },
      };
    },
  };
}

test("WBS 16.1 growing proof spans canonical contracts, capabilities and replaceable invocation", async () => {
  const normalizedRequest = normalizeModelRequest(canonicalRequest);
  const normalizedCapabilities = normalizeModelCapabilityDescriptor(capabilityDescriptor);
  const first = await invokeModelProvider(adapter("response:growing-a"), normalizedRequest);
  const second = await invokeModelProvider(adapter("response:growing-b"), normalizedRequest);

  assert.deepEqual(normalizedRequest, canonicalRequest);
  assert.deepEqual(normalizedCapabilities.capabilities, ["structured-output", "text-generation"]);
  assert.deepEqual(first.output, second.output);
  assert.equal(first.requestId, canonicalRequest.requestId);
  assert.equal(second.requestId, canonicalRequest.requestId);

  for (const value of [normalizedRequest, normalizedCapabilities, first, second]) {
    for (const field of [
      "providerId",
      "provider",
      "endpoint",
      "credential",
      "secret",
      "routing",
      "fallback",
      "approval",
      "authorization",
      "authority",
    ] as const) {
      assert.equal(field in value, false);
    }
  }
});

test("WBS 16.1 growing proof remains fail-closed for malformed responses and unavailable provider", async () => {
  const malformedAdapter: ModelProviderAdapter = {
    async invoke(request) {
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: request.requestId,
        responseId: " ",
        output: null,
      };
    },
  };
  await assert.rejects(invokeModelProvider(malformedAdapter, canonicalRequest), /responseId must be a non-empty string/);

  const unavailable = new Error("provider unavailable");
  const unavailableAdapter: ModelProviderAdapter = {
    async invoke() {
      throw unavailable;
    },
  };
  await assert.rejects(invokeModelProvider(unavailableAdapter, canonicalRequest), (error: unknown) => {
    assert.equal(error, unavailable);
    return true;
  });

  assert.throws(
    () => normalizeModelResponse({
      contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
      requestId: canonicalRequest.requestId,
      responseId: "response:invalid",
      output: null,
      fallback: "synthetic",
    }),
    /unexpected field fallback/,
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  normalizeModelCapabilityDescriptor,
  normalizeModelRequest,
  normalizeModelResponse,
} from "../../packages/contracts/ai-gateway/index.js";

test("equivalent capability descriptors normalize to one canonical ordering", () => {
  const first = normalizeModelCapabilityDescriptor({
    contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
    capabilities: ["structured-output", "text-generation"],
    limits: {
      maxOutputTokens: 2048,
      contextMode: "bounded",
      maxInputTokens: 8192,
    },
  });

  const second = normalizeModelCapabilityDescriptor({
    contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
    capabilities: ["text-generation", "structured-output"],
    limits: {
      maxInputTokens: 8192,
      maxOutputTokens: 2048,
      contextMode: "bounded",
    },
  });

  assert.deepEqual(first, second);
  assert.deepEqual(first.capabilities, ["structured-output", "text-generation"]);
  assert.deepEqual(Object.keys(first.limits), ["contextMode", "maxInputTokens", "maxOutputTokens"]);
});

test("request and response normalization remains fail-closed without hidden defaults", () => {
  const request = normalizeModelRequest({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:normalization-001",
    input: { text: "hello" },
  });
  const response = normalizeModelResponse({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: request.requestId,
    responseId: "response:normalization-001",
    output: { text: "world" },
  });

  assert.deepEqual(request, {
    contractVersion: "1.0.0",
    requestId: "request:normalization-001",
    input: { text: "hello" },
  });
  assert.deepEqual(response, {
    contractVersion: "1.0.0",
    requestId: "request:normalization-001",
    responseId: "response:normalization-001",
    output: { text: "world" },
  });
  assert.equal("providerId" in request, false);
  assert.equal("routing" in request, false);
  assert.equal("credential" in request, false);

  assert.throws(
    () => normalizeModelRequest({
      contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
      requestId: "request:normalization-001",
      input: null,
      providerId: "vendor-a",
    }),
    /unexpected field providerId/,
  );
});

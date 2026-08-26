import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  normalizeModelCapabilityDescriptor,
  normalizeModelRequest,
} from "../../packages/contracts/ai-gateway/index.js";

test("AI Gateway capability and limit descriptors are explicit and provider-neutral", () => {
  const descriptor = normalizeModelCapabilityDescriptor({
    contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
    capabilities: ["text-generation", "structured-output"],
    limits: {
      maxInputTokens: 8192,
      maxOutputTokens: 2048,
      contextMode: "bounded",
    },
  });

  assert.deepEqual(descriptor, {
    contractVersion: "1.0.0",
    capabilities: ["structured-output", "text-generation"],
    limits: {
      contextMode: "bounded",
      maxInputTokens: 8192,
      maxOutputTokens: 2048,
    },
  });
  assert.equal("providerId" in descriptor, false);
  assert.equal("credential" in descriptor, false);
  assert.equal("routing" in descriptor, false);
  assert.equal("budget" in descriptor, false);
  assert.equal("authorized" in descriptor, false);
});

test("AI Gateway capability validation fails closed for invalid descriptor shapes", () => {
  assert.throws(
    () => normalizeModelCapabilityDescriptor({
      contractVersion: "2.0.0",
      capabilities: [],
      limits: {},
    }),
    /unsupported AI Gateway model capability contract version/,
  );
  assert.throws(
    () => normalizeModelCapabilityDescriptor({
      contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
      capabilities: ["text-generation", "text-generation"],
      limits: {},
    }),
    /must not contain duplicates/,
  );
  assert.throws(
    () => normalizeModelCapabilityDescriptor({
      contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
      capabilities: ["text-generation"],
      limits: { maxInputTokens: -1 },
    }),
    /finite non-negative number/,
  );
  assert.throws(
    () => normalizeModelCapabilityDescriptor({
      contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
      capabilities: ["text-generation"],
      limits: { contextMode: "" },
    }),
    /finite non-negative number or non-empty string/,
  );
  assert.throws(
    () => normalizeModelCapabilityDescriptor({
      contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
      capabilities: ["text-generation"],
      limits: {},
      providerId: "vendor-a",
    }),
    /unexpected field providerId/,
  );
});

test("capability descriptors preserve predecessor model request compatibility", () => {
  const request = normalizeModelRequest({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:compatibility-001",
    input: { text: "hello" },
  });
  assert.equal(request.requestId, "request:compatibility-001");
});

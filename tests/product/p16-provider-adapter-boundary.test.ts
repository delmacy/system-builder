import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_MODEL_IO_VERSION,
  normalizeModelRequest,
  normalizeModelResponse,
  type ModelProviderAdapter,
  type ModelRequest,
} from "../../packages/contracts/ai-gateway/index.js";

function createFakeAdapter(providerLabel: string): ModelProviderAdapter {
  const implementationConfig = Object.freeze({ providerLabel });

  return {
    async invoke(request: ModelRequest) {
      return normalizeModelResponse({
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: request.requestId,
        responseId: `response:${implementationConfig.providerLabel}`,
        output: { providerLabel: implementationConfig.providerLabel, echo: request.input },
      });
    },
  };
}

test("two replaceable adapters satisfy the same provider-neutral request contract", async () => {
  const request = normalizeModelRequest({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:adapter-boundary-001",
    input: { text: "hello" },
  });
  const first = createFakeAdapter("fake-a");
  const second = createFakeAdapter("fake-b");

  const [firstResponse, secondResponse] = await Promise.all([
    first.invoke(request),
    second.invoke(request),
  ]);

  assert.equal(firstResponse.requestId, request.requestId);
  assert.equal(secondResponse.requestId, request.requestId);
  assert.equal(firstResponse.contractVersion, AI_GATEWAY_MODEL_IO_VERSION);
  assert.equal(secondResponse.contractVersion, AI_GATEWAY_MODEL_IO_VERSION);

  for (const field of ["providerId", "provider", "endpoint", "credential", "routing", "authorized", "approved"] as const) {
    assert.equal(field in request, false);
  }
});

test("provider-specific adapter configuration remains outside canonical request semantics", async () => {
  const request = normalizeModelRequest({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:adapter-boundary-002",
    input: { text: "same-request" },
  });

  const firstResponse = await createFakeAdapter("implementation-a").invoke(request);
  const secondResponse = await createFakeAdapter("implementation-b").invoke(request);

  assert.deepEqual(request, {
    contractVersion: "1.0.0",
    requestId: "request:adapter-boundary-002",
    input: { text: "same-request" },
  });
  assert.notEqual(firstResponse.responseId, secondResponse.responseId);
  assert.deepEqual(Object.keys(request), ["contractVersion", "requestId", "input"]);
});

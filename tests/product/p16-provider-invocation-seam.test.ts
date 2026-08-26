import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_MODEL_IO_VERSION,
  invokeModelProvider,
  type ModelProviderAdapter,
  type ModelRequest,
} from "../../packages/contracts/ai-gateway/index.js";

test("canonical provider invocation normalizes request before calling injected adapter", async () => {
  let observedRequest: ModelRequest | undefined;
  const adapter: ModelProviderAdapter = {
    async invoke(request) {
      observedRequest = request;
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: request.requestId,
        responseId: "response:canonical-seam-001",
        output: { echo: request.input },
      };
    },
  };

  const response = await invokeModelProvider(adapter, {
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:canonical-seam-001",
    input: { text: "hello" },
  });

  assert.deepEqual(observedRequest, {
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:canonical-seam-001",
    input: { text: "hello" },
  });
  assert.deepEqual(response, {
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:canonical-seam-001",
    responseId: "response:canonical-seam-001",
    output: { echo: { text: "hello" } },
  });
  assert.deepEqual(Object.keys(observedRequest ?? {}), ["contractVersion", "requestId", "input"]);
});

test("malformed provider request fails before adapter invocation", async () => {
  let invoked = false;
  const adapter: ModelProviderAdapter = {
    async invoke(request) {
      invoked = true;
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: request.requestId,
        responseId: "response:should-not-run",
        output: null,
      };
    },
  };

  await assert.rejects(
    invokeModelProvider(adapter, {
      contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
      requestId: " ",
      input: { text: "invalid" },
    }),
    /requestId must be a non-empty string/,
  );
  assert.equal(invoked, false);
});

test("provider identity and routing metadata are not required by the canonical seam", async () => {
  const adapter: ModelProviderAdapter = {
    async invoke(request) {
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: request.requestId,
        responseId: "response:provider-neutral",
        output: "ok",
      };
    },
  };

  const request = {
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:provider-neutral",
    input: "hello",
  };
  const response = await invokeModelProvider(adapter, request);

  for (const field of ["providerId", "provider", "endpoint", "credential", "routing", "fallback"] as const) {
    assert.equal(field in request, false);
    assert.equal(field in response, false);
  }
});

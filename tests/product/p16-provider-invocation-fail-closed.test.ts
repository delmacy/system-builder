import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_MODEL_IO_VERSION,
  invokeModelProvider,
  type ModelProviderAdapter,
} from "../../packages/contracts/ai-gateway/index.js";

const request = {
  contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
  requestId: "request:fail-closed-001",
  input: { text: "hello" },
};

test("canonical invocation rejects malformed adapter response", async () => {
  const adapter = {
    async invoke() {
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: request.requestId,
        responseId: " ",
        output: "invalid",
      };
    },
  } as ModelProviderAdapter;

  await assert.rejects(invokeModelProvider(adapter, request), /responseId must be a non-empty string/);
});

test("canonical invocation rejects response correlated to another request", async () => {
  const adapter: ModelProviderAdapter = {
    async invoke() {
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: "request:different",
        responseId: "response:mismatch",
        output: "invalid",
      };
    },
  };

  await assert.rejects(
    invokeModelProvider(adapter, request),
    /model response requestId must match invoked requestId/,
  );
});

test("adapter rejection remains an explicit failure without synthesized success", async () => {
  const providerFailure = new Error("provider unavailable");
  const adapter: ModelProviderAdapter = {
    async invoke() {
      throw providerFailure;
    },
  };

  await assert.rejects(invokeModelProvider(adapter, request), (error: unknown) => {
    assert.equal(error, providerFailure);
    return true;
  });
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_MODEL_IO_VERSION,
  invokeModelProvider,
  type ModelProviderAdapter,
} from "../../packages/contracts/ai-gateway/index.js";

const request = {
  contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
  requestId: "request:replaceability-001",
  input: { prompt: "classify", value: 7 },
};

function makeAdapter(responseId: string, implementationTag: string): ModelProviderAdapter {
  const internalConfig = { implementationTag };
  return {
    async invoke(modelRequest) {
      assert.equal(internalConfig.implementationTag.length > 0, true);
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: modelRequest.requestId,
        responseId,
        output: { result: "equivalent", echoedInput: modelRequest.input },
      };
    },
  };
}

test("interchangeable adapters use the same canonical request semantics", async () => {
  const first = await invokeModelProvider(makeAdapter("response:adapter-a", "provider-a"), request);
  const second = await invokeModelProvider(makeAdapter("response:adapter-b", "provider-b"), request);

  assert.deepEqual(first.output, second.output);
  assert.equal(first.requestId, request.requestId);
  assert.equal(second.requestId, request.requestId);
  assert.deepEqual(Object.keys(request), ["contractVersion", "requestId", "input"]);

  for (const response of [first, second]) {
    for (const field of [
      "providerId",
      "provider",
      "implementationTag",
      "endpoint",
      "credential",
      "routing",
      "fallback",
      "approval",
      "authorization",
      "authority",
    ] as const) {
      assert.equal(field in response, false);
    }
  }
});

test("provider failure stays explicit and cannot fabricate fallback or authority", async () => {
  const providerFailure = new Error("adapter-b unavailable");
  const failingAdapter: ModelProviderAdapter = {
    async invoke() {
      throw providerFailure;
    },
  };

  await assert.rejects(invokeModelProvider(failingAdapter, request), (error: unknown) => {
    assert.equal(error, providerFailure);
    return true;
  });
});

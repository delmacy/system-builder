import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_MODEL_IO_VERSION,
  normalizeModelRequest,
  normalizeModelResponse,
} from "../../packages/contracts/ai-gateway/index.js";

test("AI Gateway model I/O contract stays provider-neutral", () => {
  const request = normalizeModelRequest({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:summary-001",
    input: { text: "Summarize this record" },
  });
  const response = normalizeModelResponse({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: request.requestId,
    responseId: "response:summary-001",
    output: { summary: "record summary" },
  });

  assert.deepEqual(request, {
    contractVersion: "1.0.0",
    requestId: "request:summary-001",
    input: { text: "Summarize this record" },
  });
  assert.equal(response.requestId, request.requestId);
  for (const envelope of [request, response]) {
    assert.equal("providerId" in envelope, false);
    assert.equal("endpoint" in envelope, false);
    assert.equal("credential" in envelope, false);
    assert.equal("authorized" in envelope, false);
    assert.equal("approved" in envelope, false);
  }
});

test("AI Gateway model I/O validation fails closed for invalid structure", () => {
  assert.throws(
    () => normalizeModelRequest({ contractVersion: "2.0.0", requestId: "request:x", input: null }),
    /unsupported AI Gateway model I\/O contract version/,
  );
  assert.throws(
    () => normalizeModelRequest({ contractVersion: "1.0.0", requestId: "", input: null }),
    /requestId must be a non-empty string/,
  );
  assert.throws(
    () => normalizeModelRequest({ contractVersion: "1.0.0", requestId: "request:x", input: null, providerId: "vendor" }),
    /unexpected field providerId/,
  );
  assert.throws(
    () => normalizeModelResponse({ contractVersion: "1.0.0", requestId: "request:x", output: null }),
    /missing field responseId/,
  );
  assert.throws(
    () => normalizeModelResponse({ contractVersion: "1.0.0", requestId: "request:x", responseId: "response:x", output: null, approved: true }),
    /unexpected field approved/,
  );
});

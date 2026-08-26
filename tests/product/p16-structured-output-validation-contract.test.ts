import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_MODEL_IO_VERSION,
  normalizeModelResponse,
  normalizeStructuredOutputSchema,
  validateStructuredOutput,
} from "../../packages/contracts/ai-gateway/index.js";

const schema = {
  schemaRef: "schema:ticket-summary:v1",
  required: ["summary", "confidence"],
  properties: {
    confidence: "number",
    summary: "string",
  },
} as const;

test("structured output schema normalizes deterministically and validates matching output", () => {
  const normalized = normalizeStructuredOutputSchema(schema);
  assert.deepEqual(normalized, {
    schemaRef: "schema:ticket-summary:v1",
    required: ["confidence", "summary"],
    properties: {
      confidence: "number",
      summary: "string",
    },
  });
  assert.deepEqual(validateStructuredOutput(schema, { summary: "ok", confidence: 0.8 }), {
    status: "valid",
    schemaRef: "schema:ticket-summary:v1",
  });
});

test("structured output validation fails closed without coercion or hidden defaults", () => {
  assert.deepEqual(validateStructuredOutput(schema, { summary: "ok", confidence: "0.8" }), {
    status: "invalid",
    schemaRef: "schema:ticket-summary:v1",
    errors: ["property confidence must be number"],
  });
  assert.deepEqual(validateStructuredOutput(schema, { summary: "ok" }), {
    status: "invalid",
    schemaRef: "schema:ticket-summary:v1",
    errors: ["missing required property confidence"],
  });
  assert.deepEqual(validateStructuredOutput(schema, { summary: "ok", confidence: 0.8, providerId: "vendor-a" }), {
    status: "invalid",
    schemaRef: "schema:ticket-summary:v1",
    errors: ["unexpected property providerId"],
  });
});

test("malformed structured output schemas produce schema-invalid without authorization semantics", () => {
  const result = validateStructuredOutput({
    schemaRef: "schema:bad:v1",
    required: ["missing"],
    properties: { summary: "string" },
  }, { summary: "ok" });
  assert.equal(result.status, "schema-invalid");
  assert.equal(result.schemaRef, "schema:bad:v1");
  assert.equal("authorized" in result, false);
  assert.equal("approved" in result, false);
  assert.equal("providerId" in result, false);
});

test("structured output boundary preserves predecessor model-response compatibility", () => {
  const response = normalizeModelResponse({
    contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
    requestId: "request:structured-001",
    responseId: "response:structured-001",
    output: { summary: "ok", confidence: 0.8 },
  });
  assert.equal(response.responseId, "response:structured-001");
  assert.deepEqual(validateStructuredOutput(schema, response.output), {
    status: "valid",
    schemaRef: "schema:ticket-summary:v1",
  });
});

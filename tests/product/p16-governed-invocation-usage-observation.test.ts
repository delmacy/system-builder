import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
} from "../../packages/contracts/ai-gateway/index.js";
import {
  invokeGovernedModelProvider,
  type GovernedModelProviderAdapter,
} from "../../packages/contracts/ai-gateway/governed-invocation.js";

const capabilities = {
  contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  capabilities: ["json"],
  limits: { contextTokens: 4096 },
} as const;

const request = {
  contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
  requestId: "request:352",
  input: { prompt: "hello" },
} as const;

const schema = {
  schemaRef: "schema:answer",
  required: ["answer"],
  properties: { answer: "string" },
} as const;

function rules(metrics: readonly string[]) {
  return {
    contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
    policyId: "policy:usage-observation",
    routingEligibility: [{ ruleId: "route:json", requiredCapabilities: ["json"] }],
    budgetQuotas: metrics.map((metric) => ({
      ruleId: `budget:${metric}`,
      metric,
      limit: 1024,
      window: "request",
    })),
    fallbacks: [],
  };
}

function adapter(output: unknown): GovernedModelProviderAdapter {
  return {
    async invoke(value) {
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: value.requestId,
        responseId: "response:352",
        output,
      };
    },
  };
}

test("governed invocation derives observation permissions from the evaluated policy", async () => {
  const result = await invokeGovernedModelProvider(adapter({ answer: "ok" }), {
    request,
    rules: rules(["cost", "failure"]),
    capabilities,
    usage: { cost: 1, failure: 0 },
    structuredOutputSchema: schema,
  });

  assert.deepEqual(result.usageObservation.permission, {
    permissionPolicyId: "policy:usage-observation",
    permittedMeasurements: ["cost", "failure"],
  });
  assert.equal(result.usageObservation.observation.quality, null);
  assert.equal(result.usageObservation.observation.failure, null);
  assert.equal(result.usageObservation.observation.cost, null);
  assert.equal(result.usageObservation.observation.requestId, "request:352");
  assert.equal(result.usageObservation.observation.responseId, "response:352");
  assert.deepEqual(result.usageObservation.observation.evidenceRefs, []);
});

test("caller usage claims cannot grant an observation measurement absent from policy", async () => {
  const result = await invokeGovernedModelProvider(adapter({ answer: "ok" }), {
    request,
    rules: rules([]),
    capabilities,
    usage: { cost: 99, quality: 1, failure: 1 },
    structuredOutputSchema: schema,
  });

  assert.deepEqual(result.usageObservation.permission.permittedMeasurements, []);
  assert.equal(result.usageObservation.observation.quality, null);
  assert.equal(result.usageObservation.observation.failure, null);
  assert.equal(result.usageObservation.observation.cost, null);
  assert.equal("authorized" in result.usageObservation, false);
  assert.equal("approved" in result.usageObservation, false);
});

test("structured-output failure is observed only when the evaluated policy permits failure measurement", async () => {
  const result = await invokeGovernedModelProvider(adapter({ answer: 42 }), {
    request,
    rules: rules(["failure"]),
    capabilities,
    usage: { failure: 0 },
    structuredOutputSchema: schema,
  });

  assert.equal(result.structuredOutput.status, "invalid");
  assert.deepEqual(result.usageObservation.observation.failure, {
    code: "structured-output:invalid",
    category: "structured-output",
  });
});

test("missing measurement evidence remains explicit rather than fabricated", async () => {
  const result = await invokeGovernedModelProvider(adapter({ answer: "ok" }), {
    request,
    rules: rules(["quality", "cost"]),
    capabilities,
    usage: { quality: 0, cost: 0 },
    structuredOutputSchema: schema,
  });

  assert.deepEqual(result.usageObservation.permission.permittedMeasurements, ["cost", "quality"]);
  assert.equal(result.usageObservation.observation.quality, null);
  assert.equal(result.usageObservation.observation.cost, null);
});

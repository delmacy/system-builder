import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  type ModelProviderAdapter,
} from "../../packages/contracts/ai-gateway/index.js";
import { AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION } from "../../packages/contracts/ai-gateway/data-knowledge-boundary.js";
import { invokeGovernedModelProvider } from "../../packages/contracts/ai-gateway/governed-invocation.js";

const rules = {
  contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  policyId: "policy:security-observation",
  routingEligibility: [{ ruleId: "route:json", requiredCapabilities: ["json"] }],
  budgetQuotas: [{ ruleId: "budget:tokens", metric: "tokens", limit: 1024, window: "request" }],
  fallbacks: [],
} as const;

const capabilities = {
  contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  capabilities: ["json"],
  limits: { contextTokens: 4096 },
} as const;

const request = {
  contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
  requestId: "request:350",
  input: { prompt: "hello" },
} as const;

const schema = {
  schemaRef: "schema:answer",
  required: ["answer"],
  properties: { answer: "string" },
} as const;

const boundary = {
  contractVersion: AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION,
  boundaryId: "boundary:350",
  allowedDataClasses: ["prompt"],
  allowedKnowledgeRefs: ["knowledge:public"],
} as const;

function adapter(counter: { calls: number }): ModelProviderAdapter {
  return {
    async invoke(value) {
      counter.calls += 1;
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: value.requestId,
        responseId: "response:350",
        output: { answer: "ok" },
      };
    },
  };
}

test("governed invocation enforces allowed pre-send boundary before adapter invocation", async () => {
  const counter = { calls: 0 };
  const result = await invokeGovernedModelProvider(adapter(counter), {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
    preSendBoundary: {
      boundary,
      evidence: {
        boundaryId: "boundary:350",
        dataClasses: ["prompt"],
        knowledgeRefs: ["knowledge:public"],
      },
    },
  });

  assert.equal(counter.calls, 1);
  assert.equal(result.preSendBoundary?.status, "allowed");
  assert.equal(result.response.requestId, request.requestId);
  assert.equal(result.governance.status, "eligible");
});

test("disallowed outbound data fails closed before adapter invocation", async () => {
  const counter = { calls: 0 };
  await assert.rejects(
    invokeGovernedModelProvider(adapter(counter), {
      request,
      rules,
      capabilities,
      usage: { tokens: 64 },
      structuredOutputSchema: schema,
      preSendBoundary: {
        boundary,
        evidence: {
          boundaryId: "boundary:350",
          dataClasses: ["secret"],
          knowledgeRefs: ["knowledge:public"],
        },
      },
    }),
    /pre-send boundary is rejected: data-class-not-allowed:secret/,
  );
  assert.equal(counter.calls, 0);
});

test("malformed boundary evidence fails closed before adapter invocation", async () => {
  const counter = { calls: 0 };
  await assert.rejects(
    invokeGovernedModelProvider(adapter(counter), {
      request,
      rules,
      capabilities,
      usage: { tokens: 64 },
      structuredOutputSchema: schema,
      preSendBoundary: {
        boundary,
        evidence: { boundaryId: "boundary:350", dataClasses: ["prompt"] },
      },
    }),
    /pre-send boundary is invalid: malformed-evidence:/,
  );
  assert.equal(counter.calls, 0);
});

test("predecessor governed invocation remains compatible when no WBS 16.3 boundary is supplied", async () => {
  const counter = { calls: 0 };
  const result = await invokeGovernedModelProvider(adapter(counter), {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
  });

  assert.equal(counter.calls, 1);
  assert.equal(result.preSendBoundary, null);
  assert.equal(result.governance.status, "eligible");
});

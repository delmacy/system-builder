import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  type ModelRequest,
  type ModelResponse,
} from "../../packages/contracts/ai-gateway/index.js";
import { AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION } from "../../packages/contracts/ai-gateway/data-knowledge-boundary.js";
import {
  invokeGovernedModelProvider,
  type GovernedModelProviderAdapter,
  type GovernedModelProviderInvocationContext,
} from "../../packages/contracts/ai-gateway/governed-invocation.js";
import { AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION } from "../../packages/contracts/ai-gateway/provider-secret-reference.js";

const capabilities = {
  contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  capabilities: ["json"],
  limits: { contextTokens: 4096 },
} as const;

const request = {
  contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
  requestId: "request:353",
  input: { prompt: "hello" },
} as const;

const schema = {
  schemaRef: "schema:answer",
  required: ["answer"],
  properties: { answer: "string" },
} as const;

const boundary = {
  contractVersion: AI_GATEWAY_DATA_KNOWLEDGE_BOUNDARY_VERSION,
  boundaryId: "boundary:353",
  allowedDataClasses: ["prompt"],
  allowedKnowledgeRefs: ["knowledge:public"],
} as const;

function rules(observeFailure: boolean, includeFailureQuota = false) {
  return {
    contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
    policyId: "policy:security-observation",
    routingEligibility: [{ ruleId: "route:json", requiredCapabilities: ["json"] }],
    budgetQuotas: [
      { ruleId: "budget:tokens", metric: "tokens", limit: 1024, window: "request" },
      ...(includeFailureQuota
        ? [{ ruleId: "budget:failure", metric: "failure", limit: 1, window: "request" }]
        : []),
    ],
    fallbacks: [],
    observationPermissions: observeFailure
      ? [{ ruleId: "observe:failure", permittedMeasurements: ["failure"] as const }]
      : [],
  };
}

function capturingAdapter(capture: {
  calls: number;
  request?: ModelRequest;
  context: GovernedModelProviderInvocationContext | undefined;
}, output: unknown): GovernedModelProviderAdapter {
  return {
    async invoke(value: ModelRequest, context?: GovernedModelProviderInvocationContext): Promise<ModelResponse> {
      capture.calls += 1;
      capture.request = value;
      capture.context = context;
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: value.requestId,
        responseId: "response:353",
        output,
      };
    },
  };
}

test("integrated governed invocation composes boundary, secret reference and explicit policy-derived observation", async () => {
  const capture: {
    calls: number;
    request?: ModelRequest;
    context: GovernedModelProviderInvocationContext | undefined;
  } = { calls: 0, context: undefined };

  const result = await invokeGovernedModelProvider(capturingAdapter(capture, { answer: 42 }), {
    request,
    rules: rules(true),
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
    preSendBoundary: {
      boundary,
      evidence: {
        boundaryId: "boundary:353",
        dataClasses: ["prompt"],
        knowledgeRefs: ["knowledge:public"],
      },
    },
    providerSecretReference: {
      contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
      secretRef: "secret-ref:provider-primary",
    },
  });

  assert.equal(capture.calls, 1);
  assert.equal(result.preSendBoundary?.status, "allowed");
  assert.equal(capture.context?.providerSecretReference?.secretRef, "secret-ref:provider-primary");
  assert.equal(JSON.stringify(capture.request).includes("secret-ref:"), false);
  assert.deepEqual(result.governance.permittedObservationMeasurements, ["failure"]);
  assert.deepEqual(result.usageObservation.permission, {
    permissionPolicyId: "policy:security-observation",
    permittedMeasurements: ["failure"],
  });
  assert.deepEqual(result.usageObservation.observation.failure, {
    code: "structured-output:invalid",
    category: "structured-output",
  });
  assert.equal("authorized" in result.usageObservation, false);
  assert.equal("approved" in result.usageObservation, false);
  assert.deepEqual(result.governance.fallbacks, []);
});

test("budget quota metric names cannot grant observation permission", async () => {
  const capture: {
    calls: number;
    context: GovernedModelProviderInvocationContext | undefined;
  } = { calls: 0, context: undefined };
  const result = await invokeGovernedModelProvider(capturingAdapter(capture, { answer: 42 }), {
    request,
    rules: rules(false, true),
    capabilities,
    usage: { tokens: 64, failure: 0 },
    structuredOutputSchema: schema,
  });

  assert.equal(result.structuredOutput.status, "invalid");
  assert.deepEqual(result.governance.permittedObservationMeasurements, []);
  assert.deepEqual(result.usageObservation.permission.permittedMeasurements, []);
  assert.equal(result.usageObservation.observation.failure, null);
});

test("undeclared outbound data cannot reach the adapter", async () => {
  const capture: {
    calls: number;
    context: GovernedModelProviderInvocationContext | undefined;
  } = { calls: 0, context: undefined };

  await assert.rejects(
    invokeGovernedModelProvider(capturingAdapter(capture, { answer: "unused" }), {
      request,
      rules: rules(false),
      capabilities,
      usage: { tokens: 64 },
      structuredOutputSchema: schema,
      preSendBoundary: {
        boundary,
        evidence: {
          boundaryId: "boundary:353",
          dataClasses: ["secret"],
          knowledgeRefs: ["knowledge:public"],
        },
      },
      providerSecretReference: {
        contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
        secretRef: "secret-ref:provider-primary",
      },
    }),
    /pre-send boundary is rejected: data-class-not-allowed:secret/,
  );

  assert.equal(capture.calls, 0);
});

test("portable invocation rejects secret material and malformed references before adapter invocation", async () => {
  const capture: {
    calls: number;
    context: GovernedModelProviderInvocationContext | undefined;
  } = { calls: 0, context: undefined };

  await assert.rejects(
    invokeGovernedModelProvider(capturingAdapter(capture, { answer: "unused" }), {
      request,
      rules: rules(false),
      capabilities,
      usage: { tokens: 64 },
      structuredOutputSchema: schema,
      providerSecretReference: {
        contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
        secretRef: "provider-primary",
        secretValue: "must-not-cross-boundary",
      },
    }),
    /provider secret reference descriptor has unexpected field secretValue|secretRef must use the secret-ref:<opaque-id> reference form/,
  );

  assert.equal(capture.calls, 0);
});

test("caller usage facts cannot fabricate observation permission or fallback authority", async () => {
  const capture: {
    calls: number;
    context: GovernedModelProviderInvocationContext | undefined;
  } = { calls: 0, context: undefined };
  const result = await invokeGovernedModelProvider(capturingAdapter(capture, { answer: 42 }), {
    request,
    rules: rules(false),
    capabilities,
    usage: { tokens: 64, failure: 1, cost: 999 },
    structuredOutputSchema: schema,
  });

  assert.equal(capture.calls, 1);
  assert.equal(result.structuredOutput.status, "invalid");
  assert.deepEqual(result.usageObservation.permission.permittedMeasurements, []);
  assert.equal(result.usageObservation.observation.failure, null);
  assert.equal(result.usageObservation.observation.cost, null);
  assert.deepEqual(result.governance.fallbacks, []);
  assert.equal("authorized" in result, false);
});

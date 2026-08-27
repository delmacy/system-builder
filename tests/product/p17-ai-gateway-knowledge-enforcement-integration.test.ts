import assert from "node:assert/strict";
import test from "node:test";
import { DECISION_BOUNDARY_VERSION } from "../../packages/contracts/decision-boundary/index.js";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  AI_GATEWAY_MODEL_IO_VERSION,
  type ModelProviderAdapter,
} from "../../packages/contracts/ai-gateway/index.js";
import { invokeGovernedModelProvider } from "../../packages/contracts/ai-gateway/governed-invocation.js";
import {
  KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
  KNOWLEDGE_CLASSIFICATION_VERSION,
  KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
  KNOWLEDGE_USE_POLICY_VERSION,
} from "../../packages/contracts/knowledge-boundary/index.js";
import {
  KNOWLEDGE_ENFORCEMENT_REFERENCE_VERSION,
} from "../../packages/contracts/knowledge-boundary/reference-projection.js";

const rules = {
  contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  policyId: "policy:p17-ai-gateway",
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
  requestId: "request:p17-375",
  input: { prompt: "bounded" },
} as const;
const schema = {
  schemaRef: "schema:answer",
  required: ["answer"],
  properties: { answer: "string" },
} as const;

function adapter(counter: { calls: number }): ModelProviderAdapter {
  return {
    async invoke(value) {
      counter.calls += 1;
      return {
        contractVersion: AI_GATEWAY_MODEL_IO_VERSION,
        requestId: value.requestId,
        responseId: "response:p17-375",
        output: { answer: "ok" },
      };
    },
  };
}

function enforcementInput(outcome: "allow" | "deny" | "isolate", permissionRef: string | null) {
  const decisionRef = "decision:p17-375";
  const enforcementRef = `enforcement:p17-375:${outcome}`;
  return {
    evaluation: {
      bundle: {
        classification: {
          contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
          knowledgeClass: "client-proprietary",
          ownerRef: "owner:p17-375",
        },
        usePolicy: {
          contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
          purposeIds: ["model-inference"],
          restrictionIds: ["explicit-enforcement-required"],
        },
        decision: {
          contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
          mode: "manual",
          knowledgeClass: "client-proprietary",
          decisionActorRef: "human:p17-375",
          decisionRef,
          humanAuthority: {
            descriptor: {
              boundaryVersion: DECISION_BOUNDARY_VERSION,
              decisionId: "boundary:p17-375",
              category: "human-decision",
            },
            metadata: { authorityRef: "human:p17-375" },
            riskCriticality: { risk: "medium", criticality: "standard" },
          },
        },
      },
      usePolicyRef: "policy:p17-375",
      enforcement: {
        contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
        enforcementRef,
        classificationDecisionRef: decisionRef,
        usePolicyRef: "policy:p17-375",
        purposeId: "model-inference",
        outcome,
        reasonIds: [`outcome:${outcome}`],
      },
      eligibilityRef: "eligibility:p17-375",
      permissionRef,
    },
    reference: {
      contractVersion: KNOWLEDGE_ENFORCEMENT_REFERENCE_VERSION,
      enforcementRef,
      classificationDecisionRef: decisionRef,
      usePolicyRef: "policy:p17-375",
      purposeId: "model-inference",
      outcome,
      reasonIds: [`outcome:${outcome}`],
      evidenceRefs: ["evidence:p17-375"],
    },
  } as const;
}

function invocationInput() {
  return {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
  } as const;
}

test("P17 allow+eligible enforcement composes with governed invocation before adapter call", async () => {
  const counter = { calls: 0 };
  const result = await invokeGovernedModelProvider(adapter(counter), {
    ...invocationInput(),
    knowledgeEnforcement: enforcementInput("allow", "permission:p17-375"),
  });
  assert.equal(counter.calls, 1);
  assert.equal(result.knowledgeEnforcement?.evaluation.enforcementOutcome, "allow");
  assert.equal(result.knowledgeEnforcement?.evaluation.eligibilityStatus, "eligible");
  assert.equal(result.knowledgeEnforcement?.reference.evidenceRefs[0], "evidence:p17-375");
  assert.equal("payload" in (result.knowledgeEnforcement?.reference ?? {}), false);
});

for (const outcome of ["deny", "isolate"] as const) {
  test(`P17 ${outcome} enforcement blocks provider invocation`, async () => {
    const counter = { calls: 0 };
    await assert.rejects(
      invokeGovernedModelProvider(adapter(counter), {
        ...invocationInput(),
        knowledgeEnforcement: enforcementInput(outcome, null),
      }),
      /knowledge enforcement blocks provider invocation/,
    );
    assert.equal(counter.calls, 0);
  });
}

test("P17 ineligible allow state blocks provider invocation", async () => {
  const counter = { calls: 0 };
  await assert.rejects(
    invokeGovernedModelProvider(adapter(counter), {
      ...invocationInput(),
      knowledgeEnforcement: enforcementInput("allow", null),
    }),
    /knowledge enforcement blocks provider invocation: allow\/ineligible/,
  );
  assert.equal(counter.calls, 0);
});

test("P17 malformed or mismatched reference fails closed before adapter invocation", async () => {
  const counter = { calls: 0 };
  const value = enforcementInput("allow", "permission:p17-375");
  await assert.rejects(
    invokeGovernedModelProvider(adapter(counter), {
      ...invocationInput(),
      knowledgeEnforcement: {
        ...value,
        reference: { ...value.reference, enforcementRef: "enforcement:mismatch" },
      },
    }),
    /enforcementRef must match evaluated enforcementRef/,
  );
  await assert.rejects(
    invokeGovernedModelProvider(adapter(counter), {
      ...invocationInput(),
      knowledgeEnforcement: {
        ...value,
        reference: { ...value.reference, payload: { secret: true } },
      },
    }),
    /unexpected field payload/,
  );
  assert.equal(counter.calls, 0);
});

test("P16-only historical callers remain backward-compatible", async () => {
  const counter = { calls: 0 };
  const result = await invokeGovernedModelProvider(adapter(counter), invocationInput());
  assert.equal(counter.calls, 1);
  assert.equal(result.knowledgeEnforcement, null);
});

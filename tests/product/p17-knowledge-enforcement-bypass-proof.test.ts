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
import { evaluateKnowledgeCatalogAdmission } from "../../packages/contracts/knowledge-boundary/catalog-admission.js";
import { KNOWLEDGE_ENFORCEMENT_REFERENCE_VERSION } from "../../packages/contracts/knowledge-boundary/reference-projection.js";
import {
  OBSERVE_KNOWLEDGE_ENFORCEMENT_VERSION,
  projectKnowledgeEnforcementForObservation,
} from "../../packages/observe/knowledge-enforcement.js";

type KnowledgeClass = "client-proprietary" | "personal" | "trade-secret";
type Outcome = "allow" | "deny" | "isolate";

function evaluationInput(knowledgeClass: KnowledgeClass, outcome: Outcome, permissionRef: string | null) {
  const decisionRef = `decision:${knowledgeClass}`;
  const enforcementRef = `enforcement:${knowledgeClass}:${outcome}`;
  return {
    bundle: {
      classification: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
        knowledgeClass,
        ownerRef: `owner:${knowledgeClass}`,
      },
      usePolicy: {
        contractVersion: KNOWLEDGE_USE_POLICY_VERSION,
        purposeIds: ["model-inference"],
        restrictionIds: ["explicit-enforcement-required"],
      },
      decision: {
        contractVersion: KNOWLEDGE_CLASSIFICATION_DECISION_VERSION,
        mode: "manual",
        knowledgeClass,
        decisionActorRef: "human:owner-01",
        decisionRef,
        humanAuthority: {
          descriptor: {
            boundaryVersion: DECISION_BOUNDARY_VERSION,
            decisionId: `boundary:${knowledgeClass}`,
            category: "human-decision",
          },
          metadata: { authorityRef: "human:owner-01" },
          riskCriticality: { risk: "medium", criticality: "standard" },
        },
      },
    },
    usePolicyRef: `policy:${knowledgeClass}`,
    enforcement: {
      contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
      enforcementRef,
      classificationDecisionRef: decisionRef,
      usePolicyRef: `policy:${knowledgeClass}`,
      purposeId: "model-inference",
      outcome,
      reasonIds: [`outcome:${outcome}`],
    },
    eligibilityRef: `eligibility:${knowledgeClass}`,
    permissionRef,
  } as const;
}

function referenceFor(input: ReturnType<typeof evaluationInput>) {
  return {
    contractVersion: KNOWLEDGE_ENFORCEMENT_REFERENCE_VERSION,
    enforcementRef: input.enforcement.enforcementRef,
    classificationDecisionRef: input.enforcement.classificationDecisionRef,
    usePolicyRef: input.enforcement.usePolicyRef,
    purposeId: input.enforcement.purposeId,
    outcome: input.enforcement.outcome,
    reasonIds: input.enforcement.reasonIds,
    evidenceRefs: ["evidence:classification", "evidence:permission"],
  } as const;
}

const rules = {
  contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  policyId: "policy:p17-bypass-proof",
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
  requestId: "request:p17-bypass-proof",
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
        responseId: "response:p17-bypass-proof",
        output: { answer: "ok" },
      };
    },
  };
}

function governedInput(knowledgeClass: KnowledgeClass, outcome: Outcome, permissionRef: string | null) {
  const evaluation = evaluationInput(knowledgeClass, outcome, permissionRef);
  return {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
    knowledgeEnforcement: { evaluation, reference: referenceFor(evaluation) },
  } as const;
}

test("catalog admission never converts missing permission or denied/isolate state into authority", () => {
  for (const knowledgeClass of ["client-proprietary", "personal", "trade-secret"] as const) {
    for (const [outcome, permissionRef] of [["allow", null], ["deny", null], ["isolate", null]] as const) {
      const result = evaluateKnowledgeCatalogAdmission(evaluationInput(knowledgeClass, outcome, permissionRef));
      assert.equal(result.status, "reject");
      assert.equal(result.authorityRef, "human:owner-01");
      assert.equal("approved" in result, false);
      assert.equal("promoted" in result, false);
      assert.equal("reuseAuthorized" in result, false);
    }
  }
});

test("Observe projection validates canonical payload-minimal enforcement internally", () => {
  const base = {
    contractVersion: OBSERVE_KNOWLEDGE_ENFORCEMENT_VERSION,
    enforcementRef: "enforcement:observe-proof",
    classificationDecisionRef: "decision:observe-proof",
    usePolicyRef: "policy:observe-proof",
    purposeId: "model-inference",
    outcome: "allow",
    reasonIds: ["reason:allowed"],
    evidenceRefs: ["evidence:a", "evidence:b"],
  } as const;
  const projected = projectKnowledgeEnforcementForObservation(base);
  assert.equal(projected.outcome, "allow");
  assert.equal("approved" in projected, false);
  assert.equal("promoted" in projected, false);
  assert.throws(() => projectKnowledgeEnforcementForObservation({ ...base, payload: { secret: true } }), /unexpected field payload/);
  assert.throws(() => projectKnowledgeEnforcementForObservation({ ...base, content: "secret" }), /unexpected field content/);
  assert.throws(() => projectKnowledgeEnforcementForObservation({ ...base, enforcementRef: "   " }), /enforcementRef must be a non-empty string/);
  assert.throws(() => projectKnowledgeEnforcementForObservation({ ...base, evidenceRefs: ["evidence:a", "evidence:a"] }), /evidenceRefs must not contain duplicates/);
});

test("AI Gateway rejects missing permission, denied/isolate state and mismatched/payload-bearing references before adapter invocation", async () => {
  for (const [outcome, permissionRef] of [["allow", null], ["deny", null], ["isolate", null]] as const) {
    const counter = { calls: 0 };
    await assert.rejects(
      invokeGovernedModelProvider(adapter(counter), governedInput("client-proprietary", outcome, permissionRef)),
      /knowledge enforcement blocks provider invocation/,
    );
    assert.equal(counter.calls, 0);
  }

  const evaluation = evaluationInput("client-proprietary", "allow", "permission:owner-01");
  const reference = referenceFor(evaluation);
  for (const badReference of [
    { ...reference, classificationDecisionRef: "decision:mismatch" },
    { ...reference, payload: { secret: true } },
  ]) {
    const counter = { calls: 0 };
    await assert.rejects(
      invokeGovernedModelProvider(adapter(counter), {
        request,
        rules,
        capabilities,
        usage: { tokens: 64 },
        structuredOutputSchema: schema,
        knowledgeEnforcement: { evaluation, reference: badReference },
      }),
    );
    assert.equal(counter.calls, 0);
  }
});

test("eligible remains bounded eligibility and preserves canonical human authority across consumers", async () => {
  const evaluation = evaluationInput("client-proprietary", "allow", "permission:owner-01");
  const catalog = evaluateKnowledgeCatalogAdmission(evaluation);
  assert.equal(catalog.status, "admit");
  assert.equal(catalog.authorityRef, "human:owner-01");
  assert.equal("promotionApproved" in catalog, false);

  const counter = { calls: 0 };
  const gateway = await invokeGovernedModelProvider(adapter(counter), {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
    knowledgeEnforcement: { evaluation, reference: referenceFor(evaluation) },
  });
  assert.equal(counter.calls, 1);
  assert.equal(gateway.knowledgeEnforcement?.evaluation.authorityRef, "human:owner-01");
  assert.equal(gateway.knowledgeEnforcement?.evaluation.eligibilityStatus, "eligible");
  assert.equal("approved" in (gateway.knowledgeEnforcement ?? {}), false);
  assert.equal("promoted" in (gateway.knowledgeEnforcement ?? {}), false);
});

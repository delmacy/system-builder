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

function enforcement(permissionRef: string | null, outcome: "allow" | "deny" | "isolate" = "allow") {
  const decisionRef = "decision:construction-b-exit";
  const enforcementRef = `enforcement:construction-b-exit:${outcome}`;
  return {
    evaluation: {
      bundle: {
        classification: {
          contractVersion: KNOWLEDGE_CLASSIFICATION_VERSION,
          knowledgeClass: "client-proprietary",
          ownerRef: "owner:construction-b-exit",
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
          decisionActorRef: "human:owner-exit",
          decisionRef,
          humanAuthority: {
            descriptor: {
              boundaryVersion: DECISION_BOUNDARY_VERSION,
              decisionId: "boundary:construction-b-exit",
              category: "human-decision",
            },
            metadata: { authorityRef: "human:owner-exit" },
            riskCriticality: { risk: "medium", criticality: "standard" },
          },
        },
      },
      usePolicyRef: "policy:construction-b-exit",
      enforcement: {
        contractVersion: KNOWLEDGE_ENFORCEMENT_DISPOSITION_VERSION,
        enforcementRef,
        classificationDecisionRef: decisionRef,
        usePolicyRef: "policy:construction-b-exit",
        purposeId: "model-inference",
        outcome,
        reasonIds: [`outcome:${outcome}`],
      },
      eligibilityRef: "eligibility:construction-b-exit",
      permissionRef,
    },
    reference: {
      contractVersion: KNOWLEDGE_ENFORCEMENT_REFERENCE_VERSION,
      enforcementRef,
      classificationDecisionRef: decisionRef,
      usePolicyRef: "policy:construction-b-exit",
      purposeId: "model-inference",
      outcome,
      reasonIds: [`outcome:${outcome}`],
      evidenceRefs: ["evidence:classification", "evidence:permission"],
    },
  } as const;
}

function observationEnvelope(reference: ReturnType<typeof enforcement>["reference"]) {
  return {
    contractVersion: OBSERVE_KNOWLEDGE_ENFORCEMENT_VERSION,
    enforcementRef: reference.enforcementRef,
    classificationDecisionRef: reference.classificationDecisionRef,
    usePolicyRef: reference.usePolicyRef,
    purposeId: reference.purposeId,
    outcome: reference.outcome,
    reasonIds: reference.reasonIds,
    evidenceRefs: reference.evidenceRefs,
  } as const;
}

const rules = {
  contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  policyId: "policy:construction-b-exit",
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
  requestId: "request:construction-b-exit",
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
        responseId: "response:construction-b-exit",
        output: { answer: "ok" },
      };
    },
  };
}

test("Construction B exit proof composes catalog, Observe and AI Gateway without creating promotion authority", async () => {
  const allowed = enforcement("permission:owner-exit");
  const admission = evaluateKnowledgeCatalogAdmission(allowed.evaluation);
  assert.equal(admission.status, "admit");
  assert.equal(admission.authorityRef, "human:owner-exit");
  assert.equal("promotionApproved" in admission, false);

  const observation = projectKnowledgeEnforcementForObservation(observationEnvelope(allowed.reference));
  assert.equal(observation.outcome, "allow");
  assert.deepEqual(observation.evidenceRefs, ["evidence:classification", "evidence:permission"]);
  assert.equal("payload" in observation, false);

  const counter = { calls: 0 };
  const gateway = await invokeGovernedModelProvider(adapter(counter), {
    request,
    rules,
    capabilities,
    usage: { tokens: 64 },
    structuredOutputSchema: schema,
    knowledgeEnforcement: allowed,
  });
  assert.equal(counter.calls, 1);
  assert.equal(gateway.knowledgeEnforcement?.evaluation.authorityRef, "human:owner-exit");
  assert.equal(gateway.knowledgeEnforcement?.evaluation.eligibilityStatus, "eligible");
  assert.equal("promoted" in (gateway.knowledgeEnforcement ?? {}), false);
});

test("Construction B exit proof keeps unauthorized paths fail-closed before use", async () => {
  const denied = enforcement(null, "deny");
  assert.equal(evaluateKnowledgeCatalogAdmission(denied.evaluation).status, "reject");
  assert.throws(
    () => projectKnowledgeEnforcementForObservation({
      ...observationEnvelope(denied.reference),
      payload: { secret: true },
    }),
    /unexpected field payload/,
  );

  const counter = { calls: 0 };
  await assert.rejects(
    invokeGovernedModelProvider(adapter(counter), {
      request,
      rules,
      capabilities,
      usage: { tokens: 64 },
      structuredOutputSchema: schema,
      knowledgeEnforcement: denied,
    }),
    /knowledge enforcement blocks provider invocation/,
  );
  assert.equal(counter.calls, 0);
});

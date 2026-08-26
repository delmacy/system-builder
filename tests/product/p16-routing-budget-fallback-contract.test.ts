import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  normalizeExecutionGovernanceRuleSet,
} from "../../packages/contracts/ai-gateway/index.js";

test("execution governance rules normalize deterministically without provider identity or hidden defaults", () => {
  const rules = normalizeExecutionGovernanceRuleSet({
    contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
    policyId: "policy:interactive-assist",
    routingEligibility: [
      { ruleId: "route:z", requiredCapabilities: ["vision", "text"] },
      { ruleId: "route:a", requiredCapabilities: ["text"] },
    ],
    budgetQuotas: [
      { ruleId: "budget:tokens", metric: "tokens", limit: 12000, window: "request" },
      { ruleId: "budget:requests", metric: "requests", limit: 100, window: "hour" },
    ],
    fallbacks: [
      { ruleId: "fallback:interactive", allowed: true, order: ["route:primary", "route:secondary"] },
    ],
  });

  assert.deepEqual(rules, {
    contractVersion: "1.0.0",
    policyId: "policy:interactive-assist",
    routingEligibility: [
      { ruleId: "route:a", requiredCapabilities: ["text"] },
      { ruleId: "route:z", requiredCapabilities: ["text", "vision"] },
    ],
    budgetQuotas: [
      { ruleId: "budget:requests", metric: "requests", limit: 100, window: "hour" },
      { ruleId: "budget:tokens", metric: "tokens", limit: 12000, window: "request" },
    ],
    fallbacks: [
      { ruleId: "fallback:interactive", allowed: true, order: ["route:primary", "route:secondary"] },
    ],
  });
  assert.equal("providerId" in rules, false);
  assert.equal("defaultProvider" in rules, false);
  assert.equal("authorized" in rules, false);
  assert.equal("credential" in rules, false);
});

test("execution governance rules fail closed for invalid bounds and ambiguous duplicates", () => {
  assert.throws(
    () => normalizeExecutionGovernanceRuleSet({
      contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
      policyId: "policy:a",
      routingEligibility: [],
      budgetQuotas: [{ ruleId: "budget:a", metric: "tokens", limit: 0, window: "request" }],
      fallbacks: [],
    }),
    /finite positive number/,
  );

  assert.throws(
    () => normalizeExecutionGovernanceRuleSet({
      contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
      policyId: "policy:a",
      routingEligibility: [
        { ruleId: "route:a", requiredCapabilities: ["text"] },
        { ruleId: "route:a", requiredCapabilities: ["vision"] },
      ],
      budgetQuotas: [],
      fallbacks: [],
    }),
    /duplicate ruleId/,
  );

  assert.throws(
    () => normalizeExecutionGovernanceRuleSet({
      contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
      policyId: "policy:a",
      routingEligibility: [],
      budgetQuotas: [],
      fallbacks: [{ ruleId: "fallback:a", allowed: true, order: ["route:a", "route:a"] }],
    }),
    /must not contain duplicates/,
  );
});

test("fallback semantics are always explicit and unknown provider-specific fields are rejected", () => {
  assert.throws(
    () => normalizeExecutionGovernanceRuleSet({
      contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
      policyId: "policy:a",
      routingEligibility: [],
      budgetQuotas: [],
    }),
    /missing field fallbacks/,
  );

  assert.throws(
    () => normalizeExecutionGovernanceRuleSet({
      contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
      policyId: "policy:a",
      routingEligibility: [],
      budgetQuotas: [],
      fallbacks: [],
      providerId: "vendor-a",
    }),
    /unexpected field providerId/,
  );
});

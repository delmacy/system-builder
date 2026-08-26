import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  AI_GATEWAY_MODEL_CAPABILITY_VERSION,
} from "../../packages/contracts/ai-gateway/index.js";
import { evaluateExecutionGovernance } from "../../packages/contracts/ai-gateway/governance-evaluation.js";

const rules = {
  contractVersion: AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION,
  policyId: "policy:integration",
  routingEligibility: [
    { ruleId: "route:structured", requiredCapabilities: ["json", "text"] },
  ],
  budgetQuotas: [
    { ruleId: "budget:tokens", metric: "tokens", limit: 4096, window: "request" },
  ],
  fallbacks: [
    { ruleId: "fallback:explicit", allowed: true, order: ["secondary", "tertiary"] },
  ],
} as const;

const capabilities = {
  contractVersion: AI_GATEWAY_MODEL_CAPABILITY_VERSION,
  capabilities: ["text", "json"],
  limits: { contextTokens: 8192 },
} as const;

test("execution governance evaluation is deterministic and provider-neutral", () => {
  const evaluation = evaluateExecutionGovernance({ rules, capabilities, usage: { tokens: 1024 } });
  assert.deepEqual(evaluation, {
    status: "eligible",
    reasons: [],
    fallbacks: [{ ruleId: "fallback:explicit", allowed: true, order: ["secondary", "tertiary"] }],
  });
  assert.equal("providerId" in evaluation, false);
  assert.equal("authorized" in evaluation, false);
});

test("execution governance fails closed for missing capabilities and usage", () => {
  const evaluation = evaluateExecutionGovernance({
    rules,
    capabilities: { ...capabilities, capabilities: ["text"] },
    usage: {},
  });
  assert.equal(evaluation.status, "ineligible");
  assert.deepEqual(evaluation.reasons, [
    { ruleId: "budget:tokens", code: "missing-usage", subject: "tokens" },
    { ruleId: "route:structured", code: "missing-capability", subject: "json" },
  ]);
});

test("execution governance fails closed when explicit usage exceeds a declared limit", () => {
  const evaluation = evaluateExecutionGovernance({ rules, capabilities, usage: { tokens: 4097 } });
  assert.deepEqual(evaluation.reasons, [
    { ruleId: "budget:tokens", code: "limit-exceeded", subject: "tokens" },
  ]);
  assert.equal(evaluation.status, "ineligible");
});

test("execution governance rejects invalid usage instead of injecting defaults", () => {
  assert.throws(
    () => evaluateExecutionGovernance({ rules, capabilities, usage: { tokens: -1 } }),
    /finite non-negative number/,
  );
  assert.throws(
    () => evaluateExecutionGovernance({ rules, capabilities, usage: null }),
    /usage must be an object/,
  );
});

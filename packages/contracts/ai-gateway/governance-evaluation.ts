import {
  normalizeExecutionGovernanceRuleSet,
  normalizeModelCapabilityDescriptor,
  type ExecutionGovernanceRuleSet,
  type ModelCapabilityDescriptor,
} from "./index.js";

export type ExecutionGovernanceUsage = Readonly<Record<string, number>>;

export type ExecutionGovernanceEvaluationReason = Readonly<{
  ruleId: string;
  code: "missing-capability" | "missing-usage" | "limit-exceeded";
  subject: string;
}>;

export type ExecutionGovernanceEvaluation = Readonly<{
  status: "eligible" | "ineligible";
  reasons: readonly ExecutionGovernanceEvaluationReason[];
  fallbacks: ExecutionGovernanceRuleSet["fallbacks"];
}>;

function normalizeUsage(value: unknown): ExecutionGovernanceUsage {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("execution governance usage must be an object");
  }
  const normalized: Record<string, number> = {};
  for (const [metric, usage] of Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right))) {
    if (metric.trim().length === 0) throw new Error("execution governance usage metric must be non-empty");
    if (typeof usage !== "number" || !Number.isFinite(usage) || usage < 0) {
      throw new Error(`execution governance usage ${metric} must be a finite non-negative number`);
    }
    normalized[metric] = usage;
  }
  return normalized;
}

export function evaluateExecutionGovernance(input: Readonly<{
  rules: unknown;
  capabilities: unknown;
  usage: unknown;
}>): ExecutionGovernanceEvaluation {
  const rules = normalizeExecutionGovernanceRuleSet(input.rules);
  const capabilities: ModelCapabilityDescriptor = normalizeModelCapabilityDescriptor(input.capabilities);
  const usage = normalizeUsage(input.usage);
  const capabilitySet = new Set(capabilities.capabilities);
  const reasons: ExecutionGovernanceEvaluationReason[] = [];

  for (const rule of rules.routingEligibility) {
    for (const capability of rule.requiredCapabilities) {
      if (!capabilitySet.has(capability)) {
        reasons.push({ ruleId: rule.ruleId, code: "missing-capability", subject: capability });
      }
    }
  }

  for (const rule of rules.budgetQuotas) {
    const observed = usage[rule.metric];
    if (observed === undefined) {
      reasons.push({ ruleId: rule.ruleId, code: "missing-usage", subject: rule.metric });
    } else if (observed > rule.limit) {
      reasons.push({ ruleId: rule.ruleId, code: "limit-exceeded", subject: rule.metric });
    }
  }

  reasons.sort((left, right) =>
    left.ruleId.localeCompare(right.ruleId)
    || left.code.localeCompare(right.code)
    || left.subject.localeCompare(right.subject));

  return {
    status: reasons.length === 0 ? "eligible" : "ineligible",
    reasons,
    fallbacks: rules.fallbacks,
  };
}

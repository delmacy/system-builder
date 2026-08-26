export const AI_GATEWAY_MODEL_IO_VERSION = "1.0.0" as const;
export const AI_GATEWAY_MODEL_CAPABILITY_VERSION = "1.0.0" as const;
export const AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION = "1.0.0" as const;

export type ModelRequest = Readonly<{
  contractVersion: typeof AI_GATEWAY_MODEL_IO_VERSION;
  requestId: string;
  input: unknown;
}>;

export type ModelResponse = Readonly<{
  contractVersion: typeof AI_GATEWAY_MODEL_IO_VERSION;
  requestId: string;
  responseId: string;
  output: unknown;
}>;

export type ModelLimitValue = string | number;

export type ModelCapabilityDescriptor = Readonly<{
  contractVersion: typeof AI_GATEWAY_MODEL_CAPABILITY_VERSION;
  capabilities: readonly string[];
  limits: Readonly<Record<string, ModelLimitValue>>;
}>;

export type ExecutionGovernancePolicyDescriptor = Readonly<{
  contractVersion: typeof AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION;
  policyId: string;
  intent: string;
  policyRef: string;
}>;

export type RoutingEligibilityRule = Readonly<{
  ruleId: string;
  requiredCapabilities: readonly string[];
}>;

export type BudgetQuotaRule = Readonly<{
  ruleId: string;
  metric: string;
  limit: number;
  window: string;
}>;

export type FallbackRule = Readonly<{
  ruleId: string;
  allowed: boolean;
  order: readonly string[];
}>;

export type ExecutionGovernanceRuleSet = Readonly<{
  contractVersion: typeof AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION;
  policyId: string;
  routingEligibility: readonly RoutingEligibilityRule[];
  budgetQuotas: readonly BudgetQuotaRule[];
  fallbacks: readonly FallbackRule[];
}>;

export type ModelProviderAdapter = Readonly<{
  invoke(request: ModelRequest): Promise<ModelResponse>;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord, allowed: readonly string[], label: string): void {
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  }
  for (const key of allowed) {
    if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
  }
}

function asNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value;
}

function asBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") throw new Error(`${field} must be a boolean`);
  return value;
}

function asPositiveFiniteNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${field} must be a finite positive number`);
  }
  return value;
}

function assertVersion(value: unknown): typeof AI_GATEWAY_MODEL_IO_VERSION {
  if (value !== AI_GATEWAY_MODEL_IO_VERSION) {
    throw new Error(`unsupported AI Gateway model I/O contract version: ${String(value)}`);
  }
  return AI_GATEWAY_MODEL_IO_VERSION;
}

function assertCapabilityVersion(value: unknown): typeof AI_GATEWAY_MODEL_CAPABILITY_VERSION {
  if (value !== AI_GATEWAY_MODEL_CAPABILITY_VERSION) {
    throw new Error(`unsupported AI Gateway model capability contract version: ${String(value)}`);
  }
  return AI_GATEWAY_MODEL_CAPABILITY_VERSION;
}

function assertExecutionGovernanceVersion(value: unknown): typeof AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION {
  if (value !== AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION) {
    throw new Error(`unsupported AI Gateway execution governance contract version: ${String(value)}`);
  }
  return AI_GATEWAY_EXECUTION_GOVERNANCE_VERSION;
}

function normalizeStringArray(value: unknown, field: string, sort: boolean): readonly string[] {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  const normalized = value.map((item, index) => asNonEmptyString(item, `${field}[${index}]`));
  if (new Set(normalized).size !== normalized.length) throw new Error(`${field} must not contain duplicates`);
  return sort ? [...normalized].sort((left, right) => left.localeCompare(right)) : normalized;
}

function normalizeCapabilities(value: unknown): readonly string[] {
  return normalizeStringArray(value, "capabilities", true);
}

function normalizeLimits(value: unknown): Readonly<Record<string, ModelLimitValue>> {
  const record = asRecord(value, "limits");
  const entries: Array<readonly [string, ModelLimitValue]> = [];
  for (const [key, limit] of Object.entries(record)) {
    asNonEmptyString(key, "limit key");
    if (typeof limit === "number") {
      if (!Number.isFinite(limit) || limit < 0) throw new Error(`limit ${key} must be a finite non-negative number`);
      entries.push([key, limit]);
      continue;
    }
    if (typeof limit === "string" && limit.trim().length > 0) {
      entries.push([key, limit]);
      continue;
    }
    throw new Error(`limit ${key} must be a finite non-negative number or non-empty string`);
  }

  const normalized: Record<string, ModelLimitValue> = {};
  for (const [key, limit] of entries.sort(([left], [right]) => left.localeCompare(right))) {
    normalized[key] = limit;
  }
  return normalized;
}

function normalizeRuleArray<T>(
  value: unknown,
  label: string,
  normalize: (item: unknown, index: number) => T & { readonly ruleId: string },
): readonly T[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  const normalized = value.map(normalize);
  const ids = normalized.map((rule) => rule.ruleId);
  if (new Set(ids).size !== ids.length) throw new Error(`${label} must not contain duplicate ruleId values`);
  return [...normalized].sort((left, right) => left.ruleId.localeCompare(right.ruleId));
}

function normalizeRoutingEligibilityRule(value: unknown, index: number): RoutingEligibilityRule {
  const record = asRecord(value, `routingEligibility[${index}]`);
  assertExactFields(record, ["ruleId", "requiredCapabilities"], `routingEligibility[${index}]`);
  return {
    ruleId: asNonEmptyString(record.ruleId, `routingEligibility[${index}].ruleId`),
    requiredCapabilities: normalizeStringArray(record.requiredCapabilities, `routingEligibility[${index}].requiredCapabilities`, true),
  };
}

function normalizeBudgetQuotaRule(value: unknown, index: number): BudgetQuotaRule {
  const record = asRecord(value, `budgetQuotas[${index}]`);
  assertExactFields(record, ["ruleId", "metric", "limit", "window"], `budgetQuotas[${index}]`);
  return {
    ruleId: asNonEmptyString(record.ruleId, `budgetQuotas[${index}].ruleId`),
    metric: asNonEmptyString(record.metric, `budgetQuotas[${index}].metric`),
    limit: asPositiveFiniteNumber(record.limit, `budgetQuotas[${index}].limit`),
    window: asNonEmptyString(record.window, `budgetQuotas[${index}].window`),
  };
}

function normalizeFallbackRule(value: unknown, index: number): FallbackRule {
  const record = asRecord(value, `fallbacks[${index}]`);
  assertExactFields(record, ["ruleId", "allowed", "order"], `fallbacks[${index}]`);
  return {
    ruleId: asNonEmptyString(record.ruleId, `fallbacks[${index}].ruleId`),
    allowed: asBoolean(record.allowed, `fallbacks[${index}].allowed`),
    order: normalizeStringArray(record.order, `fallbacks[${index}].order`, false),
  };
}

export function normalizeModelRequest(value: unknown): ModelRequest {
  const record = asRecord(value, "model request");
  assertExactFields(record, ["contractVersion", "requestId", "input"], "model request");

  return {
    contractVersion: assertVersion(record.contractVersion),
    requestId: asNonEmptyString(record.requestId, "requestId"),
    input: record.input,
  };
}

export function normalizeModelResponse(value: unknown): ModelResponse {
  const record = asRecord(value, "model response");
  assertExactFields(record, ["contractVersion", "requestId", "responseId", "output"], "model response");

  return {
    contractVersion: assertVersion(record.contractVersion),
    requestId: asNonEmptyString(record.requestId, "requestId"),
    responseId: asNonEmptyString(record.responseId, "responseId"),
    output: record.output,
  };
}

export function normalizeModelCapabilityDescriptor(value: unknown): ModelCapabilityDescriptor {
  const record = asRecord(value, "model capability descriptor");
  assertExactFields(record, ["contractVersion", "capabilities", "limits"], "model capability descriptor");

  return {
    contractVersion: assertCapabilityVersion(record.contractVersion),
    capabilities: normalizeCapabilities(record.capabilities),
    limits: normalizeLimits(record.limits),
  };
}

export function normalizeExecutionGovernancePolicyDescriptor(value: unknown): ExecutionGovernancePolicyDescriptor {
  const record = asRecord(value, "execution governance policy descriptor");
  assertExactFields(record, ["contractVersion", "policyId", "intent", "policyRef"], "execution governance policy descriptor");

  return {
    contractVersion: assertExecutionGovernanceVersion(record.contractVersion),
    policyId: asNonEmptyString(record.policyId, "policyId"),
    intent: asNonEmptyString(record.intent, "intent"),
    policyRef: asNonEmptyString(record.policyRef, "policyRef"),
  };
}

export function normalizeExecutionGovernanceRuleSet(value: unknown): ExecutionGovernanceRuleSet {
  const record = asRecord(value, "execution governance rule set");
  assertExactFields(
    record,
    ["contractVersion", "policyId", "routingEligibility", "budgetQuotas", "fallbacks"],
    "execution governance rule set",
  );

  return {
    contractVersion: assertExecutionGovernanceVersion(record.contractVersion),
    policyId: asNonEmptyString(record.policyId, "policyId"),
    routingEligibility: normalizeRuleArray(record.routingEligibility, "routingEligibility", normalizeRoutingEligibilityRule),
    budgetQuotas: normalizeRuleArray(record.budgetQuotas, "budgetQuotas", normalizeBudgetQuotaRule),
    fallbacks: normalizeRuleArray(record.fallbacks, "fallbacks", normalizeFallbackRule),
  };
}

export async function invokeModelProvider(
  adapter: ModelProviderAdapter,
  value: unknown,
): Promise<ModelResponse> {
  const request = normalizeModelRequest(value);
  const response = normalizeModelResponse(await adapter.invoke(request));
  if (response.requestId !== request.requestId) {
    throw new Error("model response requestId must match invoked requestId");
  }
  return response;
}

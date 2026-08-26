import {
  normalizeExecutionGovernancePolicyDescriptor,
  normalizeExecutionGovernanceRuleSet,
  normalizeModelCapabilityDescriptor,
  normalizeModelRequest,
  normalizeModelResponse,
  normalizeStructuredOutputSchema,
  validateStructuredOutput,
  type ExecutionGovernancePolicyDescriptor,
  type ExecutionGovernanceRuleSet,
  type ModelCapabilityDescriptor,
  type ModelRequest,
  type ModelResponse,
  type StructuredOutputSchema,
  type StructuredOutputValidationResult,
} from "./index.js";
import {
  normalizeModelExecutionMetadataEnvelope,
  type ModelExecutionMetadataEnvelope,
} from "./execution-metadata.js";

export type ExecutionGovernanceCompositionInput = Readonly<{
  policy: unknown;
  rules: unknown;
  structuredOutputSchema: unknown;
  metadata: unknown;
}>;

export type ExecutionGovernanceComposition = Readonly<{
  policy: ExecutionGovernancePolicyDescriptor;
  rules: ExecutionGovernanceRuleSet;
  structuredOutputSchema: StructuredOutputSchema;
  metadata: ModelExecutionMetadataEnvelope;
}>;

export type ExecutionGovernancePredecessorProof = Readonly<{
  request: ModelRequest;
  response: ModelResponse;
  capabilities: ModelCapabilityDescriptor;
  structuredOutput: StructuredOutputValidationResult;
}>;

export function normalizeExecutionGovernanceComposition(value: unknown): ExecutionGovernanceComposition {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("execution governance composition must be an object");
  }
  const record = value as Record<string, unknown>;
  const expected = ["policy", "rules", "structuredOutputSchema", "metadata"] as const;
  for (const key of Object.keys(record)) {
    if (!expected.includes(key as (typeof expected)[number])) {
      throw new Error(`execution governance composition has unexpected field ${key}`);
    }
  }
  for (const key of expected) {
    if (!(key in record)) throw new Error(`execution governance composition is missing field ${key}`);
  }

  const policy = normalizeExecutionGovernancePolicyDescriptor(record.policy);
  const rules = normalizeExecutionGovernanceRuleSet(record.rules);
  if (policy.policyId !== rules.policyId) {
    throw new Error("execution governance policyId must match rule-set policyId");
  }

  return {
    policy,
    rules,
    structuredOutputSchema: normalizeStructuredOutputSchema(record.structuredOutputSchema),
    metadata: normalizeModelExecutionMetadataEnvelope(record.metadata),
  };
}

export function proveExecutionGovernancePredecessorCompatibility(input: Readonly<{
  request: unknown;
  response: unknown;
  capabilities: unknown;
  governance: unknown;
}>): ExecutionGovernancePredecessorProof {
  const request = normalizeModelRequest(input.request);
  const response = normalizeModelResponse(input.response);
  if (request.requestId !== response.requestId) {
    throw new Error("model response requestId must match predecessor requestId");
  }
  const capabilities = normalizeModelCapabilityDescriptor(input.capabilities);
  const governance = normalizeExecutionGovernanceComposition(input.governance);
  return {
    request,
    response,
    capabilities,
    structuredOutput: validateStructuredOutput(governance.structuredOutputSchema, response.output),
  };
}

import {
  invokeModelProvider,
  validateStructuredOutput,
  type ModelProviderAdapter,
  type ModelResponse,
  type StructuredOutputValidationResult,
} from "./index.js";
import {
  normalizeModelExecutionMetadataEnvelope,
  type ModelExecutionMetadataEnvelope,
} from "./execution-metadata.js";
import {
  evaluateExecutionGovernance,
  type ExecutionGovernanceEvaluation,
} from "./governance-evaluation.js";

export type GovernedModelInvocationInput = Readonly<{
  request: unknown;
  rules: unknown;
  capabilities: unknown;
  usage: unknown;
  structuredOutputSchema: unknown;
  executionMetadata?: unknown;
}>;

export type GovernedModelInvocationResult = Readonly<{
  response: ModelResponse;
  governance: ExecutionGovernanceEvaluation;
  structuredOutput: StructuredOutputValidationResult;
  executionMetadata: ModelExecutionMetadataEnvelope | null;
}>;

function describeIneligibleEvaluation(evaluation: ExecutionGovernanceEvaluation): string {
  return evaluation.reasons
    .map((reason) => `${reason.ruleId}:${reason.code}:${reason.subject}`)
    .join(",");
}

export async function invokeGovernedModelProvider(
  adapter: ModelProviderAdapter,
  input: GovernedModelInvocationInput,
): Promise<GovernedModelInvocationResult> {
  const governance = evaluateExecutionGovernance({
    rules: input.rules,
    capabilities: input.capabilities,
    usage: input.usage,
  });

  if (governance.status !== "eligible") {
    throw new Error(`execution governance is ineligible: ${describeIneligibleEvaluation(governance)}`);
  }

  const executionMetadata = input.executionMetadata === undefined
    ? null
    : normalizeModelExecutionMetadataEnvelope(input.executionMetadata);
  if (executionMetadata !== null && executionMetadata.permissionPolicyId !== governance.policyId) {
    throw new Error("execution metadata permissionPolicyId must match evaluated governance policyId");
  }

  const response = await invokeModelProvider(adapter, input.request);
  const structuredOutput = validateStructuredOutput(input.structuredOutputSchema, response.output);

  return {
    response,
    governance,
    structuredOutput,
    executionMetadata,
  };
}

import {
  normalizeModelRequest,
  normalizeModelResponse,
  validateStructuredOutput,
  type ModelProviderAdapter,
  type ModelRequest,
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
import {
  evaluatePreSendBoundary,
  type PreSendBoundaryEvaluation,
} from "./pre-send-boundary-evaluation.js";
import {
  normalizeProviderSecretReferenceDescriptor,
  type ProviderSecretReferenceDescriptor,
} from "./provider-secret-reference.js";
import {
  AI_GATEWAY_USAGE_OBSERVATION_VERSION,
  normalizeModelUsageObservationEnvelope,
  type ModelUsageObservationEnvelope,
} from "./usage-observation.js";

export type GovernedModelProviderInvocationContext = Readonly<{
  providerSecretReference?: ProviderSecretReferenceDescriptor;
}>;

export type GovernedModelProviderAdapter = ModelProviderAdapter & Readonly<{
  invoke(
    request: ModelRequest,
    context?: GovernedModelProviderInvocationContext,
  ): Promise<ModelResponse>;
}>;

export type GovernedModelInvocationInput = Readonly<{
  request: unknown;
  rules: unknown;
  capabilities: unknown;
  usage: unknown;
  structuredOutputSchema: unknown;
  executionMetadata?: unknown;
  preSendBoundary?: Readonly<{
    boundary: unknown;
    evidence: unknown;
  }>;
  providerSecretReference?: unknown;
}>;

export type GovernedModelInvocationResult = Readonly<{
  response: ModelResponse;
  governance: ExecutionGovernanceEvaluation;
  structuredOutput: StructuredOutputValidationResult;
  executionMetadata: ModelExecutionMetadataEnvelope | null;
  preSendBoundary: PreSendBoundaryEvaluation | null;
  providerSecretReference: ProviderSecretReferenceDescriptor | null;
  usageObservation: ModelUsageObservationEnvelope;
}>;

function describeIneligibleEvaluation(evaluation: ExecutionGovernanceEvaluation): string {
  return evaluation.reasons
    .map((reason) => `${reason.ruleId}:${reason.code}:${reason.subject}`)
    .join(",");
}

function describeBoundaryEvaluation(evaluation: PreSendBoundaryEvaluation): string {
  return evaluation.reasons
    .map((reason) => `${reason.code}:${reason.subject}`)
    .join(",");
}

async function invokeGovernedAdapter(
  adapter: GovernedModelProviderAdapter,
  requestValue: unknown,
  providerSecretReference: ProviderSecretReferenceDescriptor | null,
): Promise<ModelResponse> {
  const request = normalizeModelRequest(requestValue);
  const response = normalizeModelResponse(await adapter.invoke(
    request,
    providerSecretReference === null ? undefined : { providerSecretReference },
  ));
  if (response.requestId !== request.requestId) {
    throw new Error("model response requestId must match invoked requestId");
  }
  return response;
}

function deriveUsageObservation(
  governance: ExecutionGovernanceEvaluation,
  response: ModelResponse,
  structuredOutput: StructuredOutputValidationResult,
): ModelUsageObservationEnvelope {
  const permittedMeasurements = governance.permittedObservationMeasurements;
  const failure = permittedMeasurements.includes("failure") && structuredOutput.status !== "valid"
    ? { code: `structured-output:${structuredOutput.status}`, category: "structured-output" }
    : null;

  return normalizeModelUsageObservationEnvelope({
    permissionPolicy: {
      policyId: governance.policyId,
      permittedMeasurements,
    },
    observation: {
      contractVersion: AI_GATEWAY_USAGE_OBSERVATION_VERSION,
      observationId: `usage-observation:${response.requestId}`,
      requestId: response.requestId,
      responseId: response.responseId,
      quality: null,
      failure,
      cost: null,
      evidenceRefs: [],
    },
  });
}

export async function invokeGovernedModelProvider(
  adapter: GovernedModelProviderAdapter,
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

  const preSendBoundary = input.preSendBoundary === undefined
    ? null
    : evaluatePreSendBoundary(input.preSendBoundary);
  if (preSendBoundary !== null && preSendBoundary.status !== "allowed") {
    throw new Error(`pre-send boundary is ${preSendBoundary.status}: ${describeBoundaryEvaluation(preSendBoundary)}`);
  }

  const providerSecretReference = input.providerSecretReference === undefined
    ? null
    : normalizeProviderSecretReferenceDescriptor(input.providerSecretReference);

  const executionMetadata = input.executionMetadata === undefined
    ? null
    : normalizeModelExecutionMetadataEnvelope(input.executionMetadata);
  if (executionMetadata !== null && executionMetadata.permissionPolicyId !== governance.policyId) {
    throw new Error("execution metadata permissionPolicyId must match evaluated governance policyId");
  }

  const response = await invokeGovernedAdapter(adapter, input.request, providerSecretReference);
  const structuredOutput = validateStructuredOutput(input.structuredOutputSchema, response.output);
  const usageObservation = deriveUsageObservation(governance, response, structuredOutput);

  return {
    response,
    governance,
    structuredOutput,
    executionMetadata,
    preSendBoundary,
    providerSecretReference,
    usageObservation,
  };
}

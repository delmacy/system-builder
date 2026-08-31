import {
  normalizeFactoryJourneyInputBinding,
  normalizeFactoryJourneyOutputBinding,
  type FactoryJourneyOutputBinding,
} from "./journey.js";

type UnknownRecord = Readonly<Record<string, unknown>>;

export type FactoryE2EInvocationInput = Readonly<{
  journeyBinding: unknown;
  definition: unknown;
  catalog: unknown;
  recipeTraceability: unknown;
  analysisTraceability: unknown;
  definitionTraceability: unknown;
  compilerVersion: string;
  runtimeVersion: string;
  releaseId: string;
  releaseVersion: string;
  publishedAt: string;
  environment: unknown;
  acceptanceChecks: unknown;
  startedAt: string;
  completedAt: string;
}>;

export type FactoryE2EOperations = Readonly<{
  assemble(request: UnknownRecord): unknown;
  validate(request: UnknownRecord): unknown;
  compile(request: UnknownRecord): unknown;
  previewRelease(request: UnknownRecord): unknown;
  dryRunDeployment(request: UnknownRecord): unknown;
}>;

export type FactoryE2EInvocationResult = Readonly<{
  binding: FactoryJourneyOutputBinding;
  assemblyPlan: unknown;
  validationEvidence: unknown;
  releaseArtifact: unknown;
  publishedRelease: unknown;
  deploymentRecord: unknown;
}>;

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as Record<string, unknown>;
}

function required(record: Record<string, unknown>, field: string, label: string): unknown {
  if (!(field in record)) throw new Error(`${label} is missing field ${field}`);
  return record[field];
}

function requiredString(record: Record<string, unknown>, field: string, label: string): string {
  const value = required(record, field, label);
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label}.${field} must be a non-empty string`);
  }
  return value;
}

/**
 * Deterministic orchestration primitive for the already-owned factory stages.
 * Stage behavior remains injected from public package APIs, keeping this
 * boundary free of implementation-package dependencies and side effects.
 */
export function invokeFactoryE2E(
  input: FactoryE2EInvocationInput,
  operations: FactoryE2EOperations,
): FactoryE2EInvocationResult {
  const initialBinding = normalizeFactoryJourneyInputBinding(input.journeyBinding);

  const assembled = asRecord(operations.assemble({
    journeyBinding: initialBinding,
    definition: input.definition,
    catalog: input.catalog,
  }), "factory assembly result");
  const assembly = asRecord(required(assembled, "assembly", "factory assembly result"), "factory assembly");
  if (assembly.ok !== true) throw new Error("FACTORY_E2E_ASSEMBLY_FAILED", { cause: assembly });
  const assemblyPlan = required(assembly, "plan", "factory assembly");

  const validated = asRecord(operations.validate({
    journeyBinding: initialBinding,
    recipe: input.recipeTraceability,
    analysis: input.analysisTraceability,
    definition: input.definitionTraceability,
    assemblyPlan,
  }), "factory validation result");
  const validationEvidence = required(validated, "validationEvidence", "factory validation result");

  const compiled = asRecord(operations.compile({
    journeyBinding: initialBinding,
    assemblyPlan,
    validationEvidence,
    compilerVersion: input.compilerVersion,
    runtimeVersion: input.runtimeVersion,
  }), "factory compiler result");
  const compilation = asRecord(required(compiled, "compilation", "factory compiler result"), "factory compilation");
  const releaseArtifact = required(compilation, "artifact", "factory compilation");

  const publishedRelease = operations.previewRelease({
    releaseId: input.releaseId,
    version: input.releaseVersion,
    artifact: releaseArtifact,
    publishedAt: input.publishedAt,
  });

  const deployment = asRecord(operations.dryRunDeployment({
    publishedRelease,
    releaseArtifact,
    environment: input.environment,
    acceptanceChecks: input.acceptanceChecks,
    startedAt: input.startedAt,
    completedAt: input.completedAt,
  }), "factory deployment result");
  if (deployment.ok !== true) throw new Error("FACTORY_E2E_DEPLOYMENT_DRY_RUN_FAILED");
  const deploymentRecord = required(deployment, "record", "factory deployment result");

  const assemblyRecord = asRecord(assemblyPlan, "AssemblyPlan");
  const validationRecord = asRecord(validationEvidence, "ValidationEvidence");
  const publishedRecord = asRecord(publishedRelease, "PublishedRelease");
  const deploymentRecordValue = asRecord(deploymentRecord, "DeploymentRecord");
  const assemblyRef = requiredString(assemblyRecord, "contentHash", "AssemblyPlan");
  const validationRef = requiredString(validationRecord, "evidenceHash", "ValidationEvidence");
  const releaseRef = requiredString(publishedRecord, "releaseId", "PublishedRelease");
  const releaseVersion = requiredString(publishedRecord, "version", "PublishedRelease");
  const deploymentRef = requiredString(deploymentRecordValue, "deploymentId", "DeploymentRecord");
  const stages = initialBinding.journey.stages;

  const finalizedInput = normalizeFactoryJourneyInputBinding({
    contractVersion: initialBinding.contractVersion,
    lineage: initialBinding.lineage,
    journey: {
      contractVersion: initialBinding.contractVersion,
      stages: [
        stages[0],
        stages[1],
        { kind: "capability-assembly", identityRef: assemblyRef, provenanceRef: initialBinding.lineage.systemDefinition.identityRef },
        { kind: "validation", identityRef: validationRef, provenanceRef: assemblyRef },
        { kind: "compiler-release", identityRef: releaseRef, provenanceRef: validationRef },
        { kind: "deployment", identityRef: deploymentRef, provenanceRef: `${releaseRef}@${releaseVersion}` },
      ],
    },
  });

  const binding = normalizeFactoryJourneyOutputBinding({
    contractVersion: finalizedInput.contractVersion,
    input: finalizedInput,
    assemblyPlan,
    validationEvidence,
    releaseArtifact,
    publishedRelease,
    deploymentRecord,
  });

  return Object.freeze({ binding, assemblyPlan, validationEvidence, releaseArtifact, publishedRelease, deploymentRecord });
}

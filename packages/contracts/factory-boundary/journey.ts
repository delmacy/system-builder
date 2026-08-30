import {
  normalizeProcessAnalysisDefinitionLineage,
  type ProcessAnalysisDefinitionLineage,
} from "../process-versioning/lineage.js";

export const FACTORY_JOURNEY_CONTRACT_VERSION = "1.0.0" as const;

export const FACTORY_JOURNEY_STAGE_KINDS = [
  "approved-process",
  "analysis-definition",
  "capability-assembly",
  "validation",
  "compiler-release",
  "deployment",
] as const;

export type FactoryJourneyStageKind = (typeof FACTORY_JOURNEY_STAGE_KINDS)[number];

export type FactoryJourneyStageDescriptor = Readonly<{
  kind: FactoryJourneyStageKind;
  identityRef: string;
  provenanceRef: string;
}>;

export type FactoryJourneyEnvelope = Readonly<{
  contractVersion: typeof FACTORY_JOURNEY_CONTRACT_VERSION;
  stages: readonly FactoryJourneyStageDescriptor[];
}>;

export type FactoryJourneyInputBinding = Readonly<{
  contractVersion: typeof FACTORY_JOURNEY_CONTRACT_VERSION;
  journey: FactoryJourneyEnvelope;
  lineage: ProcessAnalysisDefinitionLineage;
}>;

export type FactoryJourneyOutputReferences = Readonly<{
  systemDefinitionRef: string;
  assemblyPlanRef: string;
  validationEvidenceRef: string;
  releaseArtifactRef: string;
  publishedReleaseRef: string;
  deploymentRef: string;
}>;

export type FactoryJourneyOutputBinding = Readonly<{
  contractVersion: typeof FACTORY_JOURNEY_CONTRACT_VERSION;
  input: FactoryJourneyInputBinding;
  references: FactoryJourneyOutputReferences;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord, fields: readonly string[], label: string): void {
  for (const key of Object.keys(record)) {
    if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  }
  for (const key of fields) {
    if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
  }
}

function nonEmpty(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function requiredRef(record: UnknownRecord, field: string, label: string): string {
  if (!(field in record)) throw new Error(`${label} is missing field ${field}`);
  return nonEmpty(record[field], `${label}.${field}`);
}

function normalizeStage(value: unknown, index: number): FactoryJourneyStageDescriptor {
  const record = asRecord(value, `factory journey stage ${index + 1}`);
  assertExactFields(record, ["kind", "identityRef", "provenanceRef"], `factory journey stage ${index + 1}`);
  const expectedKind = FACTORY_JOURNEY_STAGE_KINDS[index];
  if (record.kind !== expectedKind) {
    throw new Error(`factory journey stage ${index + 1} must be ${expectedKind}`);
  }
  return Object.freeze({
    kind: expectedKind,
    identityRef: nonEmpty(record.identityRef, `stages[${index}].identityRef`),
    provenanceRef: nonEmpty(record.provenanceRef, `stages[${index}].provenanceRef`),
  });
}

export function normalizeFactoryJourneyEnvelope(input: unknown): FactoryJourneyEnvelope {
  const record = asRecord(input, "factory journey envelope");
  assertExactFields(record, ["contractVersion", "stages"], "factory journey envelope");
  if (record.contractVersion !== FACTORY_JOURNEY_CONTRACT_VERSION) {
    throw new Error(`unsupported factory journey contract version: ${String(record.contractVersion)}`);
  }
  if (!Array.isArray(record.stages) || record.stages.length !== FACTORY_JOURNEY_STAGE_KINDS.length) {
    throw new Error(`factory journey must contain exactly ${FACTORY_JOURNEY_STAGE_KINDS.length} ordered stages`);
  }
  const stages = record.stages.map((stage, index) => normalizeStage(stage, index));
  return Object.freeze({
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    stages: Object.freeze(stages),
  });
}

export function normalizeFactoryJourneyInputBinding(input: unknown): FactoryJourneyInputBinding {
  const record = asRecord(input, "factory journey input binding");
  assertExactFields(record, ["contractVersion", "journey", "lineage"], "factory journey input binding");
  if (record.contractVersion !== FACTORY_JOURNEY_CONTRACT_VERSION) {
    throw new Error(`unsupported factory journey contract version: ${String(record.contractVersion)}`);
  }

  const journey = normalizeFactoryJourneyEnvelope(record.journey);
  const lineage = normalizeProcessAnalysisDefinitionLineage(record.lineage);
  const processRevision = lineage.processRevision.processRevision;
  const approvedProcess = journey.stages[0]!;
  const analysisDefinition = journey.stages[1]!;

  if (approvedProcess.identityRef !== processRevision.revisionRef || approvedProcess.provenanceRef !== processRevision.artifactRef) {
    throw new Error("approved-process stage does not match canonical process artifact/revision identity");
  }
  if (analysisDefinition.identityRef !== lineage.analysis.identityRef) {
    throw new Error("analysis-definition stage does not match canonical analysis identity");
  }
  if (analysisDefinition.provenanceRef !== processRevision.revisionRef) {
    throw new Error("analysis-definition stage predecessor does not match approved process revision");
  }
  const capabilityAssembly = journey.stages[2]!;
  if (capabilityAssembly.provenanceRef !== lineage.systemDefinition.identityRef) {
    throw new Error("capability-assembly predecessor does not match canonical system-definition identity");
  }

  return Object.freeze({
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    journey,
    lineage,
  });
}

export function normalizeFactoryJourneyOutputBinding(input: unknown): FactoryJourneyOutputBinding {
  const record = asRecord(input, "factory journey output binding");
  assertExactFields(
    record,
    ["contractVersion", "input", "assemblyPlan", "validationEvidence", "releaseArtifact", "publishedRelease", "deploymentRecord"],
    "factory journey output binding",
  );
  if (record.contractVersion !== FACTORY_JOURNEY_CONTRACT_VERSION) {
    throw new Error(`unsupported factory journey contract version: ${String(record.contractVersion)}`);
  }

  const inputBinding = normalizeFactoryJourneyInputBinding(record.input);
  const assemblyPlan = asRecord(record.assemblyPlan, "AssemblyPlan");
  const validationEvidence = asRecord(record.validationEvidence, "ValidationEvidence");
  const releaseArtifact = asRecord(record.releaseArtifact, "ReleaseArtifact");
  const publishedRelease = asRecord(record.publishedRelease, "PublishedRelease");
  const deploymentRecord = asRecord(record.deploymentRecord, "DeploymentRecord");

  if (assemblyPlan.kind !== "AssemblyPlan") throw new Error("assemblyPlan must reuse the AssemblyPlan contract");
  if (validationEvidence.kind !== "ValidationEvidence") throw new Error("validationEvidence must reuse the ValidationEvidence contract");
  if (releaseArtifact.kind !== "ReleaseArtifact") throw new Error("releaseArtifact must reuse the ReleaseArtifact contract");
  if (publishedRelease.kind !== "PublishedRelease") throw new Error("publishedRelease must reuse the PublishedRelease contract");
  if (deploymentRecord.kind !== "DeploymentRecord") throw new Error("deploymentRecord must reuse the DeploymentRecord contract");

  const systemDefinitionRef = requiredRef(assemblyPlan, "systemDefinitionRef", "AssemblyPlan");
  const assemblyPlanRef = requiredRef(assemblyPlan, "contentHash", "AssemblyPlan");
  const validationAssemblyRef = requiredRef(validationEvidence, "assemblyPlanRef", "ValidationEvidence");
  const validationEvidenceRef = requiredRef(validationEvidence, "evidenceHash", "ValidationEvidence");
  const releaseAssemblyRef = requiredRef(releaseArtifact, "assemblyPlanRef", "ReleaseArtifact");
  const releaseValidationRef = requiredRef(releaseArtifact, "validationEvidenceRef", "ReleaseArtifact");
  const releaseArtifactRef = requiredRef(releaseArtifact, "artifactHash", "ReleaseArtifact");
  const publishedReleaseRef = requiredRef(publishedRelease, "releaseId", "PublishedRelease");
  const publishedArtifactRef = requiredRef(publishedRelease, "artifactRef", "PublishedRelease");
  const publishedArtifactHash = requiredRef(publishedRelease, "artifactHash", "PublishedRelease");
  const publishedValidationRef = requiredRef(publishedRelease, "validationEvidenceRef", "PublishedRelease");
  const deploymentRef = requiredRef(deploymentRecord, "deploymentId", "DeploymentRecord");
  const deploymentReleaseRef = requiredRef(deploymentRecord, "publishedReleaseRef", "DeploymentRecord");
  const deploymentReleaseHash = requiredRef(deploymentRecord, "releaseHash", "DeploymentRecord");

  const capabilityAssembly = inputBinding.journey.stages[2]!;
  const validation = inputBinding.journey.stages[3]!;
  const compilerRelease = inputBinding.journey.stages[4]!;
  const deployment = inputBinding.journey.stages[5]!;

  if (systemDefinitionRef !== inputBinding.lineage.systemDefinition.identityRef) {
    throw new Error("AssemblyPlan does not reference the canonical system-definition identity");
  }
  if (capabilityAssembly.identityRef !== assemblyPlanRef) {
    throw new Error("capability-assembly stage does not match the exact AssemblyPlan identity");
  }
  if (validationAssemblyRef !== assemblyPlanRef || releaseAssemblyRef !== assemblyPlanRef) {
    throw new Error("downstream artifact does not reference the exact AssemblyPlan identity");
  }
  if (validation.identityRef !== validationEvidenceRef || validation.provenanceRef !== assemblyPlanRef) {
    throw new Error("validation stage does not match exact ValidationEvidence predecessor chain");
  }
  if (releaseValidationRef !== validationEvidenceRef || publishedValidationRef !== validationEvidenceRef) {
    throw new Error("release chain does not reference the exact ValidationEvidence identity");
  }
  if (publishedArtifactRef !== releaseArtifactRef || publishedArtifactHash !== releaseArtifactRef) {
    throw new Error("PublishedRelease does not reference the exact ReleaseArtifact identity");
  }
  if (compilerRelease.identityRef !== publishedReleaseRef || compilerRelease.provenanceRef !== validationEvidenceRef) {
    throw new Error("compiler-release stage does not match the exact published release chain");
  }
  if (deploymentReleaseRef !== publishedReleaseRef || deploymentReleaseHash !== publishedArtifactHash) {
    throw new Error("DeploymentRecord does not reference the exact PublishedRelease identity");
  }
  if (deployment.identityRef !== deploymentRef || deployment.provenanceRef !== publishedReleaseRef) {
    throw new Error("deployment stage does not match the exact DeploymentRecord predecessor chain");
  }

  return Object.freeze({
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    input: inputBinding,
    references: Object.freeze({
      systemDefinitionRef,
      assemblyPlanRef,
      validationEvidenceRef,
      releaseArtifactRef,
      publishedReleaseRef,
      deploymentRef,
    }),
  });
}

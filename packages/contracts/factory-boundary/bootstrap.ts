import type { FactoryE2EInvocationInput, FactoryE2EInvocationResult } from "./e2e.js";
import {
  FACTORY_JOURNEY_STAGE_KINDS,
  normalizeFactoryJourneyInputBinding,
  type FactoryJourneyOutputReferences,
  type FactoryJourneyStageKind,
} from "./journey.js";

export const FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION = "1.0.0" as const;

export type FactoryOperatorBootstrapPrerequisites = Readonly<{
  nodeVersion: string;
  npmVersion: string;
  factoryE2EAvailable: true;
}>;

export type FactoryOperatorBootstrapConfig = Readonly<{
  inputPath: string;
}>;

export type FactoryOperatorBootstrapInput = Readonly<{
  contractVersion: typeof FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION;
  prerequisites: FactoryOperatorBootstrapPrerequisites;
  config: FactoryOperatorBootstrapConfig;
  factoryInput: FactoryE2EInvocationInput;
}>;

export type FactoryOperatorBootstrapValidationResult = Readonly<{
  contractVersion: typeof FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION;
  ok: true;
  prerequisites: FactoryOperatorBootstrapPrerequisites;
  config: FactoryOperatorBootstrapConfig;
  references: Readonly<{
    processRevisionRef: string;
    analysisRef: string;
    systemDefinitionRef: string;
  }>;
}>;

export type FactoryOperatorBootstrapProgressEntry = Readonly<{
  ordinal: number;
  kind: FactoryJourneyStageKind;
  status: "completed";
  identityRef: string;
  provenanceRef: string;
}>;

export type FactoryOperatorBootstrapProgressResult = Readonly<{
  contractVersion: typeof FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION;
  status: "succeeded";
  stages: readonly FactoryOperatorBootstrapProgressEntry[];
  references: FactoryJourneyOutputReferences;
}>;

type UnknownRecord = Record<string, unknown>;

const FACTORY_INPUT_FIELDS = [
  "journeyBinding",
  "definition",
  "catalog",
  "recipeTraceability",
  "analysisTraceability",
  "definitionTraceability",
  "compilerVersion",
  "runtimeVersion",
  "releaseId",
  "releaseVersion",
  "publishedAt",
  "environment",
  "acceptanceChecks",
  "startedAt",
  "completedAt",
] as const;

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

function nonEmptyString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value.trim();
}

function majorVersion(value: unknown, label: string): number {
  const version = nonEmptyString(value, label);
  const match = /^v?(\d+)(?:\.|$)/.exec(version);
  if (!match) throw new Error(`${label} must be a semantic version`);
  return Number(match[1]);
}

/**
 * Fail-closed contract validation for the maintainer/operator bootstrap surface.
 * This boundary validates declared repository prerequisites and canonical input
 * identity only. It never invokes the factory journey, reads the environment,
 * persists state, or returns the canonical input/configuration payload.
 */
export function validateFactoryOperatorBootstrap(input: unknown): FactoryOperatorBootstrapValidationResult {
  const record = asRecord(input, "factory operator bootstrap input");
  assertExactFields(record, ["contractVersion", "prerequisites", "config", "factoryInput"], "factory operator bootstrap input");
  if (record.contractVersion !== FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION) {
    throw new Error(`unsupported factory operator bootstrap contract version: ${String(record.contractVersion)}`);
  }

  const prerequisitesRecord = asRecord(record.prerequisites, "factory operator bootstrap prerequisites");
  assertExactFields(prerequisitesRecord, ["nodeVersion", "npmVersion", "factoryE2EAvailable"], "factory operator bootstrap prerequisites");
  const nodeVersion = nonEmptyString(prerequisitesRecord.nodeVersion, "prerequisites.nodeVersion");
  const npmVersion = nonEmptyString(prerequisitesRecord.npmVersion, "prerequisites.npmVersion");
  if (majorVersion(nodeVersion, "prerequisites.nodeVersion") !== 24) {
    throw new Error("prerequisites.nodeVersion must satisfy repository Node.js major 24");
  }
  if (majorVersion(npmVersion, "prerequisites.npmVersion") < 11) {
    throw new Error("prerequisites.npmVersion must satisfy repository npm major >= 11");
  }
  if (prerequisitesRecord.factoryE2EAvailable !== true) {
    throw new Error("prerequisites.factoryE2EAvailable must be true");
  }

  const configRecord = asRecord(record.config, "factory operator bootstrap config");
  assertExactFields(configRecord, ["inputPath"], "factory operator bootstrap config");
  const inputPath = nonEmptyString(configRecord.inputPath, "config.inputPath");

  const factoryInputRecord = asRecord(record.factoryInput, "factory operator bootstrap factoryInput");
  assertExactFields(factoryInputRecord, FACTORY_INPUT_FIELDS, "factory operator bootstrap factoryInput");
  const canonical = normalizeFactoryJourneyInputBinding(factoryInputRecord.journeyBinding);

  for (const field of ["compilerVersion", "runtimeVersion", "releaseId", "releaseVersion", "publishedAt", "startedAt", "completedAt"] as const) {
    nonEmptyString(factoryInputRecord[field], `factoryInput.${field}`);
  }

  return Object.freeze({
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    ok: true,
    prerequisites: Object.freeze({ nodeVersion, npmVersion, factoryE2EAvailable: true }),
    config: Object.freeze({ inputPath }),
    references: Object.freeze({
      processRevisionRef: canonical.lineage.processRevision.processRevision.revisionRef,
      analysisRef: canonical.lineage.analysis.identityRef,
      systemDefinitionRef: canonical.lineage.systemDefinition.identityRef,
    }),
  });
}

/**
 * Derives operator-visible completion evidence exclusively from the canonical
 * E2E output binding. No progress is synthesized before the canonical journey
 * returns, so rejected/partial journeys cannot claim downstream completion.
 */
export function buildFactoryOperatorBootstrapProgress(
  result: FactoryE2EInvocationResult,
): FactoryOperatorBootstrapProgressResult {
  const stages = result.binding.input.journey.stages.map((stage, index) => {
    const expectedKind = FACTORY_JOURNEY_STAGE_KINDS[index];
    if (stage.kind !== expectedKind) {
      throw new Error(`factory operator bootstrap progress stage ${index + 1} must be ${String(expectedKind)}`);
    }
    return Object.freeze({
      ordinal: index + 1,
      kind: stage.kind,
      status: "completed" as const,
      identityRef: stage.identityRef,
      provenanceRef: stage.provenanceRef,
    });
  });

  if (stages.length !== FACTORY_JOURNEY_STAGE_KINDS.length) {
    throw new Error(`factory operator bootstrap progress must contain exactly ${FACTORY_JOURNEY_STAGE_KINDS.length} completed stages`);
  }

  return Object.freeze({
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    status: "succeeded" as const,
    stages: Object.freeze(stages),
    references: result.binding.references,
  });
}

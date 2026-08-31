import { composeFactoryJourney } from "../packages/assembly/factory-composition.js";
import { SoftwareCatalogRegistry } from "../packages/catalog/index.js";
import {
  invokeFactoryE2E,
  type FactoryE2EInvocationInput,
  type FactoryE2EOperations,
} from "../packages/contracts/factory-boundary/index.js";
import { composeFactoryCompilerReleaseArtifact } from "../packages/compiler/factory-composition.js";
import { dryRunDeploy } from "../packages/deploy/index.js";
import { previewFactoryPublishedRelease } from "../packages/release/factory-preview.js";
import { composeFactoryAssemblyValidation } from "../packages/validation/factory-composition.js";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

/** Materializes the existing JSON transport shape into the canonical invocation input. */
export function materializeFactoryE2EInput(raw: unknown): FactoryE2EInvocationInput {
  const payload = asRecord(raw, "factory E2E input");
  const catalogEntries = payload.catalogEntries;
  if (!Array.isArray(catalogEntries)) throw new Error("factory E2E input.catalogEntries must be an array");

  const catalog = new SoftwareCatalogRegistry();
  for (const entry of catalogEntries) {
    catalog.register(entry as Parameters<SoftwareCatalogRegistry["register"]>[0]);
  }

  const input = { ...payload };
  delete input.catalogEntries;
  return { ...input, catalog } as unknown as FactoryE2EInvocationInput;
}

const operations: FactoryE2EOperations = {
  assemble: (request) => composeFactoryJourney(request as Parameters<typeof composeFactoryJourney>[0]),
  validate: (request) => composeFactoryAssemblyValidation(request as Parameters<typeof composeFactoryAssemblyValidation>[0]),
  compile: (request) => composeFactoryCompilerReleaseArtifact(request as Parameters<typeof composeFactoryCompilerReleaseArtifact>[0]),
  previewRelease: (request) => previewFactoryPublishedRelease(request as Parameters<typeof previewFactoryPublishedRelease>[0]),
  dryRunDeployment: (request) => dryRunDeploy(request as Parameters<typeof dryRunDeploy>[0]),
};

/** The single repository-supported executor for the already integrated factory E2E journey. */
export function executeCanonicalFactoryE2E(input: FactoryE2EInvocationInput) {
  return invokeFactoryE2E(input, operations);
}

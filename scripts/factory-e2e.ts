import { readFileSync } from "node:fs";
import process from "node:process";
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

function parseInputPath(argv: readonly string[]): string {
  const inputIndex = argv.indexOf("--input");
  const inputPath = inputIndex >= 0 ? argv[inputIndex + 1] : undefined;
  if (!inputPath) throw new Error("usage: npm run factory:e2e -- --input <deterministic-input.json>");
  return inputPath;
}

function buildInvocationInput(raw: unknown): FactoryE2EInvocationInput {
  const payload = asRecord(raw, "factory E2E input");
  const catalogEntries = payload.catalogEntries;
  if (!Array.isArray(catalogEntries)) throw new Error("factory E2E input.catalogEntries must be an array");

  const catalog = new SoftwareCatalogRegistry();
  for (const entry of catalogEntries) {
    catalog.register(entry as Parameters<SoftwareCatalogRegistry["register"]>[0]);
  }

  const { catalogEntries: _catalogEntries, ...input } = payload;
  return { ...input, catalog } as unknown as FactoryE2EInvocationInput;
}

const operations: FactoryE2EOperations = {
  assemble: (request) => composeFactoryJourney(request as Parameters<typeof composeFactoryJourney>[0]),
  validate: (request) => composeFactoryAssemblyValidation(request as Parameters<typeof composeFactoryAssemblyValidation>[0]),
  compile: (request) => composeFactoryCompilerReleaseArtifact(request as Parameters<typeof composeFactoryCompilerReleaseArtifact>[0]),
  previewRelease: (request) => previewFactoryPublishedRelease(request as Parameters<typeof previewFactoryPublishedRelease>[0]),
  dryRunDeployment: (request) => dryRunDeploy(request as Parameters<typeof dryRunDeploy>[0]),
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "unknown factory E2E command failure";
}

try {
  const inputPath = parseInputPath(process.argv.slice(2));
  const input = buildInvocationInput(JSON.parse(readFileSync(inputPath, "utf8")));
  const result = invokeFactoryE2E(input, operations);
  process.stdout.write(`${JSON.stringify({ ok: true, result })}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify({ ok: false, error: { code: "FACTORY_E2E_COMMAND_FAILED", message: errorMessage(error) } })}\n`);
  process.exitCode = 1;
}

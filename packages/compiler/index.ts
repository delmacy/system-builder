import { canonicalJson, sha256Canonical, sha256Text } from "@system-builder/deterministic";
import {
  normalizeRuntimeStateRequirement,
  renderPersistentAutonomousRuntimeEntrypoint,
  type RuntimeStateRequirement,
} from "@system-builder/runtime-core";
import { materializeAssemblyRuntimeCapabilities } from "./runtime-capabilities.js";

export type CompilerAssemblyPlan = Readonly<{
  kind: "AssemblyPlan";
  systemDefinitionRef: string;
  components: readonly Readonly<{
    capability: string;
    provider: string;
    version: string;
    dependencies?: readonly string[];
  }>[];
  sourceRefs: readonly string[];
  contentHash: string;
}>;

export type CompilerValidationEvidence = Readonly<{
  kind: "ValidationEvidence";
  assemblyPlanRef: string;
  decision: "PASS" | "FAIL";
  evidenceHash: string;
}>;

export type CompilerEnvironmentRequirement = Readonly<{
  name: string;
  kind: "config" | "secret-reference";
  required: boolean;
}>;

export type GeneratedFile = Readonly<{
  path: string;
  content: string;
  contentHash: string;
}>;

export type ReleaseArtifact = Readonly<{
  kind: "ReleaseArtifact";
  assemblyPlanRef: string;
  validationEvidenceRef: string;
  artifactHash: string;
  manifest: Readonly<{
    compilerVersion: string;
    runtimeVersion: string;
    files: readonly string[];
  }>;
  environmentSchema: readonly CompilerEnvironmentRequirement[];
}>;

export type CompileSyntheticInput = Readonly<{
  assemblyPlan: CompilerAssemblyPlan;
  validationEvidence: CompilerValidationEvidence;
  compilerVersion: string;
  runtimeVersion: string;
  environmentSchema?: readonly CompilerEnvironmentRequirement[];
  stateRequirements?: readonly RuntimeStateRequirement[];
}>;

export type SyntheticCompilation = Readonly<{
  files: readonly GeneratedFile[];
  artifact: ReleaseArtifact;
}>;

function requireToken(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`COMPILER_INVALID_${field.toUpperCase()}`);
  return normalized;
}

function normalizeEnvironment(
  requirements: readonly CompilerEnvironmentRequirement[] | undefined,
): readonly CompilerEnvironmentRequirement[] {
  const normalized = (requirements ?? []).map((requirement) => {
    if ("value" in (requirement as unknown as Record<string, unknown>)) {
      throw new Error(`COMPILER_SECRET_VALUE_NOT_ALLOWED:${requirement.name}`);
    }
    return Object.freeze({
      name: requireToken(requirement.name, "environment_name"),
      kind: requirement.kind,
      required: requirement.required,
    });
  });
  normalized.sort(
    (left, right) => left.name.localeCompare(right.name) || left.kind.localeCompare(right.kind),
  );
  return Object.freeze(normalized);
}

function normalizeStateRequirements(
  requirements: readonly RuntimeStateRequirement[] | undefined,
): readonly RuntimeStateRequirement[] {
  const normalized = (requirements ?? []).map((requirement) => normalizeRuntimeStateRequirement(requirement));
  normalized.sort(
    (left, right) =>
      left.capability.localeCompare(right.capability) ||
      left.connectionBinding.name.localeCompare(right.connectionBinding.name),
  );
  const capabilities = new Set<string>();
  for (const requirement of normalized) {
    if (capabilities.has(requirement.capability)) {
      throw new Error(`COMPILER_DUPLICATE_STATE_CAPABILITY:${requirement.capability}`);
    }
    capabilities.add(requirement.capability);
  }
  return Object.freeze(normalized);
}

function normalizeComponents(assemblyPlan: CompilerAssemblyPlan) {
  return assemblyPlan.components
    .map((component) => ({
      capability: component.capability,
      provider: component.provider,
      version: component.version,
      ...(component.dependencies === undefined
        ? {}
        : { dependencies: [...component.dependencies].sort((left, right) => left.localeCompare(right)) }),
    }))
    .sort(
      (left, right) =>
        left.capability.localeCompare(right.capability) ||
        left.provider.localeCompare(right.provider) ||
        left.version.localeCompare(right.version),
    );
}

function generatedJsonFile(path: string, value: unknown): GeneratedFile {
  const content = canonicalJson(value);
  return Object.freeze({ path, content, contentHash: sha256Text(content) });
}

function generatedTextFile(path: string, content: string): GeneratedFile {
  return Object.freeze({ path, content, contentHash: sha256Text(content) });
}

function assertUniqueGeneratedPaths(files: readonly GeneratedFile[]): void {
  const paths = new Set<string>();
  for (const file of files) {
    if (paths.has(file.path)) throw new Error(`COMPILER_DUPLICATE_GENERATED_PATH:${file.path}`);
    paths.add(file.path);
  }
}

function capabilityMaterializationPlan(
  assemblyPlan: CompilerAssemblyPlan,
  explicitStateRequirements: readonly RuntimeStateRequirement[],
): CompilerAssemblyPlan {
  const explicitCapabilities = new Set(explicitStateRequirements.map((requirement) => requirement.capability));
  if (!explicitCapabilities.has("state.counter")) return assemblyPlan;

  const components = assemblyPlan.components.filter((component) => {
    if (component.capability !== "state.counter") return true;
    return component.provider === "system-builder.postgres-counter" && component.version === "1.0.0";
  });
  if (components.length === assemblyPlan.components.length) return assemblyPlan;
  return Object.freeze({ ...assemblyPlan, components: Object.freeze(components) });
}

export function compileSyntheticRelease(input: CompileSyntheticInput): SyntheticCompilation {
  if (input.assemblyPlan.kind !== "AssemblyPlan") throw new Error("COMPILER_INVALID_ASSEMBLY_PLAN");
  if (!/^sha256:[a-f0-9]{64}$/.test(input.assemblyPlan.contentHash)) {
    throw new Error("COMPILER_INVALID_ASSEMBLY_PLAN_HASH");
  }
  if (input.validationEvidence.kind !== "ValidationEvidence") {
    throw new Error("COMPILER_INVALID_VALIDATION_EVIDENCE");
  }
  if (input.validationEvidence.decision !== "PASS") {
    throw new Error("COMPILER_VALIDATION_FAILED");
  }
  if (input.validationEvidence.assemblyPlanRef !== input.assemblyPlan.contentHash) {
    throw new Error("COMPILER_VALIDATION_ASSEMBLY_MISMATCH");
  }
  if (!/^sha256:[a-f0-9]{64}$/.test(input.validationEvidence.evidenceHash)) {
    throw new Error("COMPILER_INVALID_VALIDATION_HASH");
  }

  const compilerVersion = requireToken(input.compilerVersion, "compiler_version");
  const runtimeVersion = requireToken(input.runtimeVersion, "runtime_version");
  const environmentSchema = normalizeEnvironment(input.environmentSchema);
  const explicitStateRequirements = input.stateRequirements ?? [];
  const derivedStateRequirements = materializeAssemblyRuntimeCapabilities(
    capabilityMaterializationPlan(input.assemblyPlan, explicitStateRequirements),
  ).stateRequirements;
  const stateRequirements = normalizeStateRequirements([
    ...derivedStateRequirements,
    ...explicitStateRequirements,
  ]);
  for (const requirement of stateRequirements) {
    const environmentRequirement = environmentSchema.find(
      (candidate) =>
        candidate.name === requirement.connectionBinding.name &&
        candidate.kind === "secret-reference" &&
        candidate.required,
    );
    if (!environmentRequirement) {
      throw new Error(`COMPILER_STATE_BINDING_MISSING:${requirement.connectionBinding.name}`);
    }
  }

  const components = normalizeComponents(input.assemblyPlan);
  const runtimeEntrypoint = renderPersistentAutonomousRuntimeEntrypoint({
    runtimeVersion,
    requirements: environmentSchema,
    stateRequirements,
  });

  const baseFiles: GeneratedFile[] = [
    generatedJsonFile("assembly-plan.json", {
      kind: input.assemblyPlan.kind,
      systemDefinitionRef: input.assemblyPlan.systemDefinitionRef,
      components,
      sourceRefs: [...input.assemblyPlan.sourceRefs].sort((left, right) => left.localeCompare(right)),
      contentHash: input.assemblyPlan.contentHash,
    }),
    generatedJsonFile("environment-schema.json", environmentSchema),
    generatedTextFile("runtime-entry.mjs", runtimeEntrypoint),
    generatedJsonFile("runtime-manifest.json", {
      runtimeVersion,
      entrypoint: "runtime-entry.mjs",
      components: components.map(({ capability, provider, version }) => ({ capability, provider, version })),
    }),
  ];

  const migrationFiles = stateRequirements.flatMap((requirement) =>
    requirement.migrations.map((migration) => generatedTextFile(migration.path, migration.content)),
  );
  const migrationManifestFile = stateRequirements.length === 0
    ? []
    : [generatedJsonFile("migration-manifest.json", {
        kind: "RuntimeMigrationManifest",
        requirements: stateRequirements.map((requirement) => ({
          capability: requirement.capability,
          storeKind: requirement.storeKind,
          connectionBinding: requirement.connectionBinding,
          migrations: requirement.migrations.map((migration) => ({
            id: migration.id,
            order: migration.order,
            path: migration.path,
            contentHash: sha256Text(migration.content),
          })),
        })),
      })];

  const generatedFiles = [...baseFiles, ...migrationFiles, ...migrationManifestFile];
  assertUniqueGeneratedPaths(generatedFiles);
  const files = Object.freeze(generatedFiles.sort((left, right) => left.path.localeCompare(right.path)));

  const manifest = Object.freeze({
    compilerVersion,
    runtimeVersion,
    files: Object.freeze(files.map((file) => file.path)),
  });
  const artifactPayload = {
    kind: "ReleaseArtifact" as const,
    assemblyPlanRef: input.assemblyPlan.contentHash,
    validationEvidenceRef: input.validationEvidence.evidenceHash,
    manifest,
    environmentSchema,
    fileHashes: files.map((file) => ({ path: file.path, contentHash: file.contentHash })),
  };
  const artifact: ReleaseArtifact = Object.freeze({
    kind: "ReleaseArtifact",
    assemblyPlanRef: artifactPayload.assemblyPlanRef,
    validationEvidenceRef: artifactPayload.validationEvidenceRef,
    artifactHash: sha256Canonical(artifactPayload),
    manifest,
    environmentSchema,
  });

  return Object.freeze({ files, artifact });
}

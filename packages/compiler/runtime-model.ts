import { canonicalJson, sha256Canonical, sha256Text } from "@system-builder/deterministic";
import type { RuntimeStateRequirement } from "@system-builder/runtime-core";
import {
  compileSyntheticRelease,
  type CompileSyntheticInput,
  type GeneratedFile,
  type ReleaseArtifact,
  type SyntheticCompilation,
} from "./index.js";
import {
  normalizeSystemDefinitionRuntimeProjection,
  type CompilerSystemDefinitionRuntimeProjection,
} from "./runtime-projection.js";

export type RuntimeModel = Readonly<{
  kind: "RuntimeModel";
  systemDefinitionRef: string;
  entities: readonly Readonly<{
    id: string;
    table: string;
    fields: readonly Readonly<{
      name: string;
      type: string;
      required: boolean;
      referenceEntity?: string;
    }>[];
  }>[];
  actions: CompilerSystemDefinitionRuntimeProjection["actions"];
  processes: CompilerSystemDefinitionRuntimeProjection["processes"];
}>;

export type CompileRuntimeModelInput = CompileSyntheticInput & Readonly<{
  systemDefinitionRuntime: CompilerSystemDefinitionRuntimeProjection;
  entityConnectionBinding?: string;
}>;

function entityTable(id: string): string {
  return `sb_entity_${sha256Text(id).slice("sha256:".length, "sha256:".length + 16)}`;
}

export function materializeRuntimeModel(
  expectedSystemDefinitionRef: string,
  projection: CompilerSystemDefinitionRuntimeProjection,
): Readonly<{ model: RuntimeModel; stateRequirement?: RuntimeStateRequirement }> {
  const normalized = normalizeSystemDefinitionRuntimeProjection(expectedSystemDefinitionRef, projection);
  const entities = normalized.entities.map((entity) => Object.freeze({
    id: entity.id,
    table: entityTable(entity.id),
    fields: Object.freeze(entity.fields.map((field) => Object.freeze({
      name: field.name,
      type: field.type,
      required: field.required === true,
      ...(field.referenceEntity === undefined ? {} : { referenceEntity: field.referenceEntity }),
    }))),
  }));
  const model: RuntimeModel = Object.freeze({
    kind: "RuntimeModel",
    systemDefinitionRef: normalized.systemDefinitionRef,
    entities: Object.freeze(entities),
    actions: normalized.actions,
    processes: normalized.processes,
  });
  if (entities.length === 0) return Object.freeze({ model });

  const migrations = entities.map((entity, index) => {
    const token = sha256Text(entity.id).slice("sha256:".length, "sha256:".length + 12);
    return Object.freeze({
      id: `runtime-entity-${token}`,
      capability: "runtime.entities",
      order: index + 1,
      path: `migrations/runtime-entities/${String(index + 1).padStart(3, "0")}-${token}.sql`,
      content: `CREATE TABLE IF NOT EXISTS \"${entity.table}\" (\"id\" text PRIMARY KEY, \"data\" jsonb NOT NULL DEFAULT '{}'::jsonb, \"workflow_state\" jsonb NOT NULL DEFAULT '{}'::jsonb);\n`,
    });
  });
  return Object.freeze({
    model,
    stateRequirement: Object.freeze({
      kind: "RuntimeStateRequirement",
      capability: "runtime.entities",
      storeKind: "sql",
      connectionBinding: Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" }),
      migrations: Object.freeze(migrations),
    }),
  });
}

export function compileRuntimeModelRelease(input: CompileRuntimeModelInput): SyntheticCompilation {
  const materialized = materializeRuntimeModel(input.assemblyPlan.systemDefinitionRef, input.systemDefinitionRuntime);
  const stateRequirements = [
    ...(input.stateRequirements ?? []),
    ...(materialized.stateRequirement === undefined ? [] : [materialized.stateRequirement]),
  ];
  const base = compileSyntheticRelease({ ...input, stateRequirements });
  const content = canonicalJson(materialized.model);
  const runtimeModelFile: GeneratedFile = Object.freeze({
    path: "runtime-model.json",
    content,
    contentHash: sha256Text(content),
  });
  const files = Object.freeze([...base.files, runtimeModelFile].sort((left, right) => left.path.localeCompare(right.path)));
  const manifest = Object.freeze({
    ...base.artifact.manifest,
    files: Object.freeze(files.map((file) => file.path)),
  });
  const artifactPayload = {
    kind: "ReleaseArtifact" as const,
    assemblyPlanRef: base.artifact.assemblyPlanRef,
    validationEvidenceRef: base.artifact.validationEvidenceRef,
    manifest,
    environmentSchema: base.artifact.environmentSchema,
    fileHashes: files.map((file) => ({ path: file.path, contentHash: file.contentHash })),
  };
  const artifact: ReleaseArtifact = Object.freeze({
    kind: "ReleaseArtifact",
    assemblyPlanRef: artifactPayload.assemblyPlanRef,
    validationEvidenceRef: artifactPayload.validationEvidenceRef,
    artifactHash: sha256Canonical(artifactPayload),
    manifest,
    environmentSchema: base.artifact.environmentSchema,
  });
  return Object.freeze({ files, artifact });
}

import assert from "node:assert/strict";
import test from "node:test";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { validateTraceability } from "../../packages/validation/index.js";
import {
  factoryAnalysis,
  factoryCatalogRecords,
  factoryEnvironmentSchema,
  factoryRecipe,
  factorySystemDefinition,
} from "./fixtures/factory-e2e.js";

function buildCatalog() {
  const registry = new SoftwareCatalogRegistry();
  for (const record of factoryCatalogRecords) registry.register(record);
  return registry;
}

function executeFactory(definition = factorySystemDefinition, analysis = factoryAnalysis) {
  const registry = buildCatalog();
  const assembly = assembleSystemDefinition(
    definition,
    "system-definition:e2e:1",
    (request) => resolveCatalogCandidates(registry, request),
  );
  if (!assembly.ok) return { stage: "assembly" as const, assembly };

  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis,
    definition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: "factory-e2e", status: "PASS", evidenceRefs: ["test:factory-e2e"] }],
  });
  if (validation.decision !== "PASS") {
    return { stage: "validation" as const, assembly, validation };
  }

  const compilation = compileSyntheticRelease({
    assemblyPlan: assembly.plan,
    validationEvidence: validation,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: factoryEnvironmentSchema,
  });
  return { stage: "compiled" as const, assembly, validation, compilation };
}

const graphDefinition = {
  ...factorySystemDefinition,
  capabilities: [
    { id: "cap-auth-graph", capability: "auth.graph", requirementRefs: ["REQ-1"] },
    { id: "cap-workflow", capability: "workflow.engine", requirementRefs: ["REQ-2"] },
  ],
};

const graphCatalogRecords = [
  { capability: "workflow.engine", provider: "provider-workflow", version: "1.0.0" },
  {
    capability: "auth.graph",
    provider: "provider-auth-graph",
    version: "1.0.0",
    dependencyRequirements: [
      {
        capability: "storage.session",
        versionConstraint: { kind: "minimum" as const, version: "1.0.0" },
        compatibility: { runtime: "node24" },
      },
    ],
  },
  {
    capability: "storage.session",
    provider: "provider-session",
    version: "1.1.0",
    compatibility: { runtime: "node24" },
    dependencyRequirements: [
      { capability: "storage.codec", versionConstraint: { kind: "exact" as const, version: "2.0.0" } },
    ],
  },
  { capability: "storage.codec", provider: "provider-codec", version: "2.0.0" },
] as const;

function executeGraphFactory(reverse = false) {
  const registry = new SoftwareCatalogRegistry();
  const records = reverse ? [...graphCatalogRecords].reverse() : [...graphCatalogRecords];
  for (const record of records) registry.register(record);
  const definition = reverse
    ? { ...graphDefinition, capabilities: [...graphDefinition.capabilities].reverse() }
    : graphDefinition;
  const assembly = assembleSystemDefinition(
    definition,
    "system-definition:e2e:graph:1",
    (request) => resolveCatalogCandidates(registry, request),
  );
  if (!assembly.ok) return { stage: "assembly" as const, assembly };

  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis: factoryAnalysis,
    definition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: "factory-graph-e2e", status: "PASS", evidenceRefs: ["test:factory-graph-e2e"] }],
  });
  if (validation.decision !== "PASS") return { stage: "validation" as const, assembly, validation };

  const compilation = compileSyntheticRelease({
    assemblyPlan: assembly.plan,
    validationEvidence: validation,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: factoryEnvironmentSchema,
  });
  return { stage: "compiled" as const, assembly, validation, compilation };
}

const materializerDefinition = {
  ...factorySystemDefinition,
  capabilities: [
    { id: "cap-stateful-feature", capability: "stateful.feature", requirementRefs: ["REQ-1"] },
    { id: "cap-workflow", capability: "workflow.engine", requirementRefs: ["REQ-2"] },
  ],
};

function materializerCatalogRecords(provider = "system-builder.postgres-counter") {
  return [
    { capability: "workflow.engine", provider: "provider-workflow", version: "1.0.0" },
    {
      capability: "stateful.feature",
      provider: "provider-stateful-feature",
      version: "1.0.0",
      dependencyRequirements: [
        {
          capability: "state.counter",
          versionConstraint: { kind: "exact" as const, version: "1.0.0" },
        },
      ],
    },
    { capability: "state.counter", provider, version: "1.0.0" },
  ] as const;
}

function executeMaterializerFactory(reverse = false, stateProvider = "system-builder.postgres-counter") {
  const registry = new SoftwareCatalogRegistry();
  const baseRecords = materializerCatalogRecords(stateProvider);
  const records = reverse ? [...baseRecords].reverse() : [...baseRecords];
  for (const record of records) registry.register(record);
  const definition = reverse
    ? { ...materializerDefinition, capabilities: [...materializerDefinition.capabilities].reverse() }
    : materializerDefinition;
  const assembly = assembleSystemDefinition(
    definition,
    "system-definition:e2e:materializer:1",
    (request) => resolveCatalogCandidates(registry, request),
  );
  if (!assembly.ok) return { stage: "assembly" as const, assembly };

  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis: factoryAnalysis,
    definition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: "factory-materializer-e2e", status: "PASS", evidenceRefs: ["test:factory-materializer-e2e"] }],
  });
  if (validation.decision !== "PASS") return { stage: "validation" as const, assembly, validation };

  const compilation = compileSyntheticRelease({
    assemblyPlan: assembly.plan,
    validationEvidence: validation,
    compilerVersion: "0.2.0",
    runtimeVersion: "0.2.0",
    environmentSchema: [
      ...factoryEnvironmentSchema,
      { name: "DATABASE_URL", kind: "secret-reference" as const, required: true },
    ],
  });
  return { stage: "compiled" as const, assembly, validation, compilation };
}

test("factory E2E reaches reproducible ReleaseArtifact through actual module APIs", () => {
  const first = executeFactory();
  const second = executeFactory();

  assert.equal(first.stage, "compiled");
  assert.equal(second.stage, "compiled");
  if (first.stage !== "compiled" || second.stage !== "compiled") return;

  assert.equal(first.assembly.plan.contentHash, second.assembly.plan.contentHash);
  assert.equal(first.validation.evidenceHash, second.validation.evidenceHash);
  assert.equal(first.compilation.artifact.artifactHash, second.compilation.artifact.artifactHash);
  assert.deepEqual(first.compilation.artifact, second.compilation.artifact);
});

test("factory graph E2E compiles a ReleaseArtifact from the actual transitive Catalog-to-Assembly BOM", () => {
  const first = executeGraphFactory();
  const reversed = executeGraphFactory(true);

  assert.equal(first.stage, "compiled");
  assert.equal(reversed.stage, "compiled");
  if (first.stage !== "compiled" || reversed.stage !== "compiled") return;

  assert.deepEqual(first.assembly.plan, reversed.assembly.plan);
  assert.deepEqual(
    first.assembly.plan.components.map(({ capability, provider, version }) => ({ capability, provider, version })),
    [
      { capability: "auth.graph", provider: "provider-auth-graph", version: "1.0.0" },
      { capability: "storage.codec", provider: "provider-codec", version: "2.0.0" },
      { capability: "storage.session", provider: "provider-session", version: "1.1.0" },
      { capability: "workflow.engine", provider: "provider-workflow", version: "1.0.0" },
    ],
  );
  assert.equal(first.validation.decision, "PASS");
  assert.equal(first.assembly.plan.contentHash, reversed.assembly.plan.contentHash);
  assert.equal(first.validation.evidenceHash, reversed.validation.evidenceHash);
  assert.equal(first.compilation.artifact.artifactHash, reversed.compilation.artifact.artifactHash);
  assert.deepEqual(first.compilation.artifact, reversed.compilation.artifact);
});

test("factory transitive graph reaches exact Compiler materializer lookup deterministically", () => {
  const first = executeMaterializerFactory();
  const reversed = executeMaterializerFactory(true);

  assert.equal(first.stage, "compiled");
  assert.equal(reversed.stage, "compiled");
  if (first.stage !== "compiled" || reversed.stage !== "compiled") return;

  assert.deepEqual(first.assembly.plan, reversed.assembly.plan);
  assert.equal(first.validation.evidenceHash, reversed.validation.evidenceHash);
  assert.deepEqual(first.compilation.artifact, reversed.compilation.artifact);
  assert.equal(first.compilation.artifact.artifactHash, reversed.compilation.artifact.artifactHash);
  assert.deepEqual(
    first.assembly.plan.components.find((component) => component.capability === "state.counter"),
    { capability: "state.counter", provider: "system-builder.postgres-counter", version: "1.0.0" },
  );
  const migration = first.compilation.files.find((file) => file.path === "migrations/001-state-counter.sql");
  const migrationManifest = first.compilation.files.find((file) => file.path === "migration-manifest.json");
  assert.ok(migration);
  assert.ok(migrationManifest);
  assert.equal(migration.content, "CREATE TABLE runtime_counter (id INTEGER PRIMARY KEY, value INTEGER NOT NULL);");
  assert.equal(JSON.stringify(first.compilation).includes("postgres://"), false);
  assert.equal(JSON.stringify(first.compilation).includes("secret://"), false);
});

test("factory transitive graph fails explicitly when selected materializer identity is unsupported", () => {
  assert.throws(
    () => executeMaterializerFactory(false, "unsupported.counter"),
    /COMPILER_RUNTIME_CAPABILITY_UNSUPPORTED:state\.counter:unsupported\.counter:1\.0\.0/,
  );
});

test("factory E2E stops at Assembly when a required capability cannot resolve", () => {
  const brokenDefinition = {
    ...factorySystemDefinition,
    capabilities: [
      ...factorySystemDefinition.capabilities.slice(0, 1),
      { id: "cap-missing", capability: "storage.blob", requirementRefs: ["REQ-2"] },
    ],
  };
  const result = executeFactory(brokenDefinition);

  assert.equal(result.stage, "assembly");
  if (result.stage !== "assembly") return;
  assert.equal(result.assembly.ok, false);
});

test("factory E2E stops at Validation when requirement traceability is broken", () => {
  const brokenAnalysis = { findings: [{ recipeRequirementRefs: ["REQ-1"] }] };
  const result = executeFactory(factorySystemDefinition, brokenAnalysis);

  assert.equal(result.stage, "validation");
  if (result.stage !== "validation") return;
  assert.equal(result.validation.decision, "FAIL");
  assert.ok(
    result.validation.checks
      .find((check) => check.id === "traceability:REQ-2")
      ?.evidenceRefs?.includes("missing:analysis:REQ-2"),
  );
});

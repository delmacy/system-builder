import assert from "node:assert/strict";
import test from "node:test";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import type { RuntimeStateRequirement } from "../../packages/runtime-core/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:fixture:1",
  components: [
    { capability: "workflow.engine", provider: "provider-a", version: "1.0.0" },
    { capability: "auth.basic", provider: "provider-auth", version: "1.0.0", dependencies: ["storage.session"] },
  ],
  sourceRefs: ["system-definition:fixture:1", "catalog:workflow.engine:provider-a:1.0.0"],
  contentHash: `sha256:${"a".repeat(64)}`,
};

const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"b".repeat(64)}`,
};

function stateRequirement(content = "CREATE TABLE runtime_counter (id INTEGER PRIMARY KEY, value INTEGER NOT NULL);"): RuntimeStateRequirement {
  return {
    kind: "RuntimeStateRequirement",
    capability: "state.counter",
    storeKind: "sql",
    connectionBinding: { name: "DATABASE_URL", kind: "secret-reference" },
    migrations: [
      {
        id: "counter-v2",
        capability: "state.counter",
        order: 20,
        path: "migrations/002-counter-index.sql",
        content: "CREATE INDEX counter_value_idx ON runtime_counter (value);",
      },
      {
        id: "counter-v1",
        capability: "state.counter",
        order: 10,
        path: "migrations/001-counter.sql",
        content,
      },
    ],
  };
}

const stateEnvironmentSchema = [
  { name: "DATABASE_URL", kind: "secret-reference" as const, required: true },
  { name: "LOG_LEVEL", kind: "config" as const, required: false },
];

test("compiler emits reproducible ReleaseArtifact with persistent runtime entrypoint", () => {
  const input = {
    assemblyPlan,
    validationEvidence,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: stateEnvironmentSchema,
  };
  const first = compileSyntheticRelease(input);
  const second = compileSyntheticRelease({
    ...input,
    assemblyPlan: {
      ...assemblyPlan,
      components: [...assemblyPlan.components].reverse(),
      sourceRefs: [...assemblyPlan.sourceRefs].reverse(),
    },
    environmentSchema: [...input.environmentSchema].reverse(),
  });

  assert.deepEqual(first, second);
  assert.match(first.artifact.artifactHash, /^sha256:[a-f0-9]{64}$/);
  assert.equal(first.artifact.assemblyPlanRef, assemblyPlan.contentHash);
  assert.equal(first.artifact.validationEvidenceRef, validationEvidence.evidenceHash);
  assert.deepEqual(first.artifact.manifest.files, [
    "assembly-plan.json",
    "environment-schema.json",
    "runtime-entry.mjs",
    "runtime-manifest.json",
  ]);

  const runtimeEntry = first.files.find((file) => file.path === "runtime-entry.mjs");
  const runtimeManifest = first.files.find((file) => file.path === "runtime-manifest.json");
  assert.ok(runtimeEntry);
  assert.ok(runtimeManifest);
  assert.match(runtimeEntry.contentHash, /^sha256:[a-f0-9]{64}$/);
  assert.match(runtimeEntry.content, /RuntimeHealth/);
  assert.match(runtimeEntry.content, /RuntimeStarted/);
  assert.match(runtimeEntry.content, /createServer/);
  assert.match(runtimeEntry.content, /\/health/);
  assert.match(runtimeEntry.content, /SIGTERM/);
  assert.equal(runtimeEntry.content.includes("SYSTEM_BUILDER_URL"), false);
  assert.equal(runtimeEntry.content.includes("OBSERVE_URL"), false);
  assert.equal(runtimeEntry.content.includes("node:net"), false);
  assert.equal(runtimeEntry.content.includes("INSERT INTO runtime_counter"), false);
  assert.deepEqual(JSON.parse(runtimeManifest.content), {
    runtimeVersion: "0.1.0",
    entrypoint: "runtime-entry.mjs",
    components: [
      { capability: "auth.basic", provider: "provider-auth", version: "1.0.0" },
      { capability: "workflow.engine", provider: "provider-a", version: "1.0.0" },
    ],
  });
});

test("compiler materializes deterministic migration assets and PostgreSQL-backed state runtime", () => {
  const requirement = stateRequirement();
  const input = {
    assemblyPlan,
    validationEvidence,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: stateEnvironmentSchema,
    stateRequirements: [requirement],
  };
  const first = compileSyntheticRelease(input);
  const second = compileSyntheticRelease({
    ...input,
    stateRequirements: [{ ...requirement, migrations: [...requirement.migrations].reverse() }],
    environmentSchema: [...stateEnvironmentSchema].reverse(),
  });

  assert.deepEqual(first, second);
  assert.deepEqual(first.artifact.manifest.files, [
    "assembly-plan.json",
    "environment-schema.json",
    "migration-manifest.json",
    "migrations/001-counter.sql",
    "migrations/002-counter-index.sql",
    "runtime-entry.mjs",
    "runtime-manifest.json",
  ]);
  const migrationManifest = first.files.find((file) => file.path === "migration-manifest.json");
  const firstMigration = first.files.find((file) => file.path === "migrations/001-counter.sql");
  const runtimeEntry = first.files.find((file) => file.path === "runtime-entry.mjs");
  assert.ok(migrationManifest);
  assert.ok(firstMigration);
  assert.ok(runtimeEntry);
  const parsed = JSON.parse(migrationManifest.content) as {
    kind: string;
    requirements: Array<{
      connectionBinding: Record<string, unknown>;
      migrations: Array<{ id: string; order: number; path: string; contentHash: string }>;
    }>;
  };
  assert.equal(parsed.kind, "RuntimeMigrationManifest");
  assert.deepEqual(parsed.requirements[0]?.connectionBinding, { name: "DATABASE_URL", kind: "secret-reference" });
  assert.equal("value" in (parsed.requirements[0]?.connectionBinding ?? {}), false);
  assert.equal("reference" in (parsed.requirements[0]?.connectionBinding ?? {}), false);
  assert.deepEqual(parsed.requirements[0]?.migrations.map(({ id, order, path }) => ({ id, order, path })), [
    { id: "counter-v1", order: 10, path: "migrations/001-counter.sql" },
    { id: "counter-v2", order: 20, path: "migrations/002-counter-index.sql" },
  ]);
  assert.equal(parsed.requirements[0]?.migrations[0]?.contentHash, firstMigration.contentHash);
  assert.match(runtimeEntry.content, /node:net/);
  assert.match(runtimeEntry.content, /INSERT INTO runtime_counter/);
  assert.match(runtimeEntry.content, /DATABASE_URL/);
  assert.equal(runtimeEntry.content.includes("postgres://secret"), false);
  assert.equal(runtimeEntry.content.includes('from "pg"'), false);
  assert.equal(runtimeEntry.content.includes("SYSTEM_BUILDER_URL"), false);
  assert.equal(runtimeEntry.content.includes("OBSERVE_URL"), false);
  assert.equal(runtimeEntry.content.includes("CREATE TABLE runtime_counter"), false);

  const changed = compileSyntheticRelease({ ...input, stateRequirements: [stateRequirement("CREATE TABLE changed (id INTEGER);")] });
  assert.notEqual(changed.artifact.artifactHash, first.artifact.artifactHash);
});

test("compiler rejects invalid state environment binding and generated migration path collisions", () => {
  const requirement = stateRequirement();
  assert.throws(
    () => compileSyntheticRelease({
      assemblyPlan,
      validationEvidence,
      compilerVersion: "0.1.0",
      runtimeVersion: "0.1.0",
      environmentSchema: [{ name: "DATABASE_URL", kind: "config", required: true }],
      stateRequirements: [requirement],
    }),
    /COMPILER_STATE_BINDING_MISSING:DATABASE_URL/,
  );
  assert.throws(
    () => compileSyntheticRelease({
      assemblyPlan,
      validationEvidence,
      compilerVersion: "0.1.0",
      runtimeVersion: "0.1.0",
      environmentSchema: stateEnvironmentSchema,
      stateRequirements: [
        requirement,
        {
          kind: "RuntimeStateRequirement",
          capability: "state.other",
          storeKind: "sql",
          connectionBinding: { name: "DATABASE_URL", kind: "secret-reference" },
          migrations: [{
            id: "other-v1",
            capability: "state.other",
            order: 1,
            path: "migrations/001-counter.sql",
            content: "CREATE TABLE other_state (id INTEGER);",
          }],
        },
      ],
    }),
    /COMPILER_DUPLICATE_GENERATED_PATH:migrations\/001-counter.sql/,
  );
});

test("compiler rejects failing or mismatched validation evidence", () => {
  assert.throws(
    () => compileSyntheticRelease({
      assemblyPlan,
      validationEvidence: { ...validationEvidence, decision: "FAIL" },
      compilerVersion: "0.1.0",
      runtimeVersion: "0.1.0",
    }),
    /COMPILER_VALIDATION_FAILED/,
  );

  assert.throws(
    () => compileSyntheticRelease({
      assemblyPlan,
      validationEvidence: { ...validationEvidence, assemblyPlanRef: `sha256:${"c".repeat(64)}` },
      compilerVersion: "0.1.0",
      runtimeVersion: "0.1.0",
    }),
    /COMPILER_VALIDATION_ASSEMBLY_MISMATCH/,
  );
});

test("compiler rejects embedded environment values and never emits secret values", () => {
  assert.throws(
    () => compileSyntheticRelease({
      assemblyPlan,
      validationEvidence,
      compilerVersion: "0.1.0",
      runtimeVersion: "0.1.0",
      environmentSchema: [
        { name: "DATABASE_URL", kind: "secret-reference", required: true, value: "postgres://secret" },
      ] as unknown as readonly { name: string; kind: "secret-reference"; required: boolean }[],
    }),
    /COMPILER_SECRET_VALUE_NOT_ALLOWED/,
  );

  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
  });
  const immutableContent = JSON.stringify(compilation);
  assert.equal(immutableContent.includes("postgres://secret"), false);
  assert.equal(immutableContent.includes("secret://database-url"), false);
});

test("compiler rejects invalid AssemblyPlan identity", () => {
  assert.throws(
    () => compileSyntheticRelease({
      assemblyPlan: { ...assemblyPlan, contentHash: "not-a-hash" },
      validationEvidence,
      compilerVersion: "0.1.0",
      runtimeVersion: "0.1.0",
    }),
    /COMPILER_INVALID_ASSEMBLY_PLAN_HASH/,
  );
});

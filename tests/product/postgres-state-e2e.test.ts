import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { runLocalProcessDeployment } from "../../packages/deploy/local-process.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import type { RuntimeStateRequirement } from "../../packages/runtime-core/index.js";

const databaseUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:postgres-state-e2e:1",
  components: [{ capability: "state.counter", provider: "provider-state", version: "1.0.0" }],
  sourceRefs: ["system-definition:postgres-state-e2e:1"],
  contentHash: `sha256:${"e".repeat(64)}`,
};

const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"f".repeat(64)}`,
};

const environmentSchema = [
  { name: "DATABASE_URL", kind: "secret-reference" as const, required: true },
];

function requirement(content: string): RuntimeStateRequirement {
  return {
    kind: "RuntimeStateRequirement",
    capability: "state.counter",
    storeKind: "sql",
    connectionBinding: { name: "DATABASE_URL", kind: "secret-reference" },
    migrations: [{
      id: "counter-v1",
      capability: "state.counter",
      order: 10,
      path: "migrations/001-counter.sql",
      content,
    }],
  };
}

function publishStatefulRelease(content: string, releaseId: string) {
  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "0.3.0",
    runtimeVersion: "0.3.0",
    environmentSchema,
    stateRequirements: [requirement(content)],
  });
  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  const publishedRelease = new ReleaseRegistry().publish({
    releaseId,
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-16T10:00:00Z",
  });
  return { compilation, artifacts, publishedRelease };
}

const environment = {
  kind: "EnvironmentProfile" as const,
  environmentRef: "environment:postgres-state-e2e",
  runtimeVersions: ["0.3.0"],
  bindings: [
    { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://postgres-state-e2e" },
  ],
};

test(
  "PostgreSQL migration and Runtime state persist across clean local redeploy",
  { skip: databaseUrl === undefined },
  async () => {
    if (!databaseUrl) throw new Error("SYSTEM_BUILDER_TEST_POSTGRES_URL_REQUIRED");

    const initialSql = "CREATE TABLE runtime_counter (id INTEGER PRIMARY KEY, value INTEGER NOT NULL);";
    const { compilation, artifacts, publishedRelease } = publishStatefulRelease(initialSql, "postgres-state-e2e");
    const resolver = new InMemorySecretResolver({ "secret://postgres-state-e2e": databaseUrl });
    const processEnvironment = {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
    };

    assert.equal(JSON.stringify(compilation).includes(databaseUrl), false);
    const migrationManifest = compilation.files.find((file) => file.path === "migration-manifest.json");
    assert.ok(migrationManifest);
    assert.equal(migrationManifest.content.includes(databaseUrl), false);

    const first = await runLocalProcessDeployment({
      publishedRelease,
      releaseArtifact: compilation.artifact,
      artifactPayloadReader: artifacts,
      environment,
      secretResolver: resolver,
      processEnvironment,
      timeoutMs: 10_000,
    });

    assert.equal(first.ok, true);
    if (!first.ok) return;
    assert.deepEqual(first.migrationApplication.migrations.map(({ id, status }) => ({ id, status })), [
      { id: "counter-v1", status: "applied" },
    ]);
    assert.deepEqual(first.state, { kind: "RuntimeState", action: "counter.increment", value: 2 });
    assert.equal(JSON.stringify(first.health).includes(databaseUrl), false);
    assert.equal(JSON.stringify(first.state).includes(databaseUrl), false);
    assert.equal(JSON.stringify(first.migrationApplication).includes(databaseUrl), false);
    assert.equal(first.stdout.includes(databaseUrl), false);
    assert.equal(first.stderr.includes(databaseUrl), false);
    await assert.rejects(access(first.workingDirectory));

    const second = await runLocalProcessDeployment({
      publishedRelease,
      releaseArtifact: compilation.artifact,
      artifactPayloadReader: artifacts,
      environment,
      secretResolver: resolver,
      processEnvironment,
      timeoutMs: 10_000,
    });

    assert.equal(second.ok, true);
    if (!second.ok) return;
    assert.deepEqual(second.migrationApplication.migrations.map(({ id, status }) => ({ id, status })), [
      { id: "counter-v1", status: "skipped" },
    ]);
    assert.deepEqual(second.state, { kind: "RuntimeState", action: "counter.increment", value: 4 });
    assert.equal(second.stdout.includes(databaseUrl), false);
    assert.equal(second.stderr.includes(databaseUrl), false);
    assert.equal(JSON.stringify(second).includes(databaseUrl), false);
    await assert.rejects(access(second.workingDirectory));

    const changed = publishStatefulRelease(
      "CREATE TABLE runtime_counter (id INTEGER PRIMARY KEY, value INTEGER NOT NULL, changed INTEGER);",
      "postgres-state-e2e-changed",
    );
    const rejected = await runLocalProcessDeployment({
      publishedRelease: changed.publishedRelease,
      releaseArtifact: changed.compilation.artifact,
      artifactPayloadReader: changed.artifacts,
      environment,
      secretResolver: resolver,
      processEnvironment,
      timeoutMs: 10_000,
    });

    assert.equal(rejected.ok, false);
    if (rejected.ok) return;
    assert.equal(rejected.activated, false);
    assert.equal(rejected.diagnostic.code, "MIGRATION_APPLICATION_FAILED");
    assert.match(rejected.diagnostic.detail, /MIGRATION_APPLIED_HASH_MISMATCH:state.counter:counter-v1/);
    assert.equal(rejected.diagnostic.detail.includes(databaseUrl), false);
    assert.equal("workingDirectory" in rejected, false);
  },
);

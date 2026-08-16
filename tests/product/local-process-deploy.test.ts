import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { runLocalProcessDeployment } from "../../packages/deploy/local-process.js";
import { preflightVerifiedMigrations } from "../../packages/deploy/migration-preflight.js";
import type { LocalMigrationApplier } from "../../packages/deploy/postgres-migrations.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import type { RuntimeStateRequirement } from "../../packages/runtime-core/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:local-deploy:1",
  components: [{ capability: "auth.basic", provider: "provider-auth", version: "1.0.0" }],
  sourceRefs: ["system-definition:local-deploy:1"],
  contentHash: `sha256:${"a".repeat(64)}`,
};

const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"b".repeat(64)}`,
};

const environmentSchema = [
  { name: "DATABASE_URL", kind: "secret-reference" as const, required: true },
  { name: "LOG_LEVEL", kind: "config" as const, required: false },
];

function stateRequirement(): RuntimeStateRequirement {
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
        content: "THIS IS INTENTIONALLY NOT EXECUTABLE SQL FOR PREFLIGHT PROOF;",
      },
      {
        id: "counter-v1",
        capability: "state.counter",
        order: 10,
        path: "migrations/001-counter.sql",
        content: "CREATE TABLE runtime_counter (id INTEGER PRIMARY KEY, value INTEGER NOT NULL);",
      },
    ],
  };
}

function fixture(withMigrations = false) {
  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "0.2.0",
    runtimeVersion: "0.2.0",
    environmentSchema,
    ...(withMigrations ? { stateRequirements: [stateRequirement()] } : {}),
  });
  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  const publishedRelease = new ReleaseRegistry().publish({
    releaseId: withMigrations ? "local-runtime-migrations" : "local-runtime",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-16T03:00:00Z",
  });
  const environment = {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:local-test",
    runtimeVersions: ["0.2.0"],
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://database-url" },
      { name: "LOG_LEVEL", kind: "config" as const, reference: "config://log-level" },
    ],
  };
  return { compilation, artifacts, publishedRelease, environment };
}

function fakeMigrationApplier(status: "applied" | "skipped" = "applied"): LocalMigrationApplier {
  return async ({ preflight }) => Object.freeze({
    kind: "LocalMigrationApplication",
    migrations: Object.freeze(preflight.migrations.map((migration) => Object.freeze({
      capability: migration.capability,
      id: migration.id,
      order: migration.order,
      path: migration.path,
      contentHash: migration.contentHash,
      status,
    }))),
  });
}

test("local-process Deploy retrieves verified payload, observes persistent HTTP health and cleans materialization", async () => {
  const { compilation, artifacts, publishedRelease, environment } = fixture();
  const releaseBefore = JSON.stringify(publishedRelease);
  const artifactBefore = JSON.stringify(compilation.artifact);
  const filesBefore = JSON.stringify(compilation.files);

  const result = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment,
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
    },
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.health.status, "UP");
  assert.equal(result.health.runtimeVersion, "0.2.0");
  assert.equal(result.health.environmentRef, "environment:local-test");
  assert.deepEqual(result.health.bindingNames, ["DATABASE_URL", "LOG_LEVEL"]);
  assert.deepEqual(result.migrationPreflight, { kind: "LocalMigrationPreflight", migrations: [] });
  assert.deepEqual(result.migrationApplication, { kind: "LocalMigrationApplication", migrations: [] });
  assert.equal(result.state, undefined);
  assert.match(result.stdout, /"kind":"RuntimeStarted"/);
  assert.equal(result.exitCode, 0);
  assert.equal(JSON.stringify(publishedRelease), releaseBefore);
  assert.equal(JSON.stringify(compilation.artifact), artifactBefore);
  assert.equal(JSON.stringify(compilation.files), filesBefore);
  await assert.rejects(access(result.workingDirectory));
});

test("local-process Deploy preserves ordered migration preflight and invokes bounded application before activation", async () => {
  const { compilation, artifacts, publishedRelease, environment } = fixture(true);
  const result = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment,
    migrationApplier: fakeMigrationApplier(),
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.migrationPreflight.migrations.map((migration) => ({ id: migration.id, order: migration.order, path: migration.path })), [
    { id: "counter-v1", order: 10, path: "migrations/001-counter.sql" },
    { id: "counter-v2", order: 20, path: "migrations/002-counter-index.sql" },
  ]);
  assert.deepEqual(result.migrationApplication.migrations.map((migration) => ({ id: migration.id, status: migration.status })), [
    { id: "counter-v1", status: "applied" },
    { id: "counter-v2", status: "applied" },
  ]);
  assert.equal(result.state, undefined);
  assert.equal(result.stderr.includes("INTENTIONALLY NOT EXECUTABLE SQL"), false);
  await assert.rejects(access(result.workingDirectory));
});

test("local-process Deploy requires resolved connection material before applying non-empty migrations", async () => {
  const { compilation, artifacts, publishedRelease, environment } = fixture(true);
  const result = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment,
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.activated, false);
  assert.equal(result.diagnostic.code, "MIGRATION_APPLICATION_FAILED");
  assert.match(result.diagnostic.detail, /MIGRATION_CONNECTION_SECRET_MISSING:DATABASE_URL/);
  assert.equal("workingDirectory" in result, false);
});

test("local-process Deploy resolves secrets before migration application and redacts application failures", async () => {
  const { compilation, artifacts, publishedRelease, environment } = fixture(true);
  const secretValue = "postgres://runtime-user:runtime-password@localhost/runtime";
  let resolved = false;
  const result = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment,
    secretResolver: {
      resolve: () => {
        resolved = true;
        return secretValue;
      },
    },
    migrationApplier: async ({ runtimeSecrets }) => {
      assert.equal(resolved, true);
      assert.equal(runtimeSecrets.DATABASE_URL, secretValue);
      throw new Error(`MIGRATION_TEST_FAILURE:${secretValue}`);
    },
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.activated, false);
  assert.equal(result.diagnostic.code, "MIGRATION_APPLICATION_FAILED");
  assert.equal(result.diagnostic.detail.includes(secretValue), false);
  assert.match(result.diagnostic.detail, /MIGRATION_TEST_FAILURE:\[REDACTED\]/);
  assert.equal("workingDirectory" in result, false);
});

test("migration preflight rejects missing, unlisted, duplicate and hash-mismatched migration evidence", () => {
  const { compilation, artifacts } = fixture(true);
  const verified = artifacts.getVerified(compilation.artifact);
  const manifest = verified.files.find((file) => file.path === "migration-manifest.json");
  assert.ok(manifest);

  assert.throws(
    () => preflightVerifiedMigrations(verified.files.filter((file) => file.path !== "migration-manifest.json")),
    /MIGRATION_MANIFEST_MISSING/,
  );
  assert.throws(
    () => preflightVerifiedMigrations(verified.files.filter((file) => file.path !== "migrations/001-counter.sql")),
    /MIGRATION_PREFLIGHT_FILE_MISSING:migrations\/001-counter.sql/,
  );
  assert.throws(
    () => preflightVerifiedMigrations([...verified.files, { ...verified.files.find((file) => file.path === "migrations/001-counter.sql")!, path: "migrations/unlisted.sql" }]),
    /MIGRATION_PREFLIGHT_FILE_UNLISTED:migrations\/unlisted.sql/,
  );
  const parsed = JSON.parse(manifest.content) as { requirements: Array<{ migrations: Array<Record<string, unknown>> }> };
  parsed.requirements[0]!.migrations[1] = { ...parsed.requirements[0]!.migrations[0] };
  assert.throws(
    () => preflightVerifiedMigrations(verified.files.map((file) => file.path === "migration-manifest.json" ? { ...file, content: JSON.stringify(parsed) } : file)),
    /MIGRATION_PREFLIGHT_DUPLICATE_ID|MIGRATION_PREFLIGHT_DUPLICATE_ORDER|MIGRATION_PREFLIGHT_DUPLICATE_PATH/,
  );

  const mismatch = JSON.parse(manifest.content) as { requirements: Array<{ migrations: Array<{ contentHash: string }> }> };
  mismatch.requirements[0]!.migrations[0]!.contentHash = `sha256:${"c".repeat(64)}`;
  assert.throws(
    () => preflightVerifiedMigrations(verified.files.map((file) => file.path === "migration-manifest.json" ? { ...file, content: JSON.stringify(mismatch) } : file)),
    /MIGRATION_PREFLIGHT_HASH_MISMATCH:migrations\/001-counter.sql/,
  );
});

test("local-process Deploy fails malformed verified migration evidence before secrets or materialization", async () => {
  const { compilation, artifacts, publishedRelease, environment } = fixture(true);
  const verified = artifacts.getVerified(compilation.artifact);
  const manifest = verified.files.find((file) => file.path === "migration-manifest.json");
  assert.ok(manifest);
  const parsed = JSON.parse(manifest.content) as { requirements: Array<{ migrations: Array<{ contentHash: string }> }> };
  parsed.requirements[0]!.migrations[0]!.contentHash = `sha256:${"d".repeat(64)}`;
  let secretResolutionAttempted = false;
  const result = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: {
      getVerified: () => ({
        artifactHash: compilation.artifact.artifactHash,
        verified: true as const,
        files: verified.files.map((file) => file.path === "migration-manifest.json" ? { ...file, content: JSON.stringify(parsed) } : file),
      }),
    },
    environment,
    secretResolver: {
      resolve: () => {
        secretResolutionAttempted = true;
        return "runtime-secret-must-not-be-used";
      },
    },
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.activated, false);
  assert.equal(result.diagnostic.code, "MIGRATION_PREFLIGHT_INVALID");
  assert.match(result.diagnostic.detail, /MIGRATION_PREFLIGHT_HASH_MISMATCH:migrations\/001-counter.sql/);
  assert.equal(secretResolutionAttempted, false);
  assert.equal("workingDirectory" in result, false);
  assert.equal(result.diagnostic.detail.includes("runtime-secret-must-not-be-used"), false);
});

test("secret-aware Deploy verifies artifact before resolution, injects runtime-only secret and observes state 1 then 2", async () => {
  const { compilation, artifacts, publishedRelease, environment } = fixture();
  const secretValue = "postgres://runtime-user:runtime-password@localhost/runtime";
  let verified = false;
  const artifactPayloadReader = {
    getVerified: (artifact: typeof compilation.artifact) => {
      const payload = artifacts.getVerified(artifact);
      verified = true;
      return payload;
    },
  };
  const secretResolver = {
    resolve: (reference: string) => {
      assert.equal(verified, true);
      assert.equal(reference, "secret://database-url");
      return secretValue;
    },
  };

  const result = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader,
    environment,
    secretResolver,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.state, { kind: "RuntimeState", action: "counter.increment", value: 2 });
  assert.deepEqual(result.migrationApplication, { kind: "LocalMigrationApplication", migrations: [] });
  assert.equal(result.stdout.includes(secretValue), false);
  assert.equal(result.stderr.includes(secretValue), false);
  assert.equal(JSON.stringify(result.health).includes(secretValue), false);
  assert.equal(JSON.stringify(result.state).includes(secretValue), false);
  assert.equal(JSON.stringify(result.migrationApplication).includes(secretValue), false);
  await assert.rejects(access(result.workingDirectory));
});

test("secret-aware Deploy fails before materialization when symbolic secret cannot resolve", async () => {
  const { compilation, artifacts, publishedRelease, environment } = fixture();
  const result = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment,
    secretResolver: new InMemorySecretResolver({}),
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.activated, false);
  assert.equal(result.diagnostic.code, "SECRET_RESOLUTION_FAILED");
  assert.match(result.diagnostic.detail, /SECRET_REFERENCE_NOT_FOUND:secret:\/\/database-url/);
  assert.equal("workingDirectory" in result, false);
});

test("local-process Deploy rejects artifact/runtime mismatch before payload retrieval", async () => {
  const { compilation, artifacts, publishedRelease, environment } = fixture();
  const artifactMismatch = await runLocalProcessDeployment({
    publishedRelease: { ...publishedRelease, artifactHash: `sha256:${"c".repeat(64)}` },
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment,
  });
  assert.equal(artifactMismatch.ok, false);
  if (artifactMismatch.ok) return;
  assert.equal(artifactMismatch.activated, false);
  assert.equal(artifactMismatch.diagnostic.code, "ARTIFACT_MISMATCH");

  const runtimeMismatch = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment: { ...environment, runtimeVersions: ["9.9.9"] },
  });
  assert.equal(runtimeMismatch.ok, false);
  if (runtimeMismatch.ok) return;
  assert.equal(runtimeMismatch.activated, false);
  assert.equal(runtimeMismatch.diagnostic.code, "RUNTIME_INCOMPATIBLE");
});

test("local-process Deploy rejects corrupted artifact payload before activation or materialization", async () => {
  const { compilation, publishedRelease, environment } = fixture();
  const corruptArtifacts = new InMemoryArtifactPayloadRepository();
  corruptArtifacts.publish({
    artifactHash: compilation.artifact.artifactHash,
    files: compilation.files.map((file, index) => index === 0 ? { ...file, content: `${file.content}\ncorrupt` } : file),
  });

  const result = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: corruptArtifacts,
    environment,
    secretResolver: new InMemorySecretResolver({ "secret://database-url": "runtime-only-secret" }),
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.activated, false);
  assert.equal(result.diagnostic.code, "ARTIFACT_PAYLOAD_INVALID");
  assert.match(result.diagnostic.detail, /ARTIFACT_PAYLOAD_FILE_HASH_MISMATCH/);
  assert.equal("workingDirectory" in result, false);
});

test("local-process Deploy reports startup timeout and cleans a non-reporting persistent process", async () => {
  const { compilation, publishedRelease, environment } = fixture();
  const hangingReader = {
    getVerified: () => ({
      artifactHash: compilation.artifact.artifactHash,
      verified: true as const,
      files: compilation.files.map((file) => file.path === "runtime-entry.mjs"
        ? { ...file, content: "setInterval(() => {}, 1000);" }
        : file),
    }),
  };
  const result = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: hangingReader,
    environment,
    timeoutMs: 50,
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.activated, true);
  assert.equal(result.diagnostic.code, "RUNTIME_PROCESS_TIMEOUT");
  if (result.workingDirectory) await assert.rejects(access(result.workingDirectory));
});

test("local-process Deploy reports health failure after bounded startup and cleans the process", async () => {
  const { compilation, publishedRelease, environment } = fixture();
  const noHealthReader = {
    getVerified: () => ({
      artifactHash: compilation.artifact.artifactHash,
      verified: true as const,
      files: compilation.files.map((file) => file.path === "runtime-entry.mjs"
        ? {
            ...file,
            content: "process.stdout.write(JSON.stringify({kind:'RuntimeStarted',status:'UP',port:1,runtimeVersion:'0.2.0',environmentRef:'environment:local-test'})+'\\n'); setInterval(() => {}, 1000);",
          }
        : file),
    }),
  };
  const result = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: noHealthReader,
    environment,
    timeoutMs: 250,
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.activated, true);
  assert.equal(result.diagnostic.code, "RUNTIME_HEALTH_INVALID");
  if (result.workingDirectory) await assert.rejects(access(result.workingDirectory));
});

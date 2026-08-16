import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { createConnection } from "node:net";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { runLocalProcessDeployment } from "../../packages/deploy/local-process.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { validateTraceability } from "../../packages/validation/index.js";

const databaseUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const runtimeVersion = "0.4.0";
const compilerVersion = "0.4.0";

type PostgresConfig = Readonly<{ host: string; port: number; user: string; database: string }>;

function postgresConfig(connectionString: string): PostgresConfig {
  const url = new URL(connectionString);
  const port = url.port.length > 0 ? Number(url.port) : 5432;
  const database = decodeURIComponent(url.pathname.replace(/^\//, ""));
  const user = decodeURIComponent(url.username);
  if (
    (url.protocol !== "postgres:" && url.protocol !== "postgresql:") ||
    url.hostname.length === 0 ||
    user.length === 0 ||
    database.length === 0 ||
    !Number.isInteger(port) ||
    port <= 0 ||
    port > 65535
  ) throw new Error("CAPABILITY_E2E_POSTGRES_URL_INVALID");
  return Object.freeze({ host: url.hostname, port, user, database });
}

function cString(value: string): Buffer {
  return Buffer.from(`${value}\0`, "utf8");
}

function startupMessage(config: PostgresConfig): Buffer {
  const fields = Buffer.concat([
    cString("user"),
    cString(config.user),
    cString("database"),
    cString(config.database),
    cString("client_encoding"),
    cString("UTF8"),
    Buffer.from([0]),
  ]);
  const message = Buffer.allocUnsafe(8 + fields.length);
  message.writeInt32BE(message.length, 0);
  message.writeInt32BE(196608, 4);
  fields.copy(message, 8);
  return message;
}

function queryMessage(sql: string): Buffer {
  const text = Buffer.from(`${sql}\0`, "utf8");
  const message = Buffer.allocUnsafe(5 + text.length);
  message[0] = 81;
  message.writeInt32BE(4 + text.length, 1);
  text.copy(message, 5);
  return message;
}

function postgresErrorCode(payload: Buffer): string {
  let offset = 0;
  while (offset < payload.length && payload[offset] !== 0) {
    const field = String.fromCharCode(payload[offset]!);
    offset += 1;
    const end = payload.indexOf(0, offset);
    if (end < 0) break;
    const value = payload.toString("utf8", offset, end);
    if (field === "C") return value;
    offset = end + 1;
  }
  return "UNKNOWN";
}

async function executeAdminSql(connectionString: string, sql: string): Promise<void> {
  const config = postgresConfig(connectionString);
  await new Promise<void>((resolve, reject) => {
    const socket = createConnection({ host: config.host, port: config.port });
    let buffer = Buffer.alloc(0);
    let querySent = false;
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      if (error) reject(error);
      else resolve();
    };

    socket.once("connect", () => socket.write(startupMessage(config)));
    socket.once("error", (error) => finish(error));
    socket.on("data", (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length >= 5) {
        const length = buffer.readInt32BE(1);
        const total = 1 + length;
        if (length < 4 || buffer.length < total) return;
        const type = String.fromCharCode(buffer[0]!);
        const payload = buffer.subarray(5, total);
        buffer = buffer.subarray(total);
        if (type === "E") {
          finish(new Error(`CAPABILITY_E2E_POSTGRES_ERROR:${postgresErrorCode(payload)}`));
          return;
        }
        if (type === "Z") {
          if (!querySent) {
            querySent = true;
            socket.write(queryMessage(sql));
          } else {
            finish();
            return;
          }
        }
      }
    });
  });
}

function isolatedDatabaseUrl(baseUrl: string, databaseName: string): string {
  const url = new URL(baseUrl);
  url.pathname = `/${databaseName}`;
  url.search = "";
  url.hash = "";
  return url.toString();
}

function traceabilityFixture(capability: string, suffix: string) {
  const requirementId = `REQ-${suffix}`;
  const recipe = {
    modules: [{ requirementIds: [requirementId] }],
    rules: [],
    responsibilities: [],
    exceptions: [],
  };
  const analysis = { findings: [{ recipeRequirementRefs: [requirementId] }] };
  const definition = {
    definition: "SystemDefinition" as const,
    analysisRef: `analysis:${suffix}`,
    recipeRef: `recipe:${suffix}`,
    entities: [],
    processes: [],
    actions: [],
    capabilities: [{ id: `capability:${suffix}`, capability, requirementRefs: [requirementId] }],
    views: [],
    policies: [],
    integrations: [],
  };
  return { recipe, analysis, definition };
}

function assembleValidated(input: Readonly<{
  capability: string;
  provider: string;
  version: string;
  suffix: string;
}>) {
  const fixture = traceabilityFixture(input.capability, input.suffix);
  const catalog = new SoftwareCatalogRegistry();
  catalog.register({ capability: input.capability, provider: input.provider, version: input.version });
  const assembly = assembleSystemDefinition(
    fixture.definition,
    `system-definition:${input.suffix}:1`,
    (request) => resolveCatalogCandidates(catalog, request),
  );
  assert.equal(assembly.ok, true);
  if (!assembly.ok) throw new Error(`CAPABILITY_E2E_ASSEMBLY_FAILED:${input.suffix}`);
  const validation = validateTraceability({
    recipe: fixture.recipe,
    analysis: fixture.analysis,
    definition: fixture.definition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: `capability-e2e-${input.suffix}`, status: "PASS", evidenceRefs: [`test:${input.suffix}`] }],
  });
  assert.equal(validation.decision, "PASS");
  return { ...fixture, catalog, assemblyPlan: assembly.plan, validation };
}

function publishCompilation(input: Readonly<{
  assemblyPlan: ReturnType<typeof assembleValidated>["assemblyPlan"];
  validation: ReturnType<typeof assembleValidated>["validation"];
  releaseId: string;
  environmentSchema: readonly Readonly<{ name: string; kind: "config" | "secret-reference"; required: boolean }>[];
}>) {
  const compilation = compileSyntheticRelease({
    assemblyPlan: input.assemblyPlan,
    validationEvidence: input.validation,
    compilerVersion,
    runtimeVersion,
    environmentSchema: input.environmentSchema,
  });
  const artifacts = new InMemoryArtifactPayloadRepository();
  const artifactPayload = artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  const verifiedPayload = artifacts.getVerified(compilation.artifact);
  const publishedRelease = new ReleaseRegistry().publish({
    releaseId: input.releaseId,
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-16T15:00:00Z",
  });
  return { compilation, artifacts, artifactPayload, verifiedPayload, publishedRelease };
}

test(
  "capability-driven PostgreSQL Runtime persists across clean redeploy without caller state requirements",
  { skip: databaseUrl === undefined },
  async () => {
    if (!databaseUrl) throw new Error("SYSTEM_BUILDER_TEST_POSTGRES_URL_REQUIRED");
    const databaseName = `sb_capability_e2e_${process.pid}`;
    const quotedDatabaseName = `"${databaseName}"`;
    await executeAdminSql(databaseUrl, `DROP DATABASE IF EXISTS ${quotedDatabaseName} WITH (FORCE)`);
    await executeAdminSql(databaseUrl, `CREATE DATABASE ${quotedDatabaseName}`);
    const isolatedUrl = isolatedDatabaseUrl(databaseUrl, databaseName);

    try {
      const vertical = assembleValidated({
        capability: "state.counter",
        provider: "system-builder.postgres-counter",
        version: "1.0.0",
        suffix: "capability-runtime-state",
      });
      const release = publishCompilation({
        assemblyPlan: vertical.assemblyPlan,
        validation: vertical.validation,
        releaseId: "capability-runtime-state",
        environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
      });

      assert.deepEqual(vertical.assemblyPlan.components, [
        { capability: "state.counter", provider: "system-builder.postgres-counter", version: "1.0.0" },
      ]);
      assert.ok(release.compilation.files.some((file) => file.path === "migration-manifest.json"));
      assert.equal(release.verifiedPayload.verified, true);
      assert.equal(JSON.stringify(release.compilation).includes(isolatedUrl), false);
      assert.equal(JSON.stringify(release.artifactPayload).includes(isolatedUrl), false);
      assert.equal(JSON.stringify(release.publishedRelease).includes(isolatedUrl), false);

      const environment = {
        kind: "EnvironmentProfile" as const,
        environmentRef: "environment:capability-runtime-e2e",
        runtimeVersions: [runtimeVersion],
        bindings: [
          { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://capability-runtime-e2e" },
        ],
      };
      const resolver = new InMemorySecretResolver({ "secret://capability-runtime-e2e": isolatedUrl });
      const processEnvironment = {
        SYSTEM_BUILDER_URL: "http://127.0.0.1:1",
        OBSERVE_URL: "http://127.0.0.1:1",
        SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
        SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
      };

      const first = await runLocalProcessDeployment({
        publishedRelease: release.publishedRelease,
        releaseArtifact: release.compilation.artifact,
        artifactPayloadReader: release.artifacts,
        environment,
        secretResolver: resolver,
        processEnvironment,
        timeoutMs: 10_000,
      });
      assert.equal(first.ok, true);
      if (!first.ok) return;
      assert.deepEqual(first.migrationApplication.migrations.map(({ status }) => status), ["applied"]);
      assert.deepEqual(first.state, { kind: "RuntimeState", action: "counter.increment", value: 2 });
      assert.equal(JSON.stringify(first).includes(isolatedUrl), false);
      await assert.rejects(access(first.workingDirectory));

      const second = await runLocalProcessDeployment({
        publishedRelease: release.publishedRelease,
        releaseArtifact: release.compilation.artifact,
        artifactPayloadReader: release.artifacts,
        environment,
        secretResolver: resolver,
        processEnvironment,
        timeoutMs: 10_000,
      });
      assert.equal(second.ok, true);
      if (!second.ok) return;
      assert.deepEqual(second.migrationApplication.migrations.map(({ status }) => status), ["skipped"]);
      assert.deepEqual(second.state, { kind: "RuntimeState", action: "counter.increment", value: 4 });
      assert.equal(JSON.stringify(second).includes(isolatedUrl), false);
      await assert.rejects(access(second.workingDirectory));
    } finally {
      await executeAdminSql(databaseUrl, `DROP DATABASE IF EXISTS ${quotedDatabaseName} WITH (FORCE)`);
    }
  },
);

test("SystemDefinition without state.counter produces a valid no-state release and deployment", async () => {
  const vertical = assembleValidated({
    capability: "workflow.engine",
    provider: "provider-workflow",
    version: "1.0.0",
    suffix: "capability-runtime-no-state",
  });
  const release = publishCompilation({
    assemblyPlan: vertical.assemblyPlan,
    validation: vertical.validation,
    releaseId: "capability-runtime-no-state",
    environmentSchema: [],
  });
  assert.equal(release.compilation.files.some((file) => file.path === "migration-manifest.json"), false);
  const runtimeEntry = release.compilation.files.find((file) => file.path === "runtime-entry.mjs");
  assert.ok(runtimeEntry);
  assert.equal(runtimeEntry.content.includes("/state/counter/increment"), false);

  const result = await runLocalProcessDeployment({
    publishedRelease: release.publishedRelease,
    releaseArtifact: release.compilation.artifact,
    artifactPayloadReader: release.artifacts,
    environment: {
      kind: "EnvironmentProfile",
      environmentRef: "environment:capability-runtime-no-state",
      runtimeVersions: [runtimeVersion],
      bindings: [],
    },
    processEnvironment: { SYSTEM_BUILDER_URL: "http://127.0.0.1:1", OBSERVE_URL: "http://127.0.0.1:1" },
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.state, undefined);
  assert.deepEqual(result.migrationPreflight.migrations, []);
  assert.deepEqual(result.migrationApplication.migrations, []);
});

test("unsupported selected state.counter provider fails before artifact publication", () => {
  const vertical = assembleValidated({
    capability: "state.counter",
    provider: "unsupported.counter-provider",
    version: "9.9.9",
    suffix: "capability-runtime-unsupported",
  });
  const artifacts = new InMemoryArtifactPayloadRepository();
  let publicationAttempted = false;
  let diagnostic = "";
  try {
    const compilation = compileSyntheticRelease({
      assemblyPlan: vertical.assemblyPlan,
      validationEvidence: vertical.validation,
      compilerVersion,
      runtimeVersion,
      environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
    });
    publicationAttempted = true;
    artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  } catch (error) {
    diagnostic = error instanceof Error ? error.message : String(error);
  }
  assert.equal(publicationAttempted, false);
  assert.match(
    diagnostic,
    /COMPILER_RUNTIME_CAPABILITY_UNSUPPORTED:state\.counter:unsupported\.counter-provider:9\.9\.9/,
  );
  assert.equal(databaseUrl === undefined ? true : diagnostic.includes(databaseUrl), false);
});

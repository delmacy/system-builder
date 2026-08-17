import assert from "node:assert/strict";
import { createConnection } from "node:net";
import test from "node:test";
import { PostgresArtifactPayloadRepository } from "../../packages/artifact-store/postgres.js";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { PostgresCatalogRecordStorage } from "../../packages/catalog/postgres.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { dryRunDeploy } from "../../packages/deploy/index.js";
import { executeLocalDeployment } from "../../packages/deploy/local-deployment.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { PostgresReleaseRecordStorage } from "../../packages/release/postgres.js";
import { validateTraceability } from "../../packages/validation/index.js";
import { factoryAnalysis, factoryCatalogRecords, factoryEnvironmentSchema, factoryRecipe, factorySystemDefinition } from "./fixtures/factory-e2e.js";

const postgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const runtimeVersion = "0.6.0";
const compilerVersion = "0.6.0";

type PgConfig = Readonly<{ host: string; port: number; user: string; database: string }>;
function pgConfig(connectionString: string): PgConfig {
  const url = new URL(connectionString);
  const port = url.port ? Number(url.port) : 5432;
  const user = decodeURIComponent(url.username);
  const database = decodeURIComponent(url.pathname.replace(/^\//, ""));
  if ((url.protocol !== "postgres:" && url.protocol !== "postgresql:") || !url.hostname || !user || !database || !Number.isInteger(port) || port <= 0 || port > 65535) throw new Error("DURABLE_FACTORY_POSTGRES_URL_INVALID");
  return Object.freeze({ host: url.hostname, port, user, database });
}
function cString(value: string): Buffer { return Buffer.from(`${value}\0`, "utf8"); }
function startup(config: PgConfig): Buffer {
  const fields = Buffer.concat([cString("user"), cString(config.user), cString("database"), cString(config.database), cString("client_encoding"), cString("UTF8"), Buffer.from([0])]);
  const msg = Buffer.allocUnsafe(8 + fields.length); msg.writeInt32BE(msg.length, 0); msg.writeInt32BE(196608, 4); fields.copy(msg, 8); return msg;
}
function query(sql: string): Buffer { const text = Buffer.from(`${sql}\0`, "utf8"); const msg = Buffer.allocUnsafe(5 + text.length); msg[0] = 81; msg.writeInt32BE(4 + text.length, 1); text.copy(msg, 5); return msg; }
function pgError(payload: Buffer): string { let offset = 0; while (offset < payload.length && payload[offset] !== 0) { const field = String.fromCharCode(payload[offset]!); offset += 1; const end = payload.indexOf(0, offset); if (end < 0) break; const value = payload.toString("utf8", offset, end); if (field === "C") return value; offset = end + 1; } return "UNKNOWN"; }
async function adminSql(connectionString: string, sql: string): Promise<void> {
  const config = pgConfig(connectionString);
  await new Promise<void>((resolve, reject) => {
    const socket = createConnection({ host: config.host, port: config.port }); let buffer = Buffer.alloc(0); let sent = false; let settled = false;
    const finish = (error?: Error) => { if (settled) return; settled = true; socket.destroy(); if (error) reject(error); else resolve(); };
    socket.once("connect", () => socket.write(startup(config))); socket.once("error", () => finish(new Error("DURABLE_FACTORY_POSTGRES_SOCKET_FAILED")));
    socket.on("data", (chunk: Buffer) => { buffer = Buffer.concat([buffer, chunk]); while (buffer.length >= 5) { const length = buffer.readInt32BE(1); const total = 1 + length; if (length < 4 || buffer.length < total) return; const type = String.fromCharCode(buffer[0]!); const payload = buffer.subarray(5, total); buffer = buffer.subarray(total); if (type === "E") { finish(new Error(`DURABLE_FACTORY_POSTGRES_ERROR:${pgError(payload)}`)); return; } if (type === "Z") { if (!sent) { sent = true; socket.write(query(sql)); } else { finish(); return; } } } });
  });
}
function isolatedUrl(baseUrl: string, databaseName: string): string { const url = new URL(baseUrl); url.pathname = `/${databaseName}`; url.search = ""; url.hash = ""; return url.toString(); }

async function compileFactory(scope: string, reverse = false) {
  assert.ok(postgresUrl);
  const firstStorage = await PostgresCatalogRecordStorage.open(postgresUrl, scope); const firstRegistry = new SoftwareCatalogRegistry(firstStorage);
  for (const record of reverse ? [...factoryCatalogRecords].reverse() : [...factoryCatalogRecords]) firstRegistry.register(record);
  await firstStorage.close();
  const storage = await PostgresCatalogRecordStorage.open(postgresUrl, scope); const registry = new SoftwareCatalogRegistry(storage);
  const assembly = assembleSystemDefinition(factorySystemDefinition, "system-definition:durable-factory:1", (request) => resolveCatalogCandidates(registry, request));
  assert.equal(assembly.ok, true); if (!assembly.ok) throw new Error("DURABLE_FACTORY_ASSEMBLY_FAILED");
  const validation = validateTraceability({ recipe: factoryRecipe, analysis: factoryAnalysis, definition: factorySystemDefinition, assemblyPlan: assembly.plan, assemblyPlanRef: assembly.plan.contentHash, declaredChecks: [{ id: "durable-factory", status: "PASS", evidenceRefs: ["test:durable-factory"] }] });
  assert.equal(validation.decision, "PASS");
  const compilation = compileSyntheticRelease({ assemblyPlan: assembly.plan, validationEvidence: validation, compilerVersion, runtimeVersion, environmentSchema: factoryEnvironmentSchema });
  await storage.close();
  return { assemblyPlan: assembly.plan, compilation };
}

async function compileStateful(scope: string) {
  assert.ok(postgresUrl);
  const recipe = { modules: [{ requirementIds: ["REQ-STATE"] }], rules: [], responsibilities: [], exceptions: [] };
  const analysis = { findings: [{ recipeRequirementRefs: ["REQ-STATE"] }] };
  const definition = { definition: "SystemDefinition" as const, analysisRef: "analysis:durable-runtime", recipeRef: "recipe:durable-runtime", entities: [], processes: [], actions: [], views: [], policies: [], integrations: [], capabilities: [{ id: "cap-state", capability: "state.counter", requirementRefs: ["REQ-STATE"] }] };
  const first = await PostgresCatalogRecordStorage.open(postgresUrl, scope); new SoftwareCatalogRegistry(first).register({ capability: "state.counter", provider: "system-builder.postgres-counter", version: "1.0.0" }); await first.close();
  const storage = await PostgresCatalogRecordStorage.open(postgresUrl, scope); const registry = new SoftwareCatalogRegistry(storage);
  const assembly = assembleSystemDefinition(definition, "system-definition:durable-runtime:1", (request) => resolveCatalogCandidates(registry, request));
  assert.equal(assembly.ok, true); if (!assembly.ok) throw new Error("DURABLE_RUNTIME_ASSEMBLY_FAILED");
  const validation = validateTraceability({ recipe, analysis, definition, assemblyPlan: assembly.plan, assemblyPlanRef: assembly.plan.contentHash, declaredChecks: [{ id: "durable-runtime", status: "PASS", evidenceRefs: ["test:durable-runtime"] }] });
  assert.equal(validation.decision, "PASS");
  const compilation = compileSyntheticRelease({ assemblyPlan: assembly.plan, validationEvidence: validation, compilerVersion, runtimeVersion, environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }] });
  await storage.close(); return { compilation };
}

async function publishAndReconstruct(compilation: Awaited<ReturnType<typeof compileFactory>>["compilation"], suffix: string) {
  assert.ok(postgresUrl);
  const releaseStorage = await PostgresReleaseRecordStorage.open(postgresUrl, `durable_release_${suffix}`); const artifacts = await PostgresArtifactPayloadRepository.open(postgresUrl, `durable_artifact_${suffix}`); const registry = new ReleaseRegistry(releaseStorage);
  registry.publish({ releaseId: `durable-${suffix}`, version: "1.0.0", artifact: compilation.artifact, publishedAt: "2026-08-17T18:00:00Z" }); artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files }); await releaseStorage.close(); await artifacts.close();
  const reconstructedReleaseStorage = await PostgresReleaseRecordStorage.open(postgresUrl, `durable_release_${suffix}`); const reconstructedArtifacts = await PostgresArtifactPayloadRepository.open(postgresUrl, `durable_artifact_${suffix}`); const release = new ReleaseRegistry(reconstructedReleaseStorage).get(`durable-${suffix}`, "1.0.0"); assert.ok(release); const verified = reconstructedArtifacts.getVerified(compilation.artifact);
  return { reconstructedReleaseStorage, reconstructedArtifacts, release, verified };
}

function deployEnvironment(bindDatabase = true) { return { kind: "EnvironmentProfile" as const, environmentRef: "environment:durable-factory", runtimeVersions: [runtimeVersion], bindings: [...(bindDatabase ? [{ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://durable/database" }] : []), { name: "LOG_LEVEL", kind: "config" as const, reference: "config://durable/log-level" }] }; }

test("durable Factory reconstructs Catalog and Release/Artifact before existing Deploy", { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(postgresUrl);
  const first = await compileFactory("task098_catalog_a"); const second = await compileFactory("task098_catalog_b", true);
  assert.deepEqual(second.assemblyPlan, first.assemblyPlan); assert.deepEqual(second.compilation.artifact, first.compilation.artifact);
  const durable = await publishAndReconstruct(first.compilation, "task098"); assert.deepEqual(durable.verified.files, first.compilation.files);
  const input = { publishedRelease: durable.release, releaseArtifact: first.compilation.artifact, environment: deployEnvironment(), acceptanceChecks: [{ name: "artifact-verified", pass: true }], startedAt: "2026-08-17T18:01:00Z", completedAt: "2026-08-17T18:01:01Z" } as const;
  const deployed = dryRunDeploy(input); const repeated = dryRunDeploy(input); assert.equal(deployed.ok, true); assert.equal(repeated.ok, true); if (!deployed.ok || !repeated.ok) throw new Error("TASK098_DEPLOY_FAILED"); assert.deepEqual(repeated.record, deployed.record);
  const missing = dryRunDeploy({ ...input, environment: deployEnvironment(false) }); assert.equal(missing.ok, false); if (missing.ok) throw new Error("TASK098_EXPECTED_MISSING_BINDING"); assert.equal(missing.diagnostic.code, "MISSING_ENVIRONMENT_BINDING");
  const evidence = JSON.stringify({ release: durable.release, payload: durable.verified, deployment: deployed.record }); assert.equal(evidence.includes(postgresUrl), false); assert.equal(evidence.includes("postgres://"), false); assert.equal(evidence.includes("secret://"), false);
  await durable.reconstructedArtifacts.close(); await durable.reconstructedReleaseStorage.close();
});

test("reconstructed durable Factory output reaches autonomous persisted Runtime across clean redeploy", { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(postgresUrl);
  const databaseName = `sb_durable_factory_${process.pid}`; const quoted = `"${databaseName}"`; await adminSql(postgresUrl, `DROP DATABASE IF EXISTS ${quoted} WITH (FORCE)`); await adminSql(postgresUrl, `CREATE DATABASE ${quoted}`); const runtimeDatabaseUrl = isolatedUrl(postgresUrl, databaseName);
  try {
    const stateful = await compileStateful("task099_catalog"); const durable = await publishAndReconstruct(stateful.compilation, "task099"); assert.ok(stateful.compilation.files.some((file) => file.path === "migration-manifest.json")); assert.deepEqual(durable.verified.files, stateful.compilation.files);
    await durable.reconstructedReleaseStorage.close(); await durable.reconstructedArtifacts.close();
    const environment = { kind: "EnvironmentProfile" as const, environmentRef: "environment:task099", runtimeVersions: [runtimeVersion], bindings: [{ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://task099/runtime" }] };
    const resolver = new InMemorySecretResolver({ "secret://task099/runtime": runtimeDatabaseUrl });
    const common = { publishedRelease: durable.release, releaseArtifact: stateful.compilation.artifact, artifactPayloadReader: durable.reconstructedArtifacts, environment, secretResolver: resolver, processEnvironment: { SYSTEM_BUILDER_URL: "http://127.0.0.1:1", OBSERVE_URL: "http://127.0.0.1:1", SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1", SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1" }, timeoutMs: 10_000 } as const;
    const first = await executeLocalDeployment({ ...common, startedAt: "2026-08-17T18:10:00Z", completedAt: "2026-08-17T18:10:01Z" }); assert.equal(first.ok, true); if (!first.ok || !first.execution.ok) throw new Error("TASK099_FIRST_RUNTIME_FAILED"); assert.deepEqual(first.execution.state, { kind: "RuntimeState", action: "counter.increment", value: 2 }); assert.deepEqual(first.execution.migrationApplication.migrations.map(({ status }) => status), ["applied"]);
    const second = await executeLocalDeployment({ ...common, startedAt: "2026-08-17T18:11:00Z", completedAt: "2026-08-17T18:11:01Z" }); assert.equal(second.ok, true); if (!second.ok || !second.execution.ok) throw new Error("TASK099_SECOND_RUNTIME_FAILED"); assert.deepEqual(second.execution.state, { kind: "RuntimeState", action: "counter.increment", value: 4 }); assert.deepEqual(second.execution.migrationApplication.migrations.map(({ status }) => status), ["skipped"]); assert.equal(second.record.publishedReleaseRef, first.record.publishedReleaseRef); assert.equal(second.record.releaseHash, first.record.releaseHash);
    const evidence = JSON.stringify({ release: durable.release, payload: durable.verified, first: first.record, second: second.record }); assert.equal(evidence.includes(runtimeDatabaseUrl), false); assert.equal(evidence.includes(postgresUrl), false); assert.equal(evidence.includes("postgres://"), false);
  } finally { await adminSql(postgresUrl, `DROP DATABASE IF EXISTS ${quoted} WITH (FORCE)`); }
});

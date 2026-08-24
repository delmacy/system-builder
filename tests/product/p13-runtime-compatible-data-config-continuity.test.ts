import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileAutonomousRuntimeModelBundle } from "../../packages/compiler/autonomous-runtime-model-bundle.js";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { SingleHostActiveRuntimeOrchestrator } from "../../packages/deploy/active-runtime.js";
import { DeploymentRegistry } from "../../packages/deploy/index.js";
import { PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const runtimePostgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const deployPostgresUrl = process.env.SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL;
const entityRef = "entity:p13-compatible-continuity-ticket";
const fileRef = "files:p13-compatible-continuity";
const storageBinding = "storage:p13-compatible-continuity";
const storageEnvironmentName = "P13_TASK_263_STORAGE_ROOT";
const unavailableControlPlane = Object.freeze({
  SYSTEM_BUILDER_URL: "http://127.0.0.1:1",
  OBSERVE_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
});

type TitleType = "string" | "number";

function assemblyPlan() {
  const payload = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:p13:compatible-data-config-continuity",
    components: [],
    sourceRefs: ["source:p13:compatible-data-config-continuity"],
  };
  return { ...payload, contentHash: sha256Canonical(payload) };
}

function compileRelease(runtimeVersion: "1.0.0" | "1.1.0", titleType: TitleType = "string") {
  const plan = assemblyPlan();
  return compileAutonomousRuntimeModelBundle({
    assemblyPlan: plan,
    validationEvidence: {
      kind: "ValidationEvidence",
      assemblyPlanRef: plan.contentHash,
      decision: "PASS",
      evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }),
    },
    compilerVersion: "0.1.0",
    runtimeVersion,
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: plan.systemDefinitionRef,
      entities: [{ id: entityRef, fields: [{ name: "title", type: titleType, required: true }] }],
      actions: [],
      processes: [],
      environmentRequirements: [{ name: storageBinding, kind: "storage", required: true }],
      files: [{ id: fileRef, bindingRef: storageBinding, operations: ["put", "get", "delete"] }],
    },
  });
}

function environment(): EnvironmentProfile {
  return {
    kind: "EnvironmentProfile",
    environmentRef: "environment:p13-compatible-data-config-continuity",
    runtimeVersions: ["1.0.0", "1.1.0"],
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference", reference: "secret://p13/task263/runtime-db" },
      { name: storageBinding, kind: "config", reference: `env://${storageEnvironmentName}`, requirementKind: "storage" },
    ],
  };
}

function continuityIdentity(compilation: ReturnType<typeof compileRelease>): string {
  const modelFile = compilation.files.find((file) => file.path === "runtime-model.json");
  if (!modelFile) throw new Error("TASK263_RUNTIME_MODEL_MISSING");
  const model = JSON.parse(modelFile.content) as {
    entities?: unknown;
    environmentRequirements?: unknown;
    files?: unknown;
  };
  return sha256Canonical({
    entities: model.entities,
    environmentRequirements: model.environmentRequirements,
    files: model.files,
  });
}

async function request(port: number, path: string, method: string, body?: unknown, raw = false) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    ...(body === undefined ? {} : {
      headers: { "content-type": raw ? "text/plain" : "application/json" },
      body: raw ? String(body) : JSON.stringify(body),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  let responseBody: unknown = null;
  const text = await response.text();
  if (text.length > 0) responseBody = JSON.parse(text) as unknown;
  return { status: response.status, body: responseBody };
}

const postgresFixturesMissing = runtimePostgresUrl === undefined || deployPostgresUrl === undefined
  ? "PostgreSQL CI fixtures not configured"
  : false;

test("TASK-263 preserves explicitly compatible persisted data and external configuration across A to B", { skip: postgresFixturesMissing }, async () => {
  assert.ok(runtimePostgresUrl);
  assert.ok(deployPostgresUrl);

  const compilationA = compileRelease("1.0.0");
  const compilationB = compileRelease("1.1.0");
  const incompatibleB = compileRelease("1.1.0", "number");
  const compatibleIdentity = continuityIdentity(compilationA);
  assert.equal(continuityIdentity(compilationB), compatibleIdentity);
  assert.notEqual(continuityIdentity(incompatibleB), compatibleIdentity);
  assert.equal(continuityIdentity(compileRelease("1.0.0")), compatibleIdentity);
  assert.equal(continuityIdentity(compileRelease("1.1.0")), compatibleIdentity);

  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: compilationA.artifact.artifactHash, files: compilationA.files });
  artifacts.publish({ artifactHash: compilationB.artifact.artifactHash, files: compilationB.files });

  const releases = new ReleaseRegistry();
  const releaseA = releases.publish({
    releaseId: "p13-runtime-compatible-data-config-continuity",
    version: "1.0.0",
    artifact: compilationA.artifact,
    publishedAt: "2026-08-24T21:10:00Z",
  });
  const releaseB = releases.publish({
    releaseId: "p13-runtime-compatible-data-config-continuity",
    version: "1.1.0",
    artifact: compilationB.artifact,
    publishedAt: "2026-08-24T21:11:00Z",
  });

  const storageRoot = await mkdtemp(join(tmpdir(), "system-builder-task-263-storage-"));
  const storage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, "p13_task263_continuity");
  const registry = new DeploymentRegistry(storage);
  const manager = new SingleHostActiveRuntimeOrchestrator(registry);
  const resolver = new InMemorySecretResolver({ "secret://p13/task263/runtime-db": runtimePostgresUrl });
  const profile = environment();
  const processEnvironment = Object.freeze({
    ...unavailableControlPlane,
    [storageEnvironmentName]: storageRoot,
  });

  const promoteInput = (
    release: typeof releaseA,
    compilation: typeof compilationA,
    expectedActiveDeploymentId: string | null,
    minute: number,
  ) => ({
    publishedRelease: release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment: profile,
    secretResolver: resolver,
    processEnvironment,
    expectedActiveDeploymentId,
    startedAt: `2026-08-24T21:${minute.toString().padStart(2, "0")}:01Z`,
    completedAt: `2026-08-24T21:${minute.toString().padStart(2, "0")}:02Z`,
    timeoutMs: 10_000,
  });

  try {
    const a = await manager.promote(promoteInput(releaseA, compilationA, null, 12));
    assert.equal(a.ok, true);
    if (!a.ok || !a.promoted || a.active === null) throw new Error("TASK263_A_NOT_ACTIVE");
    assert.equal(a.decision.outcome, "activated");
    assert.equal((await manager.health(profile.environmentRef)).status, "UP");

    const aPort = a.active.process.port;
    const recordPath = `/entities/${encodeURIComponent(entityRef)}/task-263-continuity-record`;
    const filePath = `/files/${encodeURIComponent(fileRef)}/continuity%2Fproof.txt`;
    const created = await request(aPort, recordPath, "POST", { title: "created-under-a" });
    assert.equal(created.status, 201);
    const written = await request(aPort, filePath, "PUT", "external-config-from-a", true);
    assert.equal(written.status, 200);

    const b = await manager.promote(
      promoteInput(releaseB, compilationB, a.candidateRecord.deploymentId, 13),
    );
    assert.equal(b.ok, true);
    if (!b.ok || !b.promoted || b.active === null) throw new Error("TASK263_B_NOT_ACTIVE");
    assert.equal(b.decision.outcome, "activated");
    assert.equal(b.decision.previousActiveDeploymentId, a.candidateRecord.deploymentId);
    assert.equal(registry.getActive(profile.environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
    assert.equal((await manager.health(profile.environmentRef)).status, "UP");

    const bPort = b.active.process.port;
    const persisted = await request(bPort, recordPath, "GET");
    assert.equal(persisted.status, 200);
    const persistedRecord = persisted.body as { record?: { data?: { title?: string } } };
    assert.equal(persistedRecord.record?.data?.title, "created-under-a");

    const externalConfigFile = await request(bPort, filePath, "GET");
    assert.equal(externalConfigFile.status, 200);
    assert.equal((externalConfigFile.body as { content?: string }).content, "external-config-from-a");

    const updated = await request(bPort, recordPath, "PATCH", { title: "updated-under-b" });
    assert.equal(updated.status, 200);
    const reread = await request(bPort, recordPath, "GET");
    assert.equal(((reread.body as { record?: { data?: { title?: string } } }).record?.data?.title), "updated-under-b");

    const evidence = JSON.stringify({
      compatibility: {
        releaseA: compatibleIdentity,
        releaseB: continuityIdentity(compilationB),
        incompatibleReleaseB: continuityIdentity(incompatibleB),
        incompatibleAcceptedAsCompatible: continuityIdentity(incompatibleB) === compatibleIdentity,
      },
      decisionA: a.decision,
      decisionB: b.decision,
      activeAfterB: registry.getActive(profile.environmentRef),
      healthAfterB: await manager.health(profile.environmentRef),
      externalConfigurationReference: profile.bindings.find((binding) => binding.name === storageBinding)?.reference,
    });
    assert.equal(evidence.includes(runtimePostgresUrl), false);
    assert.equal(evidence.includes(storageRoot), false);
    assert.equal(evidence.includes("builder.internal"), false);
    assert.equal(evidence.includes("observe.internal"), false);
    assert.equal(evidence.includes('"incompatibleAcceptedAsCompatible":true'), false);
  } finally {
    await manager.stopActive(profile.environmentRef);
    await storage.close();
    await rm(storageRoot, { recursive: true, force: true });
  }
});

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
const entityRef = "entity:p13-runtime-continuity-growing-proof";
const fileRef = "files:p13-runtime-continuity-growing-proof";
const storageBinding = "storage:p13-runtime-continuity-growing-proof";
const storageEnvironmentName = "P13_TASK_266_STORAGE_ROOT";
const unavailableControlPlane = Object.freeze({
  SYSTEM_BUILDER_URL: "http://127.0.0.1:1",
  OBSERVE_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
});

type RuntimeVersion = "1.0.0" | "1.1.0" | "1.2.0";

function assemblyPlan() {
  const payload = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:p13:runtime-continuity-growing-proof",
    components: [],
    sourceRefs: ["source:p13:runtime-continuity-growing-proof"],
  };
  return { ...payload, contentHash: sha256Canonical(payload) };
}

function compileRelease(runtimeVersion: RuntimeVersion) {
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
      entities: [{ id: entityRef, fields: [{ name: "title", type: "string", required: true }] }],
      actions: [],
      processes: [],
      environmentRequirements: [{ name: storageBinding, kind: "storage", required: true }],
      files: [{ id: fileRef, bindingRef: storageBinding, operations: ["put", "get", "delete"] }],
    },
  });
}

function environment(runtimeVersions: readonly RuntimeVersion[] = ["1.0.0", "1.1.0", "1.2.0"]): EnvironmentProfile {
  return {
    kind: "EnvironmentProfile",
    environmentRef: "environment:p13-runtime-continuity-growing-proof",
    runtimeVersions,
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference", reference: "secret://p13/task266/runtime-db" },
      { name: storageBinding, kind: "config", reference: `env://${storageEnvironmentName}`, requirementKind: "storage" },
    ],
  };
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
  const text = await response.text();
  return {
    status: response.status,
    body: text.length === 0 ? null : JSON.parse(text) as unknown,
  };
}

function continuityIdentity(compilation: ReturnType<typeof compileRelease>): string {
  const modelFile = compilation.files.find((file) => file.path === "runtime-model.json");
  if (!modelFile) throw new Error("TASK266_RUNTIME_MODEL_MISSING");
  const model = JSON.parse(modelFile.content) as { entities?: unknown; environmentRequirements?: unknown; files?: unknown };
  return sha256Canonical({ entities: model.entities, environmentRequirements: model.environmentRequirements, files: model.files });
}

const postgresFixturesMissing = runtimePostgresUrl === undefined || deployPostgresUrl === undefined
  ? "PostgreSQL CI fixtures not configured"
  : false;

test("TASK-266 certifies complete autonomous Runtime A to B to A continuity with fail-closed recovery", { skip: postgresFixturesMissing }, async () => {
  assert.ok(runtimePostgresUrl);
  assert.ok(deployPostgresUrl);

  const compilationA = compileRelease("1.0.0");
  const compilationB = compileRelease("1.1.0");
  const compilationC = compileRelease("1.2.0");
  const continuityHash = continuityIdentity(compilationA);
  assert.equal(continuityIdentity(compilationB), continuityHash);
  assert.equal(continuityIdentity(compilationC), continuityHash);

  const artifacts = new InMemoryArtifactPayloadRepository();
  for (const compilation of [compilationA, compilationB, compilationC]) {
    artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  }

  const releases = new ReleaseRegistry();
  const releaseId = "p13-runtime-continuity-growing-proof";
  const releaseA = releases.publish({ releaseId, version: "1.0.0", artifact: compilationA.artifact, publishedAt: "2026-08-24T21:40:00Z" });
  const releaseB = releases.publish({ releaseId, version: "1.1.0", artifact: compilationB.artifact, publishedAt: "2026-08-24T21:41:00Z" });
  const releaseC = releases.publish({ releaseId, version: "1.2.0", artifact: compilationC.artifact, publishedAt: "2026-08-24T21:42:00Z" });

  const storageRoot = await mkdtemp(join(tmpdir(), "system-builder-task-266-storage-"));
  const storage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, "p13_task266_growing_proof");
  const registry = new DeploymentRegistry(storage);
  const manager = new SingleHostActiveRuntimeOrchestrator(registry);
  const resolver = new InMemorySecretResolver({ "secret://p13/task266/runtime-db": runtimePostgresUrl });
  const missingResolver = new InMemorySecretResolver({});
  const fullEnvironment = environment();
  const processEnvironment = Object.freeze({ ...unavailableControlPlane, [storageEnvironmentName]: storageRoot });

  const promoteInput = (
    release: typeof releaseA,
    compilation: typeof compilationA,
    expectedActiveDeploymentId: string | null,
    minute: number,
    options: Readonly<{
      environment?: EnvironmentProfile;
      secretResolver?: InMemorySecretResolver;
    }> = {},
  ) => ({
    publishedRelease: release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment: options.environment ?? fullEnvironment,
    secretResolver: options.secretResolver ?? resolver,
    processEnvironment,
    expectedActiveDeploymentId,
    startedAt: `2026-08-24T21:${minute.toString().padStart(2, "0")}:01Z`,
    completedAt: `2026-08-24T21:${minute.toString().padStart(2, "0")}:02Z`,
    timeoutMs: 10_000,
  });

  try {
    const a = await manager.promote(promoteInput(releaseA, compilationA, null, 43));
    assert.equal(a.ok, true);
    if (!a.ok || !a.promoted || a.active === null) throw new Error("TASK266_A_NOT_ACTIVE");
    const activeAId = a.candidateRecord.deploymentId;
    assert.equal((await manager.health(fullEnvironment.environmentRef)).status, "UP");

    const recordPath = `/entities/${encodeURIComponent(entityRef)}/task-266-state`;
    const filePath = `/files/${encodeURIComponent(fileRef)}/continuity%2Ftask-266.txt`;
    assert.equal((await request(a.active.process.port, recordPath, "POST", { title: "state-created-under-a" })).status, 201);
    assert.equal((await request(a.active.process.port, filePath, "PUT", "config-backed-file-under-a", true)).status, 200);

    const b = await manager.promote(promoteInput(releaseB, compilationB, activeAId, 44));
    assert.equal(b.ok, true);
    if (!b.ok || !b.promoted || b.active === null) throw new Error("TASK266_B_NOT_ACTIVE");
    const activeBId = b.candidateRecord.deploymentId;
    assert.equal(b.decision.previousActiveDeploymentId, activeAId);
    assert.equal(registry.getActive(fullEnvironment.environmentRef)?.deploymentId, activeBId);
    assert.equal((await manager.health(fullEnvironment.environmentRef)).status, "UP");

    const stateUnderB = await request(b.active.process.port, recordPath, "GET");
    assert.equal(stateUnderB.status, 200);
    assert.equal(((stateUnderB.body as { record?: { data?: { title?: string } } }).record?.data?.title), "state-created-under-a");
    const fileUnderB = await request(b.active.process.port, filePath, "GET");
    assert.equal(fileUnderB.status, 200);
    assert.equal((fileUnderB.body as { content?: string }).content, "config-backed-file-under-a");

    const incompatible = await manager.promote(
      promoteInput(releaseC, compilationC, activeBId, 45, { environment: environment(["1.0.0", "1.1.0"]) }),
    );
    assert.equal(incompatible.ok, false);
    if (incompatible.ok) throw new Error("TASK266_INCOMPATIBLE_ACCEPTED");
    assert.equal(incompatible.outcome, "candidate-failed");
    assert.equal(incompatible.diagnostic.code, "RUNTIME_INCOMPATIBLE");
    assert.equal(incompatible.active?.deploymentId, activeBId);
    assert.equal(registry.getActive(fullEnvironment.environmentRef)?.deploymentId, activeBId);

    const failed = await manager.promote(
      promoteInput(releaseC, compilationC, activeBId, 46, { secretResolver: missingResolver }),
    );
    assert.equal(failed.ok, false);
    if (failed.ok) throw new Error("TASK266_FAILED_CANDIDATE_ACCEPTED");
    assert.equal(failed.outcome, "candidate-failed");
    assert.equal(failed.diagnostic.code, "SECRET_RESOLUTION_FAILED");
    assert.equal(failed.active?.deploymentId, activeBId);
    assert.equal(registry.getActive(fullEnvironment.environmentRef)?.deploymentId, activeBId);

    const staleInput = promoteInput(releaseC, compilationC, activeAId, 47);
    const stale = await manager.promote(staleInput);
    assert.equal(stale.ok, true);
    if (!stale.ok) throw new Error("TASK266_STALE_PATH_FAILED");
    assert.equal(stale.promoted, false);
    assert.equal(stale.decision.outcome, "stale-active");
    assert.equal(stale.decision.resultingActiveDeploymentId, activeBId);
    assert.equal(stale.active?.deploymentId, activeBId);
    assert.equal(stale.candidateFinal.state, "stopped");
    assert.equal((await manager.health(fullEnvironment.environmentRef)).status, "UP");

    const retainedReleaseA = releases.get(releaseId, "1.0.0");
    assert.ok(retainedReleaseA);
    assert.equal(retainedReleaseA.artifactHash, releaseA.artifactHash);
    const restoredA = await manager.promote(
      promoteInput(retainedReleaseA, compilationA, activeBId, 48),
    );
    assert.equal(restoredA.ok, true);
    if (!restoredA.ok || !restoredA.promoted || restoredA.active === null) throw new Error("TASK266_A_RESTORE_NOT_ACTIVE");
    assert.equal(restoredA.decision.outcome, "activated");
    assert.equal(restoredA.decision.previousActiveDeploymentId, activeBId);
    assert.equal(restoredA.candidateRecord.releaseHash, releaseA.artifactHash);
    assert.equal(restoredA.active.process.runtimeVersion, "1.0.0");
    assert.equal(registry.getActive(fullEnvironment.environmentRef)?.deploymentId, restoredA.candidateRecord.deploymentId);
    assert.equal((await manager.health(fullEnvironment.environmentRef)).status, "UP");

    const stateAfterRestore = await request(restoredA.active.process.port, recordPath, "GET");
    assert.equal(stateAfterRestore.status, 200);
    assert.equal(((stateAfterRestore.body as { record?: { data?: { title?: string } } }).record?.data?.title), "state-created-under-a");
    const fileAfterRestore = await request(restoredA.active.process.port, filePath, "GET");
    assert.equal(fileAfterRestore.status, 200);
    assert.equal((fileAfterRestore.body as { content?: string }).content, "config-backed-file-under-a");

    const history = registry.list();
    for (const deploymentId of [a.candidateRecord.deploymentId, b.candidateRecord.deploymentId, stale.candidateRecord.deploymentId, restoredA.candidateRecord.deploymentId]) {
      assert.equal(history.some((record) => record.deploymentId === deploymentId), true);
    }

    const evidence = JSON.stringify({
      continuityHash,
      releaseA: retainedReleaseA,
      releaseB,
      initialA: a.decision,
      promotedB: b.decision,
      incompatibleDiagnostic: incompatible.diagnostic,
      failedDiagnostic: failed.diagnostic,
      staleDecision: stale.decision,
      restoredA: restoredA.decision,
      activeAfterRestore: registry.getActive(fullEnvironment.environmentRef),
      history,
      externalConfigurationReference: fullEnvironment.bindings.find((binding) => binding.name === storageBinding)?.reference,
      healthAfterRestore: await manager.health(fullEnvironment.environmentRef),
    });
    assert.equal(evidence.includes(runtimePostgresUrl), false);
    assert.equal(evidence.includes(storageRoot), false);
    assert.equal(evidence.includes("builder.internal"), false);
    assert.equal(evidence.includes("observe.internal"), false);
    assert.equal(continuityIdentity(compileRelease("1.0.0")), continuityHash);
    assert.equal(continuityIdentity(compileRelease("1.1.0")), continuityHash);
  } finally {
    await manager.stopActive(fullEnvironment.environmentRef);
    await storage.close();
    await rm(storageRoot, { recursive: true, force: true });
  }
});

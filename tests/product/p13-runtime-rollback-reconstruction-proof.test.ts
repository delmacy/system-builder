import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileAutonomousRuntimeModelBundle } from "../../packages/compiler/autonomous-runtime-model-bundle.js";
import { SingleHostActiveRuntimeOrchestrator } from "../../packages/deploy/active-runtime.js";
import { DeploymentRegistry } from "../../packages/deploy/index.js";
import { PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const runtimePostgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const deployPostgresUrl = process.env.SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL;
const entityRef = "entity:p13-runtime-restoration-ticket";
const unavailableControlPlane = Object.freeze({
  SYSTEM_BUILDER_URL: "http://127.0.0.1:1",
  OBSERVE_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
});

function assemblyPlan() {
  const payload = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:p13:runtime-restoration",
    components: [],
    sourceRefs: ["source:p13:runtime-restoration"],
  };
  return { ...payload, contentHash: sha256Canonical(payload) };
}

function compileRelease(runtimeVersion: "1.0.0" | "1.1.0") {
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
    },
  });
}

function environment() {
  return {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:p13-runtime-restoration",
    runtimeVersions: ["1.0.0", "1.1.0"],
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p13/task264/runtime-db" },
    ],
  };
}

async function request(port: number, path: string, method: string, body?: unknown) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    ...(body === undefined ? {} : {
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const text = await response.text();
  return {
    status: response.status,
    body: text.length === 0 ? null : JSON.parse(text) as unknown,
  };
}

const postgresFixturesMissing = runtimePostgresUrl === undefined || deployPostgresUrl === undefined
  ? "PostgreSQL CI fixtures not configured"
  : false;

test("TASK-264 restores exact Runtime A through existing deployment authority after B", { skip: postgresFixturesMissing }, async () => {
  assert.ok(runtimePostgresUrl);
  assert.ok(deployPostgresUrl);

  const compilationA = compileRelease("1.0.0");
  const compilationB = compileRelease("1.1.0");
  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: compilationA.artifact.artifactHash, files: compilationA.files });
  artifacts.publish({ artifactHash: compilationB.artifact.artifactHash, files: compilationB.files });

  const releases = new ReleaseRegistry();
  const releaseId = "p13-runtime-restoration";
  const releaseA = releases.publish({
    releaseId,
    version: "1.0.0",
    artifact: compilationA.artifact,
    publishedAt: "2026-08-24T21:20:00Z",
  });
  const releaseB = releases.publish({
    releaseId,
    version: "1.1.0",
    artifact: compilationB.artifact,
    publishedAt: "2026-08-24T21:21:00Z",
  });

  const storage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, "p13_task264_restore");
  const registry = new DeploymentRegistry(storage);
  const manager = new SingleHostActiveRuntimeOrchestrator(registry);
  const resolver = new InMemorySecretResolver({ "secret://p13/task264/runtime-db": runtimePostgresUrl });
  const profile = environment();

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
    processEnvironment: unavailableControlPlane,
    expectedActiveDeploymentId,
    startedAt: `2026-08-24T21:${minute.toString().padStart(2, "0")}:01Z`,
    completedAt: `2026-08-24T21:${minute.toString().padStart(2, "0")}:02Z`,
    timeoutMs: 10_000,
  });

  try {
    const a = await manager.promote(promoteInput(releaseA, compilationA, null, 22));
    assert.equal(a.ok, true);
    if (!a.ok || !a.promoted || a.active === null) throw new Error("TASK264_A_NOT_ACTIVE");
    assert.equal(a.decision.outcome, "activated");

    const recordPath = `/entities/${encodeURIComponent(entityRef)}/task-264-compatible-state`;
    assert.equal((await request(a.active.process.port, recordPath, "POST", { title: "state-from-a" })).status, 201);

    const b = await manager.promote(
      promoteInput(releaseB, compilationB, a.candidateRecord.deploymentId, 23),
    );
    assert.equal(b.ok, true);
    if (!b.ok || !b.promoted || b.active === null) throw new Error("TASK264_B_NOT_ACTIVE");
    assert.equal(b.decision.outcome, "activated");
    assert.equal(b.decision.previousActiveDeploymentId, a.candidateRecord.deploymentId);
    assert.equal(registry.getActive(profile.environmentRef)?.deploymentId, b.candidateRecord.deploymentId);

    const stateUnderB = await request(b.active.process.port, recordPath, "GET");
    assert.equal(stateUnderB.status, 200);
    assert.equal(
      ((stateUnderB.body as { record?: { data?: { title?: string } } }).record?.data?.title),
      "state-from-a",
    );

    const retainedReleaseA = releases.get(releaseId, "1.0.0");
    assert.ok(retainedReleaseA);
    assert.equal(retainedReleaseA.artifactHash, releaseA.artifactHash);
    assert.equal(retainedReleaseA.artifactRef, releaseA.artifactRef);
    assert.equal(retainedReleaseA.version, releaseA.version);
    assert.equal(retainedReleaseA.releaseId, releaseA.releaseId);

    const restored = await manager.promote(
      promoteInput(retainedReleaseA, compilationA, b.candidateRecord.deploymentId, 24),
    );
    assert.equal(restored.ok, true);
    if (!restored.ok || !restored.promoted || restored.active === null) throw new Error("TASK264_A_RESTORE_NOT_ACTIVE");
    assert.equal(restored.decision.outcome, "activated");
    assert.equal(restored.decision.previousActiveDeploymentId, b.candidateRecord.deploymentId);
    assert.equal(restored.candidateRecord.releaseHash, releaseA.artifactHash);
    assert.equal(restored.candidateRecord.publishedReleaseRef, `${releaseA.releaseId}@${releaseA.version}`);
    assert.equal(registry.getActive(profile.environmentRef)?.deploymentId, restored.candidateRecord.deploymentId);
    assert.equal((await manager.health(profile.environmentRef)).status, "UP");
    assert.equal(restored.active.process.runtimeVersion, "1.0.0");

    const stateAfterRestore = await request(restored.active.process.port, recordPath, "GET");
    assert.equal(stateAfterRestore.status, 200);
    assert.equal(
      ((stateAfterRestore.body as { record?: { data?: { title?: string } } }).record?.data?.title),
      "state-from-a",
    );

    const history = registry.list();
    assert.equal(history.some((record) => record.deploymentId === a.candidateRecord.deploymentId), true);
    assert.equal(history.some((record) => record.deploymentId === b.candidateRecord.deploymentId), true);
    assert.equal(history.some((record) => record.deploymentId === restored.candidateRecord.deploymentId), true);
    assert.notEqual(restored.candidateRecord.deploymentId, a.candidateRecord.deploymentId);

    const evidence = JSON.stringify({
      releaseA: retainedReleaseA,
      releaseB,
      initialA: a.decision,
      promotedB: b.decision,
      restoredA: restored.decision,
      deploymentHistory: history,
      activeAfterRestore: registry.getActive(profile.environmentRef),
      healthAfterRestore: await manager.health(profile.environmentRef),
    });
    assert.equal(evidence.includes(runtimePostgresUrl), false);
    assert.equal(evidence.includes("builder.internal"), false);
    assert.equal(evidence.includes("observe.internal"), false);
  } finally {
    await manager.stopActive(profile.environmentRef);
    await storage.close();
  }
});

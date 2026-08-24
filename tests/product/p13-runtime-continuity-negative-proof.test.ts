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
    systemDefinitionRef: "system-definition:p13:runtime-continuity-negative",
    components: [],
    sourceRefs: ["source:p13:runtime-continuity-negative"],
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
      entities: [{ id: "entity:p13-runtime-continuity-negative", fields: [{ name: "title", type: "string", required: true }] }],
      actions: [],
      processes: [],
    },
  });
}

function environment(runtimeVersions: readonly RuntimeVersion[] = ["1.0.0", "1.1.0", "1.2.0"]) {
  return {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:p13-runtime-continuity-negative",
    runtimeVersions,
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p13/task265/runtime-db" },
    ],
  };
}

const postgresFixturesMissing = runtimePostgresUrl === undefined || deployPostgresUrl === undefined
  ? "PostgreSQL CI fixtures not configured"
  : false;

test("TASK-265 retains last-known-good Runtime for incompatible, failed and stale candidates", { skip: postgresFixturesMissing }, async () => {
  assert.ok(runtimePostgresUrl);
  assert.ok(deployPostgresUrl);

  const compilationA = compileRelease("1.0.0");
  const compilationB = compileRelease("1.1.0");
  const compilationC = compileRelease("1.2.0");
  const artifacts = new InMemoryArtifactPayloadRepository();
  for (const compilation of [compilationA, compilationB, compilationC]) {
    artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  }

  const releases = new ReleaseRegistry();
  const releaseId = "p13-runtime-continuity-negative";
  const releaseA = releases.publish({ releaseId, version: "1.0.0", artifact: compilationA.artifact, publishedAt: "2026-08-24T21:30:00Z" });
  const releaseB = releases.publish({ releaseId, version: "1.1.0", artifact: compilationB.artifact, publishedAt: "2026-08-24T21:31:00Z" });
  const releaseC = releases.publish({ releaseId, version: "1.2.0", artifact: compilationC.artifact, publishedAt: "2026-08-24T21:32:00Z" });

  const storage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, "p13_task265_negative");
  const registry = new DeploymentRegistry(storage);
  const manager = new SingleHostActiveRuntimeOrchestrator(registry);
  const resolver = new InMemorySecretResolver({ "secret://p13/task265/runtime-db": runtimePostgresUrl });
  const missingResolver = new InMemorySecretResolver({});
  const fullEnvironment = environment();

  const promoteInput = (
    release: typeof releaseA,
    compilation: typeof compilationA,
    expectedActiveDeploymentId: string | null,
    minute: number,
    options: Readonly<{
      environment?: ReturnType<typeof environment>;
      secretResolver?: InMemorySecretResolver;
    }> = {},
  ) => ({
    publishedRelease: release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment: options.environment ?? fullEnvironment,
    secretResolver: options.secretResolver ?? resolver,
    processEnvironment: unavailableControlPlane,
    expectedActiveDeploymentId,
    startedAt: `2026-08-24T21:${minute.toString().padStart(2, "0")}:01Z`,
    completedAt: `2026-08-24T21:${minute.toString().padStart(2, "0")}:02Z`,
    timeoutMs: 10_000,
  });

  try {
    const a = await manager.promote(promoteInput(releaseA, compilationA, null, 33));
    assert.equal(a.ok, true);
    if (!a.ok || !a.promoted || a.active === null) throw new Error("TASK265_A_NOT_ACTIVE");
    const activeAId = a.candidateRecord.deploymentId;
    assert.equal((await manager.health(fullEnvironment.environmentRef)).status, "UP");

    const incompatibleEnvironment = environment(["1.0.0", "1.1.0"]);
    const incompatible = await manager.promote(
      promoteInput(releaseC, compilationC, activeAId, 34, { environment: incompatibleEnvironment }),
    );
    assert.equal(incompatible.ok, false);
    if (incompatible.ok) throw new Error("TASK265_INCOMPATIBLE_UNEXPECTEDLY_ACCEPTED");
    assert.equal(incompatible.outcome, "candidate-failed");
    assert.equal(incompatible.diagnostic.code, "RUNTIME_INCOMPATIBLE");
    assert.equal(incompatible.active?.deploymentId, activeAId);
    assert.equal(registry.getActive(fullEnvironment.environmentRef)?.deploymentId, activeAId);
    assert.equal((await manager.health(fullEnvironment.environmentRef)).status, "UP");

    const failed = await manager.promote(
      promoteInput(releaseC, compilationC, activeAId, 35, { secretResolver: missingResolver }),
    );
    assert.equal(failed.ok, false);
    if (failed.ok) throw new Error("TASK265_FAILED_CANDIDATE_UNEXPECTEDLY_ACCEPTED");
    assert.equal(failed.outcome, "candidate-failed");
    assert.equal(failed.diagnostic.code, "SECRET_RESOLUTION_FAILED");
    assert.equal(failed.active?.deploymentId, activeAId);
    assert.equal(registry.getActive(fullEnvironment.environmentRef)?.deploymentId, activeAId);
    assert.equal((await manager.health(fullEnvironment.environmentRef)).status, "UP");

    const b = await manager.promote(promoteInput(releaseB, compilationB, activeAId, 36));
    assert.equal(b.ok, true);
    if (!b.ok || !b.promoted || b.active === null) throw new Error("TASK265_B_NOT_ACTIVE");
    const activeBId = b.candidateRecord.deploymentId;
    assert.equal(registry.getActive(fullEnvironment.environmentRef)?.deploymentId, activeBId);
    assert.equal((await manager.health(fullEnvironment.environmentRef)).status, "UP");

    const staleInput = promoteInput(releaseC, compilationC, activeAId, 37);
    const stale = await manager.promote(staleInput);
    assert.equal(stale.ok, true);
    if (!stale.ok) throw new Error("TASK265_STALE_PATH_FAILED_BEFORE_AUTHORITY");
    assert.equal(stale.promoted, false);
    assert.equal(stale.decision.outcome, "stale-active");
    assert.equal(stale.decision.previousActiveDeploymentId, activeBId);
    assert.equal(stale.decision.resultingActiveDeploymentId, activeBId);
    assert.equal(stale.active?.deploymentId, activeBId);
    assert.equal(stale.candidateFinal.state, "stopped");
    assert.equal(registry.getActive(fullEnvironment.environmentRef)?.deploymentId, activeBId);
    assert.equal((await manager.health(fullEnvironment.environmentRef)).status, "UP");

    const staleAgain = await manager.promote(staleInput);
    assert.equal(staleAgain.ok, true);
    if (!staleAgain.ok) throw new Error("TASK265_STALE_REPLAY_FAILED_BEFORE_AUTHORITY");
    assert.equal(staleAgain.promoted, false);
    assert.deepEqual(staleAgain.decision, stale.decision);
    assert.equal(staleAgain.active?.deploymentId, activeBId);
    assert.equal(registry.getActive(fullEnvironment.environmentRef)?.deploymentId, activeBId);

    const history = registry.list();
    assert.equal(history.some((record) => record.deploymentId === a.candidateRecord.deploymentId), true);
    assert.equal(history.some((record) => record.deploymentId === b.candidateRecord.deploymentId), true);
    assert.equal(history.some((record) => record.deploymentId === stale.candidateRecord.deploymentId), true);

    const evidence = JSON.stringify({
      incompatibleDiagnostic: incompatible.diagnostic,
      failedDiagnostic: failed.diagnostic,
      staleDecision: stale.decision,
      staleReplayDecision: staleAgain.decision,
      activeAfterNegatives: registry.getActive(fullEnvironment.environmentRef),
      history,
      health: await manager.health(fullEnvironment.environmentRef),
    });
    assert.equal(evidence.includes(runtimePostgresUrl), false);
    assert.equal(evidence.includes("builder.internal"), false);
    assert.equal(evidence.includes("observe.internal"), false);
  } finally {
    await manager.stopActive(fullEnvironment.environmentRef);
    await storage.close();
  }
});

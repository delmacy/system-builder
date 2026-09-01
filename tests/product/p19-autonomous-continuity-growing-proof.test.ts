import assert from "node:assert/strict";
import test from "node:test";

import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease, type CompilerAssemblyPlan, type CompilerValidationEvidence } from "../../packages/compiler/index.js";
import { FACTORY_JOURNEY_CONTRACT_VERSION, FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION } from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { SingleHostActiveRuntimeOrchestrator } from "../../packages/deploy/active-runtime.js";
import { DeploymentRegistry } from "../../packages/deploy/index.js";
import { PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { DeploymentObservation, publish, type PublishObserver } from "../../packages/observe/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";
import { invokeRuntimeMaterializationHandoff, preflightRuntimeMaterializationHandoff } from "../../scripts/runtime-materialization-handoff.js";

const deployPostgresUrl = process.env.SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL;
const postgresFixtureMissing = deployPostgresUrl === undefined ? "PostgreSQL CI fixture not configured" : false;
const builderOff = Object.freeze({
  SYSTEM_BUILDER_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_FACTORY_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_BOOTSTRAP_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
});

function canonicalFactoryInput(releaseVersion: string, publishedAt: string) {
  const revision = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process-revision:orders:v1",
    revisionNumber: 1,
    previousRevisionRef: null,
  };
  const analysis = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis" as const, identityRef: "analysis:orders:v1" };
  const definitionIdentity = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition" as const, identityRef: "system-definition:orders:v1" };
  const processRevision = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision" as const, processRevision: revision };

  return {
    journeyBinding: {
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      journey: {
        contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
        stages: [
          { kind: "approved-process", identityRef: revision.revisionRef, provenanceRef: revision.artifactRef },
          { kind: "analysis-definition", identityRef: analysis.identityRef, provenanceRef: revision.revisionRef },
          { kind: "capability-assembly", identityRef: "assembly:pending", provenanceRef: definitionIdentity.identityRef },
          { kind: "validation", identityRef: "validation:pending", provenanceRef: "assembly:pending" },
          { kind: "compiler-release", identityRef: "release:pending", provenanceRef: "validation:pending" },
          { kind: "deployment", identityRef: "deployment:pending", provenanceRef: "release:pending" },
        ],
      },
      lineage: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        processRevision,
        analysis,
        systemDefinition: definitionIdentity,
        hops: [
          { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision-to-analysis" as const, from: processRevision, to: analysis },
          { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis-to-system-definition" as const, from: analysis, to: definitionIdentity },
        ],
      },
    },
    definition: {
      definition: "SystemDefinition" as const,
      analysisRef: analysis.identityRef,
      recipeRef: revision.revisionRef,
      capabilities: [{ id: "orders", capability: "orders", requirementRefs: ["REQ-1"] }],
    },
    catalogEntries: [{ capability: "orders", provider: "builtin", version: "1.0.0" }],
    recipeTraceability: { modules: [{ requirementIds: ["REQ-1"] }], rules: [], responsibilities: [], exceptions: [] },
    analysisTraceability: { findings: [{ recipeRequirementRefs: ["REQ-1"] }] },
    definitionTraceability: {
      entities: [], processes: [], actions: [],
      capabilities: [{ capability: "orders", requirementRefs: ["REQ-1"] }],
      views: [], policies: [], integrations: [],
    },
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    releaseId: "orders-system",
    releaseVersion,
    publishedAt,
    environment: {
      kind: "EnvironmentProfile" as const,
      environmentRef: "environment:p19:growing-continuity",
      runtimeVersions: ["1.0.0"],
      bindings: [],
    },
    acceptanceChecks: [{ name: "factory-e2e", pass: true }],
    startedAt: "2026-09-01T10:20:00.000Z",
    completedAt: "2026-09-01T10:21:00.000Z",
  };
}

function buildCanonicalRelease(releaseVersion: string, publishedAt: string) {
  const bootstrap = executeFactoryOperatorBootstrap({
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.0.0", npmVersion: "11.0.0", factoryE2EAvailable: true },
    config: { inputPath: `fixture://p19-growing-continuity-${releaseVersion}` },
    factoryInput: canonicalFactoryInput(releaseVersion, publishedAt),
  });
  assert.equal(bootstrap.ok, true);
  if (!bootstrap.ok) throw new Error("TASK449_BOOTSTRAP_FAILED");

  const assemblyPlan = bootstrap.result.assemblyPlan;
  const validationEvidence = bootstrap.result.validationEvidence;
  if (typeof assemblyPlan !== "object" || assemblyPlan === null || !("kind" in assemblyPlan) || assemblyPlan.kind !== "AssemblyPlan") throw new Error("TASK449_INVALID_ASSEMBLY_PLAN");
  if (typeof validationEvidence !== "object" || validationEvidence === null || !("kind" in validationEvidence) || validationEvidence.kind !== "ValidationEvidence") throw new Error("TASK449_INVALID_VALIDATION_EVIDENCE");

  const compilation = compileSyntheticRelease({
    assemblyPlan: assemblyPlan as CompilerAssemblyPlan,
    validationEvidence: validationEvidence as CompilerValidationEvidence,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  });
  assert.deepEqual(compilation.artifact, bootstrap.result.releaseArtifact);
  return { bootstrap, compilation };
}

test("TASK-449 composes Builder-off A, fail-open observation, restoration, B activation and exact A restoration", { skip: postgresFixtureMissing }, async () => {
  assert.ok(deployPostgresUrl);
  const secret = "task-449-secret-must-not-leak";
  const canonicalA = buildCanonicalRelease("0.0.1", "2026-09-01T10:15:00.000Z");
  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: canonicalA.compilation.artifact.artifactHash, files: canonicalA.compilation.files });

  const environment = {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:p19:growing-continuity",
    runtimeVersions: ["1.0.0"],
    bindings: [{ name: "DB_PASSWORD", kind: "secret-reference" as const, reference: "secret://db-password" }],
  };
  const resolver = new InMemorySecretResolver({ "secret://db-password": secret });

  const builderOffA = await invokeRuntimeMaterializationHandoff({
    bootstrap: canonicalA.bootstrap,
    environment,
    artifactPayloadReader: artifacts,
    secretResolver: resolver,
    processEnvironment: builderOff,
    timeoutMs: 2_000,
  });
  assert.equal(builderOffA.deploy.ok, true);
  if (!builderOffA.deploy.ok) throw new Error("TASK449_A_BUILDER_OFF_FAILED");
  assert.equal(builderOffA.deploy.health.status, "UP");
  assert.equal(builderOffA.artifactHash, canonicalA.compilation.artifact.artifactHash);

  const restored = preflightRuntimeMaterializationHandoff({
    bootstrap: canonicalA.bootstrap,
    environment,
    artifactPayloadReader: artifacts,
  });
  assert.equal(restored.releaseArtifact.artifactHash, builderOffA.artifactHash);
  assert.equal(restored.deploymentRecord.publishedReleaseRef, builderOffA.publishedReleaseRef);
  assert.equal(restored.environment.environmentRef, builderOffA.deploy.health.environmentRef);

  const observation = DeploymentObservation.fromDeploymentRecord(restored.deploymentRecord);
  let observeAttempts = 0;
  const unavailableObserve: PublishObserver = {
    deliver: async () => {
      observeAttempts += 1;
      throw new Error(`observe unavailable ${secret}`);
    },
  };
  const observeResult = await publish(observation, unavailableObserve);
  assert.equal(observeAttempts, 1);
  assert.equal(observeResult.ok, false);
  if (observeResult.ok) throw new Error("TASK449_OBSERVE_EXPECTED_FAIL_OPEN");
  assert.equal(observeResult.outcome, "channel-failed");
  assert.equal(builderOffA.deploy.health.status, "UP");

  const canonicalB = buildCanonicalRelease("0.0.2", "2026-09-01T10:25:00.000Z");
  artifacts.publish({ artifactHash: canonicalB.compilation.artifact.artifactHash, files: canonicalB.compilation.files });

  const releases = new ReleaseRegistry();
  const releaseA = releases.publish({ releaseId: "orders-system", version: "0.0.1", artifact: canonicalA.compilation.artifact, publishedAt: "2026-09-01T10:15:00.000Z" });
  const releaseB = releases.publish({ releaseId: "orders-system", version: "0.0.2", artifact: canonicalB.compilation.artifact, publishedAt: "2026-09-01T10:25:00.000Z" });
  assert.equal(releaseA.artifactHash, restored.releaseArtifact.artifactHash);

  const storage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, "p19_task449_growing_continuity");
  const registry = new DeploymentRegistry(storage);
  const manager = new SingleHostActiveRuntimeOrchestrator(registry);
  const promoteInput = (release: typeof releaseA, compilation: typeof canonicalA.compilation, expectedActiveDeploymentId: string | null, minute: number) => ({
    publishedRelease: release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment,
    secretResolver: resolver,
    processEnvironment: builderOff,
    expectedActiveDeploymentId,
    startedAt: `2026-09-01T10:${minute.toString().padStart(2, "0")}:01.000Z`,
    completedAt: `2026-09-01T10:${minute.toString().padStart(2, "0")}:02.000Z`,
    timeoutMs: 10_000,
  });

  try {
    const a = await manager.promote(promoteInput(releaseA, canonicalA.compilation, null, 30));
    assert.equal(a.ok, true);
    if (!a.ok || !a.promoted || a.active === null) throw new Error("TASK449_A_NOT_ACTIVE");
    const activeAId = a.candidateRecord.deploymentId;
    assert.equal((await manager.health(environment.environmentRef)).status, "UP");

    const staleB = await manager.promote(promoteInput(releaseB, canonicalB.compilation, "deployment:stale-predecessor", 31));
    assert.equal(staleB.ok, true);
    assert.equal(staleB.promoted, false);
    assert.equal(staleB.decision.outcome, "stale-active");
    assert.equal(registry.getActive(environment.environmentRef)?.deploymentId, activeAId);

    const b = await manager.promote(promoteInput(releaseB, canonicalB.compilation, activeAId, 32));
    assert.equal(b.ok, true);
    if (!b.ok || !b.promoted || b.active === null) throw new Error("TASK449_B_NOT_ACTIVE");
    assert.equal(b.candidateRecord.publishedReleaseRef, "orders-system@0.0.2");
    assert.equal((await manager.health(environment.environmentRef)).status, "UP");

    const retainedA = releases.get("orders-system", "0.0.1");
    assert.ok(retainedA);
    assert.equal(retainedA.artifactHash, releaseA.artifactHash);
    const restoredA = await manager.promote(promoteInput(retainedA, canonicalA.compilation, b.candidateRecord.deploymentId, 33));
    assert.equal(restoredA.ok, true);
    if (!restoredA.ok || !restoredA.promoted || restoredA.active === null) throw new Error("TASK449_A_RESTORE_NOT_ACTIVE");
    assert.equal(restoredA.candidateRecord.releaseHash, releaseA.artifactHash);
    assert.equal(restoredA.candidateRecord.publishedReleaseRef, "orders-system@0.0.1");
    assert.equal((await manager.health(environment.environmentRef)).status, "UP");

    const evidence = JSON.stringify({ builderOffA, restored, observation, observeResult, a, staleB, b, restoredA, history: registry.list() });
    assert.equal(evidence.includes(secret), false);
    assert.equal(evidence.includes(canonicalA.compilation.artifact.artifactHash), true);
    assert.equal(evidence.includes(canonicalB.compilation.artifact.artifactHash), true);
  } finally {
    await manager.stopActive(environment.environmentRef);
    await storage.close();
  }
});

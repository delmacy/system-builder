import assert from "node:assert/strict";
import test from "node:test";
import { PostgresArtifactPayloadRepository } from "../../packages/artifact-store/postgres.js";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { PostgresCatalogRecordStorage } from "../../packages/catalog/postgres.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { SingleHostActiveRuntimeOrchestrator } from "../../packages/deploy/active-runtime.js";
import { DeploymentRegistry, dryRunDeploy } from "../../packages/deploy/index.js";
import { PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";
import { SingleHostRuntimeReconciler } from "../../packages/deploy/runtime-reconciliation.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { PostgresReleaseRecordStorage } from "../../packages/release/postgres.js";
import { validateTraceability } from "../../packages/validation/index.js";
import {
  factoryAnalysis,
  factoryCatalogRecords,
  factoryEnvironmentSchema,
  factoryRecipe,
  factorySystemDefinition,
} from "./fixtures/factory-e2e.js";

const factoryPostgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const deployPostgresUrl = process.env.SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL;
const runtimeVersion = "0.9.0";
const compilerVersion = "0.9.0";

function environment() {
  return {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:p9-reconciliation-e2e",
    runtimeVersions: [runtimeVersion],
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p9-reconcile/runtime" },
      { name: "LOG_LEVEL", kind: "config" as const, reference: "config://p9-reconcile/log-level" },
    ],
  };
}

const unavailableControlPlane = {
  SYSTEM_BUILDER_URL: "http://127.0.0.1:1",
  OBSERVE_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
} as const;

function assertNoCredentialLeak(evidence: string): void {
  assert.ok(factoryPostgresUrl);
  assert.ok(deployPostgresUrl);
  const deployUrl = new URL(deployPostgresUrl);
  assert.equal(evidence.includes(factoryPostgresUrl), false);
  assert.equal(evidence.includes(deployPostgresUrl), false);
  assert.equal(evidence.includes("postgres://"), false);
  assert.equal(evidence.includes(decodeURIComponent(deployUrl.username)), false);
  assert.equal(evidence.includes(decodeURIComponent(deployUrl.password)), false);
}

async function compileDurableFactory(scope: string) {
  assert.ok(factoryPostgresUrl);
  const firstStorage = await PostgresCatalogRecordStorage.open(factoryPostgresUrl, `${scope}_catalog`);
  const firstCatalog = new SoftwareCatalogRegistry(firstStorage);
  for (const record of factoryCatalogRecords) firstCatalog.register(record);
  await firstStorage.close();

  const reconstructedStorage = await PostgresCatalogRecordStorage.open(factoryPostgresUrl, `${scope}_catalog`);
  const catalog = new SoftwareCatalogRegistry(reconstructedStorage);
  const assembly = assembleSystemDefinition(
    factorySystemDefinition,
    `system-definition:${scope}:1`,
    (request) => resolveCatalogCandidates(catalog, request),
  );
  assert.equal(assembly.ok, true);
  if (!assembly.ok) throw new Error("TASK127_ASSEMBLY_FAILED");
  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis: factoryAnalysis,
    definition: factorySystemDefinition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: "p9-task127", status: "PASS", evidenceRefs: ["test:p9-task127"] }],
  });
  assert.equal(validation.decision, "PASS");
  const compilation = compileSyntheticRelease({
    assemblyPlan: assembly.plan,
    validationEvidence: validation,
    compilerVersion,
    runtimeVersion,
    environmentSchema: factoryEnvironmentSchema,
  });
  await reconstructedStorage.close();
  return compilation;
}

const postgresFixturesMissing = factoryPostgresUrl === undefined || deployPostgresUrl === undefined
  ? "PostgreSQL CI fixtures not configured"
  : false;

test("TASK-127 durable P9 chain reconciles authoritative B after controlled manager restart", { skip: postgresFixturesMissing }, async () => {
  assert.ok(factoryPostgresUrl);
  assert.ok(deployPostgresUrl);
  const scope = "p9_task127_reconcile";
  const compilation = await compileDurableFactory(scope);

  const releaseStorage = await PostgresReleaseRecordStorage.open(factoryPostgresUrl, `${scope}_release`);
  const artifactStorage = await PostgresArtifactPayloadRepository.open(factoryPostgresUrl, `${scope}_artifact`);
  const releaseRegistry = new ReleaseRegistry(releaseStorage);
  const publish = (version: string, minute: number) => releaseRegistry.publish({
    releaseId: "p9-runtime-reconciliation-e2e",
    version,
    artifact: compilation.artifact,
    publishedAt: `2026-08-18T00:${minute.toString().padStart(2, "0")}:00Z`,
  });
  publish("1.0.0", 45);
  publish("1.1.0", 46);
  publish("1.2.0", 47);
  publish("1.3.0", 48);
  artifactStorage.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  await releaseStorage.close();
  await artifactStorage.close();

  const runtimeReleaseStorage = await PostgresReleaseRecordStorage.open(factoryPostgresUrl, `${scope}_release`);
  const runtimeArtifactStorage = await PostgresArtifactPayloadRepository.open(factoryPostgresUrl, `${scope}_artifact`);
  const runtimeReleases = new ReleaseRegistry(runtimeReleaseStorage);
  const releaseA = runtimeReleases.get("p9-runtime-reconciliation-e2e", "1.0.0");
  const releaseB = runtimeReleases.get("p9-runtime-reconciliation-e2e", "1.1.0");
  const releaseC = runtimeReleases.get("p9-runtime-reconciliation-e2e", "1.2.0");
  const releaseD = runtimeReleases.get("p9-runtime-reconciliation-e2e", "1.3.0");
  assert.ok(releaseA);
  assert.ok(releaseB);
  assert.ok(releaseC);
  assert.ok(releaseD);
  assert.deepEqual(runtimeArtifactStorage.getVerified(compilation.artifact).files, compilation.files);

  const secretResolver = new InMemorySecretResolver({ "secret://p9-reconcile/runtime": factoryPostgresUrl });
  const deployStorage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const registry = new DeploymentRegistry(deployStorage);
  const manager = new SingleHostActiveRuntimeOrchestrator(registry);
  const promotionInput = (release: NonNullable<typeof releaseA>, minute: number, expectedActiveDeploymentId: string | null) => ({
    publishedRelease: release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: runtimeArtifactStorage,
    environment: environment(),
    secretResolver,
    processEnvironment: unavailableControlPlane,
    expectedActiveDeploymentId,
    startedAt: `2026-08-18T00:${minute.toString().padStart(2, "0")}:01Z`,
    completedAt: `2026-08-18T00:${minute.toString().padStart(2, "0")}:02Z`,
    timeoutMs: 10_000,
  });

  const a = await manager.promote(promotionInput(releaseA, 49, null));
  assert.equal(a.ok, true);
  if (!a.ok || !a.promoted || a.active === null) throw new Error("TASK127_A_NOT_ACTIVE");
  const b = await manager.promote(promotionInput(releaseB, 50, a.candidateRecord.deploymentId));
  assert.equal(b.ok, true);
  if (!b.ok || !b.promoted || b.active === null) throw new Error("TASK127_B_NOT_ACTIVE");
  assert.equal((await manager.health(environment().environmentRef)).status, "UP");

  const c = await manager.promote(promotionInput(releaseC, 51, a.candidateRecord.deploymentId));
  assert.equal(c.ok, true);
  if (!c.ok) throw new Error("TASK127_C_UNEXPECTED_FAILURE");
  assert.equal(c.promoted, false);
  assert.equal(c.decision.outcome, "stale-active");
  assert.equal(c.decision.resultingActiveDeploymentId, b.candidateRecord.deploymentId);
  assert.equal((await manager.health(environment().environmentRef)).status, "UP");

  const failedD = dryRunDeploy({
    publishedRelease: releaseD,
    releaseArtifact: compilation.artifact,
    environment: environment(),
    acceptanceChecks: [{ name: "runtime-health", pass: false }],
    startedAt: "2026-08-18T00:52:01Z",
    completedAt: "2026-08-18T00:52:02Z",
  });
  assert.equal(failedD.ok, true);
  if (!failedD.ok) throw new Error("TASK127_D_RECORD_FAILED");
  assert.equal(failedD.record.status, "failed");
  const decisionD = await registry.activateCandidateAtomically(failedD.record, b.candidateRecord.deploymentId);
  assert.equal(decisionD.outcome, "retained-active");
  assert.equal(decisionD.resultingActiveDeploymentId, b.candidateRecord.deploymentId);
  assert.equal((await manager.health(environment().environmentRef)).status, "UP");

  const attemptedIds = new Set([a.candidateRecord.deploymentId, b.candidateRecord.deploymentId, c.candidateRecord.deploymentId, failedD.record.deploymentId]);
  assert.deepEqual(new Set(registry.list().map((record) => record.deploymentId)), attemptedIds);
  assert.equal(registry.getActive(environment().environmentRef)?.deploymentId, b.candidateRecord.deploymentId);

  const stoppedOldManager = await manager.stopActive(environment().environmentRef);
  assert.ok(stoppedOldManager);
  assert.equal(stoppedOldManager.deploymentId, b.candidateRecord.deploymentId);
  assert.equal(stoppedOldManager.process.state, "stopped");
  assert.equal(registry.getActive(environment().environmentRef)?.deploymentId, b.candidateRecord.deploymentId);

  await deployStorage.close();
  await runtimeReleaseStorage.close();
  await runtimeArtifactStorage.close();

  const freshDeployStorage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const freshRegistry = new DeploymentRegistry(freshDeployStorage);
  const freshReleaseStorage = await PostgresReleaseRecordStorage.open(factoryPostgresUrl, `${scope}_release`);
  const freshArtifactStorage = await PostgresArtifactPayloadRepository.open(factoryPostgresUrl, `${scope}_artifact`);
  const freshReleases = new ReleaseRegistry(freshReleaseStorage);
  const reconstructedB = freshReleases.get("p9-runtime-reconciliation-e2e", "1.1.0");
  assert.ok(reconstructedB);
  assert.equal(freshRegistry.getActive(environment().environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  assert.deepEqual(new Set(freshRegistry.list().map((record) => record.deploymentId)), attemptedIds);
  assert.deepEqual(freshArtifactStorage.getVerified(compilation.artifact).files, compilation.files);

  const freshManager = new SingleHostRuntimeReconciler(freshRegistry);
  const reconciled = await freshManager.reconcile({
    publishedRelease: reconstructedB,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: freshArtifactStorage,
    environment: environment(),
    secretResolver: new InMemorySecretResolver({ "secret://p9-reconcile/runtime": factoryPostgresUrl }),
    processEnvironment: unavailableControlPlane,
    timeoutMs: 10_000,
  });
  assert.equal(reconciled.ok, true);
  if (!reconciled.ok) throw new Error("TASK127_B_RECONCILIATION_FAILED");
  assert.equal(reconciled.deployment.deploymentId, b.candidateRecord.deploymentId);
  assert.equal(reconciled.active.deploymentId, b.candidateRecord.deploymentId);
  assert.equal(reconciled.active.process.state, "running");
  assert.equal((await freshManager.health(environment().environmentRef)).status, "UP");
  assert.equal(freshRegistry.getActive(environment().environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  assert.deepEqual(new Set(freshRegistry.list().map((record) => record.deploymentId)), attemptedIds);

  const evidence = JSON.stringify({
    decisionA: a.decision,
    decisionB: b.decision,
    decisionC: c.decision,
    decisionD,
    activeBeforeRestart: b.candidateRecord.deploymentId,
    stoppedOldManager,
    reconstructedAuthority: freshRegistry.getActive(environment().environmentRef),
    reconciled: { deploymentId: reconciled.deployment.deploymentId, process: reconciled.active.process },
    attempted: freshRegistry.list().map((record) => ({ deploymentId: record.deploymentId, status: record.status })),
  });
  assertNoCredentialLeak(evidence);

  const stoppedFreshManager = await freshManager.shutdown(environment().environmentRef);
  assert.ok(stoppedFreshManager);
  assert.equal(stoppedFreshManager.process.state, "stopped");
  assert.equal(freshRegistry.getActive(environment().environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  await freshDeployStorage.close();
  await freshReleaseStorage.close();
  await freshArtifactStorage.close();
});

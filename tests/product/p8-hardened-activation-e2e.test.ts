import assert from "node:assert/strict";
import test from "node:test";
import { PostgresArtifactPayloadRepository } from "../../packages/artifact-store/postgres.js";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { PostgresCatalogRecordStorage } from "../../packages/catalog/postgres.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { DeploymentRegistry, dryRunDeploy } from "../../packages/deploy/index.js";
import { executeLocalDeployment } from "../../packages/deploy/local-deployment.js";
import { PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { PostgresReleaseRecordStorage } from "../../packages/release/postgres.js";
import { validateTraceability } from "../../packages/validation/index.js";
import { factoryAnalysis, factoryCatalogRecords, factoryEnvironmentSchema, factoryRecipe, factorySystemDefinition } from "./fixtures/factory-e2e.js";

const factoryPostgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const deployPostgresUrl = process.env.SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL;
const runtimeVersion = "0.7.0";
const compilerVersion = "0.7.0";

async function compileDurableFactory(scope: string) {
  assert.ok(factoryPostgresUrl);
  const firstStorage = await PostgresCatalogRecordStorage.open(factoryPostgresUrl, `${scope}_catalog`);
  const firstRegistry = new SoftwareCatalogRegistry(firstStorage);
  for (const record of factoryCatalogRecords) firstRegistry.register(record);
  await firstStorage.close();
  const catalogStorage = await PostgresCatalogRecordStorage.open(factoryPostgresUrl, `${scope}_catalog`);
  const catalog = new SoftwareCatalogRegistry(catalogStorage);
  const assembly = assembleSystemDefinition(factorySystemDefinition, `system-definition:${scope}:1`, (request) => resolveCatalogCandidates(catalog, request));
  assert.equal(assembly.ok, true);
  if (!assembly.ok) throw new Error("P8_E2E_ASSEMBLY_FAILED");
  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis: factoryAnalysis,
    definition: factorySystemDefinition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: "p8-hardened-e2e", status: "PASS", evidenceRefs: ["test:p8-hardened-e2e"] }],
  });
  assert.equal(validation.decision, "PASS");
  const compilation = compileSyntheticRelease({ assemblyPlan: assembly.plan, validationEvidence: validation, compilerVersion, runtimeVersion, environmentSchema: factoryEnvironmentSchema });
  await catalogStorage.close();
  return compilation;
}

async function publishAndReconstruct(scope: string, compilation: Awaited<ReturnType<typeof compileDurableFactory>>, version: string, publishedAt: string) {
  assert.ok(factoryPostgresUrl);
  const releaseStorage = await PostgresReleaseRecordStorage.open(factoryPostgresUrl, `${scope}_release`);
  const artifactStorage = await PostgresArtifactPayloadRepository.open(factoryPostgresUrl, `${scope}_artifact`);
  new ReleaseRegistry(releaseStorage).publish({ releaseId: "p8-hardened-e2e", version, artifact: compilation.artifact, publishedAt });
  artifactStorage.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  await releaseStorage.close();
  await artifactStorage.close();
  const reconstructedReleaseStorage = await PostgresReleaseRecordStorage.open(factoryPostgresUrl, `${scope}_release`);
  const reconstructedArtifactStorage = await PostgresArtifactPayloadRepository.open(factoryPostgresUrl, `${scope}_artifact`);
  const release = new ReleaseRegistry(reconstructedReleaseStorage).get("p8-hardened-e2e", version);
  assert.ok(release);
  assert.deepEqual(reconstructedArtifactStorage.getVerified(compilation.artifact).files, compilation.files);
  return { release, reconstructedReleaseStorage, reconstructedArtifactStorage };
}

function environment() {
  return {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:p8-hardened-e2e",
    runtimeVersions: [runtimeVersion],
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p8/runtime" },
      { name: "LOG_LEVEL", kind: "config" as const, reference: "config://p8/log-level" },
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

async function executeRelease(scope: string, compilation: Awaited<ReturnType<typeof compileDurableFactory>>, version: string, publishedAt: string, startedAt: string, completedAt: string) {
  assert.ok(factoryPostgresUrl);
  const durable = await publishAndReconstruct(scope, compilation, version, publishedAt);
  const deployed = await executeLocalDeployment({
    publishedRelease: durable.release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: durable.reconstructedArtifactStorage,
    environment: environment(),
    secretResolver: new InMemorySecretResolver({ "secret://p8/runtime": factoryPostgresUrl }),
    processEnvironment: unavailableControlPlane,
    startedAt,
    completedAt,
    timeoutMs: 10_000,
  });
  assert.equal(deployed.ok, true);
  if (!deployed.ok || !deployed.execution.ok) throw new Error(`P8_RUNTIME_${version}_FAILED`);
  assert.equal(deployed.execution.health.status, "UP");
  return { durable, record: deployed.record, health: deployed.execution.health };
}

const postgresFixturesMissing = factoryPostgresUrl === undefined || deployPostgresUrl === undefined ? "PostgreSQL CI fixtures not configured" : false;

test("TASK-116 durable Factory output atomically activates as A through authenticated Deploy and reaches autonomous Runtime", { skip: postgresFixturesMissing }, async () => {
  assert.ok(deployPostgresUrl);
  const scope = "p8_task116";
  const compilation = await compileDurableFactory(scope);
  const a = await executeRelease(scope, compilation, "1.0.0", "2026-08-17T21:30:00Z", "2026-08-17T21:30:01Z", "2026-08-17T21:30:02Z");
  const deployStorage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const decisionA = await new DeploymentRegistry(deployStorage).activateCandidateAtomically(a.record, null);
  assert.equal(decisionA.outcome, "activated");
  assert.equal(decisionA.previousActiveDeploymentId, null);
  assert.equal(decisionA.resultingActiveDeploymentId, a.record.deploymentId);
  assert.equal(Object.isFrozen(decisionA), true);
  await deployStorage.close();
  const reconstructedStorage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const reconstructedRegistry = new DeploymentRegistry(reconstructedStorage);
  assert.deepEqual(reconstructedRegistry.getActive(environment().environmentRef), a.record);
  assertNoCredentialLeak(JSON.stringify({ release: a.durable.release, decisionA, active: reconstructedRegistry.getActive(environment().environmentRef), health: a.health }));
  await reconstructedStorage.close();
  await a.durable.reconstructedArtifactStorage.close();
  await a.durable.reconstructedReleaseStorage.close();
});

test("TASK-117 atomic B promotion rejects stale successful contender and preserves autonomous Runtime continuity", { skip: postgresFixturesMissing }, async () => {
  assert.ok(deployPostgresUrl);
  const scope = "p8_task117";
  const compilation = await compileDurableFactory(scope);
  const a = await executeRelease(scope, compilation, "1.0.0", "2026-08-17T21:31:00Z", "2026-08-17T21:31:01Z", "2026-08-17T21:31:02Z");
  const storageA = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const decisionA = await new DeploymentRegistry(storageA).activateCandidateAtomically(a.record, null);
  assert.equal(decisionA.outcome, "activated");
  await storageA.close();
  await a.durable.reconstructedArtifactStorage.close();
  await a.durable.reconstructedReleaseStorage.close();

  const b = await executeRelease(scope, compilation, "1.1.0", "2026-08-17T21:32:00Z", "2026-08-17T21:32:01Z", "2026-08-17T21:32:02Z");
  const storageB = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const decisionB = await new DeploymentRegistry(storageB).activateCandidateAtomically(b.record, a.record.deploymentId);
  assert.equal(decisionB.outcome, "activated");
  assert.equal(decisionB.previousActiveDeploymentId, a.record.deploymentId);
  assert.equal(decisionB.resultingActiveDeploymentId, b.record.deploymentId);
  await storageB.close();

  const c = await executeRelease(scope, compilation, "1.2.0", "2026-08-17T21:33:00Z", "2026-08-17T21:33:01Z", "2026-08-17T21:33:02Z");
  const storageC = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const registryC = new DeploymentRegistry(storageC);
  assert.equal(registryC.getActive(environment().environmentRef)?.deploymentId, b.record.deploymentId);
  const decisionC = await registryC.activateCandidateAtomically(c.record, a.record.deploymentId);
  assert.equal(decisionC.outcome, "stale-active");
  assert.equal(decisionC.previousActiveDeploymentId, b.record.deploymentId);
  assert.equal(decisionC.resultingActiveDeploymentId, b.record.deploymentId);
  await storageC.close();

  const reconstructedStorage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const reconstructedRegistry = new DeploymentRegistry(reconstructedStorage);
  assert.equal(reconstructedRegistry.getActive(environment().environmentRef)?.deploymentId, b.record.deploymentId);
  assert.deepEqual(new Set(reconstructedRegistry.list().map((record) => record.deploymentId)), new Set([a.record.deploymentId, b.record.deploymentId, c.record.deploymentId]));
  assert.equal(b.health.status, "UP");
  assertNoCredentialLeak(JSON.stringify({ decisionA, decisionB, decisionC, active: reconstructedRegistry.getActive(environment().environmentRef), history: reconstructedRegistry.list(), healthB: b.health }));
  await reconstructedStorage.close();
  await b.durable.reconstructedArtifactStorage.close();
  await b.durable.reconstructedReleaseStorage.close();
  await c.durable.reconstructedArtifactStorage.close();
  await c.durable.reconstructedReleaseStorage.close();
});

test("TASK-118 failed contender retains B across fresh authenticated authority reconstruction and Runtime remains autonomous", { skip: postgresFixturesMissing }, async () => {
  assert.ok(factoryPostgresUrl);
  assert.ok(deployPostgresUrl);
  const scope = "p8_task118";
  const compilation = await compileDurableFactory(scope);

  const a = await executeRelease(scope, compilation, "1.0.0", "2026-08-17T21:34:00Z", "2026-08-17T21:34:01Z", "2026-08-17T21:34:02Z");
  const storageA = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const decisionA = await new DeploymentRegistry(storageA).activateCandidateAtomically(a.record, null);
  assert.equal(decisionA.outcome, "activated");
  await storageA.close();
  await a.durable.reconstructedArtifactStorage.close();
  await a.durable.reconstructedReleaseStorage.close();

  const b = await executeRelease(scope, compilation, "1.1.0", "2026-08-17T21:35:00Z", "2026-08-17T21:35:01Z", "2026-08-17T21:35:02Z");
  const storageB = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const decisionB = await new DeploymentRegistry(storageB).activateCandidateAtomically(b.record, a.record.deploymentId);
  assert.equal(decisionB.outcome, "activated");
  await storageB.close();

  const c = await executeRelease(scope, compilation, "1.2.0", "2026-08-17T21:36:00Z", "2026-08-17T21:36:01Z", "2026-08-17T21:36:02Z");
  const storageC = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const decisionC = await new DeploymentRegistry(storageC).activateCandidateAtomically(c.record, a.record.deploymentId);
  assert.equal(decisionC.outcome, "stale-active");
  assert.equal(decisionC.resultingActiveDeploymentId, b.record.deploymentId);
  await storageC.close();
  await c.durable.reconstructedArtifactStorage.close();
  await c.durable.reconstructedReleaseStorage.close();

  const durableD = await publishAndReconstruct(scope, compilation, "1.3.0", "2026-08-17T21:37:00Z");
  const candidateD = dryRunDeploy({
    publishedRelease: durableD.release,
    releaseArtifact: compilation.artifact,
    environment: environment(),
    acceptanceChecks: [{ name: "runtime-health", pass: false }],
    startedAt: "2026-08-17T21:37:01Z",
    completedAt: "2026-08-17T21:37:02Z",
  });
  assert.equal(candidateD.ok, true);
  if (!candidateD.ok) throw new Error("TASK118_FAILED_CANDIDATE_NOT_MATERIALIZED");
  assert.equal(candidateD.record.status, "failed");
  assert.deepEqual(candidateD.record.healthChecks, [{ name: "runtime-health", status: "FAIL" }]);

  const storageD = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const registryD = new DeploymentRegistry(storageD);
  assert.equal(registryD.getActive(environment().environmentRef)?.deploymentId, b.record.deploymentId);
  const decisionD = await registryD.activateCandidateAtomically(candidateD.record, b.record.deploymentId);
  assert.equal(decisionD.outcome, "retained-active");
  assert.equal(decisionD.previousActiveDeploymentId, b.record.deploymentId);
  assert.equal(decisionD.resultingActiveDeploymentId, b.record.deploymentId);
  await storageD.close();

  const reconstructedStorage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const reconstructedRegistry = new DeploymentRegistry(reconstructedStorage);
  assert.equal(reconstructedRegistry.getActive(environment().environmentRef)?.deploymentId, b.record.deploymentId);
  assert.deepEqual(
    new Set(reconstructedRegistry.list().map((record) => record.deploymentId)),
    new Set([a.record.deploymentId, b.record.deploymentId, c.record.deploymentId, candidateD.record.deploymentId]),
  );

  const runtimeAfterReconstruction = await executeLocalDeployment({
    publishedRelease: b.durable.release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: b.durable.reconstructedArtifactStorage,
    environment: environment(),
    secretResolver: new InMemorySecretResolver({ "secret://p8/runtime": factoryPostgresUrl }),
    processEnvironment: unavailableControlPlane,
    startedAt: "2026-08-17T21:38:01Z",
    completedAt: "2026-08-17T21:38:02Z",
    timeoutMs: 10_000,
  });
  assert.equal(runtimeAfterReconstruction.ok, true);
  if (!runtimeAfterReconstruction.ok || !runtimeAfterReconstruction.execution.ok) throw new Error("TASK118_RUNTIME_AFTER_RECONSTRUCTION_FAILED");
  assert.equal(runtimeAfterReconstruction.execution.health.status, "UP");

  assertNoCredentialLeak(JSON.stringify({
    decisionA,
    decisionB,
    decisionC,
    decisionD,
    active: reconstructedRegistry.getActive(environment().environmentRef),
    history: reconstructedRegistry.list(),
    finalHealth: runtimeAfterReconstruction.execution.health,
  }));

  await reconstructedStorage.close();
  await b.durable.reconstructedArtifactStorage.close();
  await b.durable.reconstructedReleaseStorage.close();
  await durableD.reconstructedArtifactStorage.close();
  await durableD.reconstructedReleaseStorage.close();
});

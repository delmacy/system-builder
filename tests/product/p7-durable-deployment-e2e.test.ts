import assert from "node:assert/strict";
import test from "node:test";
import { PostgresArtifactPayloadRepository } from "../../packages/artifact-store/postgres.js";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { PostgresCatalogRecordStorage } from "../../packages/catalog/postgres.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { DeploymentRegistry } from "../../packages/deploy/index.js";
import { executeLocalDeployment } from "../../packages/deploy/local-deployment.js";
import { PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { PostgresReleaseRecordStorage } from "../../packages/release/postgres.js";
import { validateTraceability } from "../../packages/validation/index.js";
import { factoryAnalysis, factoryCatalogRecords, factoryEnvironmentSchema, factoryRecipe, factorySystemDefinition } from "./fixtures/factory-e2e.js";

const postgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const runtimeVersion = "0.7.0";
const compilerVersion = "0.7.0";

async function compileDurableFactory(scope: string) {
  assert.ok(postgresUrl);
  const firstStorage = await PostgresCatalogRecordStorage.open(postgresUrl, `${scope}_catalog`);
  const firstRegistry = new SoftwareCatalogRegistry(firstStorage);
  for (const record of factoryCatalogRecords) firstRegistry.register(record);
  await firstStorage.close();

  const catalogStorage = await PostgresCatalogRecordStorage.open(postgresUrl, `${scope}_catalog`);
  const catalog = new SoftwareCatalogRegistry(catalogStorage);
  const assembly = assembleSystemDefinition(
    factorySystemDefinition,
    `system-definition:${scope}:1`,
    (request) => resolveCatalogCandidates(catalog, request),
  );
  assert.equal(assembly.ok, true);
  if (!assembly.ok) throw new Error("P7_E2E_ASSEMBLY_FAILED");
  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis: factoryAnalysis,
    definition: factorySystemDefinition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: "p7-e2e", status: "PASS", evidenceRefs: ["test:p7-e2e"] }],
  });
  assert.equal(validation.decision, "PASS");
  const compilation = compileSyntheticRelease({
    assemblyPlan: assembly.plan,
    validationEvidence: validation,
    compilerVersion,
    runtimeVersion,
    environmentSchema: factoryEnvironmentSchema,
  });
  await catalogStorage.close();
  return compilation;
}

async function publishAndReconstruct(scope: string, compilation: Awaited<ReturnType<typeof compileDurableFactory>>, version: string) {
  assert.ok(postgresUrl);
  const releaseStorage = await PostgresReleaseRecordStorage.open(postgresUrl, `${scope}_release`);
  const artifactStorage = await PostgresArtifactPayloadRepository.open(postgresUrl, `${scope}_artifact`);
  const releases = new ReleaseRegistry(releaseStorage);
  releases.publish({ releaseId: "p7-durable-e2e", version, artifact: compilation.artifact, publishedAt: `2026-08-17T20:0${version === "1.0.0" ? "0" : "1"}:00Z` });
  artifactStorage.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  await releaseStorage.close();
  await artifactStorage.close();

  const reconstructedReleaseStorage = await PostgresReleaseRecordStorage.open(postgresUrl, `${scope}_release`);
  const reconstructedArtifactStorage = await PostgresArtifactPayloadRepository.open(postgresUrl, `${scope}_artifact`);
  const release = new ReleaseRegistry(reconstructedReleaseStorage).get("p7-durable-e2e", version);
  assert.ok(release);
  const verified = reconstructedArtifactStorage.getVerified(compilation.artifact);
  assert.deepEqual(verified.files, compilation.files);
  return { release, reconstructedReleaseStorage, reconstructedArtifactStorage };
}

function environment() {
  return {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:p7-durable-e2e",
    runtimeVersions: [runtimeVersion],
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p7/runtime" },
      { name: "LOG_LEVEL", kind: "config" as const, reference: "config://p7/log-level" },
    ],
  };
}

const unavailableControlPlane = {
  SYSTEM_BUILDER_URL: "http://127.0.0.1:1",
  OBSERVE_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
  SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
} as const;

test("TASK-107 durable Factory output activates as A and reaches autonomous Runtime", { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(postgresUrl);
  const scope = "p7_task107";
  const compilation = await compileDurableFactory(scope);
  const durable = await publishAndReconstruct(scope, compilation, "1.0.0");
  const resolver = new InMemorySecretResolver({ "secret://p7/runtime": postgresUrl });
  const deployed = await executeLocalDeployment({
    publishedRelease: durable.release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: durable.reconstructedArtifactStorage,
    environment: environment(),
    secretResolver: resolver,
    processEnvironment: unavailableControlPlane,
    startedAt: "2026-08-17T20:00:01Z",
    completedAt: "2026-08-17T20:00:02Z",
    timeoutMs: 10_000,
  });
  assert.equal(deployed.ok, true);
  if (!deployed.ok || !deployed.execution.ok) throw new Error("TASK107_RUNTIME_FAILED");

  const deployStorage = await PostgresDeploymentRecordStorage.open(postgresUrl, `${scope}_deploy`);
  const registry = new DeploymentRegistry(deployStorage);
  const decision = registry.activateCandidate(deployed.record);
  assert.equal(decision.outcome, "activated");
  assert.equal(Object.isFrozen(decision), true);
  await deployStorage.close();

  const reconstructedDeployStorage = await PostgresDeploymentRecordStorage.open(postgresUrl, `${scope}_deploy`);
  const reconstructedRegistry = new DeploymentRegistry(reconstructedDeployStorage);
  assert.deepEqual(reconstructedRegistry.getActive(environment().environmentRef), deployed.record);
  assert.equal(Object.isFrozen(reconstructedRegistry.getActive(environment().environmentRef)), true);

  const evidence = JSON.stringify({ release: durable.release, decision, active: reconstructedRegistry.getActive(environment().environmentRef), health: deployed.execution.health });
  assert.equal(evidence.includes(postgresUrl), false);
  assert.equal(evidence.includes("postgres://"), false);
  await reconstructedDeployStorage.close();
  await durable.reconstructedArtifactStorage.close();
  await durable.reconstructedReleaseStorage.close();
});

test("TASK-108 successful durable B replaces A and preserves autonomous Runtime continuity", { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false }, async () => {
  assert.ok(postgresUrl);
  const scope = "p7_task108";
  const compilation = await compileDurableFactory(scope);
  const resolver = new InMemorySecretResolver({ "secret://p7/runtime": postgresUrl });

  const durableA = await publishAndReconstruct(scope, compilation, "1.0.0");
  const deployedA = await executeLocalDeployment({
    publishedRelease: durableA.release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: durableA.reconstructedArtifactStorage,
    environment: environment(),
    secretResolver: resolver,
    processEnvironment: unavailableControlPlane,
    startedAt: "2026-08-17T20:10:01Z",
    completedAt: "2026-08-17T20:10:02Z",
    timeoutMs: 10_000,
  });
  assert.equal(deployedA.ok, true);
  if (!deployedA.ok || !deployedA.execution.ok) throw new Error("TASK108_RUNTIME_A_FAILED");
  const deployStorageA = await PostgresDeploymentRecordStorage.open(postgresUrl, `${scope}_deploy`);
  const registryA = new DeploymentRegistry(deployStorageA);
  const decisionA = registryA.activateCandidate(deployedA.record);
  assert.equal(decisionA.outcome, "activated");
  await deployStorageA.close();
  await durableA.reconstructedArtifactStorage.close();
  await durableA.reconstructedReleaseStorage.close();

  const durableB = await publishAndReconstruct(scope, compilation, "1.1.0");
  const deployedB = await executeLocalDeployment({
    publishedRelease: durableB.release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: durableB.reconstructedArtifactStorage,
    environment: environment(),
    secretResolver: resolver,
    processEnvironment: unavailableControlPlane,
    startedAt: "2026-08-17T20:11:01Z",
    completedAt: "2026-08-17T20:11:02Z",
    timeoutMs: 10_000,
  });
  assert.equal(deployedB.ok, true);
  if (!deployedB.ok || !deployedB.execution.ok) throw new Error("TASK108_RUNTIME_B_FAILED");

  const deployStorageB = await PostgresDeploymentRecordStorage.open(postgresUrl, `${scope}_deploy`);
  const registryB = new DeploymentRegistry(deployStorageB);
  assert.equal(registryB.getActive(environment().environmentRef)?.deploymentId, deployedA.record.deploymentId);
  const decisionB = registryB.activateCandidate(deployedB.record);
  assert.equal(decisionB.outcome, "activated");
  assert.equal(decisionB.previousActiveDeploymentId, deployedA.record.deploymentId);
  assert.equal(decisionB.resultingActiveDeploymentId, deployedB.record.deploymentId);
  await deployStorageB.close();

  const reconstructedDeployStorage = await PostgresDeploymentRecordStorage.open(postgresUrl, `${scope}_deploy`);
  const reconstructedRegistry = new DeploymentRegistry(reconstructedDeployStorage);
  assert.equal(reconstructedRegistry.getActive(environment().environmentRef)?.deploymentId, deployedB.record.deploymentId);
  assert.deepEqual(
    new Set(reconstructedRegistry.list().map((record) => record.deploymentId)),
    new Set([deployedA.record.deploymentId, deployedB.record.deploymentId]),
  );
  assert.equal(deployedB.execution.health.status, "UP");

  const evidence = JSON.stringify({ releaseA: durableA.release, releaseB: durableB.release, decisionA, decisionB, active: reconstructedRegistry.getActive(environment().environmentRef), healthB: deployedB.execution.health });
  assert.equal(evidence.includes(postgresUrl), false);
  assert.equal(evidence.includes("postgres://"), false);
  await reconstructedDeployStorage.close();
  await durableB.reconstructedArtifactStorage.close();
  await durableB.reconstructedReleaseStorage.close();
});

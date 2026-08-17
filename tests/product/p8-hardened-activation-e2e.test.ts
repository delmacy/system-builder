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
  const assembly = assembleSystemDefinition(
    factorySystemDefinition,
    `system-definition:${scope}:1`,
    (request) => resolveCatalogCandidates(catalog, request),
  );
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

async function publishAndReconstruct(
  scope: string,
  compilation: Awaited<ReturnType<typeof compileDurableFactory>>,
  version: string,
  publishedAt: string,
) {
  assert.ok(factoryPostgresUrl);
  const releaseStorage = await PostgresReleaseRecordStorage.open(factoryPostgresUrl, `${scope}_release`);
  const artifactStorage = await PostgresArtifactPayloadRepository.open(factoryPostgresUrl, `${scope}_artifact`);
  const releases = new ReleaseRegistry(releaseStorage);
  releases.publish({ releaseId: "p8-hardened-e2e", version, artifact: compilation.artifact, publishedAt });
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

test("TASK-116 durable Factory output atomically activates as A through authenticated Deploy and reaches autonomous Runtime", {
  skip: factoryPostgresUrl === undefined || deployPostgresUrl === undefined
    ? "PostgreSQL CI fixtures not configured"
    : false,
}, async () => {
  assert.ok(factoryPostgresUrl);
  assert.ok(deployPostgresUrl);
  const scope = "p8_task116";
  const compilation = await compileDurableFactory(scope);
  const durableA = await publishAndReconstruct(scope, compilation, "1.0.0", "2026-08-17T21:30:00Z");
  const resolver = new InMemorySecretResolver({ "secret://p8/runtime": factoryPostgresUrl });
  const deployedA = await executeLocalDeployment({
    publishedRelease: durableA.release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: durableA.reconstructedArtifactStorage,
    environment: environment(),
    secretResolver: resolver,
    processEnvironment: unavailableControlPlane,
    startedAt: "2026-08-17T21:30:01Z",
    completedAt: "2026-08-17T21:30:02Z",
    timeoutMs: 10_000,
  });
  assert.equal(deployedA.ok, true);
  if (!deployedA.ok || !deployedA.execution.ok) throw new Error("TASK116_RUNTIME_A_FAILED");
  assert.equal(deployedA.execution.health.status, "UP");

  const deployStorage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const registry = new DeploymentRegistry(deployStorage);
  const decisionA = await registry.activateCandidateAtomically(deployedA.record, null);
  assert.equal(decisionA.outcome, "activated");
  assert.equal(decisionA.previousActiveDeploymentId, null);
  assert.equal(decisionA.resultingActiveDeploymentId, deployedA.record.deploymentId);
  assert.equal(Object.isFrozen(decisionA), true);
  await deployStorage.close();

  const reconstructedStorage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, `${scope}_deploy`);
  const reconstructedRegistry = new DeploymentRegistry(reconstructedStorage);
  assert.deepEqual(reconstructedRegistry.getActive(environment().environmentRef), deployedA.record);
  assert.equal(Object.isFrozen(reconstructedRegistry.getActive(environment().environmentRef)), true);

  const evidence = JSON.stringify({
    release: durableA.release,
    decisionA,
    active: reconstructedRegistry.getActive(environment().environmentRef),
    health: deployedA.execution.health,
  });
  assertNoCredentialLeak(evidence);

  await reconstructedStorage.close();
  await durableA.reconstructedArtifactStorage.close();
  await durableA.reconstructedReleaseStorage.close();
});

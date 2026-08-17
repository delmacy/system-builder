import assert from "node:assert/strict";
import test from "node:test";
import { PostgresArtifactPayloadRepository } from "../../packages/artifact-store/postgres.js";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { PostgresCatalogRecordStorage } from "../../packages/catalog/postgres.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { dryRunDeploy } from "../../packages/deploy/index.js";
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

const postgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const runtimeVersion = "0.6.0";
const compilerVersion = "0.6.0";

async function compileFromReconstructedCatalog(scope: string, reverse = false) {
  assert.ok(postgresUrl);
  const firstStorage = await PostgresCatalogRecordStorage.open(postgresUrl, scope);
  const firstRegistry = new SoftwareCatalogRegistry(firstStorage);
  const records = reverse ? [...factoryCatalogRecords].reverse() : [...factoryCatalogRecords];
  for (const record of records) firstRegistry.register(record);
  await firstStorage.close();

  const reconstructedStorage = await PostgresCatalogRecordStorage.open(postgresUrl, scope);
  const reconstructedRegistry = new SoftwareCatalogRegistry(reconstructedStorage);
  const assembly = assembleSystemDefinition(
    factorySystemDefinition,
    "system-definition:durable-factory:1",
    (request) => resolveCatalogCandidates(reconstructedRegistry, request),
  );
  assert.equal(assembly.ok, true);
  if (!assembly.ok) throw new Error("TASK098_ASSEMBLY_FAILED");

  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis: factoryAnalysis,
    definition: factorySystemDefinition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: "task098", status: "PASS", evidenceRefs: ["test:task098"] }],
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
  return { assemblyPlan: assembly.plan, validation, compilation };
}

async function publishAndReconstruct(
  compilation: Awaited<ReturnType<typeof compileFromReconstructedCatalog>>["compilation"],
  suffix: string,
) {
  assert.ok(postgresUrl);
  const releaseStorage = await PostgresReleaseRecordStorage.open(postgresUrl, `task098_release_${suffix}`);
  const artifactRepository = await PostgresArtifactPayloadRepository.open(postgresUrl, `task098_artifact_${suffix}`);
  const registry = new ReleaseRegistry(releaseStorage);
  registry.publish({
    releaseId: `durable-factory-${suffix}`,
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-17T18:00:00Z",
  });
  artifactRepository.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  await releaseStorage.close();
  await artifactRepository.close();

  const reconstructedReleaseStorage = await PostgresReleaseRecordStorage.open(postgresUrl, `task098_release_${suffix}`);
  const reconstructedArtifactRepository = await PostgresArtifactPayloadRepository.open(postgresUrl, `task098_artifact_${suffix}`);
  const reconstructedRelease = new ReleaseRegistry(reconstructedReleaseStorage).get(`durable-factory-${suffix}`, "1.0.0");
  assert.ok(reconstructedRelease);
  const verifiedPayload = reconstructedArtifactRepository.getVerified(compilation.artifact);
  return { reconstructedReleaseStorage, reconstructedArtifactRepository, reconstructedRelease, verifiedPayload };
}

function environment(bindDatabase = true) {
  return {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:task098",
    runtimeVersions: [runtimeVersion],
    bindings: [
      ...(bindDatabase ? [{ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://task098/database" }] : []),
      { name: "LOG_LEVEL", kind: "config" as const, reference: "config://task098/log-level" },
    ],
  };
}

test(
  "durable Factory reconstructs Catalog and Release/Artifact before existing Deploy",
  { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false },
  async () => {
    assert.ok(postgresUrl);
    const first = await compileFromReconstructedCatalog("task098_catalog_a");
    const second = await compileFromReconstructedCatalog("task098_catalog_b", true);
    assert.deepEqual(second.assemblyPlan, first.assemblyPlan);
    assert.deepEqual(second.compilation.artifact, first.compilation.artifact);

    const durable = await publishAndReconstruct(first.compilation, "a");
    assert.deepEqual(durable.verifiedPayload.files, first.compilation.files);

    const deploymentInput = {
      publishedRelease: durable.reconstructedRelease,
      releaseArtifact: first.compilation.artifact,
      environment: environment(),
      acceptanceChecks: [{ name: "artifact-verified", pass: true }],
      startedAt: "2026-08-17T18:01:00Z",
      completedAt: "2026-08-17T18:01:01Z",
    } as const;
    const deployed = dryRunDeploy(deploymentInput);
    const repeated = dryRunDeploy(deploymentInput);
    assert.equal(deployed.ok, true);
    assert.equal(repeated.ok, true);
    if (!deployed.ok || !repeated.ok) throw new Error("TASK098_DEPLOY_FAILED");
    assert.deepEqual(repeated.record, deployed.record);

    const missingBinding = dryRunDeploy({ ...deploymentInput, environment: environment(false) });
    assert.equal(missingBinding.ok, false);
    if (missingBinding.ok) throw new Error("TASK098_EXPECTED_MISSING_BINDING");
    assert.equal(missingBinding.diagnostic.code, "MISSING_ENVIRONMENT_BINDING");
    assert.equal(missingBinding.diagnostic.detail, "DATABASE_URL");

    const evidence = JSON.stringify({
      release: durable.reconstructedRelease,
      payload: durable.verifiedPayload,
      deployment: deployed.record,
    });
    assert.equal(evidence.includes(postgresUrl), false);
    assert.equal(evidence.includes("postgres://"), false);
    assert.equal(evidence.includes("secret://"), false);

    await durable.reconstructedArtifactRepository.close();
    await durable.reconstructedReleaseStorage.close();
  },
);

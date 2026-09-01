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
import { ReleaseRegistry } from "../../packages/release/index.js";
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";

const deployPostgresUrl = process.env.SYSTEM_BUILDER_TEST_AUTH_POSTGRES_URL;
const postgresFixtureMissing = deployPostgresUrl === undefined ? "PostgreSQL CI fixture not configured" : false;
const unavailableBuilder = Object.freeze({
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
      environmentRef: "environment:p19:continuity",
      runtimeVersions: ["1.0.0"],
      bindings: [],
    },
    acceptanceChecks: [{ name: "factory-e2e", pass: true }],
    startedAt: "2026-09-01T09:30:00.000Z",
    completedAt: "2026-09-01T09:31:00.000Z",
  };
}

function buildCanonicalRelease(releaseVersion: string, publishedAt: string) {
  const bootstrap = executeFactoryOperatorBootstrap({
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.0.0", npmVersion: "11.0.0", factoryE2EAvailable: true },
    config: { inputPath: `fixture://p19-continuity-${releaseVersion}` },
    factoryInput: canonicalFactoryInput(releaseVersion, publishedAt),
  });
  assert.equal(bootstrap.ok, true);
  if (!bootstrap.ok) throw new Error("TASK448_BOOTSTRAP_FAILED");

  const assemblyPlan = bootstrap.result.assemblyPlan;
  const validationEvidence = bootstrap.result.validationEvidence;
  if (typeof assemblyPlan !== "object" || assemblyPlan === null || !("kind" in assemblyPlan) || assemblyPlan.kind !== "AssemblyPlan") throw new Error("TASK448_INVALID_ASSEMBLY_PLAN");
  if (typeof validationEvidence !== "object" || validationEvidence === null || !("kind" in validationEvidence) || validationEvidence.kind !== "ValidationEvidence") throw new Error("TASK448_INVALID_VALIDATION_EVIDENCE");

  const compilation = compileSyntheticRelease({
    assemblyPlan: assemblyPlan as CompilerAssemblyPlan,
    validationEvidence: validationEvidence as CompilerValidationEvidence,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  });
  assert.deepEqual(compilation.artifact, bootstrap.result.releaseArtifact);
  return { bootstrap, compilation };
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as Record<string, unknown>;
}

function requireString(record: Record<string, unknown>, key: string, label: string): string {
  const value = record[key];
  if (typeof value !== "string") throw new Error(`${label}.${key} must be a string`);
  return value;
}

test("TASK-448 proves P19 A -> B -> exact A continuity through existing Deploy authority", { skip: postgresFixtureMissing }, async () => {
  assert.ok(deployPostgresUrl);
  const canonicalA = buildCanonicalRelease("0.0.1", "2026-09-01T09:25:00.000Z");
  const canonicalB = buildCanonicalRelease("0.0.2", "2026-09-01T09:35:00.000Z");
  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: canonicalA.compilation.artifact.artifactHash, files: canonicalA.compilation.files });
  artifacts.publish({ artifactHash: canonicalB.compilation.artifact.artifactHash, files: canonicalB.compilation.files });

  const releases = new ReleaseRegistry();
  const releaseA = releases.publish({ releaseId: "orders-system", version: "0.0.1", artifact: canonicalA.compilation.artifact, publishedAt: "2026-09-01T09:25:00.000Z" });
  const releaseB = releases.publish({ releaseId: "orders-system", version: "0.0.2", artifact: canonicalB.compilation.artifact, publishedAt: "2026-09-01T09:35:00.000Z" });
  const bootstrapPublishedA = requireRecord(canonicalA.bootstrap.result.publishedRelease, "TASK448_PUBLISHED_A");
  const bootstrapPublishedB = requireRecord(canonicalB.bootstrap.result.publishedRelease, "TASK448_PUBLISHED_B");
  assert.equal(requireString(bootstrapPublishedA, "artifactHash", "TASK448_PUBLISHED_A"), releaseA.artifactHash);
  assert.equal(requireString(bootstrapPublishedB, "artifactHash", "TASK448_PUBLISHED_B"), releaseB.artifactHash);

  const profile = { kind: "EnvironmentProfile" as const, environmentRef: "environment:p19:continuity", runtimeVersions: ["1.0.0"], bindings: [] };
  const resolver = new InMemorySecretResolver({});
  const storage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, "p19_task448_continuity");
  const registry = new DeploymentRegistry(storage);
  const manager = new SingleHostActiveRuntimeOrchestrator(registry);
  const promoteInput = (release: typeof releaseA, compilation: typeof canonicalA.compilation, expectedActiveDeploymentId: string | null, minute: number) => ({
    publishedRelease: release,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment: profile,
    secretResolver: resolver,
    processEnvironment: unavailableBuilder,
    expectedActiveDeploymentId,
    startedAt: `2026-09-01T09:${minute.toString().padStart(2, "0")}:01.000Z`,
    completedAt: `2026-09-01T09:${minute.toString().padStart(2, "0")}:02.000Z`,
    timeoutMs: 10_000,
  });

  try {
    const a = await manager.promote(promoteInput(releaseA, canonicalA.compilation, null, 40));
    assert.equal(a.ok, true);
    if (!a.ok || !a.promoted || a.active === null) throw new Error("TASK448_A_NOT_ACTIVE");
    assert.equal(a.decision.outcome, "activated");
    assert.equal((await manager.health(profile.environmentRef)).status, "UP");
    const activeAId = a.candidateRecord.deploymentId;

    const staleB = await manager.promote(promoteInput(releaseB, canonicalB.compilation, "deployment:stale-predecessor", 41));
    assert.equal(staleB.ok, true);
    assert.equal(staleB.promoted, false);
    assert.equal(staleB.decision.outcome, "stale-active");
    assert.equal(registry.getActive(profile.environmentRef)?.deploymentId, activeAId);
    assert.equal((await manager.health(profile.environmentRef)).status, "UP");

    const b = await manager.promote(promoteInput(releaseB, canonicalB.compilation, activeAId, 42));
    assert.equal(b.ok, true);
    if (!b.ok || !b.promoted || b.active === null) throw new Error("TASK448_B_NOT_ACTIVE");
    assert.equal(b.decision.outcome, "activated");
    assert.equal(b.decision.previousActiveDeploymentId, activeAId);
    assert.equal(b.candidateRecord.publishedReleaseRef, "orders-system@0.0.2");
    assert.equal(registry.getActive(profile.environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
    assert.equal((await manager.health(profile.environmentRef)).status, "UP");

    const retainedA = releases.get("orders-system", "0.0.1");
    assert.ok(retainedA);
    assert.equal(retainedA.artifactHash, releaseA.artifactHash);
    assert.equal(retainedA.artifactRef, releaseA.artifactRef);
    const restoredA = await manager.promote(promoteInput(retainedA, canonicalA.compilation, b.candidateRecord.deploymentId, 43));
    assert.equal(restoredA.ok, true);
    if (!restoredA.ok || !restoredA.promoted || restoredA.active === null) throw new Error("TASK448_A_RESTORE_NOT_ACTIVE");
    assert.equal(restoredA.decision.outcome, "activated");
    assert.equal(restoredA.decision.previousActiveDeploymentId, b.candidateRecord.deploymentId);
    assert.equal(restoredA.candidateRecord.releaseHash, releaseA.artifactHash);
    assert.equal(restoredA.candidateRecord.publishedReleaseRef, "orders-system@0.0.1");
    assert.equal(restoredA.active.process.runtimeVersion, "1.0.0");
    assert.equal((await manager.health(profile.environmentRef)).status, "UP");

    const history = registry.list();
    assert.equal(history.some((record) => record.deploymentId === activeAId), true);
    assert.equal(history.some((record) => record.deploymentId === staleB.candidateRecord.deploymentId), true);
    assert.equal(history.some((record) => record.deploymentId === b.candidateRecord.deploymentId), true);
    assert.equal(history.some((record) => record.deploymentId === restoredA.candidateRecord.deploymentId), true);
  } finally {
    await manager.stopActive(profile.environmentRef);
    await storage.close();
  }
});

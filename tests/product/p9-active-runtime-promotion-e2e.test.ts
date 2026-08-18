import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { SingleHostActiveRuntimeOrchestrator } from "../../packages/deploy/active-runtime.js";
import { DeploymentRegistry } from "../../packages/deploy/index.js";
import { PostgresDeploymentRecordStorage } from "../../packages/deploy/postgres-state.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
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

function compileFactory() {
  const catalog = new SoftwareCatalogRegistry();
  for (const record of factoryCatalogRecords) catalog.register(record);
  const assembly = assembleSystemDefinition(
    factorySystemDefinition,
    "system-definition:p9-task124:1",
    (request) => resolveCatalogCandidates(catalog, request),
  );
  assert.equal(assembly.ok, true);
  if (!assembly.ok) throw new Error("P9_TASK124_ASSEMBLY_FAILED");
  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis: factoryAnalysis,
    definition: factorySystemDefinition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: "p9-task124", status: "PASS", evidenceRefs: ["test:p9-task124"] }],
  });
  assert.equal(validation.decision, "PASS");
  return compileSyntheticRelease({
    assemblyPlan: assembly.plan,
    validationEvidence: validation,
    compilerVersion,
    runtimeVersion,
    environmentSchema: factoryEnvironmentSchema,
  });
}

function environment(runtimeVersions: readonly string[] = [runtimeVersion]) {
  return {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:p9-active-runtime-e2e",
    runtimeVersions,
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p9/runtime" },
      { name: "LOG_LEVEL", kind: "config" as const, reference: "config://p9/log-level" },
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

const postgresFixturesMissing = factoryPostgresUrl === undefined || deployPostgresUrl === undefined
  ? "PostgreSQL CI fixtures not configured"
  : false;

test("TASK-124 authenticated durable authority governs live A/B promotion and retains B across stale/failed contenders", { skip: postgresFixturesMissing }, async () => {
  assert.ok(factoryPostgresUrl);
  assert.ok(deployPostgresUrl);
  const compilation = compileFactory();
  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  const releases = new ReleaseRegistry();
  const secretResolver = new InMemorySecretResolver({ "secret://p9/runtime": factoryPostgresUrl });
  const scope = "p9_task124_active_runtime";
  const deployStorage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, scope);
  const registry = new DeploymentRegistry(deployStorage);
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(registry);

  const promotionInput = (version: string, minute: number, expectedActiveDeploymentId: string | null, runtimeVersions: readonly string[] = [runtimeVersion]) => ({
    publishedRelease: releases.publish({
      releaseId: "p9-active-runtime-e2e",
      version,
      artifact: compilation.artifact,
      publishedAt: `2026-08-18T00:${minute.toString().padStart(2, "0")}:00Z`,
    }),
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment: environment(runtimeVersions),
    secretResolver,
    processEnvironment: unavailableControlPlane,
    expectedActiveDeploymentId,
    startedAt: `2026-08-18T00:${minute.toString().padStart(2, "0")}:01Z`,
    completedAt: `2026-08-18T00:${minute.toString().padStart(2, "0")}:02Z`,
    timeoutMs: 10_000,
  });

  const a = await orchestrator.promote(promotionInput("1.0.0", 21, null));
  assert.equal(a.ok, true);
  if (!a.ok || !a.active) throw new Error("TASK124_A_NOT_ACTIVE");
  assert.equal(a.promoted, true);
  assert.equal(a.decision.outcome, "activated");
  assert.equal((await orchestrator.health(environment().environmentRef)).status, "UP");

  const aProcess = a.active.process;
  const b = await orchestrator.promote(promotionInput("1.1.0", 22, a.candidateRecord.deploymentId));
  assert.equal(b.ok, true);
  if (!b.ok || !b.active) throw new Error("TASK124_B_NOT_ACTIVE");
  assert.equal(b.promoted, true);
  assert.equal(b.decision.outcome, "activated");
  assert.equal(b.decision.previousActiveDeploymentId, a.candidateRecord.deploymentId);
  assert.equal(b.decision.resultingActiveDeploymentId, b.candidateRecord.deploymentId);
  assert.equal(registry.getActive(environment().environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  await assert.rejects(access(aProcess.workingDirectory));

  const c = await orchestrator.promote(promotionInput("1.2.0", 23, a.candidateRecord.deploymentId));
  assert.equal(c.ok, true);
  if (!c.ok) throw new Error("TASK124_C_UNEXPECTED_FAILURE");
  assert.equal(c.promoted, false);
  assert.equal(c.decision.outcome, "stale-active");
  assert.equal(c.decision.resultingActiveDeploymentId, b.candidateRecord.deploymentId);
  assert.equal(c.candidateFinal.state, "stopped");
  await assert.rejects(access(c.candidateFinal.workingDirectory));
  assert.equal((await orchestrator.health(environment().environmentRef)).status, "UP");
  assert.equal(orchestrator.getActive(environment().environmentRef)?.deploymentId, b.candidateRecord.deploymentId);

  const recordsBeforeFailure = registry.list().length;
  const failed = await orchestrator.promote(promotionInput("1.3.0", 24, b.candidateRecord.deploymentId, ["9.9.9"]));
  assert.equal(failed.ok, false);
  if (failed.ok) throw new Error("TASK124_FAILED_CONTENDER_PROMOTED");
  assert.equal(failed.outcome, "candidate-failed");
  assert.equal(failed.diagnostic.code, "RUNTIME_INCOMPATIBLE");
  assert.equal(registry.list().length, recordsBeforeFailure);
  assert.equal(registry.getActive(environment().environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  assert.equal((await orchestrator.health(environment().environmentRef)).status, "UP");

  await deployStorage.close();
  const reconstructedStorage = await PostgresDeploymentRecordStorage.open(deployPostgresUrl, scope);
  const reconstructedRegistry = new DeploymentRegistry(reconstructedStorage);
  assert.equal(reconstructedRegistry.getActive(environment().environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  assert.equal((await orchestrator.health(environment().environmentRef)).status, "UP");

  const evidence = JSON.stringify({
    decisionA: a.decision,
    decisionB: b.decision,
    decisionC: c.decision,
    failed: { outcome: failed.outcome, code: failed.diagnostic.code },
    activeProcess: orchestrator.getActive(environment().environmentRef),
    reconstructedAuthority: reconstructedRegistry.getActive(environment().environmentRef),
  });
  assertNoCredentialLeak(evidence);

  const stopped = await orchestrator.stopActive(environment().environmentRef);
  assert.ok(stopped);
  assert.equal(stopped.process.state, "stopped");
  await reconstructedStorage.close();
});

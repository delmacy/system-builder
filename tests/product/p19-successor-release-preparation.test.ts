import assert from "node:assert/strict";
import test from "node:test";

import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease, type CompilerAssemblyPlan, type CompilerValidationEvidence } from "../../packages/compiler/index.js";
import { FACTORY_JOURNEY_CONTRACT_VERSION, FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION } from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";
import { invokeRuntimeMaterializationHandoff, preflightRuntimeMaterializationHandoff } from "../../scripts/runtime-materialization-handoff.js";

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
      environmentRef: "environment:p19:successor",
      runtimeVersions: ["1.0.0"],
      bindings: [],
    },
    acceptanceChecks: [{ name: "factory-e2e", pass: true }],
    startedAt: "2026-09-01T09:00:00.000Z",
    completedAt: "2026-09-01T09:01:00.000Z",
  };
}

function bootstrapFor(releaseVersion: string, publishedAt: string) {
  return executeFactoryOperatorBootstrap({
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.0.0", npmVersion: "11.0.0", factoryE2EAvailable: true },
    config: { inputPath: `fixture://p19-successor-${releaseVersion}` },
    factoryInput: canonicalFactoryInput(releaseVersion, publishedAt),
  });
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as Record<string, unknown>;
}

function requireString(record: Record<string, unknown>, key: string, label: string): string {
  const value = record[key];
  if (typeof value !== "string") {
    throw new Error(`${label}.${key} must be a string`);
  }
  return value;
}

function payloadRepositoryFor(bootstrap: ReturnType<typeof bootstrapFor>) {
  assert.equal(bootstrap.ok, true);
  if (!bootstrap.ok) throw new Error("TASK447_BOOTSTRAP_FAILED");
  const assemblyPlan = bootstrap.result.assemblyPlan;
  const validationEvidence = bootstrap.result.validationEvidence;
  if (typeof assemblyPlan !== "object" || assemblyPlan === null || !("kind" in assemblyPlan) || assemblyPlan.kind !== "AssemblyPlan") {
    throw new Error("TASK447_INVALID_ASSEMBLY_PLAN");
  }
  if (typeof validationEvidence !== "object" || validationEvidence === null || !("kind" in validationEvidence) || validationEvidence.kind !== "ValidationEvidence") {
    throw new Error("TASK447_INVALID_VALIDATION_EVIDENCE");
  }
  const compilation = compileSyntheticRelease({
    assemblyPlan: assemblyPlan as CompilerAssemblyPlan,
    validationEvidence: validationEvidence as CompilerValidationEvidence,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
  });
  assert.deepEqual(compilation.artifact, bootstrap.result.releaseArtifact);
  const repository = new InMemoryArtifactPayloadRepository();
  repository.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  return repository;
}

test("TASK-447 prepares deterministic successor B from restored canonical A lineage without activating or perturbing A", async () => {
  const releaseA = bootstrapFor("0.0.1", "2026-09-01T08:55:00.000Z");
  assert.equal(releaseA.ok, true);
  if (!releaseA.ok) return;
  const artifactsA = payloadRepositoryFor(releaseA);
  const deploymentA = releaseA.result.deploymentRecord;
  if (typeof deploymentA !== "object" || deploymentA === null || !("environmentRef" in deploymentA) || typeof deploymentA.environmentRef !== "string") {
    throw new Error("TASK447_INVALID_DEPLOYMENT_A");
  }
  const environmentA = {
    kind: "EnvironmentProfile" as const,
    environmentRef: deploymentA.environmentRef,
    runtimeVersions: ["1.0.0"],
    bindings: [{ name: "DB_PASSWORD", kind: "secret-reference" as const, reference: "secret://task-447-db" }],
  };
  const secret = "task-447-secret-must-not-leak";
  const runtimeA = await invokeRuntimeMaterializationHandoff({
    bootstrap: releaseA,
    environment: environmentA,
    artifactPayloadReader: artifactsA,
    secretResolver: { resolve: () => secret },
    timeoutMs: 5_000,
  });
  assert.equal(runtimeA.deploy.ok, true);
  if (!runtimeA.deploy.ok) return;
  const healthA = structuredClone(runtimeA.deploy.health);

  const restoredA = preflightRuntimeMaterializationHandoff({
    bootstrap: releaseA,
    environment: environmentA,
    artifactPayloadReader: artifactsA,
  });
  assert.equal(restoredA.deploymentRecord.deploymentId, runtimeA.deploymentId);
  assert.equal(restoredA.deploymentRecord.publishedReleaseRef, runtimeA.publishedReleaseRef);
  assert.equal(restoredA.releaseArtifact.artifactHash, runtimeA.artifactHash);

  const firstB = bootstrapFor("0.0.2", "2026-09-01T09:05:00.000Z");
  const secondB = bootstrapFor("0.0.2", "2026-09-01T09:05:00.000Z");
  assert.equal(firstB.ok, true);
  assert.deepEqual(firstB, secondB);
  if (!firstB.ok) return;
  const publishedReleaseB = requireRecord(firstB.result.publishedRelease, "TASK447_PUBLISHED_RELEASE_B");
  const deploymentRecordB = requireRecord(firstB.result.deploymentRecord, "TASK447_DEPLOYMENT_RECORD_B");
  const releaseArtifactB = requireRecord(firstB.result.releaseArtifact, "TASK447_RELEASE_ARTIFACT_B");
  assert.equal(requireString(publishedReleaseB, "version", "TASK447_PUBLISHED_RELEASE_B"), "0.0.2");
  assert.equal(requireString(deploymentRecordB, "publishedReleaseRef", "TASK447_DEPLOYMENT_RECORD_B"), "orders-system@0.0.2");
  assert.notEqual(requireString(releaseArtifactB, "artifactHash", "TASK447_RELEASE_ARTIFACT_B"), "");
  assert.deepEqual(runtimeA.deploy.health, healthA);
  assert.equal(JSON.stringify({ firstB, runtimeA }).includes(secret), false);
});

test("TASK-447 rejects stale restored predecessor, incompatible environment, and malformed successor before activation evidence", () => {
  const releaseA = bootstrapFor("0.0.1", "2026-09-01T08:55:00.000Z");
  assert.equal(releaseA.ok, true);
  if (!releaseA.ok) return;
  const artifactsA = payloadRepositoryFor(releaseA);
  const deploymentA = releaseA.result.deploymentRecord;
  if (typeof deploymentA !== "object" || deploymentA === null || !("environmentRef" in deploymentA) || typeof deploymentA.environmentRef !== "string") {
    throw new Error("TASK447_INVALID_DEPLOYMENT_A");
  }
  const environmentA = { kind: "EnvironmentProfile" as const, environmentRef: deploymentA.environmentRef, runtimeVersions: ["1.0.0"], bindings: [] };

  assert.throws(() => preflightRuntimeMaterializationHandoff({
    bootstrap: releaseA,
    environment: { ...environmentA, environmentRef: "environment:p19:substituted" },
    artifactPayloadReader: artifactsA,
  }));

  let successorCalls = 0;
  const canonicalDeploymentA = requireRecord(releaseA.result.deploymentRecord, "TASK447_DEPLOYMENT_RECORD_A");
  const staleA = {
    ...releaseA,
    result: {
      ...releaseA.result,
      deploymentRecord: { ...canonicalDeploymentA, publishedReleaseRef: "orders-system@stale" },
    },
  };
  assert.throws(() => {
    preflightRuntimeMaterializationHandoff({ bootstrap: staleA, environment: environmentA, artifactPayloadReader: artifactsA });
    successorCalls += 1;
    bootstrapFor("0.0.2", "2026-09-01T09:05:00.000Z");
  }, /RUNTIME_HANDOFF_DEPLOYMENT_PREDECESSOR_MISMATCH/);
  assert.equal(successorCalls, 0);

  assert.throws(() => bootstrapFor("", "2026-09-01T09:05:00.000Z"), (error: unknown) => {
    assert.equal(error instanceof Error, true);
    assert.equal(String(error).includes("task-447-secret-must-not-leak"), false);
    return true;
  });
});

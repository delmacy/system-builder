import assert from "node:assert/strict";
import test from "node:test";

import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import {
  PROCESS_SYSTEM_LINEAGE_VERSION,
  PROCESS_VERSION_IDENTITY_VERSION,
  normalizeProcessAnalysisDefinitionLineage,
  normalizeProcessRevisionIdentity,
} from "../../packages/contracts/process-versioning/index.js";
import { SingleHostActiveRuntimeOrchestrator } from "../../packages/deploy/active-runtime.js";
import { DeploymentRegistry, InMemoryDeploymentRecordStorage } from "../../packages/deploy/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const PRODUCT = Object.freeze({
  artifactRef: "process:reference-orders",
  releaseId: "reference-orders-system",
  environmentRef: "environment:p19:reference-process",
});

const A = Object.freeze({
  revisionRef: "process-revision:reference-orders:v1",
  revisionNumber: 1,
  previousRevisionRef: null,
  analysisRef: "analysis:reference-orders:v1",
  definitionRef: "system-definition:reference-orders:v1",
  releaseVersion: "0.0.1",
  planHash: `sha256:${"a".repeat(64)}`,
  evidenceHash: `sha256:${"b".repeat(64)}`,
});

const B = Object.freeze({
  revisionRef: "process-revision:reference-orders:v2",
  revisionNumber: 2,
  previousRevisionRef: A.revisionRef,
  analysisRef: "analysis:reference-orders:v2",
  definitionRef: "system-definition:reference-orders:v2",
  releaseVersion: "0.0.2",
  planHash: `sha256:${"c".repeat(64)}`,
  evidenceHash: `sha256:${"d".repeat(64)}`,
});

type RevisionFixture = typeof A | typeof B;

function canonicalLineage(revision: RevisionFixture) {
  const processRevision = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision" as const,
    processRevision: normalizeProcessRevisionIdentity({
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: PRODUCT.artifactRef,
      revisionRef: revision.revisionRef,
      revisionNumber: revision.revisionNumber,
      previousRevisionRef: revision.previousRevisionRef,
    }),
  };
  const analysis = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "analysis" as const,
    identityRef: revision.analysisRef,
  };
  const systemDefinition = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition" as const,
    identityRef: revision.definitionRef,
  };

  return normalizeProcessAnalysisDefinitionLineage({
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    processRevision,
    analysis,
    systemDefinition,
    hops: [
      {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "process-revision-to-analysis",
        from: processRevision,
        to: analysis,
      },
      {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "analysis-to-system-definition",
        from: analysis,
        to: systemDefinition,
      },
    ],
  });
}

function candidate(
  releases: ReleaseRegistry,
  revision: RevisionFixture,
  minute: number,
  expectedActiveDeploymentId: string | null,
) {
  const upstream = canonicalLineage(revision);
  const assemblyPlan = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: revision.definitionRef,
    components: [{ capability: "orders", provider: "builtin", version: "1.0.0" }],
    sourceRefs: [revision.revisionRef, revision.analysisRef, revision.definitionRef],
    contentHash: revision.planHash,
  };
  const validationEvidence = {
    kind: "ValidationEvidence" as const,
    assemblyPlanRef: assemblyPlan.contentHash,
    decision: "PASS" as const,
    evidenceHash: revision.evidenceHash,
  };
  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    environmentSchema: [],
  });
  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  const publishedRelease = releases.publish({
    releaseId: PRODUCT.releaseId,
    version: revision.releaseVersion,
    artifact: compilation.artifact,
    publishedAt: `2026-09-01T23:${minute.toString().padStart(2, "0")}:00.000Z`,
  });
  const releaseIdentityRef = `${publishedRelease.releaseId}@${publishedRelease.version}`;
  const releaseAdmission = releases.admitSystemDefinitionLineage({
    releaseId: publishedRelease.releaseId,
    version: publishedRelease.version,
    systemDefinitionRef: revision.definitionRef,
    lineageHop: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "system-definition-to-release",
      from: upstream.systemDefinition,
      to: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "release",
        identityRef: releaseIdentityRef,
      },
    },
  });

  return {
    upstream,
    releaseAdmission,
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment: {
      kind: "EnvironmentProfile" as const,
      environmentRef: PRODUCT.environmentRef,
      runtimeVersions: ["1.0.0"],
      bindings: [],
    },
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
    },
    expectedActiveDeploymentId,
    startedAt: `2026-09-01T23:${minute.toString().padStart(2, "0")}:01.000Z`,
    completedAt: `2026-09-01T23:${minute.toString().padStart(2, "0")}:02.000Z`,
  };
}

function admitDeploymentLineage(
  deployments: DeploymentRegistry,
  deploymentId: string,
  releaseIdentityRef: string,
) {
  return deployments.admitReleaseLineage({
    deploymentId,
    releaseIdentityRef,
    lineageHop: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "release-to-deployment",
      from: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "release",
        identityRef: releaseIdentityRef,
      },
      to: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "deployment",
        identityRef: deploymentId,
      },
    },
  });
}

test("TASK-461 restores exact retained A without regeneration and reconstructs immutable A/B history", async () => {
  const releases = new ReleaseRegistry();
  const deployments = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(deployments);

  const retainedA = candidate(releases, A, 40, null);
  const a = await orchestrator.promote(retainedA);
  assert.equal(a.ok, true);
  if (!a.ok || !a.active) return;
  const aDeploymentId = a.candidateRecord.deploymentId;
  const aReleaseRef = retainedA.releaseAdmission.releaseIdentityRef;
  const originalAAdmission = admitDeploymentLineage(deployments, aDeploymentId, aReleaseRef);
  const originalARecord = deployments.get(aDeploymentId);
  const originalARelease = releases.get(PRODUCT.releaseId, A.releaseVersion);

  const successorB = candidate(releases, B, 41, aDeploymentId);
  const b = await orchestrator.promote(successorB);
  assert.equal(b.ok, true);
  if (!b.ok || !b.active) return;
  const bDeploymentId = b.candidateRecord.deploymentId;
  const bReleaseRef = successorB.releaseAdmission.releaseIdentityRef;
  const bAdmission = admitDeploymentLineage(deployments, bDeploymentId, bReleaseRef);
  const bRecordBeforeRestore = deployments.get(bDeploymentId);
  const bReleaseBeforeRestore = releases.get(PRODUCT.releaseId, B.releaseVersion);

  const restoreInput = {
    ...retainedA,
    expectedActiveDeploymentId: bDeploymentId,
    startedAt: "2026-09-01T23:42:01.000Z",
    completedAt: "2026-09-01T23:42:02.000Z",
  };
  const restored = await orchestrator.promote(restoreInput);
  assert.equal(restored.ok, true);
  if (!restored.ok || !restored.active) return;

  const restoredAAdmission = admitDeploymentLineage(
    deployments,
    restored.candidateRecord.deploymentId,
    aReleaseRef,
  );
  assert.equal(restored.promoted, true);
  assert.equal(restored.decision.outcome, "activated");
  assert.equal(restored.decision.previousActiveDeploymentId, bDeploymentId);
  assert.equal(restored.candidateRecord.publishedReleaseRef, aReleaseRef);
  assert.equal(restored.candidateRecord.releaseHash, retainedA.releaseArtifact.artifactHash);
  assert.equal(restored.candidateRecord.environmentRef, PRODUCT.environmentRef);
  assert.equal(restoredAAdmission.releaseIdentityRef, originalAAdmission.releaseIdentityRef);
  assert.equal(restoredAAdmission.deployment.releaseHash, originalAAdmission.deployment.releaseHash);
  assert.equal((await orchestrator.health(PRODUCT.environmentRef)).status, "UP");

  assert.deepEqual(releases.get(PRODUCT.releaseId, A.releaseVersion), originalARelease);
  assert.deepEqual(releases.get(PRODUCT.releaseId, B.releaseVersion), bReleaseBeforeRestore);
  assert.equal(releases.get(PRODUCT.releaseId, "0.0.3"), undefined);
  assert.deepEqual(deployments.get(aDeploymentId), originalARecord);
  assert.deepEqual(deployments.get(bDeploymentId), bRecordBeforeRestore);
  assert.equal(deployments.list().length, 3);

  const history = JSON.stringify({
    a: {
      revision: retainedA.upstream.processRevision,
      definition: retainedA.upstream.systemDefinition,
      release: retainedA.releaseAdmission,
      originalDeployment: originalAAdmission,
      restoredDeployment: restoredAAdmission,
    },
    b: {
      revision: successorB.upstream.processRevision,
      definition: successorB.upstream.systemDefinition,
      release: successorB.releaseAdmission,
      deployment: bAdmission,
    },
  });
  assert.equal(history.includes(A.revisionRef), true);
  assert.equal(history.includes(A.definitionRef), true);
  assert.equal(history.includes(aReleaseRef), true);
  assert.equal(history.includes(B.revisionRef), true);
  assert.equal(history.includes(B.definitionRef), true);
  assert.equal(history.includes(bReleaseRef), true);
  assert.equal(history.includes("secret://"), false);
  assert.equal(history.includes("EnvironmentProfile"), false);

  const repeated = await orchestrator.promote(restoreInput);
  assert.equal(repeated.ok, true);
  if (!repeated.ok) return;
  assert.equal(repeated.promoted, false);
  assert.equal(repeated.decision.outcome, "stale-active");
  assert.equal(repeated.decision.resultingActiveDeploymentId, restored.candidateRecord.deploymentId);
  assert.equal(deployments.getActive(PRODUCT.environmentRef)?.deploymentId, restored.candidateRecord.deploymentId);
  assert.equal(releases.get(PRODUCT.releaseId, "0.0.3"), undefined);

  await orchestrator.stopActive(PRODUCT.environmentRef);
});

test("TASK-461 rejects stale, substituted or incompatible rollback without disturbing active B", async () => {
  const releases = new ReleaseRegistry();
  const deployments = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(deployments);

  const retainedA = candidate(releases, A, 44, null);
  const a = await orchestrator.promote(retainedA);
  assert.equal(a.ok, true);
  if (!a.ok) return;

  const successorB = candidate(releases, B, 45, a.candidateRecord.deploymentId);
  const b = await orchestrator.promote(successorB);
  assert.equal(b.ok, true);
  if (!b.ok) return;
  const bDeploymentId = b.candidateRecord.deploymentId;
  const bRecord = deployments.get(bDeploymentId);

  const stale = await orchestrator.promote({
    ...retainedA,
    expectedActiveDeploymentId: "deployment:reference-orders:substituted",
    startedAt: "2026-09-01T23:46:01.000Z",
    completedAt: "2026-09-01T23:46:02.000Z",
  });
  assert.equal(stale.ok, true);
  if (!stale.ok) return;
  assert.equal(stale.promoted, false);
  assert.equal(stale.decision.outcome, "stale-active");
  assert.equal(stale.decision.resultingActiveDeploymentId, bDeploymentId);
  assert.deepEqual(deployments.getActive(PRODUCT.environmentRef), bRecord);

  const incompatible = await orchestrator.promote({
    ...retainedA,
    expectedActiveDeploymentId: bDeploymentId,
    environment: {
      ...retainedA.environment,
      runtimeVersions: ["2.0.0"],
    },
    startedAt: "2026-09-01T23:47:01.000Z",
    completedAt: "2026-09-01T23:47:02.000Z",
  });
  assert.equal(incompatible.ok, false);
  assert.deepEqual(deployments.getActive(PRODUCT.environmentRef), bRecord);
  assert.equal(orchestrator.getActive(PRODUCT.environmentRef)?.deploymentId, bDeploymentId);
  assert.equal((await orchestrator.health(PRODUCT.environmentRef)).status, "UP");

  await assert.rejects(
    orchestrator.promote({
      ...retainedA,
      publishedRelease: successorB.publishedRelease,
      expectedActiveDeploymentId: bDeploymentId,
      startedAt: "2026-09-01T23:48:01.000Z",
      completedAt: "2026-09-01T23:48:02.000Z",
    }),
    /ACTIVE_RUNTIME_RECORD_FAILED:ARTIFACT_MISMATCH/,
  );
  assert.deepEqual(deployments.getActive(PRODUCT.environmentRef), bRecord);
  assert.equal(orchestrator.getActive(PRODUCT.environmentRef)?.deploymentId, bDeploymentId);
  assert.equal((await orchestrator.health(PRODUCT.environmentRef)).status, "UP");
  assert.equal(releases.get(PRODUCT.releaseId, "0.0.3"), undefined);

  await orchestrator.stopActive(PRODUCT.environmentRef);
});

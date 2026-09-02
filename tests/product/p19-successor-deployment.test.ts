import assert from "node:assert/strict";
import { access } from "node:fs/promises";
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
    publishedAt: `2026-09-01T22:${minute.toString().padStart(2, "0")}:00.000Z`,
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
    startedAt: `2026-09-01T22:${minute.toString().padStart(2, "0")}:01.000Z`,
    completedAt: `2026-09-01T22:${minute.toString().padStart(2, "0")}:02.000Z`,
  };
}

test("TASK-460 activates exact published successor B from approved revision lineage and preserves retained A", async () => {
  const releases = new ReleaseRegistry();
  const deployments = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(deployments);

  const retainedA = candidate(releases, A, 30, null);
  const a = await orchestrator.promote(retainedA);
  assert.equal(a.ok, true);
  if (!a.ok || !a.active) return;
  const aDeploymentId = a.candidateRecord.deploymentId;
  const aWorkingDirectory = a.active.process.workingDirectory;
  const aRecordBefore = deployments.get(aDeploymentId);

  const successorB = candidate(releases, B, 31, aDeploymentId);
  assert.equal(successorB.upstream.processRevision.processRevision.revisionRef, B.revisionRef);
  assert.equal(successorB.upstream.processRevision.processRevision.previousRevisionRef, A.revisionRef);
  assert.equal(successorB.releaseAdmission.systemDefinitionRef, B.definitionRef);
  assert.equal(successorB.releaseAdmission.releaseIdentityRef, `${PRODUCT.releaseId}@${B.releaseVersion}`);

  const b = await orchestrator.promote(successorB);
  assert.equal(b.ok, true);
  if (!b.ok || !b.active) return;
  const bReleaseRef = `${successorB.publishedRelease.releaseId}@${successorB.publishedRelease.version}`;
  const deploymentAdmission = deployments.admitReleaseLineage({
    deploymentId: b.candidateRecord.deploymentId,
    releaseIdentityRef: bReleaseRef,
    lineageHop: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "release-to-deployment",
      from: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "release",
        identityRef: bReleaseRef,
      },
      to: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "deployment",
        identityRef: b.candidateRecord.deploymentId,
      },
    },
  });

  assert.equal(b.promoted, true);
  assert.equal(b.decision.outcome, "activated");
  assert.equal(b.decision.previousActiveDeploymentId, aDeploymentId);
  assert.equal(b.candidateRecord.publishedReleaseRef, `${PRODUCT.releaseId}@${B.releaseVersion}`);
  assert.equal(b.candidateRecord.releaseHash, successorB.releaseArtifact.artifactHash);
  assert.equal(b.candidateRecord.environmentRef, PRODUCT.environmentRef);
  assert.equal(deploymentAdmission.releaseIdentityRef, bReleaseRef);
  assert.equal(deploymentAdmission.deploymentIdentityRef, b.candidateRecord.deploymentId);
  assert.deepEqual(deployments.get(aDeploymentId), aRecordBefore);
  assert.equal(deployments.getActive(PRODUCT.environmentRef)?.deploymentId, b.candidateRecord.deploymentId);
  assert.equal((await orchestrator.health(PRODUCT.environmentRef)).status, "UP");
  await assert.rejects(access(aWorkingDirectory));

  const evidence = JSON.stringify({
    revision: successorB.upstream.processRevision,
    definition: successorB.upstream.systemDefinition,
    release: successorB.releaseAdmission,
    deployment: deploymentAdmission,
  });
  assert.equal(evidence.includes(B.revisionRef), true);
  assert.equal(evidence.includes(B.definitionRef), true);
  assert.equal(evidence.includes("secret://"), false);
  assert.equal(evidence.includes("EnvironmentProfile"), false);

  await orchestrator.stopActive(PRODUCT.environmentRef);
});

test("TASK-460 rejects stale or failed B without replacing exact last-known-good A", async () => {
  const releases = new ReleaseRegistry();
  const deployments = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const orchestrator = new SingleHostActiveRuntimeOrchestrator(deployments);

  const retainedA = candidate(releases, A, 32, null);
  const a = await orchestrator.promote(retainedA);
  assert.equal(a.ok, true);
  if (!a.ok || !a.active) return;
  const aDeploymentId = a.candidateRecord.deploymentId;

  const staleB = candidate(releases, B, 33, "deployment:reference-orders:substituted");
  const stale = await orchestrator.promote(staleB);
  assert.equal(stale.ok, true);
  if (!stale.ok) return;
  assert.equal(stale.promoted, false);
  assert.equal(stale.decision.outcome, "stale-active");
  assert.equal(stale.decision.resultingActiveDeploymentId, aDeploymentId);
  assert.equal(deployments.getActive(PRODUCT.environmentRef)?.deploymentId, aDeploymentId);
  assert.equal((await orchestrator.health(PRODUCT.environmentRef)).status, "UP");

  const failedInput = {
    ...staleB,
    expectedActiveDeploymentId: aDeploymentId,
    startedAt: "2026-09-01T22:34:01.000Z",
    completedAt: "2026-09-01T22:34:02.000Z",
  };
  const verified = failedInput.artifactPayloadReader.getVerified(failedInput.releaseArtifact);
  const failed = await orchestrator.promote({
    ...failedInput,
    artifactPayloadReader: {
      getVerified: () => ({
        ...verified,
        files: verified.files.map((file) => file.path === "runtime-entry.mjs"
          ? { ...file, content: "console.log('invalid-startup'); setInterval(() => {}, 1000);" }
          : file),
      }),
    },
    timeoutMs: 1_000,
  });
  assert.equal(failed.ok, false);
  if (failed.ok) return;
  assert.equal(failed.outcome, "candidate-failed");
  assert.equal(failed.diagnostic.code, "RUNTIME_STARTUP_INVALID");
  assert.equal(deployments.getActive(PRODUCT.environmentRef)?.deploymentId, aDeploymentId);
  assert.equal(orchestrator.getActive(PRODUCT.environmentRef)?.deploymentId, aDeploymentId);
  assert.equal((await orchestrator.health(PRODUCT.environmentRef)).status, "UP");

  await orchestrator.stopActive(PRODUCT.environmentRef);
});

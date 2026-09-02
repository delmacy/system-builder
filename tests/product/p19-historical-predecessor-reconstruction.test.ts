import assert from "node:assert/strict";
import test from "node:test";

import {
  PROCESS_SYSTEM_LINEAGE_VERSION,
  PROCESS_VERSION_IDENTITY_VERSION,
  normalizeProcessAnalysisDefinitionLineage,
} from "../../packages/contracts/process-versioning/index.js";
import { DeploymentRegistry, InMemoryDeploymentRecordStorage } from "../../packages/deploy/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const A = Object.freeze({
  artifactRef: "process:reference-orders",
  revisionRef: "process-revision:reference-orders:v1",
  analysisRef: "analysis:reference-orders:v1",
  definitionRef: "system-definition:reference-orders:v1",
  releaseId: "reference-orders-system",
  releaseVersion: "0.0.1",
  deploymentId: "deployment:reference-orders:v1",
  environmentRef: "environment:p19:reference-process",
  artifactHash: `sha256:${"a".repeat(64)}`,
  validationEvidenceRef: "validation:reference-orders:v1",
  publishedAt: "2026-09-01T18:30:00.000Z",
  startedAt: "2026-09-01T18:31:00.000Z",
  completedAt: "2026-09-01T18:31:01.000Z",
});

function processDefinitionLineage() {
  const processRevision = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision" as const,
    processRevision: {
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: A.artifactRef,
      revisionRef: A.revisionRef,
      revisionNumber: 1,
      previousRevisionRef: null,
    },
  };
  const analysis = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "analysis" as const,
    identityRef: A.analysisRef,
  };
  const systemDefinition = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition" as const,
    identityRef: A.definitionRef,
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

function createRetainedHistoricalAuthority() {
  const upstream = processDefinitionLineage();
  const releases = new ReleaseRegistry();
  const published = releases.publish({
    releaseId: A.releaseId,
    version: A.releaseVersion,
    artifact: {
      kind: "ReleaseArtifact",
      artifactHash: A.artifactHash,
      validationEvidenceRef: A.validationEvidenceRef,
    },
    publishedAt: A.publishedAt,
  });
  const releaseIdentityRef = `${published.releaseId}@${published.version}`;
  releases.admitSystemDefinitionLineage({
    releaseId: published.releaseId,
    version: published.version,
    systemDefinitionRef: upstream.systemDefinition.identityRef,
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

  const deployments = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const deployment = deployments.record({
    kind: "DeploymentRecord",
    deploymentId: A.deploymentId,
    publishedReleaseRef: releaseIdentityRef,
    environmentRef: A.environmentRef,
    releaseHash: published.artifactHash,
    startedAt: A.startedAt,
    completedAt: A.completedAt,
    status: "succeeded",
    healthChecks: [{ name: "startup", status: "PASS" }],
  });
  deployments.admitReleaseLineage({
    deploymentId: deployment.deploymentId,
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
        identityRef: deployment.deploymentId,
      },
    },
  });

  return Object.freeze({ upstream, releases, deployments });
}

function reconstructRetainedHistoricalA(
  authority: ReturnType<typeof createRetainedHistoricalAuthority>,
  selector: Readonly<{
    releaseId: string;
    releaseVersion: string;
    deploymentId: string;
    definitionRef: string;
  }> = A,
) {
  const release = authority.releases.get(selector.releaseId, selector.releaseVersion);
  if (release === undefined) {
    throw new Error(`HISTORICAL_RELEASE_NOT_FOUND:${selector.releaseId}@${selector.releaseVersion}`);
  }
  const releaseIdentityRef = `${release.releaseId}@${release.version}`;
  const releaseAdmission = authority.releases.admitSystemDefinitionLineage({
    releaseId: release.releaseId,
    version: release.version,
    systemDefinitionRef: selector.definitionRef,
    lineageHop: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "system-definition-to-release",
      from: authority.upstream.systemDefinition,
      to: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "release",
        identityRef: releaseIdentityRef,
      },
    },
  });

  const retainedDeployment = authority.deployments.get(selector.deploymentId);
  if (retainedDeployment === undefined) {
    throw new Error(`HISTORICAL_DEPLOYMENT_NOT_FOUND:${selector.deploymentId}`);
  }
  const deploymentAdmission = authority.deployments.admitReleaseLineage({
    deploymentId: retainedDeployment.deploymentId,
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
        identityRef: retainedDeployment.deploymentId,
      },
    },
  });

  return Object.freeze({
    upstream: authority.upstream,
    releaseAdmission,
    deploymentAdmission,
  });
}

test("TASK-458 reconstructs exact retained historical A without republishing or re-recording it", () => {
  const authority = createRetainedHistoricalAuthority();
  const retainedReleaseBefore = authority.releases.get(A.releaseId, A.releaseVersion);
  const retainedDeploymentsBefore = authority.deployments.list();

  const first = reconstructRetainedHistoricalA(authority);
  const repeated = reconstructRetainedHistoricalA(authority);

  assert.deepEqual(first, repeated);
  assert.deepEqual(authority.releases.get(A.releaseId, A.releaseVersion), retainedReleaseBefore);
  assert.deepEqual(authority.deployments.list(), retainedDeploymentsBefore);
  assert.equal(authority.deployments.list().length, 1);
  assert.equal(first.upstream.processRevision.processRevision.revisionRef, A.revisionRef);
  assert.equal(first.upstream.systemDefinition.identityRef, A.definitionRef);
  assert.equal(first.releaseAdmission.releaseIdentityRef, `${A.releaseId}@${A.releaseVersion}`);
  assert.equal(first.releaseAdmission.release.artifactHash, A.artifactHash);
  assert.equal(first.deploymentAdmission.deploymentIdentityRef, A.deploymentId);
  assert.equal(first.deploymentAdmission.deployment.releaseHash, A.artifactHash);
  assert.equal(first.deploymentAdmission.deployment.publishedReleaseRef, first.releaseAdmission.releaseIdentityRef);
  assert.equal(Object.isFrozen(first.releaseAdmission.release), true);
  assert.equal(Object.isFrozen(first.deploymentAdmission.deployment), true);

  assert.throws(
    () => authority.releases.publish({
      releaseId: A.releaseId,
      version: A.releaseVersion,
      artifact: {
        kind: "ReleaseArtifact",
        artifactHash: A.artifactHash,
        validationEvidenceRef: A.validationEvidenceRef,
      },
      publishedAt: A.publishedAt,
    }),
    /RELEASE_DUPLICATE_IDENTITY/,
  );

  const evidence = JSON.stringify(first);
  assert.equal(evidence.includes("secret://"), false);
  assert.equal(evidence.includes("EnvironmentProfile"), false);
});

test("TASK-458 fails closed for substituted, stale or missing retained historical lineage", () => {
  const authority = createRetainedHistoricalAuthority();

  assert.throws(
    () => reconstructRetainedHistoricalA(authority, {
      ...A,
      definitionRef: "system-definition:reference-orders:stale",
    }),
    /SYSTEM_DEFINITION_MISMATCH/,
  );

  assert.throws(
    () => reconstructRetainedHistoricalA(authority, {
      ...A,
      releaseVersion: "0.0.0-missing",
    }),
    /HISTORICAL_RELEASE_NOT_FOUND/,
  );

  assert.throws(
    () => reconstructRetainedHistoricalA(authority, {
      ...A,
      deploymentId: "deployment:reference-orders:missing",
    }),
    /HISTORICAL_DEPLOYMENT_NOT_FOUND/,
  );

  assert.deepEqual(authority.deployments.list().map((deployment) => deployment.deploymentId), [A.deploymentId]);
});

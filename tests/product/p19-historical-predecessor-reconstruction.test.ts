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

function reconstructHistoricalA() {
  const upstream = processDefinitionLineage();
  const releaseRegistry = new ReleaseRegistry();
  const published = releaseRegistry.publish({
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
  const definitionToRelease = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition-to-release" as const,
    from: upstream.systemDefinition,
    to: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "release" as const,
      identityRef: releaseIdentityRef,
    },
  };
  const releaseAdmission = releaseRegistry.admitSystemDefinitionLineage({
    releaseId: published.releaseId,
    version: published.version,
    systemDefinitionRef: upstream.systemDefinition.identityRef,
    lineageHop: definitionToRelease,
  });

  const deploymentRegistry = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  const deployment = deploymentRegistry.record({
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
  const releaseToDeployment = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "release-to-deployment" as const,
    from: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "release" as const,
      identityRef: releaseIdentityRef,
    },
    to: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "deployment" as const,
      identityRef: deployment.deploymentId,
    },
  };
  const deploymentAdmission = deploymentRegistry.admitReleaseLineage({
    deploymentId: deployment.deploymentId,
    releaseIdentityRef,
    lineageHop: releaseToDeployment,
  });

  return Object.freeze({ upstream, releaseAdmission, deploymentAdmission });
}

test("TASK-458 reconstructs exact historical A through canonical lineage and registries", () => {
  const first = reconstructHistoricalA();
  const repeated = reconstructHistoricalA();

  assert.deepEqual(first, repeated);
  assert.equal(first.upstream.processRevision.processRevision.revisionRef, A.revisionRef);
  assert.equal(first.upstream.systemDefinition.identityRef, A.definitionRef);
  assert.equal(first.releaseAdmission.releaseIdentityRef, `${A.releaseId}@${A.releaseVersion}`);
  assert.equal(first.releaseAdmission.release.artifactHash, A.artifactHash);
  assert.equal(first.deploymentAdmission.deploymentIdentityRef, A.deploymentId);
  assert.equal(first.deploymentAdmission.deployment.releaseHash, A.artifactHash);
  assert.equal(first.deploymentAdmission.deployment.publishedReleaseRef, first.releaseAdmission.releaseIdentityRef);
  assert.equal(Object.isFrozen(first.releaseAdmission.release), true);
  assert.equal(Object.isFrozen(first.deploymentAdmission.deployment), true);

  const evidence = JSON.stringify(first);
  assert.equal(evidence.includes("secret://"), false);
  assert.equal(evidence.includes("EnvironmentProfile"), false);
});

test("TASK-458 fails closed for substituted, stale or missing historical lineage", () => {
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

  assert.throws(
    () => releases.admitSystemDefinitionLineage({
      releaseId: published.releaseId,
      version: published.version,
      systemDefinitionRef: upstream.systemDefinition.identityRef,
      lineageHop: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "system-definition-to-release",
        from: { ...upstream.systemDefinition, identityRef: "system-definition:reference-orders:stale" },
        to: { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "release", identityRef: releaseIdentityRef },
      },
    }),
    /SYSTEM_DEFINITION_MISMATCH/,
  );

  const deployments = new DeploymentRegistry(new InMemoryDeploymentRecordStorage());
  assert.throws(
    () => deployments.admitReleaseLineage({
      deploymentId: "deployment:reference-orders:missing",
      releaseIdentityRef,
      lineageHop: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "release-to-deployment",
        from: { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "release", identityRef: releaseIdentityRef },
        to: { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "deployment", identityRef: "deployment:reference-orders:missing" },
      },
    }),
    /DEPLOYMENT_NOT_FOUND/,
  );
});

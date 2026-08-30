import assert from "node:assert/strict";
import test from "node:test";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { queryCompleteProcessSystemHistory } from "../../packages/contracts/process-versioning/history.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { DeploymentRegistry, type DeploymentRecord } from "../../packages/deploy/index.js";

const revision = {
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef: "process:orders",
  revisionRef: "process:orders:r2",
  revisionNumber: 2,
  previousRevisionRef: "process:orders:r1",
} as const;
const processRevision = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision", processRevision: revision } as const;
const analysis = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis", identityRef: "analysis:orders:r2" } as const;
const definition = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition", identityRef: "definition:orders:r2" } as const;
const release = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "release", identityRef: "orders@2.4.0" } as const;
const deployment = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "deployment", identityRef: "deployment:orders:prod:r2.4.0" } as const;
const hops = [
  { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision-to-analysis", from: processRevision, to: analysis },
  { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis-to-system-definition", from: analysis, to: definition },
  { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition-to-release", from: definition, to: release },
  { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "release-to-deployment", from: release, to: deployment },
] as const;

function releaseRegistry(): ReleaseRegistry {
  const registry = new ReleaseRegistry();
  registry.publish({
    releaseId: "orders",
    version: "2.4.0",
    artifact: {
      kind: "ReleaseArtifact",
      artifactHash: `sha256:${"c".repeat(64)}`,
      validationEvidenceRef: "validation:orders:r2.4.0",
    },
    publishedAt: "2026-08-30T03:28:00Z",
  });
  return registry;
}

function deploymentRecord(): DeploymentRecord {
  return Object.freeze({
    kind: "DeploymentRecord",
    deploymentId: deployment.identityRef,
    publishedReleaseRef: release.identityRef,
    environmentRef: "environment:prod",
    releaseHash: `sha256:${"c".repeat(64)}`,
    startedAt: "2026-08-30T03:29:00Z",
    completedAt: "2026-08-30T03:30:00Z",
    status: "failed",
    healthChecks: Object.freeze([{ name: "smoke", status: "FAIL" as const }]),
  });
}

function composeThroughRealConsumers(evidence: readonly unknown[]) {
  const history = queryCompleteProcessSystemHistory(revision, evidence);
  const releases = releaseRegistry();
  const deployments = new DeploymentRegistry();
  deployments.record(deploymentRecord());

  const releaseAdmission = releases.admitSystemDefinitionLineage({
    releaseId: "orders",
    version: "2.4.0",
    systemDefinitionRef: history.systemDefinition.identityRef,
    lineageHop: history.hops[2],
  });
  const deploymentAdmission = deployments.admitReleaseLineage({
    deploymentId: history.deployment.identityRef,
    releaseIdentityRef: history.release.identityRef,
    lineageHop: history.hops[3],
  });

  return { history, releaseAdmission, deploymentAdmission };
}

test("canonical process revision resolves exact history through real Release and Deploy consumers", () => {
  const result = composeThroughRealConsumers(hops);
  assert.equal(result.history.analysis.identityRef, analysis.identityRef);
  assert.equal(result.history.systemDefinition.identityRef, definition.identityRef);
  assert.equal(result.releaseAdmission.releaseIdentityRef, release.identityRef);
  assert.equal(result.deploymentAdmission.deploymentIdentityRef, deployment.identityRef);
});

test("real consumer historical trace fails closed when canonical history is incomplete", () => {
  assert.throws(() => composeThroughRealConsumers(hops.slice(0, 3)), /incomplete at release-to-deployment/);
});

test("real consumer historical trace rejects cross-artifact substitution before downstream admission", () => {
  const foreignRevision = { ...revision, artifactRef: "process:billing" };
  assert.throws(() => queryCompleteProcessSystemHistory(foreignRevision, hops), /incomplete at process-revision-to-analysis/);
});
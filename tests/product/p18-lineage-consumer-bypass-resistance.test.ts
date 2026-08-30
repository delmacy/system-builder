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
      artifactHash: `sha256:${"d".repeat(64)}`,
      validationEvidenceRef: "validation:orders:r2.4.0",
    },
    publishedAt: "2026-08-30T03:31:00Z",
  });
  return registry;
}

function deploymentRecord(): DeploymentRecord {
  return Object.freeze({
    kind: "DeploymentRecord",
    deploymentId: deployment.identityRef,
    publishedReleaseRef: release.identityRef,
    environmentRef: "environment:prod",
    releaseHash: `sha256:${"d".repeat(64)}`,
    startedAt: "2026-08-30T03:32:00Z",
    completedAt: "2026-08-30T03:33:00Z",
    status: "failed",
    healthChecks: Object.freeze([{ name: "smoke", status: "FAIL" as const }]),
  });
}

test("legacy Release and Deploy behavior remains valid without lineage admission", () => {
  const releases = releaseRegistry();
  assert.equal(releases.get("orders", "2.4.0")?.status, "published");

  const deployments = new DeploymentRegistry();
  const record = deploymentRecord();
  assert.deepEqual(deployments.record(record), record);
  assert.deepEqual(deployments.get(record.deploymentId), record);
});

test("consumer seams reject reversed, forged and missing lineage", () => {
  const releases = releaseRegistry();
  const deployments = new DeploymentRegistry();
  deployments.record(deploymentRecord());

  assert.throws(() => releases.admitSystemDefinitionLineage({
    releaseId: "orders",
    version: "2.4.0",
    systemDefinitionRef: definition.identityRef,
    lineageHop: hops[3],
  }), /RELEASE_LINEAGE_INVALID_HOP/);

  assert.throws(() => deployments.admitReleaseLineage({
    deploymentId: "deployment:missing",
    releaseIdentityRef: release.identityRef,
    lineageHop: hops[3],
  }), /DEPLOYMENT_NOT_FOUND/);

  assert.throws(() => deployments.admitReleaseLineage({
    deploymentId: deployment.identityRef,
    releaseIdentityRef: release.identityRef,
    lineageHop: { ...hops[3], to: { ...deployment, identityRef: "deployment:forged" } },
  }), /DEPLOY_LINEAGE_DEPLOYMENT_MISMATCH/);
});

test("canonical history rejects cross-artifact and duplicate/conflicting downstream truth", () => {
  assert.throws(() => queryCompleteProcessSystemHistory({ ...revision, artifactRef: "process:billing" }, hops), /incomplete at process-revision-to-analysis/);
  assert.throws(() => queryCompleteProcessSystemHistory(revision, [...hops, hops[2]]), /ambiguous at system-definition-to-release/);
  assert.throws(() => queryCompleteProcessSystemHistory(revision, [
    ...hops,
    { ...hops[3], to: { ...deployment, identityRef: "deployment:orders:conflict" } },
  ]), /ambiguous at release-to-deployment/);
});

test("Git, PR, model, classifier and ADR evidence cannot substitute canonical identifiers", () => {
  const releases = releaseRegistry();
  const nonAuthoritative = {
    gitCommit: "deadbeef",
    pullRequest: 999,
    model: "strong-model",
    classifier: "approved",
    adr: "ADR-9999",
  };

  assert.throws(() => releases.admitSystemDefinitionLineage({
    releaseId: "orders",
    version: "2.4.0",
    systemDefinitionRef: definition.identityRef,
    lineageHop: { ...hops[2], to: { ...release, ...nonAuthoritative } },
  }), /unexpected field adr|unexpected field classifier|unexpected field gitCommit|unexpected field model|unexpected field pullRequest/);
});

test("caller-supplied downstream identity cannot bypass canonical history selection", () => {
  const history = queryCompleteProcessSystemHistory(revision, hops);
  const releases = releaseRegistry();

  assert.throws(() => releases.admitSystemDefinitionLineage({
    releaseId: "orders",
    version: "2.4.0",
    systemDefinitionRef: "definition:caller-supplied",
    lineageHop: history.hops[2],
  }), /RELEASE_LINEAGE_SYSTEM_DEFINITION_MISMATCH/);
});
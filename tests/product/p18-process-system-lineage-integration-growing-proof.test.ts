import assert from "node:assert/strict";
import test from "node:test";

import { verifyDecisionBoundary } from "@system-builder/contracts/decision-boundary";
import { calculateProcessSemanticChangeDiff } from "@system-builder/contracts/process-change";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { queryCompleteProcessSystemHistory } from "../../packages/contracts/process-versioning/history.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { DeploymentRegistry, type DeploymentRecord } from "../../packages/deploy/index.js";

const fromRevision = {
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef: "process:orders",
  revisionRef: "process:orders:r1",
  revisionNumber: 1,
  previousRevisionRef: null,
} as const;
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

const semanticDiff = calculateProcessSemanticChangeDiff({
  fromRevision,
  toRevision: revision,
  fromSnapshot: [{ semanticRef: "rule:approval", evidenceRef: "evidence:approval:v1" }],
  toSnapshot: [{ semanticRef: "rule:approval", evidenceRef: "evidence:approval:v2" }],
});
const classificationDecision = verifyDecisionBoundary({
  descriptor: {
    boundaryVersion: "1.0.0",
    decisionId: "classification:orders:r1-r2:construction-b",
    category: "deterministic",
  },
  metadata: { invariantRef: "invariant:semantic-change-classification" },
  riskCriticality: { risk: "medium", criticality: "standard" },
});

function releaseRegistry(): ReleaseRegistry {
  const registry = new ReleaseRegistry();
  registry.publish({
    releaseId: "orders",
    version: "2.4.0",
    artifact: {
      kind: "ReleaseArtifact",
      artifactHash: `sha256:${"e".repeat(64)}`,
      validationEvidenceRef: "validation:orders:r2.4.0",
    },
    publishedAt: "2026-08-30T03:34:00Z",
  });
  return registry;
}

function deploymentRecord(): DeploymentRecord {
  return Object.freeze({
    kind: "DeploymentRecord",
    deploymentId: deployment.identityRef,
    publishedReleaseRef: release.identityRef,
    environmentRef: "environment:prod",
    releaseHash: `sha256:${"e".repeat(64)}`,
    startedAt: "2026-08-30T03:35:00Z",
    completedAt: "2026-08-30T03:36:00Z",
    status: "failed",
    healthChecks: Object.freeze([{ name: "smoke", status: "FAIL" as const }]),
  });
}

test("P18 Construction B growing proof carries WBS 18.1/18.2/18.3 truth through real Release and Deploy consumers", () => {
  const history = queryCompleteProcessSystemHistory(revision, [...hops].reverse());
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

  assert.equal(history.processRevision.processRevision.revisionRef, revision.revisionRef);
  assert.equal(history.analysis.identityRef, analysis.identityRef);
  assert.equal(releaseAdmission.releaseIdentityRef, release.identityRef);
  assert.equal(deploymentAdmission.deploymentIdentityRef, deployment.identityRef);
  assert.equal(semanticDiff.fromRevisionRef, fromRevision.revisionRef);
  assert.equal(semanticDiff.toRevisionRef, revision.revisionRef);
  assert.equal(classificationDecision.status, "valid");
  if (classificationDecision.status === "valid") assert.equal(classificationDecision.category, "deterministic");
  assert.equal(deployments.getActive("environment:prod"), undefined);
});

test("P18 Construction B growing proof remains fail-closed for forged, cross-artifact, missing, reversed and conflicting lineage", () => {
  assert.throws(() => queryCompleteProcessSystemHistory({ ...revision, artifactRef: "process:billing" }, hops), /incomplete at process-revision-to-analysis/);
  assert.throws(() => queryCompleteProcessSystemHistory(revision, hops.slice(0, 3)), /incomplete at release-to-deployment/);
  assert.throws(() => queryCompleteProcessSystemHistory(revision, [{ ...hops[0], from: analysis, to: processRevision }, ...hops.slice(1)]), /requires process-revision -> analysis/);
  assert.throws(() => queryCompleteProcessSystemHistory(revision, [...hops, { ...hops[2], to: { ...release, identityRef: "orders@9.9.9" } }]), /ambiguous at system-definition-to-release/);

  const releases = releaseRegistry();
  assert.throws(() => releases.admitSystemDefinitionLineage({
    releaseId: "orders",
    version: "2.4.0",
    systemDefinitionRef: "definition:forged",
    lineageHop: hops[2],
  }), /RELEASE_LINEAGE_SYSTEM_DEFINITION_MISMATCH/);
});

test("P18 Construction B growing proof keeps Git, PR and model signals non-authoritative while legacy callers stay compatible", () => {
  const releases = releaseRegistry();
  assert.equal(releases.get("orders", "2.4.0")?.status, "published");

  for (const signal of [
    { gitCommit: "deadbeef" },
    { pullRequest: 999 },
    { modelRef: "model:approval" },
  ]) {
    assert.throws(() => releases.admitSystemDefinitionLineage({
      releaseId: "orders",
      version: "2.4.0",
      systemDefinitionRef: definition.identityRef,
      lineageHop: { ...hops[2], to: { ...release, ...signal } },
    }), /unexpected field/);
  }
});
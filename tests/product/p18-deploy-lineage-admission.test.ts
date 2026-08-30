import assert from "node:assert/strict";
import test from "node:test";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { DeploymentRegistry, type DeploymentRecord } from "../../packages/deploy/index.js";

function deploymentRecord(): DeploymentRecord {
  return Object.freeze({
    kind: "DeploymentRecord",
    deploymentId: "deployment:orders-prod-20260830",
    publishedReleaseRef: "orders@2.4.0",
    environmentRef: "environment:prod",
    releaseHash: `sha256:${"b".repeat(64)}`,
    startedAt: "2026-08-30T03:25:00Z",
    completedAt: "2026-08-30T03:26:00Z",
    status: "failed",
    healthChecks: Object.freeze([{ name: "smoke", status: "FAIL" as const }]),
  });
}

function validHop() {
  const release = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "release" as const,
    identityRef: "orders@2.4.0",
  };
  const deployment = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "deployment" as const,
    identityRef: "deployment:orders-prod-20260830",
  };
  return {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "release-to-deployment" as const,
    from: release,
    to: deployment,
  };
}

test("Deployment admits canonical Release -> Deployment lineage without changing activation authority", () => {
  const registry = new DeploymentRegistry();
  registry.record(deploymentRecord());
  assert.equal(registry.getActive("environment:prod"), undefined);

  const admission = registry.admitReleaseLineage({
    deploymentId: "deployment:orders-prod-20260830",
    releaseIdentityRef: "orders@2.4.0",
    lineageHop: validHop(),
  });

  assert.equal(admission.kind, "DeploymentLineageAdmission");
  assert.equal(admission.releaseIdentityRef, "orders@2.4.0");
  assert.equal(admission.deploymentIdentityRef, "deployment:orders-prod-20260830");
  assert.equal(registry.getActive("environment:prod"), undefined);
});

test("Deployment lineage admission fails closed on missing or mismatched predecessor", () => {
  const registry = new DeploymentRegistry();
  assert.throws(() => registry.admitReleaseLineage({
    deploymentId: "deployment:missing",
    releaseIdentityRef: "orders@2.4.0",
    lineageHop: validHop(),
  }), /DEPLOYMENT_NOT_FOUND/);

  registry.record(deploymentRecord());
  assert.throws(() => registry.admitReleaseLineage({
    deploymentId: "deployment:orders-prod-20260830",
    releaseIdentityRef: "billing@1.0.0",
    lineageHop: validHop(),
  }), /DEPLOY_LINEAGE_RELEASE_PREDECESSOR_MISMATCH/);
});

test("Deployment lineage admission rejects forged release or deployment endpoints", () => {
  const registry = new DeploymentRegistry();
  registry.record(deploymentRecord());
  const hop = validHop();

  assert.throws(() => registry.admitReleaseLineage({
    deploymentId: "deployment:orders-prod-20260830",
    releaseIdentityRef: "orders@2.4.0",
    lineageHop: { ...hop, from: { ...hop.from, identityRef: "orders@9.9.9" } },
  }), /DEPLOY_LINEAGE_RELEASE_MISMATCH/);

  assert.throws(() => registry.admitReleaseLineage({
    deploymentId: "deployment:orders-prod-20260830",
    releaseIdentityRef: "orders@2.4.0",
    lineageHop: { ...hop, to: { ...hop.to, identityRef: "deployment:forged" } },
  }), /DEPLOY_LINEAGE_DEPLOYMENT_MISMATCH/);
});

test("existing Deployment record/get behavior remains backward-compatible", () => {
  const registry = new DeploymentRegistry();
  const record = deploymentRecord();
  assert.deepEqual(registry.record(record), record);
  assert.deepEqual(registry.get(record.deploymentId), record);
});
import assert from "node:assert/strict";
import test from "node:test";
import {
  PROCESS_SYSTEM_LINEAGE_VERSION,
  normalizeProcessDefinitionReleaseDeploymentLineage,
} from "../../packages/contracts/process-versioning/index.js";

const definition = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition", identityRef: "definition:orders-v2" } as const;
const release = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "release", identityRef: "release:orders-v2.4.0" } as const;
const deployment = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "deployment", identityRef: "deployment:orders-prod-20260829" } as const;
const hops = [
  { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition-to-release", from: definition, to: release },
  { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "release-to-deployment", from: release, to: deployment },
] as const;
const valid = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, systemDefinition: definition, release, deployment, hops } as const;

test("system definition composes deterministically through release to deployment", () => {
  assert.deepEqual(normalizeProcessDefinitionReleaseDeploymentLineage(valid), normalizeProcessDefinitionReleaseDeploymentLineage({ ...valid }));
});

test("definition-release-deployment lineage fails closed on mismatched definition and wrong release", () => {
  assert.throws(() => normalizeProcessDefinitionReleaseDeploymentLineage({
    ...valid,
    systemDefinition: { ...definition, identityRef: "definition:billing-v2" },
  }), /definition-to-release hop does not match declared endpoints/);
  assert.throws(() => normalizeProcessDefinitionReleaseDeploymentLineage({
    ...valid,
    release: { ...release, identityRef: "release:billing-v1.0.0" },
  }), /definition-to-release hop does not match declared endpoints/);
});

test("definition-release-deployment lineage rejects missing and reversed hops", () => {
  assert.throws(() => normalizeProcessDefinitionReleaseDeploymentLineage({ ...valid, hops: [hops[0]] }), /exactly two ordered hops/);
  assert.throws(() => normalizeProcessDefinitionReleaseDeploymentLineage({ ...valid, hops: [hops[1], hops[0]] }), /out of order/);
});

test("definition-release-deployment lineage rejects conflicting deployment linkage and extra state", () => {
  assert.throws(() => normalizeProcessDefinitionReleaseDeploymentLineage({ ...valid, extra: true }), /unexpected field extra/);
  assert.throws(() => normalizeProcessDefinitionReleaseDeploymentLineage({
    ...valid,
    deployment: { ...deployment, identityRef: release.identityRef },
    hops: [hops[0], { ...hops[1], to: { ...deployment, identityRef: release.identityRef } }],
  }), /identities must be distinct/);
});

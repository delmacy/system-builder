import assert from "node:assert/strict";
import test from "node:test";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { queryCompleteProcessSystemHistory } from "../../packages/contracts/process-versioning/history.js";

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
const release = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "release", identityRef: "release:orders:r2.1" } as const;
const deployment = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "deployment", identityRef: "deployment:orders:prod:r2.1" } as const;
const hops = [
  { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision-to-analysis", from: processRevision, to: analysis },
  { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis-to-system-definition", from: analysis, to: definition },
  { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition-to-release", from: definition, to: release },
  { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "release-to-deployment", from: release, to: deployment },
] as const;

test("complete history is deterministic and ordered from canonical process revision to deployment", () => {
  const result = queryCompleteProcessSystemHistory(revision, hops);
  assert.deepEqual(result.hops.map((hop) => hop.kind), ["process-revision-to-analysis", "analysis-to-system-definition", "system-definition-to-release", "release-to-deployment"]);
  assert.equal(result.processRevision.processRevision.artifactRef, revision.artifactRef);
  assert.equal(result.deployment.identityRef, deployment.identityRef);
  assert.deepEqual(result, queryCompleteProcessSystemHistory({ ...revision }, [...hops].reverse()));
});

test("history fails closed for missing and ambiguous hops", () => {
  assert.throws(() => queryCompleteProcessSystemHistory(revision, hops.slice(0, 3)), /incomplete at release-to-deployment/);
  assert.throws(() => queryCompleteProcessSystemHistory(revision, [...hops, { ...hops[0], to: { ...analysis, identityRef: "analysis:orders:alternate" } }]), /ambiguous at process-revision-to-analysis/);
});

test("history rejects reversal and cross-artifact substitution", () => {
  assert.throws(() => queryCompleteProcessSystemHistory(revision, [{ ...hops[0], from: analysis, to: processRevision }, ...hops.slice(1)]), /requires process-revision -> analysis/);
  assert.throws(() => queryCompleteProcessSystemHistory({ ...revision, artifactRef: "process:billing" }, hops), /incomplete at process-revision-to-analysis/);
});

test("history rejects conflicting duplicate evidence", () => {
  assert.throws(() => queryCompleteProcessSystemHistory(revision, [...hops, { ...hops[2], to: { ...release, identityRef: "release:orders:conflict" } }]), /ambiguous at system-definition-to-release/);
  assert.throws(() => queryCompleteProcessSystemHistory(revision, [...hops, hops[1]]), /ambiguous at analysis-to-system-definition/);
});

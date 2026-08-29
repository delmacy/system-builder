import assert from "node:assert/strict";
import test from "node:test";

import { verifyDecisionBoundary } from "@system-builder/contracts/decision-boundary";
import { calculateProcessSemanticChangeDiff } from "@system-builder/contracts/process-change";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { queryCompleteProcessSystemHistory } from "../../packages/contracts/process-versioning/history.js";

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
const release = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "release", identityRef: "release:orders:r2.1" } as const;
const deployment = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "deployment", identityRef: "deployment:orders:prod:r2.1" } as const;
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
    decisionId: "classification:orders:r1-r2",
    category: "deterministic",
  },
  metadata: { invariantRef: "invariant:semantic-change-classification" },
  riskCriticality: { risk: "medium", criticality: "standard" },
});

test("P18 Construction A growing proof traces canonical revision through analysis, definition, release and deployment", () => {
  const result = queryCompleteProcessSystemHistory(revision, [...hops].reverse());
  assert.equal(result.processRevision.processRevision.revisionRef, revision.revisionRef);
  assert.equal(result.analysis.identityRef, analysis.identityRef);
  assert.equal(result.systemDefinition.identityRef, definition.identityRef);
  assert.equal(result.release.identityRef, release.identityRef);
  assert.equal(result.deployment.identityRef, deployment.identityRef);
  assert.deepEqual(result.hops.map((hop) => hop.kind), [
    "process-revision-to-analysis",
    "analysis-to-system-definition",
    "system-definition-to-release",
    "release-to-deployment",
  ]);
  assert.equal(semanticDiff.fromRevisionRef, fromRevision.revisionRef);
  assert.equal(semanticDiff.toRevisionRef, revision.revisionRef);
  assert.equal(classificationDecision.status, "valid");
  if (classificationDecision.status !== "valid") return;
  assert.equal(classificationDecision.category, "deterministic");
  assert.notEqual(classificationDecision.category, "human-decision");
});

test("P18 Construction A growing proof rejects forged, reversed, missing and conflicting lineage", () => {
  assert.throws(() => queryCompleteProcessSystemHistory({ ...revision, artifactRef: "process:billing" }, hops), /incomplete at process-revision-to-analysis/);
  assert.throws(() => queryCompleteProcessSystemHistory(revision, [{ ...hops[0], from: analysis, to: processRevision }, ...hops.slice(1)]), /requires process-revision -> analysis/);
  assert.throws(() => queryCompleteProcessSystemHistory(revision, hops.slice(0, 3)), /incomplete at release-to-deployment/);
  assert.throws(() => queryCompleteProcessSystemHistory(revision, [...hops, { ...hops[2], to: { ...release, identityRef: "release:orders:forged" } }]), /ambiguous at system-definition-to-release/);
  assert.throws(() => queryCompleteProcessSystemHistory(revision, [...hops, hops[1]]), /ambiguous at analysis-to-system-definition/);
});

test("P18 Construction A growing proof keeps Git, PR and model signals outside business authority", () => {
  assert.equal("git" in classificationDecision, false);
  assert.equal("pullRequest" in classificationDecision, false);
  assert.equal("modelRef" in classificationDecision, false);
  assert.equal(classificationDecision.status, "valid");
  if (classificationDecision.status !== "valid") return;
  assert.equal(classificationDecision.category, "deterministic");
  assert.deepEqual(classificationDecision.reference, {
    kind: "invariant",
    ref: "invariant:semantic-change-classification",
  });

  for (const nonAuthoritativeSignal of [
    { gitIdentity: "commit:approved" },
    { pullRequest: 497, approved: true },
    { modelRef: "model:approval", confidence: 1 },
  ]) {
    const decision = verifyDecisionBoundary({
      descriptor: {
        boundaryVersion: "1.0.0",
        decisionId: "classification:orders:signal-proof",
        category: "deterministic",
      },
      metadata: {
        invariantRef: "invariant:semantic-change-classification",
        ...nonAuthoritativeSignal,
      },
      riskCriticality: { risk: "medium", criticality: "standard" },
    } as never);

    assert.equal(decision.status, "invalid");
    if (decision.status !== "invalid") continue;
    assert.match(decision.diagnostic, /unexpected field/);
  }
});

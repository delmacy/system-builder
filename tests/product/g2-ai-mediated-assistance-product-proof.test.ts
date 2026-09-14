import assert from "node:assert/strict";
import test from "node:test";
import {
  aiMediatedCandidateEstablishesCanonicalTruth,
  aiMediatedInferenceEstablishesAuthority,
  aiMediatedOrdinaryGenerationRemainsAvailable,
  aiMediatedProvenanceReplayMatches,
  assertAiMediatedWorkspaceSnapshot,
  computeAiMediatedProvenanceHash,
  evaluateAiMediatedWorkspace,
  type AiMediatedProvenanceRef,
  type AiMediatedWorkspaceSnapshot,
} from "../../packages/contracts/ai-mediated-assistance/index.js";

function provenance(
  overrides: Partial<AiMediatedProvenanceRef> = {},
): AiMediatedProvenanceRef[] {
  return [
    {
      kind: "PROMPT",
      ref: "prompt:work-order-summary",
      revisionRef: "prompt-revision:4",
      digest: "sha256:prompt-4",
      currentness: "CURRENT",
      completeness: "KNOWN",
    },
    {
      kind: "CONTEXT",
      ref: "workflow:work-order-42",
      revisionRef: "workflow-revision:10",
      digest: "sha256:workflow-10",
      currentness: "CURRENT",
      completeness: "KNOWN",
      ...overrides,
    },
    {
      kind: "EVIDENCE",
      ref: "evidence:work-order-42",
      revisionRef: "evidence-revision:10",
      digest: "sha256:evidence-10",
      currentness: "CURRENT",
      completeness: "KNOWN",
    },
  ];
}

function workspace(
  refs: readonly AiMediatedProvenanceRef[] = provenance(),
): AiMediatedWorkspaceSnapshot {
  return {
    identity: {
      workspaceRef: "ai-workspace:work-order-assistance",
      workspaceRevisionRef: "ai-workspace-revision:2",
      gatewayRef: "ai-gateway:bounded-assistance",
      gatewayRevisionRef: "ai-gateway-revision:3",
      locality: { scope: "STATION", scopeRef: "station:porto-alegre" },
    },
    provenance: refs,
    candidateLineage: {
      candidateRef: "candidate:work-order-summary",
      candidateRevisionRef: "candidate-revision:1",
      sourceKind: "CONTEXT",
      sourceRef: "workflow:work-order-42",
      sourceRevisionRef: "workflow-revision:10",
      provenanceHash: computeAiMediatedProvenanceHash(refs),
    },
  };
}

test("AI workspace identity and provenance remain deterministic and non-authoritative", () => {
  const snapshot = workspace();
  assert.doesNotThrow(() => assertAiMediatedWorkspaceSnapshot(snapshot));
  assert.equal(evaluateAiMediatedWorkspace(snapshot), "AVAILABLE");
  assert.equal(snapshot.identity.locality.scope, "STATION");
  assert.notEqual(snapshot.identity.workspaceRef, snapshot.candidateLineage.sourceRef);
  assert.notEqual(snapshot.identity.workspaceRevisionRef, snapshot.candidateLineage.sourceRevisionRef);
  assert.equal(aiMediatedInferenceEstablishesAuthority(snapshot), false);
  assert.equal(aiMediatedCandidateEstablishesCanonicalTruth(snapshot.candidateLineage), false);
});

test("source identity, revision, and currentness remain provenance-bound independently from the candidate", () => {
  const staleSource = provenance({ currentness: "STALE" });
  const snapshot = workspace(staleSource);
  const source = snapshot.provenance.find((entry) =>
    entry.kind === snapshot.candidateLineage.sourceKind &&
    entry.ref === snapshot.candidateLineage.sourceRef &&
    entry.revisionRef === snapshot.candidateLineage.sourceRevisionRef
  );
  assert.equal(source?.currentness, "STALE");
  assert.equal(evaluateAiMediatedWorkspace(snapshot), "DEGRADED");
  assert.equal(aiMediatedCandidateEstablishesCanonicalTruth(snapshot.candidateLineage), false);

  const wrongSourceRevision = {
    ...snapshot,
    candidateLineage: {
      ...snapshot.candidateLineage,
      sourceRevisionRef: "workflow-revision:999",
    },
  };
  assert.throws(
    () => assertAiMediatedWorkspaceSnapshot(wrongSourceRevision),
    /AI_MEDIATED_PROVENANCE_INVALID:source-lineage-mismatch/,
  );
});

test("stale and PARTIAL provenance degrade without strengthening while unresolved states require reconciliation", () => {
  for (const overrides of [
    { currentness: "STALE" as const },
    { completeness: "PARTIAL" as const },
  ]) {
    const snapshot = workspace(provenance(overrides));
    assert.equal(evaluateAiMediatedWorkspace(snapshot), "DEGRADED");
    assert.equal(aiMediatedInferenceEstablishesAuthority(snapshot), false);
    assert.equal(aiMediatedOrdinaryGenerationRemainsAvailable("DEGRADED"), true);
  }

  for (const overrides of [
    { currentness: "UNKNOWN" as const },
    { currentness: "INCONCLUSIVE" as const },
    { completeness: "UNKNOWN" as const },
    { completeness: "INCONCLUSIVE" as const },
    { completeness: "CONFLICTED" as const },
  ]) {
    const snapshot = workspace(provenance(overrides));
    assert.equal(evaluateAiMediatedWorkspace(snapshot), "RECONCILE_BEFORE_RETRY");
    assert.equal(aiMediatedInferenceEstablishesAuthority(snapshot), false);
    assert.equal(aiMediatedOrdinaryGenerationRemainsAvailable("RECONCILE_BEFORE_RETRY"), true);
  }
});

test("malformed or ambiguous provenance is rejected deterministically", () => {
  const missingPrompt = provenance().filter((entry) => entry.kind !== "PROMPT");
  assert.throws(
    () => assertAiMediatedWorkspaceSnapshot(workspace(missingPrompt)),
    /AI_MEDIATED_PROVENANCE_INVALID:prompt-cardinality/,
  );

  const duplicated: AiMediatedProvenanceRef[] = [
    ...provenance(),
    { ...provenance()[1]! },
  ];
  assert.throws(
    () => assertAiMediatedWorkspaceSnapshot(workspace(duplicated)),
    /AI_MEDIATED_PROVENANCE_AMBIGUOUS:CONTEXT:workflow:work-order-42/,
  );

  const snapshot = workspace();
  const mismatched = {
    ...snapshot,
    candidateLineage: { ...snapshot.candidateLineage, provenanceHash: "sha256:mismatch" },
  };
  assert.throws(
    () => assertAiMediatedWorkspaceSnapshot(mismatched),
    /AI_MEDIATED_PROVENANCE_INVALID:hash-mismatch/,
  );
});

test("provenance replay is revision/currentness sensitive while ordinary generation remains a valid fallback", () => {
  const original = provenance();
  const snapshot = workspace(original);
  assert.equal(aiMediatedProvenanceReplayMatches(snapshot, original), true);

  const changedRevision = provenance({ revisionRef: "workflow-revision:11" });
  assert.equal(aiMediatedProvenanceReplayMatches(snapshot, changedRevision), false);

  const staleReplay = provenance({ currentness: "STALE" });
  assert.equal(aiMediatedProvenanceReplayMatches(snapshot, staleReplay), false);
  assert.equal(aiMediatedOrdinaryGenerationRemainsAvailable(evaluateAiMediatedWorkspace(snapshot)), true);
});

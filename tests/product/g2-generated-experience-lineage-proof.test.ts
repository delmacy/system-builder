import assert from "node:assert/strict";
import test from "node:test";
import {
  generatedExperienceArtifactAcceptanceEstablishesCanonicalTruth,
  generatedExperienceArtifactIsBounded,
  generatedExperienceArtifactRegenerationPreservesHistory,
  type GeneratedExperienceArtifact,
} from "../../packages/contracts/generated-experience/index.js";

const currentness = (state: "CURRENT" | "STALE" | "UNKNOWN" = "CURRENT") => ({
  state,
  assessedAt: "2026-09-14T12:00:00.000Z",
  validUntil: "2026-09-14T14:00:00.000Z",
}) as const;

function artifact(overrides: Partial<GeneratedExperienceArtifact> = {}): GeneratedExperienceArtifact {
  return {
    artifactRef: "artifact:work-order-summary",
    artifactRevisionRef: "artifact-revision:2",
    generatedAt: "2026-09-14T12:20:00.000Z",
    projectionRef: "projection:work-order-summary",
    projectionRevisionRef: "projection-revision:2",
    sourceRef: "workflow:work-order-42",
    sourceRevisionRef: "workflow-revision:10",
    state: "PARTIAL",
    currentness: currentness(),
    evidence: [{
      evidenceRef: "evidence:1",
      evidenceRevisionRef: "evidence-revision:1",
      sourceRef: "workflow:work-order-42",
      sourceRevisionRef: "workflow-revision:10",
      polarity: "UNRESOLVED",
    }],
    predecessorArtifactRevisionRef: "artifact-revision:1",
    ...overrides,
  };
}

test("PARTIAL UNKNOWN INCONCLUSIVE and stale remain explicit rather than normalized", () => {
  for (const state of ["PARTIAL", "UNKNOWN", "INCONCLUSIVE"] as const) {
    assert.equal(generatedExperienceArtifactIsBounded(artifact({ state })), true);
  }
  assert.equal(generatedExperienceArtifactIsBounded(artifact({ currentness: currentness("STALE") })), true);
  assert.equal(generatedExperienceArtifactIsBounded(artifact({ state: "KNOWN" })), false);
});

test("contradictory sources preserve their own lineage and must remain CONFLICTED", () => {
  const evidence = [
    { evidenceRef: "evidence:a", evidenceRevisionRef: "rev:a", sourceRef: "workflow:work-order-42", sourceRevisionRef: "workflow-revision:10", polarity: "AFFIRMS" as const },
    { evidenceRef: "evidence:b", evidenceRevisionRef: "rev:b", sourceRef: "ticket:incident-9", sourceRevisionRef: "ticket-revision:3", polarity: "NEGATES" as const },
  ];
  assert.equal(generatedExperienceArtifactIsBounded(artifact({ state: "CONFLICTED", evidence })), true);
  assert.equal(generatedExperienceArtifactIsBounded(artifact({ state: "KNOWN", evidence })), false);
});

test("lineage break is invalid and regeneration keeps historical revision addressable", () => {
  assert.equal(generatedExperienceArtifactIsBounded(artifact({
    evidence: [{ ...artifact().evidence[0]!, sourceRevisionRef: "" }],
  })), false);

  const previous = artifact({ artifactRevisionRef: "artifact-revision:2", predecessorArtifactRevisionRef: "artifact-revision:1" });
  const next = artifact({
    artifactRevisionRef: "artifact-revision:3",
    predecessorArtifactRevisionRef: "artifact-revision:2",
    projectionRevisionRef: "projection-revision:3",
    generatedAt: "2026-09-14T12:40:00.000Z",
  });
  assert.equal(generatedExperienceArtifactRegenerationPreservesHistory(previous, next), true);
  assert.equal(next.predecessorArtifactRevisionRef, previous.artifactRevisionRef);
});

test("rendering or user acceptance never canonicalizes generated content", () => {
  assert.equal(generatedExperienceArtifactAcceptanceEstablishesCanonicalTruth(artifact()), false);
});

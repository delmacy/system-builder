import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateGeneratedExperienceActionSurface,
  evaluateGeneratedExperienceProjection,
  generatedExperienceActionSurfaceDoesNotEstablishAuthority,
  generatedExperienceArtifactAcceptanceEstablishesCanonicalTruth,
  generatedExperienceArtifactIsBounded,
  generatedExperienceArtifactRegenerationPreservesHistory,
  generatedExperienceProjectionEstablishesCanonicalTruth,
  generatedExperienceRegenerationPreservesLineage,
  type GeneratedExperienceActionSurface,
  type GeneratedExperienceArtifact,
  type GeneratedExperienceProjection,
} from "../../packages/contracts/generated-experience/index.js";

const evaluatedAt = "2026-09-14T13:00:00.000Z";
const currentness = (state: "CURRENT" | "STALE" | "UNKNOWN" = "CURRENT") => ({
  state,
  assessedAt: "2026-09-14T12:00:00.000Z",
  validUntil: "2026-09-14T14:00:00.000Z",
}) as const;

function projection(overrides: Partial<GeneratedExperienceProjection> = {}): GeneratedExperienceProjection {
  const base: GeneratedExperienceProjection = {
    projectionRef: "projection:work-order-summary",
    projectionRevisionRef: "projection-revision:2",
    generatedAt: "2026-09-14T12:20:00.000Z",
    source: {
      sourceRef: "workflow:work-order-42",
      sourceRevisionRef: "workflow-revision:10",
      sourceAuthorityRef: "workflow-authority:primary",
      currentness: currentness(),
      completeness: "KNOWN",
      locality: { scope: "STATION", scopeRef: "station:porto-alegre" },
    },
    currentness: currentness(),
    completeness: "KNOWN",
    locality: { scope: "STATION", scopeRef: "station:porto-alegre" },
    lineage: {
      rootProjectionRef: "projection:work-order-summary",
      predecessorProjectionRevisionRef: "projection-revision:1",
    },
  };
  return { ...base, ...overrides };
}

function surface(overrides: Partial<GeneratedExperienceActionSurface> = {}): GeneratedExperienceActionSurface {
  const base: GeneratedExperienceActionSurface = {
    projection: projection(),
    actionSurfaceRef: "surface:work-order-summary:close",
    visibility: "VISIBLE",
    authority: {
      authorityRef: "authorization:work-order-close",
      authorityRevisionRef: "authorization-revision:4",
      decision: "GRANTED",
      currentness: currentness(),
    },
    domainAction: {
      actionContractRef: "workflow-action:close-work-order",
      actionContractRevisionRef: "workflow-action-revision:7",
      effectRef: "workflow-effect:close-work-order",
      eligibility: "ELIGIBLE",
      currentness: currentness(),
    },
    presentedCompleteness: "KNOWN",
  };
  return { ...base, ...overrides };
}

function artifact(overrides: Partial<GeneratedExperienceArtifact> = {}): GeneratedExperienceArtifact {
  const base: GeneratedExperienceArtifact = {
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
      evidenceRef: "evidence:workflow-42",
      evidenceRevisionRef: "evidence-revision:10",
      sourceRef: "workflow:work-order-42",
      sourceRevisionRef: "workflow-revision:10",
      polarity: "UNRESOLVED",
    }],
    predecessorArtifactRevisionRef: "artifact-revision:1",
  };
  return { ...base, ...overrides };
}

test("generated projection composes source identity, revision and currentness without becoming source truth", () => {
  const candidate = projection();
  assert.notEqual(candidate.projectionRef, candidate.source.sourceRef);
  assert.notEqual(candidate.projectionRevisionRef, candidate.source.sourceRevisionRef);
  assert.equal(evaluateGeneratedExperienceProjection(candidate, evaluatedAt), "CURRENT");
  assert.equal(generatedExperienceProjectionEstablishesCanonicalTruth(candidate), false);

  const staleSource = projection({ source: { ...candidate.source, currentness: currentness("STALE") } });
  const staleProjection = projection({ currentness: currentness("STALE") });
  assert.equal(evaluateGeneratedExperienceProjection(staleSource, evaluatedAt), "STALE");
  assert.equal(evaluateGeneratedExperienceProjection(staleProjection, evaluatedAt), "STALE");
});

test("visibility, authority and action eligibility stay independent at the coexistence boundary", () => {
  const visibleGranted = surface();
  assert.equal(evaluateGeneratedExperienceActionSurface(visibleGranted, evaluatedAt), "ELIGIBLE");
  assert.equal(generatedExperienceActionSurfaceDoesNotEstablishAuthority(visibleGranted), false);

  const hiddenGranted = surface({ visibility: "HIDDEN" });
  assert.equal(evaluateGeneratedExperienceActionSurface(hiddenGranted, evaluatedAt), "ELIGIBLE");
  assert.equal(hiddenGranted.authority.decision, "GRANTED");

  const visibleDenied = surface({ authority: { ...visibleGranted.authority, decision: "DENIED" } });
  assert.equal(evaluateGeneratedExperienceActionSurface(visibleDenied, evaluatedAt), "INELIGIBLE");
  assert.equal(visibleDenied.visibility, "VISIBLE");

  const domainIneligible = surface({ domainAction: { ...visibleGranted.domainAction, eligibility: "INELIGIBLE" } });
  assert.equal(evaluateGeneratedExperienceActionSurface(domainIneligible, evaluatedAt), "INELIGIBLE");
});

test("uncertain conflicted and stale evidence never strengthens generated action state", () => {
  const partialProjection = projection({
    source: { ...projection().source, completeness: "PARTIAL" },
    completeness: "PARTIAL",
  });
  assert.equal(evaluateGeneratedExperienceProjection(partialProjection, evaluatedAt), "PARTIAL");

  for (const completeness of ["UNKNOWN", "INCONCLUSIVE"] as const) {
    const unresolved = projection({
      source: { ...projection().source, completeness },
      completeness,
    });
    assert.equal(evaluateGeneratedExperienceProjection(unresolved, evaluatedAt), "RECONCILE_BEFORE_RETRY");
  }

  for (const decision of ["CONFLICTED", "UNKNOWN", "INCONCLUSIVE"] as const) {
    const unresolvedAuthority = surface({
      authority: { ...surface().authority, decision },
    });
    assert.equal(evaluateGeneratedExperienceActionSurface(unresolvedAuthority, evaluatedAt), "RECONCILE_BEFORE_RETRY");
  }

  const staleAuthority = surface({ authority: { ...surface().authority, currentness: currentness("STALE") } });
  assert.equal(evaluateGeneratedExperienceActionSurface(staleAuthority, evaluatedAt), "RECONCILE_BEFORE_RETRY");
});

test("regeneration preserves projection and artifact lineage while historical revisions remain distinct", () => {
  const previousProjection = projection({
    projectionRevisionRef: "projection-revision:1",
    generatedAt: "2026-09-14T12:00:00.000Z",
    source: { ...projection().source, sourceRevisionRef: "workflow-revision:9" },
    lineage: { rootProjectionRef: "projection:work-order-summary", predecessorProjectionRevisionRef: null },
  });
  const nextProjection = projection();
  assert.equal(generatedExperienceRegenerationPreservesLineage(previousProjection, nextProjection), true);
  assert.notEqual(previousProjection.projectionRevisionRef, nextProjection.projectionRevisionRef);

  const previousArtifact = artifact({
    artifactRevisionRef: "artifact-revision:1",
    generatedAt: "2026-09-14T12:05:00.000Z",
    projectionRevisionRef: "projection-revision:1",
    sourceRevisionRef: "workflow-revision:9",
    predecessorArtifactRevisionRef: null,
    evidence: [{
      evidenceRef: "evidence:workflow-42",
      evidenceRevisionRef: "evidence-revision:9",
      sourceRef: "workflow:work-order-42",
      sourceRevisionRef: "workflow-revision:9",
      polarity: "UNRESOLVED",
    }],
  });
  const nextArtifact = artifact();
  assert.equal(generatedExperienceArtifactIsBounded(previousArtifact), true);
  assert.equal(generatedExperienceArtifactIsBounded(nextArtifact), true);
  assert.equal(generatedExperienceArtifactRegenerationPreservesHistory(previousArtifact, nextArtifact), true);
  assert.notEqual(previousArtifact.artifactRevisionRef, nextArtifact.artifactRevisionRef);
  assert.equal(generatedExperienceArtifactAcceptanceEstablishesCanonicalTruth(nextArtifact), false);
});

test("conflicting evidence remains CONFLICTED and cannot be normalized into generated KNOWN truth", () => {
  const evidence = [
    {
      evidenceRef: "evidence:a",
      evidenceRevisionRef: "rev:a",
      sourceRef: "workflow:work-order-42",
      sourceRevisionRef: "workflow-revision:10",
      polarity: "AFFIRMS" as const,
    },
    {
      evidenceRef: "evidence:b",
      evidenceRevisionRef: "rev:b",
      sourceRef: "ticket:incident-9",
      sourceRevisionRef: "ticket-revision:3",
      polarity: "NEGATES" as const,
    },
  ];
  assert.equal(generatedExperienceArtifactIsBounded(artifact({ state: "CONFLICTED", evidence })), true);
  assert.equal(generatedExperienceArtifactIsBounded(artifact({ state: "KNOWN", evidence })), false);
});

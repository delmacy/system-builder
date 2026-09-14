import assert from "node:assert/strict";
import { describe, it } from "node:test";
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
} from "../../packages/contracts/generated-experience";

const at = "2026-09-14T15:00:00Z";
const currentness = {
  state: "CURRENT",
  assessedAt: "2026-09-14T14:00:00Z",
  validUntil: "2026-09-14T16:00:00Z",
} as const;

const projection: GeneratedExperienceProjection = {
  projectionRef: "projection:orders",
  projectionRevisionRef: "projection:orders@1",
  generatedAt: "2026-09-14T14:30:00Z",
  source: {
    sourceRef: "source:orders",
    sourceRevisionRef: "source:orders@7",
    sourceAuthorityRef: "authority:orders",
    currentness,
    completeness: "PARTIAL",
    locality: { scope: "STATION", scopeRef: "station:porto-alegre" },
  },
  currentness,
  completeness: "PARTIAL",
  locality: { scope: "STATION", scopeRef: "station:porto-alegre" },
  lineage: { rootProjectionRef: "projection:orders", predecessorProjectionRevisionRef: null },
};

const surface: GeneratedExperienceActionSurface = {
  projection,
  actionSurfaceRef: "surface:orders:approve",
  visibility: "VISIBLE",
  authority: {
    authorityRef: "authority:orders",
    authorityRevisionRef: "authority:orders@3",
    decision: "GRANTED",
    currentness,
  },
  domainAction: {
    actionContractRef: "action:orders:approve",
    actionContractRevisionRef: "action:orders:approve@5",
    effectRef: "effect:orders:approved",
    eligibility: "ELIGIBLE",
    currentness,
  },
  presentedCompleteness: "PARTIAL",
};

const artifact: GeneratedExperienceArtifact = {
  artifactRef: "artifact:orders",
  artifactRevisionRef: "artifact:orders@1",
  generatedAt: "2026-09-14T14:31:00Z",
  projectionRef: projection.projectionRef,
  projectionRevisionRef: projection.projectionRevisionRef,
  sourceRef: projection.source.sourceRef,
  sourceRevisionRef: projection.source.sourceRevisionRef,
  state: "CONFLICTED",
  currentness,
  evidence: [
    {
      evidenceRef: "evidence:orders:a",
      evidenceRevisionRef: "evidence:orders:a@1",
      sourceRef: projection.source.sourceRef,
      sourceRevisionRef: projection.source.sourceRevisionRef,
      polarity: "AFFIRMS",
    },
    {
      evidenceRef: "evidence:orders:b",
      evidenceRevisionRef: "evidence:orders:b@1",
      sourceRef: projection.source.sourceRef,
      sourceRevisionRef: projection.source.sourceRevisionRef,
      polarity: "NEGATES",
    },
  ],
  predecessorArtifactRevisionRef: null,
};

describe("G2 generated experience Construction A integrated semantics", () => {
  it("keeps projection identity, revision and currentness separate from source truth", () => {
    assert.notEqual(projection.projectionRef, projection.source.sourceRef);
    assert.notEqual(projection.projectionRevisionRef, projection.source.sourceRevisionRef);
    assert.equal(evaluateGeneratedExperienceProjection(projection, at), "PARTIAL");
    assert.equal(generatedExperienceProjectionEstablishesCanonicalTruth(projection), false);

    const staleProjection = {
      ...projection,
      currentness: { ...currentness, state: "STALE" as const },
    };
    assert.equal(evaluateGeneratedExperienceProjection(staleProjection, at), "STALE");
    assert.equal(evaluateGeneratedExperienceProjection(projection, at), "PARTIAL");
  });

  it("keeps visibility, authority and action eligibility independently evidence-bearing", () => {
    assert.equal(surface.visibility, "VISIBLE");
    assert.equal(evaluateGeneratedExperienceActionSurface(surface, at), "ELIGIBLE");
    assert.equal(generatedExperienceActionSurfaceDoesNotEstablishAuthority(surface), false);

    assert.equal(
      evaluateGeneratedExperienceActionSurface({ ...surface, visibility: "HIDDEN" }, at),
      "ELIGIBLE",
    );
    assert.equal(
      evaluateGeneratedExperienceActionSurface({
        ...surface,
        authority: { ...surface.authority, decision: "DENIED" },
      }, at),
      "INELIGIBLE",
    );
    assert.equal(
      evaluateGeneratedExperienceActionSurface({
        ...surface,
        domainAction: { ...surface.domainAction, eligibility: "UNKNOWN" },
      }, at),
      "RECONCILE_BEFORE_RETRY",
    );
  });

  it("preserves non-strengthening uncertain and conflicted state across the integrated boundary", () => {
    assert.equal(evaluateGeneratedExperienceProjection(projection, at), "PARTIAL");
    assert.equal(
      evaluateGeneratedExperienceProjection({
        ...projection,
        source: { ...projection.source, completeness: "UNKNOWN" },
        completeness: "UNKNOWN",
      }, at),
      "RECONCILE_BEFORE_RETRY",
    );
    assert.equal(
      evaluateGeneratedExperienceProjection({
        ...projection,
        source: { ...projection.source, completeness: "INCONCLUSIVE" },
        completeness: "INCONCLUSIVE",
      }, at),
      "RECONCILE_BEFORE_RETRY",
    );
    assert.equal(generatedExperienceArtifactIsBounded(artifact), true);
    assert.equal(artifact.state, "CONFLICTED");
    assert.equal(generatedExperienceArtifactAcceptanceEstablishesCanonicalTruth(artifact), false);
  });

  it("preserves projection and artifact history through regeneration without replacing source authority", () => {
    const regeneratedProjection: GeneratedExperienceProjection = {
      ...projection,
      projectionRevisionRef: "projection:orders@2",
      generatedAt: "2026-09-14T14:40:00Z",
      lineage: {
        rootProjectionRef: projection.lineage.rootProjectionRef,
        predecessorProjectionRevisionRef: projection.projectionRevisionRef,
      },
    };
    assert.equal(generatedExperienceRegenerationPreservesLineage(projection, regeneratedProjection), true);
    assert.notEqual(regeneratedProjection.projectionRevisionRef, projection.projectionRevisionRef);
    assert.equal(regeneratedProjection.source.sourceAuthorityRef, projection.source.sourceAuthorityRef);

    const regeneratedArtifact: GeneratedExperienceArtifact = {
      ...artifact,
      artifactRevisionRef: "artifact:orders@2",
      generatedAt: "2026-09-14T14:41:00Z",
      projectionRevisionRef: regeneratedProjection.projectionRevisionRef,
      predecessorArtifactRevisionRef: artifact.artifactRevisionRef,
    };
    assert.equal(generatedExperienceArtifactRegenerationPreservesHistory(artifact, regeneratedArtifact), true);
    assert.notEqual(regeneratedArtifact.artifactRevisionRef, artifact.artifactRevisionRef);
    assert.equal(generatedExperienceArtifactAcceptanceEstablishesCanonicalTruth(regeneratedArtifact), false);
  });

  it("keeps coexistence compatibility at the contract boundary without making readiness claims", () => {
    assert.equal(evaluateGeneratedExperienceActionSurface(surface, at), "ELIGIBLE");
    assert.equal(surface.projection.locality?.scope, "STATION");
    assert.equal(surface.projection.locality?.scopeRef, "station:porto-alegre");
    assert.equal(generatedExperienceProjectionEstablishesCanonicalTruth(surface.projection), false);
    assert.equal(generatedExperienceArtifactAcceptanceEstablishesCanonicalTruth(artifact), false);
  });
});

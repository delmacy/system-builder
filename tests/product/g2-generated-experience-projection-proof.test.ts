import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateGeneratedExperienceProjection,
  generatedExperienceProjectionDoesNotStrengthenSource,
  generatedExperienceProjectionEstablishesCanonicalTruth,
  generatedExperienceProjectionIdentityCollides,
  generatedExperienceProjectionIdentityIsDistinct,
  generatedExperienceProjectionPreservesLocality,
  generatedExperienceRegenerationPreservesLineage,
  type GeneratedExperienceProjection,
} from "../../packages/contracts/generated-experience/index.js";

const currentness = (state: "CURRENT" | "STALE" | "UNKNOWN" = "CURRENT") => ({
  state,
  assessedAt: "2026-09-14T10:00:00.000Z",
  validUntil: "2026-09-14T12:00:00.000Z",
}) as const;

function projection(overrides: Partial<GeneratedExperienceProjection> = {}): GeneratedExperienceProjection {
  const base: GeneratedExperienceProjection = {
    projectionRef: "projection:work-order-summary",
    projectionRevisionRef: "projection-revision:1",
    generatedAt: "2026-09-14T10:15:00.000Z",
    source: {
      sourceRef: "workflow:work-order-42",
      sourceRevisionRef: "workflow-revision:9",
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
      predecessorProjectionRevisionRef: null,
    },
  };
  return { ...base, ...overrides };
}

const evaluatedAt = "2026-09-14T10:30:00.000Z";

test("projection identity is distinct from canonical source identity and never establishes canonical truth", () => {
  const candidate = projection();
  assert.equal(generatedExperienceProjectionIdentityIsDistinct(candidate), true);
  assert.equal(generatedExperienceProjectionEstablishesCanonicalTruth(candidate), false);
  assert.equal(evaluateGeneratedExperienceProjection(candidate, evaluatedAt), "CURRENT");

  const collidedWithSource = projection({ projectionRef: "workflow:work-order-42", lineage: { rootProjectionRef: "workflow:work-order-42", predecessorProjectionRevisionRef: null } });
  assert.equal(generatedExperienceProjectionIdentityIsDistinct(collidedWithSource), false);
  assert.equal(evaluateGeneratedExperienceProjection(collidedWithSource, evaluatedAt), "INVALID");
});

test("source and projection currentness are independent and either may make the projection stale", () => {
  const staleSource = projection({
    source: { ...projection().source, currentness: currentness("STALE") },
  });
  const staleProjection = projection({ currentness: currentness("STALE") });

  assert.equal(evaluateGeneratedExperienceProjection(staleSource, evaluatedAt), "STALE");
  assert.equal(evaluateGeneratedExperienceProjection(staleProjection, evaluatedAt), "STALE");
});

test("PARTIAL, UNKNOWN and INCONCLUSIVE source evidence cannot be rendered as stronger truth", () => {
  const partialSource = projection({
    source: { ...projection().source, completeness: "PARTIAL" },
    completeness: "PARTIAL",
  });
  assert.equal(generatedExperienceProjectionDoesNotStrengthenSource(partialSource), true);
  assert.equal(evaluateGeneratedExperienceProjection(partialSource, evaluatedAt), "PARTIAL");

  const strengthenedPartial = projection({
    source: { ...projection().source, completeness: "PARTIAL" },
    completeness: "KNOWN",
  });
  assert.equal(generatedExperienceProjectionDoesNotStrengthenSource(strengthenedPartial), false);
  assert.equal(evaluateGeneratedExperienceProjection(strengthenedPartial, evaluatedAt), "INVALID");

  const unknownSource = projection({
    source: { ...projection().source, completeness: "UNKNOWN" },
    completeness: "UNKNOWN",
  });
  assert.equal(evaluateGeneratedExperienceProjection(unknownSource, evaluatedAt), "RECONCILE_BEFORE_RETRY");

  const inconclusiveSource = projection({
    source: { ...projection().source, completeness: "INCONCLUSIVE" },
    completeness: "INCONCLUSIVE",
  });
  assert.equal(evaluateGeneratedExperienceProjection(inconclusiveSource, evaluatedAt), "RECONCILE_BEFORE_RETRY");
});

test("missing source evidence remains unknown and requires reconciliation", () => {
  const missing = projection({
    source: {
      ...projection().source,
      sourceRevisionRef: "",
      completeness: "UNKNOWN",
      currentness: currentness("UNKNOWN"),
    },
    completeness: "UNKNOWN",
  });
  assert.equal(evaluateGeneratedExperienceProjection(missing, evaluatedAt), "INVALID");

  const unresolved = projection({
    source: {
      ...projection().source,
      completeness: "UNKNOWN",
      currentness: currentness("UNKNOWN"),
    },
    completeness: "UNKNOWN",
  });
  assert.equal(evaluateGeneratedExperienceProjection(unresolved, evaluatedAt), "RECONCILE_BEFORE_RETRY");
});

test("local, Station and Fleet qualification is preserved instead of being invented by projection", () => {
  const station = projection();
  assert.equal(generatedExperienceProjectionPreservesLocality(station), true);

  const fleet = projection({
    source: { ...projection().source, locality: { scope: "FLEET", scopeRef: "fleet:south" } },
    locality: { scope: "FLEET", scopeRef: "fleet:south" },
  });
  assert.equal(generatedExperienceProjectionPreservesLocality(fleet), true);

  const strengthenedLocality = projection({ locality: { scope: "LOCAL", scopeRef: "local:browser" } });
  assert.equal(generatedExperienceProjectionPreservesLocality(strengthenedLocality), false);
  assert.equal(evaluateGeneratedExperienceProjection(strengthenedLocality, evaluatedAt), "INVALID");
});

test("regeneration appends immutable revision lineage rather than rewriting history", () => {
  const first = projection();
  const second = projection({
    projectionRevisionRef: "projection-revision:2",
    generatedAt: "2026-09-14T10:45:00.000Z",
    source: { ...first.source, sourceRevisionRef: "workflow-revision:10" },
    lineage: {
      rootProjectionRef: first.projectionRef,
      predecessorProjectionRevisionRef: first.projectionRevisionRef,
    },
  });
  assert.equal(generatedExperienceRegenerationPreservesLineage(first, second), true);
  assert.equal(first.projectionRevisionRef, "projection-revision:1");
  assert.equal(first.lineage.predecessorProjectionRevisionRef, null);

  const rewritten = projection({
    projectionRevisionRef: "projection-revision:2",
    generatedAt: "2026-09-14T10:45:00.000Z",
    lineage: { rootProjectionRef: first.projectionRef, predecessorProjectionRevisionRef: "projection-revision:0" },
  });
  assert.equal(generatedExperienceRegenerationPreservesLineage(first, rewritten), false);
});

test("projection-ID collision is detected across unrelated source lineages", () => {
  const first = projection();
  const collision = projection({
    source: { ...first.source, sourceRef: "workflow:work-order-99" },
  });
  assert.equal(generatedExperienceProjectionIdentityCollides(first, collision), true);

  const legitimateNextRevision = projection({
    projectionRevisionRef: "projection-revision:2",
    generatedAt: "2026-09-14T10:45:00.000Z",
    lineage: { rootProjectionRef: first.projectionRef, predecessorProjectionRevisionRef: first.projectionRevisionRef },
  });
  assert.equal(generatedExperienceProjectionIdentityCollides(first, legitimateNextRevision), false);
});

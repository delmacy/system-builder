import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateGeneratedExperienceActionSurface,
  generatedExperienceActionSurfaceDoesNotEstablishAuthority,
  generatedExperienceActionSurfaceDoesNotStrengthenStatus,
  type GeneratedExperienceActionSurface,
  type GeneratedExperienceProjection,
} from "../../packages/contracts/generated-experience/index.js";

const currentness = (state: "CURRENT" | "STALE" | "UNKNOWN" = "CURRENT") => ({
  state,
  assessedAt: "2026-09-14T12:00:00.000Z",
  validUntil: "2026-09-14T14:00:00.000Z",
}) as const;

function projection(overrides: Partial<GeneratedExperienceProjection> = {}): GeneratedExperienceProjection {
  const base: GeneratedExperienceProjection = {
    projectionRef: "projection:work-order-summary",
    projectionRevisionRef: "projection-revision:2",
    generatedAt: "2026-09-14T12:15:00.000Z",
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
    actionSurfaceRef: "surface:approve-work-order",
    visibility: "VISIBLE",
    authority: {
      authorityRef: "authz:work-order-approver",
      authorityRevisionRef: "authz-revision:7",
      decision: "GRANTED",
      currentness: currentness(),
    },
    domainAction: {
      actionContractRef: "workflow-action:approve-work-order",
      actionContractRevisionRef: "workflow-action-revision:4",
      effectRef: "workflow-effect:approve",
      eligibility: "ELIGIBLE",
      currentness: currentness(),
    },
    presentedCompleteness: "KNOWN",
  };
  return { ...base, ...overrides };
}

const evaluatedAt = "2026-09-14T12:30:00.000Z";

test("visibility is presentation only and cannot grant or revoke canonical authority", () => {
  const visibleDenied = surface({
    visibility: "VISIBLE",
    authority: { ...surface().authority, decision: "DENIED" },
  });
  assert.equal(generatedExperienceActionSurfaceDoesNotEstablishAuthority(visibleDenied), false);
  assert.equal(evaluateGeneratedExperienceActionSurface(visibleDenied, evaluatedAt), "INELIGIBLE");

  const hiddenGranted = surface({ visibility: "HIDDEN" });
  assert.equal(evaluateGeneratedExperienceActionSurface(hiddenGranted, evaluatedAt), "ELIGIBLE");
});

test("authorized-but-stale evidence reconciles before any mutating eligibility is claimed", () => {
  const staleAuthority = surface({
    authority: { ...surface().authority, currentness: currentness("STALE") },
  });
  assert.equal(evaluateGeneratedExperienceActionSurface(staleAuthority, evaluatedAt), "RECONCILE_BEFORE_RETRY");

  const staleDomainContract = surface({
    domainAction: { ...surface().domainAction, currentness: currentness("STALE") },
  });
  assert.equal(evaluateGeneratedExperienceActionSurface(staleDomainContract, evaluatedAt), "RECONCILE_BEFORE_RETRY");
});

test("conflicting, unknown and inconclusive authority evidence never strengthens to eligible", () => {
  for (const decision of ["CONFLICTED", "UNKNOWN", "INCONCLUSIVE"] as const) {
    const candidate = surface({ authority: { ...surface().authority, decision } });
    assert.equal(evaluateGeneratedExperienceActionSurface(candidate, evaluatedAt), "RECONCILE_BEFORE_RETRY");
  }

  for (const eligibility of ["UNKNOWN", "INCONCLUSIVE"] as const) {
    const candidate = surface({ domainAction: { ...surface().domainAction, eligibility } });
    assert.equal(evaluateGeneratedExperienceActionSurface(candidate, evaluatedAt), "RECONCILE_BEFORE_RETRY");
  }
});

test("stale projection blocks action strengthening even when authority and domain eligibility are current", () => {
  const staleProjection = surface({ projection: projection({ currentness: currentness("STALE") }) });
  assert.equal(evaluateGeneratedExperienceActionSurface(staleProjection, evaluatedAt), "RECONCILE_BEFORE_RETRY");

  const unknownProjection = surface({
    projection: projection({
      source: { ...projection().source, completeness: "UNKNOWN", currentness: currentness("UNKNOWN") },
      completeness: "UNKNOWN",
    }),
    presentedCompleteness: "UNKNOWN",
  });
  assert.equal(evaluateGeneratedExperienceActionSurface(unknownProjection, evaluatedAt), "RECONCILE_BEFORE_RETRY");
});

test("generated labels and status cannot upgrade underlying projection evidence", () => {
  const partialProjection = projection({
    source: { ...projection().source, completeness: "PARTIAL" },
    completeness: "PARTIAL",
  });
  const strengthenedLabel = surface({
    projection: partialProjection,
    presentedCompleteness: "KNOWN",
  });
  assert.equal(generatedExperienceActionSurfaceDoesNotStrengthenStatus(strengthenedLabel), false);
  assert.equal(evaluateGeneratedExperienceActionSurface(strengthenedLabel, evaluatedAt), "INVALID");

  const boundedLabel = surface({
    projection: partialProjection,
    presentedCompleteness: "PARTIAL",
  });
  assert.equal(generatedExperienceActionSurfaceDoesNotStrengthenStatus(boundedLabel), true);
  assert.equal(evaluateGeneratedExperienceActionSurface(boundedLabel, evaluatedAt), "ELIGIBLE");
});

test("canonical domain eligibility remains an independent gate from generated presentation", () => {
  const domainDenied = surface({
    visibility: "VISIBLE",
    domainAction: { ...surface().domainAction, eligibility: "INELIGIBLE" },
  });
  assert.equal(evaluateGeneratedExperienceActionSurface(domainDenied, evaluatedAt), "INELIGIBLE");

  const malformedReference = surface({
    domainAction: { ...surface().domainAction, actionContractRef: "" },
  });
  assert.equal(evaluateGeneratedExperienceActionSurface(malformedReference, evaluatedAt), "INVALID");
});

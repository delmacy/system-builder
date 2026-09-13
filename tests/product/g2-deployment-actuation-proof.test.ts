import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  providerAcknowledgementEstablishesActuationOutcome,
  providerAcknowledgementEstablishesEffectiveGeneration,
  reconciliationEstablishesApplied,
  retryDispositionAfterReconciliation,
  retryDispositionForActuation,
  rollbackActuationEstablishesReleaseRollbackEligibility,
  type DeploymentActuationReconciliation,
  type DeploymentActuationResult,
} from "../../packages/contracts/deployment-runtime/deployment-actuation";

const currentness = {
  state: "CURRENT" as const,
  assessedAt: "2026-09-13T20:00:00.000Z",
  validUntil: "2026-09-13T22:00:00.000Z",
};

const base: DeploymentActuationResult = {
  deploymentRef: "deployment:orders",
  deploymentRevisionRef: "deployment:orders@8",
  environmentRef: "environment:prod",
  desiredGeneration: 8,
  actuationRef: "actuation:orders:8:1",
  providerRef: "provider:a",
  providerOperationRef: "operation:123",
  providerAcknowledged: true,
  outcome: "APPLIED",
};

const reconciliation: DeploymentActuationReconciliation = {
  actuationRef: base.actuationRef,
  desiredGeneration: 8,
  observedGeneration: 8,
  observedCurrentness: currentness,
  effectiveGeneration: 8,
  effectiveCurrentness: currentness,
  evidence: "KNOWN",
  evaluatedAt: "2026-09-13T21:00:00.000Z",
};

describe("G2 deployment actuation reconciliation", () => {
  it("keeps provider acknowledgement separate from actuation and effective truth", () => {
    assert.equal(providerAcknowledgementEstablishesActuationOutcome(base), false);
    assert.equal(providerAcknowledgementEstablishesEffectiveGeneration(base), false);

    const staleAck = { ...base, desiredGeneration: 9, outcome: "UNKNOWN" as const };
    assert.equal(staleAck.providerAcknowledged, true);
    assert.equal(retryDispositionForActuation(staleAck), "RECONCILE_BEFORE_RETRY");
  });

  it("requires reconcile-before-retry for timeout-after-apply", () => {
    const timeout = { ...base, outcome: "UNKNOWN" as const };
    assert.equal(retryDispositionForActuation(timeout), "RECONCILE_BEFORE_RETRY");
    assert.equal(reconciliationEstablishesApplied(timeout, reconciliation), true);
    assert.equal(retryDispositionAfterReconciliation(timeout, reconciliation), "NO_RETRY");
  });

  it("does not strengthen PARTIAL or independently stale/unknown currentness", () => {
    const partial = { ...base, outcome: "PARTIAL" as const };
    assert.equal(retryDispositionForActuation(partial), "RECONCILE_BEFORE_RETRY");
    assert.equal(
      retryDispositionAfterReconciliation(partial, { ...reconciliation, evidence: "PARTIAL" }),
      "RECONCILE_BEFORE_RETRY",
    );
    assert.equal(
      retryDispositionAfterReconciliation(partial, {
        ...reconciliation,
        observedCurrentness: { ...currentness, state: "STALE" },
      }),
      "RECONCILE_BEFORE_RETRY",
    );
    assert.equal(
      retryDispositionAfterReconciliation(partial, {
        ...reconciliation,
        effectiveCurrentness: { ...currentness, state: "UNKNOWN" },
      }),
      "RECONCILE_BEFORE_RETRY",
    );
  });

  it("allows retry only after qualified current evidence proves both generations remain older", () => {
    const unknown = { ...base, outcome: "UNKNOWN" as const };
    const notApplied = {
      ...reconciliation,
      observedGeneration: 7,
      effectiveGeneration: 7,
    };
    assert.equal(reconciliationEstablishesApplied(unknown, notApplied), false);
    assert.equal(retryDispositionAfterReconciliation(unknown, notApplied), "RETRY_ALLOWED");
  });

  it("never retries an obsolete generation when a later generation is observed or effective", () => {
    const unknown = { ...base, outcome: "UNKNOWN" as const };
    const laterGeneration = {
      ...reconciliation,
      observedGeneration: 9,
      effectiveGeneration: 9,
    };
    assert.equal(reconciliationEstablishesApplied(unknown, laterGeneration), false);
    assert.equal(retryDispositionAfterReconciliation(unknown, laterGeneration), "NO_RETRY");
  });

  it("keeps mixed generation evidence non-authoritative until reconciled", () => {
    const unknown = { ...base, outcome: "UNKNOWN" as const };
    assert.equal(
      retryDispositionAfterReconciliation(unknown, {
        ...reconciliation,
        observedGeneration: 7,
        effectiveGeneration: 8,
      }),
      "RECONCILE_BEFORE_RETRY",
    );
  });

  it("blocks duplicate retry after known application", () => {
    assert.equal(retryDispositionForActuation(base), "NO_RETRY");
    assert.equal(retryDispositionAfterReconciliation(base, reconciliation), "NO_RETRY");
  });

  it("keeps rollback actuation distinct from release rollback eligibility", () => {
    assert.equal(rollbackActuationEstablishesReleaseRollbackEligibility(base), false);
  });
});

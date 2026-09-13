import type { DeploymentCurrentness } from "./deployment-generation";

export const DEPLOYMENT_ACTUATION_CONTRACT_VERSION = "1.0.0" as const;

export type DeploymentActuationOutcome = "APPLIED" | "NOT_APPLIED" | "PARTIAL" | "UNKNOWN";
export type DeploymentRetryDisposition = "NO_RETRY" | "RETRY_ALLOWED" | "RECONCILE_BEFORE_RETRY";

export type DeploymentActuationResult = Readonly<{
  deploymentRef: string;
  deploymentRevisionRef: string;
  environmentRef: string;
  desiredGeneration: number;
  actuationRef: string;
  providerRef: string | null;
  providerOperationRef: string | null;
  providerAcknowledged: boolean;
  outcome: DeploymentActuationOutcome;
}>;

export type DeploymentActuationReconciliation = Readonly<{
  actuationRef: string;
  desiredGeneration: number;
  observedGeneration: number | null;
  observedCurrentness: DeploymentCurrentness;
  effectiveGeneration: number | null;
  effectiveCurrentness: DeploymentCurrentness;
  evidence: "KNOWN" | "PARTIAL" | "UNKNOWN" | "INCONCLUSIVE";
  evaluatedAt: string;
}>;

const validGeneration = (value: number | null): value is number =>
  value !== null && Number.isSafeInteger(value) && value >= 0;

const validTime = (value: string): boolean => Number.isFinite(Date.parse(value));

function currentAt(currentness: DeploymentCurrentness, evaluatedAt: string): boolean {
  if (
    currentness.state !== "CURRENT"
    || !validTime(evaluatedAt)
    || !validTime(currentness.assessedAt)
    || !validTime(currentness.validUntil)
  ) return false;

  const at = Date.parse(evaluatedAt);
  return at >= Date.parse(currentness.assessedAt) && at <= Date.parse(currentness.validUntil);
}

function reconciliationIsQualifiedCurrent(
  reconciliation: DeploymentActuationReconciliation,
): boolean {
  return reconciliation.evidence === "KNOWN"
    && currentAt(reconciliation.observedCurrentness, reconciliation.evaluatedAt)
    && currentAt(reconciliation.effectiveCurrentness, reconciliation.evaluatedAt);
}

export function providerAcknowledgementEstablishesActuationOutcome(
  result: DeploymentActuationResult,
): false {
  void result;
  return false;
}

export function providerAcknowledgementEstablishesEffectiveGeneration(
  result: DeploymentActuationResult,
): false {
  void result;
  return false;
}

export function retryDispositionForActuation(
  result: DeploymentActuationResult,
): DeploymentRetryDisposition {
  switch (result.outcome) {
    case "APPLIED":
      return "NO_RETRY";
    case "NOT_APPLIED":
      return "RETRY_ALLOWED";
    case "PARTIAL":
    case "UNKNOWN":
      return "RECONCILE_BEFORE_RETRY";
  }
}

export function reconciliationEstablishesApplied(
  result: DeploymentActuationResult,
  reconciliation: DeploymentActuationReconciliation,
): boolean {
  if (result.actuationRef !== reconciliation.actuationRef) return false;
  if (result.desiredGeneration !== reconciliation.desiredGeneration) return false;
  if (!reconciliationIsQualifiedCurrent(reconciliation)) return false;
  if (!validGeneration(reconciliation.observedGeneration) || !validGeneration(reconciliation.effectiveGeneration)) return false;

  return reconciliation.observedGeneration === result.desiredGeneration
    && reconciliation.effectiveGeneration === result.desiredGeneration;
}

export function retryDispositionAfterReconciliation(
  result: DeploymentActuationResult,
  reconciliation: DeploymentActuationReconciliation,
): DeploymentRetryDisposition {
  const initial = retryDispositionForActuation(result);
  if (initial !== "RECONCILE_BEFORE_RETRY") return initial;

  if (result.actuationRef !== reconciliation.actuationRef) return "RECONCILE_BEFORE_RETRY";
  if (result.desiredGeneration !== reconciliation.desiredGeneration) return "RECONCILE_BEFORE_RETRY";
  if (!reconciliationIsQualifiedCurrent(reconciliation)) return "RECONCILE_BEFORE_RETRY";
  if (!validGeneration(reconciliation.observedGeneration) || !validGeneration(reconciliation.effectiveGeneration)) {
    return "RECONCILE_BEFORE_RETRY";
  }

  if (reconciliationEstablishesApplied(result, reconciliation)) return "NO_RETRY";

  if (
    reconciliation.observedGeneration > result.desiredGeneration
    || reconciliation.effectiveGeneration > result.desiredGeneration
  ) {
    return "NO_RETRY";
  }

  if (
    reconciliation.observedGeneration < result.desiredGeneration
    && reconciliation.effectiveGeneration < result.desiredGeneration
  ) {
    return "RETRY_ALLOWED";
  }

  return "RECONCILE_BEFORE_RETRY";
}

export function rollbackActuationEstablishesReleaseRollbackEligibility(
  result: DeploymentActuationResult,
): false {
  void result;
  return false;
}

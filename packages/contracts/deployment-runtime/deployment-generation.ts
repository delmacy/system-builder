export const DEPLOYMENT_GENERATION_CONTRACT_VERSION = "1.0.0" as const;

export type DeploymentEvidenceCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN" | "INCONCLUSIVE";
export type DeploymentCurrentnessState = "CURRENT" | "STALE" | "UNKNOWN";
export type DeploymentConvergenceVerdict = "CONVERGED" | "NOT_CONVERGED" | "RECONCILE_BEFORE_RETRY";

export type DeploymentCurrentness = Readonly<{
  state: DeploymentCurrentnessState;
  assessedAt: string;
  validUntil: string;
}>;

export type CanonicalDeploymentIntent = Readonly<{
  deploymentRef: string;
  deploymentRevisionRef: string;
  environmentRef: string;
  releaseRef: string;
  releaseRevisionRef: string;
  desiredGeneration: number;
  sourceOfTruthRef: string;
}>;

export type DeploymentRuntimeObservation = Readonly<{
  deploymentRef: string;
  deploymentRevisionRef: string;
  environmentRef: string;
  providerRef: string | null;
  providerResourceId: string | null;
  processId: string | null;
  observedGeneration: number | null;
  observedCurrentness: DeploymentCurrentness;
  effectiveGeneration: number | null;
  effectiveCurrentness: DeploymentCurrentness;
  completeness: DeploymentEvidenceCompleteness;
}>;

const nonEmpty = (value: string | null): value is string => typeof value === "string" && value.trim().length > 0;
const validGeneration = (value: number | null): value is number => value !== null && Number.isSafeInteger(value) && value >= 0;
const validTime = (value: string): boolean => Number.isFinite(Date.parse(value));

function currentAt(currentness: DeploymentCurrentness, evaluatedAt: string): boolean {
  if (currentness.state !== "CURRENT" || !validTime(evaluatedAt) || !validTime(currentness.assessedAt) || !validTime(currentness.validUntil)) return false;
  const at = Date.parse(evaluatedAt);
  return at >= Date.parse(currentness.assessedAt) && at <= Date.parse(currentness.validUntil);
}

export function deploymentIdentityMatches(intent: CanonicalDeploymentIntent, observation: DeploymentRuntimeObservation): boolean {
  return intent.deploymentRef === observation.deploymentRef
    && intent.deploymentRevisionRef === observation.deploymentRevisionRef
    && intent.environmentRef === observation.environmentRef;
}

export function evaluateDeploymentConvergence(intent: CanonicalDeploymentIntent, observation: DeploymentRuntimeObservation, evaluatedAt: string): DeploymentConvergenceVerdict {
  if (
    observation.completeness === "UNKNOWN"
    || observation.completeness === "INCONCLUSIVE"
    || observation.observedCurrentness.state === "UNKNOWN"
    || observation.effectiveCurrentness.state === "UNKNOWN"
  ) return "RECONCILE_BEFORE_RETRY";

  if (
    observation.completeness !== "KNOWN"
    || !currentAt(observation.observedCurrentness, evaluatedAt)
    || !currentAt(observation.effectiveCurrentness, evaluatedAt)
  ) return "NOT_CONVERGED";

  if (!nonEmpty(intent.deploymentRef) || !nonEmpty(intent.deploymentRevisionRef) || !nonEmpty(intent.environmentRef) || !nonEmpty(intent.releaseRef) || !nonEmpty(intent.releaseRevisionRef) || !nonEmpty(intent.sourceOfTruthRef)) return "NOT_CONVERGED";
  if (!validGeneration(intent.desiredGeneration) || !validGeneration(observation.observedGeneration) || !validGeneration(observation.effectiveGeneration)) return "NOT_CONVERGED";
  if (!deploymentIdentityMatches(intent, observation)) return "NOT_CONVERGED";

  return intent.desiredGeneration === observation.observedGeneration && intent.desiredGeneration === observation.effectiveGeneration
    ? "CONVERGED"
    : "NOT_CONVERGED";
}

export function providerAcknowledgementEstablishesEffectiveRuntime(observation: DeploymentRuntimeObservation): false {
  void observation;
  return false;
}

export function providerResourceIdentityEstablishesCanonicalDeploymentIdentity(observation: DeploymentRuntimeObservation): false {
  void observation;
  return false;
}

export function processIdentityEstablishesCanonicalDeploymentIdentity(observation: DeploymentRuntimeObservation): false {
  void observation;
  return false;
}

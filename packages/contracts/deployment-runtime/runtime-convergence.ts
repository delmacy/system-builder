import type {
  CanonicalDeploymentIntent,
  DeploymentCurrentness,
  DeploymentEvidenceCompleteness,
  DeploymentRuntimeObservation,
} from "./deployment-generation";
import { deploymentIdentityMatches, evaluateDeploymentConvergence } from "./deployment-generation";

export const RUNTIME_CONVERGENCE_CONTRACT_VERSION = "1.0.0" as const;

export type RuntimeConvergenceVerdict = "CONVERGED" | "NOT_CONVERGED" | "RECONCILE";
export type RuntimeAutonomyState = "RETAINED" | "DEPENDENT" | "UNKNOWN";
export type RuntimeCohortKind = "REPLICA" | "ROUTE" | "SESSION" | "CACHE" | "WORKER";
export type RuntimeCohortDisposition = "ACTIVE" | "DRAINING" | "DRAINED" | "RETAINED" | "UNKNOWN";
export type RuntimeTransitionDirection = "ROLL_FORWARD" | "ROLLBACK";

export type RuntimeResidualCohort = Readonly<{
  cohortRef: string;
  kind: RuntimeCohortKind;
  generation: number | null;
  population: number | null;
  currentness: DeploymentCurrentness;
  completeness: DeploymentEvidenceCompleteness;
  disposition: RuntimeCohortDisposition;
}>;

export type RuntimeCoexistence = Readonly<{
  sourceOfTruthRef: string;
  direction: RuntimeTransitionDirection;
  priorGeneration: number | null;
  targetGeneration: number;
  actuationQualified: boolean;
  releaseEligibilityQualified: boolean;
  stateDataRecoveryQualified: boolean;
}>;

export type RuntimeConvergenceEvidence = Readonly<{
  observation: DeploymentRuntimeObservation;
  autonomy: RuntimeAutonomyState;
  controlPlaneAvailable: boolean;
  coexistence: RuntimeCoexistence | null;
  residualCohorts: readonly RuntimeResidualCohort[];
}>;

const validTime = (value: string): boolean => Number.isFinite(Date.parse(value));
const currentAt = (currentness: DeploymentCurrentness, evaluatedAt: string): boolean => {
  if (currentness.state !== "CURRENT" || !validTime(evaluatedAt) || !validTime(currentness.assessedAt) || !validTime(currentness.validUntil)) return false;
  const at = Date.parse(evaluatedAt);
  return at >= Date.parse(currentness.assessedAt) && at <= Date.parse(currentness.validUntil);
};

const knownPopulation = (value: number | null): value is number => value !== null && Number.isSafeInteger(value) && value >= 0;
const validGeneration = (value: number | null): value is number => value !== null && Number.isSafeInteger(value) && value >= 0;

export function cohortDrainageQualified(cohort: RuntimeResidualCohort, evaluatedAt: string): boolean {
  if (cohort.completeness !== "KNOWN") return false;
  if (!currentAt(cohort.currentness, evaluatedAt)) return false;
  if (!knownPopulation(cohort.population)) return false;
  return cohort.population === 0 && cohort.disposition === "DRAINED";
}

export function residualRuntimeVisible(cohort: RuntimeResidualCohort, evaluatedAt: string): boolean {
  return !cohortDrainageQualified(cohort, evaluatedAt);
}

export function evaluateRuntimeConvergence(
  intent: CanonicalDeploymentIntent,
  evidence: RuntimeConvergenceEvidence,
  evaluatedAt: string,
): RuntimeConvergenceVerdict {
  const base = evaluateDeploymentConvergence(intent, evidence.observation, evaluatedAt);
  if (base === "RECONCILE_BEFORE_RETRY") return "RECONCILE";
  if (base !== "CONVERGED") return "NOT_CONVERGED";
  if (!deploymentIdentityMatches(intent, evidence.observation)) return "NOT_CONVERGED";
  if (evidence.autonomy === "UNKNOWN") return "RECONCILE";
  if (evidence.autonomy !== "RETAINED") return "NOT_CONVERGED";

  if (evidence.coexistence) {
    const c = evidence.coexistence;
    if (c.sourceOfTruthRef !== intent.sourceOfTruthRef || c.targetGeneration !== intent.desiredGeneration) return "NOT_CONVERGED";
    if (!validGeneration(c.priorGeneration) || !validGeneration(c.targetGeneration)) return "NOT_CONVERGED";
    if (c.direction === "ROLL_FORWARD" && c.priorGeneration >= c.targetGeneration) return "NOT_CONVERGED";
    if (c.direction === "ROLLBACK" && c.priorGeneration <= c.targetGeneration) return "NOT_CONVERGED";
    if (!c.actuationQualified || !c.releaseEligibilityQualified || !c.stateDataRecoveryQualified) return "NOT_CONVERGED";
  }

  for (const cohort of evidence.residualCohorts) {
    if (cohort.completeness === "UNKNOWN" || cohort.completeness === "INCONCLUSIVE" || cohort.currentness.state === "UNKNOWN") return "RECONCILE";
    if (residualRuntimeVisible(cohort, evaluatedAt)) return "NOT_CONVERGED";
  }

  return "CONVERGED";
}

export function retainedAutonomyRequiresControlPlaneAvailability(evidence: RuntimeConvergenceEvidence): false {
  void evidence;
  return false;
}

export function providerAcknowledgementEstablishesRuntimeConvergence(): false {
  return false;
}

export function desiredStateEstablishesRuntimeConvergence(): false {
  return false;
}

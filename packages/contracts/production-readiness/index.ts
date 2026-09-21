export const PRODUCTION_READINESS_DIMENSIONS = [
  "OBSERVABILITY",
  "OWNERSHIP",
  "FAILURE_HANDLING",
  "RECOVERY",
  "CAPACITY",
  "CURRENTNESS",
  "SECURITY",
  "RECONCILIATION",
  "CHANGE_SAFETY",
  "COST",
  "DOCUMENTATION",
] as const;

export type ProductionReadinessDimension =
  (typeof PRODUCTION_READINESS_DIMENSIONS)[number];

export type ProductionReadinessState =
  | "UNKNOWN"
  | "PARTIAL"
  | "PASS"
  | "FAIL"
  | "INCONCLUSIVE"
  | "BLOCKED"
  | "NA"
  | "DEFERRED";

export interface ProductionReadinessQualification {
  population: string;
  environment: string;
  currentness: "CURRENT" | "STALE" | "UNKNOWN";
}

export interface ProductionReadinessEvidenceRef {
  id: string;
  revision: string;
  producer: string;
  provenance: string;
  qualification: ProductionReadinessQualification;
}

export interface ProductionReadinessDimensionAssessment {
  dimension: ProductionReadinessDimension;
  state: ProductionReadinessState;
  qualification: ProductionReadinessQualification;
  evidence: readonly ProductionReadinessEvidenceRef[];
}

export interface ProductionReadinessAssessment {
  revision: string;
  owner: string;
  dimensions: readonly ProductionReadinessDimensionAssessment[];
}

export type ProductionReadinessCriticality = "CRITICAL" | "NONCRITICAL";

export interface ProductionReadinessGatePolicy {
  criticality: Readonly<Partial<Record<ProductionReadinessDimension, ProductionReadinessCriticality>>>;
}

export type ProductionReadinessGateConclusion = "PASS" | "BLOCKED";

export interface ProductionReadinessGateEvaluation {
  conclusion: ProductionReadinessGateConclusion;
  blockingDimensions: readonly ProductionReadinessDimensionAssessment[];
}

const CRITICAL_BLOCKING_STATES: ReadonlySet<ProductionReadinessState> = new Set([
  "FAIL",
  "BLOCKED",
  "UNKNOWN",
  "PARTIAL",
  "INCONCLUSIVE",
]);

export function qualifyProductionReadinessDimension(
  assessment: ProductionReadinessDimensionAssessment,
  expected: ProductionReadinessQualification,
): ProductionReadinessDimensionAssessment {
  const qualificationMatches =
    assessment.qualification.population === expected.population &&
    assessment.qualification.environment === expected.environment &&
    assessment.qualification.currentness === "CURRENT" &&
    expected.currentness === "CURRENT";

  const evidenceQualified = assessment.evidence.length > 0 && assessment.evidence.every(
    (evidence) =>
      evidence.qualification.population === expected.population &&
      evidence.qualification.environment === expected.environment &&
      evidence.qualification.currentness === "CURRENT",
  );

  if (assessment.state === "PASS" && (!qualificationMatches || !evidenceQualified)) {
    return { ...assessment, state: "UNKNOWN" };
  }

  return assessment;
}

export function hasIndependentReadinessDimensions(
  assessment: ProductionReadinessAssessment,
): boolean {
  const represented = new Set(assessment.dimensions.map(({ dimension }) => dimension));
  return PRODUCTION_READINESS_DIMENSIONS.every((dimension) => represented.has(dimension));
}

export function evaluateProductionReadinessCriticalGates(
  assessment: ProductionReadinessAssessment,
  policy: ProductionReadinessGatePolicy,
): ProductionReadinessGateEvaluation {
  const blockingDimensions = assessment.dimensions.filter(
    (dimension) =>
      policy.criticality[dimension.dimension] === "CRITICAL" &&
      CRITICAL_BLOCKING_STATES.has(dimension.state),
  );

  return {
    conclusion: blockingDimensions.length === 0 ? "PASS" : "BLOCKED",
    blockingDimensions,
  };
}

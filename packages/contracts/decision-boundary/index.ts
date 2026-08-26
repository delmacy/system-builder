export const DECISION_BOUNDARY_VERSION = "1.0.0" as const;

export const DECISION_CATEGORIES = ["deterministic", "human-decision", "probabilistic"] as const;
export type DecisionCategory = (typeof DECISION_CATEGORIES)[number];

export const DECISION_RISK_LEVELS = ["low", "medium", "high"] as const;
export type DecisionRiskLevel = (typeof DECISION_RISK_LEVELS)[number];

export const DECISION_CRITICALITY_LEVELS = ["standard", "critical"] as const;
export type DecisionCriticalityLevel = (typeof DECISION_CRITICALITY_LEVELS)[number];

export type DecisionBoundaryDescriptor = Readonly<{
  boundaryVersion: typeof DECISION_BOUNDARY_VERSION;
  decisionId: string;
  category: DecisionCategory;
}>;

export type ProbabilisticInferenceContext = Readonly<{
  confidence: number;
  modelRef: string;
  contextRef: string;
}>;

export type DeterministicDecisionMetadata = Readonly<{ invariantRef: string }>;
export type HumanDecisionMetadata = Readonly<{ authorityRef: string }>;
export type ProbabilisticDecisionMetadata = Readonly<{
  inferenceRef: string;
  inferenceContext: ProbabilisticInferenceContext;
}>;
export type DecisionCategoryMetadata =
  | Readonly<{ category: "deterministic"; metadata: DeterministicDecisionMetadata }>
  | Readonly<{ category: "human-decision"; metadata: HumanDecisionMetadata }>
  | Readonly<{ category: "probabilistic"; metadata: ProbabilisticDecisionMetadata }>;

export type DecisionRiskCriticality = Readonly<{
  risk: DecisionRiskLevel;
  criticality: DecisionCriticalityLevel;
}>;

export type DeterministicInvariantGate = Readonly<{
  gateRef: string;
  sourceCategory: "probabilistic";
  targetCategory: "deterministic";
  invariantRef: string;
}>;

export type DeterministicInvariantEvaluation =
  | Readonly<{ status: "compatible"; decisionId: string; invariantRef: string; gateRef?: string }>
  | Readonly<{ status: "rejected"; decisionId: string; invariantRef: string; diagnostic: string }>
  | Readonly<{ status: "invalid"; diagnostic: string }>;

export type HumanAuthorityReservationEvaluation =
  | Readonly<{ status: "compatible"; decisionId: string; authorityRef: string }>
  | Readonly<{ status: "rejected"; decisionId: string; authorityRef: string; diagnostic: string }>
  | Readonly<{ status: "invalid"; diagnostic: string }>;

export type DecisionBoundaryVerificationReference =
  | Readonly<{ kind: "invariant"; ref: string }>
  | Readonly<{ kind: "authority"; ref: string }>
  | Readonly<{ kind: "inference"; ref: string }>;

export type DecisionBoundaryVerificationResult =
  | Readonly<{
      status: "valid";
      decisionId: string;
      category: DecisionCategory;
      risk: DecisionRiskLevel;
      criticality: DecisionCriticalityLevel;
      reference: DecisionBoundaryVerificationReference;
    }>
  | Readonly<{
      status: "rejected";
      decisionId: string;
      category: DecisionCategory;
      risk: DecisionRiskLevel;
      criticality: DecisionCriticalityLevel;
      reference: DecisionBoundaryVerificationReference;
      diagnostic: string;
    }>
  | Readonly<{ status: "invalid"; diagnostic: string }>;

const TOKEN_PATTERN = /^\S+$/;
const CATEGORY_SET = new Set<string>(DECISION_CATEGORIES);
const RISK_SET = new Set<string>(DECISION_RISK_LEVELS);
const CRITICALITY_SET = new Set<string>(DECISION_CRITICALITY_LEVELS);
const CANONICAL_VERIFICATION_RESULTS = new WeakSet<object>();

function canonicalVerificationResult<T extends DecisionBoundaryVerificationResult>(result: T): T {
  CANONICAL_VERIFICATION_RESULTS.add(result as object);
  return result;
}

export function isCanonicalDecisionBoundaryVerificationResult(result: DecisionBoundaryVerificationResult): boolean {
  return CANONICAL_VERIFICATION_RESULTS.has(result as object);
}

function fail(path: string, reason: string): never {
  throw new TypeError(`Invalid decision boundary at ${path}: ${reason}`);
}

function recordAt(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail(path, "expected object");
  return value as Record<string, unknown>;
}

function exactKeys(record: Record<string, unknown>, allowed: readonly string[], path: string): void {
  const allowedKeys = new Set(allowed);
  const unexpected = Object.keys(record).filter((key) => !allowedKeys.has(key));
  if (unexpected.length > 0) fail(path, `unexpected field ${unexpected.sort()[0]}`);
}

function tokenAt(value: unknown, path: string): string {
  if (typeof value !== "string" || !TOKEN_PATTERN.test(value)) fail(path, "expected non-empty token");
  return value;
}

function confidenceAt(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) {
    fail(path, "expected finite number between 0 and 1");
  }
  return value;
}

export function isDecisionCategory(value: unknown): value is DecisionCategory {
  return typeof value === "string" && CATEGORY_SET.has(value);
}

export function isDecisionRiskLevel(value: unknown): value is DecisionRiskLevel {
  return typeof value === "string" && RISK_SET.has(value);
}

export function isDecisionCriticalityLevel(value: unknown): value is DecisionCriticalityLevel {
  return typeof value === "string" && CRITICALITY_SET.has(value);
}

export function normalizeDecisionBoundaryDescriptor(input: unknown): DecisionBoundaryDescriptor {
  const candidate = recordAt(input, "$decisionBoundary");
  exactKeys(candidate, ["boundaryVersion", "decisionId", "category"], "$decisionBoundary");
  if (candidate.boundaryVersion !== DECISION_BOUNDARY_VERSION) {
    fail("$decisionBoundary.boundaryVersion", "unsupported version");
  }
  if (!isDecisionCategory(candidate.category)) {
    fail("$decisionBoundary.category", "unsupported category");
  }
  return {
    boundaryVersion: DECISION_BOUNDARY_VERSION,
    decisionId: tokenAt(candidate.decisionId, "$decisionBoundary.decisionId"),
    category: candidate.category,
  };
}

export function normalizeProbabilisticInferenceContext(input: unknown): ProbabilisticInferenceContext {
  const context = recordAt(input, "$decisionBoundary.metadata.inferenceContext");
  exactKeys(context, ["confidence", "modelRef", "contextRef"], "$decisionBoundary.metadata.inferenceContext");
  return {
    confidence: confidenceAt(context.confidence, "$decisionBoundary.metadata.inferenceContext.confidence"),
    modelRef: tokenAt(context.modelRef, "$decisionBoundary.metadata.inferenceContext.modelRef"),
    contextRef: tokenAt(context.contextRef, "$decisionBoundary.metadata.inferenceContext.contextRef"),
  };
}

export function normalizeDecisionCategoryMetadata(category: DecisionCategory, input: unknown): DecisionCategoryMetadata {
  const metadata = recordAt(input, "$decisionBoundary.metadata");
  if (category === "deterministic") {
    exactKeys(metadata, ["invariantRef"], "$decisionBoundary.metadata");
    return { category, metadata: { invariantRef: tokenAt(metadata.invariantRef, "$decisionBoundary.metadata.invariantRef") } };
  }
  if (category === "human-decision") {
    exactKeys(metadata, ["authorityRef"], "$decisionBoundary.metadata");
    return { category, metadata: { authorityRef: tokenAt(metadata.authorityRef, "$decisionBoundary.metadata.authorityRef") } };
  }
  exactKeys(metadata, ["inferenceRef", "inferenceContext"], "$decisionBoundary.metadata");
  return {
    category,
    metadata: {
      inferenceRef: tokenAt(metadata.inferenceRef, "$decisionBoundary.metadata.inferenceRef"),
      inferenceContext: normalizeProbabilisticInferenceContext(metadata.inferenceContext),
    },
  };
}

export function normalizeDecisionRiskCriticality(input: unknown): DecisionRiskCriticality {
  const candidate = recordAt(input, "$decisionBoundary.riskCriticality");
  exactKeys(candidate, ["risk", "criticality"], "$decisionBoundary.riskCriticality");
  if (!isDecisionRiskLevel(candidate.risk)) {
    fail("$decisionBoundary.riskCriticality.risk", "unsupported risk level");
  }
  if (!isDecisionCriticalityLevel(candidate.criticality)) {
    fail("$decisionBoundary.riskCriticality.criticality", "unsupported criticality level");
  }
  return { risk: candidate.risk, criticality: candidate.criticality };
}

function normalizeDeterministicInvariantGate(input: unknown): DeterministicInvariantGate {
  const gate = recordAt(input, "$decisionBoundary.gate");
  exactKeys(gate, ["gateRef", "sourceCategory", "targetCategory", "invariantRef"], "$decisionBoundary.gate");
  if (gate.sourceCategory !== "probabilistic") fail("$decisionBoundary.gate.sourceCategory", "must be probabilistic");
  if (gate.targetCategory !== "deterministic") fail("$decisionBoundary.gate.targetCategory", "must be deterministic");
  return {
    gateRef: tokenAt(gate.gateRef, "$decisionBoundary.gate.gateRef"),
    sourceCategory: "probabilistic",
    targetCategory: "deterministic",
    invariantRef: tokenAt(gate.invariantRef, "$decisionBoundary.gate.invariantRef"),
  };
}

export function evaluateDeterministicInvariantControl(input: Readonly<{
  descriptor: unknown;
  metadata: unknown;
  invariantRef: unknown;
  gate?: unknown;
}>): DeterministicInvariantEvaluation {
  try {
    const descriptor = normalizeDecisionBoundaryDescriptor(input.descriptor);
    const metadata = normalizeDecisionCategoryMetadata(descriptor.category, input.metadata);
    const invariantRef = tokenAt(input.invariantRef, "$decisionBoundary.invariantRef");

    if (descriptor.category === "deterministic") {
      if (metadata.category !== "deterministic" || metadata.metadata.invariantRef !== invariantRef) {
        return { status: "rejected", decisionId: descriptor.decisionId, invariantRef, diagnostic: "deterministic invariant reference mismatch" };
      }
      return { status: "compatible", decisionId: descriptor.decisionId, invariantRef };
    }

    if (descriptor.category !== "probabilistic") {
      return { status: "rejected", decisionId: descriptor.decisionId, invariantRef, diagnostic: "human decision cannot directly satisfy a deterministic invariant" };
    }

    if (input.gate === undefined) {
      return { status: "rejected", decisionId: descriptor.decisionId, invariantRef, diagnostic: "probabilistic decision requires an explicit compatible gate" };
    }

    const gate = normalizeDeterministicInvariantGate(input.gate);
    if (gate.invariantRef !== invariantRef) {
      return { status: "rejected", decisionId: descriptor.decisionId, invariantRef, diagnostic: "gate invariant reference mismatch" };
    }
    return { status: "compatible", decisionId: descriptor.decisionId, invariantRef, gateRef: gate.gateRef };
  } catch (error) {
    return { status: "invalid", diagnostic: error instanceof Error ? error.message : "invalid decision boundary" };
  }
}

export function evaluateHumanAuthorityReservation(input: Readonly<{
  descriptor: unknown;
  metadata: unknown;
  authorityRef: unknown;
}>): HumanAuthorityReservationEvaluation {
  try {
    const descriptor = normalizeDecisionBoundaryDescriptor(input.descriptor);
    const metadata = normalizeDecisionCategoryMetadata(descriptor.category, input.metadata);
    const authorityRef = tokenAt(input.authorityRef, "$decisionBoundary.authorityRef");

    if (descriptor.category !== "human-decision") {
      return {
        status: "rejected",
        decisionId: descriptor.decisionId,
        authorityRef,
        diagnostic: `${descriptor.category} decision cannot satisfy human-reserved authority`,
      };
    }

    if (metadata.category !== "human-decision" || metadata.metadata.authorityRef !== authorityRef) {
      return {
        status: "rejected",
        decisionId: descriptor.decisionId,
        authorityRef,
        diagnostic: "human authority reference mismatch",
      };
    }

    return { status: "compatible", decisionId: descriptor.decisionId, authorityRef };
  } catch (error) {
    return { status: "invalid", diagnostic: error instanceof Error ? error.message : "invalid decision boundary" };
  }
}

export function verifyDecisionBoundary(input: Readonly<{
  descriptor: unknown;
  metadata: unknown;
  riskCriticality: unknown;
  expectedCategory?: unknown;
}>): DecisionBoundaryVerificationResult {
  try {
    const descriptor = normalizeDecisionBoundaryDescriptor(input.descriptor);
    const metadata = normalizeDecisionCategoryMetadata(descriptor.category, input.metadata);
    const riskCriticality = normalizeDecisionRiskCriticality(input.riskCriticality);

    if (input.expectedCategory !== undefined && !isDecisionCategory(input.expectedCategory)) {
      fail("$decisionBoundary.expectedCategory", "unsupported category");
    }

    const reference: DecisionBoundaryVerificationReference =
      metadata.category === "deterministic"
        ? { kind: "invariant", ref: metadata.metadata.invariantRef }
        : metadata.category === "human-decision"
          ? { kind: "authority", ref: metadata.metadata.authorityRef }
          : { kind: "inference", ref: metadata.metadata.inferenceRef };

    const common = {
      decisionId: descriptor.decisionId,
      category: descriptor.category,
      risk: riskCriticality.risk,
      criticality: riskCriticality.criticality,
      reference,
    } as const;

    if (input.expectedCategory !== undefined && descriptor.category !== input.expectedCategory) {
      return canonicalVerificationResult({
        status: "rejected",
        ...common,
        diagnostic: `decision category ${descriptor.category} does not match expected category ${input.expectedCategory}`,
      });
    }

    return canonicalVerificationResult({ status: "valid", ...common });
  } catch (error) {
    return canonicalVerificationResult({ status: "invalid", diagnostic: error instanceof Error ? error.message : "invalid decision boundary" });
  }
}

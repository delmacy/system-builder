import {
  normalizeDecisionBoundaryDescriptor,
  normalizeDecisionCategoryMetadata,
  normalizeDecisionRiskCriticality,
  verifyDecisionBoundary,
  type DecisionBoundaryVerificationResult,
  type ProbabilisticInferenceContext,
} from "./index.js";

export type ProbabilisticDecisionAvailabilityResult =
  | Readonly<{
      status: "available";
      decisionId: string;
      inferenceRef: string;
      inferenceContext: ProbabilisticInferenceContext;
      verification: DecisionBoundaryVerificationResult;
    }>
  | Readonly<{
      status: "unavailable";
      decisionId: string;
      inferenceRef: string;
      diagnostic: string;
    }>
  | Readonly<{ status: "invalid"; diagnostic: string }>;

function fail(path: string, reason: string): never {
  throw new TypeError(`Invalid probabilistic availability at ${path}: ${reason}`);
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

function diagnosticAt(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim().length === 0) fail(path, "expected non-empty diagnostic");
  return value;
}

export function evaluateProbabilisticDecisionAvailability(input: Readonly<{
  descriptor: unknown;
  metadata: unknown;
  riskCriticality: unknown;
  availability: unknown;
}>): ProbabilisticDecisionAvailabilityResult {
  try {
    const descriptor = normalizeDecisionBoundaryDescriptor(input.descriptor);
    if (descriptor.category !== "probabilistic") {
      fail("$availability.descriptor.category", "probabilistic decision required");
    }

    const metadata = normalizeDecisionCategoryMetadata(descriptor.category, input.metadata);
    if (metadata.category !== "probabilistic") {
      fail("$availability.metadata", "probabilistic metadata required");
    }
    const riskCriticality = normalizeDecisionRiskCriticality(input.riskCriticality);
    const availability = recordAt(input.availability, "$availability");

    if (availability.status === "unavailable") {
      exactKeys(availability, ["status", "diagnostic"], "$availability");
      return {
        status: "unavailable",
        decisionId: descriptor.decisionId,
        inferenceRef: metadata.metadata.inferenceRef,
        diagnostic: diagnosticAt(availability.diagnostic, "$availability.diagnostic"),
      };
    }

    if (availability.status !== "available") {
      fail("$availability.status", "expected available or unavailable");
    }
    exactKeys(availability, ["status"], "$availability");

    const verification = verifyDecisionBoundary({
      descriptor,
      metadata: metadata.metadata,
      riskCriticality,
      expectedCategory: "probabilistic",
    });
    if (verification.status !== "valid") {
      fail("$availability.verification", "available probabilistic evidence must verify as valid");
    }

    return {
      status: "available",
      decisionId: descriptor.decisionId,
      inferenceRef: metadata.metadata.inferenceRef,
      inferenceContext: metadata.metadata.inferenceContext,
      verification,
    };
  } catch (error) {
    return {
      status: "invalid",
      diagnostic: error instanceof Error ? error.message : "invalid probabilistic availability",
    };
  }
}

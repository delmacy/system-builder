import {
  normalizeDecisionBoundaryDescriptor,
  normalizeDecisionCategoryMetadata,
  normalizeDecisionRiskCriticality,
  verifyDecisionBoundary,
  type DecisionBoundaryVerificationResult,
  type DecisionCategory,
} from "./index.js";
import type { ProbabilisticDecisionAvailabilityResult } from "./probabilistic-availability.js";

export type ProbabilisticFallbackEvaluation =
  | Readonly<{
      status: "bounded";
      fallbackRef: string;
      sourceDecisionId: string;
      targetDecisionId: string;
      targetCategory: Exclude<DecisionCategory, "probabilistic">;
      verification: DecisionBoundaryVerificationResult;
    }>
  | Readonly<{
      status: "rejected";
      sourceDecisionId?: string;
      diagnostic: string;
    }>
  | Readonly<{ status: "invalid"; diagnostic: string }>;

function fail(path: string, reason: string): never {
  throw new TypeError(`Invalid probabilistic fallback at ${path}: ${reason}`);
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
  if (typeof value !== "string" || value.length === 0 || /\s/.test(value)) fail(path, "expected non-empty token");
  return value;
}

export function evaluateProbabilisticFallback(input: Readonly<{
  sourceAvailability: ProbabilisticDecisionAvailabilityResult;
  fallback: unknown;
  candidateDescriptor: unknown;
  candidateMetadata: unknown;
  candidateRiskCriticality: unknown;
}>): ProbabilisticFallbackEvaluation {
  try {
    if (input.sourceAvailability.status === "invalid") {
      return { status: "invalid", diagnostic: "invalid source availability cannot be used for fallback" };
    }
    if (input.sourceAvailability.status === "available") {
      return {
        status: "rejected",
        sourceDecisionId: input.sourceAvailability.decisionId,
        diagnostic: "fallback requires explicit unavailable probabilistic evidence",
      };
    }

    const fallback = recordAt(input.fallback, "$fallback");
    exactKeys(fallback, ["fallbackRef", "sourceDecisionId", "targetDecisionId", "targetCategory"], "$fallback");
    const fallbackRef = tokenAt(fallback.fallbackRef, "$fallback.fallbackRef");
    const sourceDecisionId = tokenAt(fallback.sourceDecisionId, "$fallback.sourceDecisionId");
    const targetDecisionId = tokenAt(fallback.targetDecisionId, "$fallback.targetDecisionId");
    if (sourceDecisionId !== input.sourceAvailability.decisionId) {
      return { status: "rejected", sourceDecisionId, diagnostic: "fallback source decision reference mismatch" };
    }
    if (fallback.targetCategory !== "deterministic" && fallback.targetCategory !== "human-decision") {
      return { status: "rejected", sourceDecisionId, diagnostic: "fallback target must be deterministic or human-decision" };
    }

    const descriptor = normalizeDecisionBoundaryDescriptor(input.candidateDescriptor);
    if (descriptor.decisionId !== targetDecisionId || descriptor.category !== fallback.targetCategory) {
      return { status: "rejected", sourceDecisionId, diagnostic: "fallback target decision/category mismatch" };
    }
    const metadata = normalizeDecisionCategoryMetadata(descriptor.category, input.candidateMetadata);
    const riskCriticality = normalizeDecisionRiskCriticality(input.candidateRiskCriticality);
    const verification = verifyDecisionBoundary({
      descriptor,
      metadata: metadata.metadata,
      riskCriticality,
      expectedCategory: fallback.targetCategory,
    });
    if (verification.status !== "valid") {
      return { status: "rejected", sourceDecisionId, diagnostic: "fallback candidate is not valid decision evidence" };
    }

    return {
      status: "bounded",
      fallbackRef,
      sourceDecisionId,
      targetDecisionId,
      targetCategory: fallback.targetCategory,
      verification,
    };
  } catch (error) {
    return { status: "invalid", diagnostic: error instanceof Error ? error.message : "invalid probabilistic fallback" };
  }
}

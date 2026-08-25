export const DECISION_BOUNDARY_VERSION = "1.0.0" as const;

export const DECISION_CATEGORIES = ["deterministic", "human-decision", "probabilistic"] as const;
export type DecisionCategory = (typeof DECISION_CATEGORIES)[number];

export type DecisionBoundaryDescriptor = Readonly<{
  boundaryVersion: typeof DECISION_BOUNDARY_VERSION;
  decisionId: string;
  category: DecisionCategory;
}>;

const TOKEN_PATTERN = /^\S+$/;
const CATEGORY_SET = new Set<string>(DECISION_CATEGORIES);

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

export function isDecisionCategory(value: unknown): value is DecisionCategory {
  return typeof value === "string" && CATEGORY_SET.has(value);
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

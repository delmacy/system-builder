import {
  buildFactoryOperatorBootstrapProgress,
  validateFactoryOperatorBootstrap,
  type FactoryE2EInvocationInput,
} from "../packages/contracts/factory-boundary/index.js";
import { executeCanonicalFactoryE2E, materializeFactoryE2EInput } from "./factory-e2e-command.js";

type UnknownRecord = Record<string, unknown>;
type CanonicalFactoryResult = ReturnType<typeof executeCanonicalFactoryE2E>;
export type FactoryOperatorBootstrapInvoker = (input: FactoryE2EInvocationInput) => CanonicalFactoryResult;

export type FactoryOperatorBootstrapDiagnostic = Readonly<{
  code: "INVALID_OPERATOR_INPUT" | "MISSING_PREREQUISITE" | "UNAVAILABLE_CAPABILITY" | "CANONICAL_E2E_REJECTED";
  message: string;
  action: string;
}>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "unknown factory operator bootstrap failure";
}

/** Classifies only operator-actionable failures; canonical failure text is preserved without input/config payloads. */
export function diagnoseFactoryOperatorBootstrapFailure(error: unknown): FactoryOperatorBootstrapDiagnostic {
  const message = errorMessage(error);
  if (/prerequisites\.|factoryE2EAvailable|repository Node\.js|repository npm/.test(message)) {
    return Object.freeze({ code: "MISSING_PREREQUISITE", message, action: "satisfy the declared repository prerequisite and retry" });
  }
  if (/catalog|capability|provider/i.test(message) && /missing|not[ _-]?found|unavailable|no .*provider|does not provide/i.test(message)) {
    return Object.freeze({ code: "UNAVAILABLE_CAPABILITY", message, action: "make the declared supported capability/provider available and retry" });
  }
  if (/factory operator bootstrap|config\.|unexpected field|missing field|must be an object|must be a non-empty string|unsupported factory operator bootstrap contract/.test(message)) {
    return Object.freeze({ code: "INVALID_OPERATOR_INPUT", message, action: "correct the bootstrap input/configuration and retry" });
  }
  return Object.freeze({ code: "CANONICAL_E2E_REJECTED", message, action: "correct the rejected canonical predecessor/input and retry" });
}

/**
 * Applies the operator boundary before delegating exactly once to the canonical
 * factory E2E executor. The JSON transport uses the same catalogEntries shape as
 * factory:e2e; materialization is transport-only and does not synthesize domain input.
 */
export function executeFactoryOperatorBootstrap(
  raw: unknown,
  invoke: FactoryOperatorBootstrapInvoker = executeCanonicalFactoryE2E,
) {
  const transport = asRecord(raw, "factory operator bootstrap input");
  const factoryInput = materializeFactoryE2EInput(transport.factoryInput);
  const validation = validateFactoryOperatorBootstrap({ ...transport, factoryInput });
  const result = invoke(factoryInput);
  const progress = buildFactoryOperatorBootstrapProgress(result);

  return Object.freeze({ ok: true as const, bootstrap: validation, progress, result });
}

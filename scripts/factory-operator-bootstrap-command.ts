import {
  validateFactoryOperatorBootstrap,
  type FactoryE2EInvocationInput,
} from "../packages/contracts/factory-boundary/index.js";
import { executeCanonicalFactoryE2E, materializeFactoryE2EInput } from "./factory-e2e-command.js";

type UnknownRecord = Record<string, unknown>;
type CanonicalFactoryResult = ReturnType<typeof executeCanonicalFactoryE2E>;
export type FactoryOperatorBootstrapInvoker = (input: FactoryE2EInvocationInput) => CanonicalFactoryResult;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
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

  return Object.freeze({ ok: true as const, bootstrap: validation, result });
}

import {
  normalizeRuntimeStateRequirement,
  type RuntimeStateRequirement,
} from "@system-builder/runtime-core";

export type RuntimeCapabilityAssemblyComponent = Readonly<{
  capability: string;
  provider: string;
  version: string;
}>;

export type RuntimeCapabilityAssemblyPlan = Readonly<{
  kind: "AssemblyPlan";
  components: readonly RuntimeCapabilityAssemblyComponent[];
}>;

export type RuntimeCapabilityMaterialization = Readonly<{
  stateRequirements: readonly RuntimeStateRequirement[];
}>;

const STATE_COUNTER_CAPABILITY = "state.counter";
const STATE_COUNTER_PROVIDER = "system-builder.postgres-counter";
const STATE_COUNTER_VERSION = "1.0.0";

function unsupported(component: RuntimeCapabilityAssemblyComponent): never {
  throw new Error(
    `COMPILER_RUNTIME_CAPABILITY_UNSUPPORTED:${STATE_COUNTER_CAPABILITY}:${component.provider}:${component.version}`,
  );
}

function materializeStateCounter(): RuntimeStateRequirement {
  return normalizeRuntimeStateRequirement({
    kind: "RuntimeStateRequirement",
    capability: STATE_COUNTER_CAPABILITY,
    storeKind: "sql",
    connectionBinding: Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" }),
    migrations: Object.freeze([
      Object.freeze({
        id: "state-counter-v1",
        capability: STATE_COUNTER_CAPABILITY,
        order: 10,
        path: "migrations/001-state-counter.sql",
        content: "CREATE TABLE runtime_counter (id INTEGER PRIMARY KEY, value INTEGER NOT NULL);",
      }),
    ]),
  });
}

export function materializeAssemblyRuntimeCapabilities(
  assemblyPlan: RuntimeCapabilityAssemblyPlan,
): RuntimeCapabilityMaterialization {
  if (!assemblyPlan || assemblyPlan.kind !== "AssemblyPlan" || !Array.isArray(assemblyPlan.components)) {
    throw new Error("COMPILER_RUNTIME_CAPABILITY_INVALID_ASSEMBLY_PLAN");
  }

  const selected = [...assemblyPlan.components]
    .filter((component) => component.capability === STATE_COUNTER_CAPABILITY)
    .sort(
      (left, right) =>
        left.provider.localeCompare(right.provider) || left.version.localeCompare(right.version),
    );

  if (selected.length === 0) {
    return Object.freeze({ stateRequirements: Object.freeze([]) });
  }
  if (selected.length !== 1) {
    throw new Error(`COMPILER_RUNTIME_CAPABILITY_DUPLICATE:${STATE_COUNTER_CAPABILITY}`);
  }

  const component = selected[0]!;
  if (component.provider !== STATE_COUNTER_PROVIDER || component.version !== STATE_COUNTER_VERSION) {
    unsupported(component);
  }

  return Object.freeze({
    stateRequirements: Object.freeze([materializeStateCounter()]),
  });
}

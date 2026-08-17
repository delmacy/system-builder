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

export type RuntimeCapabilityMaterializer = Readonly<{
  capability: string;
  provider: string;
  version: string;
  materialize: () => RuntimeCapabilityMaterialization;
}>;

export type RuntimeCapabilityMaterializerLookup =
  | Readonly<{ ok: true; materializer: RuntimeCapabilityMaterializer }>
  | Readonly<{ ok: false; identity: string }>;

function requireMaterializerToken(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`COMPILER_MATERIALIZER_INVALID_${field.toUpperCase()}`);
  return normalized;
}

export function runtimeCapabilityMaterializerIdentity(
  input: Pick<RuntimeCapabilityAssemblyComponent, "capability" | "provider" | "version">,
): string {
  return [
    requireMaterializerToken(input.capability, "capability"),
    requireMaterializerToken(input.provider, "provider"),
    requireMaterializerToken(input.version, "version"),
  ].join("::");
}

function normalizeMaterializer(input: RuntimeCapabilityMaterializer): RuntimeCapabilityMaterializer {
  if (typeof input.materialize !== "function") throw new Error("COMPILER_MATERIALIZER_INVALID_HANDLER");
  return Object.freeze({
    capability: requireMaterializerToken(input.capability, "capability"),
    provider: requireMaterializerToken(input.provider, "provider"),
    version: requireMaterializerToken(input.version, "version"),
    materialize: input.materialize,
  });
}

function compareMaterializer(left: RuntimeCapabilityMaterializer, right: RuntimeCapabilityMaterializer): number {
  return runtimeCapabilityMaterializerIdentity(left).localeCompare(runtimeCapabilityMaterializerIdentity(right));
}

export class RuntimeCapabilityMaterializerRegistry {
  readonly #materializers = new Map<string, RuntimeCapabilityMaterializer>();

  register(input: RuntimeCapabilityMaterializer): RuntimeCapabilityMaterializer {
    const materializer = normalizeMaterializer(input);
    const identity = runtimeCapabilityMaterializerIdentity(materializer);
    if (this.#materializers.has(identity)) throw new Error(`COMPILER_MATERIALIZER_DUPLICATE:${identity}`);
    this.#materializers.set(identity, materializer);
    return materializer;
  }

  list(): readonly RuntimeCapabilityMaterializer[] {
    return Object.freeze([...this.#materializers.values()].sort(compareMaterializer));
  }

  lookup(component: RuntimeCapabilityAssemblyComponent): RuntimeCapabilityMaterializerLookup {
    const identity = runtimeCapabilityMaterializerIdentity(component);
    const materializer = this.#materializers.get(identity);
    return materializer
      ? Object.freeze({ ok: true, materializer })
      : Object.freeze({ ok: false, identity });
  }
}

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

function materializeStateCounterCapability(): RuntimeCapabilityMaterialization {
  return Object.freeze({
    stateRequirements: Object.freeze([materializeStateCounter()]),
  });
}

function createDefaultMaterializerRegistry(): RuntimeCapabilityMaterializerRegistry {
  const registry = new RuntimeCapabilityMaterializerRegistry();
  registry.register(Object.freeze({
    capability: STATE_COUNTER_CAPABILITY,
    provider: STATE_COUNTER_PROVIDER,
    version: STATE_COUNTER_VERSION,
    materialize: materializeStateCounterCapability,
  }));
  return registry;
}

const DEFAULT_MATERIALIZER_REGISTRY = createDefaultMaterializerRegistry();

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

  if (selected.length === 0) return Object.freeze({ stateRequirements: Object.freeze([]) });
  if (selected.length !== 1) throw new Error(`COMPILER_RUNTIME_CAPABILITY_DUPLICATE:${STATE_COUNTER_CAPABILITY}`);

  const component = selected[0]!;
  const lookup = DEFAULT_MATERIALIZER_REGISTRY.lookup(component);
  if (!lookup.ok) unsupported(component);
  return lookup.materializer.materialize();
}

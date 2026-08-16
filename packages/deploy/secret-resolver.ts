import type { EnvironmentProfile } from "@system-builder/contracts/environment-profile";

export type SecretResolver = Readonly<{
  resolve(reference: string): string;
}>;

export type RuntimeSecretEnvironment = Readonly<Record<string, string>>;

function requireToken(value: string, code: string): string {
  const token = value.trim();
  if (token.length === 0) throw new Error(code);
  return token;
}

export function resolveRuntimeSecretEnvironment(
  environment: EnvironmentProfile,
  resolver: SecretResolver,
): RuntimeSecretEnvironment {
  const secretBindings = environment.bindings
    .filter((binding) => binding.kind === "secret-reference")
    .map((binding) => ({
      name: requireToken(binding.name, "SECRET_BINDING_NAME_INVALID"),
      reference: requireToken(binding.reference, `SECRET_REFERENCE_INVALID:${binding.name}`),
    }))
    .sort((left, right) => left.name.localeCompare(right.name) || left.reference.localeCompare(right.reference));

  const resolved: Record<string, string> = {};
  for (const binding of secretBindings) {
    if (Object.prototype.hasOwnProperty.call(resolved, binding.name)) {
      throw new Error(`SECRET_BINDING_DUPLICATE:${binding.name}`);
    }
    const value = resolver.resolve(binding.reference);
    if (typeof value !== "string" || value.length === 0) {
      throw new Error(`SECRET_RESOLUTION_EMPTY:${binding.reference}`);
    }
    resolved[binding.name] = value;
  }

  return Object.freeze(resolved);
}

export class InMemorySecretResolver implements SecretResolver {
  readonly #values: ReadonlyMap<string, string>;

  constructor(values: Readonly<Record<string, string>>) {
    const entries = Object.entries(values)
      .map(([reference, value]) => [requireToken(reference, "SECRET_REFERENCE_INVALID"), value] as const)
      .sort(([left], [right]) => left.localeCompare(right));
    this.#values = new Map(entries);
  }

  resolve(reference: string): string {
    const normalized = requireToken(reference, "SECRET_REFERENCE_INVALID");
    const value = this.#values.get(normalized);
    if (value === undefined) throw new Error(`SECRET_REFERENCE_NOT_FOUND:${normalized}`);
    return value;
  }

  toJSON(): Readonly<{ kind: "InMemorySecretResolver"; references: readonly string[] }> {
    return Object.freeze({
      kind: "InMemorySecretResolver",
      references: Object.freeze([...this.#values.keys()].sort((left, right) => left.localeCompare(right))),
    });
  }
}

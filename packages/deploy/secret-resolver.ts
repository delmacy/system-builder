import { readFileSync } from "node:fs";
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

const SECRET_REFERENCE_PREFIX = "secret://";

function secretReferenceName(reference: string): string {
  const normalized = requireToken(reference, "SECRET_REFERENCE_INVALID");
  if (!normalized.startsWith(SECRET_REFERENCE_PREFIX)) {
    throw new Error(`SECRET_REFERENCE_INVALID:${normalized}`);
  }
  return requireToken(normalized.slice(SECRET_REFERENCE_PREFIX.length), "SECRET_REFERENCE_INVALID");
}

export function parseSecretStore(content: string): ReadonlyMap<string, string> {
  const store = new Map<string, string>();
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator <= 0) throw new Error("SECRET_STORE_INVALID_LINE");
    const name = requireToken(line.slice(0, separator), "SECRET_REFERENCE_INVALID");
    const value = line.slice(separator + 1);
    if (store.has(name)) throw new Error(`SECRET_BINDING_DUPLICATE:${name}`);
    store.set(name, value);
  }
  return store;
}

export class ProcessEnvironmentSecretResolver implements SecretResolver {
  readonly #environment: ReadonlyMap<string, string>;
  readonly #resolved: Set<string>;

  constructor(environment: Readonly<Record<string, string>> = process.env as Readonly<Record<string, string>>) {
    const entries = Object.entries(environment)
      .filter((entry): entry is [string, string] => typeof entry[1] === "string")
      .sort(([left], [right]) => left.localeCompare(right));
    this.#environment = new Map(entries);
    this.#resolved = new Set();
  }

  resolve(reference: string): string {
    const name = secretReferenceName(reference);
    const value = this.#environment.get(name);
    if (value === undefined) throw new Error(`SECRET_REFERENCE_NOT_FOUND:${reference}`);
    if (value.length === 0) throw new Error(`SECRET_RESOLUTION_EMPTY:${reference}`);
    this.#resolved.add(name);
    return value;
  }

  toJSON(): Readonly<{ kind: "ProcessEnvironmentSecretResolver"; references: readonly string[] }> {
    return Object.freeze({
      kind: "ProcessEnvironmentSecretResolver",
      references: Object.freeze([...this.#resolved].sort((left, right) => left.localeCompare(right))),
    });
  }
}

export class FileBackedSecretResolver implements SecretResolver {
  readonly #values: ReadonlyMap<string, string>;
  readonly #filePath: string;

  constructor(filePath: string, content: string = readFileSync(filePath, "utf8")) {
    this.#filePath = filePath;
    this.#values = parseSecretStore(content);
  }

  resolve(reference: string): string {
    const name = secretReferenceName(reference);
    const value = this.#values.get(name);
    if (value === undefined) throw new Error(`SECRET_REFERENCE_NOT_FOUND:${reference}`);
    if (value.length === 0) throw new Error(`SECRET_RESOLUTION_EMPTY:${reference}`);
    return value;
  }

  toJSON(): Readonly<{ kind: "FileBackedSecretResolver"; filePath: string; references: readonly string[] }> {
    return Object.freeze({
      kind: "FileBackedSecretResolver",
      filePath: this.#filePath,
      references: Object.freeze([...this.#values.keys()].sort((left, right) => left.localeCompare(right))),
    });
  }
}

import { InMemoryCatalogRecordStorage, type CatalogRecordStorage } from "./storage.js";

export type CatalogVersionConstraint = Readonly<{
  kind: "exact" | "minimum";
  version: string;
}>;

export type SoftwareDependencyRequirementInput = Readonly<{
  capability: string;
  versionConstraint?: CatalogVersionConstraint;
  compatibility?: Readonly<Record<string, string>>;
}>;

export type SoftwareDependencyRequirement = Readonly<{
  capability: string;
  versionConstraint?: CatalogVersionConstraint;
  compatibility: Readonly<Record<string, string>>;
}>;

export type SoftwareCatalogRecordInput = Readonly<{
  capability: string;
  provider: string;
  version: string;
  dependencies?: readonly string[];
  dependencyRequirements?: readonly SoftwareDependencyRequirementInput[];
  compatibility?: Readonly<Record<string, string>>;
}>;

export type SoftwareCatalogRecord = Readonly<{
  capability: string;
  provider: string;
  version: string;
  dependencies: readonly string[];
  dependencyRequirements: readonly SoftwareDependencyRequirement[];
  compatibility: Readonly<Record<string, string>>;
}>;

export type CatalogResolutionRequest = Readonly<{
  capability: string;
  version?: string;
  versionConstraint?: CatalogVersionConstraint;
  compatibility?: Readonly<Record<string, string>>;
}>;

export type CatalogResolutionDiagnostic = Readonly<{
  code: "CAPABILITY_NOT_FOUND" | "NO_COMPATIBLE_PROVIDER";
  capability: string;
  requestedVersion?: string;
  requestedConstraint?: string;
}>;

export type CatalogResolutionResult =
  | Readonly<{ ok: true; candidates: readonly SoftwareCatalogRecord[] }>
  | Readonly<{ ok: false; diagnostic: CatalogResolutionDiagnostic }>;

type ParsedVersion = readonly [major: number, minor: number, patch: number];

function requireToken(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`CATALOG_INVALID_${field.toUpperCase()}`);
  return normalized;
}

function normalizeCompatibility(
  compatibility: Readonly<Record<string, string>> | undefined,
): Readonly<Record<string, string>> {
  const entries = Object.entries(compatibility ?? {})
    .map(([key, value]) => [requireToken(key, "compatibility_key"), requireToken(value, "compatibility_value")] as const)
    .sort(([left], [right]) => left.localeCompare(right));
  return Object.freeze(Object.fromEntries(entries));
}

function normalizeVersionConstraint(
  constraint: CatalogVersionConstraint | undefined,
): CatalogVersionConstraint | undefined {
  if (constraint === undefined) return undefined;
  return Object.freeze({
    kind: constraint.kind,
    version: requireToken(constraint.version, "dependency_version"),
  });
}

function compareDependencyRequirements(
  left: SoftwareDependencyRequirement,
  right: SoftwareDependencyRequirement,
): number {
  return (
    left.capability.localeCompare(right.capability) ||
    (left.versionConstraint?.kind ?? "").localeCompare(right.versionConstraint?.kind ?? "") ||
    (left.versionConstraint?.version ?? "").localeCompare(right.versionConstraint?.version ?? "") ||
    JSON.stringify(left.compatibility).localeCompare(JSON.stringify(right.compatibility))
  );
}

function normalizeDependencyRequirement(input: SoftwareDependencyRequirementInput): SoftwareDependencyRequirement {
  const versionConstraint = normalizeVersionConstraint(input.versionConstraint);
  return Object.freeze({
    capability: requireToken(input.capability, "dependency_capability"),
    ...(versionConstraint === undefined ? {} : { versionConstraint }),
    compatibility: normalizeCompatibility(input.compatibility),
  });
}

function normalizeRecord(input: SoftwareCatalogRecordInput): SoftwareCatalogRecord {
  const dependencyRequirements = [...(input.dependencyRequirements ?? [])]
    .map(normalizeDependencyRequirement)
    .sort(compareDependencyRequirements);
  return Object.freeze({
    capability: requireToken(input.capability, "capability"),
    provider: requireToken(input.provider, "provider"),
    version: requireToken(input.version, "version"),
    dependencies: Object.freeze(
      [...(input.dependencies ?? [])].map((dependency) => requireToken(dependency, "dependency")).sort(),
    ),
    dependencyRequirements: Object.freeze(dependencyRequirements),
    compatibility: normalizeCompatibility(input.compatibility),
  });
}

export function catalogIdentity(record: Pick<SoftwareCatalogRecord, "capability" | "provider" | "version">): string {
  return `${record.capability}::${record.provider}::${record.version}`;
}

function compareRecords(left: SoftwareCatalogRecord, right: SoftwareCatalogRecord): number {
  return (
    left.capability.localeCompare(right.capability) ||
    left.provider.localeCompare(right.provider) ||
    left.version.localeCompare(right.version)
  );
}

export class SoftwareCatalogRegistry {
  readonly #storage: CatalogRecordStorage;

  constructor(storage: CatalogRecordStorage = new InMemoryCatalogRecordStorage()) {
    this.#storage = storage;
  }

  register(input: SoftwareCatalogRecordInput): SoftwareCatalogRecord {
    const record = normalizeRecord(input);
    const identity = catalogIdentity(record);
    if (this.#storage.has(identity)) {
      throw new Error(`CATALOG_DUPLICATE_IDENTITY:${identity}`);
    }
    this.#storage.set(identity, record);
    return record;
  }

  list(): readonly SoftwareCatalogRecord[] {
    return Object.freeze([...this.#storage.values()].sort(compareRecords));
  }
}

function satisfiesCompatibility(
  record: SoftwareCatalogRecord,
  requested: Readonly<Record<string, string>>,
): boolean {
  return Object.entries(requested).every(([key, value]) => record.compatibility[key] === value);
}

function parseVersion(value: string, field: "constraint_version" | "candidate_version"): ParsedVersion {
  const normalized = requireToken(value, field);
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(normalized);
  if (!match) throw new Error(`CATALOG_INVALID_${field.toUpperCase()}:${normalized}`);
  return Object.freeze([Number(match[1]), Number(match[2]), Number(match[3])]) as ParsedVersion;
}

function compareParsedVersion(left: ParsedVersion, right: ParsedVersion): number {
  return left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
}

function normalizeResolutionConstraint(constraint: CatalogVersionConstraint | undefined): CatalogVersionConstraint | undefined {
  if (constraint === undefined) return undefined;
  const normalized = Object.freeze({
    kind: constraint.kind,
    version: requireToken(constraint.version, "constraint_version"),
  });
  parseVersion(normalized.version, "constraint_version");
  return normalized;
}

function constraintIdentity(constraint: CatalogVersionConstraint): string {
  return `${constraint.kind}:${constraint.version}`;
}

function satisfiesVersionConstraint(record: SoftwareCatalogRecord, constraint: CatalogVersionConstraint): boolean {
  const candidate = parseVersion(record.version, "candidate_version");
  const requested = parseVersion(constraint.version, "constraint_version");
  const comparison = compareParsedVersion(candidate, requested);
  return constraint.kind === "exact" ? comparison === 0 : comparison >= 0;
}

export function resolveCatalogCandidates(
  registry: SoftwareCatalogRegistry,
  input: CatalogResolutionRequest,
): CatalogResolutionResult {
  const capability = requireToken(input.capability, "capability");
  const requestedVersion = input.version === undefined ? undefined : requireToken(input.version, "version");
  const requestedConstraint = normalizeResolutionConstraint(input.versionConstraint);
  if (requestedVersion !== undefined && requestedConstraint !== undefined) {
    throw new Error("CATALOG_CONFLICTING_VERSION_REQUEST");
  }
  const requestedCompatibility = normalizeCompatibility(input.compatibility);
  const capabilityCandidates = registry.list().filter((record) => record.capability === capability);

  if (capabilityCandidates.length === 0) {
    return Object.freeze({
      ok: false,
      diagnostic: Object.freeze({ code: "CAPABILITY_NOT_FOUND", capability }),
    });
  }

  const candidates = capabilityCandidates.filter(
    (record) =>
      (requestedVersion === undefined || record.version === requestedVersion) &&
      (requestedConstraint === undefined || satisfiesVersionConstraint(record, requestedConstraint)) &&
      satisfiesCompatibility(record, requestedCompatibility),
  );

  if (candidates.length === 0) {
    const diagnostic: CatalogResolutionDiagnostic = Object.freeze({
      code: "NO_COMPATIBLE_PROVIDER",
      capability,
      ...(requestedVersion === undefined ? {} : { requestedVersion }),
      ...(requestedConstraint === undefined ? {} : { requestedConstraint: constraintIdentity(requestedConstraint) }),
    });
    return Object.freeze({ ok: false, diagnostic });
  }

  return Object.freeze({ ok: true, candidates: Object.freeze([...candidates].sort(compareRecords)) });
}

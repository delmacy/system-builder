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
  compatibility?: Readonly<Record<string, string>>;
}>;

export type CatalogResolutionDiagnostic = Readonly<{
  code: "CAPABILITY_NOT_FOUND" | "NO_COMPATIBLE_PROVIDER";
  capability: string;
  requestedVersion?: string;
}>;

export type CatalogResolutionResult =
  | Readonly<{ ok: true; candidates: readonly SoftwareCatalogRecord[] }>
  | Readonly<{ ok: false; diagnostic: CatalogResolutionDiagnostic }>;

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
  readonly #records = new Map<string, SoftwareCatalogRecord>();

  register(input: SoftwareCatalogRecordInput): SoftwareCatalogRecord {
    const record = normalizeRecord(input);
    const identity = catalogIdentity(record);
    if (this.#records.has(identity)) {
      throw new Error(`CATALOG_DUPLICATE_IDENTITY:${identity}`);
    }
    this.#records.set(identity, record);
    return record;
  }

  list(): readonly SoftwareCatalogRecord[] {
    return Object.freeze([...this.#records.values()].sort(compareRecords));
  }
}

function satisfiesCompatibility(
  record: SoftwareCatalogRecord,
  requested: Readonly<Record<string, string>>,
): boolean {
  return Object.entries(requested).every(([key, value]) => record.compatibility[key] === value);
}

export function resolveCatalogCandidates(
  registry: SoftwareCatalogRegistry,
  input: CatalogResolutionRequest,
): CatalogResolutionResult {
  const capability = requireToken(input.capability, "capability");
  const requestedVersion = input.version === undefined ? undefined : requireToken(input.version, "version");
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
      satisfiesCompatibility(record, requestedCompatibility),
  );

  if (candidates.length === 0) {
    const diagnostic: CatalogResolutionDiagnostic = Object.freeze({
      code: "NO_COMPATIBLE_PROVIDER",
      capability,
      ...(requestedVersion === undefined ? {} : { requestedVersion }),
    });
    return Object.freeze({ ok: false, diagnostic });
  }

  return Object.freeze({ ok: true, candidates: Object.freeze([...candidates].sort(compareRecords)) });
}

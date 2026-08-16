import { sha256Canonical } from "@system-builder/deterministic";

export type AssemblyCapability = Readonly<{
  id: string;
  capability: string;
  requirementRefs: readonly string[];
}>;

export type AssemblySystemDefinition = Readonly<{
  definition: "SystemDefinition";
  analysisRef: string;
  recipeRef: string;
  capabilities: readonly AssemblyCapability[];
}>;

export type AssemblyVersionConstraint = Readonly<{
  kind: "exact" | "minimum";
  version: string;
}>;

export type AssemblyDependencyRequirement = Readonly<{
  capability: string;
  versionConstraint?: AssemblyVersionConstraint;
  compatibility: Readonly<Record<string, string>>;
}>;

export type AssemblyCandidate = Readonly<{
  capability: string;
  provider: string;
  version: string;
  dependencies: readonly string[];
  dependencyRequirements?: readonly AssemblyDependencyRequirement[];
}>;

export type AssemblyResolutionRequest = Readonly<{
  capability: string;
  versionConstraint?: AssemblyVersionConstraint;
  compatibility?: Readonly<Record<string, string>>;
}>;

export type AssemblyResolutionResult =
  | Readonly<{ ok: true; candidates: readonly AssemblyCandidate[] }>
  | Readonly<{
      ok: false;
      diagnostic: Readonly<{
        code: string;
        capability: string;
      }>;
    }>;

export type AssemblyCandidateResolver = (request: AssemblyResolutionRequest) => AssemblyResolutionResult;

export type AssemblyPlanComponent = Readonly<{
  capability: string;
  provider: string;
  version: string;
  dependencies?: readonly string[];
}>;

export type AssemblyPlan = Readonly<{
  kind: "AssemblyPlan";
  systemDefinitionRef: string;
  components: readonly AssemblyPlanComponent[];
  sourceRefs: readonly string[];
  contentHash: string;
}>;

export type AssemblyDiagnostic = Readonly<{
  code: "ASSEMBLY_CAPABILITY_UNRESOLVED" | "ASSEMBLY_DEPENDENCY_CYCLE" | "ASSEMBLY_REQUIREMENT_CONFLICT";
  capability: string;
  reason: string;
  path?: readonly string[];
  requirements?: readonly string[];
}>;

export type AssemblyResult =
  | Readonly<{ ok: true; plan: AssemblyPlan }>
  | Readonly<{ ok: false; diagnostics: readonly AssemblyDiagnostic[] }>;

type ParsedVersion = readonly [major: number, minor: number, patch: number];
type RequirementSet = Map<string, AssemblyDependencyRequirement[]>;

function compareCapability(left: AssemblyCapability, right: AssemblyCapability): number {
  return left.capability.localeCompare(right.capability) || left.id.localeCompare(right.id);
}

function compareComponent(left: AssemblyPlanComponent, right: AssemblyPlanComponent): number {
  return (
    left.capability.localeCompare(right.capability) ||
    left.provider.localeCompare(right.provider) ||
    left.version.localeCompare(right.version)
  );
}

function compareDependencyRequirement(left: AssemblyDependencyRequirement, right: AssemblyDependencyRequirement): number {
  return requirementIdentity(left).localeCompare(requirementIdentity(right));
}

function compareDiagnostic(left: AssemblyDiagnostic, right: AssemblyDiagnostic): number {
  return (
    left.capability.localeCompare(right.capability) ||
    left.code.localeCompare(right.code) ||
    left.reason.localeCompare(right.reason) ||
    JSON.stringify(left.path ?? []).localeCompare(JSON.stringify(right.path ?? [])) ||
    JSON.stringify(left.requirements ?? []).localeCompare(JSON.stringify(right.requirements ?? []))
  );
}

function selectCandidate(candidates: readonly AssemblyCandidate[]): AssemblyCandidate {
  const ordered = [...candidates].sort(
    (left, right) =>
      left.provider.localeCompare(right.provider) ||
      left.version.localeCompare(right.version) ||
      left.capability.localeCompare(right.capability),
  );
  const selected = ordered[0];
  if (!selected) throw new Error("ASSEMBLY_EMPTY_CANDIDATE_SET");
  return selected;
}

function parseVersion(value: string): ParsedVersion {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(value);
  if (!match) throw new Error(`ASSEMBLY_INVALID_CONSTRAINT_VERSION:${value}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compareVersion(left: string, right: string): number {
  const a = parseVersion(left);
  const b = parseVersion(right);
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
}

function requirementIdentity(requirement: AssemblyDependencyRequirement): string {
  const compatibility = Object.entries(requirement.compatibility)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join(",");
  return [
    requirement.capability,
    requirement.versionConstraint?.kind ?? "any",
    requirement.versionConstraint?.version ?? "*",
    compatibility,
  ].join("|");
}

function addRequirement(target: RequirementSet, requirement: AssemblyDependencyRequirement): void {
  const existing = target.get(requirement.capability) ?? [];
  const identity = requirementIdentity(requirement);
  if (!existing.some((item) => requirementIdentity(item) === identity)) {
    target.set(requirement.capability, [...existing, requirement].sort(compareDependencyRequirement));
  }
}

function requirementSetIdentity(requirements: RequirementSet): string {
  return [...requirements.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([capability, values]) => `${capability}:${values.map(requirementIdentity).sort().join(";")}`)
    .join("||");
}

function conflictDiagnostic(
  capability: string,
  reason: string,
  requirements: readonly AssemblyDependencyRequirement[],
): AssemblyDiagnostic {
  return Object.freeze({
    code: "ASSEMBLY_REQUIREMENT_CONFLICT",
    capability,
    reason,
    requirements: Object.freeze(requirements.map(requirementIdentity).sort()),
  });
}

function combineRequirements(
  capability: string,
  requirements: readonly AssemblyDependencyRequirement[],
): Readonly<{ ok: true; request: AssemblyResolutionRequest }> | Readonly<{ ok: false; diagnostic: AssemblyDiagnostic }> {
  const ordered = [...requirements].sort(compareDependencyRequirement);
  const exactVersions = [...new Set(
    ordered.filter((item) => item.versionConstraint?.kind === "exact").map((item) => item.versionConstraint!.version),
  )].sort(compareVersion);
  if (exactVersions.length > 1) {
    return Object.freeze({ ok: false, diagnostic: conflictDiagnostic(capability, "INCOMPATIBLE_EXACT_VERSIONS", ordered) });
  }

  const minimumVersions = ordered
    .filter((item) => item.versionConstraint?.kind === "minimum")
    .map((item) => item.versionConstraint!.version)
    .sort(compareVersion);
  const minimumVersion = minimumVersions.at(-1);
  const exactVersion = exactVersions[0];
  if (exactVersion !== undefined && minimumVersion !== undefined && compareVersion(exactVersion, minimumVersion) < 0) {
    return Object.freeze({ ok: false, diagnostic: conflictDiagnostic(capability, "EXACT_BELOW_MINIMUM", ordered) });
  }

  const compatibility = new Map<string, string>();
  for (const requirement of ordered) {
    for (const [key, value] of Object.entries(requirement.compatibility).sort(([left], [right]) => left.localeCompare(right))) {
      const prior = compatibility.get(key);
      if (prior !== undefined && prior !== value) {
        return Object.freeze({ ok: false, diagnostic: conflictDiagnostic(capability, `INCOMPATIBLE_COMPATIBILITY:${key}`, ordered) });
      }
      compatibility.set(key, value);
    }
  }

  const versionConstraint = exactVersion !== undefined
    ? Object.freeze({ kind: "exact" as const, version: exactVersion })
    : minimumVersion !== undefined
      ? Object.freeze({ kind: "minimum" as const, version: minimumVersion })
      : undefined;
  const normalizedCompatibility = Object.freeze(Object.fromEntries([...compatibility.entries()].sort(([a], [b]) => a.localeCompare(b))));
  return Object.freeze({
    ok: true,
    request: Object.freeze({
      capability,
      ...(versionConstraint === undefined ? {} : { versionConstraint }),
      ...(Object.keys(normalizedCompatibility).length === 0 ? {} : { compatibility: normalizedCompatibility }),
    }),
  });
}

function detectCycle(selected: ReadonlyMap<string, AssemblyCandidate>): readonly string[] | undefined {
  const visited = new Set<string>();
  const active = new Set<string>();
  const stack: string[] = [];

  const visit = (capability: string): readonly string[] | undefined => {
    if (active.has(capability)) {
      const start = stack.indexOf(capability);
      return Object.freeze([...stack.slice(start), capability]);
    }
    if (visited.has(capability)) return undefined;
    visited.add(capability);
    active.add(capability);
    stack.push(capability);
    const dependencies = [...(selected.get(capability)?.dependencyRequirements ?? [])]
      .map((item) => item.capability)
      .filter((dependency, index, values) => values.indexOf(dependency) === index)
      .sort();
    for (const dependency of dependencies) {
      if (!selected.has(dependency)) continue;
      const cycle = visit(dependency);
      if (cycle !== undefined) return cycle;
    }
    stack.pop();
    active.delete(capability);
    return undefined;
  };

  for (const capability of [...selected.keys()].sort()) {
    const cycle = visit(capability);
    if (cycle !== undefined) return cycle;
  }
  return undefined;
}

function rootRequirement(capability: string): AssemblyDependencyRequirement {
  return Object.freeze({ capability, compatibility: Object.freeze({}) });
}

export function assembleSystemDefinition(
  definition: AssemblySystemDefinition,
  systemDefinitionRef: string,
  resolveCandidate: AssemblyCandidateResolver,
): AssemblyResult {
  const reference = systemDefinitionRef.trim();
  if (reference.length === 0) throw new Error("ASSEMBLY_INVALID_SYSTEM_DEFINITION_REF");

  const roots = [...definition.capabilities].sort(compareCapability).map((item) => rootRequirement(item.capability));
  let requirements: RequirementSet = new Map();
  for (const root of roots) addRequirement(requirements, root);
  let priorIdentity = "";
  let selected = new Map<string, AssemblyCandidate>();

  for (let iteration = 0; iteration < 256; iteration += 1) {
    const diagnostics: AssemblyDiagnostic[] = [];
    const nextSelected = new Map<string, AssemblyCandidate>();

    for (const capability of [...requirements.keys()].sort()) {
      const combined = combineRequirements(capability, requirements.get(capability) ?? []);
      if (!combined.ok) {
        diagnostics.push(combined.diagnostic);
        continue;
      }
      const resolution = resolveCandidate(combined.request);
      if (!resolution.ok || resolution.candidates.length === 0) {
        diagnostics.push(Object.freeze({
          code: "ASSEMBLY_CAPABILITY_UNRESOLVED",
          capability,
          reason: resolution.ok ? "EMPTY_CANDIDATE_SET" : resolution.diagnostic.code,
          requirements: Object.freeze((requirements.get(capability) ?? []).map(requirementIdentity).sort()),
        }));
        continue;
      }
      nextSelected.set(capability, selectCandidate(resolution.candidates));
    }

    if (diagnostics.length > 0) {
      return Object.freeze({ ok: false, diagnostics: Object.freeze(diagnostics.sort(compareDiagnostic)) });
    }

    const cycle = detectCycle(nextSelected);
    if (cycle !== undefined) {
      return Object.freeze({
        ok: false,
        diagnostics: Object.freeze([
          Object.freeze({
            code: "ASSEMBLY_DEPENDENCY_CYCLE",
            capability: cycle[0] ?? "",
            reason: "DEPENDENCY_CYCLE",
            path: cycle,
          }),
        ]),
      });
    }

    const nextRequirements: RequirementSet = new Map();
    for (const root of roots) addRequirement(nextRequirements, root);
    for (const capability of [...nextSelected.keys()].sort()) {
      const dependencies = [...(nextSelected.get(capability)?.dependencyRequirements ?? [])].sort(compareDependencyRequirement);
      for (const dependency of dependencies) addRequirement(nextRequirements, dependency);
    }

    const identity = requirementSetIdentity(nextRequirements);
    selected = nextSelected;
    if (identity === priorIdentity || identity === requirementSetIdentity(requirements)) {
      requirements = nextRequirements;
      break;
    }
    priorIdentity = requirementSetIdentity(requirements);
    requirements = nextRequirements;
    if (iteration === 255) throw new Error("ASSEMBLY_GRAPH_DID_NOT_CONVERGE");
  }

  const components: AssemblyPlanComponent[] = [];
  for (const capability of [...selected.keys()].sort()) {
    const candidate = selected.get(capability)!;
    const structuredRequirements = [...(candidate.dependencyRequirements ?? [])].sort(compareDependencyRequirement);
    const dependencyNames = Object.freeze(
      [...new Set([...candidate.dependencies, ...structuredRequirements.map((dependency) => dependency.capability)])].sort(),
    );
    components.push(Object.freeze({
      capability,
      provider: candidate.provider,
      version: candidate.version,
      ...(dependencyNames.length === 0 ? {} : { dependencies: dependencyNames }),
    }));
  }

  const orderedComponents = Object.freeze(components.sort(compareComponent));
  const sourceRefs = Object.freeze([
    reference,
    ...orderedComponents.map(
      (component) => `catalog:${component.capability}:${component.provider}:${component.version}`,
    ),
  ]);
  const payload = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: reference,
    components: orderedComponents,
    sourceRefs,
  };
  const plan: AssemblyPlan = Object.freeze({ ...payload, contentHash: sha256Canonical(payload) });
  return Object.freeze({ ok: true, plan });
}

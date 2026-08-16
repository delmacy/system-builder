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
  code: "ASSEMBLY_CAPABILITY_UNRESOLVED";
  capability: string;
  reason: string;
}>;

export type AssemblyResult =
  | Readonly<{ ok: true; plan: AssemblyPlan }>
  | Readonly<{ ok: false; diagnostics: readonly AssemblyDiagnostic[] }>;

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
  return (
    left.capability.localeCompare(right.capability) ||
    (left.versionConstraint?.kind ?? "").localeCompare(right.versionConstraint?.kind ?? "") ||
    (left.versionConstraint?.version ?? "").localeCompare(right.versionConstraint?.version ?? "") ||
    JSON.stringify(left.compatibility).localeCompare(JSON.stringify(right.compatibility))
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

function resolverRequest(requirement: AssemblyDependencyRequirement): AssemblyResolutionRequest {
  return Object.freeze({
    capability: requirement.capability,
    ...(requirement.versionConstraint === undefined ? {} : { versionConstraint: requirement.versionConstraint }),
    ...(Object.keys(requirement.compatibility).length === 0 ? {} : { compatibility: requirement.compatibility }),
  });
}

export function assembleSystemDefinition(
  definition: AssemblySystemDefinition,
  systemDefinitionRef: string,
  resolveCandidate: AssemblyCandidateResolver,
): AssemblyResult {
  const reference = systemDefinitionRef.trim();
  if (reference.length === 0) throw new Error("ASSEMBLY_INVALID_SYSTEM_DEFINITION_REF");

  const rootRequirements = [...definition.capabilities]
    .sort(compareCapability)
    .map((requirement): AssemblyDependencyRequirement =>
      Object.freeze({ capability: requirement.capability, compatibility: Object.freeze({}) }),
    );
  const components = new Map<string, AssemblyPlanComponent>();
  const diagnostics: AssemblyDiagnostic[] = [];
  const resolving = new Set<string>();

  const resolveRequirement = (requirement: AssemblyDependencyRequirement): void => {
    if (components.has(requirement.capability)) return;
    if (resolving.has(requirement.capability)) return;

    resolving.add(requirement.capability);
    const resolution = resolveCandidate(resolverRequest(requirement));
    if (!resolution.ok || resolution.candidates.length === 0) {
      diagnostics.push(
        Object.freeze({
          code: "ASSEMBLY_CAPABILITY_UNRESOLVED",
          capability: requirement.capability,
          reason: resolution.ok ? "EMPTY_CANDIDATE_SET" : resolution.diagnostic.code,
        }),
      );
      resolving.delete(requirement.capability);
      return;
    }

    const selected = selectCandidate(resolution.candidates);
    const structuredRequirements = [...(selected.dependencyRequirements ?? [])].sort(compareDependencyRequirement);
    const dependencyNames = Object.freeze(
      [...new Set([...selected.dependencies, ...structuredRequirements.map((dependency) => dependency.capability)])].sort(),
    );
    components.set(
      requirement.capability,
      Object.freeze({
        capability: requirement.capability,
        provider: selected.provider,
        version: selected.version,
        ...(dependencyNames.length === 0 ? {} : { dependencies: dependencyNames }),
      }),
    );

    for (const dependency of structuredRequirements) resolveRequirement(dependency);
    resolving.delete(requirement.capability);
  };

  for (const requirement of rootRequirements) resolveRequirement(requirement);

  if (diagnostics.length > 0) {
    return Object.freeze({
      ok: false,
      diagnostics: Object.freeze(
        [...diagnostics].sort((left, right) => left.capability.localeCompare(right.capability) || left.reason.localeCompare(right.reason)),
      ),
    });
  }

  const orderedComponents = Object.freeze([...components.values()].sort(compareComponent));
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

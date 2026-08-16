import { createHash } from "node:crypto";

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

export type AssemblyCandidate = Readonly<{
  capability: string;
  provider: string;
  version: string;
  dependencies: readonly string[];
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

export type AssemblyCandidateResolver = (request: Readonly<{ capability: string }>) => AssemblyResolutionResult;

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

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, stableValue(nested)]),
    );
  }
  return value;
}

function sha256(value: unknown): string {
  const canonical = JSON.stringify(stableValue(value));
  return `sha256:${createHash("sha256").update(canonical).digest("hex")}`;
}

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

export function assembleSystemDefinition(
  definition: AssemblySystemDefinition,
  systemDefinitionRef: string,
  resolveCandidate: AssemblyCandidateResolver,
): AssemblyResult {
  const reference = systemDefinitionRef.trim();
  if (reference.length === 0) throw new Error("ASSEMBLY_INVALID_SYSTEM_DEFINITION_REF");

  const requirements = [...definition.capabilities].sort(compareCapability);
  const components: AssemblyPlanComponent[] = [];
  const diagnostics: AssemblyDiagnostic[] = [];
  const seenCapabilities = new Set<string>();

  for (const requirement of requirements) {
    if (seenCapabilities.has(requirement.capability)) continue;
    seenCapabilities.add(requirement.capability);
    const resolution = resolveCandidate({ capability: requirement.capability });
    if (!resolution.ok || resolution.candidates.length === 0) {
      diagnostics.push(
        Object.freeze({
          code: "ASSEMBLY_CAPABILITY_UNRESOLVED",
          capability: requirement.capability,
          reason: resolution.ok ? "EMPTY_CANDIDATE_SET" : resolution.diagnostic.code,
        }),
      );
      continue;
    }

    const selected = selectCandidate(resolution.candidates);
    const dependencies = Object.freeze([...selected.dependencies].sort());
    components.push(
      Object.freeze({
        capability: requirement.capability,
        provider: selected.provider,
        version: selected.version,
        ...(dependencies.length === 0 ? {} : { dependencies }),
      }),
    );
  }

  if (diagnostics.length > 0) {
    return Object.freeze({
      ok: false,
      diagnostics: Object.freeze(
        [...diagnostics].sort((left, right) => left.capability.localeCompare(right.capability)),
      ),
    });
  }

  const orderedComponents = Object.freeze([...components].sort(compareComponent));
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
  const plan: AssemblyPlan = Object.freeze({ ...payload, contentHash: sha256(payload) });
  return Object.freeze({ ok: true, plan });
}

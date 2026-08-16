import { createHash } from "node:crypto";

export type RequirementCarrier = Readonly<{
  requirementIds: readonly string[];
}>;

export type BusinessRecipeTraceability = Readonly<{
  modules: readonly RequirementCarrier[];
  rules: readonly RequirementCarrier[];
  responsibilities: readonly RequirementCarrier[];
  exceptions: readonly RequirementCarrier[];
}>;

export type SystemAnalysisTraceability = Readonly<{
  findings: readonly Readonly<{ recipeRequirementRefs: readonly string[] }>[];
}>;

export type SystemDefinitionTraceability = Readonly<{
  entities: readonly Readonly<{ requirementRefs: readonly string[] }>[];
  processes: readonly Readonly<{ requirementRefs: readonly string[] }>[];
  actions: readonly Readonly<{ requirementRefs: readonly string[] }>[];
  capabilities: readonly Readonly<{
    capability: string;
    requirementRefs: readonly string[];
  }>[];
  views: readonly Readonly<{ requirementRefs: readonly string[] }>[];
  policies: readonly Readonly<{ requirementRefs: readonly string[] }>[];
  integrations: readonly Readonly<{ requirementRefs: readonly string[] }>[];
}>;

export type AssemblyPlanTraceability = Readonly<{
  kind: "AssemblyPlan";
  components: readonly Readonly<{ capability: string }>[];
  contentHash: string;
}>;

export type DeclaredValidationCheck = Readonly<{
  id: string;
  status: "PASS" | "FAIL";
  evidenceRefs?: readonly string[];
}>;

export type ValidationCheck = Readonly<{
  id: string;
  status: "PASS" | "FAIL";
  evidenceRefs?: readonly string[];
}>;

export type ValidationEvidence = Readonly<{
  kind: "ValidationEvidence";
  assemblyPlanRef: string;
  decision: "PASS" | "FAIL";
  checks: readonly ValidationCheck[];
  evidenceHash: string;
}>;

export type ValidateTraceabilityInput = Readonly<{
  recipe: BusinessRecipeTraceability;
  analysis: SystemAnalysisTraceability;
  definition: SystemDefinitionTraceability;
  assemblyPlan: AssemblyPlanTraceability;
  assemblyPlanRef: string;
  declaredChecks?: readonly DeclaredValidationCheck[];
}>;

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
  return `sha256:${createHash("sha256").update(JSON.stringify(stableValue(value))).digest("hex")}`;
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort((left, right) => left.localeCompare(right)));
}

function recipeRequirementIds(recipe: BusinessRecipeTraceability): readonly string[] {
  return uniqueSorted(
    [...recipe.modules, ...recipe.rules, ...recipe.responsibilities, ...recipe.exceptions].flatMap(
      (carrier) => carrier.requirementIds,
    ),
  );
}

function definitionRequirementIds(definition: SystemDefinitionTraceability): readonly string[] {
  return uniqueSorted(
    [
      ...definition.entities,
      ...definition.processes,
      ...definition.actions,
      ...definition.capabilities,
      ...definition.views,
      ...definition.policies,
      ...definition.integrations,
    ].flatMap((carrier) => carrier.requirementRefs),
  );
}

function makeTraceabilityCheck(
  requirementId: string,
  analysisRefs: ReadonlySet<string>,
  definitionRefs: ReadonlySet<string>,
  capabilitiesByRequirement: ReadonlyMap<string, readonly string[]>,
  assembledCapabilities: ReadonlySet<string>,
): ValidationCheck {
  const analysisPresent = analysisRefs.has(requirementId);
  const definitionPresent = definitionRefs.has(requirementId);
  const capabilities = capabilitiesByRequirement.get(requirementId) ?? [];
  const resolvedCapabilities = capabilities.filter((capability) => assembledCapabilities.has(capability));
  const status: "PASS" | "FAIL" =
    analysisPresent && definitionPresent && capabilities.length > 0 && resolvedCapabilities.length > 0
      ? "PASS"
      : "FAIL";
  const evidenceRefs = uniqueSorted([
    `recipe:${requirementId}`,
    analysisPresent ? `analysis:${requirementId}` : `missing:analysis:${requirementId}`,
    definitionPresent ? `definition:${requirementId}` : `missing:definition:${requirementId}`,
    ...(capabilities.length === 0
      ? [`missing:definition-capability:${requirementId}`]
      : capabilities.map((capability) =>
          assembledCapabilities.has(capability)
            ? `assembly:${capability}`
            : `missing:assembly:${capability}`,
        )),
  ]);
  return Object.freeze({
    id: `traceability:${requirementId}`,
    status,
    evidenceRefs,
  });
}

function normalizeDeclaredCheck(check: DeclaredValidationCheck): ValidationCheck {
  const id = check.id.trim();
  if (id.length === 0) throw new Error("VALIDATION_INVALID_CHECK_ID");
  const evidenceRefs = uniqueSorted(check.evidenceRefs ?? []);
  return Object.freeze({
    id: `declared:${id}`,
    status: check.status,
    ...(evidenceRefs.length === 0 ? {} : { evidenceRefs }),
  });
}

export function validateTraceability(input: ValidateTraceabilityInput): ValidationEvidence {
  const assemblyPlanRef = input.assemblyPlanRef.trim();
  if (assemblyPlanRef.length === 0) throw new Error("VALIDATION_INVALID_ASSEMBLY_PLAN_REF");

  const requirements = recipeRequirementIds(input.recipe);
  const analysisRefs = new Set(input.analysis.findings.flatMap((finding) => finding.recipeRequirementRefs));
  const definitionRefs = new Set(definitionRequirementIds(input.definition));
  const assembledCapabilities = new Set(input.assemblyPlan.components.map((component) => component.capability));
  const capabilitiesByRequirement = new Map<string, readonly string[]>();

  for (const requirementId of requirements) {
    capabilitiesByRequirement.set(
      requirementId,
      uniqueSorted(
        input.definition.capabilities
          .filter((capability) => capability.requirementRefs.includes(requirementId))
          .map((capability) => capability.capability),
      ),
    );
  }

  const checks = [
    ...requirements.map((requirementId) =>
      makeTraceabilityCheck(
        requirementId,
        analysisRefs,
        definitionRefs,
        capabilitiesByRequirement,
        assembledCapabilities,
      ),
    ),
    ...(input.declaredChecks ?? []).map(normalizeDeclaredCheck),
  ].sort((left, right) => left.id.localeCompare(right.id));

  if (checks.length === 0) throw new Error("VALIDATION_NO_CHECKS");

  const frozenChecks = Object.freeze(checks);
  const decision: "PASS" | "FAIL" = frozenChecks.every((check) => check.status === "PASS") ? "PASS" : "FAIL";
  const payload = {
    kind: "ValidationEvidence" as const,
    assemblyPlanRef,
    decision,
    checks: frozenChecks,
  };

  return Object.freeze({ ...payload, evidenceHash: sha256(payload) });
}

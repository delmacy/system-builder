import {
  normalizeFactoryJourneyInputBinding,
  type FactoryJourneyInputBinding,
} from "@system-builder/contracts/factory-boundary";
import {
  validateTraceability,
  type AssemblyPlanTraceability,
  type BusinessRecipeTraceability,
  type DeclaredValidationCheck,
  type SystemAnalysisTraceability,
  type SystemDefinitionTraceability,
  type ValidationEvidence,
} from "./index.js";

export type FactoryValidationAssemblyPlan = AssemblyPlanTraceability & Readonly<{
  systemDefinitionRef: string;
  sourceRefs: readonly string[];
}>;

export type FactoryAssemblyValidationRequest = Readonly<{
  journeyBinding: unknown;
  recipe: BusinessRecipeTraceability;
  analysis: SystemAnalysisTraceability;
  definition: SystemDefinitionTraceability;
  assemblyPlan: FactoryValidationAssemblyPlan;
  declaredChecks?: readonly DeclaredValidationCheck[];
}>;

export type FactoryAssemblyValidationComposition = Readonly<{
  binding: FactoryJourneyInputBinding;
  assemblyPlanRef: string;
  validationEvidence: ValidationEvidence;
}>;

/**
 * Binds ValidationEvidence to the exact AssemblyPlan produced for the canonical
 * factory journey. The successor reference is derived from the plan hash rather
 * than accepted from the caller.
 */
export function composeFactoryAssemblyValidation(
  request: FactoryAssemblyValidationRequest,
): FactoryAssemblyValidationComposition {
  const binding = normalizeFactoryJourneyInputBinding(request.journeyBinding);
  const canonicalDefinitionRef = binding.lineage.systemDefinition.identityRef;
  const plan = request.assemblyPlan;

  if (plan.kind !== "AssemblyPlan") {
    throw new Error("FACTORY_VALIDATION_INVALID_ASSEMBLY_PLAN");
  }
  if (plan.systemDefinitionRef !== canonicalDefinitionRef) {
    throw new Error("FACTORY_VALIDATION_SYSTEM_DEFINITION_MISMATCH");
  }
  if (plan.sourceRefs[0] !== canonicalDefinitionRef) {
    throw new Error("FACTORY_VALIDATION_ASSEMBLY_PROVENANCE_MISMATCH");
  }
  if (!/^sha256:[a-f0-9]{64}$/.test(plan.contentHash)) {
    throw new Error("FACTORY_VALIDATION_INVALID_ASSEMBLY_PLAN_HASH");
  }

  const validationEvidence = validateTraceability({
    recipe: request.recipe,
    analysis: request.analysis,
    definition: request.definition,
    assemblyPlan: plan,
    assemblyPlanRef: plan.contentHash,
    ...(request.declaredChecks === undefined ? {} : { declaredChecks: request.declaredChecks }),
  });

  if (validationEvidence.assemblyPlanRef !== plan.contentHash) {
    throw new Error("FACTORY_VALIDATION_ASSEMBLY_REFERENCE_MISMATCH");
  }

  return Object.freeze({
    binding,
    assemblyPlanRef: plan.contentHash,
    validationEvidence,
  });
}

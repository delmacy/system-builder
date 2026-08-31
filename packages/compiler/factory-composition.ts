import {
  normalizeFactoryJourneyInputBinding,
  type FactoryJourneyInputBinding,
} from "@system-builder/contracts/factory-boundary";
import {
  compileSyntheticRelease,
  type CompileSyntheticInput,
  type SyntheticCompilation,
} from "./index.js";

export type FactoryCompilerCompositionRequest = Readonly<{
  journeyBinding: unknown;
  assemblyPlan: CompileSyntheticInput["assemblyPlan"];
  validationEvidence: CompileSyntheticInput["validationEvidence"];
  compilerVersion: string;
  runtimeVersion: string;
  environmentSchema?: CompileSyntheticInput["environmentSchema"];
  stateRequirements?: CompileSyntheticInput["stateRequirements"];
  evidenceProvenance?: CompileSyntheticInput["evidenceProvenance"];
}>;

export type FactoryCompilerComposition = Readonly<{
  binding: FactoryJourneyInputBinding;
  assemblyPlanRef: string;
  validationEvidenceRef: string;
  compilation: SyntheticCompilation;
}>;

/**
 * Compiles only after proving the exact canonical SystemDefinition ->
 * AssemblyPlan -> ValidationEvidence predecessor chain. No release publication,
 * deployment mutation, or runtime launch occurs here.
 */
export function composeFactoryCompilerReleaseArtifact(
  request: FactoryCompilerCompositionRequest,
): FactoryCompilerComposition {
  const binding = normalizeFactoryJourneyInputBinding(request.journeyBinding);
  const canonicalDefinitionRef = binding.lineage.systemDefinition.identityRef;
  const plan = request.assemblyPlan;
  const validation = request.validationEvidence;

  if (plan.systemDefinitionRef !== canonicalDefinitionRef) {
    throw new Error("FACTORY_COMPILER_SYSTEM_DEFINITION_MISMATCH");
  }
  if (plan.sourceRefs[0] !== canonicalDefinitionRef) {
    throw new Error("FACTORY_COMPILER_ASSEMBLY_PROVENANCE_MISMATCH");
  }
  if (validation.assemblyPlanRef !== plan.contentHash) {
    throw new Error("FACTORY_COMPILER_VALIDATION_PREDECESSOR_MISMATCH");
  }

  const compilation = compileSyntheticRelease({
    assemblyPlan: plan,
    validationEvidence: validation,
    compilerVersion: request.compilerVersion,
    runtimeVersion: request.runtimeVersion,
    ...(request.environmentSchema === undefined ? {} : { environmentSchema: request.environmentSchema }),
    ...(request.stateRequirements === undefined ? {} : { stateRequirements: request.stateRequirements }),
    ...(request.evidenceProvenance === undefined ? {} : { evidenceProvenance: request.evidenceProvenance }),
  });

  if (compilation.artifact.assemblyPlanRef !== plan.contentHash) {
    throw new Error("FACTORY_COMPILER_ARTIFACT_ASSEMBLY_MISMATCH");
  }
  if (compilation.artifact.validationEvidenceRef !== validation.evidenceHash) {
    throw new Error("FACTORY_COMPILER_ARTIFACT_VALIDATION_MISMATCH");
  }

  return Object.freeze({
    binding,
    assemblyPlanRef: plan.contentHash,
    validationEvidenceRef: validation.evidenceHash,
    compilation,
  });
}

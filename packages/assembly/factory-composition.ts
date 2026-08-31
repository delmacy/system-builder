import {
  assembleSystemDefinition,
  type AssemblyResult,
  type AssemblySystemDefinition,
} from "./index.js";
import {
  normalizeFactoryJourneyInputBinding,
  type FactoryJourneyInputBinding,
} from "../contracts/factory-boundary/journey.js";
import {
  resolveCatalogCandidates,
  type SoftwareCatalogRegistry,
} from "../catalog/index.js";

export type FactoryCompositionRequest = Readonly<{
  journeyBinding: unknown;
  definition: AssemblySystemDefinition;
  catalog: SoftwareCatalogRegistry;
}>;

export type FactoryCompositionResult = Readonly<{
  binding: FactoryJourneyInputBinding;
  assembly: AssemblyResult;
}>;

/**
 * Bounded deterministic seam from the canonical factory journey into the
 * existing catalog + assembly APIs. This function creates no execution,
 * persistence, publication, or deployment authority.
 */
export function composeFactoryJourney(request: FactoryCompositionRequest): FactoryCompositionResult {
  const binding = normalizeFactoryJourneyInputBinding(request.journeyBinding);
  const systemDefinitionRef = binding.lineage.systemDefinition.identityRef;

  if (request.definition.analysisRef !== binding.lineage.analysis.identityRef) {
    throw new Error("FACTORY_COMPOSITION_ANALYSIS_IDENTITY_MISMATCH");
  }

  const assembly = assembleSystemDefinition(
    request.definition,
    systemDefinitionRef,
    (resolutionRequest) => {
      const resolution = resolveCatalogCandidates(request.catalog, resolutionRequest);
      if (!resolution.ok) return resolution;
      return Object.freeze({
        ok: true as const,
        candidates: Object.freeze(resolution.candidates.map((candidate) => Object.freeze({
          capability: candidate.capability,
          provider: candidate.provider,
          version: candidate.version,
          dependencies: candidate.dependencies,
          dependencyRequirements: candidate.dependencyRequirements,
        }))),
      });
    },
  );

  return Object.freeze({ binding, assembly });
}

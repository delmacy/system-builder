import {
  normalizeFactoryJourneyOutputBinding,
  type FactoryJourneyOutputBinding,
} from "./journey.js";

/**
 * Canonical fail-closed normalization for the complete P19 factory journey.
 *
 * This validator is deliberately contract-only: it proves ordered identity and
 * predecessor continuity without introducing execution, publication, deployment,
 * persistence, or runtime authority.
 */
export function normalizeCanonicalFactoryJourney(input: unknown): FactoryJourneyOutputBinding {
  const normalized = normalizeFactoryJourneyOutputBinding(input);
  const stages = normalized.input.journey.stages;

  const identities = stages.map((stage) => stage.identityRef);
  if (new Set(identities).size !== identities.length) {
    throw new Error("factory journey contains duplicate stage identity");
  }

  const [approvedProcess, analysisDefinition, capabilityAssembly, validation, compilerRelease, deployment] = stages;
  if (!approvedProcess || !analysisDefinition || !capabilityAssembly || !validation || !compilerRelease || !deployment) {
    throw new Error("factory journey is incomplete");
  }

  if (analysisDefinition.provenanceRef !== approvedProcess.identityRef) {
    throw new Error("analysis-definition predecessor is not the approved-process identity");
  }
  if (capabilityAssembly.provenanceRef !== normalized.references.systemDefinitionRef) {
    throw new Error("capability-assembly predecessor is not the canonical system-definition identity");
  }
  if (validation.provenanceRef !== capabilityAssembly.identityRef) {
    throw new Error("validation predecessor is not the capability-assembly identity");
  }
  if (compilerRelease.provenanceRef !== validation.identityRef) {
    throw new Error("compiler-release predecessor is not the validation identity");
  }
  if (deployment.provenanceRef !== compilerRelease.identityRef) {
    throw new Error("deployment predecessor is not the compiler-release identity");
  }

  return normalized;
}

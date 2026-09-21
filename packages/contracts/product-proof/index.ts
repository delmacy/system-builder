export const PRODUCT_PROOF_STATES = [
  "UNKNOWN",
  "PARTIAL",
  "PASS",
  "FAIL",
] as const;

export type ProductProofState = (typeof PRODUCT_PROOF_STATES)[number];

export const PRODUCT_PROOF_QUALIFICATION_STATES = [
  "PASS",
  "PARTIAL",
  "INCONCLUSIVE",
  "BLOCKED",
  "FAIL",
  "NA",
  "DEFERRED",
] as const;

export type ProductProofQualificationState =
  (typeof PRODUCT_PROOF_QUALIFICATION_STATES)[number];

export const PRODUCT_PROOF_CLASSES = [
  "POSITIVE",
  "NEGATIVE",
  "ADVERSARIAL",
  "RECOVERY",
] as const;

export type ProductProofClass = (typeof PRODUCT_PROOF_CLASSES)[number];

export interface ProductProofProducerRef {
  ownerId: string;
  producerId: string;
  revision: string;
}

export interface ProductProofAcceptanceTargetRef {
  targetId: string;
  revision: string;
}

export interface ProductProofObligation {
  obligationId: string;
  revision: string;
  producer: ProductProofProducerRef;
  acceptanceTarget: ProductProofAcceptanceTargetRef;
  proofClass: ProductProofClass;
}

export interface ProductProofEvidenceRoute {
  routeId: string;
  obligationId: string;
  obligationRevision: string;
  producer: ProductProofProducerRef;
  evidenceRef?: string;
  evidenceRevision?: string;
  observedState?: Exclude<ProductProofState, "UNKNOWN">;
}

export interface ProductProofObservation {
  obligationId: string;
  obligationRevision: string;
  producer: ProductProofProducerRef;
  proofClass: ProductProofClass;
  state: ProductProofState;
  evidenceRef?: string;
  evidenceRevision?: string;
}

export interface ProductProofEvidenceQualification {
  evidenceRevision: string;
  populationId: string;
  locality: string;
  provenance: string;
  producer: ProductProofProducerRef;
  state: ProductProofQualificationState;
  current: boolean;
}

export interface ProductProofQualificationTarget {
  evidenceRevision: string;
  populationId: string;
  locality: string;
  producer: ProductProofProducerRef;
}

export interface QualifiedProductProofObservation extends ProductProofObservation {
  qualificationState: ProductProofQualificationState | "UNKNOWN";
  current: boolean;
  populationId?: string;
  locality?: string;
  provenance?: string;
}

/**
 * Resolves only routing/availability. The producer remains the semantic owner of
 * the evidence and its meaning. A design or acceptance target is never promoted
 * to executed Product Proof by this registry.
 */
export function observeProductProof(
  obligation: ProductProofObligation,
  route?: ProductProofEvidenceRoute,
): ProductProofObservation {
  const compatible =
    route !== undefined &&
    route.obligationId === obligation.obligationId &&
    route.obligationRevision === obligation.revision &&
    route.producer.ownerId === obligation.producer.ownerId &&
    route.producer.producerId === obligation.producer.producerId &&
    route.producer.revision === obligation.producer.revision;

  if (!compatible || !route?.evidenceRef || !route.evidenceRevision || !route.observedState) {
    return {
      obligationId: obligation.obligationId,
      obligationRevision: obligation.revision,
      producer: obligation.producer,
      proofClass: obligation.proofClass,
      state: "UNKNOWN",
    };
  }

  return {
    obligationId: obligation.obligationId,
    obligationRevision: obligation.revision,
    producer: obligation.producer,
    proofClass: obligation.proofClass,
    state: route.observedState,
    evidenceRef: route.evidenceRef,
    evidenceRevision: route.evidenceRevision,
  };
}

/**
 * Qualifies already-routed producer evidence. Qualification may weaken usability,
 * but never strengthens the producer-owned observation or fabricates evidence.
 */
export function qualifyProductProofEvidence(
  observation: ProductProofObservation,
  qualification: ProductProofEvidenceQualification | undefined,
  target: ProductProofQualificationTarget,
): QualifiedProductProofObservation {
  const compatible =
    observation.evidenceRevision !== undefined &&
    qualification !== undefined &&
    qualification.evidenceRevision === observation.evidenceRevision &&
    qualification.evidenceRevision === target.evidenceRevision &&
    qualification.populationId === target.populationId &&
    qualification.locality === target.locality &&
    qualification.producer.ownerId === observation.producer.ownerId &&
    qualification.producer.producerId === observation.producer.producerId &&
    qualification.producer.revision === observation.producer.revision &&
    qualification.producer.ownerId === target.producer.ownerId &&
    qualification.producer.producerId === target.producer.producerId &&
    qualification.producer.revision === target.producer.revision;

  if (!compatible) {
    return { ...observation, state: "UNKNOWN", qualificationState: "UNKNOWN", current: false };
  }

  const usable = qualification.current && qualification.state === "PASS";
  return {
    ...observation,
    state: usable ? observation.state : observation.state === "FAIL" ? "FAIL" : "PARTIAL",
    qualificationState: qualification.state,
    current: qualification.current,
    populationId: qualification.populationId,
    locality: qualification.locality,
    provenance: qualification.provenance,
  };
}

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

export const PRODUCT_PROOF_TRACE_STAGES = [
  "ELICITATION_EVIDENCE",
  "FINDING_OR_ANSWER",
  "REQUIREMENT_OR_CONSTRAINT",
  "STORY_USE_CASE_OR_SCENARIO",
  "SEMANTIC_MODEL",
  "CAPABILITY_WORKFLOW_OR_DATA",
  "ACCEPTANCE_CRITERION",
  "PRODUCT_PROOF",
  "RUNTIME_EVIDENCE",
] as const;

export type ProductProofTraceStage = (typeof PRODUCT_PROOF_TRACE_STAGES)[number];

export interface ProductProofTraceArtifactRef {
  stage: ProductProofTraceStage;
  artifactId: string;
  revision: string;
  provenance: string;
  owner: ProductProofProducerRef;
}

export interface ProductProofTraceLink {
  kind: "LINK";
  from: ProductProofTraceArtifactRef;
  to: ProductProofTraceArtifactRef;
}

export interface ProductProofTraceGap {
  kind: "GAP";
  fromStage: ProductProofTraceStage;
  toStage: ProductProofTraceStage;
  reason: "MISSING" | "UNKNOWN" | "PARTIAL" | "INCONCLUSIVE" | "BLOCKED";
}

export type ProductProofTraceSegment = ProductProofTraceLink | ProductProofTraceGap;

export interface ProductProofTrace {
  traceId: string;
  segments: readonly ProductProofTraceSegment[];
}

export interface ProductProofTraceAssessment {
  continuous: boolean;
  gaps: readonly ProductProofTraceGap[];
}

/** Inspects continuity only; it never creates links or changes producer authority. */
export function assessProductProofTrace(trace: ProductProofTrace): ProductProofTraceAssessment {
  const gaps = trace.segments.filter((segment): segment is ProductProofTraceGap => segment.kind === "GAP");
  const linkedStages = new Set<ProductProofTraceStage>();
  for (const segment of trace.segments) {
    if (segment.kind === "LINK") {
      linkedStages.add(segment.from.stage);
      linkedStages.add(segment.to.stage);
    }
  }
  const implicitGaps: ProductProofTraceGap[] = [];
  for (let index = 0; index < PRODUCT_PROOF_TRACE_STAGES.length - 1; index += 1) {
    const fromStage = PRODUCT_PROOF_TRACE_STAGES[index]!;
    const toStage = PRODUCT_PROOF_TRACE_STAGES[index + 1]!;
    const represented = trace.segments.some((segment) =>
      segment.kind === "LINK"
        ? segment.from.stage === fromStage && segment.to.stage === toStage
        : segment.fromStage === fromStage && segment.toStage === toStage,
    );
    if (!represented && (linkedStages.has(fromStage) || linkedStages.has(toStage))) {
      implicitGaps.push({ kind: "GAP", fromStage, toStage, reason: "MISSING" });
    }
  }
  const allGaps = [...gaps, ...implicitGaps];
  return { continuous: allGaps.length === 0 && trace.segments.length === PRODUCT_PROOF_TRACE_STAGES.length - 1, gaps: allGaps };
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

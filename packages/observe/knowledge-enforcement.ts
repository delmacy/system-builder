export const OBSERVE_KNOWLEDGE_ENFORCEMENT_VERSION = "1.0.0" as const;

export type ObserveKnowledgeEnforcementEnvelope = Readonly<{
  enforcementRef: string;
  classificationDecisionRef: string;
  usePolicyRef: string;
  purposeId: string;
  outcome: "allow" | "deny" | "isolate";
  reasonIds: readonly string[];
  evidenceRefs: readonly string[];
}>;

export type ObserveKnowledgeEnforcementProjection = Readonly<{
  contractVersion: typeof OBSERVE_KNOWLEDGE_ENFORCEMENT_VERSION;
  enforcementRef: string;
  classificationDecisionRef: string;
  usePolicyRef: string;
  purposeId: string;
  outcome: ObserveKnowledgeEnforcementEnvelope["outcome"];
  reasonIds: readonly string[];
  evidenceRefs: readonly string[];
}>;

export type KnowledgeEnforcementEnvelopeNormalizer = (
  value: unknown,
) => ObserveKnowledgeEnforcementEnvelope;

export function projectKnowledgeEnforcementForObservation(
  value: unknown,
  normalizeEnvelope: KnowledgeEnforcementEnvelopeNormalizer,
): ObserveKnowledgeEnforcementProjection {
  const envelope = normalizeEnvelope(value);
  return Object.freeze({
    contractVersion: OBSERVE_KNOWLEDGE_ENFORCEMENT_VERSION,
    enforcementRef: envelope.enforcementRef,
    classificationDecisionRef: envelope.classificationDecisionRef,
    usePolicyRef: envelope.usePolicyRef,
    purposeId: envelope.purposeId,
    outcome: envelope.outcome,
    reasonIds: Object.freeze([...envelope.reasonIds]),
    evidenceRefs: Object.freeze([...envelope.evidenceRefs]),
  });
}

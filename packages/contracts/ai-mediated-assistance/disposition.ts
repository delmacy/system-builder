import type { AiMediatedCandidateLineage, AiMediatedCompleteness, AiMediatedCurrentness, AiMediatedProviderBinding, AiMediatedWorkspaceSnapshot } from "./index.js";

export type AiMediatedDispositionDecision = "ACCEPT" | "REJECT" | "REVISE";
export type AiMediatedDispositionEvaluation = "GOVERNED" | "RECONCILE_BEFORE_RETRY";

export interface AiMediatedCandidateDisposition {
  readonly candidate: AiMediatedCandidateLineage;
  readonly providerBindingRef: string;
  readonly providerBindingRevisionRef: string;
  readonly governingOwnerRef: string;
  readonly governingOwnerRevisionRef: string;
  readonly decision: AiMediatedDispositionDecision;
  readonly currentness: AiMediatedCurrentness;
  readonly completeness: AiMediatedCompleteness;
  readonly rationaleRef: string;
}

function nonEmpty(value: string, field: string): void {
  if (value.trim().length === 0) throw new Error(`AI_MEDIATED_DISPOSITION_INVALID:${field}`);
}

export function evaluateAiMediatedCandidateDisposition(
  snapshot: AiMediatedWorkspaceSnapshot,
  binding: AiMediatedProviderBinding,
  disposition: AiMediatedCandidateDisposition,
): AiMediatedDispositionEvaluation {
  nonEmpty(disposition.governingOwnerRef, "governingOwnerRef");
  nonEmpty(disposition.governingOwnerRevisionRef, "governingOwnerRevisionRef");
  nonEmpty(disposition.rationaleRef, "rationaleRef");
  if (disposition.candidate.candidateRef !== snapshot.candidateLineage.candidateRef || disposition.candidate.candidateRevisionRef !== snapshot.candidateLineage.candidateRevisionRef || disposition.candidate.provenanceHash !== snapshot.candidateLineage.provenanceHash) throw new Error("AI_MEDIATED_DISPOSITION_INVALID:candidate-lineage-mismatch");
  if (disposition.providerBindingRef !== binding.bindingRef || disposition.providerBindingRevisionRef !== binding.bindingRevisionRef) throw new Error("AI_MEDIATED_DISPOSITION_INVALID:provider-binding-mismatch");
  if (disposition.currentness === "UNKNOWN" || disposition.currentness === "INCONCLUSIVE" || disposition.completeness === "UNKNOWN" || disposition.completeness === "INCONCLUSIVE" || disposition.completeness === "CONFLICTED") return "RECONCILE_BEFORE_RETRY";
  return "GOVERNED";
}

export function aiMediatedDispositionEstablishesAuthority(disposition: AiMediatedCandidateDisposition): false {
  void disposition;
  return false;
}

export function aiMediatedDispositionEstablishesActionEligibility(disposition: AiMediatedCandidateDisposition): false {
  void disposition;
  return false;
}

export function aiMediatedManualPathRemainsAvailable(evaluation: AiMediatedDispositionEvaluation): true {
  void evaluation;
  return true;
}

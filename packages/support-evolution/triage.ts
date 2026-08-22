import { sha256Canonical } from "@system-builder/deterministic";

export type SupportTriageClassification = "Support" | "Maintenance" | "Evolution";

export type SupportTriageDecisionFields = Readonly<{
  intakeId: string;
  classification: SupportTriageClassification;
  decidedAt: string;
  decidedByRef: string;
  reasonRef: string;
  impactRef: string;
  criticalityRef: string;
  slaRef: string;
  priorityRef: string;
  contextRefs: readonly string[];
}>;

export type SupportTriageDecision = Readonly<{
  kind: "SupportTriageDecision";
  triageId: string;
  intakeId: string;
  classification: SupportTriageClassification;
  decidedAt: string;
  decidedByRef: string;
  reasonRef: string;
  impactRef: string;
  criticalityRef: string;
  slaRef: string;
  priorityRef: string;
  contextRefs: readonly string[];
}>;

function canonicalContextRefs(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

function buildPayload(fields: SupportTriageDecisionFields) {
  return Object.freeze({
    kind: "SupportTriageDecision" as const,
    intakeId: fields.intakeId,
    classification: fields.classification,
    decidedAt: fields.decidedAt,
    decidedByRef: fields.decidedByRef,
    reasonRef: fields.reasonRef,
    impactRef: fields.impactRef,
    criticalityRef: fields.criticalityRef,
    slaRef: fields.slaRef,
    priorityRef: fields.priorityRef,
    contextRefs: canonicalContextRefs(fields.contextRefs),
  });
}

export const SupportTriageDecision = Object.freeze({
  create(fields: SupportTriageDecisionFields): SupportTriageDecision {
    const payload = buildPayload(fields);
    return Object.freeze({ ...payload, triageId: sha256Canonical(payload) });
  },
});

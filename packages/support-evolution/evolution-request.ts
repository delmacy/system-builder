import { sha256Canonical } from "@system-builder/deterministic";
import { SupportTriageDecision } from "./triage.js";

export type EvolutionRequestEvidenceFields = Readonly<{
  intakeId: string;
  triageId: string;
  requestedAt: string;
  requestedByRef: string;
  changeEvidenceRef: string;
  reasonRef: string;
  contextRefs: readonly string[];
}>;

export type EvolutionRequestFromTriageFields = Omit<EvolutionRequestEvidenceFields, "intakeId" | "triageId">;

export type EvolutionRequestEvidence = Readonly<{
  kind: "EvolutionRequestEvidence";
  evolutionRequestId: string;
  intakeId: string;
  triageId: string;
  requestedAt: string;
  requestedByRef: string;
  changeEvidenceRef: string;
  reasonRef: string;
  contextRefs: readonly string[];
}>;

function invalid(detail: string): Error { return new Error(`EVOLUTION_REQUEST:${detail}`); }
function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`);
  return value;
}
function canonicalContextRefs(values: readonly string[]): readonly string[] {
  if (!Array.isArray(values) || values.length === 0) throw invalid("MALFORMED:contextRefs");
  return Object.freeze([...new Set(values.map((value) => requiredString(value, "contextRefs")))].sort());
}
function buildPayload(fields: EvolutionRequestEvidenceFields) {
  return Object.freeze({
    kind: "EvolutionRequestEvidence" as const,
    intakeId: requiredString(fields.intakeId, "intakeId"),
    triageId: requiredString(fields.triageId, "triageId"),
    requestedAt: requiredString(fields.requestedAt, "requestedAt"),
    requestedByRef: requiredString(fields.requestedByRef, "requestedByRef"),
    changeEvidenceRef: requiredString(fields.changeEvidenceRef, "changeEvidenceRef"),
    reasonRef: requiredString(fields.reasonRef, "reasonRef"),
    contextRefs: canonicalContextRefs(fields.contextRefs),
  });
}

export const EvolutionRequestEvidence = Object.freeze({
  create(fields: EvolutionRequestEvidenceFields): EvolutionRequestEvidence {
    const payload = buildPayload(fields);
    return Object.freeze({ ...payload, evolutionRequestId: sha256Canonical(payload) });
  },
  fromTriage(triageValue: unknown, fields: EvolutionRequestFromTriageFields): EvolutionRequestEvidence {
    const triage = SupportTriageDecision.validate(triageValue);
    if (triage.classification !== "Evolution") throw invalid(`CLASSIFICATION:${triage.classification}`);
    return EvolutionRequestEvidence.create({ ...fields, intakeId: triage.intakeId, triageId: triage.triageId });
  },
});

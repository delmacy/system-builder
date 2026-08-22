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

const ALLOWED_FIELDS = new Set([
  "kind", "evolutionRequestId", "intakeId", "triageId", "requestedAt", "requestedByRef", "changeEvidenceRef", "reasonRef", "contextRefs",
]);
function invalid(detail: string): Error { return new Error(`EVOLUTION_REQUEST:${detail}`); }
function isRecordLike(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
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
function fieldsFromRecord(value: Record<string, unknown>): EvolutionRequestEvidenceFields {
  const contextRefs = value["contextRefs"];
  if (!Array.isArray(contextRefs)) throw invalid("MALFORMED:contextRefs");
  return Object.freeze({
    intakeId: requiredString(value["intakeId"], "intakeId"),
    triageId: requiredString(value["triageId"], "triageId"),
    requestedAt: requiredString(value["requestedAt"], "requestedAt"),
    requestedByRef: requiredString(value["requestedByRef"], "requestedByRef"),
    changeEvidenceRef: requiredString(value["changeEvidenceRef"], "changeEvidenceRef"),
    reasonRef: requiredString(value["reasonRef"], "reasonRef"),
    contextRefs: canonicalContextRefs(contextRefs as readonly string[]),
  });
}

export const EvolutionRequestEvidence = Object.freeze({
  create(fields: EvolutionRequestEvidenceFields): EvolutionRequestEvidence {
    const payload = buildPayload(fields);
    return Object.freeze({ ...payload, evolutionRequestId: sha256Canonical(payload) });
  },
  validate(value: unknown, triageValue?: unknown): EvolutionRequestEvidence {
    if (!isRecordLike(value)) throw invalid("NOT_OBJECT");
    for (const key of Object.keys(value)) if (!ALLOWED_FIELDS.has(key)) throw invalid(`UNKNOWN_FIELD:${key}`);
    if (value["kind"] !== "EvolutionRequestEvidence") throw invalid("KIND");
    const normalized = EvolutionRequestEvidence.create(fieldsFromRecord(value));
    if (typeof value["evolutionRequestId"] !== "string" || value["evolutionRequestId"] !== normalized.evolutionRequestId) throw invalid("EVOLUTION_REQUEST_ID");
    if (triageValue !== undefined) {
      const triage = SupportTriageDecision.validate(triageValue);
      if (triage.classification !== "Evolution") throw invalid(`CLASSIFICATION:${triage.classification}`);
      if (triage.triageId !== normalized.triageId || triage.intakeId !== normalized.intakeId) throw invalid("TRIAGE_LINKAGE");
    }
    return normalized;
  },
  toJson(evidence: EvolutionRequestEvidence): string {
    return JSON.stringify(EvolutionRequestEvidence.validate(evidence));
  },
  fromJson(serialized: string): EvolutionRequestEvidence {
    let parsed: unknown;
    try { parsed = JSON.parse(serialized); } catch { throw invalid("JSON"); }
    return EvolutionRequestEvidence.validate(parsed);
  },
  fromTriage(triageValue: unknown, fields: EvolutionRequestFromTriageFields): EvolutionRequestEvidence {
    const triage = SupportTriageDecision.validate(triageValue);
    if (triage.classification !== "Evolution") throw invalid(`CLASSIFICATION:${triage.classification}`);
    return EvolutionRequestEvidence.create({ ...fields, intakeId: triage.intakeId, triageId: triage.triageId });
  },
});

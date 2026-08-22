import { sha256Canonical } from "@system-builder/deterministic";
import { SupportEvidenceIntake } from "./intake.js";

export type SupportTriageClassification = "Support" | "Maintenance" | "Evolution";
export type SupportTriageDecisionFields = Readonly<{
  intakeId: string; classification: SupportTriageClassification; decidedAt: string; decidedByRef: string; reasonRef: string;
  impactRef: string; criticalityRef: string; slaRef: string; priorityRef: string; contextRefs: readonly string[];
}>;
export type SupportTriageFromIntakeFields = Omit<SupportTriageDecisionFields, "intakeId">;
export type SupportTriageDecision = Readonly<{
  kind: "SupportTriageDecision"; triageId: string; intakeId: string; classification: SupportTriageClassification; decidedAt: string;
  decidedByRef: string; reasonRef: string; impactRef: string; criticalityRef: string; slaRef: string; priorityRef: string;
  contextRefs: readonly string[];
}>;

const CLASSIFICATIONS: readonly SupportTriageClassification[] = ["Support", "Maintenance", "Evolution"];
const ALLOWED_FIELDS = new Set(["kind", "triageId", "intakeId", "classification", "decidedAt", "decidedByRef", "reasonRef", "impactRef", "criticalityRef", "slaRef", "priorityRef", "contextRefs"]);
function invalid(detail: string): Error { return new Error(`SUPPORT_TRIAGE:${detail}`); }
function isRecordLike(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`);
  return value;
}
function requiredClassification(value: unknown): SupportTriageClassification {
  if (!CLASSIFICATIONS.includes(value as SupportTriageClassification)) throw invalid(`CLASSIFICATION:${String(value)}`);
  return value as SupportTriageClassification;
}
function canonicalContextRefs(values: readonly string[]): readonly string[] {
  if (!Array.isArray(values) || values.length === 0) throw invalid("MALFORMED:contextRefs");
  const normalized = values.map((value) => requiredString(value, "contextRefs"));
  return Object.freeze([...new Set(normalized)].sort());
}
function buildPayload(fields: SupportTriageDecisionFields) {
  return Object.freeze({
    kind: "SupportTriageDecision" as const, intakeId: requiredString(fields.intakeId, "intakeId"),
    classification: requiredClassification(fields.classification), decidedAt: requiredString(fields.decidedAt, "decidedAt"),
    decidedByRef: requiredString(fields.decidedByRef, "decidedByRef"), reasonRef: requiredString(fields.reasonRef, "reasonRef"),
    impactRef: requiredString(fields.impactRef, "impactRef"), criticalityRef: requiredString(fields.criticalityRef, "criticalityRef"),
    slaRef: requiredString(fields.slaRef, "slaRef"), priorityRef: requiredString(fields.priorityRef, "priorityRef"),
    contextRefs: canonicalContextRefs(fields.contextRefs),
  });
}
function fieldsFromRecord(value: Record<string, unknown>): SupportTriageDecisionFields {
  const contextRefs = value["contextRefs"];
  if (!Array.isArray(contextRefs)) throw invalid("MALFORMED:contextRefs");
  return Object.freeze({
    intakeId: requiredString(value["intakeId"], "intakeId"), classification: requiredClassification(value["classification"]),
    decidedAt: requiredString(value["decidedAt"], "decidedAt"), decidedByRef: requiredString(value["decidedByRef"], "decidedByRef"),
    reasonRef: requiredString(value["reasonRef"], "reasonRef"), impactRef: requiredString(value["impactRef"], "impactRef"),
    criticalityRef: requiredString(value["criticalityRef"], "criticalityRef"), slaRef: requiredString(value["slaRef"], "slaRef"),
    priorityRef: requiredString(value["priorityRef"], "priorityRef"), contextRefs: canonicalContextRefs(contextRefs as unknown as readonly string[]),
  });
}

export const SupportTriageDecision = Object.freeze({
  create(fields: SupportTriageDecisionFields): SupportTriageDecision {
    const payload = buildPayload(fields); return Object.freeze({ ...payload, triageId: sha256Canonical(payload) });
  },
  validate(value: unknown): SupportTriageDecision {
    if (!isRecordLike(value)) throw invalid("NOT_OBJECT");
    for (const key of Object.keys(value)) if (!ALLOWED_FIELDS.has(key)) throw invalid(`UNKNOWN_FIELD:${key}`);
    if (value["kind"] !== "SupportTriageDecision") throw invalid("KIND");
    const normalized = SupportTriageDecision.create(fieldsFromRecord(value));
    if (typeof value["triageId"] !== "string" || value["triageId"] !== normalized.triageId) throw invalid("TRIAGE_ID");
    return normalized;
  },
  toJson(decision: SupportTriageDecision): string { return JSON.stringify(SupportTriageDecision.validate(decision)); },
  fromJson(serialized: string): SupportTriageDecision {
    let parsed: unknown; try { parsed = JSON.parse(serialized); } catch { throw invalid("JSON"); }
    return SupportTriageDecision.validate(parsed);
  },
  fromIntake(intakeValue: unknown, fields: SupportTriageFromIntakeFields): SupportTriageDecision {
    const intake = SupportEvidenceIntake.validate(intakeValue);
    return SupportTriageDecision.create({ ...fields, intakeId: intake.intakeId });
  },
});

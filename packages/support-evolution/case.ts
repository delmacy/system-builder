import { sha256Canonical } from "@system-builder/deterministic";
import { SupportTriageDecision } from "./triage.js";

export type SupportCaseRecordFields = Readonly<{
  triageId: string;
  openedAt: string;
  openedByRef: string;
  reasonRef: string;
}>;
export type SupportCaseFromTriageFields = Omit<SupportCaseRecordFields, "triageId">;
export type SupportCaseRecord = Readonly<{
  kind: "SupportCaseRecord";
  caseId: string;
  triageId: string;
  openedAt: string;
  openedByRef: string;
  reasonRef: string;
}>;

const ALLOWED_FIELDS = new Set(["kind", "caseId", "triageId", "openedAt", "openedByRef", "reasonRef"]);
function invalid(detail: string): Error { return new Error(`SUPPORT_CASE:${detail}`); }
function isRecordLike(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`);
  return value;
}
function buildPayload(fields: SupportCaseRecordFields) {
  return Object.freeze({
    kind: "SupportCaseRecord" as const,
    triageId: requiredString(fields.triageId, "triageId"),
    openedAt: requiredString(fields.openedAt, "openedAt"),
    openedByRef: requiredString(fields.openedByRef, "openedByRef"),
    reasonRef: requiredString(fields.reasonRef, "reasonRef"),
  });
}
function fieldsFromRecord(value: Record<string, unknown>): SupportCaseRecordFields {
  return Object.freeze({
    triageId: requiredString(value["triageId"], "triageId"),
    openedAt: requiredString(value["openedAt"], "openedAt"),
    openedByRef: requiredString(value["openedByRef"], "openedByRef"),
    reasonRef: requiredString(value["reasonRef"], "reasonRef"),
  });
}

export const SupportCaseRecord = Object.freeze({
  create(fields: SupportCaseRecordFields): SupportCaseRecord {
    const payload = buildPayload(fields);
    return Object.freeze({ ...payload, caseId: sha256Canonical(payload) });
  },
  validate(value: unknown): SupportCaseRecord {
    if (!isRecordLike(value)) throw invalid("NOT_OBJECT");
    for (const key of Object.keys(value)) if (!ALLOWED_FIELDS.has(key)) throw invalid(`UNKNOWN_FIELD:${key}`);
    if (value["kind"] !== "SupportCaseRecord") throw invalid("KIND");
    const normalized = SupportCaseRecord.create(fieldsFromRecord(value));
    if (typeof value["caseId"] !== "string" || value["caseId"] !== normalized.caseId) throw invalid("CASE_ID");
    return normalized;
  },
  toJson(record: SupportCaseRecord): string { return JSON.stringify(SupportCaseRecord.validate(record)); },
  fromJson(serialized: string): SupportCaseRecord {
    let parsed: unknown;
    try { parsed = JSON.parse(serialized); } catch { throw invalid("JSON"); }
    return SupportCaseRecord.validate(parsed);
  },
  fromTriage(triageValue: unknown, fields: SupportCaseFromTriageFields): SupportCaseRecord {
    const triage = SupportTriageDecision.validate(triageValue);
    if (triage.classification !== "Support") throw invalid(`CLASSIFICATION:${triage.classification}`);
    return SupportCaseRecord.create({ ...fields, triageId: triage.triageId });
  },
});

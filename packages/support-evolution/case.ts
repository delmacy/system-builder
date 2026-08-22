import { sha256Canonical } from "@system-builder/deterministic";
import { SupportTriageDecision } from "./triage.js";

export type SupportCaseRecordFields = Readonly<{
  triageId: string;
  openedAt: string;
  openedByRef: string;
  reasonRef: string;
  knowledgeRefs?: readonly string[];
}>;
export type SupportCaseFromTriageFields = Omit<SupportCaseRecordFields, "triageId">;
export type SupportCaseRecord = Readonly<{
  kind: "SupportCaseRecord";
  caseId: string;
  triageId: string;
  openedAt: string;
  openedByRef: string;
  reasonRef: string;
  knowledgeRefs?: readonly string[];
}>;

const ALLOWED_FIELDS = new Set(["kind", "caseId", "triageId", "openedAt", "openedByRef", "reasonRef", "knowledgeRefs"]);
const RESOLVED_VALUE_MARKERS: readonly RegExp[] = [
  /-{5}BEGIN/i, /password\s*[:=]/i, /passwd\s*[:=]/i, /token\s*[:=]/i, /apikey\s*[:=]/i, /api_key\s*[:=]/i,
  /secret\s*[:=]/i, /client_secret\s*[:=]/i, /authorization\s*[:=]/i, /credential\s*[:=]/i,
  /bearer\s+[a-z0-9._-]+/i, /postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i,
];
function invalid(detail: string): Error { return new Error(`SUPPORT_CASE:${detail}`); }
function isRecordLike(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`);
  return value;
}
function referenceOnly(value: unknown, field: string): string {
  const ref = requiredString(value, field);
  if (RESOLVED_VALUE_MARKERS.some((marker) => marker.test(ref))) throw invalid(`RESOLVED_VALUE:${field}`);
  if (ref.length >= 20 && /^[A-Za-z0-9+/]+={1,2}$/.test(ref)) throw invalid(`RESOLVED_VALUE:${field}`);
  return ref;
}
function canonicalKnowledgeRefs(value: unknown): readonly string[] {
  if (!Array.isArray(value) || value.length === 0) throw invalid("MALFORMED:knowledgeRefs");
  return Object.freeze([...new Set(value.map((item) => referenceOnly(item, "knowledgeRefs")))].sort());
}
function buildPayload(fields: SupportCaseRecordFields) {
  const base = {
    kind: "SupportCaseRecord" as const,
    triageId: requiredString(fields.triageId, "triageId"),
    openedAt: requiredString(fields.openedAt, "openedAt"),
    openedByRef: requiredString(fields.openedByRef, "openedByRef"),
    reasonRef: requiredString(fields.reasonRef, "reasonRef"),
  };
  return Object.freeze(fields.knowledgeRefs === undefined ? base : { ...base, knowledgeRefs: canonicalKnowledgeRefs(fields.knowledgeRefs) });
}
function fieldsFromRecord(value: Record<string, unknown>): SupportCaseRecordFields {
  const base = {
    triageId: requiredString(value["triageId"], "triageId"),
    openedAt: requiredString(value["openedAt"], "openedAt"),
    openedByRef: requiredString(value["openedByRef"], "openedByRef"),
    reasonRef: requiredString(value["reasonRef"], "reasonRef"),
  };
  return Object.freeze(value["knowledgeRefs"] === undefined ? base : { ...base, knowledgeRefs: canonicalKnowledgeRefs(value["knowledgeRefs"]) });
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
  withKnowledgeLinks(recordValue: unknown, knowledgeRefs: readonly string[]): SupportCaseRecord {
    const record = SupportCaseRecord.validate(recordValue);
    return SupportCaseRecord.create({
      triageId: record.triageId,
      openedAt: record.openedAt,
      openedByRef: record.openedByRef,
      reasonRef: record.reasonRef,
      knowledgeRefs,
    });
  },
});

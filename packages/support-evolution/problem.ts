import { sha256Canonical } from "@system-builder/deterministic";
import { SupportTriageDecision } from "./triage.js";

export type ProblemRecordFields = Readonly<{ triageId: string; openedAt: string; openedByRef: string; contextRef: string }>;
export type ProblemFromTriageFields = Omit<ProblemRecordFields, "triageId">;
export type ProblemRecord = Readonly<{ kind: "ProblemRecord"; problemId: string; triageId: string; openedAt: string; openedByRef: string; contextRef: string }>;
const ALLOWED_FIELDS = new Set(["kind", "problemId", "triageId", "openedAt", "openedByRef", "contextRef"]);
function invalid(detail: string): Error { return new Error(`SUPPORT_PROBLEM:${detail}`); }
function isRecordLike(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function requiredString(value: unknown, field: string): string { if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`); return value; }
function buildPayload(fields: ProblemRecordFields) { return Object.freeze({ kind: "ProblemRecord" as const, triageId: requiredString(fields.triageId, "triageId"), openedAt: requiredString(fields.openedAt, "openedAt"), openedByRef: requiredString(fields.openedByRef, "openedByRef"), contextRef: requiredString(fields.contextRef, "contextRef") }); }
function fieldsFromRecord(value: Record<string, unknown>): ProblemRecordFields { return Object.freeze({ triageId: requiredString(value["triageId"], "triageId"), openedAt: requiredString(value["openedAt"], "openedAt"), openedByRef: requiredString(value["openedByRef"], "openedByRef"), contextRef: requiredString(value["contextRef"], "contextRef") }); }
export const ProblemRecord = Object.freeze({
  create(fields: ProblemRecordFields): ProblemRecord { const payload = buildPayload(fields); return Object.freeze({ ...payload, problemId: sha256Canonical(payload) }); },
  validate(value: unknown): ProblemRecord { if (!isRecordLike(value)) throw invalid("NOT_OBJECT"); for (const key of Object.keys(value)) if (!ALLOWED_FIELDS.has(key)) throw invalid(`UNKNOWN_FIELD:${key}`); if (value["kind"] !== "ProblemRecord") throw invalid("KIND"); const normalized = ProblemRecord.create(fieldsFromRecord(value)); if (typeof value["problemId"] !== "string" || value["problemId"] !== normalized.problemId) throw invalid("PROBLEM_ID"); return normalized; },
  toJson(record: ProblemRecord): string { return JSON.stringify(ProblemRecord.validate(record)); },
  fromJson(serialized: string): ProblemRecord { let parsed: unknown; try { parsed = JSON.parse(serialized); } catch { throw invalid("JSON"); } return ProblemRecord.validate(parsed); },
  fromTriage(triageValue: unknown, fields: ProblemFromTriageFields): ProblemRecord { const triage = SupportTriageDecision.validate(triageValue); if (triage.classification !== "Maintenance") throw invalid(`CLASSIFICATION:${triage.classification}`); return ProblemRecord.create({ ...fields, triageId: triage.triageId }); },
});

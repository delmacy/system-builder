import { sha256Canonical } from "@system-builder/deterministic";
import { SupportCaseRecord } from "./case.js";
import { ProblemRecord } from "./problem.js";

export type ResolutionCommonFields = Readonly<{ causeRef: string; resolutionRef: string; evidenceRefs: readonly string[]; resolvedAt: string; resolvedByRef: string }>;
export type SupportResolutionFields = Readonly<ResolutionCommonFields & { subjectKind: "SupportCaseRecord"; subjectId: string }>;
export type ProblemResolutionFields = Readonly<ResolutionCommonFields & { subjectKind: "ProblemRecord"; subjectId: string; correctionEvidenceId?: string }>;
export type ResolutionEvidenceFields = SupportResolutionFields | ProblemResolutionFields;
export type ResolutionEvidence = Readonly<ResolutionEvidenceFields & { kind: "ResolutionEvidence"; resolutionEvidenceId: string }>;

const ALLOWED_FIELDS = new Set(["kind","resolutionEvidenceId","subjectKind","subjectId","correctionEvidenceId","causeRef","resolutionRef","evidenceRefs","resolvedAt","resolvedByRef"]);
function invalid(detail: string): Error { return new Error(`RESOLUTION_EVIDENCE:${detail}`); }
function isRecordLike(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function requiredString(value: unknown, field: string): string { if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`); return value; }
function canonicalRefs(value: unknown): readonly string[] { if (!Array.isArray(value) || value.length === 0) throw invalid("MALFORMED:evidenceRefs"); return Object.freeze([...new Set(value.map((ref) => requiredString(ref, "evidenceRefs")))].sort()); }
function payload(fields: ResolutionEvidenceFields) {
  const common = { kind: "ResolutionEvidence" as const, subjectKind: fields.subjectKind, subjectId: requiredString(fields.subjectId, "subjectId"), causeRef: requiredString(fields.causeRef, "causeRef"), resolutionRef: requiredString(fields.resolutionRef, "resolutionRef"), evidenceRefs: canonicalRefs(fields.evidenceRefs), resolvedAt: requiredString(fields.resolvedAt, "resolvedAt"), resolvedByRef: requiredString(fields.resolvedByRef, "resolvedByRef") };
  if (fields.subjectKind === "SupportCaseRecord") return Object.freeze(common);
  return Object.freeze(fields.correctionEvidenceId === undefined ? common : { ...common, correctionEvidenceId: requiredString(fields.correctionEvidenceId, "correctionEvidenceId") });
}
function fieldsFromRecord(value: Record<string, unknown>): ResolutionEvidenceFields {
  const subjectKind = value["subjectKind"];
  const common = { subjectId: requiredString(value["subjectId"], "subjectId"), causeRef: requiredString(value["causeRef"], "causeRef"), resolutionRef: requiredString(value["resolutionRef"], "resolutionRef"), evidenceRefs: canonicalRefs(value["evidenceRefs"]), resolvedAt: requiredString(value["resolvedAt"], "resolvedAt"), resolvedByRef: requiredString(value["resolvedByRef"], "resolvedByRef") };
  if (subjectKind === "SupportCaseRecord") { if (value["correctionEvidenceId"] !== undefined) throw invalid("MIXED_SUBJECT"); return { ...common, subjectKind }; }
  if (subjectKind === "ProblemRecord") return value["correctionEvidenceId"] === undefined ? { ...common, subjectKind } : { ...common, subjectKind, correctionEvidenceId: requiredString(value["correctionEvidenceId"], "correctionEvidenceId") };
  throw invalid("SUBJECT_KIND");
}

export const ResolutionEvidence = Object.freeze({
  create(fields: ResolutionEvidenceFields): ResolutionEvidence { const body = payload(fields); return Object.freeze({ ...body, resolutionEvidenceId: sha256Canonical(body) }) as ResolutionEvidence; },
  validate(value: unknown): ResolutionEvidence { if (!isRecordLike(value)) throw invalid("NOT_OBJECT"); for (const key of Object.keys(value)) if (!ALLOWED_FIELDS.has(key)) throw invalid(`UNKNOWN_FIELD:${key}`); if (value["kind"] !== "ResolutionEvidence") throw invalid("KIND"); const normalized = ResolutionEvidence.create(fieldsFromRecord(value)); if (value["resolutionEvidenceId"] !== normalized.resolutionEvidenceId) throw invalid("RESOLUTION_EVIDENCE_ID"); return normalized; },
  toJson(value: ResolutionEvidence): string { return JSON.stringify(ResolutionEvidence.validate(value)); },
  fromJson(serialized: string): ResolutionEvidence { let parsed: unknown; try { parsed = JSON.parse(serialized); } catch { throw invalid("JSON"); } return ResolutionEvidence.validate(parsed); },
  fromCase(caseValue: unknown, fields: ResolutionCommonFields): ResolutionEvidence { const record = SupportCaseRecord.validate(caseValue); return ResolutionEvidence.create({ ...fields, subjectKind: "SupportCaseRecord", subjectId: record.caseId }); },
  fromProblem(problemValue: unknown, fields: ResolutionCommonFields & { correctionEvidenceId?: string }): ResolutionEvidence { const problem = ProblemRecord.validate(problemValue); return ResolutionEvidence.create({ ...fields, subjectKind: "ProblemRecord", subjectId: problem.problemId }); },
});

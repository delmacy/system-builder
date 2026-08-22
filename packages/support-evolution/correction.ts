import { sha256Canonical } from "@system-builder/deterministic";
import { ProblemRecord } from "./problem.js";

export type PermittedCorrectionEvidenceFields = Readonly<{ problemId: string; permissionRef: string; correctionRef: string; decidedAt: string; decidedByRef: string; evidenceRefs: readonly string[] }>;
export type PermittedCorrectionFromProblemFields = Omit<PermittedCorrectionEvidenceFields, "problemId">;
export type PermittedCorrectionEvidence = Readonly<{ kind: "PermittedCorrectionEvidence"; correctionEvidenceId: string; problemId: string; permissionRef: string; correctionRef: string; decidedAt: string; decidedByRef: string; evidenceRefs: readonly string[] }>;
function invalid(detail: string): Error { return new Error(`PERMITTED_CORRECTION:${detail}`); }
function requiredString(value: unknown, field: string): string { if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`); return value; }
function canonicalRefs(value: readonly string[]): readonly string[] { if (!Array.isArray(value) || value.length === 0) throw invalid("MALFORMED:evidenceRefs"); return Object.freeze([...new Set(value.map((ref) => requiredString(ref, "evidenceRefs")))].sort()); }
function payload(fields: PermittedCorrectionEvidenceFields) { return Object.freeze({ kind: "PermittedCorrectionEvidence" as const, problemId: requiredString(fields.problemId, "problemId"), permissionRef: requiredString(fields.permissionRef, "permissionRef"), correctionRef: requiredString(fields.correctionRef, "correctionRef"), decidedAt: requiredString(fields.decidedAt, "decidedAt"), decidedByRef: requiredString(fields.decidedByRef, "decidedByRef"), evidenceRefs: canonicalRefs(fields.evidenceRefs) }); }
export const PermittedCorrectionEvidence = Object.freeze({
  create(fields: PermittedCorrectionEvidenceFields): PermittedCorrectionEvidence { const body = payload(fields); return Object.freeze({ ...body, correctionEvidenceId: sha256Canonical(body) }); },
  fromProblem(problemValue: unknown, fields: PermittedCorrectionFromProblemFields): PermittedCorrectionEvidence { const problem = ProblemRecord.validate(problemValue); return PermittedCorrectionEvidence.create({ ...fields, problemId: problem.problemId }); },
});

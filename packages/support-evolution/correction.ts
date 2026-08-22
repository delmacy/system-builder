import { sha256Canonical } from "@system-builder/deterministic";
import { ProblemRecord } from "./problem.js";

export type PermittedCorrectionEvidenceFields = Readonly<{ problemId: string; permissionRef: string; correctionRef: string; decidedAt: string; decidedByRef: string; evidenceRefs: readonly string[] }>;
export type PermittedCorrectionFromProblemFields = Omit<PermittedCorrectionEvidenceFields, "problemId">;
export type PermittedCorrectionEvidence = Readonly<{ kind: "PermittedCorrectionEvidence"; correctionEvidenceId: string; problemId: string; permissionRef: string; correctionRef: string; decidedAt: string; decidedByRef: string; evidenceRefs: readonly string[] }>;
const RESOLVED_VALUE_MARKERS: readonly RegExp[] = [/-{5}BEGIN/i,/password\s*[:=]/i,/passwd\s*[:=]/i,/token\s*[:=]/i,/apikey\s*[:=]/i,/api_key\s*[:=]/i,/secret\s*[:=]/i,/client_secret\s*[:=]/i,/authorization\s*[:=]/i,/credential\s*[:=]/i,/bearer\s+[a-z0-9._-]+/i,/postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i];
function invalid(detail: string): Error { return new Error(`PERMITTED_CORRECTION:${detail}`); }
function requiredString(value: unknown, field: string): string { if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`); return value; }
function referenceOnly(value: unknown, field: string): string { const ref = requiredString(value, field); if (RESOLVED_VALUE_MARKERS.some((marker) => marker.test(ref)) || (ref.length >= 20 && /^[A-Za-z0-9+/]+={1,2}$/.test(ref))) throw invalid(`RESOLVED_VALUE:${field}`); return ref; }
function canonicalRefs(value: readonly string[]): readonly string[] { if (!Array.isArray(value) || value.length === 0) throw invalid("MALFORMED:evidenceRefs"); return Object.freeze([...new Set(value.map((ref) => referenceOnly(ref, "evidenceRefs")))].sort()); }
function payload(fields: PermittedCorrectionEvidenceFields) { return Object.freeze({ kind: "PermittedCorrectionEvidence" as const, problemId: referenceOnly(fields.problemId, "problemId"), permissionRef: referenceOnly(fields.permissionRef, "permissionRef"), correctionRef: referenceOnly(fields.correctionRef, "correctionRef"), decidedAt: requiredString(fields.decidedAt, "decidedAt"), decidedByRef: referenceOnly(fields.decidedByRef, "decidedByRef"), evidenceRefs: canonicalRefs(fields.evidenceRefs) }); }
export const PermittedCorrectionEvidence = Object.freeze({
  create(fields: PermittedCorrectionEvidenceFields): PermittedCorrectionEvidence { const body = payload(fields); return Object.freeze({ ...body, correctionEvidenceId: sha256Canonical(body) }); },
  fromProblem(problemValue: unknown, fields: PermittedCorrectionFromProblemFields): PermittedCorrectionEvidence { const problem = ProblemRecord.validate(problemValue); return PermittedCorrectionEvidence.create({ ...fields, problemId: problem.problemId }); },
});

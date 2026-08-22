import { sha256Canonical } from "@system-builder/deterministic";
import { SupportTriageDecision } from "./triage.js";

export type ProblemRecordFields = Readonly<{
  triageId: string;
  openedAt: string;
  openedByRef: string;
  contextRef: string;
}>;
export type ProblemFromTriageFields = Omit<ProblemRecordFields, "triageId">;
export type ProblemRecord = Readonly<{
  kind: "ProblemRecord";
  problemId: string;
  triageId: string;
  openedAt: string;
  openedByRef: string;
  contextRef: string;
}>;

function invalid(detail: string): Error { return new Error(`SUPPORT_PROBLEM:${detail}`); }
function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`);
  return value;
}
function buildPayload(fields: ProblemRecordFields) {
  return Object.freeze({
    kind: "ProblemRecord" as const,
    triageId: requiredString(fields.triageId, "triageId"),
    openedAt: requiredString(fields.openedAt, "openedAt"),
    openedByRef: requiredString(fields.openedByRef, "openedByRef"),
    contextRef: requiredString(fields.contextRef, "contextRef"),
  });
}

export const ProblemRecord = Object.freeze({
  create(fields: ProblemRecordFields): ProblemRecord {
    const payload = buildPayload(fields);
    return Object.freeze({ ...payload, problemId: sha256Canonical(payload) });
  },
  fromTriage(triageValue: unknown, fields: ProblemFromTriageFields): ProblemRecord {
    const triage = SupportTriageDecision.validate(triageValue);
    if (triage.classification !== "Maintenance") throw invalid(`CLASSIFICATION:${triage.classification}`);
    return ProblemRecord.create({ ...fields, triageId: triage.triageId });
  },
});

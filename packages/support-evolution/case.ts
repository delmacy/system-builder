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

function requiredString(value: string, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`SUPPORT_CASE:MALFORMED:${field}`);
  }
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

export const SupportCaseRecord = Object.freeze({
  create(fields: SupportCaseRecordFields): SupportCaseRecord {
    const payload = buildPayload(fields);
    return Object.freeze({ ...payload, caseId: sha256Canonical(payload) });
  },
  fromTriage(triageValue: unknown, fields: SupportCaseFromTriageFields): SupportCaseRecord {
    const triage = SupportTriageDecision.validate(triageValue);
    if (triage.classification !== "Support") {
      throw new Error(`SUPPORT_CASE:CLASSIFICATION:${triage.classification}`);
    }
    return SupportCaseRecord.create({ ...fields, triageId: triage.triageId });
  },
});

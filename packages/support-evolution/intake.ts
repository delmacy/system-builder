import { sha256Canonical } from "@system-builder/deterministic";

export type SupportEvidenceSourceKind = "observe_finding" | "human_request";
export type SupportHumanRequestKind = "request" | "incident" | "feedback";

export type SupportObserveFindingSource = Readonly<{
  sourceKind: "observe_finding";
  evidenceRef: string;
  findingCode: string;
  observationId: string;
  deploymentId: string;
  publishedReleaseRef: string;
  environmentRef: string;
  releaseHash: string;
  operationId?: string;
  runtimeRef?: string;
  processRef?: string;
  sessionRef?: string;
}>;

export type SupportHumanRequestSource = Readonly<{
  sourceKind: "human_request";
  evidenceRef: string;
  requestKind: SupportHumanRequestKind;
  actorRef: string;
  channelRef: string;
}>;

export type SupportEvidenceIntakeFields = Readonly<{
  sourceKind: SupportEvidenceSourceKind;
  evidenceRef: string;
  summary: string;
  submittedAt: string;
  findingCode?: string;
  observationId?: string;
  deploymentId?: string;
  publishedReleaseRef?: string;
  environmentRef?: string;
  releaseHash?: string;
  operationId?: string;
  runtimeRef?: string;
  processRef?: string;
  sessionRef?: string;
  requestKind?: SupportHumanRequestKind;
  actorRef?: string;
  channelRef?: string;
}>;

export type SupportEvidenceIntake = Readonly<{
  kind: "SupportEvidenceIntake";
  intakeId: string;
  sourceKind: SupportEvidenceSourceKind;
  evidenceRef: string;
  summary: string;
  submittedAt: string;
  findingCode?: string;
  observationId?: string;
  deploymentId?: string;
  publishedReleaseRef?: string;
  environmentRef?: string;
  releaseHash?: string;
  operationId?: string;
  runtimeRef?: string;
  processRef?: string;
  sessionRef?: string;
  requestKind?: SupportHumanRequestKind;
  actorRef?: string;
  channelRef?: string;
}>;

function invalid(detail: string): Error {
  return new Error(`SUPPORT_INTAKE:${detail}`);
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`);
  return value;
}

export const SupportEvidenceIntake = Object.freeze({
  create(fields: SupportEvidenceIntakeFields): SupportEvidenceIntake {
    if (fields.sourceKind !== "observe_finding" && fields.sourceKind !== "human_request") {
      throw invalid(`SOURCE_KIND:${String(fields.sourceKind)}`);
    }
    const payload = Object.freeze({
      kind: "SupportEvidenceIntake" as const,
      sourceKind: fields.sourceKind,
      evidenceRef: requiredString(fields.evidenceRef, "evidenceRef"),
      summary: requiredString(fields.summary, "summary"),
      submittedAt: requiredString(fields.submittedAt, "submittedAt"),
      ...(fields.findingCode !== undefined ? { findingCode: requiredString(fields.findingCode, "findingCode") } : {}),
      ...(fields.observationId !== undefined ? { observationId: requiredString(fields.observationId, "observationId") } : {}),
      ...(fields.deploymentId !== undefined ? { deploymentId: requiredString(fields.deploymentId, "deploymentId") } : {}),
      ...(fields.publishedReleaseRef !== undefined
        ? { publishedReleaseRef: requiredString(fields.publishedReleaseRef, "publishedReleaseRef") }
        : {}),
      ...(fields.environmentRef !== undefined
        ? { environmentRef: requiredString(fields.environmentRef, "environmentRef") }
        : {}),
      ...(fields.releaseHash !== undefined ? { releaseHash: requiredString(fields.releaseHash, "releaseHash") } : {}),
      ...(fields.operationId !== undefined ? { operationId: requiredString(fields.operationId, "operationId") } : {}),
      ...(fields.runtimeRef !== undefined ? { runtimeRef: requiredString(fields.runtimeRef, "runtimeRef") } : {}),
      ...(fields.processRef !== undefined ? { processRef: requiredString(fields.processRef, "processRef") } : {}),
      ...(fields.sessionRef !== undefined ? { sessionRef: requiredString(fields.sessionRef, "sessionRef") } : {}),
      ...(fields.requestKind !== undefined ? { requestKind: fields.requestKind } : {}),
      ...(fields.actorRef !== undefined ? { actorRef: requiredString(fields.actorRef, "actorRef") } : {}),
      ...(fields.channelRef !== undefined ? { channelRef: requiredString(fields.channelRef, "channelRef") } : {}),
    });
    return Object.freeze({ ...payload, intakeId: sha256Canonical(payload) });
  },
});

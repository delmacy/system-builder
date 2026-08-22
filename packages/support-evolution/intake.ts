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
export type DeploymentFindingLike = Readonly<{
  kind: "DeploymentFinding";
  findingId: string;
  code: string;
  message: string;
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

const HUMAN_REQUEST_KINDS: readonly SupportHumanRequestKind[] = ["request", "incident", "feedback"];
const ALLOWED_FIELDS = new Set([
  "kind", "intakeId", "sourceKind", "evidenceRef", "summary", "submittedAt", "findingCode", "observationId",
  "deploymentId", "publishedReleaseRef", "environmentRef", "releaseHash", "operationId", "runtimeRef", "processRef",
  "sessionRef", "requestKind", "actorRef", "channelRef",
]);
function invalid(detail: string): Error { return new Error(`SUPPORT_INTAKE:${detail}`); }
function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`);
  return value;
}
function isRecordLike(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function optionalString(record: Record<string, unknown>, field: string): string | undefined {
  const value = record[field];
  return value === undefined ? undefined : requiredString(value, field);
}
function assertSourceProvenance(fields: SupportEvidenceIntakeFields): void {
  const humanPresent = fields.requestKind !== undefined || fields.actorRef !== undefined || fields.channelRef !== undefined;
  const findingPresent = fields.findingCode !== undefined || fields.observationId !== undefined;
  if (fields.sourceKind === "observe_finding") {
    if (humanPresent) throw invalid("SOURCE_CONFLICT:observe_finding");
    if (findingPresent && (fields.findingCode === undefined || fields.observationId === undefined)) throw invalid("SOURCE_PROVENANCE:observe_finding");
    return;
  }
  if (findingPresent || fields.operationId !== undefined || fields.processRef !== undefined || fields.sessionRef !== undefined) {
    throw invalid("SOURCE_CONFLICT:human_request");
  }
  if (humanPresent && (fields.requestKind === undefined || fields.actorRef === undefined || fields.channelRef === undefined)) {
    throw invalid("SOURCE_PROVENANCE:human_request");
  }
  if (fields.requestKind !== undefined && !HUMAN_REQUEST_KINDS.includes(fields.requestKind)) throw invalid(`REQUEST_KIND:${String(fields.requestKind)}`);
}
function buildPayload(fields: SupportEvidenceIntakeFields) {
  if (fields.sourceKind !== "observe_finding" && fields.sourceKind !== "human_request") throw invalid(`SOURCE_KIND:${String(fields.sourceKind)}`);
  assertSourceProvenance(fields);
  return Object.freeze({
    kind: "SupportEvidenceIntake" as const,
    sourceKind: fields.sourceKind,
    evidenceRef: requiredString(fields.evidenceRef, "evidenceRef"),
    summary: requiredString(fields.summary, "summary"),
    submittedAt: requiredString(fields.submittedAt, "submittedAt"),
    ...(fields.findingCode !== undefined ? { findingCode: requiredString(fields.findingCode, "findingCode") } : {}),
    ...(fields.observationId !== undefined ? { observationId: requiredString(fields.observationId, "observationId") } : {}),
    ...(fields.deploymentId !== undefined ? { deploymentId: requiredString(fields.deploymentId, "deploymentId") } : {}),
    ...(fields.publishedReleaseRef !== undefined ? { publishedReleaseRef: requiredString(fields.publishedReleaseRef, "publishedReleaseRef") } : {}),
    ...(fields.environmentRef !== undefined ? { environmentRef: requiredString(fields.environmentRef, "environmentRef") } : {}),
    ...(fields.releaseHash !== undefined ? { releaseHash: requiredString(fields.releaseHash, "releaseHash") } : {}),
    ...(fields.operationId !== undefined ? { operationId: requiredString(fields.operationId, "operationId") } : {}),
    ...(fields.runtimeRef !== undefined ? { runtimeRef: requiredString(fields.runtimeRef, "runtimeRef") } : {}),
    ...(fields.processRef !== undefined ? { processRef: requiredString(fields.processRef, "processRef") } : {}),
    ...(fields.sessionRef !== undefined ? { sessionRef: requiredString(fields.sessionRef, "sessionRef") } : {}),
    ...(fields.requestKind !== undefined ? { requestKind: fields.requestKind } : {}),
    ...(fields.actorRef !== undefined ? { actorRef: requiredString(fields.actorRef, "actorRef") } : {}),
    ...(fields.channelRef !== undefined ? { channelRef: requiredString(fields.channelRef, "channelRef") } : {}),
  });
}
function fieldsFromRecord(value: Record<string, unknown>): SupportEvidenceIntakeFields {
  const sourceKind = value["sourceKind"];
  if (sourceKind !== "observe_finding" && sourceKind !== "human_request") throw invalid(`SOURCE_KIND:${String(sourceKind)}`);
  const requestKindRaw = value["requestKind"];
  if (requestKindRaw !== undefined && !HUMAN_REQUEST_KINDS.includes(requestKindRaw as SupportHumanRequestKind)) {
    throw invalid(`REQUEST_KIND:${String(requestKindRaw)}`);
  }
  return Object.freeze({
    sourceKind,
    evidenceRef: requiredString(value["evidenceRef"], "evidenceRef"),
    summary: requiredString(value["summary"], "summary"),
    submittedAt: requiredString(value["submittedAt"], "submittedAt"),
    ...(optionalString(value, "findingCode") !== undefined ? { findingCode: optionalString(value, "findingCode")! } : {}),
    ...(optionalString(value, "observationId") !== undefined ? { observationId: optionalString(value, "observationId")! } : {}),
    ...(optionalString(value, "deploymentId") !== undefined ? { deploymentId: optionalString(value, "deploymentId")! } : {}),
    ...(optionalString(value, "publishedReleaseRef") !== undefined ? { publishedReleaseRef: optionalString(value, "publishedReleaseRef")! } : {}),
    ...(optionalString(value, "environmentRef") !== undefined ? { environmentRef: optionalString(value, "environmentRef")! } : {}),
    ...(optionalString(value, "releaseHash") !== undefined ? { releaseHash: optionalString(value, "releaseHash")! } : {}),
    ...(optionalString(value, "operationId") !== undefined ? { operationId: optionalString(value, "operationId")! } : {}),
    ...(optionalString(value, "runtimeRef") !== undefined ? { runtimeRef: optionalString(value, "runtimeRef")! } : {}),
    ...(optionalString(value, "processRef") !== undefined ? { processRef: optionalString(value, "processRef")! } : {}),
    ...(optionalString(value, "sessionRef") !== undefined ? { sessionRef: optionalString(value, "sessionRef")! } : {}),
    ...(requestKindRaw !== undefined ? { requestKind: requestKindRaw as SupportHumanRequestKind } : {}),
    ...(optionalString(value, "actorRef") !== undefined ? { actorRef: optionalString(value, "actorRef")! } : {}),
    ...(optionalString(value, "channelRef") !== undefined ? { channelRef: optionalString(value, "channelRef")! } : {}),
  });
}

export const SupportEvidenceIntake = Object.freeze({
  create(fields: SupportEvidenceIntakeFields): SupportEvidenceIntake {
    const payload = buildPayload(fields);
    return Object.freeze({ ...payload, intakeId: sha256Canonical(payload) });
  },
  validate(value: unknown): SupportEvidenceIntake {
    if (!isRecordLike(value)) throw invalid("NOT_OBJECT");
    for (const key of Object.keys(value)) if (!ALLOWED_FIELDS.has(key)) throw invalid(`UNKNOWN_FIELD:${key}`);
    if (value["kind"] !== "SupportEvidenceIntake") throw invalid("KIND");
    const normalized = SupportEvidenceIntake.create(fieldsFromRecord(value));
    if (typeof value["intakeId"] !== "string" || value["intakeId"] !== normalized.intakeId) throw invalid("INTAKE_ID");
    return normalized;
  },
  toJson(intake: SupportEvidenceIntake): string {
    return JSON.stringify(SupportEvidenceIntake.validate(intake));
  },
  fromJson(serialized: string): SupportEvidenceIntake {
    let parsed: unknown;
    try { parsed = JSON.parse(serialized); } catch { throw invalid("JSON"); }
    return SupportEvidenceIntake.validate(parsed);
  },
  fromDeploymentFinding(value: unknown, submittedAt: string): SupportEvidenceIntake {
    if (!isRecordLike(value)) throw invalid("FINDING:NOT_OBJECT");
    if (value["kind"] !== "DeploymentFinding") throw invalid("FINDING:KIND");
    return SupportEvidenceIntake.create({
      sourceKind: "observe_finding",
      evidenceRef: requiredString(value["findingId"], "findingId"),
      summary: requiredString(value["message"], "message"),
      submittedAt: requiredString(submittedAt, "submittedAt"),
      findingCode: requiredString(value["code"], "code"),
      observationId: requiredString(value["observationId"], "observationId"),
      deploymentId: requiredString(value["deploymentId"], "deploymentId"),
      publishedReleaseRef: requiredString(value["publishedReleaseRef"], "publishedReleaseRef"),
      environmentRef: requiredString(value["environmentRef"], "environmentRef"),
      releaseHash: requiredString(value["releaseHash"], "releaseHash"),
      ...(optionalString(value, "operationId") !== undefined ? { operationId: optionalString(value, "operationId")! } : {}),
      ...(optionalString(value, "runtimeRef") !== undefined ? { runtimeRef: optionalString(value, "runtimeRef")! } : {}),
      ...(optionalString(value, "processRef") !== undefined ? { processRef: optionalString(value, "processRef")! } : {}),
      ...(optionalString(value, "sessionRef") !== undefined ? { sessionRef: optionalString(value, "sessionRef")! } : {}),
    });
  },
});

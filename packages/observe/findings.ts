import { sha256Canonical } from "@system-builder/deterministic";

export type DeploymentFindingSeverity = "info" | "warning" | "critical";

export type DeploymentFindingConfidence = "low" | "medium" | "high";

export type DeploymentFinding = Readonly<{
  kind: "DeploymentFinding";
  findingId: string;
  severity: DeploymentFindingSeverity;
  confidence: DeploymentFindingConfidence;
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

export type DeploymentFindingFields = Readonly<{
  severity: DeploymentFindingSeverity;
  confidence: DeploymentFindingConfidence;
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

const SEVERITIES: readonly DeploymentFindingSeverity[] = ["info", "warning", "critical"];
const CONFIDENCES: readonly DeploymentFindingConfidence[] = ["low", "medium", "high"];

function invalid(detail: string): Error {
  return new Error(`OBSERVE_INVALID_FINDING:${detail}`);
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`);
  return value;
}

type DeploymentFindingPayload = Readonly<{
  kind: "DeploymentFinding";
  severity: DeploymentFindingSeverity;
  confidence: DeploymentFindingConfidence;
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

function withFindingId(payload: DeploymentFindingPayload): DeploymentFinding {
  return Object.freeze({ ...payload, findingId: sha256Canonical(payload) });
}

export const DeploymentFinding = Object.freeze({
  create(fields: DeploymentFindingFields): DeploymentFinding {
    if (!SEVERITIES.includes(fields.severity)) throw invalid(`UNSUPPORTED_SEVERITY:${String(fields.severity)}`);
    if (!CONFIDENCES.includes(fields.confidence)) throw invalid(`UNSUPPORTED_CONFIDENCE:${String(fields.confidence)}`);

    const payload = Object.freeze({
      kind: "DeploymentFinding" as const,
      severity: fields.severity,
      confidence: fields.confidence,
      code: requiredString(fields.code, "code"),
      message: requiredString(fields.message, "message"),
      observationId: requiredString(fields.observationId, "observationId"),
      deploymentId: requiredString(fields.deploymentId, "deploymentId"),
      publishedReleaseRef: requiredString(fields.publishedReleaseRef, "publishedReleaseRef"),
      environmentRef: requiredString(fields.environmentRef, "environmentRef"),
      releaseHash: requiredString(fields.releaseHash, "releaseHash"),
      ...(fields.operationId !== undefined ? { operationId: requiredString(fields.operationId, "operationId") } : {}),
      ...(fields.runtimeRef !== undefined ? { runtimeRef: requiredString(fields.runtimeRef, "runtimeRef") } : {}),
      ...(fields.processRef !== undefined ? { processRef: requiredString(fields.processRef, "processRef") } : {}),
      ...(fields.sessionRef !== undefined ? { sessionRef: requiredString(fields.sessionRef, "sessionRef") } : {}),
    });
    return withFindingId(payload);
  },
});
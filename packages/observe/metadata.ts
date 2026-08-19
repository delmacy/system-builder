import { sha256Canonical } from "@system-builder/deterministic";

export type DeploymentOperationSource = "manual" | "automation" | "pipeline" | "api";

export type DeploymentOperationMode = "dry-run" | "execute";

export type DeploymentOperationMetadata = Readonly<{
  kind: "DeploymentOperationMetadata";
  operationId: string;
  executorRef: string;
  source: DeploymentOperationSource;
  mode: DeploymentOperationMode;
  sourceRef?: string;
  triggeredAt?: string;
  runtimeRef?: string;
  processRef?: string;
  sessionRef?: string;
}>;

export type DeploymentOperationMetadataFields = Readonly<{
  executorRef: string;
  source: DeploymentOperationSource;
  mode: DeploymentOperationMode;
  sourceRef?: string;
  triggeredAt?: string;
  runtimeRef?: string;
  processRef?: string;
  sessionRef?: string;
}>;

const SOURCES: readonly DeploymentOperationSource[] = ["manual", "automation", "pipeline", "api"];
const MODES: readonly DeploymentOperationMode[] = ["dry-run", "execute"];

function invalid(detail: string): Error {
  return new Error(`OBSERVE_INVALID_OPERATION_METADATA:${detail}`);
}

type DeploymentOperationCorrelation = Readonly<{
  kind: "DeploymentOperationMetadata";
  executorRef: string;
  source: DeploymentOperationSource;
  mode: DeploymentOperationMode;
  sourceRef?: string;
  triggeredAt?: string;
  runtimeRef?: string;
  processRef?: string;
  sessionRef?: string;
}>;

function withOperationId(payload: DeploymentOperationCorrelation): DeploymentOperationMetadata {
  return Object.freeze({ ...payload, operationId: sha256Canonical(payload) });
}

export const DeploymentOperationMetadata = Object.freeze({
  create(fields: DeploymentOperationMetadataFields): DeploymentOperationMetadata {
    if (typeof fields.executorRef !== "string" || fields.executorRef.trim().length === 0) {
      throw invalid("MALFORMED:executorRef");
    }
    if (!SOURCES.includes(fields.source)) throw invalid(`UNSUPPORTED_SOURCE:${String(fields.source)}`);
    if (!MODES.includes(fields.mode)) throw invalid(`UNSUPPORTED_MODE:${String(fields.mode)}`);

    const payload: DeploymentOperationCorrelation = Object.freeze({
      kind: "DeploymentOperationMetadata",
      executorRef: fields.executorRef,
      source: fields.source,
      mode: fields.mode,
      ...(fields.sourceRef !== undefined ? { sourceRef: fields.sourceRef } : {}),
      ...(fields.triggeredAt !== undefined ? { triggeredAt: fields.triggeredAt } : {}),
      ...(fields.runtimeRef !== undefined ? { runtimeRef: fields.runtimeRef } : {}),
      ...(fields.processRef !== undefined ? { processRef: fields.processRef } : {}),
      ...(fields.sessionRef !== undefined ? { sessionRef: fields.sessionRef } : {}),
    });
    return withOperationId(payload);
  },
});
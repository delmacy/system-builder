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
  deploymentId?: string;
  publishedReleaseRef?: string;
  environmentRef?: string;
  releaseHash?: string;
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

export type DeploymentExecutionContext = Readonly<{
  executorRef: string;
  source: DeploymentOperationSource;
  mode: DeploymentOperationMode;
  sourceRef?: string;
  triggeredAt?: string;
  runtimeRef?: string;
  processRef?: string;
  sessionRef?: string;
  deploymentId: string;
  publishedReleaseRef: string;
  environmentRef: string;
  releaseHash: string;
}>;

const SOURCES: readonly DeploymentOperationSource[] = ["manual", "automation", "pipeline", "api"];
const MODES: readonly DeploymentOperationMode[] = ["dry-run", "execute"];
const RESOLVED_VALUE_MARKERS: readonly RegExp[] = [
  /-{5}BEGIN/i,
  /password\s*[:=]/i,
  /passwd\s*[:=]/i,
  /token\s*[:=]/i,
  /apikey\s*[:=]/i,
  /api_key\s*[:=]/i,
  /secret\s*[:=]/i,
  /client_secret\s*[:=]/i,
  /authorization\s*[:=]/i,
  /credential\s*[:=]/i,
  /bearer\s+[a-z0-9_-]+/i,
];

function invalid(detail: string): Error {
  return new Error(`OBSERVE_INVALID_OPERATION_METADATA:${detail}`);
}

function isReferenceOnly(value: string): boolean {
  if (RESOLVED_VALUE_MARKERS.some((marker) => marker.test(value))) return false;
  if (value.length >= 20 && /^[A-Za-z0-9+/]+={0,2}$/.test(value) && value.includes("=")) return false;
  return true;
}

function assertReferenceOnly(value: string, field: string): void {
  if (!isReferenceOnly(value)) throw invalid(`RESOLVED_VALUE:${field}`);
}

function assertReferenceField(fieldName: string, value: string): string {
  if (value.trim().length === 0) throw invalid(`MALFORMED:${fieldName}`);
  assertReferenceOnly(value, fieldName);
  return value;
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
  fromExecutionContext(context: DeploymentExecutionContext): DeploymentOperationMetadata {
    const executorRef = assertReferenceField("executorRef", context.executorRef);
    if (!SOURCES.includes(context.source)) throw invalid(`UNSUPPORTED_SOURCE:${String(context.source)}`);
    if (!MODES.includes(context.mode)) throw invalid(`UNSUPPORTED_MODE:${String(context.mode)}`);

    const correlated = Object.freeze({
      deploymentId: assertReferenceField("deploymentId", context.deploymentId),
      publishedReleaseRef: assertReferenceField("publishedReleaseRef", context.publishedReleaseRef),
      environmentRef: assertReferenceField("environmentRef", context.environmentRef),
      releaseHash: assertReferenceField("releaseHash", context.releaseHash),
    });

    const optional = Object.freeze({
      ...(context.sourceRef !== undefined ? { sourceRef: assertReferenceField("sourceRef", context.sourceRef) } : {}),
      ...(context.triggeredAt !== undefined ? { triggeredAt: assertReferenceField("triggeredAt", context.triggeredAt) } : {}),
      ...(context.runtimeRef !== undefined ? { runtimeRef: assertReferenceField("runtimeRef", context.runtimeRef) } : {}),
      ...(context.processRef !== undefined ? { processRef: assertReferenceField("processRef", context.processRef) } : {}),
      ...(context.sessionRef !== undefined ? { sessionRef: assertReferenceField("sessionRef", context.sessionRef) } : {}),
    });

    const operation = Object.freeze({
      kind: "DeploymentOperationMetadata",
      executorRef,
      source: context.source,
      mode: context.mode,
      ...optional,
    });

    const operationId = sha256Canonical(Object.freeze({ ...operation, ...correlated }));
    return Object.freeze({ ...operation, ...correlated, operationId });
  },
  validate(value: unknown): DeploymentOperationMetadata {
    if (value === null || typeof value !== "object" || Array.isArray(value)) throw invalid("NOT_OBJECT");
    const record = value as Record<string, unknown>;

    const allowed = new Set([
      "kind",
      "operationId",
      "executorRef",
      "source",
      "mode",
      "sourceRef",
      "triggeredAt",
      "runtimeRef",
      "processRef",
      "sessionRef",
      "deploymentId",
      "publishedReleaseRef",
      "environmentRef",
      "releaseHash",
    ]);
    for (const key of Object.keys(record)) {
      if (!allowed.has(key)) throw invalid(`UNKNOWN_FIELD:${key}`);
    }
    if (record["kind"] !== "DeploymentOperationMetadata") throw invalid("KIND");

    const executorRef = assertReferenceField("executorRef", String(record["executorRef"]));
    if (!SOURCES.includes(record["source"] as DeploymentOperationSource)) {
      throw invalid(`UNSUPPORTED_SOURCE:${String(record["source"])}`);
    }
    if (!MODES.includes(record["mode"] as DeploymentOperationMode)) {
      throw invalid(`UNSUPPORTED_MODE:${String(record["mode"])}`);
    }

    const operation: DeploymentOperationCorrelation = Object.freeze({
      kind: "DeploymentOperationMetadata",
      executorRef,
      source: record["source"] as DeploymentOperationSource,
      mode: record["mode"] as DeploymentOperationMode,
      ...(record["sourceRef"] !== undefined ? { sourceRef: assertReferenceField("sourceRef", String(record["sourceRef"])) } : {}),
      ...(record["triggeredAt"] !== undefined ? { triggeredAt: assertReferenceField("triggeredAt", String(record["triggeredAt"])) } : {}),
      ...(record["runtimeRef"] !== undefined ? { runtimeRef: assertReferenceField("runtimeRef", String(record["runtimeRef"])) } : {}),
      ...(record["processRef"] !== undefined ? { processRef: assertReferenceField("processRef", String(record["processRef"])) } : {}),
      ...(record["sessionRef"] !== undefined ? { sessionRef: assertReferenceField("sessionRef", String(record["sessionRef"])) } : {}),
    });

    const hasCorrelation = record["deploymentId"] !== undefined
      || record["publishedReleaseRef"] !== undefined
      || record["environmentRef"] !== undefined
      || record["releaseHash"] !== undefined;
    const correlated = hasCorrelation
      ? Object.freeze({
          deploymentId: assertReferenceField("deploymentId", String(record["deploymentId"])),
          publishedReleaseRef: assertReferenceField("publishedReleaseRef", String(record["publishedReleaseRef"])),
          environmentRef: assertReferenceField("environmentRef", String(record["environmentRef"])),
          releaseHash: assertReferenceField("releaseHash", String(record["releaseHash"])),
        })
      : Object.freeze({});

    const expected = sha256Canonical(Object.freeze({ ...operation, ...correlated }));
    if (typeof record["operationId"] !== "string" || record["operationId"] !== expected) {
      throw invalid("OPERATION_ID");
    }
    return Object.freeze({ ...operation, ...correlated, operationId: expected });
  },
});
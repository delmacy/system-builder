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
  validate(value: unknown): DeploymentFinding {
    if (!isRecordLike(value)) throw invalid("NOT_OBJECT");
    const record = value as Record<string, unknown>;

    const allowed = new Set([
      "kind",
      "findingId",
      "severity",
      "confidence",
      "code",
      "message",
      "observationId",
      "deploymentId",
      "publishedReleaseRef",
      "environmentRef",
      "releaseHash",
      "operationId",
      "runtimeRef",
      "processRef",
      "sessionRef",
    ]);
    for (const key of Object.keys(record)) {
      if (!allowed.has(key)) throw invalid(`UNKNOWN_FIELD:${key}`);
    }
    if (record["kind"] !== "DeploymentFinding") throw invalid("KIND");

    if (!SEVERITIES.includes(record["severity"] as DeploymentFindingSeverity)) {
      throw invalid(`UNSUPPORTED_SEVERITY:${String(record["severity"])}`);
    }
    if (!CONFIDENCES.includes(record["confidence"] as DeploymentFindingConfidence)) {
      throw invalid(`UNSUPPORTED_CONFIDENCE:${String(record["confidence"])}`);
    }

    const correlationFields = ["observationId", "deploymentId", "publishedReleaseRef", "environmentRef", "releaseHash"] as const;
    const present = correlationFields.filter((field) => record[field] !== undefined);
    if (present.length === 0) throw invalid("MISSING_CORRELATION");
    if (present.length < correlationFields.length) throw invalid("CONFLICTING_CORRELATION");

    const correlation = Object.freeze({
      observationId: assertReferenceOnly(requiredString(record["observationId"], "observationId"), "observationId"),
      deploymentId: assertReferenceOnly(requiredString(record["deploymentId"], "deploymentId"), "deploymentId"),
      publishedReleaseRef: assertReferenceOnly(
        requiredString(record["publishedReleaseRef"], "publishedReleaseRef"),
        "publishedReleaseRef",
      ),
      environmentRef: assertReferenceOnly(requiredString(record["environmentRef"], "environmentRef"), "environmentRef"),
      releaseHash: assertReferenceOnly(requiredString(record["releaseHash"], "releaseHash"), "releaseHash"),
    });

    const optional = Object.freeze({
      ...(record["operationId"] !== undefined
        ? { operationId: assertReferenceOnly(requiredString(record["operationId"], "operationId"), "operationId") }
        : {}),
      ...(record["runtimeRef"] !== undefined
        ? { runtimeRef: assertReferenceOnly(requiredString(record["runtimeRef"], "runtimeRef"), "runtimeRef") }
        : {}),
      ...(record["processRef"] !== undefined
        ? { processRef: assertReferenceOnly(requiredString(record["processRef"], "processRef"), "processRef") }
        : {}),
      ...(record["sessionRef"] !== undefined
        ? { sessionRef: assertReferenceOnly(requiredString(record["sessionRef"], "sessionRef"), "sessionRef") }
        : {}),
    });

    const payload: DeploymentFindingPayload = Object.freeze({
      kind: "DeploymentFinding",
      severity: record["severity"] as DeploymentFindingSeverity,
      confidence: record["confidence"] as DeploymentFindingConfidence,
      code: assertReferenceOnly(requiredString(record["code"], "code"), "code"),
      message: assertReferenceOnly(requiredString(record["message"], "message"), "message"),
      ...correlation,
      ...optional,
    });

    const expected = sha256Canonical(payload);
    if (typeof record["findingId"] !== "string" || record["findingId"] !== expected) {
      throw invalid("FINDING_ID");
    }
    return Object.freeze({ ...payload, findingId: expected });
  },
  toJson(finding: DeploymentFinding): string {
    return JSON.stringify(finding);
  },
  fromJson(serialized: string): DeploymentFinding {
    let parsed: unknown;
    try {
      parsed = JSON.parse(serialized);
    } catch {
      throw invalid("JSON");
    }
    return DeploymentFinding.validate(parsed);
  },
});

export type DeploymentFindingSource = Readonly<{
  kind: "DeploymentObservation" | "EnrichedDeploymentObservation";
  observationId: string;
  deploymentId: string;
  publishedReleaseRef: string;
  environmentRef: string;
  releaseHash: string;
  status: "succeeded" | "failed";
  healthChecks: readonly Readonly<{ name: string; status: "PASS" | "FAIL" }>[];
  operation?: Readonly<{
    operationId?: string;
    runtimeRef?: string;
    processRef?: string;
    sessionRef?: string;
  }>;
}>;

export type DeploymentFindingsBaseline = Readonly<{
  emitInfoOnCleanSuccess?: boolean;
}>;

export const DEFAULT_FINDINGS_BASELINE: DeploymentFindingsBaseline = Object.freeze({});

const FINDING_CODES = Object.freeze({
  DEPLOYMENT_FAILED: "OBSERVE_FINDING:DEPLOYMENT_FAILED",
  HEALTH_CHECK_FAILED: "OBSERVE_FINDING:HEALTH_CHECK_FAILED",
  DEPLOYMENT_SUCCEEDED: "OBSERVE_FINDING:DEPLOYMENT_SUCCEEDED",
});

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

function isRecordLike(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertReferenceOnly(value: string, field: string): string {
  if (RESOLVED_VALUE_MARKERS.some((marker) => marker.test(value))) throw invalid(`RESOLVED_VALUE:${field}`);
  if (value.length >= 20 && /^[A-Za-z0-9+/]+={0,2}$/.test(value) && value.includes("=")) throw invalid(`RESOLVED_VALUE:${field}`);
  return value;
}

function normalizeSource(value: unknown): DeploymentFindingSource {
  if (!isRecordLike(value)) throw invalid("NOT_OBJECT");
  const kind = value["kind"];
  if (kind !== "DeploymentObservation" && kind !== "EnrichedDeploymentObservation") throw invalid("KIND");
  const status = value["status"];
  if (status !== "succeeded" && status !== "failed") throw invalid("STATUS");
  const rawChecks = value["healthChecks"];
  if (!Array.isArray(rawChecks)) throw invalid("HEALTH_CHECKS");
  const healthChecks = Object.freeze(
    rawChecks.map((check) => {
      if (!isRecordLike(check)) throw invalid("HEALTH_CHECK");
      const checkStatus = check["status"];
      if (checkStatus !== "PASS" && checkStatus !== "FAIL") throw invalid("HEALTH_CHECK_STATUS");
      return Object.freeze({
        name: assertReferenceOnly(requiredString(check["name"], "name"), "healthCheckName"),
        status: checkStatus,
      });
    }),
  );
  const operationRaw = value["operation"];
  const operation = isRecordLike(operationRaw)
    ? Object.freeze({
        ...(operationRaw["operationId"] !== undefined
          ? { operationId: assertReferenceOnly(requiredString(operationRaw["operationId"], "operationId"), "operationId") }
          : {}),
        ...(operationRaw["runtimeRef"] !== undefined
          ? { runtimeRef: assertReferenceOnly(requiredString(operationRaw["runtimeRef"], "runtimeRef"), "runtimeRef") }
          : {}),
        ...(operationRaw["processRef"] !== undefined
          ? { processRef: assertReferenceOnly(requiredString(operationRaw["processRef"], "processRef"), "processRef") }
          : {}),
        ...(operationRaw["sessionRef"] !== undefined
          ? { sessionRef: assertReferenceOnly(requiredString(operationRaw["sessionRef"], "sessionRef"), "sessionRef") }
          : {}),
      })
    : undefined;
  return Object.freeze({
    kind,
    observationId: requiredString(value["observationId"], "observationId"),
    deploymentId: requiredString(value["deploymentId"], "deploymentId"),
    publishedReleaseRef: requiredString(value["publishedReleaseRef"], "publishedReleaseRef"),
    environmentRef: requiredString(value["environmentRef"], "environmentRef"),
    releaseHash: requiredString(value["releaseHash"], "releaseHash"),
    status,
    healthChecks,
    ...(operation !== undefined ? { operation } : {}),
  });
}

export function deriveFindings(
  observation: DeploymentFindingSource,
  baseline: DeploymentFindingsBaseline = DEFAULT_FINDINGS_BASELINE,
): readonly DeploymentFinding[] {
  const source = normalizeSource(observation);

  const refs = Object.freeze({
    observationId: source.observationId,
    deploymentId: source.deploymentId,
    publishedReleaseRef: source.publishedReleaseRef,
    environmentRef: source.environmentRef,
    releaseHash: source.releaseHash,
    ...(source.operation?.operationId !== undefined ? { operationId: source.operation.operationId } : {}),
    ...(source.operation?.runtimeRef !== undefined ? { runtimeRef: source.operation.runtimeRef } : {}),
    ...(source.operation?.processRef !== undefined ? { processRef: source.operation.processRef } : {}),
    ...(source.operation?.sessionRef !== undefined ? { sessionRef: source.operation.sessionRef } : {}),
  });

  const findings: DeploymentFinding[] = [];

  if (source.status === "failed") {
    findings.push(
      DeploymentFinding.create({
        ...refs,
        severity: "critical",
        confidence: "high",
        code: FINDING_CODES.DEPLOYMENT_FAILED,
        message: "deployment did not complete successfully",
      }),
    );
  }

  for (const check of source.healthChecks) {
    if (check.status === "FAIL") {
      findings.push(
        DeploymentFinding.create({
          ...refs,
          severity: "warning",
          confidence: "medium",
          code: FINDING_CODES.HEALTH_CHECK_FAILED,
          message: `health check "${check.name}" did not pass`,
        }),
      );
    }
  }

  const cleanSuccess = source.status === "succeeded" && source.healthChecks.every((check) => check.status === "PASS");
  if (cleanSuccess && baseline.emitInfoOnCleanSuccess === true) {
    findings.push(
      DeploymentFinding.create({
        ...refs,
        severity: "info",
        confidence: "high",
        code: FINDING_CODES.DEPLOYMENT_SUCCEEDED,
        message: "deployment completed successfully",
      }),
    );
  }

  return Object.freeze(findings);
}
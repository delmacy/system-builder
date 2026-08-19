import { sha256Canonical } from "@system-builder/deterministic";

export { publish, type PublishObserver, type PublishResult } from "./publish.js";
export {
  DeploymentOperationMetadata,
  type DeploymentExecutionContext,
  type DeploymentOperationMetadataFields,
  type DeploymentOperationMode,
  type DeploymentOperationSource,
} from "./metadata.js";

export type DeploymentHealthCheck = Readonly<{
  name: string;
  status: "PASS" | "FAIL";
}>;

export type DeploymentRecordLike = Readonly<{
  kind: "DeploymentRecord";
  deploymentId: string;
  publishedReleaseRef: string;
  environmentRef: string;
  releaseHash: string;
  startedAt: string;
  completedAt: string;
  status: "succeeded" | "failed";
  healthChecks: readonly DeploymentHealthCheck[];
}>;

export type DeploymentObservation = Readonly<{
  kind: "DeploymentObservation";
  observationId: string;
  deploymentId: string;
  publishedReleaseRef: string;
  environmentRef: string;
  releaseHash: string;
  startedAt: string;
  completedAt: string;
  status: "succeeded" | "failed";
  healthChecks: readonly DeploymentHealthCheck[];
}>;

const CORRELATION_FIELDS = [
  "deploymentId",
  "publishedReleaseRef",
  "environmentRef",
  "releaseHash",
  "startedAt",
  "completedAt",
  "status",
  "healthChecks",
] as const;

function isRecordLike(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function invalid(detail: string): Error {
  return new Error(`OBSERVE_INVALID_DEPLOYMENT_RECORD:${detail}`);
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw invalid(`MALFORMED:${field}`);
  return value;
}

function parseCorrelation(value: Record<string, unknown>): Omit<DeploymentObservation, "kind" | "observationId"> {
  for (const key of Object.keys(value)) {
    if (key !== "kind" && key !== "observationId" && !(CORRELATION_FIELDS as readonly string[]).includes(key)) {
      throw invalid(`UNKNOWN_FIELD:${key}`);
    }
  }
  const status = value["status"];
  if (status !== "succeeded" && status !== "failed") throw invalid("STATUS");
  const rawHealthChecks = value["healthChecks"];
  if (!Array.isArray(rawHealthChecks)) throw invalid("HEALTH_CHECKS");
  const healthChecks = Object.freeze(
    rawHealthChecks.map((check) => {
      if (!isRecordLike(check)) throw invalid("HEALTH_CHECK");
      const checkStatus = check["status"];
      if (checkStatus !== "PASS" && checkStatus !== "FAIL") throw invalid("HEALTH_CHECK_STATUS");
      return Object.freeze({ name: requiredString(check["name"], "name"), status: checkStatus });
    }),
  );
  return Object.freeze({
    deploymentId: requiredString(value["deploymentId"], "deploymentId"),
    publishedReleaseRef: requiredString(value["publishedReleaseRef"], "publishedReleaseRef"),
    environmentRef: requiredString(value["environmentRef"], "environmentRef"),
    releaseHash: requiredString(value["releaseHash"], "releaseHash"),
    startedAt: requiredString(value["startedAt"], "startedAt"),
    completedAt: requiredString(value["completedAt"], "completedAt"),
    status,
    healthChecks,
  });
}

function observationWithId(correlation: Omit<DeploymentObservation, "kind" | "observationId">): DeploymentObservation {
  const payload = Object.freeze({ kind: "DeploymentObservation" as const, ...correlation });
  return Object.freeze({ ...payload, observationId: sha256Canonical(payload) });
}

export const DeploymentObservation = Object.freeze({
  fromDeploymentRecord(record: unknown): DeploymentObservation {
    if (!isRecordLike(record)) throw invalid("NOT_OBJECT");
    if (record["kind"] !== "DeploymentRecord") throw invalid("KIND");
    return observationWithId(parseCorrelation(record));
  },
  toJson(observation: DeploymentObservation): string {
    return JSON.stringify(observation);
  },
  fromJson(serialized: string): DeploymentObservation {
    let parsed: unknown;
    try {
      parsed = JSON.parse(serialized);
    } catch {
      throw invalid("JSON");
    }
    if (!isRecordLike(parsed)) throw invalid("NOT_OBJECT");
    if (parsed["kind"] !== "DeploymentObservation") throw invalid("KIND");
    const expected = observationWithId(parseCorrelation(parsed));
    if (typeof parsed["observationId"] !== "string" || parsed["observationId"] !== expected.observationId) {
      throw invalid("OBSERVATION_ID");
    }
    return expected;
  },
});
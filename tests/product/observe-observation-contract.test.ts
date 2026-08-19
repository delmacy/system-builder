import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { DeploymentObservation, type DeploymentObservation as DeploymentObservationType } from "../../packages/observe/index.js";
import { dryRunDeploy, type DeploymentRecord } from "../../packages/deploy/index.js";

const artifactHash = `sha256:${"a".repeat(64)}`;
const release = Object.freeze({
  kind: "PublishedRelease" as const,
  releaseId: "observe-app",
  version: "1.0.0",
  artifactRef: artifactHash,
  artifactHash,
  validationEvidenceRef: `sha256:${"b".repeat(64)}`,
  publishedAt: "2026-08-19T10:00:00Z",
  status: "published" as const,
});
const artifact = Object.freeze({
  kind: "ReleaseArtifact" as const,
  artifactHash,
  manifest: Object.freeze({ runtimeVersion: "runtime-1" }),
  environmentSchema: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }),
  ]),
});
const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "env:observe",
  runtimeVersions: Object.freeze(["runtime-1"]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://observe-database" }),
  ]),
});

function produceRecord(version: string, status: "succeeded" | "failed"): DeploymentRecord {
  const result = dryRunDeploy({
    publishedRelease: { ...release, version },
    releaseArtifact: artifact,
    environment,
    acceptanceChecks: status === "succeeded" ? [{ name: "health", pass: true }] : [{ name: "health", pass: false }],
    startedAt: "2026-08-19T10:00:01Z",
    completedAt: "2026-08-19T10:00:02Z",
  });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK134_DEPLOY_FAILED");
  return result.record;
}

test("DeploymentObservation derives losslessly and deterministically from a real DeploymentRecord", () => {
  const record = produceRecord("1.0.0", "succeeded");
  const observation = DeploymentObservation.fromDeploymentRecord(record);

  assert.equal(observation.kind, "DeploymentObservation");
  assert.match(observation.observationId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(observation.deploymentId, record.deploymentId);
  assert.equal(observation.publishedReleaseRef, record.publishedReleaseRef);
  assert.equal(observation.environmentRef, record.environmentRef);
  assert.equal(observation.releaseHash, record.releaseHash);
  assert.equal(observation.startedAt, record.startedAt);
  assert.equal(observation.completedAt, record.completedAt);
  assert.equal(observation.status, record.status);
  assert.deepEqual(observation.healthChecks, record.healthChecks);
  assert.equal(Object.isFrozen(observation), true);
  assert.equal(Object.isFrozen(observation.healthChecks), true);

  const repeated = DeploymentObservation.fromDeploymentRecord(record);
  assert.deepEqual(repeated, observation);
  assert.equal(repeated.observationId, observation.observationId);
});

test("different DeploymentRecords produce different content-addressed observations", () => {
  const succeeded = produceRecord("1.0.0", "succeeded");
  const failed = produceRecord("1.0.1", "failed");
  const first = DeploymentObservation.fromDeploymentRecord(succeeded);
  const second = DeploymentObservation.fromDeploymentRecord(failed);
  assert.notEqual(first.observationId, second.observationId);
  assert.equal(second.status, "failed");
  assert.deepEqual(second.healthChecks, [{ name: "health", status: "FAIL" }]);
});

test("JSON round-trip preserves every observation field losslessly", () => {
  const observation = DeploymentObservation.fromDeploymentRecord(produceRecord("1.0.2", "succeeded"));
  const restored = DeploymentObservation.fromJson(DeploymentObservation.toJson(observation));
  assert.deepEqual(restored, observation);
  assert.equal(restored.observationId, observation.observationId);

  const record = produceRecord("1.0.3", "failed");
  const failedObservation = DeploymentObservation.fromDeploymentRecord(record);
  assert.deepEqual(
    JSON.parse(DeploymentObservation.toJson(failedObservation)) as DeploymentObservationType,
    failedObservation,
  );
});

test("DeploymentObservation never carries a resolved secret/credential/CA value", () => {
  const record = produceRecord("1.0.4", "succeeded");
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const serialized = DeploymentObservation.toJson(observation);
  assert.equal(serialized.includes("postgres://"), false);
  assert.equal(serialized.includes("secret://observe-database"), false);
  assert.deepEqual(Object.keys(observation).sort(), [
    "completedAt",
    "deploymentId",
    "environmentRef",
    "healthChecks",
    "kind",
    "observationId",
    "publishedReleaseRef",
    "releaseHash",
    "startedAt",
    "status",
  ]);
  assert.deepEqual(Object.keys(observation.healthChecks[0] ?? {}).sort(), ["name", "status"]);
});

test("DeploymentObservation rejects malformed and unknown records deterministically", () => {
  const record = produceRecord("1.0.5", "succeeded");
  assert.throws(() => DeploymentObservation.fromDeploymentRecord(null), /OBSERVE_INVALID_DEPLOYMENT_RECORD:NOT_OBJECT/);
  assert.throws(() => DeploymentObservation.fromDeploymentRecord("not a record"), /OBSERVE_INVALID_DEPLOYMENT_RECORD:NOT_OBJECT/);
  assert.throws(() => DeploymentObservation.fromDeploymentRecord({ ...record, kind: "UnknownRecord" }), /OBSERVE_INVALID_DEPLOYMENT_RECORD:KIND/);
  assert.throws(() => DeploymentObservation.fromDeploymentRecord({ ...record, deploymentId: "" }), /OBSERVE_INVALID_DEPLOYMENT_RECORD:MALFORMED:deploymentId/);
  assert.throws(() => DeploymentObservation.fromDeploymentRecord({ ...record, status: "unknown" }), /OBSERVE_INVALID_DEPLOYMENT_RECORD:STATUS/);
  assert.throws(() => DeploymentObservation.fromDeploymentRecord({ ...record, healthChecks: "none" }), /OBSERVE_INVALID_DEPLOYMENT_RECORD:HEALTH_CHECKS/);
  assert.throws(
    () => DeploymentObservation.fromDeploymentRecord({ ...record, healthChecks: [{ name: "health", status: "UNKNOWN" }] }),
    /OBSERVE_INVALID_DEPLOYMENT_RECORD:HEALTH_CHECK_STATUS/,
  );
  assert.throws(() => DeploymentObservation.fromDeploymentRecord({ ...record, missing: true }), /OBSERVE_INVALID_DEPLOYMENT_RECORD:UNKNOWN_FIELD:missing/);
  assert.throws(
    () => DeploymentObservation.fromDeploymentRecord({ ...record, secret: "postgres://user:password@host/db", ca: "-----BEGIN CERTIFICATE-----" }),
    /OBSERVE_INVALID_DEPLOYMENT_RECORD:UNKNOWN_FIELD:secret/,
  );
});

test("DeploymentObservation JSON validation rejects malformed or tampered serialized observations", () => {
  const observation = DeploymentObservation.fromDeploymentRecord(produceRecord("1.0.6", "succeeded"));
  const tampered = { ...(JSON.parse(DeploymentObservation.toJson(observation)) as DeploymentObservationType), observationId: `sha256:${"f".repeat(64)}` };
  assert.throws(() => DeploymentObservation.fromJson(JSON.stringify(tampered)), /OBSERVE_INVALID_DEPLOYMENT_RECORD:OBSERVATION_ID/);
  assert.throws(() => DeploymentObservation.fromJson("{not json"), /OBSERVE_INVALID_DEPLOYMENT_RECORD:JSON/);
  assert.throws(() => DeploymentObservation.fromJson(JSON.stringify({ ...tampered, kind: "Other" })), /OBSERVE_INVALID_DEPLOYMENT_RECORD:KIND/);
});
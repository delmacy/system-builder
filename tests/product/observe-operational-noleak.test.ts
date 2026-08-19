import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import {
  DeploymentObservation,
  DeploymentOperationMetadata,
  correlateOperation,
  enrichObservation,
  publishEnriched,
  type EnrichedDeploymentObservation,
} from "../../packages/observe/index.js";
import { dryRunDeploy, type DeploymentRecord } from "../../packages/deploy/index.js";

const artifactHash = `sha256:${"a".repeat(64)}`;
const SECRET = "password=hunter2";
const CA = "-----BEGIN CERTIFICATE-----\nMIIB...\n-----END CERTIFICATE-----";
const TOKEN = "Authorization: Bearer abc-123-def";

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

function produceRecord(): DeploymentRecord {
  const result = dryRunDeploy({
    publishedRelease: release,
    releaseArtifact: artifact,
    environment,
    acceptanceChecks: [{ name: "health", pass: true }],
    startedAt: "2026-08-19T10:00:01Z",
    completedAt: "2026-08-19T10:00:02Z",
  });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK144_DEPLOY_FAILED");
  return result.record;
}

function observation() {
  return DeploymentObservation.fromDeploymentRecord(produceRecord());
}

function baseOperation() {
  const record = produceRecord();
  return DeploymentOperationMetadata.fromExecutionContext({
    executorRef: "user://maintainer",
    source: "manual",
    mode: "execute",
    sourceRef: "cli:sb-deploy",
    triggeredAt: "2026-08-19T10:00:00Z",
    runtimeRef: "runtime://managed-a",
    processRef: "process://a-1",
    sessionRef: "session://s1",
    deploymentId: record.deploymentId,
    publishedReleaseRef: record.publishedReleaseRef,
    environmentRef: record.environmentRef,
    releaseHash: record.releaseHash,
  });
}

test("derivation rejects a resolved secret value as executor/source/mode input deterministically", () => {
  const record = produceRecord();
  const base = {
    source: "manual" as const,
    mode: "execute" as const,
    deploymentId: record.deploymentId,
    publishedReleaseRef: record.publishedReleaseRef,
    environmentRef: record.environmentRef,
    releaseHash: record.releaseHash,
  };

  assert.throws(
    () => DeploymentOperationMetadata.fromExecutionContext({ ...base, executorRef: SECRET }),
    /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:executorRef/,
  );
  assert.throws(
    () => DeploymentOperationMetadata.fromExecutionContext({ ...base, executorRef: "user://ok", sourceRef: TOKEN }),
    /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:sourceRef/,
  );
  assert.throws(
    () => DeploymentOperationMetadata.fromExecutionContext({ ...base, executorRef: "user://ok", runtimeRef: CA }),
    /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:runtimeRef/,
  );
});

test("validation rejects a resolved secret/CA value and never echoes it in the diagnostic", () => {
  const valid = baseOperation();
  const leaky = { ...valid, executorRef: SECRET };

  assert.throws(
    () => DeploymentOperationMetadata.validate(leaky),
    (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      assert.match(message, /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:executorRef/);
      assert.equal(message.includes(SECRET), false);
      assert.equal(message.includes("hunter2"), false);
      return true;
    },
  );
});

test("correlation rejects a resolved value in runtime refs and never echoes it", () => {
  const valid = baseOperation();

  assert.throws(
    () => correlateOperation(valid, { processRef: `process://${TOKEN}` }),
    (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      assert.match(message, /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:processRef/);
      assert.equal(message.includes(TOKEN), false);
      return true;
    },
  );
});

test("enrichment omits any simulated resolved value from the enriched payload", () => {
  const obs = observation();
  const op = baseOperation();
  const enriched = enrichObservation(obs, op) as EnrichedDeploymentObservation;
  const serialized = JSON.stringify(enriched);

  assert.equal(serialized.includes("postgres://"), false);
  assert.equal(serialized.includes("secret://observe-database"), false);
  assert.equal(serialized.includes("BEGIN CERTIFICATE"), false);
  assert.equal(serialized.includes("Bearer"), false);
  assert.equal(enriched.enrichedId.startsWith("sha256:"), true);
});

test("enrichment rejects an operation carrying a resolved value deterministically", () => {
  const obs = observation();
  const leaky = { ...baseOperation(), executorRef: SECRET };

  assert.throws(
    () => enrichObservation(obs, leaky as never),
    /OBSERVE_INVALID_OPERATION_METADATA:RESOLVED_VALUE:executorRef/,
  );
});

test("fail-open diagnostics never echo a secret/credential/CA value", async () => {
  const obs = observation();
  const leaky = { ...baseOperation(), executorRef: SECRET };
  const result = await publishEnriched(obs, leaky);

  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK144_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "metadata-failed");
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes(SECRET), false);
  assert.equal(serialized.includes("hunter2"), false);
  assert.equal(serialized.includes("BEGIN CERTIFICATE"), false);
  assert.equal(serialized.includes(TOKEN), false);
  assert.equal(result.diagnostic.code, "OBSERVE_METADATA_FAILED");
});

test("canonical DeploymentRecord identity and Sprint 1 observation identity remain unchanged", () => {
  const recordA = produceRecord();
  const recordB = produceRecord();
  assert.equal(recordA.deploymentId, recordB.deploymentId);

  const obs = observation();
  const enriched = enrichObservation(obs, baseOperation()) as EnrichedDeploymentObservation;
  assert.equal(enriched.observationId, obs.observationId);
  assert.equal(enriched.deploymentId, obs.deploymentId);
  assert.equal(obs.observationId.startsWith("sha256:"), true);
});
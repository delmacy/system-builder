import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { DeploymentObservation, publish, type PublishObserver } from "../../packages/observe/index.js";
import { dryRunDeploy, type DeploymentRecord } from "../../packages/deploy/index.js";

const artifactHash = `sha256:${"c".repeat(64)}`;
const release = Object.freeze({
  kind: "PublishedRelease" as const,
  releaseId: "observe-publisher",
  version: "1.0.0",
  artifactRef: artifactHash,
  artifactHash,
  validationEvidenceRef: `sha256:${"d".repeat(64)}`,
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
  environmentRef: "env:observe-publisher",
  runtimeVersions: Object.freeze(["runtime-1"]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://publisher-database" }),
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
  if (!result.ok) throw new Error("TASK135_DEPLOY_FAILED");
  return result.record;
}

test("publish delivers the deterministic DeploymentObservation to a configured channel", async () => {
  const record = produceRecord("1.0.0", "succeeded");
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const delivered: unknown[] = [];
  const observer: PublishObserver = { deliver: (payload) => void delivered.push(payload) };

  const result = await publish(observation, observer);

  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK135_UNEXPECTED_FAILURE");
  assert.equal(result.outcome, "delivered");
  assert.equal(result.observationId, observation.observationId);
  assert.deepEqual(delivered, [observation]);
});

test("publish with no channel configured returns a deterministic not-configured result and leaves Deploy unchanged", async () => {
  const record = produceRecord("1.0.1", "failed");
  const observation = DeploymentObservation.fromDeploymentRecord(record);

  const result = await publish(observation);

  assert.deepEqual(result, Object.freeze({ ok: true, outcome: "not-configured", observationId: null } as const));
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK135_UNEXPECTED_FAILURE");
  assert.equal(result.outcome, "not-configured");
  assert.equal(result.observationId, null);

  assert.equal(DeploymentObservation.fromDeploymentRecord(record).status, "failed");
  const rerun = dryRunDeploy({
    publishedRelease: { ...release, version: "1.0.2" },
    releaseArtifact: artifact,
    environment,
    acceptanceChecks: [{ name: "health", pass: true }],
    startedAt: "2026-08-19T10:00:01Z",
    completedAt: "2026-08-19T10:00:02Z",
  });
  assert.equal(rerun.ok, true);
});

test("publish fails open when the channel is unavailable or throws", async () => {
  const record = produceRecord("1.0.3", "succeeded");
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const failing: PublishObserver = {
    deliver: async () => {
      throw new Error("observe channel offline");
    },
  };

  const result = await publish(observation, failing);

  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK135_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "channel-failed");
  assert.equal(result.observationId, observation.observationId);
  assert.deepEqual(result.diagnostic, Object.freeze({ code: "OBSERVE_CHANNEL_FAILED", detail: "observe channel unavailable; deployment outcome unchanged" } as const));
  assert.equal(result.diagnostic.detail.includes("offline"), false);
  assert.equal(result.diagnostic.detail.includes("postgres://"), false);
});

test("a synchronous throw from the channel also fails open without propagating", async () => {
  const record = produceRecord("1.0.4", "succeeded");
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const throwing: PublishObserver = {
    deliver: () => {
      throw new Error("sync channel failure");
    },
  };

  const result = await publish(observation, throwing);

  assert.equal(result.ok, false);
  if (result.ok) throw new Error("TASK135_SHOULD_HAVE_FAILED_OPEN");
  assert.equal(result.outcome, "channel-failed");
});

test("emitted observation never carries a resolved secret/credential/CA value", async () => {
  const record = produceRecord("1.0.5", "succeeded");
  const observation = DeploymentObservation.fromDeploymentRecord(record);
  const delivered: string[] = [];
  const observer: PublishObserver = {
    deliver: (payload) => void delivered.push(DeploymentObservation.toJson(payload)),
  };

  const result = await publish(observation, observer);

  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("TASK135_UNEXPECTED_FAILURE");
  assert.equal(result.outcome, "delivered");
  const serialized = delivered[0] ?? "";
  assert.equal(serialized.includes("postgres://"), false);
  assert.equal(serialized.includes("secret://publisher-database"), false);
  assert.equal(serialized.includes("BEGIN CERTIFICATE"), false);
});

test("publish result is deterministic and content-addressed across identical observations", async () => {
  const succeeded = produceRecord("1.0.6", "succeeded");
  const failed = produceRecord("1.0.7", "failed");

  const [a1, a2] = [publish(DeploymentObservation.fromDeploymentRecord(succeeded)), publish(DeploymentObservation.fromDeploymentRecord(succeeded))];
  const firstA = await a1;
  const secondA = await a2;
  assert.deepEqual(firstA, secondA);
  if (firstA.ok && secondA.ok) {
    assert.equal(firstA.outcome, "not-configured");
    assert.equal(firstA.observationId, null);
  }

  const failedResult = await publish(DeploymentObservation.fromDeploymentRecord(failed));
  if (failedResult.ok) {
    assert.equal(failedResult.observationId, null);
  }
  assert.notEqual(DeploymentObservation.fromDeploymentRecord(succeeded).observationId, DeploymentObservation.fromDeploymentRecord(failed).observationId);
});
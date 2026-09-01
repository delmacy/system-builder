import assert from "node:assert/strict";
import test from "node:test";

import { DeploymentObservation, publish } from "../../packages/observe/index.js";

const SECRET = "task-453-secret-must-never-leak";

function referenceDeploymentRecord() {
  return Object.freeze({
    kind: "DeploymentRecord" as const,
    deploymentId: "deployment:reference-orders-system:0.0.1:local",
    publishedReleaseRef: "reference-orders-system@0.0.1",
    environmentRef: "environment:p19:reference-process",
    releaseHash: "artifact:reference-orders:verified",
    startedAt: "2026-09-01T13:40:00.000Z",
    completedAt: "2026-09-01T13:41:00.000Z",
    status: "succeeded" as const,
    healthChecks: Object.freeze([
      Object.freeze({ name: "generated-runtime-startup", status: "PASS" as const }),
      Object.freeze({ name: "generated-runtime-health", status: "PASS" as const }),
    ]),
  });
}

test("TASK-453 correlates the canonical reference deployment into deterministic local Observe evidence", () => {
  const record = referenceDeploymentRecord();
  const first = DeploymentObservation.fromDeploymentRecord(record);
  const repeated = DeploymentObservation.fromDeploymentRecord(record);

  assert.deepEqual(first, repeated);
  assert.equal(first.deploymentId, record.deploymentId);
  assert.equal(first.publishedReleaseRef, record.publishedReleaseRef);
  assert.equal(first.environmentRef, record.environmentRef);
  assert.equal(first.releaseHash, record.releaseHash);
  assert.deepEqual(first.healthChecks, record.healthChecks);
  assert.equal(JSON.stringify(first).includes(SECRET), false);

  const serialized = DeploymentObservation.toJson(first);
  assert.deepEqual(DeploymentObservation.fromJson(serialized), first);
});

test("TASK-453 keeps duplicate and ordered local evidence deterministic without creating runtime authority", () => {
  const record = referenceDeploymentRecord();
  const duplicateA = DeploymentObservation.fromDeploymentRecord(record);
  const duplicateB = DeploymentObservation.fromDeploymentRecord({ ...record });
  assert.equal(duplicateA.observationId, duplicateB.observationId);

  const reordered = DeploymentObservation.fromDeploymentRecord({
    ...record,
    healthChecks: [...record.healthChecks].reverse(),
  });
  assert.notEqual(reordered.observationId, duplicateA.observationId);
  assert.deepEqual(reordered.healthChecks, [...record.healthChecks].reverse());
});

test("TASK-453 keeps optional Observe publication fail-open and repeatable", async () => {
  const observation = DeploymentObservation.fromDeploymentRecord(referenceDeploymentRecord());

  assert.deepEqual(await publish(observation), {
    ok: true,
    outcome: "not-configured",
    observationId: null,
  });

  const unavailable = { deliver: async () => { throw new Error("observe unavailable"); } };
  const firstFailure = await publish(observation, unavailable);
  const repeatedFailure = await publish(observation, unavailable);
  assert.deepEqual(firstFailure, repeatedFailure);
  assert.deepEqual(firstFailure, {
    ok: false,
    outcome: "channel-failed",
    observationId: observation.observationId,
    diagnostic: {
      code: "OBSERVE_CHANNEL_FAILED",
      detail: "observe channel unavailable; deployment outcome unchanged",
    },
  });
});

test("TASK-453 rejects stale, substituted and malformed observation evidence", () => {
  const canonical = DeploymentObservation.fromDeploymentRecord(referenceDeploymentRecord());

  const substituted = JSON.parse(DeploymentObservation.toJson(canonical)) as Record<string, unknown>;
  substituted["publishedReleaseRef"] = "reference-orders-system@substituted";
  assert.throws(
    () => DeploymentObservation.fromJson(JSON.stringify(substituted)),
    /OBSERVE_INVALID_DEPLOYMENT_RECORD:OBSERVATION_ID/,
  );

  assert.throws(
    () => DeploymentObservation.fromDeploymentRecord({
      ...referenceDeploymentRecord(),
      environmentRef: "",
    }),
    /OBSERVE_INVALID_DEPLOYMENT_RECORD:MALFORMED:environmentRef/,
  );

  assert.throws(
    () => DeploymentObservation.fromDeploymentRecord({
      ...referenceDeploymentRecord(),
      protectedValue: SECRET,
    }),
    /OBSERVE_INVALID_DEPLOYMENT_RECORD:UNKNOWN_FIELD:protectedValue/,
  );
});

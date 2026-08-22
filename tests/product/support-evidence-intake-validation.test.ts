import assert from "node:assert/strict";
import test from "node:test";
import { SupportEvidenceIntake } from "../../packages/support-evolution/index.js";

function validObserve() {
  return SupportEvidenceIntake.create({
    sourceKind: "observe_finding",
    evidenceRef: `sha256:${"a".repeat(64)}`,
    summary: "deployment health finding requires support attention",
    submittedAt: "2026-08-22T03:45:00.000Z",
    findingCode: "OBSERVE_FINDING:HEALTH_CHECK_FAILED",
    observationId: `sha256:${"b".repeat(64)}`,
    deploymentId: "deploy:support-a",
    publishedReleaseRef: "release:support-app@1.0.0",
    environmentRef: "env:prod-a",
    releaseHash: `sha256:${"c".repeat(64)}`,
  });
}

test("SupportEvidenceIntake validates and preserves a valid artifact", () => {
  const intake = validObserve();
  assert.deepEqual(SupportEvidenceIntake.validate(intake), intake);
  assert.equal(Object.isFrozen(SupportEvidenceIntake.validate(intake)), true);
});

test("SupportEvidenceIntake rejects unknown fields and identity divergence", () => {
  const intake = validObserve();
  assert.throws(
    () => SupportEvidenceIntake.validate({ ...intake, providerLocator: "host-a" }),
    /SUPPORT_INTAKE:UNKNOWN_FIELD:providerLocator/,
  );
  assert.throws(
    () => SupportEvidenceIntake.validate({ ...intake, intakeId: `sha256:${"f".repeat(64)}` }),
    /SUPPORT_INTAKE:INTAKE_ID/,
  );
});

test("SupportEvidenceIntake rejects conflicting and incomplete source provenance", () => {
  assert.throws(
    () => SupportEvidenceIntake.create({
      sourceKind: "observe_finding",
      evidenceRef: "finding://1",
      summary: "conflicting provenance",
      submittedAt: "2026-08-22T03:46:00.000Z",
      requestKind: "incident",
      actorRef: "actor://1",
      channelRef: "channel://desk",
    }),
    /SUPPORT_INTAKE:SOURCE_CONFLICT:observe_finding/,
  );

  assert.throws(
    () => SupportEvidenceIntake.create({
      sourceKind: "human_request",
      evidenceRef: "request://1",
      summary: "incomplete provenance",
      submittedAt: "2026-08-22T03:47:00.000Z",
      requestKind: "request",
      actorRef: "actor://1",
    }),
    /SUPPORT_INTAKE:SOURCE_PROVENANCE:human_request/,
  );
});

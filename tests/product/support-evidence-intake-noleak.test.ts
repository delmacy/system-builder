import assert from "node:assert/strict";
import test from "node:test";
import { SupportEvidenceIntake } from "../../packages/support-evolution/index.js";

const safeFinding = Object.freeze({
  kind: "DeploymentFinding" as const,
  findingId: `sha256:${"a".repeat(64)}`,
  code: "OBSERVE_FINDING:HEALTH_CHECK_FAILED",
  message: "health check did not pass",
  observationId: `sha256:${"b".repeat(64)}`,
  deploymentId: "deploy:support-a",
  publishedReleaseRef: "release:support-app@1.0.0",
  environmentRef: "env:prod-a",
  releaseHash: `sha256:${"c".repeat(64)}`,
});

test("Support intake accepts stable references without resolved values", () => {
  const fromFinding = SupportEvidenceIntake.fromDeploymentFinding(safeFinding, "2026-08-22T04:20:00.000Z");
  const fromHuman = SupportEvidenceIntake.fromHumanRequest({
    requestKind: "request",
    evidenceRef: "request://desk/55",
    summary: "operator requests investigation of deployment reference",
    submittedAt: "2026-08-22T04:20:01.000Z",
    actorRef: "actor://operator/55",
    channelRef: "channel://service-desk",
  });
  assert.match(fromFinding.intakeId, /^sha256:[a-f0-9]{64}$/);
  assert.match(fromHuman.intakeId, /^sha256:[a-f0-9]{64}$/);
});

test("Support intake rejects resolved-value markers from finding evidence", () => {
  assert.throws(
    () => SupportEvidenceIntake.fromDeploymentFinding(
      { ...safeFinding, message: "authorization=Bearer resolved-value" },
      "2026-08-22T04:20:00.000Z",
    ),
    /SUPPORT_INTAKE:RESOLVED_VALUE:message/,
  );
});

test("Support intake rejects resolved-value markers from human evidence", () => {
  assert.throws(
    () => SupportEvidenceIntake.fromHumanRequest({
      requestKind: "incident",
      evidenceRef: "request://desk/56",
      summary: "password=resolved-value",
      submittedAt: "2026-08-22T04:20:02.000Z",
      actorRef: "actor://operator/56",
      channelRef: "channel://service-desk",
    }),
    /SUPPORT_INTAKE:RESOLVED_VALUE:summary/,
  );
  assert.throws(
    () => SupportEvidenceIntake.fromHumanRequest({
      requestKind: "feedback",
      evidenceRef: "-----BEGIN PRIVATE KEY-----",
      summary: "unsafe evidence reference",
      submittedAt: "2026-08-22T04:20:03.000Z",
      actorRef: "actor://operator/57",
      channelRef: "channel://service-desk",
    }),
    /SUPPORT_INTAKE:RESOLVED_VALUE:evidenceRef/,
  );
});

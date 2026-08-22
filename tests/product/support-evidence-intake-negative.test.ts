import assert from "node:assert/strict";
import test from "node:test";
import { SupportEvidenceIntake } from "../../packages/support-evolution/index.js";

function validHuman() {
  return SupportEvidenceIntake.fromHumanRequest({
    requestKind: "request",
    evidenceRef: "human-request:negative-001",
    summary: "request requires review",
    submittedAt: "2026-08-22T04:05:00.000Z",
    actorRef: "user:operator-002",
    channelRef: "channel:service-desk",
  });
}

test("SupportEvidenceIntake public API rejects malformed and conflicting inputs deterministically", () => {
  const valid = validHuman();

  assert.throws(
    () => SupportEvidenceIntake.validate({ ...valid, unexpected: "field" }),
    /SUPPORT_INTAKE:UNKNOWN_FIELD:unexpected/,
  );
  assert.throws(
    () => SupportEvidenceIntake.create({
      sourceKind: "human_request",
      evidenceRef: "",
      summary: "request",
      submittedAt: "2026-08-22T04:05:00.000Z",
    }),
    /SUPPORT_INTAKE:MALFORMED:evidenceRef/,
  );
  assert.throws(
    () => SupportEvidenceIntake.create({
      sourceKind: "human_request",
      evidenceRef: "human-request:conflict",
      summary: "request",
      submittedAt: "2026-08-22T04:05:00.000Z",
      requestKind: "incident",
      actorRef: "user:operator-002",
      channelRef: "channel:service-desk",
      findingCode: "OBSERVE_FINDING:DEPLOYMENT_FAILED",
      observationId: `sha256:${"a".repeat(64)}`,
    }),
    /SUPPORT_INTAKE:SOURCE_CONFLICT:human_request/,
  );
  assert.throws(
    () => SupportEvidenceIntake.validate({ ...valid, intakeId: `sha256:${"f".repeat(64)}` }),
    /SUPPORT_INTAKE:INTAKE_ID/,
  );
  assert.throws(
    () => SupportEvidenceIntake.fromJson("{not-json"),
    /SUPPORT_INTAKE:JSON/,
  );
  assert.throws(
    () => SupportEvidenceIntake.fromHumanRequest({
      requestKind: "feedback",
      evidenceRef: "human-request:resolved-value",
      summary: "authorization: Bearer secret-material",
      submittedAt: "2026-08-22T04:05:00.000Z",
      actorRef: "user:operator-002",
      channelRef: "channel:service-desk",
    }),
    /SUPPORT_INTAKE:RESOLVED_VALUE:summary/,
  );
});

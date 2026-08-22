import assert from "node:assert/strict";
import test from "node:test";
import { SupportEvidenceIntake } from "../../packages/support-evolution/index.js";

test("SupportEvidenceIntake is deterministic, content-addressed and immutable", () => {
  const fields = {
    sourceKind: "observe_finding" as const,
    evidenceRef: `sha256:${"a".repeat(64)}`,
    summary: "deployment health finding requires support attention",
    submittedAt: "2026-08-22T03:30:00.000Z",
    deploymentId: "deploy:support-a",
    publishedReleaseRef: "release:support-app@1.0.0",
    environmentRef: "env:prod-a",
    releaseHash: `sha256:${"b".repeat(64)}`,
    runtimeRef: "runtime://managed-a",
  };
  const left = SupportEvidenceIntake.create(fields);
  const right = SupportEvidenceIntake.create(fields);

  assert.equal(left.kind, "SupportEvidenceIntake");
  assert.match(left.intakeId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(left.intakeId, right.intakeId);
  assert.equal(left.sourceKind, "observe_finding");
  assert.equal(left.evidenceRef, fields.evidenceRef);
  assert.equal(left.deploymentId, fields.deploymentId);
  assert.equal(Object.isFrozen(left), true);

  const changed = SupportEvidenceIntake.create({ ...fields, summary: "different summary" });
  assert.notEqual(changed.intakeId, left.intakeId);
});

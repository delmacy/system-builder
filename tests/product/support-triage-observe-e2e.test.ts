import assert from "node:assert/strict";
import test from "node:test";
import { DeploymentFinding } from "../../packages/observe/index.js";
import { SupportEvidenceIntake, SupportTriageDecision } from "../../packages/support-evolution/index.js";

test("public Observe finding flows through intake into explicit triage without remediation", () => {
  const finding = DeploymentFinding.create({
    severity: "warning", confidence: "high", code: "OBSERVE_FINDING:HEALTH_CHECK_FAILED",
    message: "health check api-readiness did not pass", observationId: `sha256:${"1".repeat(64)}`,
    deploymentId: "deploy:prod-2026-08-22", publishedReleaseRef: "release:orders@2.4.0", environmentRef: "env:production",
    releaseHash: `sha256:${"2".repeat(64)}`, runtimeRef: "runtime:orders-prod", processRef: "process:order-intake",
    sessionRef: "session:observe-42",
  });
  const intake = SupportEvidenceIntake.fromDeploymentFinding(finding, "2026-08-22T15:00:00.000Z");
  const triage = SupportTriageDecision.fromIntake(intake, {
    classification: "Maintenance", decidedAt: "2026-08-22T15:05:00.000Z", decidedByRef: "actor:authorized-triager",
    reasonRef: "reason:verified-health-check-defect", impactRef: "impact:orders-api", criticalityRef: "criticality:explicit-high",
    slaRef: "sla:maintenance-standard", priorityRef: "priority:explicit-p1", contextRefs: ["context:production", "context:observe-origin"],
  });
  const restored = SupportTriageDecision.fromJson(SupportTriageDecision.toJson(triage));

  assert.equal(intake.evidenceRef, finding.findingId);
  assert.equal(intake.observationId, finding.observationId);
  assert.equal(intake.deploymentId, finding.deploymentId);
  assert.equal(intake.publishedReleaseRef, finding.publishedReleaseRef);
  assert.equal(intake.releaseHash, finding.releaseHash);
  assert.equal(intake.runtimeRef, finding.runtimeRef);
  assert.equal(restored.intakeId, intake.intakeId);
  assert.equal(restored.classification, "Maintenance");
  assert.equal("remediation" in restored, false);
  assert.equal("deploymentMutation" in restored, false);
});

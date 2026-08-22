import assert from "node:assert/strict";
import test from "node:test";
import { DeploymentFinding } from "../../packages/observe/index.js";
import { ResolutionEvidence, SupportCaseRecord, SupportEvidenceIntake, SupportTriageDecision } from "../../packages/support-evolution/index.js";

test("Observe-origin P12 proof reaches explicit Support resolution through public APIs", () => {
  const finding = DeploymentFinding.create({ severity: "warning", confidence: "high", code: "OBSERVE_FINDING:HEALTH_CHECK_FAILED", message: "health check did not pass", observationId: "observe:observation-42", deploymentId: "deploy:42", publishedReleaseRef: "release:42", environmentRef: "environment:production", releaseHash: "release-hash:42" });
  const intake = SupportEvidenceIntake.fromDeploymentFinding(finding, "2026-08-22T16:00:00.000Z");
  const triage = SupportTriageDecision.fromIntake(intake, { classification: "Support", decidedAt: "2026-08-22T16:01:00.000Z", decidedByRef: "actor:triage", reasonRef: "reason:explicit-support", impactRef: "impact:degraded", criticalityRef: "criticality:known", slaRef: "sla:explicit", priorityRef: "priority:explicit", contextRefs: ["context:production"] });
  const supportCase = SupportCaseRecord.fromTriage(triage, { openedAt: "2026-08-22T16:02:00.000Z", openedByRef: "actor:support", reasonRef: "reason:observed-finding" });
  const linked = SupportCaseRecord.withKnowledgeLinks(supportCase, ["knowledge:runbook-42"]);
  const resolution = ResolutionEvidence.fromCase(linked, { causeRef: "cause:confirmed-health-check", resolutionRef: "resolution:documented-action", evidenceRefs: ["evidence:verification-42"], resolvedAt: "2026-08-22T16:03:00.000Z", resolvedByRef: "actor:resolver" });
  assert.equal(intake.sourceKind, "observe_finding");
  assert.equal(triage.classification, "Support");
  assert.equal(resolution.subjectKind, "SupportCaseRecord");
  assert.deepEqual(ResolutionEvidence.fromJson(ResolutionEvidence.toJson(resolution)), resolution);
});

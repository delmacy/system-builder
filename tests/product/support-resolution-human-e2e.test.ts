import assert from "node:assert/strict";
import test from "node:test";
import { PermittedCorrectionEvidence, ProblemRecord, ResolutionEvidence, SupportEvidenceIntake, SupportTriageDecision } from "../../packages/support-evolution/index.js";

test("human-origin P12 proof reaches explicit Maintenance resolution through public APIs", () => {
  const intake = SupportEvidenceIntake.fromHumanRequest({ requestKind: "incident", evidenceRef: "request:incident-42", summary: "operator reported recurring operational problem", submittedAt: "2026-08-22T16:10:00.000Z", actorRef: "actor:operator", channelRef: "channel:service-desk", environmentRef: "environment:production" });
  const triage = SupportTriageDecision.fromIntake(intake, { classification: "Maintenance", decidedAt: "2026-08-22T16:11:00.000Z", decidedByRef: "actor:triage", reasonRef: "reason:explicit-maintenance", impactRef: "impact:known", criticalityRef: "criticality:known", slaRef: "sla:explicit", priorityRef: "priority:explicit", contextRefs: ["context:maintenance"] });
  const problem = ProblemRecord.fromTriage(triage, { openedAt: "2026-08-22T16:12:00.000Z", openedByRef: "actor:maintenance", contextRef: "context:recurring-problem" });
  const correction = PermittedCorrectionEvidence.fromProblem(problem, { permissionRef: "permission:external-change-decision", correctionRef: "proposal:correction-42", decidedAt: "2026-08-22T16:13:00.000Z", decidedByRef: "actor:change-authority", evidenceRefs: ["evidence:approval-42"] });
  const resolution = ResolutionEvidence.fromProblem(problem, { correctionEvidenceId: correction.correctionEvidenceId, causeRef: "cause:confirmed-problem", resolutionRef: "resolution:recorded-correction", evidenceRefs: ["evidence:verification-42"], resolvedAt: "2026-08-22T16:14:00.000Z", resolvedByRef: "actor:resolver" });
  assert.equal(intake.sourceKind, "human_request");
  assert.equal(triage.classification, "Maintenance");
  assert.equal(resolution.subjectKind, "ProblemRecord");
  assert.equal((resolution as { correctionEvidenceId?: string }).correctionEvidenceId, correction.correctionEvidenceId);
  assert.deepEqual(ResolutionEvidence.fromJson(ResolutionEvidence.toJson(resolution)), resolution);
});

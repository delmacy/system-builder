import assert from "node:assert/strict";
import test from "node:test";
import { PermittedCorrectionEvidence, ProblemRecord, ResolutionEvidence, SupportCaseRecord, SupportTriageDecision } from "../../packages/support-evolution/index.js";

function triage(classification: "Support" | "Maintenance") {
  return SupportTriageDecision.create({ intakeId: `sha256:${"c".repeat(64)}`, classification, decidedAt: "2026-08-22T15:40:00.000Z", decidedByRef: "actor:triage", reasonRef: "reason:explicit", impactRef: "impact:known", criticalityRef: "criticality:known", slaRef: "sla:explicit", priorityRef: "priority:explicit", contextRefs: ["context:production"] });
}

test("positive Support path reaches lossless explicit resolution", () => {
  const supportCase = SupportCaseRecord.fromTriage(triage("Support"), { openedAt: "2026-08-22T15:41:00.000Z", openedByRef: "actor:support", reasonRef: "reason:case" });
  const linked = SupportCaseRecord.withKnowledgeLinks(supportCase, ["knowledge:b", "knowledge:a", "knowledge:a"]);
  const resolution = ResolutionEvidence.fromCase(linked, { causeRef: "cause:confirmed", resolutionRef: "resolution:documented", evidenceRefs: ["evidence:verified"], resolvedAt: "2026-08-22T15:42:00.000Z", resolvedByRef: "actor:resolver" });
  assert.deepEqual(linked.knowledgeRefs, ["knowledge:a", "knowledge:b"]);
  assert.deepEqual(ResolutionEvidence.fromJson(ResolutionEvidence.toJson(resolution)), resolution);
});

test("positive Maintenance path links explicit permitted correction and resolution", () => {
  const problem = ProblemRecord.fromTriage(triage("Maintenance"), { openedAt: "2026-08-22T15:43:00.000Z", openedByRef: "actor:maintenance", contextRef: "context:problem" });
  const correction = PermittedCorrectionEvidence.fromProblem(problem, { permissionRef: "permission:external-decision", correctionRef: "proposal:correction-1", decidedAt: "2026-08-22T15:44:00.000Z", decidedByRef: "actor:authority", evidenceRefs: ["evidence:approval"] });
  const resolution = ResolutionEvidence.fromProblem(problem, { correctionEvidenceId: correction.correctionEvidenceId, causeRef: "cause:confirmed", resolutionRef: "resolution:recorded", evidenceRefs: ["evidence:verification"], resolvedAt: "2026-08-22T15:45:00.000Z", resolvedByRef: "actor:resolver" });
  assert.equal((resolution as { correctionEvidenceId?: string }).correctionEvidenceId, correction.correctionEvidenceId);
  assert.deepEqual(ResolutionEvidence.fromJson(ResolutionEvidence.toJson(resolution)), resolution);
});

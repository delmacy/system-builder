import assert from "node:assert/strict";
import test from "node:test";
import { PermittedCorrectionEvidence, ProblemRecord, ResolutionEvidence, SupportCaseRecord } from "../../packages/support-evolution/index.js";

test("ResolutionEvidence records explicit deterministic support resolution", () => {
  const supportCase = SupportCaseRecord.create({ triageId: `sha256:${"a".repeat(64)}`, openedAt: "2026-08-22T15:10:00.000Z", openedByRef: "actor:support", reasonRef: "reason:incident", knowledgeRefs: ["knowledge:runbook"] });
  const fields = { causeRef: "cause:confirmed", resolutionRef: "resolution:documented", evidenceRefs: ["evidence:b", "evidence:a"], resolvedAt: "2026-08-22T15:20:00.000Z", resolvedByRef: "actor:resolver" };
  const left = ResolutionEvidence.fromCase(supportCase, fields);
  const right = ResolutionEvidence.fromCase(supportCase, { ...fields, evidenceRefs: ["evidence:a", "evidence:b"] });
  assert.equal(left.resolutionEvidenceId, right.resolutionEvidenceId);
  assert.equal(left.subjectKind, "SupportCaseRecord");
  assert.deepEqual(ResolutionEvidence.fromJson(ResolutionEvidence.toJson(left)), left);
});

test("ResolutionEvidence links maintenance correction by reference only", () => {
  const problem = ProblemRecord.create({ triageId: `sha256:${"b".repeat(64)}`, openedAt: "2026-08-22T15:11:00.000Z", openedByRef: "actor:maintenance", contextRef: "context:problem" });
  const correction = PermittedCorrectionEvidence.fromProblem(problem, { permissionRef: "permission:external", correctionRef: "proposal:fix", decidedAt: "2026-08-22T15:12:00.000Z", decidedByRef: "actor:authority", evidenceRefs: ["evidence:permission"] });
  const resolution = ResolutionEvidence.fromProblem(problem, { correctionEvidenceId: correction.correctionEvidenceId, causeRef: "cause:confirmed", resolutionRef: "resolution:recorded", evidenceRefs: ["evidence:verification"], resolvedAt: "2026-08-22T15:21:00.000Z", resolvedByRef: "actor:resolver" });
  assert.equal(resolution.subjectKind, "ProblemRecord");
  assert.equal(resolution.correctionEvidenceId, correction.correctionEvidenceId);
  assert.equal("execute" in ResolutionEvidence, false);
});

test("ResolutionEvidence fails closed for mixed or missing subjects", () => {
  const invalid = ResolutionEvidence.create({ subjectKind: "SupportCaseRecord", subjectId: "case:1", causeRef: "cause:x", resolutionRef: "resolution:x", evidenceRefs: ["evidence:x"], resolvedAt: "2026-08-22T15:22:00.000Z", resolvedByRef: "actor:x" });
  assert.throws(() => ResolutionEvidence.validate({ ...invalid, correctionEvidenceId: "correction:unexpected" }), /MIXED_SUBJECT|RESOLUTION_EVIDENCE_ID/);
  assert.throws(() => ResolutionEvidence.validate({ ...invalid, subjectId: "" }), /MALFORMED:subjectId/);
});

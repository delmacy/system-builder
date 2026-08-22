import assert from "node:assert/strict";
import test from "node:test";
import { PermittedCorrectionEvidence, ProblemRecord, ResolutionEvidence, SupportCaseRecord } from "../../packages/support-evolution/index.js";

const secret = "password=super-secret-value";

test("Sprint 3 durable refs reject representative resolved values", () => {
  assert.throws(() => SupportCaseRecord.create({ triageId: "triage:1", openedAt: "2026-08-22T15:30:00.000Z", openedByRef: secret, reasonRef: "reason:x" }), /RESOLVED_VALUE:openedByRef/);
  assert.throws(() => ProblemRecord.create({ triageId: "triage:2", openedAt: "2026-08-22T15:31:00.000Z", openedByRef: "actor:maintenance", contextRef: "authorization=Bearer abcdef" }), /RESOLVED_VALUE:contextRef/);
  const problem = ProblemRecord.create({ triageId: "triage:3", openedAt: "2026-08-22T15:32:00.000Z", openedByRef: "actor:maintenance", contextRef: "context:stable" });
  assert.throws(() => PermittedCorrectionEvidence.fromProblem(problem, { permissionRef: secret, correctionRef: "proposal:fix", decidedAt: "2026-08-22T15:33:00.000Z", decidedByRef: "actor:authority", evidenceRefs: ["evidence:x"] }), /RESOLVED_VALUE:permissionRef/);
  assert.throws(() => ResolutionEvidence.fromProblem(problem, { causeRef: "cause:x", resolutionRef: secret, evidenceRefs: ["evidence:x"], resolvedAt: "2026-08-22T15:34:00.000Z", resolvedByRef: "actor:resolver" }), /RESOLVED_VALUE:resolutionRef/);
});

test("stable opaque references remain valid", () => {
  const supportCase = SupportCaseRecord.create({ triageId: "triage:stable", openedAt: "2026-08-22T15:35:00.000Z", openedByRef: "actor:support", reasonRef: "reason:explicit", knowledgeRefs: ["knowledge:runbook"] });
  const resolution = ResolutionEvidence.fromCase(supportCase, { causeRef: "cause:incident-42", resolutionRef: "resolution:change-42", evidenceRefs: ["evidence:verification-42"], resolvedAt: "2026-08-22T15:36:00.000Z", resolvedByRef: "actor:resolver" });
  assert.match(resolution.resolutionEvidenceId, /^sha256:[a-f0-9]{64}$/);
});

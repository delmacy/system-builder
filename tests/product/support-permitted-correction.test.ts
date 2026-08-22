import assert from "node:assert/strict";
import test from "node:test";
import { PermittedCorrectionEvidence, ProblemRecord } from "../../packages/support-evolution/index.js";

test("permitted correction evidence is explicit deterministic record-only evidence", () => {
  const problem = ProblemRecord.create({ triageId: `sha256:${"2".repeat(64)}`, openedAt: "2026-08-22T15:00:00.000Z", openedByRef: "actor:maintenance", contextRef: "context:problem" });
  const fields = { permissionRef: "permission:change-42", correctionRef: "proposal:fix-42", decidedAt: "2026-08-22T15:01:00.000Z", decidedByRef: "actor:change-authority", evidenceRefs: ["evidence:review-b", "evidence:review-a"] };
  const left = PermittedCorrectionEvidence.fromProblem(problem, fields);
  const right = PermittedCorrectionEvidence.fromProblem(problem, { ...fields, evidenceRefs: ["evidence:review-a", "evidence:review-b"] });
  assert.equal(left.correctionEvidenceId, right.correctionEvidenceId);
  assert.equal(left.problemId, problem.problemId);
  assert.deepEqual(left.evidenceRefs, ["evidence:review-a", "evidence:review-b"]);
  assert.equal("execute" in PermittedCorrectionEvidence, false);
});

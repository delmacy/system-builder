import assert from "node:assert/strict";
import test from "node:test";
import { PermittedCorrectionEvidence, ProblemRecord, ResolutionEvidence, SupportCaseRecord, SupportTriageDecision } from "../../packages/support-evolution/index.js";

function triage(classification: "Support" | "Maintenance" | "Evolution") {
  return SupportTriageDecision.create({ intakeId: `sha256:${"d".repeat(64)}`, classification, decidedAt: "2026-08-22T15:50:00.000Z", decidedByRef: "actor:triage", reasonRef: "reason:explicit", impactRef: "impact:known", criticalityRef: "criticality:known", slaRef: "sla:explicit", priorityRef: "priority:explicit", contextRefs: ["context:production"] });
}

test("classification boundaries reject silent cross-path construction", () => {
  assert.throws(() => ProblemRecord.fromTriage(triage("Support"), { openedAt: "2026-08-22T15:51:00.000Z", openedByRef: "actor:m", contextRef: "context:x" }), /CLASSIFICATION:Support/);
  assert.throws(() => SupportCaseRecord.fromTriage(triage("Maintenance"), { openedAt: "2026-08-22T15:51:00.000Z", openedByRef: "actor:s", reasonRef: "reason:x" }), /CLASSIFICATION:Maintenance/);
  assert.throws(() => SupportCaseRecord.fromTriage(triage("Evolution"), { openedAt: "2026-08-22T15:51:00.000Z", openedByRef: "actor:s", reasonRef: "reason:x" }), /CLASSIFICATION:Evolution/);
  assert.throws(() => ProblemRecord.fromTriage(triage("Evolution"), { openedAt: "2026-08-22T15:51:00.000Z", openedByRef: "actor:m", contextRef: "context:x" }), /CLASSIFICATION:Evolution/);
});

test("absence of permission evidence is not permitted correction evidence", () => {
  const problem = ProblemRecord.fromTriage(triage("Maintenance"), { openedAt: "2026-08-22T15:52:00.000Z", openedByRef: "actor:m", contextRef: "context:x" });
  assert.throws(() => PermittedCorrectionEvidence.fromProblem(problem, { permissionRef: "", correctionRef: "proposal:x", decidedAt: "2026-08-22T15:53:00.000Z", decidedByRef: "actor:a", evidenceRefs: ["evidence:x"] }), /MALFORMED:permissionRef/);
  const resolution = ResolutionEvidence.fromProblem(problem, { causeRef: "cause:x", resolutionRef: "resolution:record-only", evidenceRefs: ["evidence:x"], resolvedAt: "2026-08-22T15:54:00.000Z", resolvedByRef: "actor:r" });
  assert.equal("correctionEvidenceId" in resolution, false);
});

test("Sprint 3 public evidence APIs expose no remediation or production mutation operation", () => {
  for (const api of [SupportCaseRecord, ProblemRecord, PermittedCorrectionEvidence, ResolutionEvidence]) {
    assert.equal("execute" in api, false);
    assert.equal("remediate" in api, false);
    assert.equal("deploy" in api, false);
    assert.equal("mutateProduction" in api, false);
  }
});

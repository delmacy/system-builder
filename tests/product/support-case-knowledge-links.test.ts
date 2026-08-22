import assert from "node:assert/strict";
import test from "node:test";
import { SupportCaseRecord } from "../../packages/support-evolution/index.js";

const base = SupportCaseRecord.create({
  triageId: `sha256:${"d".repeat(64)}`,
  openedAt: "2026-08-22T14:45:00.000Z",
  openedByRef: "actor:support-operator",
  reasonRef: "reason:case-opened",
});

test("support case knowledge links are explicit canonical references", () => {
  const left = SupportCaseRecord.withKnowledgeLinks(base, ["knowledge:runbook-b", "knowledge:runbook-a", "knowledge:runbook-a"]);
  const right = SupportCaseRecord.withKnowledgeLinks(base, ["knowledge:runbook-a", "knowledge:runbook-b"]);
  assert.deepEqual(left.knowledgeRefs, ["knowledge:runbook-a", "knowledge:runbook-b"]);
  assert.equal(left.caseId, right.caseId);
  assert.throws(() => SupportCaseRecord.withKnowledgeLinks(base, []), /SUPPORT_CASE:MALFORMED:knowledgeRefs/);
  assert.throws(() => SupportCaseRecord.withKnowledgeLinks(base, ["token=resolved-secret-value"]), /SUPPORT_CASE:RESOLVED_VALUE:knowledgeRefs/);
});

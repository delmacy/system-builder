import assert from "node:assert/strict";
import test from "node:test";
import { SupportCaseRecord } from "../../packages/support-evolution/index.js";

const fields = {
  triageId: `sha256:${"b".repeat(64)}`,
  openedAt: "2026-08-22T14:35:00.000Z",
  openedByRef: "actor:support-operator",
  reasonRef: "reason:case-opened",
};

test("SupportCaseRecord validation fails closed for malformed, unknown and mismatched identity", () => {
  const record = SupportCaseRecord.create(fields);
  assert.deepEqual(SupportCaseRecord.validate(record), record);
  assert.throws(() => SupportCaseRecord.validate({ ...record, extra: true }), /SUPPORT_CASE:UNKNOWN_FIELD:extra/);
  assert.throws(() => SupportCaseRecord.validate({ ...record, openedAt: "" }), /SUPPORT_CASE:MALFORMED:openedAt/);
  assert.throws(() => SupportCaseRecord.validate({ ...record, caseId: `sha256:${"0".repeat(64)}` }), /SUPPORT_CASE:CASE_ID/);
});

import assert from "node:assert/strict";
import test from "node:test";
import { SupportCaseRecord } from "../../packages/support-evolution/index.js";

test("SupportCaseRecord JSON round-trip is lossless and preserves identity", () => {
  const record = SupportCaseRecord.create({
    triageId: `sha256:${"c".repeat(64)}`,
    openedAt: "2026-08-22T14:36:00.000Z",
    openedByRef: "actor:support-operator",
    reasonRef: "reason:case-opened",
  });
  const restored = SupportCaseRecord.fromJson(SupportCaseRecord.toJson(record));
  assert.deepEqual(restored, record);
  assert.equal(restored.caseId, record.caseId);
  assert.throws(() => SupportCaseRecord.fromJson("{"), /SUPPORT_CASE:JSON/);
});

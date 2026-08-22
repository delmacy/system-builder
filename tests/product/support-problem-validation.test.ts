import assert from "node:assert/strict";
import test from "node:test";
import { ProblemRecord } from "../../packages/support-evolution/index.js";
const fields = { triageId: `sha256:${"f".repeat(64)}`, openedAt: "2026-08-22T14:55:00.000Z", openedByRef: "actor:maintenance", contextRef: "context:problem" };
test("ProblemRecord validation fails closed", () => { const record = ProblemRecord.create(fields); assert.deepEqual(ProblemRecord.validate(record), record); assert.throws(() => ProblemRecord.validate({ ...record, extra: true }), /SUPPORT_PROBLEM:UNKNOWN_FIELD:extra/); assert.throws(() => ProblemRecord.validate({ ...record, contextRef: "" }), /SUPPORT_PROBLEM:MALFORMED:contextRef/); assert.throws(() => ProblemRecord.validate({ ...record, problemId: `sha256:${"0".repeat(64)}` }), /SUPPORT_PROBLEM:PROBLEM_ID/); });

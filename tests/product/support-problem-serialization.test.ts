import assert from "node:assert/strict";
import test from "node:test";
import { ProblemRecord } from "../../packages/support-evolution/index.js";
test("ProblemRecord JSON round-trip preserves identity", () => { const record = ProblemRecord.create({ triageId: `sha256:${"1".repeat(64)}`, openedAt: "2026-08-22T14:56:00.000Z", openedByRef: "actor:maintenance", contextRef: "context:problem" }); assert.deepEqual(ProblemRecord.fromJson(ProblemRecord.toJson(record)), record); assert.throws(() => ProblemRecord.fromJson("{"), /SUPPORT_PROBLEM:JSON/); });

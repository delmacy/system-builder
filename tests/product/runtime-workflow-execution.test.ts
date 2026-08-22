import assert from "node:assert/strict";
import test from "node:test";
import { planRuntimeWorkflowTransition } from "../../packages/runtime-core/workflow-execution.js";

const processes = [{
  id: "process:ticket",
  states: ["open", "closed"],
  initialState: "open",
  transitions: [{ id: "transition:close", from: "open", to: "closed", actionRef: "action:close" }],
}] as const;

test("workflow starts only from explicit initialState and plans declared transition", () => {
  assert.deepEqual(planRuntimeWorkflowTransition(processes, "process:ticket", "transition:close", undefined), {
    ok: true, processId: "process:ticket", transitionId: "transition:close", from: "open", to: "closed", actionRef: "action:close",
  });
});

test("invalid workflow transition fails without producing a mutation plan", () => {
  assert.deepEqual(planRuntimeWorkflowTransition(processes, "process:ticket", "transition:close", "closed"), {
    ok: false, code: "RUNTIME_WORKFLOW_INVALID_TRANSITION", detail: "process:ticket:closed:transition:close",
  });
  assert.deepEqual(planRuntimeWorkflowTransition(processes, "process:missing", "transition:close", undefined), {
    ok: false, code: "RUNTIME_WORKFLOW_UNKNOWN_PROCESS", detail: "process:missing",
  });
});

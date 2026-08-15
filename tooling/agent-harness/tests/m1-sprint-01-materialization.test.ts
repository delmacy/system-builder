import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import { humanApprovalPolicySchema } from "../src/human-approval.js";
import { supervisorRuntimePlanSchema } from "../src/supervisor-runtime.js";

const root = process.cwd();
const scopeId = "M1-SPRINT-01";
const taskIds = ["TASK-004", "TASK-005", "TASK-006"];
const workPackages = ["WP-FH-02", "WP-FH-03", "WP-FH-04"];

function json(path: string): unknown {
  return JSON.parse(readFileSync(resolve(root, path), "utf8"));
}

describe("M1-SPRINT-01 materialization", () => {
  it("binds the exact three-task architecture scope to the supervisor plan", () => {
    const policy = humanApprovalPolicySchema.parse(json("tooling/agent-harness/policies/HUMAN_APPROVAL.json"));
    const plan = supervisorRuntimePlanSchema.parse(json("project_docs/execution_planning/M1-SPRINT-01.plan.json"));
    const scope = policy.development_authority_scopes.find((candidate) => candidate.scope_id === scopeId);

    assert.ok(scope);
    assert.equal(scope.scope_type, "SPRINT");
    assert.deepEqual(scope.task_ids, taskIds);
    assert.equal(scope.risk_ceiling, "medium");
    assert.equal(scope.allow_architecture, true);
    assert.equal(scope.base_ref, "main");
    assert.deepEqual(scope.allowed_executors, ["opencode"]);
    assert.deepEqual(scope.allowed_model_tiers, ["architecture"]);
    assert.equal(scope.allow_executor_override, true);
    assert.ok(Date.parse(scope.valid_from) < Date.parse(scope.expires_at));

    assert.deepEqual(plan.pipeline.milestones, ["M1"]);
    assert.deepEqual(plan.pipeline.ordered_task_ids, taskIds);

    taskIds.forEach((taskId, index) => {
      const execution = plan.execution[taskId];
      assert.ok(execution);
      assert.equal(execution.work_package_id, workPackages[index]);
      assert.deepEqual(execution.route, {
        risk: "MEDIUM",
        model_tier: "T3",
        executor: "opencode",
        model: null,
        architecture_impact: true,
        authority_ref: `DEVSCOPE:${scopeId}`,
        decision: "SELECTED",
        rationale_code: "PREAUTHORIZED_ARCHITECTURE",
      });
      assert.deepEqual(execution.model_selector, {
        free: true,
        name_contains: null,
        preference: ["deepseek", "mimo", "nemotron"],
      });
    });
  });

  it("does not authorize a fourth task or a high-risk automatic route", () => {
    const policy = humanApprovalPolicySchema.parse(json("tooling/agent-harness/policies/HUMAN_APPROVAL.json"));
    const scope = policy.development_authority_scopes.find((candidate) => candidate.scope_id === scopeId);
    assert.ok(scope);
    assert.equal(scope.task_ids.includes("TASK-007"), false);
    assert.notEqual(scope.risk_ceiling, "high");
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildTaskPack, taskPackManifestSchema } from "../src/task-pack.js";
import type { Task } from "../src/task.js";
import { selectedRoute } from "./fixtures/execution-contracts.js";

describe("AgentFactory Task Pack builder", () => {
  it("produces byte-identical content and manifests for identical pinned inputs", () => {
    const input = buildInput();
    const first = buildTaskPack(input);
    const second = buildTaskPack(structuredClone(input));
    assert.deepEqual(first, second);
    assert.equal(taskPackManifestSchema.safeParse(first.manifest).success, true);
    assert.match(first.content, /execution_result_schema_version: 1/);
    assert.match(first.content, /allowed_paths/);
    assert.match(first.content, /stop_conditions/);
  });

  it("rejects missing, blocked or unrelated readiness evidence", () => {
    const input = buildInput();
    assert.throws(() => buildTaskPack({ ...input, readiness: { id: "WP-I1-99", readiness: "READY", blockers: [] } }), /does not identify/);
    assert.throws(() => buildTaskPack({
      ...input,
      readiness: {
        id: "WP-I1-03",
        readiness: "BLOCKED",
        blockers: [{
          code: "GATE_UNSATISFIED", gate_id: "GATE-01-03", predecessor_id: "WP-I1-01",
          gate_type: "REQUIRES", message: "blocked",
        }],
      },
    }), /not dependency-ready/);
  });

  it("fails closed when the TaskRecord diverges from repository scope or validation", () => {
    const input = buildInput();
    assert.throws(() => buildTaskPack({
      ...input,
      record: { ...input.record, allowed_paths: ["apps/**"] },
    }), /allowed paths does not match/);
    assert.throws(() => buildTaskPack({
      ...input,
      record: { ...input.record, validation_commands: ["npm run weaker-check"] },
    }), /validation commands does not match/);
  });

  it("rejects undeclared, duplicate, unsafe and oversized context", () => {
    const input = buildInput();
    assert.throws(() => buildTaskPack({ ...input, context: [] }), /each declared context path exactly once/);
    assert.throws(() => buildTaskPack({
      ...input,
      record: { ...input.record, context_paths: ["../outside.md"] },
      task: makeTask({ context_paths: ["../outside.md"] }),
      context: [{ path: "../outside.md", contents: "unsafe" }],
    }));
    assert.throws(() => buildTaskPack({
      ...input,
      context: [{ path: "AGENTS.md", contents: "x".repeat(300_001) }],
    }), /exceeds 300000 bytes/);
  });
});

function buildInput() {
  const task = makeTask();
  return {
    record: {
      schema_version: 1 as const,
      task_id: task.metadata.id,
      work_package_id: "WP-I1-03",
      milestone: task.metadata.milestone,
      title: task.metadata.title,
      state: "READY" as const,
      route: selectedRoute,
      dependency_gates: [],
      context_paths: task.metadata.context_paths,
      allowed_paths: task.metadata.allowed_paths,
      forbidden_paths: task.metadata.forbidden_paths,
      max_files: task.metadata.max_files,
      validation_commands: task.metadata.validation,
      acceptance_ids: ["AC-TASK-PACK"],
    },
    task,
    taskFile: "specs/tasks/TASK-015-AGENTFACTORY-TASK-PACK-BUILDER.md",
    readiness: { id: "WP-I1-03", readiness: "READY" as const, blockers: [] },
    sourceCommit: "fd6c058fed1eee0a71d009e0b81098d34f5a9a28",
    context: [{ path: "AGENTS.md", contents: "authoritative instructions\n" }],
    stopConditions: ["Stop on scope mismatch"],
  };
}

function makeTask(overrides: Partial<Task["metadata"]> = {}): Task {
  const metadata: Task["metadata"] = {
    id: "TASK-015",
    title: "Implement the AgentFactory Task Pack builder",
    status: "ready",
    priority: 39,
    milestone: "I1",
    model_tier: "cheap",
    risk: "medium",
    architecture_impact: false,
    executor_preference: "codex",
    depends_on: ["TASK-012", "TASK-014"],
    context_paths: ["AGENTS.md"],
    allowed_paths: ["tooling/agent-harness/src/task-pack.ts"],
    forbidden_paths: ["packages/**"],
    max_files: 10,
    validation: ["npm run verify"],
    ...overrides,
  };
  return { file: "specs/tasks/TASK-015.md", metadata, source: "task source", body: "task body" };
}

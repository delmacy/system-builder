import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadTasks, readyTasks, taskMetadataSchema, validateTaskCatalog } from "../src/task.js";

describe("task catalog", () => {
  it("loads a unique acyclic catalog", () => {
    const tasks = loadTasks();
    assert.doesNotThrow(() => validateTaskCatalog(tasks));
    assert.ok(tasks.some((task) => task.metadata.id === "TASK-001"));
  });

  it("selects only ready tasks with completed dependencies", () => {
    const tasks = loadTasks();
    const completed = new Set(
      tasks.filter((task) => task.metadata.status === "completed").map((task) => task.metadata.id),
    );
    const ready = readyTasks(tasks);
    assert.ok(ready.length > 0);
    assert.ok(ready.every((task) => task.metadata.depends_on.every((dependency) => completed.has(dependency))));
    assert.deepEqual(
      ready.map((task) => task.metadata.priority),
      ready.map((task) => task.metadata.priority).toSorted((a, b) => a - b),
    );
  });

  it("gives TASK-009 its architecture ADR and the complete repository gate", () => {
    const task = loadTasks().find((candidate) => candidate.metadata.id === "TASK-009");
    assert.ok(task);
    assert.ok(task.metadata.context_paths.includes("docs/adr/ADR-0008-local-task-orchestrator.md"));
    assert.deepEqual(task.metadata.validation, ["npm run verify"]);
  });

  it("accepts only an exact optional package descriptor binding", () => {
    const base = loadTasks().find((candidate) => candidate.metadata.id === "TASK-004")!.metadata;
    const binding = {
      package_id: "PKG-I2-001", package_version: "1.0.0", plan_hash: "a".repeat(64), descriptor_id: "PWD-001",
      objective_id: "process-mirror-contract", output_ids: ["contract"], governance_classes: ["ROUTINE"],
      dor_ids: ["DOR-READY"], dod_ids: ["DOD-VERIFIED"],
    };
    assert.equal(taskMetadataSchema.safeParse({ ...base, package_authorization: binding }).success, true);
    assert.equal(taskMetadataSchema.safeParse({ ...base, package_authorization: { ...binding, plan_hash: "bad" } }).success, false);
    assert.equal(taskMetadataSchema.safeParse({ ...base, package_authorization: { ...binding, unknown: true } }).success, false);
  });
});

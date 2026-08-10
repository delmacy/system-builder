import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadTasks, readyTasks, validateTaskCatalog } from "../src/task.js";

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
});

import assert from "node:assert/strict";
import test from "node:test";
import { resolveRuntimeAction } from "../../packages/runtime-core/action-execution.js";

const entities = [{ id: "entity:ticket" }];
const actions = [
  { id: "action:update", effect: { kind: "entity.update" as const, entityRef: "entity:ticket" } },
  { id: "action:declarative-only" },
];

test("action resolution uses only explicit declared effect and target", () => {
  assert.deepEqual(resolveRuntimeAction(actions, entities, "action:update"), {
    ok: true,
    action: actions[0],
    entity: entities[0],
  });
  assert.deepEqual(resolveRuntimeAction(actions, entities, "action:missing"), { ok: false, code: "RUNTIME_ACTION_UNKNOWN", detail: "action:missing" });
  assert.deepEqual(resolveRuntimeAction(actions, entities, "action:declarative-only"), { ok: false, code: "RUNTIME_ACTION_UNSUPPORTED", detail: "action:declarative-only" });
  assert.deepEqual(resolveRuntimeAction([{ id: "action:bad", effect: { kind: "entity.delete", entityRef: "entity:missing" } }], entities, "action:bad"), { ok: false, code: "RUNTIME_ACTION_INVALID_TARGET", detail: "entity:missing" });
});

import assert from "node:assert/strict";
import test from "node:test";
import { STATION_EDITOR_APP } from "../../apps/station/web/app/station-editor-app.js";
import { M1_UTILITY_APPS, StationAppRegistry } from "../../packages/station-app-runtime/index.js";
import { createWindowRuntimeState, reduceWindowRuntime } from "../../packages/station-windowing/index.js";

test("TASK-648 Station editor is an ordinary normalized singleton app and window", () => {
  const existing = M1_UTILITY_APPS.map(app => app.id);
  const registry = new StationAppRegistry([...M1_UTILITY_APPS, STATION_EDITOR_APP]);
  assert.deepEqual(M1_UTILITY_APPS.map(app => app.id), existing);
  assert.equal(registry.get("app:composition-editor")?.name, "Composition Editor");
  const launch = registry.launch("app:composition-editor");
  assert.equal(launch.windowDefinitions.length, 1);
  assert.equal(launch.windowDefinitions[0]?.id, "composition-editor");
  assert.equal(launch.windowDefinitions[0]?.appRef, launch.appRef);
  const state = createWindowRuntimeState(registry.list().flatMap(app => registry.launch(app.id).windowDefinitions), { width: 1280, height: 800 });
  const opened = reduceWindowRuntime(state, { type: "OPEN", definitionRef: "composition-editor" });
  assert.equal(opened.instances.length, 1);
  assert.equal(reduceWindowRuntime(opened, { type: "OPEN", definitionRef: "composition-editor" }).instances.length, 1);
});
test("TASK-648 unknown app is rejected without mutating registered manifests", () => {
  const registry = new StationAppRegistry([...M1_UTILITY_APPS, STATION_EDITOR_APP]);
  const before = registry.list();
  assert.throws(() => registry.launch("app:unknown"), /unknown app manifest/);
  assert.deepEqual(registry.list(), before);
});

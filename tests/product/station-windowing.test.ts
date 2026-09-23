import assert from "node:assert/strict";
import test from "node:test";

import {
  PresentationCommandRegistry,
  focusTarget,
  interactionContext,
} from "../../packages/station-interaction/index.js";
import {
  createWindowPresentationCommands,
  createWindowRuntimeState,
  normalizeGeometry,
  reduceWindowRuntime,
  type WindowDefinition,
  type WindowRuntimeState,
} from "../../packages/station-windowing/index.js";

const definitions: readonly WindowDefinition[] = [
  {
    id: "settings",
    appRef: "app:settings",
    title: "Settings",
    icon: "settings",
    defaultSize: { width: 640, height: 480 },
    minSize: { width: 360, height: 240 },
    multiInstance: false,
    resizable: true,
    commands: ["window.close", "window.minimize", "window.maximize", "window.restore"],
  },
  {
    id: "note",
    appRef: "app:note",
    title: "Note",
    icon: "shell.command",
    defaultSize: { width: 420, height: 320 },
    minSize: { width: 240, height: 160 },
    multiInstance: true,
    resizable: false,
    commands: ["window.close"],
  },
];

function initial(): WindowRuntimeState {
  return createWindowRuntimeState(definitions, { width: 1440, height: 900 });
}

test("singleton windows reopen the existing presentation instance", () => {
  let state = reduceWindowRuntime(initial(), {
    type: "OPEN",
    definitionRef: "settings",
  });
  const firstRef = state.instances[0]!.windowRef;

  state = reduceWindowRuntime(state, { type: "CLOSE", windowRef: firstRef });
  assert.equal(state.instances[0]!.lifecycle, "CLOSED");

  state = reduceWindowRuntime(state, {
    type: "OPEN",
    definitionRef: "settings",
  });

  assert.equal(state.instances.length, 1);
  assert.equal(state.instances[0]!.windowRef, firstRef);
  assert.equal(state.instances[0]!.lifecycle, "OPEN");
  assert.equal(state.activeWindowRef, firstRef);
});

test("multi-instance definitions create deterministic unique window refs", () => {
  let state = reduceWindowRuntime(initial(), {
    type: "OPEN",
    definitionRef: "note",
  });
  state = reduceWindowRuntime(state, {
    type: "OPEN",
    definitionRef: "note",
  });

  assert.deepEqual(
    state.instances.map((instance) => instance.windowRef),
    ["window:note:1", "window:note:2"],
  );
  assert.equal(state.activeWindowRef, "window:note:2");
  assert.equal(state.instances[0]!.focused, false);
  assert.equal(state.instances[1]!.focused, true);
});

test("focus z-order and minimize fallback are deterministic", () => {
  let state = reduceWindowRuntime(initial(), {
    type: "OPEN",
    definitionRef: "note",
  });
  state = reduceWindowRuntime(state, {
    type: "OPEN",
    definitionRef: "settings",
  });

  const noteRef = state.instances[0]!.windowRef;
  const settingsRef = state.instances[1]!.windowRef;

  state = reduceWindowRuntime(state, { type: "FOCUS", windowRef: noteRef });
  assert.equal(state.activeWindowRef, noteRef);
  assert.ok(
    state.instances[0]!.zOrder > state.instances[1]!.zOrder,
  );

  state = reduceWindowRuntime(state, { type: "MINIMIZE", windowRef: noteRef });
  assert.equal(state.activeWindowRef, settingsRef);
  assert.equal(state.instances[0]!.lifecycle, "MINIMIZED");
  assert.equal(state.instances[1]!.focused, true);
});

test("geometry is normalized into desktop bounds and minimum size", () => {
  const geometry = normalizeGeometry(
    { x: -50, y: 9999, width: -1, height: Number.POSITIVE_INFINITY },
    { width: 800, height: 600 },
    { width: 320, height: 200 },
    { x: 10, y: 10, width: 500, height: 400 },
  );

  assert.deepEqual(geometry, {
    x: 0,
    y: 200,
    width: 500,
    height: 400,
  });
});

test("desktop bounds updates keep windows flush with the measured workspace", () => {
  let state = reduceWindowRuntime(initial(), {
    type: "OPEN",
    definitionRef: "settings",
    geometry: { x: 900, y: 650, width: 500, height: 300 },
  });
  const ref = state.instances[0]!.windowRef;

  state = reduceWindowRuntime(state, {
    type: "SET_BOUNDS",
    bounds: { width: 1000, height: 700 },
  });

  assert.deepEqual(state.bounds, { width: 1000, height: 700 });
  assert.deepEqual(state.instances[0]!.geometry, {
    x: 500,
    y: 400,
    width: 500,
    height: 300,
  });

  state = reduceWindowRuntime(state, { type: "MAXIMIZE", windowRef: ref });
  assert.deepEqual(state.instances[0]!.geometry, {
    x: 0,
    y: 0,
    width: 1000,
    height: 700,
  });

  state = reduceWindowRuntime(state, {
    type: "SET_BOUNDS",
    bounds: { width: 1366, height: 768 },
  });
  assert.deepEqual(state.instances[0]!.geometry, {
    x: 0,
    y: 0,
    width: 1366,
    height: 768,
  });
});

test("maximize snap restore and non-resizable movement preserve presentation semantics", () => {
  let state = reduceWindowRuntime(initial(), {
    type: "OPEN",
    definitionRef: "settings",
    geometry: { x: 100, y: 80, width: 600, height: 420 },
  });
  const settingsRef = state.instances[0]!.windowRef;
  const original = state.instances[0]!.geometry;

  state = reduceWindowRuntime(state, { type: "MAXIMIZE", windowRef: settingsRef });
  assert.equal(state.instances[0]!.mode, "MAXIMIZED");
  assert.deepEqual(state.instances[0]!.geometry, { x: 0, y: 0, width: 1440, height: 900 });

  state = reduceWindowRuntime(state, { type: "RESTORE", windowRef: settingsRef });
  assert.equal(state.instances[0]!.mode, "NORMAL");
  assert.deepEqual(state.instances[0]!.geometry, original);

  state = reduceWindowRuntime(state, { type: "SNAP", windowRef: settingsRef, snap: "LEFT" });
  assert.equal(state.instances[0]!.mode, "SNAPPED");
  assert.equal(state.instances[0]!.geometry.x, 0);

  state = reduceWindowRuntime(state, { type: "RESTORE", windowRef: settingsRef });
  assert.deepEqual(state.instances[0]!.geometry, original);

  let noteState = reduceWindowRuntime(initial(), { type: "OPEN", definitionRef: "note" });
  const noteRef = noteState.instances[0]!.windowRef;
  const before = noteState.instances[0]!.geometry;
  noteState = reduceWindowRuntime(noteState, {
    type: "SET_GEOMETRY",
    windowRef: noteRef,
    geometry: { x: 200, y: 150, width: 900, height: 700 },
  });
  assert.equal(noteState.instances[0]!.geometry.x, 200);
  assert.equal(noteState.instances[0]!.geometry.y, 150);
  assert.equal(noteState.instances[0]!.geometry.width, before.width);
  assert.equal(noteState.instances[0]!.geometry.height, before.height);
});

test("closing a window only changes Station presentation lifecycle", () => {
  let state = reduceWindowRuntime(initial(), {
    type: "OPEN",
    definitionRef: "settings",
    presentationPayload: { resourceRef: "system:erp" },
  });
  const ref = state.instances[0]!.windowRef;

  state = reduceWindowRuntime(state, { type: "CLOSE", windowRef: ref });

  assert.equal(state.instances[0]!.lifecycle, "CLOSED");
  assert.deepEqual(state.instances[0]!.presentationPayload, {
    resourceRef: "system:erp",
  });
  assert.equal("moduleState" in state.instances[0]!, false);
  assert.equal("deploymentState" in state.instances[0]!, false);
  assert.equal("runtimeState" in state.instances[0]!, false);
});

test("window commands execute through presentation command registry only", async () => {
  let state = reduceWindowRuntime(initial(), {
    type: "OPEN",
    definitionRef: "settings",
  });
  const windowRef = state.instances[0]!.windowRef;

  const registry = new PresentationCommandRegistry();
  for (const command of createWindowPresentationCommands((action) => {
    state = reduceWindowRuntime(state, action);
  })) {
    registry.register(command);
  }

  const context = interactionContext({
    focus: focusTarget("window", windowRef),
  });

  await registry.invoke("window.minimize", context);
  assert.equal(state.instances[0]!.lifecycle, "MINIMIZED");

  await registry.invoke("window.restore", context);
  assert.equal(state.instances[0]!.lifecycle, "OPEN");

  await registry.invoke("window.close", context);
  assert.equal(state.instances[0]!.lifecycle, "CLOSED");
});

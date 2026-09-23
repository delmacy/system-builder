import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  WindowFrame,
  beginMove,
  beginResize,
  createWindowRuntimeState,
  projectPointerGeometry,
  reduceWindowRuntime,
  type WindowAction,
  type WindowDefinition,
} from "../../packages/station-windowing/index.js";

const definition: WindowDefinition = {
  id: "settings",
  appRef: "app:settings",
  title: "Settings",
  icon: "settings",
  defaultSize: { width: 640, height: 480 },
  minSize: { width: 360, height: 240 },
  multiInstance: false,
  resizable: true,
  commands: ["window.close", "window.minimize", "window.maximize"],
};

test("pointer adapter projects bounded move and resize geometry without canonical mutation", () => {
  const bounds = { width: 1000, height: 700 };
  const start = { x: 100, y: 80, width: 500, height: 320 };

  const moved = projectPointerGeometry(
    beginMove({ x: 10, y: 20 }, start),
    { x: 910, y: 690 },
    bounds,
    definition,
  );
  assert.deepEqual(moved, { x: 500, y: 380, width: 500, height: 320 });

  const resized = projectPointerGeometry(
    beginResize("SE", { x: 0, y: 0 }, start),
    { x: -999, y: -999 },
    bounds,
    definition,
  );
  assert.equal(resized.width, 360);
  assert.equal(resized.height, 240);
  assert.deepEqual(start, { x: 100, y: 80, width: 500, height: 320 });
});

test("WindowFrame renders from SB WindowInstance state and shadcn-based chrome", () => {
  let state = createWindowRuntimeState([definition], { width: 1200, height: 800 });
  state = reduceWindowRuntime(state, { type: "OPEN", definitionRef: "settings" });

  const html = renderToStaticMarkup(
    WindowFrame({
      definition,
      instance: state.instances[0]!,
      bounds: state.bounds,
      dispatch: () => undefined,
      children: "Settings body",
    }),
  );

  assert.match(html, /data-slot="window-frame"/);
  assert.match(html, /data-slot="window-titlebar"/);
  assert.match(html, /data-slot="window-controls"/);
  assert.match(html, /data-slot="window-content"/);
  assert.match(html, /data-slot="window-resize-handle"/);
  assert.match(html, /data-icon-token="settings"/);
  assert.match(html, /Settings body/);
  assert.doesNotMatch(html, /daedalos/i);
});

test("window surface contract only emits presentation WindowAction values", () => {
  const actions: WindowAction[] = [];
  let state = createWindowRuntimeState([definition], { width: 1200, height: 800 });
  state = reduceWindowRuntime(state, { type: "OPEN", definitionRef: "settings" });

  WindowFrame({
    definition,
    instance: state.instances[0]!,
    bounds: state.bounds,
    dispatch: (action) => actions.push(action),
  });

  assert.equal(actions.length, 0);
  assert.equal("canonicalState" in state.instances[0]!, false);
  assert.equal("session" in state.instances[0]!, false);
  assert.equal("process" in state.instances[0]!, false);
});

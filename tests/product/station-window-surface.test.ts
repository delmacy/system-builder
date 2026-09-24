import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
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

test("resize supports every edge and corner while preserving the opposite edge", () => {
  const bounds = { width: 1000, height: 700 };
  const start = { x: 100, y: 80, width: 500, height: 320 };

  assert.deepEqual(
    projectPointerGeometry(beginResize("W", { x: 0, y: 0 }, start), { x: 50, y: 0 }, bounds, definition),
    { x: 150, y: 80, width: 450, height: 320 },
  );
  assert.deepEqual(
    projectPointerGeometry(beginResize("N", { x: 0, y: 0 }, start), { x: 0, y: 40 }, bounds, definition),
    { x: 100, y: 120, width: 500, height: 280 },
  );
  assert.deepEqual(
    projectPointerGeometry(beginResize("E", { x: 0, y: 0 }, start), { x: 900, y: 0 }, bounds, definition),
    { x: 100, y: 80, width: 900, height: 320 },
  );
  assert.deepEqual(
    projectPointerGeometry(beginResize("S", { x: 0, y: 0 }, start), { x: 0, y: 500 }, bounds, definition),
    { x: 100, y: 80, width: 500, height: 620 },
  );
  assert.deepEqual(
    projectPointerGeometry(beginResize("NW", { x: 0, y: 0 }, start), { x: -500, y: -500 }, bounds, definition),
    { x: 0, y: 0, width: 600, height: 400 },
  );
  assert.deepEqual(
    projectPointerGeometry(beginResize("SW", { x: 0, y: 0 }, start), { x: 400, y: 500 }, bounds, definition),
    { x: 240, y: 80, width: 360, height: 620 },
  );
});

test("WindowFrame renders from SB WindowInstance state and shadcn-based chrome", () => {
  let state = createWindowRuntimeState([definition], { width: 1200, height: 800 });
  state = reduceWindowRuntime(state, { type: "OPEN", definitionRef: "settings" });

  const html = renderToStaticMarkup(
    createElement(
      WindowFrame,
      {
        definition,
        instance: state.instances[0]!,
        bounds: state.bounds,
        dispatch: () => undefined,
      },
      "Settings body",
    ),
  );

  assert.match(html, /data-slot="window-frame"/);
  assert.match(html, /flex-direction:column/);
  assert.match(html, /data-slot="window-titlebar"/);
  assert.match(html, /h-11 min-h-11/);
  assert.match(html, /data-window-focused="true"/);
  assert.match(html, /border-ring\/55/);
  assert.match(html, /ring-ring\/30/);
  assert.match(html, /shadow-2xl/);
  assert.match(html, /data-slot="window-controls"/);
  assert.match(html, /data-slot="window-content"/);
  assert.match(html, /data-slot="window-resize-handle"/);
  assert.equal((html.match(/data-resize-edge=/g) ?? []).length, 8);
  assert.match(html, /data-icon-token="settings"/);
  assert.match(html, /Settings body/);
  assert.doesNotMatch(html, /daedalos/i);
});

test("window surface contract only emits presentation WindowAction values", () => {
  const actions: WindowAction[] = [];
  let state = createWindowRuntimeState([definition], { width: 1200, height: 800 });
  state = reduceWindowRuntime(state, { type: "OPEN", definitionRef: "settings" });

  renderToStaticMarkup(
    createElement(WindowFrame, {
      definition,
      instance: state.instances[0]!,
      bounds: state.bounds,
      dispatch: (action: WindowAction) => actions.push(action),
    }),
  );

  assert.equal(actions.length, 0);
  assert.equal("canonicalState" in state.instances[0]!, false);
  assert.equal("session" in state.instances[0]!, false);
  assert.equal("process" in state.instances[0]!, false);
});

test("maximized WindowFrame removes outer radius and border", () => {
  let state = createWindowRuntimeState([definition], { width: 1200, height: 800 });
  state = reduceWindowRuntime(state, { type: "OPEN", definitionRef: "settings" });
  state = reduceWindowRuntime(state, {
    type: "MAXIMIZE",
    windowRef: state.instances[0]!.windowRef,
  });

  const html = renderToStaticMarkup(
    createElement(WindowFrame, {
      definition,
      instance: state.instances[0]!,
      bounds: state.bounds,
      dispatch: () => undefined,
    }),
  );

  assert.match(html, /rounded-none border-0 shadow-none/);
});


test("unfocused WindowFrame recedes visually without changing window content state", () => {
  let state = createWindowRuntimeState([definition], { width: 1200, height: 800 });
  state = reduceWindowRuntime(state, { type: "OPEN", definitionRef: "settings" });

  const focusedRef = state.instances[0]!.windowRef;
  state = {
    ...state,
    activeWindowRef: null,
    instances: state.instances.map((instance) =>
      instance.windowRef === focusedRef
        ? { ...instance, focused: false }
        : instance,
    ),
  };

  const html = renderToStaticMarkup(
    createElement(
      WindowFrame,
      {
        definition,
        instance: state.instances[0]!,
        bounds: state.bounds,
        dispatch: () => undefined,
      },
      "Settings body",
    ),
  );

  assert.match(html, /data-window-focused="false"/);
  assert.match(html, /border-border\/70/);
  assert.match(html, /shadow-md/);
  assert.match(html, /bg-muted\/70/);
  assert.match(html, /Settings body/);
  assert.doesNotMatch(html, /opacity-/);
});

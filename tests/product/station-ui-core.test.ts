import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Badge,
  Button,
  Input,
  Panel,
  Select,
  Toggle,
  UI_SEMANTIC_TOKENS,
  STATION_SURFACE_TOKENS,
  cssVariable,
} from "../../packages/ui-core/index.js";

test("ui-core exposes shadcn-compatible semantic token vocabulary", () => {
  assert.ok(UI_SEMANTIC_TOKENS.includes("background"));
  assert.ok(UI_SEMANTIC_TOKENS.includes("primary"));
  assert.ok(UI_SEMANTIC_TOKENS.includes("ring"));
  assert.ok(STATION_SURFACE_TOKENS.includes("sb-window"));
  assert.equal(cssVariable("background"), "var(--background)");
  assert.equal(cssVariable("sb-taskbar"), "var(--sb-taskbar)");
});

test("ui-core primitives remain source-owned and expose stable data slots", () => {
  const html = renderToStaticMarkup(
    Panel({
      children: [
        Button({ children: "Open", variant: "outline" }),
        Input({ "aria-label": "Search", placeholder: "Search" }),
        Select({
          "aria-label": "Theme",
          defaultValue: "system",
          children: [
            createElement("option", { key: "system", value: "system" }, "System"),
            createElement("option", { key: "dark", value: "dark" }, "Dark"),
          ],
        }),
        Toggle({ children: "Compact", pressed: true }),
        Badge({ children: "Current" }),
      ],
    }),
  );

  for (const slot of ["panel", "button", "input", "select", "toggle", "badge"]) {
    assert.match(html, new RegExp(`data-slot="${slot}"`));
  }
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /data-state="on"/);
});

test("button defaults do not accidentally submit enclosing forms", () => {
  const html = renderToStaticMarkup(Button({ children: "Action" }));
  assert.match(html, /type="button"/);
  assert.match(html, /focus-visible:ring/);
});

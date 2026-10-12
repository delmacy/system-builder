import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, Input, Select, STATION_DENSITY_METRICS, STATION_FOUNDATION_TOKENS,
  STATION_SURFACE_TOKENS, UI_SEMANTIC_TOKENS, cssVariable } from "../../packages/ui-core/index.js";

const css = readFileSync("packages/ui-core/foundation.css", "utf8");
function declarations(selector: string): ReadonlyMap<string, string> {
  const offset = css.indexOf(selector);
  assert.ok(offset >= 0, `missing selector ${selector}`);
  const block = css.slice(css.indexOf("{", offset) + 1, css.indexOf("}", offset));
  return new Map([...block.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map(match => [match[1]!, match[2]!.trim()]));
}

test("every public C0 token resolves in owned CSS and preserves existing vocabulary", () => {
  for (const token of [...UI_SEMANTIC_TOKENS, ...STATION_SURFACE_TOKENS, ...STATION_FOUNDATION_TOKENS]) {
    assert.ok(css.includes(`--${token}:`), `missing ${token}`);
    assert.equal(cssVariable(token), `var(--${token})`);
  }
  const global = readFileSync("apps/station/web/app/globals.css", "utf8");
  assert.ok(global.includes('@import "../../../../packages/ui-core/foundation.css";'));
  assert.equal(global.includes("--sb-desktop:"), false, "no competing theme source");
});

test("explicit and system dark cover every semantic/surface token identically", () => {
  const system = declarations(':root:not([data-theme="light"]), [data-theme="system"]');
  const explicit = declarations(':root[data-theme="dark"], [data-theme="dark"]');
  const light = declarations(':root, [data-theme="light"], [data-theme="system"]');
  for (const token of [...UI_SEMANTIC_TOKENS, ...STATION_SURFACE_TOKENS]) {
    assert.ok(system.has(token), `system dark missing ${token}`);
    assert.equal(explicit.get(token), system.get(token), `dark drift ${token}`);
    assert.ok(light.has(token), `light missing ${token}`);
  }
  assert.notEqual(light.get("sb-desktop"), explicit.get("sb-desktop"));
  assert.notEqual(light.get("destructive-foreground"), explicit.get("destructive-foreground"));
});

test("density profiles are implemented by shared CSS without changing control API", () => {
  for (const density of ["comfortable", "compact"] as const) {
    const tokens = declarations(`[data-density="${density}"]`);
    const metrics = STATION_DENSITY_METRICS[density];
    for (const [token, pixels] of [["sb-control-height", metrics.controlHeight], ["sb-control-height-sm", metrics.smallHeight],
      ["sb-control-height-lg", metrics.largeHeight], ["sb-control-padding", metrics.padding], ["sb-control-gap", metrics.gap]] as const) {
      assert.equal(parseFloat(tokens.get(token)!) * 16, pixels);
    }
  }
  assert.ok(STATION_DENSITY_METRICS.compact.controlHeight < STATION_DENSITY_METRICS.comfortable.controlHeight);
  const markup = renderToStaticMarkup(createElement("div", {}, Button({ children: "Keep defaults" }),
    Input({ "aria-label": "Invalid", "aria-invalid": true, disabled: true }), Select({ "aria-label": "Choice" })));
  assert.match(markup, /type="button"/);
  assert.match(markup, /aria-invalid="true"/);
  assert.match(markup, /disabled=""/);
  assert.match(markup, /var\(--sb-control-height\)/);
  assert.ok(css.includes('[aria-invalid="true"]'));
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const source = readFileSync(resolve(process.cwd(), "apps/station/web/app/station-foundation-client.tsx"), "utf8");

test("Component Lab proves the real registry and constrained composition APIs", () => {
  assert.match(source, /ComponentRegistry/);
  assert.match(source, /validateCompositionPlacement/);
  assert.match(source, /BUTTON_GROUP_DESCRIPTOR/);
  assert.match(source, /data-slot="composition-lab-proof"/);
  assert.match(source, /data-column-span="5"/);
  assert.match(source, /data-column-span="7"/);
  assert.match(source, /data-placement-outcome="valid"/);
  assert.match(source, /data-placement-outcome="invalid"/);
  assert.match(source, /<ButtonGroup/);
  assert.match(source, /ICON_TOKENS\.slice\(0, 5\)/);
});

test("Component Lab proof stays span/token based and presentation-only", () => {
  assert.doesNotMatch(source, /runtime-core|packages\/deploy|packages\/compiler/);
  assert.doesNotMatch(source, /columnSpan:\s*["'](?:xs|sm|md|lg|xl)/i);
  assert.doesNotMatch(source, /width:\s*["']?\d+px|height:\s*["']?\d+px/);
  assert.match(source, /Station presentation state remains local and disposable/);
});

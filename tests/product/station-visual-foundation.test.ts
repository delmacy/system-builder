import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const source = readFileSync(
  resolve(process.cwd(), "apps/station/web/app/station-foundation-client.tsx"),
  "utf8",
);

test("Station visual foundation composes the committed M1 substrate", () => {
  assert.match(source, /StationAppRegistry\(M1_UTILITY_APPS\)/);
  assert.match(source, /createWindowRuntimeState\(definitions, initialBounds\)/);
  assert.match(source, /definitionRef: welcome\.windowDefinitions\[0\]!\.id/);
  assert.match(source, /<WindowFrame/);
  assert.match(source, /ResizeObserver/);
  assert.match(source, /type: "SET_BOUNDS"/);
  assert.match(source, /h-\[100dvh\] w-screen/);
  assert.match(source, /createBrowserLocalPresentationStorage\(window\.localStorage\)/);
  assert.match(source, /<StationNavbar/);
  assert.match(source, /connection="disconnected"/);
  assert.match(source, /<StationTaskbar/);
  assert.match(source, /apps=\{registry\.list\(\)\}/);
  assert.match(source, /windows=\{taskbarWindows\}/);
  assert.match(source, /onLauncherOpenChange=\{setLauncherOpen\}/);
  assert.match(source, /instance\.lifecycle === "MINIMIZED"/);
  assert.match(source, /openWindows\.map/);
  assert.match(source, /no Core truth is inferred/);
});

test("Station foundation remains presentation-only", () => {
  assert.doesNotMatch(source, /station-gateway/);
  assert.doesNotMatch(source, /runtime-core/);
  assert.doesNotMatch(source, /provider/i);
});

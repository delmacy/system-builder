import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../../apps/station/web/app/station-foundation-client.tsx", import.meta.url),
  "utf8",
);

test("Station visual foundation composes the committed M1 substrate", () => {
  assert.match(source, /StationAppRegistry\(M1_UTILITY_APPS\)/);
  assert.match(source, /createWindowRuntimeState\(definitions, bounds\)/);
  assert.match(source, /definitionRef: welcome\.windowDefinitions\[0\]!\.id/);
  assert.match(source, /<WindowFrame/);
  assert.match(source, /createBrowserLocalPresentationStorage\(window\.localStorage\)/);
  assert.match(source, /Core: Disconnected/);
  assert.match(source, /no Core truth is inferred/);
});

test("Station foundation remains presentation-only", () => {
  assert.doesNotMatch(source, /station-gateway/);
  assert.doesNotMatch(source, /runtime-core/);
  assert.doesNotMatch(source, /provider/i);
});

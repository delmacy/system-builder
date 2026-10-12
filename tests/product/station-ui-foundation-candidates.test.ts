import assert from "node:assert/strict";
import test from "node:test";
import { UI_FOUNDATION_CATALOG_CANDIDATES, findUIFoundationCandidates } from "../../apps/station/web/app/station-ui-foundation-candidates.js";

test("foundation candidate census has stable unique source identifiers and no editor-ready overclaim", () => {
  assert.equal(new Set(UI_FOUNDATION_CATALOG_CANDIDATES.map(x => x.id)).size, UI_FOUNDATION_CATALOG_CANDIDATES.length);
  assert.ok(UI_FOUNDATION_CATALOG_CANDIDATES.filter(x => x.id !== "ui:card" && x.id !== "ui:button").every(x => x.stage === "SOURCE_ONLY"));
  const button = UI_FOUNDATION_CATALOG_CANDIDATES.find(x => x.id === "ui:button");
  assert.equal(button?.stage, "INSERTABLE");
  assert.equal(button?.componentRef, "component:button");
  assert.equal(button?.compositionRef, "composition:example");
  const card = UI_FOUNDATION_CATALOG_CANDIDATES.find(x => x.id === "ui:card");
  assert.equal(card?.stage, "INSERTABLE");
  assert.equal(card?.componentRef, "component:card");
  assert.equal(card?.compositionRef, "composition:action-panel");
  assert.ok(UI_FOUNDATION_CATALOG_CANDIDATES.every(x => x.id.trim() && x.sourceExport.trim()));
});
test("palette candidate search supports category, export and case-insensitivity", () => {
  assert.deepEqual(findUIFoundationCandidates("workSTATION").map(x => x.id), ["ui:toolbar"]);
  assert.deepEqual(findUIFoundationCandidates("DATA").map(x => x.id), ["ui:data-table"]);
  assert.equal(findUIFoundationCandidates("unrecognized").length, 0);
});

import assert from "node:assert/strict";
import test from "node:test";
import { UI_FOUNDATION_CATALOG_CANDIDATES, findUIFoundationCandidates } from "../../apps/station/web/app/station-ui-foundation-candidates.js";

test("foundation candidate census has stable unique source identifiers and no editor-ready overclaim", () => {
  assert.equal(new Set(UI_FOUNDATION_CATALOG_CANDIDATES.map(x => x.id)).size, UI_FOUNDATION_CATALOG_CANDIDATES.length);
  assert.ok(UI_FOUNDATION_CATALOG_CANDIDATES.every(x => x.stage === "SOURCE_ONLY"));
  assert.ok(UI_FOUNDATION_CATALOG_CANDIDATES.every(x => x.id.trim() && x.sourceExport.trim()));
});
test("palette candidate search supports category, export and case-insensitivity", () => {
  assert.deepEqual(findUIFoundationCandidates("workSTATION").map(x => x.id), ["ui:toolbar"]);
  assert.deepEqual(findUIFoundationCandidates("DATA").map(x => x.id), ["ui:data-table"]);
  assert.equal(findUIFoundationCandidates("unrecognized").length, 0);
});

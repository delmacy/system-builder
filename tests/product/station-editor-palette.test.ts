import assert from "node:assert/strict";
import test from "node:test";
import { initializeCatalogEditorSession } from "../../apps/station/web/app/station-editor-catalog.js";
import { listInsertableEditorComponents, resolveEditorPaletteSelection } from "../../apps/station/web/app/station-editor-palette.js";

function fixture(ref = "composition:example") {
  const result = initializeCatalogEditorSession(ref, "session:palette-test");
  assert.ok(result.accepted);
  return result;
}
test("palette admission uses live registry without changing session or draft", () => {
  const { session, entry } = fixture();
  const before = JSON.stringify(session);
  const choices = listInsertableEditorComponents(session, entry.registry, "node:root", "content", " BUTTon ");
  assert.deepEqual(choices.map(item => item.id), ["component:button"]);
  assert.equal(JSON.stringify(session), before);
  assert.equal(resolveEditorPaletteSelection(choices, "component:grid"), "component:button");
  assert.equal(resolveEditorPaletteSelection(choices, "component:button"), "component:button");
});
test("missing parent, unknown slot, occupied single slot and unavailable source controls are excluded", () => {
  const { session, entry } = fixture();
  assert.equal(listInsertableEditorComponents(session, entry.registry, "missing", "content").length, 0);
  assert.equal(listInsertableEditorComponents(session, entry.registry, "node:root", "unknown").length, 0);
  assert.equal(listInsertableEditorComponents(session, entry.registry, "node:root", "content", "data-table").length, 0);
  assert.equal(resolveEditorPaletteSelection([], "component:button"), "");
  const group = fixture("composition:button-group");
  assert.equal(listInsertableEditorComponents(group.session, group.entry.registry, "layer:button-group", "button-1").length, 0);
});
test("a restricted action slot exposes atomic buttons and rejects layout containers", () => {
  const { session, entry } = fixture("composition:action-panel");
  assert.deepEqual(listInsertableEditorComponents(session, entry.registry, "panel:actions", "actions").map(item => item.id), ["component:button"]);
});

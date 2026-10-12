import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { initializeCatalogEditorSession } from "../../apps/station/web/app/station-editor-catalog.js";
import { EditorCardPreview } from "../../apps/station/web/app/station-editor-card-preview.js";
import { prepareEditorArtifact } from "../../apps/station/web/app/station-editor-files.js";
import { importCatalogArtifact } from "../../apps/station/web/app/station-editor-artifact.js";
import { applyEditorStructure, projectEditorPreview } from "../../packages/station-editor/index.js";

function setup() {
  const r = initializeCatalogEditorSession("composition:action-panel", "session:card-test");
  assert.ok(r.accepted);
  return r;
}
test("Card inserts through existing registry, hosts children and round-trips current codec", () => {
  const { session, entry } = setup();
  const added = applyEditorStructure(session, { type: "add-node", sessionRef: session.sessionRef,
    compositionRef: entry.compositionRef, expectedDraftRevision: session.draftRevision,
    nodeRef: "card:test", componentRef: "component:card", parentRef: "panel:root", slotRef: "content" }, entry.registry);
  assert.ok(added.accepted);
  const nested = applyEditorStructure(added.session, { type: "add-node", sessionRef: session.sessionRef,
    compositionRef: entry.compositionRef, expectedDraftRevision: added.session.draftRevision,
    nodeRef: "card:button", componentRef: "component:button", parentRef: "card:test", slotRef: "content" }, entry.registry);
  assert.ok(nested.accepted);
  const doc = prepareEditorArtifact(entry.compositionRef, nested.session.transaction.draft, null,
    { artifactId: "urn:system-builder:card-proof", createdAt: "2026-10-12T18:00:00Z" });
  assert.ok(doc.accepted);
  assert.equal(doc.document.schema.version, "2.0.0");
  const reopened = importCatalogArtifact(doc.text);
  assert.ok(reopened.accepted);
  assert.deepEqual(reopened.document.payload.graph, nested.session.transaction.draft);
  const badProperties = applyEditorStructure(nested.session, { type: "set-properties", sessionRef: session.sessionRef,
    compositionRef: entry.compositionRef, expectedDraftRevision: nested.session.draftRevision,
    nodeRef: "card:test", properties: { variant: "outline", disabled: false } }, entry.registry);
  assert.equal(badProperties.accepted, false);
  const corrupt = JSON.parse(doc.text);
  corrupt.payload.graph.nodes.find((n: { ref: string }) => n.ref === "card:button").placement.slotRef = "unknown";
  assert.equal(importCatalogArtifact(JSON.stringify(corrupt)).accepted, false);
  const projection = projectEditorPreview(nested.session, entry.registry, { selectedRef: "card:test" });
  assert.ok(projection.accepted);
  const node = projection.snapshot.nodes.find(n => n.nodeRef === "card:test");
  assert.ok(node?.kind === "node");
  const html = renderToStaticMarkup(createElement(EditorCardPreview, { node, label: "<Card>", children: "Nested content" }));
  assert.match(html, /data-slot="card"/);
  assert.match(html, /data-slot="card-content"/);
  assert.match(html, /data-selected="true"/);
  assert.match(html, /&lt;Card&gt;/);
  assert.match(html, /Nested content/);
});
test("Card rejects row placement and unknown slot without mutating the admitted session", () => {
  const { session, entry } = setup();
  const before = JSON.stringify(session);
  for (const [parentRef, slotRef] of [["panel:actions", "actions"], ["panel:root", "missing"]]) {
    const r = applyEditorStructure(session, { type: "add-node", sessionRef: session.sessionRef,
      compositionRef: entry.compositionRef, expectedDraftRevision: session.draftRevision,
      nodeRef: "card:invalid", componentRef: "component:card", parentRef: parentRef!, slotRef: slotRef! }, entry.registry);
    assert.equal(r.accepted, false);
    assert.equal(JSON.stringify(session), before);
  }
});

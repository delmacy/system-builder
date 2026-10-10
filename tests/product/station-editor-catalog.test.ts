import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_COMPOSITION_REF, initializeCatalogEditorSession, listEditorCatalog,
  resolveEditorCatalogEntry, validateEditorCatalogDefinition,
} from "../../apps/station/web/app/station-editor-catalog.js";
import { validateCompositionGraph, validateCompositionPlacement } from "../../packages/station-composition/index.js";
import { projectEditorLayers, projectEditorInspector, projectEditorPreview, selectEditorLayer } from "../../packages/station-editor/index.js";

test("TASK-646 both admitted graphs initialize deterministically through real editor APIs", () => {
  const entries = listEditorCatalog();
  assert.deepEqual(entries.map(item => item.compositionRef), [DEFAULT_COMPOSITION_REF, "composition:button-group"]);
  for (const entry of entries) {
    const first = initializeCatalogEditorSession(entry.compositionRef, "session:catalog-test");
    const second = initializeCatalogEditorSession(entry.compositionRef, "session:catalog-test");
    assert.equal(first.accepted, true);
    assert.equal(second.accepted, true);
    assert.deepEqual(first.session, second.session);
    if (!first.accepted) continue;
    assert.equal(first.session.base.compositionRef, entry.compositionRef);
    assert.equal(first.session.authority, "station-draft-projection");
    assert.equal(first.session.draftRevision, 7);
    assert.notEqual(first.session.sessionRef, first.entry.applicationRef);
    assert.notEqual(first.session.sessionRef, first.entry.compositionRef);
    assert.deepEqual(validateCompositionGraph(first.entry.composition, first.entry.registry), []);
    assert.deepEqual(Object.keys(first.entry.labels).sort(),
      first.entry.composition.nodes.map(node => node.ref).sort());
    assert.equal(Object.isFrozen(first.entry.composition), true);
    assert.equal(Object.isFrozen(first.entry.composition.nodes), true);
    assert.equal(first.entry.composition.nodes.every(node =>
      Object.isFrozen(node) && (node.placement === undefined || Object.isFrozen(node.placement))), true);
    const layers = projectEditorLayers(first.session);
    assert.equal(layers.accepted, true);
    assert.equal(projectEditorPreview(first.session, first.entry.registry).accepted, true);
    if (layers.accepted && layers.root.children[0]) {
      const selection = selectEditorLayer(layers, { selectedRef: null }, layers.root.children[0].nodeRef);
      assert.equal(selection.accepted, true);
      assert.equal(projectEditorInspector(first.session, selection.selection, 7).accepted, true);
    }
  }
});

test("TASK-646 button group uses actual typed slots and distinct row constraints", () => {
  const entry = resolveEditorCatalogEntry("composition:button-group");
  assert.ok(entry);
  assert.equal(entry.composition.rootRef, "layer:button-group");
  const [root, first, second] = entry.composition.nodes;
  assert.ok(root && first?.placement && second?.placement);
  const parent = entry.registry.get(root.componentRef);
  const child = entry.registry.get(first.componentRef);
  assert.ok(parent && child);
  assert.equal(parent.layout, "row");
  assert.equal(first.placement.slotRef, "button-1");
  assert.equal(second.placement.slotRef, "button-2");
  assert.equal(child.constraints.maxRows, 1);
  assert.doesNotThrow(() => validateCompositionPlacement({
    parent, child, slotId: first.placement!.slotRef, columnSpan: 2, rowSpan: 1,
  }));
  assert.throws(() => validateCompositionPlacement({
    parent, child, slotId: "content", columnSpan: 2, rowSpan: 1,
  }));
  assert.throws(() => validateCompositionPlacement({
    parent, child, slotId: first.placement!.slotRef, columnSpan: 2, rowSpan: 2,
  }));
});

test("TASK-646 unknown identities fail closed without mutating a prior session", () => {
  const first = initializeCatalogEditorSession(DEFAULT_COMPOSITION_REF, "session:catalog-test");
  assert.equal(first.accepted, true);
  if (!first.accepted) return;
  const before = structuredClone(first.session);
  for (const ref of ["", " ", "composition:missing", "composition:button-group/../example"]) {
    const rejected = initializeCatalogEditorSession(ref, "session:catalog-test");
    assert.deepEqual(rejected, { accepted: false, reason: "unknown-composition" });
    assert.deepEqual(first.session, before);
  }
  assert.deepEqual(initializeCatalogEditorSession(DEFAULT_COMPOSITION_REF, first.entry.applicationRef),
    { accepted: false, reason: "invalid-session" });
  assert.deepEqual(initializeCatalogEditorSession(DEFAULT_COMPOSITION_REF, DEFAULT_COMPOSITION_REF),
    { accepted: false, reason: "invalid-session" });
  assert.deepEqual(first.session, before);
});

test("TASK-646 malformed or incompatible source definitions reject without modifying admitted catalog", () => {
  const source = resolveEditorCatalogEntry(DEFAULT_COMPOSITION_REF);
  assert.ok(source);
  const before = structuredClone(source.composition);
  const incompatible = { ...source, composition: { ...source.composition, nodes:
    source.composition.nodes.map(node => node.ref === "node:button-1" ? {
      ...node, placement: { ...node.placement!, slotRef: "unknown" },
    } : node) } };
  const mislabeled = { ...source, labels: { "node:root": "Grid" } };
  const duplicate = { ...source, composition: { ...source.composition,
    nodes: [...source.composition.nodes, source.composition.nodes[1]!] } };
  const invalidDescriptor = { ...source, descriptors: [{ ...source.descriptors[0]!,
    constraints: { ...source.descriptors[0]!.constraints, minColumns: 99 } }, source.descriptors[1]!] };
  for (const candidate of [incompatible, mislabeled, duplicate, invalidDescriptor]) {
    assert.equal(validateEditorCatalogDefinition(candidate), false);
  }
  assert.deepEqual(source.composition, before);
  assert.equal(initializeCatalogEditorSession(DEFAULT_COMPOSITION_REF, "session:recovery").accepted, true);
});

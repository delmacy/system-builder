import assert from "node:assert/strict";
import test from "node:test";

import { COMPONENT_FAMILIES, ComponentRegistry, defineCompositionGraph, projectResponsiveComposition } from "../../packages/station-composition/index.js";

const atomic = { id: "component:button", family: "atomic", layout: "none", childPolicy: "none", constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2, minRows: 1, maxRows: 2, recommendedRows: 1 }, slots: [] } as const;
const layout = { id: "component:grid", family: "layout-container", layout: "grid", layoutOwnership: "self", childPolicy: "multiple", constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12, minRows: 1, maxRows: 12, recommendedRows: 4 }, slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: [...COMPONENT_FAMILIES] }] } as const;
const registry = new ComponentRegistry([layout, atomic]);
const graph = defineCompositionGraph({ rootRef: "node:root", nodes: [
  { ref: "node:root", componentRef: "component:grid" },
  { ref: "node:first", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } },
  { ref: "node:second", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } },
] });

test("C04 responsive projection preserves identity semantic order and canonical placement", () => {
  const before = structuredClone(graph);
  const projected = projectResponsiveComposition(graph, registry, 480, [{ nodeRef: "node:second", condition: { maxWidth: 600 }, placement: { parentRef: "node:root", slotRef: "content", columnSpan: 4, rowSpan: 2 } }]);
  assert.deepEqual(projected.nodes.map(({ ref, componentRef, semanticOrder }) => ({ ref, componentRef, semanticOrder })), [
    { ref: "node:root", componentRef: "component:grid", semanticOrder: 0 },
    { ref: "node:first", componentRef: "component:button", semanticOrder: 1 },
    { ref: "node:second", componentRef: "component:button", semanticOrder: 2 },
  ]);
  assert.equal(projected.nodes[2]?.placement?.columnSpan, 4);
  assert.deepEqual(graph, before);
});

test("C04 responsive projection falls back canonically and rejects ambiguous or invalid owner placement", () => {
  const fallback = projectResponsiveComposition(graph, registry, 900, [{ nodeRef: "node:first", condition: { maxWidth: 600 }, placement: { parentRef: "node:root", slotRef: "content", columnSpan: 4, rowSpan: 1 } }]);
  assert.deepEqual(fallback.nodes[1]?.placement, graph.nodes[1]?.placement);
  assert.throws(() => projectResponsiveComposition(graph, registry, 600, [
    { nodeRef: "node:first", condition: { maxWidth: 600 }, placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } },
    { nodeRef: "node:first", condition: { minWidth: 600 }, placement: { parentRef: "node:root", slotRef: "content", columnSpan: 3, rowSpan: 1 } },
  ]), /conditions overlap/);
  assert.throws(() => projectResponsiveComposition(graph, registry, 480, [{ nodeRef: "node:first", condition: { maxWidth: 600 }, placement: { parentRef: "node:root", slotRef: "missing", columnSpan: 2, rowSpan: 1 } }]), /unknown parent slot/);
  assert.throws(() => projectResponsiveComposition(graph, registry, 480, [{ nodeRef: "node:first", condition: { maxWidth: 600 }, placement: { parentRef: "node:root", slotRef: "content", columnSpan: 99, rowSpan: 1 } }]), /columnSpan is outside/);
});

test("C04 responsive projection exposes no focus selection command or business authority", () => {
  const projected = projectResponsiveComposition(graph, registry, 480, []);
  const serialized = JSON.stringify(projected);
  for (const forbidden of ["focus", "selection", "command", "business", "appManifest", "widthPx", "heightPx"]) assert.equal(serialized.includes(forbidden), false);
});

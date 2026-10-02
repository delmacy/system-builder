import assert from "node:assert/strict";
import test from "node:test";

import {
  COMPONENT_FAMILIES,
  ComponentRegistry,
  applyCanonicalCompositionMutation,
  createCanonicalCompositionState,
  defineCompositionGraph,
  isCompositionProjectionCurrent,
  projectCanonicalComposition,
} from "../../packages/station-composition/index.js";

const atomic = { id: "component:button", family: "atomic", layout: "none", childPolicy: "none", constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2, minRows: 1, maxRows: 2, recommendedRows: 1 }, slots: [] } as const;
const layout = { id: "component:grid", family: "layout-container", layout: "grid", layoutOwnership: "self", childPolicy: "multiple", constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12, minRows: 1, maxRows: 12, recommendedRows: 4 }, slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: [...COMPONENT_FAMILIES] }] } as const;
const registry = new ComponentRegistry([layout, atomic]);
const graph = defineCompositionGraph({ rootRef: "node:root", nodes: [{ ref: "node:root", componentRef: "component:grid" }, { ref: "node:button", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } }] });
const changedButton = { ref: "node:button", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 3, rowSpan: 1 } } as const;

test("C02 advances one canonical revision for one admitted state change", () => {
  const initial = createCanonicalCompositionState(graph, registry, 7);
  const result = applyCanonicalCompositionMutation(initial, 7, { type: "replace-node", node: changedButton }, registry);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.changed, true);
  assert.equal(result.state.revision, 8);
  assert.equal(initial.revision, 7);
  assert.equal(initial.transaction.draft.nodes[1]?.placement?.columnSpan, 2);
  assert.equal(result.state.transaction.draft.nodes[1]?.placement?.columnSpan, 3);
});

test("C02 rejected and semantic no-op mutations do not advance canonical revision", () => {
  const initial = createCanonicalCompositionState(graph, registry, 3);
  const sameNode = initial.transaction.draft.nodes[1];
  assert.ok(sameNode);
  const noOp = applyCanonicalCompositionMutation(initial, 3, { type: "replace-node", node: sameNode }, registry);
  assert.equal(noOp.ok, true);
  if (noOp.ok) { assert.equal(noOp.changed, false); assert.equal(noOp.state, initial); assert.equal(noOp.state.revision, 3); }
  const invalid = applyCanonicalCompositionMutation(initial, 3, { type: "remove-node", nodeRef: "node:root" }, registry);
  assert.equal(invalid.ok, false);
  if (!invalid.ok) { assert.equal(invalid.reason, "validation"); assert.equal(invalid.state, initial); assert.equal(invalid.state.revision, 3); }
});

test("C02 projections converge on owner revision and report stale after owner advances", () => {
  const initial = createCanonicalCompositionState(graph, registry, 11);
  const inspector = projectCanonicalComposition(initial, "inspector", (transaction) => transaction.draft.nodes[1]?.ref);
  const layers = projectCanonicalComposition(initial, "layers", (transaction) => transaction.draft.nodes.map((node) => node.ref));
  const preview = projectCanonicalComposition(initial, "preview", (transaction) => transaction.draft);
  assert.deepEqual([inspector.revision, layers.revision, preview.revision], [11, 11, 11]);
  assert.equal(isCompositionProjectionCurrent(initial, inspector), true);
  const changed = applyCanonicalCompositionMutation(initial, 11, { type: "replace-node", node: changedButton }, registry);
  assert.equal(changed.ok, true);
  if (!changed.ok) return;
  assert.equal(isCompositionProjectionCurrent(changed.state, inspector), false);
  const source = projectCanonicalComposition(changed.state, "source-yaml", (transaction) => transaction.draft.rootRef);
  assert.equal(source.revision, 12);
  assert.equal(isCompositionProjectionCurrent(changed.state, source), true);
});

test("C02 stale expected revision rejects before mutation and cannot overwrite newer canonical state", () => {
  const initial = createCanonicalCompositionState(graph, registry, 20);
  const first = applyCanonicalCompositionMutation(initial, 20, { type: "replace-node", node: changedButton }, registry);
  assert.equal(first.ok, true);
  if (!first.ok) return;
  const stale = applyCanonicalCompositionMutation(first.state, 20, { type: "remove-node", nodeRef: "node:button" }, registry);
  assert.deepEqual(stale, { ok: false, reason: "stale-revision", state: first.state });
  assert.equal(first.state.revision, 21);
  assert.equal(first.state.transaction.draft.nodes.some((node) => node.ref === "node:button"), true);
});
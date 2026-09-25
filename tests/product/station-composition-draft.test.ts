import assert from "node:assert/strict";
import test from "node:test";

import { ComponentRegistry, applyCompositionDraftMutation, createCompositionDraftTransaction, defineCompositionGraph, discardCompositionDraft, projectCompositionPreview } from "../../packages/station-composition/index.js";

const atomic = { id: "component:button", family: "atomic", layout: "none", childPolicy: "none", constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2, minRows: 1, maxRows: 2, recommendedRows: 1 }, slots: [] } as const;
const layout = { id: "component:grid", family: "layout-container", layout: "grid", layoutOwnership: "self", childPolicy: "multiple", constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12, minRows: 1, maxRows: 12, recommendedRows: 4 }, slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: ["atomic", "collection", "semantic-composite", "layout-container"] }] } as const;
const registry = new ComponentRegistry([layout, atomic]);
const base = defineCompositionGraph({ rootRef: "node:root", nodes: [{ ref: "node:root", componentRef: "component:grid" }, { ref: "node:button", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } }] });

test("draft transaction preserves immutable base and exposes explicit dirty preview state", () => {
  const transaction = createCompositionDraftTransaction(base, registry);
  const result = applyCompositionDraftMutation(transaction, { type: "replace-node", node: { ref: "node:button", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 3, rowSpan: 1 } } }, registry);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.transaction.dirty, true);
  assert.equal(result.transaction.base.nodes[1]?.placement?.columnSpan, 2);
  assert.equal(projectCompositionPreview(result.transaction).nodes[1]?.placement?.columnSpan, 3);
  const discarded = discardCompositionDraft(result.transaction);
  assert.equal(discarded.dirty, false);
  assert.equal(discarded.draft.nodes[1]?.placement?.columnSpan, 2);
});

test("invalid bounded mutation is rejected without corrupting base or draft", () => {
  const transaction = createCompositionDraftTransaction(base, registry);
  const result = applyCompositionDraftMutation(transaction, { type: "remove-node", nodeRef: "node:root" }, registry);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.transaction, transaction);
  assert.equal(result.transaction.dirty, false);
  assert.ok(result.findings.some((finding) => finding.code === "missing-root"));
});

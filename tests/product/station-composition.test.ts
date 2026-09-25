import assert from "node:assert/strict";
import test from "node:test";

import { COMPONENT_FAMILIES, ComponentRegistry, normalizeComponentDescriptor } from "../../packages/station-composition/index.js";

const atomic = {
  id: "component:button",
  family: "atomic",
  layout: "none",
  childPolicy: "none",
  constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2, minRows: 1, maxRows: 2, recommendedRows: 1 },
  slots: [],
} as const;

const layout = {
  id: "component:grid",
  family: "layout-container",
  layout: "grid",
  childPolicy: "multiple",
  constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12, minRows: 1, maxRows: 12, recommendedRows: 4 },
  slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: [...COMPONENT_FAMILIES] }],
} as const;

test("component registry is stable-id based and deterministically ordered", () => {
  const registry = new ComponentRegistry([layout, atomic]);
  assert.deepEqual(registry.list().map((item) => item.id), ["component:button", "component:grid"]);
  assert.equal(registry.get("component:grid")?.family, "layout-container");
});

test("component registry rejects duplicate stable ids deterministically", () => {
  const registry = new ComponentRegistry([atomic]);
  assert.throws(() => registry.register(atomic), /duplicate component descriptor id: component:button/);
});

test("composition contracts represent all four component families", () => {
  const registry = new ComponentRegistry(COMPONENT_FAMILIES.map((family, index) => ({ ...atomic, id: `component:${family}:${index}`, family })));
  assert.deepEqual(new Set(registry.list().map((item) => item.family)), new Set(COMPONENT_FAMILIES));
});

test("descriptor validation requires canonical composition fields and discrete spans", () => {
  assert.throws(() => normalizeComponentDescriptor({ ...atomic, id: "" }), /component descriptor id must be a non-empty string/);
  assert.throws(() => normalizeComponentDescriptor({ ...atomic, constraints: { ...atomic.constraints, recommendedColumns: 5 } }), /column span constraints/);
  assert.throws(() => normalizeComponentDescriptor({ ...atomic, family: "app" }), /component family is unsupported/);
});

test("named slots reject duplicate identity and preserve family compatibility metadata", () => {
  const descriptor = normalizeComponentDescriptor(layout);
  assert.equal(descriptor.slots[0]?.id, "content");
  assert.deepEqual(descriptor.slots[0]?.acceptsFamilies, COMPONENT_FAMILIES);
  assert.throws(() => normalizeComponentDescriptor({ ...layout, slots: [layout.slots[0], layout.slots[0]] }), /duplicate slot id: content/);
});

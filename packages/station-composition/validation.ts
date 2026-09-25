import { COMPONENT_FAMILIES, LAYOUT_KINDS, type ChildPolicy, type ComponentDescriptor, type ComponentFamily, type CompositionPlacement, type LayoutKind, type LayoutOwnership, type SlotDescriptor, type SpanConstraints } from "./types.js";

const CHILD_POLICIES: readonly ChildPolicy[] = ["none", "single", "multiple"];
const LAYOUT_OWNERSHIP: readonly LayoutOwnership[] = ["parent", "self"];

function record(input: unknown, label: string): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) throw new Error(`${label} must be an object`);
  return input as Record<string, unknown>;
}
function token(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be a non-empty string`);
  return value.trim();
}
function oneOf<T extends string>(value: unknown, values: readonly T[], label: string): T {
  if (typeof value !== "string" || !values.includes(value as T)) throw new Error(`${label} is unsupported: ${String(value)}`);
  return value as T;
}
function positiveInteger(value: unknown, label: string): number {
  if (!Number.isInteger(value) || (value as number) < 1) throw new Error(`${label} must be a positive integer`);
  return value as number;
}
function optionalList<T extends string>(input: unknown, values: readonly T[], label: string): readonly T[] | undefined {
  if (input === undefined) return undefined;
  if (!Array.isArray(input)) throw new Error(`${label} must be an array`);
  return Object.freeze(input.map((item) => oneOf(item, values, label)));
}
function constraints(input: unknown): SpanConstraints {
  const value = record(input, "constraints");
  const result = {
    minColumns: positiveInteger(value.minColumns, "constraints.minColumns"),
    maxColumns: positiveInteger(value.maxColumns, "constraints.maxColumns"),
    recommendedColumns: positiveInteger(value.recommendedColumns, "constraints.recommendedColumns"),
    minRows: positiveInteger(value.minRows, "constraints.minRows"),
    maxRows: positiveInteger(value.maxRows, "constraints.maxRows"),
    recommendedRows: positiveInteger(value.recommendedRows, "constraints.recommendedRows"),
  };
  if (result.minColumns > result.recommendedColumns || result.recommendedColumns > result.maxColumns) throw new Error("column span constraints must satisfy min <= recommended <= max");
  if (result.minRows > result.recommendedRows || result.recommendedRows > result.maxRows) throw new Error("row span constraints must satisfy min <= recommended <= max");
  return Object.freeze(result);
}
function slot(input: unknown): SlotDescriptor {
  const value = record(input, "slot");
  if (!Array.isArray(value.acceptsFamilies)) throw new Error("slot.acceptsFamilies must be an array");
  return Object.freeze({
    id: token(value.id, "slot.id"),
    childPolicy: oneOf(value.childPolicy, CHILD_POLICIES, "slot.childPolicy"),
    acceptsFamilies: Object.freeze(value.acceptsFamilies.map((family) => oneOf<ComponentFamily>(family, COMPONENT_FAMILIES, "slot family"))),
    acceptsLayouts: optionalList<LayoutKind>(value.acceptsLayouts, LAYOUT_KINDS, "slot layout"),
  });
}

export function normalizeComponentDescriptor(input: unknown): ComponentDescriptor {
  const value = record(input, "component descriptor");
  if (!Array.isArray(value.slots)) throw new Error("component descriptor slots must be an array");
  const slots = value.slots.map(slot);
  const ids = new Set<string>();
  for (const item of slots) {
    if (ids.has(item.id)) throw new Error(`duplicate slot id: ${item.id}`);
    ids.add(item.id);
  }
  return Object.freeze({
    id: token(value.id, "component descriptor id"),
    family: oneOf<ComponentFamily>(value.family, COMPONENT_FAMILIES, "component family"),
    layout: oneOf<LayoutKind>(value.layout, LAYOUT_KINDS, "layout kind"),
    layoutOwnership: value.layoutOwnership === undefined ? undefined : oneOf(value.layoutOwnership, LAYOUT_OWNERSHIP, "layout ownership"),
    childPolicy: oneOf(value.childPolicy, CHILD_POLICIES, "child policy"),
    constraints: constraints(value.constraints),
    slots: Object.freeze(slots),
    allowedParentFamilies: optionalList<ComponentFamily>(value.allowedParentFamilies, COMPONENT_FAMILIES, "allowed parent family"),
  });
}

export function validateCompositionPlacement(placement: CompositionPlacement): void {
  const { parent, child } = placement;
  const slot = parent.slots.find((candidate) => candidate.id === placement.slotId);
  if (slot === undefined) throw new Error(`unknown parent slot: ${placement.slotId}`);
  if (parent.childPolicy === "none" || slot.childPolicy === "none") throw new Error(`slot does not accept children: ${placement.slotId}`);
  if (!slot.acceptsFamilies.includes(child.family)) throw new Error(`slot ${placement.slotId} rejects child family: ${child.family}`);
  if (slot.acceptsLayouts !== undefined && !slot.acceptsLayouts.includes(child.layout)) throw new Error(`slot ${placement.slotId} rejects child layout: ${child.layout}`);
  if (child.allowedParentFamilies !== undefined && !child.allowedParentFamilies.includes(parent.family)) throw new Error(`child ${child.id} rejects parent family: ${parent.family}`);
  if (!Number.isInteger(placement.columnSpan) || placement.columnSpan < child.constraints.minColumns || placement.columnSpan > child.constraints.maxColumns) throw new Error(`columnSpan is outside child constraints: ${placement.columnSpan}`);
  if (!Number.isInteger(placement.rowSpan) || placement.rowSpan < child.constraints.minRows || placement.rowSpan > child.constraints.maxRows) throw new Error(`rowSpan is outside child constraints: ${placement.rowSpan}`);
  if (child.layout !== "none" && child.layoutOwnership !== "self") throw new Error(`nested layout must explicitly own its local layout: ${child.id}`);
}

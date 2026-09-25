export const COMPONENT_FAMILIES = ["atomic", "collection", "semantic-composite", "layout-container"] as const;
export type ComponentFamily = (typeof COMPONENT_FAMILIES)[number];

export const LAYOUT_KINDS = ["none", "grid", "row", "column", "stack", "split", "dock", "tabs"] as const;
export type LayoutKind = (typeof LAYOUT_KINDS)[number];

export type ChildPolicy = "none" | "single" | "multiple";
export type LayoutOwnership = "parent" | "self";

export interface SpanConstraints {
  readonly minColumns: number;
  readonly maxColumns: number;
  readonly recommendedColumns: number;
  readonly minRows: number;
  readonly maxRows: number;
  readonly recommendedRows: number;
}

export interface SlotDescriptor {
  readonly id: string;
  readonly childPolicy: ChildPolicy;
  readonly acceptsFamilies: readonly ComponentFamily[];
  readonly acceptsLayouts?: readonly LayoutKind[];
}

export interface ComponentDescriptor {
  readonly id: string;
  readonly family: ComponentFamily;
  readonly layout: LayoutKind;
  readonly layoutOwnership?: LayoutOwnership;
  readonly childPolicy: ChildPolicy;
  readonly constraints: SpanConstraints;
  readonly slots: readonly SlotDescriptor[];
  readonly allowedParentFamilies?: readonly ComponentFamily[];
}

export interface CompositionPlacement {
  readonly parent: ComponentDescriptor;
  readonly child: ComponentDescriptor;
  readonly slotId: string;
  readonly columnSpan: number;
  readonly rowSpan: number;
}

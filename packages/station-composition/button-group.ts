import type { ComponentDescriptor } from "./types.js";

export const BUTTON_GROUP_SLOT_IDS = ["button-1", "button-2", "button-3", "button-4", "button-5"] as const;

export const BUTTON_GROUP_DESCRIPTOR: ComponentDescriptor = Object.freeze({
  id: "component:button-group",
  family: "semantic-composite",
  layout: "row",
  layoutOwnership: "self",
  childPolicy: "multiple",
  constraints: Object.freeze({ minColumns: 1, maxColumns: 12, recommendedColumns: 5, minRows: 1, maxRows: 1, recommendedRows: 1 }),
  slots: Object.freeze(BUTTON_GROUP_SLOT_IDS.map((id) => Object.freeze({ id, childPolicy: "single" as const, acceptsFamilies: Object.freeze(["atomic"] as const), acceptsLayouts: Object.freeze(["none"] as const) }))),
  allowedParentFamilies: Object.freeze(["layout-container", "semantic-composite"] as const),
});

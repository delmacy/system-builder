import { normalizeComponentDescriptor } from "./validation.js";
import type { ComponentDescriptor } from "./types.js";

/** Source-owned component eligibility candidates; these are not Editor-ready until round-trip proof. */
export const UI_FOUNDATION_DESCRIPTORS: readonly ComponentDescriptor[] = Object.freeze([
  normalizeComponentDescriptor({
    id: "ui:color-field", family: "atomic", layout: "none", childPolicy: "none",
    constraints: { minColumns: 1, maxColumns: 6, recommendedColumns: 2, minRows: 1, maxRows: 2, recommendedRows: 1 },
    slots: [],
  }),
  normalizeComponentDescriptor({
    id: "ui:property-picker", family: "atomic", layout: "none", childPolicy: "none",
    constraints: { minColumns: 1, maxColumns: 6, recommendedColumns: 2, minRows: 1, maxRows: 2, recommendedRows: 1 },
    slots: [],
  }),
  normalizeComponentDescriptor({
    id: "ui:document-text-field", family: "atomic", layout: "none", childPolicy: "none",
    constraints: { minColumns: 2, maxColumns: 12, recommendedColumns: 6, minRows: 2, maxRows: 12, recommendedRows: 4 },
    slots: [],
  }),
]);

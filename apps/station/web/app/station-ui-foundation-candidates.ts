/** Construction F catalog admission contract. This is a presentation manifest,
 * not a replacement for ComponentRegistry or an editor-ready declaration. */
export const UI_FOUNDATION_CATALOG_CANDIDATES = Object.freeze([
  { id: "ui:button", label: "Button", category: "Actions", sourceExport: "Button", stage: "SOURCE_ONLY" },
  { id: "ui:input", label: "Input", category: "Forms", sourceExport: "Input", stage: "SOURCE_ONLY" },
  { id: "ui:checkbox", label: "Checkbox", category: "Forms", sourceExport: "Checkbox", stage: "SOURCE_ONLY" },
  { id: "ui:dialog", label: "Dialog", category: "Overlays", sourceExport: "Dialog", stage: "SOURCE_ONLY" },
  { id: "ui:toolbar", label: "Toolbar", category: "Workstation", sourceExport: "Toolbar", stage: "SOURCE_ONLY" },
  { id: "ui:card", label: "Card", category: "Display", sourceExport: "Card", stage: "INSERTABLE", componentRef: "component:card", compositionRef: "composition:action-panel" },
  { id: "ui:data-table", label: "Data table", category: "Collections", sourceExport: "DataTable", stage: "SOURCE_ONLY" },
] as const);
export type UIFoundationCandidate = typeof UI_FOUNDATION_CATALOG_CANDIDATES[number];
export type UIFoundationCandidateId = UIFoundationCandidate["id"];
export function findUIFoundationCandidates(search: string): readonly UIFoundationCandidate[] {
  const query = search.trim().toLocaleLowerCase();
  return UI_FOUNDATION_CATALOG_CANDIDATES.filter(item =>
    !query || [item.id, item.label, item.category, item.sourceExport].some(field => field.toLocaleLowerCase().includes(query)));
}

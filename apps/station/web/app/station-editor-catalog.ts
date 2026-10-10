import {
  BUTTON_GROUP_DESCRIPTOR, COMPONENT_FAMILIES, ComponentRegistry,
  defineCompositionGraph, normalizeComponentDescriptor, validateCompositionGraph,
  type ComponentDescriptor, type CompositionGraph,
} from "../../../../packages/station-composition/index.js";
import { initializeEditorSession, type EditorSession } from "../../../../packages/station-editor/index.js";

export interface EditorCatalogDefinition {
  readonly compositionRef: string;
  readonly applicationRef: string;
  readonly title: string;
  readonly revision: number;
  readonly descriptors: readonly ComponentDescriptor[];
  readonly composition: CompositionGraph;
  readonly labels: Readonly<Record<string, string>>;
}
export interface EditorCatalogEntry extends EditorCatalogDefinition {
  readonly registry: ComponentRegistry;
}
export type CatalogSessionResult =
  | { readonly accepted: true; readonly entry: EditorCatalogEntry; readonly session: EditorSession }
  | { readonly accepted: false; readonly reason: "unknown-composition" | "invalid-definition" | "invalid-session" };

const grid = normalizeComponentDescriptor({
  id: "component:grid", family: "layout-container", layout: "grid", layoutOwnership: "self",
  childPolicy: "multiple", constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12,
    minRows: 1, maxRows: 12, recommendedRows: 4 },
  slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: [...COMPONENT_FAMILIES] }],
});
const button = normalizeComponentDescriptor({
  id: "component:button", family: "atomic", layout: "none", childPolicy: "none",
  constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2,
    minRows: 1, maxRows: 2, recommendedRows: 1 }, slots: [],
});
const groupButton = normalizeComponentDescriptor({
  ...button, id: "component:lab-button",
  constraints: { ...button.constraints, maxRows: 1, recommendedRows: 1 },
});

function frozenGraph(graph: CompositionGraph): CompositionGraph {
  return Object.freeze({ rootRef: graph.rootRef, nodes: Object.freeze(graph.nodes.map(node =>
    Object.freeze({ ...node, ...(node.placement ? { placement: Object.freeze({ ...node.placement }) } : {}) }))) });
}
const sources: readonly EditorCatalogDefinition[] = Object.freeze([
  Object.freeze({
    compositionRef: "composition:example", applicationRef: "app:composition-editor",
    title: "Example composition", revision: 7, descriptors: Object.freeze([grid, button]),
    composition: frozenGraph(defineCompositionGraph({ rootRef: "node:root", nodes: [
      { ref: "node:root", componentRef: grid.id },
      { ref: "node:button-1", componentRef: button.id,
        placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } },
      { ref: "node:button-2", componentRef: button.id,
        placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } },
    ] })),
    labels: Object.freeze({ "node:root": "Grid", "node:button-1": "Button 1", "node:button-2": "Button 2" }),
  }),
  Object.freeze({
    compositionRef: "composition:button-group", applicationRef: "app:composition-editor",
    title: "Station button group", revision: 7,
    descriptors: Object.freeze([BUTTON_GROUP_DESCRIPTOR, groupButton]),
    composition: frozenGraph(defineCompositionGraph({ rootRef: "layer:button-group", nodes: [
      { ref: "layer:button-group", componentRef: BUTTON_GROUP_DESCRIPTOR.id },
      { ref: "layer:button-1", componentRef: groupButton.id,
        placement: { parentRef: "layer:button-group", slotRef: "button-1", columnSpan: 2, rowSpan: 1 } },
      { ref: "layer:button-2", componentRef: groupButton.id,
        placement: { parentRef: "layer:button-group", slotRef: "button-2", columnSpan: 2, rowSpan: 1 } },
    ] })),
    labels: Object.freeze({ "layer:button-group": "Button Group",
      "layer:button-1": "Group Button 1", "layer:button-2": "Group Button 2" }),
  }),
]);

/** This is a typed, source-owned catalog check, not an external-file importer. */
export function validateEditorCatalogDefinition(definition: EditorCatalogDefinition): boolean {
  try {
    if (!definition || typeof definition !== "object" ||
        typeof definition.compositionRef !== "string" || !definition.compositionRef.trim() ||
        typeof definition.applicationRef !== "string" || !definition.applicationRef.trim() ||
        definition.compositionRef === definition.applicationRef ||
        typeof definition.title !== "string" || !definition.title.trim() ||
        !Number.isSafeInteger(definition.revision) || definition.revision < 0 ||
        !Array.isArray(definition.descriptors) ||
        !definition.composition || typeof definition.composition !== "object" ||
        typeof definition.composition.rootRef !== "string" ||
        !Array.isArray(definition.composition.nodes) ||
        !definition.labels || typeof definition.labels !== "object" ||
        Array.isArray(definition.labels)) return false;
    const registry = new ComponentRegistry(definition.descriptors);
    const refs = definition.composition.nodes.map(node => node.ref);
    if (new Set(refs).size !== refs.length || refs.length === 0 ||
        Object.keys(definition.labels).length !== refs.length ||
        refs.some(ref => typeof ref !== "string" || !ref.trim() ||
          typeof definition.labels[ref] !== "string" || !definition.labels[ref]?.trim())) return false;
    if (validateCompositionGraph(definition.composition, registry).length > 0) return false;
    const initialized = initializeEditorSession({
      sessionRef: "session:catalog-validation", base: {
        applicationRef: definition.applicationRef, compositionRef: definition.compositionRef,
        revision: definition.revision, currentness: "current" },
      composition: definition.composition,
    }, registry);
    return initialized.accepted;
  } catch {
    return false;
  }
}

export const DEFAULT_COMPOSITION_REF = "composition:example";
export function listEditorCatalog(): readonly Readonly<{ compositionRef: string; title: string }>[] {
  return Object.freeze(sources.map(({ compositionRef, title }) => Object.freeze({ compositionRef, title })));
}
export function resolveEditorCatalogEntry(ref: string): EditorCatalogEntry | null {
  if (typeof ref !== "string" || !ref.trim()) return null;
  const definition = sources.find(item => item.compositionRef === ref);
  if (!definition || !validateEditorCatalogDefinition(definition)) return null;
  return Object.freeze({ ...definition, registry: new ComponentRegistry(definition.descriptors) });
}
export function initializeCatalogEditorSession(ref: string, sessionRef: string): CatalogSessionResult {
  const entry = resolveEditorCatalogEntry(ref);
  if (!entry) return Object.freeze({ accepted: false, reason: "unknown-composition" });
  if (typeof sessionRef !== "string" || !sessionRef.trim() ||
      sessionRef === entry.compositionRef || sessionRef === entry.applicationRef) {
    return Object.freeze({ accepted: false, reason: "invalid-session" });
  }
  const result = initializeEditorSession({
    sessionRef,
    base: { applicationRef: entry.applicationRef, compositionRef: entry.compositionRef,
      revision: entry.revision, currentness: "current" },
    composition: entry.composition,
  }, entry.registry);
  return result.accepted
    ? Object.freeze({ accepted: true, entry, session: result.session })
    : Object.freeze({ accepted: false, reason: "invalid-definition" });
}

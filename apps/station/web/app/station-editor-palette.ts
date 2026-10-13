import { supportsButtonDisplayText, type ComponentDescriptor, type ComponentRegistry } from "../../../../packages/station-composition/index.js";
import { UI_FOUNDATION_CATALOG_CANDIDATES } from "./station-ui-foundation-candidates.js";
import { applyEditorStructure, type EditorSession } from "../../../../packages/station-editor/index.js";

export function editorPaletteLabel(component: ComponentDescriptor): string {
  return component.id.replace(/^component:/, "").replace(/^lab-/, "").split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
export function editorPaletteCategory(component: ComponentDescriptor): string {
  const candidate = UI_FOUNDATION_CATALOG_CANDIDATES.find(item => "componentRef" in item && item.componentRef === component.id);
  return candidate?.category ?? (supportsButtonDisplayText(component.id) ? "Actions" :
    component.family === "layout-container" ? "Layouts" : component.family);
}

/** Read-only projection of the editor's own admission; never a second registry. */
export function listInsertableEditorComponents(
  session: EditorSession, registry: ComponentRegistry, parentRef: string, slotRef: string, search = "",
): readonly ComponentDescriptor[] {
  const graph = session.transaction.draft;
  let probeRef = "node:palette-admission";
  while (graph.nodes.some(node => node.ref === probeRef)) probeRef += ":next";
  const query = search.trim().toLowerCase();
  return registry.list().filter(component => {
    if (query && ![component.id, editorPaletteLabel(component), editorPaletteCategory(component)]
      .some(value => value.toLowerCase().includes(query))) return false;
    return applyEditorStructure(session, {
      type: "add-node", sessionRef: session.sessionRef, compositionRef: session.base.compositionRef,
      expectedDraftRevision: session.draftRevision, nodeRef: probeRef,
      componentRef: component.id, parentRef, slotRef,
    }, registry).accepted;
  });
}

export function resolveEditorPaletteSelection(components: readonly ComponentDescriptor[], requested: string): string {
  return components.find(component => component.id === requested)?.id ?? components[0]?.id ?? "";
}

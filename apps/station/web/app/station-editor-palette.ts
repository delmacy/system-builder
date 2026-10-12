import type { ComponentDescriptor, ComponentRegistry } from "../../../../packages/station-composition/index.js";
import { applyEditorStructure, type EditorSession } from "../../../../packages/station-editor/index.js";

/** Read-only projection of the editor's own admission; never a second registry. */
export function listInsertableEditorComponents(
  session: EditorSession, registry: ComponentRegistry, parentRef: string, slotRef: string, search = "",
): readonly ComponentDescriptor[] {
  const graph = session.transaction.draft;
  let probeRef = "node:palette-admission";
  while (graph.nodes.some(node => node.ref === probeRef)) probeRef += ":next";
  const query = search.trim().toLowerCase();
  return registry.list().filter(component => {
    if (query && !component.id.toLowerCase().includes(query)) return false;
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

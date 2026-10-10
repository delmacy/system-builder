import type { CompositionGraph, CompositionNodeRef } from "@system-builder/station-composition";
import type { EditorSession } from "./session.js";

export interface EditorLayer {
  readonly nodeRef: CompositionNodeRef;
  readonly componentRef: string;
  readonly parentRef: CompositionNodeRef | null;
  readonly children: readonly EditorLayer[];
}

export type LayersProjectionResult =
  | { readonly accepted: true; readonly root: EditorLayer; readonly nodeRefs: readonly CompositionNodeRef[] }
  | { readonly accepted: false; readonly reason: "invalid-hierarchy" };

export interface LayersSelection {
  readonly selectedRef: CompositionNodeRef | null;
}

export type LayersSelectionResult =
  | { readonly accepted: true; readonly selection: LayersSelection }
  | { readonly accepted: false; readonly reason: "unknown-node"; readonly selection: LayersSelection };

const invalid = (): LayersProjectionResult => ({ accepted: false, reason: "invalid-hierarchy" });

/** Read-only projection of the current Station editor draft. Never creates an alternate store. */
export function projectEditorLayers(session: EditorSession): LayersProjectionResult {
  const graph: CompositionGraph = session.transaction.draft;
  if (!graph || typeof graph.rootRef !== "string" || !graph.rootRef.trim() || !Array.isArray(graph.nodes)) return invalid();
  const nodes = new Map<string, (typeof graph.nodes)[number]>();
  const children = new Map<string, string[]>();
  for (const node of graph.nodes) {
    if (!node || typeof node.ref !== "string" || !node.ref.trim() || typeof node.componentRef !== "string" || !node.componentRef.trim() || nodes.has(node.ref)) return invalid();
    nodes.set(node.ref, node);
    children.set(node.ref, []);
  }
  const root = nodes.get(graph.rootRef);
  if (!root || root.placement) return invalid();
  for (const node of graph.nodes) {
    if (node.ref === graph.rootRef) continue;
    const parent = node.placement?.parentRef;
    if (typeof parent !== "string" || !nodes.has(parent) || parent === node.ref) return invalid();
    children.get(parent)!.push(node.ref);
  }
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const build = (ref: string): EditorLayer | null => {
    if (visiting.has(ref) || visited.has(ref)) return null;
    visiting.add(ref);
    const descendants: EditorLayer[] = [];
    for (const childRef of children.get(ref)!) {
      const child = build(childRef);
      if (!child) return null;
      descendants.push(child);
    }
    visiting.delete(ref);
    visited.add(ref);
    const node = nodes.get(ref)!;
    return Object.freeze({
      nodeRef: ref,
      componentRef: node.componentRef,
      parentRef: node.placement?.parentRef ?? null,
      children: Object.freeze(descendants),
    });
  };
  const hierarchy = build(graph.rootRef);
  if (!hierarchy || visited.size !== nodes.size) return invalid();
  return Object.freeze({ accepted: true, root: hierarchy, nodeRefs: Object.freeze([...visited].sort()) });
}

export function emptyLayersSelection(): LayersSelection {
  return Object.freeze({ selectedRef: null });
}

/** Unknown refs reject without changing the prior selection or the editor draft. */
export function selectEditorLayer(
  projection: LayersProjectionResult,
  previous: LayersSelection,
  nodeRef: CompositionNodeRef | null,
): LayersSelectionResult {
  if (!projection.accepted || (nodeRef !== null && !projection.nodeRefs.includes(nodeRef))) {
    return Object.freeze({ accepted: false, reason: "unknown-node", selection: previous });
  }
  if (previous.selectedRef === nodeRef) return Object.freeze({ accepted: true, selection: previous });
  return Object.freeze({ accepted: true, selection: Object.freeze({ selectedRef: nodeRef }) });
}

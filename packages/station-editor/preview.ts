import { validateCompositionGraph, type ComponentRegistry } from "@system-builder/station-composition";
import { projectEditorInspector } from "./inspector.js";
import { projectEditorLayers, type EditorLayer, type LayersSelection } from "./layers.js";
import type { EditorSession } from "./session.js";

export type EditorPreviewNode =
  | {
      readonly kind: "root";
      readonly nodeRef: string;
      readonly componentRef: string;
      readonly parentRef: null;
      readonly slotRef: null;
      readonly columnSpan: null;
      readonly rowSpan: null;
      readonly selected: boolean;
    }
  | {
      readonly kind: "node";
      readonly nodeRef: string;
      readonly componentRef: string;
      readonly parentRef: string;
      readonly slotRef: string;
      readonly columnSpan: number;
      readonly rowSpan: number;
      readonly selected: boolean;
    };

export interface EditorPreviewSnapshot {
  readonly sessionRef: string;
  readonly compositionRef: string;
  readonly baseRevision: number;
  readonly draftRevision: number;
  readonly rootRef: string;
  readonly selectedRef: string | null;
  readonly nodes: readonly EditorPreviewNode[];
}

export type EditorPreviewProjectionResult =
  | { readonly accepted: true; readonly snapshot: EditorPreviewSnapshot }
  | { readonly accepted: false; readonly reason: "invalid-session" | "invalid-selection" | "invalid-hierarchy" };

const validRef = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
const validRevision = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const validSpan = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;

function reject(reason: "invalid-session" | "invalid-selection" | "invalid-hierarchy"): EditorPreviewProjectionResult {
  return Object.freeze({ accepted: false, reason });
}

function exactFields(value: object, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const fields = [...expected].sort();
  return actual.length === fields.length && actual.every((field, index) => field === fields[index]);
}

/** Pure Preview of the same Station-owned draft used by Layers and Inspector; never a second store. */
export function projectEditorPreview(
  session: EditorSession,
  registry: ComponentRegistry,
  selection?: LayersSelection,
): EditorPreviewProjectionResult {
  try {
    if (!session || typeof session !== "object" ||
        !validRef(session.sessionRef) || !validRef(session.base?.applicationRef) ||
        !validRef(session.base?.compositionRef) ||
        new Set([session.sessionRef, session.base.applicationRef, session.base.compositionRef]).size !== 3 ||
        !validRevision(session.base.revision) || !validRevision(session.draftRevision) ||
        session.draftRevision < session.base.revision ||
        session.base.currentness !== "current" || session.draftCurrentness !== "current" ||
        session.authority !== "station-draft-projection" ||
        !session.transaction || !Array.isArray(session.transaction.findings) ||
        session.transaction.findings.length !== 0 ||
        !registry || typeof registry.get !== "function") return reject("invalid-session");

    const graph = session.transaction.draft;
    if (!graph || !validRef(graph.rootRef) || !Array.isArray(graph.nodes)) return reject("invalid-hierarchy");
    const layers = projectEditorLayers(session);
    if (!layers.accepted || validateCompositionGraph(graph, registry).length !== 0) return reject("invalid-hierarchy");

    const byRef = new Map<string, (typeof graph.nodes)[number]>();
    for (const node of graph.nodes) {
      if (!node || !validRef(node.ref) || !validRef(node.componentRef) ||
          !exactFields(node, node.ref === graph.rootRef ? ["ref", "componentRef"] : ["ref", "componentRef", "placement"])) {
        return reject("invalid-hierarchy");
      }
      if (node.ref !== graph.rootRef) {
        const placement = node.placement;
        if (!placement || !exactFields(placement, ["parentRef", "slotRef", "columnSpan", "rowSpan"]) ||
            !validRef(placement.parentRef) || !validRef(placement.slotRef) ||
            !validSpan(placement.columnSpan) || !validSpan(placement.rowSpan)) return reject("invalid-hierarchy");
      }
      byRef.set(node.ref, node);
    }

    let selectedRef: string | null = null;
    if (selection !== undefined) {
      if (!selection || typeof selection !== "object" || !exactFields(selection, ["selectedRef"]) ||
          (selection.selectedRef !== null &&
            (!validRef(selection.selectedRef) || !layers.nodeRefs.includes(selection.selectedRef)))) {
        return reject("invalid-selection");
      }
      const inspector = projectEditorInspector(session, selection, session.draftRevision);
      if (!inspector.accepted ||
          (selection.selectedRef === null && inspector.snapshot.kind !== "empty") ||
          (selection.selectedRef !== null &&
            (inspector.snapshot.kind !== "node" || inspector.snapshot.nodeRef !== selection.selectedRef))) {
        return reject("invalid-selection");
      }
      selectedRef = selection.selectedRef;
    }

    const nodes: EditorPreviewNode[] = [];
    const visit = (layer: EditorLayer): void => {
      const node = byRef.get(layer.nodeRef)!;
      const selected = selectedRef === node.ref;
      if (node.ref === graph.rootRef) {
        nodes.push(Object.freeze({
          kind: "root", nodeRef: node.ref, componentRef: node.componentRef,
          parentRef: null, slotRef: null, columnSpan: null, rowSpan: null, selected,
        }));
      } else {
        const placement = node.placement!;
        nodes.push(Object.freeze({
          kind: "node", nodeRef: node.ref, componentRef: node.componentRef,
          parentRef: placement.parentRef, slotRef: placement.slotRef,
          columnSpan: placement.columnSpan, rowSpan: placement.rowSpan, selected,
        }));
      }
      for (const child of layer.children) visit(child);
    };
    visit(layers.root);
    if (nodes.length !== graph.nodes.length) return reject("invalid-hierarchy");

    return Object.freeze({
      accepted: true,
      snapshot: Object.freeze({
        sessionRef: session.sessionRef, compositionRef: session.base.compositionRef,
        baseRevision: session.base.revision, draftRevision: session.draftRevision,
        rootRef: graph.rootRef, selectedRef, nodes: Object.freeze(nodes),
      }),
    });
  } catch {
    return reject("invalid-hierarchy");
  }
}

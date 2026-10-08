import type { CompositionNode, CompositionNodePlacement, CompositionNodeRef } from "@system-builder/station-composition";
import { projectEditorLayers, type LayersSelection } from "./layers.js";
import type { EditorSession } from "./session.js";

export type InspectorRejectionReason =
  | "invalid-session"
  | "invalid-revision"
  | "stale-draft-revision"
  | "invalid-hierarchy"
  | "unknown-node"
  | "no-selection"
  | "root-not-editable"
  | "invalid-span"
  | "invalid-placement";

export type InspectorSnapshot =
  | { readonly kind: "empty"; readonly draftRevision: number }
  | {
      readonly kind: "node";
      readonly draftRevision: number;
      readonly nodeRef: CompositionNodeRef;
      readonly componentRef: string;
      readonly placement: Readonly<CompositionNodePlacement> | null;
      readonly editable: boolean;
    };

export type InspectorProjectionResult =
  | { readonly accepted: true; readonly snapshot: InspectorSnapshot }
  | { readonly accepted: false; readonly reason: InspectorRejectionReason };

export type EditorStructuralEditIntent =
  | {
      readonly type: "set-span";
      readonly sessionRef: string;
      readonly compositionRef: string;
      readonly nodeRef: CompositionNodeRef;
      readonly expectedDraftRevision: number;
      readonly columnSpan: number;
      readonly rowSpan: number;
    }
  | {
      readonly type: "set-placement";
      readonly sessionRef: string;
      readonly compositionRef: string;
      readonly nodeRef: CompositionNodeRef;
      readonly expectedDraftRevision: number;
      readonly parentRef: CompositionNodeRef;
      readonly slotRef: string;
      readonly columnSpan: number;
      readonly rowSpan: number;
    };

export type EditorIntentResult =
  | { readonly accepted: true; readonly intent: EditorStructuralEditIntent }
  | { readonly accepted: false; readonly reason: InspectorRejectionReason };

type ContextResult =
  | { readonly accepted: true; readonly node: CompositionNode | null }
  | { readonly accepted: false; readonly reason: InspectorRejectionReason };

const reject = (reason: InspectorRejectionReason): { readonly accepted: false; readonly reason: InspectorRejectionReason } =>
  Object.freeze({ accepted: false, reason });
const validRef = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const validSpan = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) > 0;

/** Recheck the actual draft: a caller-supplied Layers projection is never trusted as authority. */
function resolveContext(
  session: EditorSession,
  selection: LayersSelection,
  expectedDraftRevision: number,
): ContextResult {
  if (
    !session || !validRef(session.sessionRef) || !validRef(session.base?.compositionRef) ||
    session.base.currentness !== "current" || session.draftCurrentness !== "current" ||
    session.authority !== "station-draft-projection" ||
    !Number.isSafeInteger(session.draftRevision) || session.draftRevision < 0 ||
    !Array.isArray(session.transaction?.findings) || session.transaction.findings.length !== 0
  ) return reject("invalid-session");
  if (!Number.isSafeInteger(expectedDraftRevision) || expectedDraftRevision < 0) return reject("invalid-revision");
  if (expectedDraftRevision !== session.draftRevision) return reject("stale-draft-revision");

  try {
    const layers = projectEditorLayers(session);
    if (!layers.accepted) return reject("invalid-hierarchy");
    const graph = session.transaction.draft;
    for (const node of graph.nodes) {
      if (node.ref === graph.rootRef) {
        if (node.placement !== undefined) return reject("invalid-hierarchy");
      } else {
        const placement = node.placement;
        if (!placement || !validRef(placement.parentRef) || !validRef(placement.slotRef) ||
          !validSpan(placement.columnSpan) || !validSpan(placement.rowSpan)) return reject("invalid-hierarchy");
      }
    }
    const selectedRef: unknown = selection?.selectedRef;
    if (selectedRef === null) return Object.freeze({ accepted: true, node: null });
    if (!validRef(selectedRef) || !layers.nodeRefs.includes(selectedRef)) return reject("unknown-node");
    const node = graph.nodes.find((item) => item.ref === selectedRef);
    return node ? Object.freeze({ accepted: true, node }) : reject("unknown-node");
  } catch {
    return reject("invalid-hierarchy");
  }
}

/** Immutable selected-node properties from the same Station-owned draft as Layers. */
export function projectEditorInspector(
  session: EditorSession,
  selection: LayersSelection,
  expectedDraftRevision: number,
): InspectorProjectionResult {
  const context = resolveContext(session, selection, expectedDraftRevision);
  if (!context.accepted) return context;
  if (!context.node) return Object.freeze({
    accepted: true,
    snapshot: Object.freeze({ kind: "empty", draftRevision: expectedDraftRevision }),
  });
  const node = context.node;
  return Object.freeze({
    accepted: true,
    snapshot: Object.freeze({
      kind: "node",
      draftRevision: expectedDraftRevision,
      nodeRef: node.ref,
      componentRef: node.componentRef,
      placement: node.placement ? Object.freeze({ ...node.placement }) : null,
      editable: node.ref !== session.transaction.draft.rootRef,
    }),
  });
}

function editableNode(
  session: EditorSession,
  selection: LayersSelection,
  expectedDraftRevision: number,
): ContextResult {
  const context = resolveContext(session, selection, expectedDraftRevision);
  if (!context.accepted) return context;
  if (!context.node) return reject("no-selection");
  if (context.node.ref === session.transaction.draft.rootRef) return reject("root-not-editable");
  return context;
}

/** Proposal only: registry compatibility and mutation belong to WP1-D. */
export function createEditorSetSpanIntent(
  session: EditorSession,
  selection: LayersSelection,
  expectedDraftRevision: number,
  spans: Pick<CompositionNodePlacement, "columnSpan" | "rowSpan">,
): EditorIntentResult {
  const context = editableNode(session, selection, expectedDraftRevision);
  if (!context.accepted) return context;
  if (!validSpan(spans?.columnSpan) || !validSpan(spans?.rowSpan)) return reject("invalid-span");
  return Object.freeze({ accepted: true, intent: Object.freeze({
    type: "set-span",
    sessionRef: session.sessionRef,
    compositionRef: session.base.compositionRef,
    nodeRef: context.node!.ref,
    expectedDraftRevision,
    columnSpan: spans.columnSpan,
    rowSpan: spans.rowSpan,
  }) });
}

/** Proposal only; rejects unknown/cyclic parent references without performing placement. */
export function createEditorSetPlacementIntent(
  session: EditorSession,
  selection: LayersSelection,
  expectedDraftRevision: number,
  placement: CompositionNodePlacement,
): EditorIntentResult {
  const context = editableNode(session, selection, expectedDraftRevision);
  if (!context.accepted) return context;
  if (!validSpan(placement?.columnSpan) || !validSpan(placement?.rowSpan)) return reject("invalid-span");
  if (!validRef(placement?.parentRef) || !validRef(placement?.slotRef)) return reject("invalid-placement");
  const nodes = new Map(session.transaction.draft.nodes.map((node) => [node.ref, node]));
  if (!nodes.has(placement.parentRef)) return reject("invalid-placement");
  const visited = new Set<string>();
  let parentRef: string | undefined = placement.parentRef;
  while (parentRef !== undefined) {
    if (parentRef === context.node!.ref || visited.has(parentRef)) return reject("invalid-placement");
    visited.add(parentRef);
    parentRef = nodes.get(parentRef)?.placement?.parentRef;
  }
  return Object.freeze({ accepted: true, intent: Object.freeze({
    type: "set-placement",
    sessionRef: session.sessionRef,
    compositionRef: session.base.compositionRef,
    nodeRef: context.node!.ref,
    expectedDraftRevision,
    parentRef: placement.parentRef,
    slotRef: placement.slotRef,
    columnSpan: placement.columnSpan,
    rowSpan: placement.rowSpan,
  }) });
}

import { validateCompositionGraph, type ComponentRegistry, type CompositionNodePlacement } from "@system-builder/station-composition";
import { projectEditorInspector, type EditorStructuralEditIntent } from "./inspector.js";
import { projectEditorLayers, type LayersSelection } from "./layers.js";
import { applyEditorSessionMutation, type EditorSession } from "./session.js";

export type EditorStructuralEditRejectionReason =
  | "invalid-session" | "invalid-intent" | "stale-draft-revision" | "selection-mismatch"
  | "unknown-node" | "root-not-editable" | "invalid-span" | "invalid-placement"
  | "invalid-hierarchy" | "invalid-mutation";

export type EditorStructuralEditResult =
  | { readonly accepted: true; readonly changed: boolean; readonly session: EditorSession }
  | { readonly accepted: false; readonly reason: EditorStructuralEditRejectionReason; readonly session: EditorSession };

const validRef = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
const validSpan = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;

function reject(session: EditorSession, reason: EditorStructuralEditRejectionReason): EditorStructuralEditResult {
  return Object.freeze({ accepted: false, reason, session });
}

function exactFields(value: object, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const fields = [...expected].sort();
  return actual.length === fields.length && actual.every((field, index) => field === fields[index]);
}

/** Apply a proposed structural edit to the one Station-owned draft, never canonical/business state. */
export function applyEditorStructuralEditIntent(
  session: EditorSession,
  selection: LayersSelection,
  intent: EditorStructuralEditIntent,
  registry: ComponentRegistry,
): EditorStructuralEditResult {
  try {
    if (!session || typeof session !== "object" ||
        !validRef(session.sessionRef) || !validRef(session.base?.applicationRef) ||
        !validRef(session.base?.compositionRef) ||
        new Set([session.sessionRef, session.base.applicationRef, session.base.compositionRef]).size !== 3 ||
        !Number.isSafeInteger(session.base.revision) || session.base.revision < 0 ||
        session.base.currentness !== "current" || session.draftCurrentness !== "current" ||
        session.authority !== "station-draft-projection" ||
        !Number.isSafeInteger(session.draftRevision) || session.draftRevision < 0 ||
        !session.transaction || !Array.isArray(session.transaction.findings) ||
        session.transaction.findings.length !== 0 ||
        !registry || typeof registry.get !== "function") return reject(session, "invalid-session");

    if (!intent || typeof intent !== "object" ||
        (intent.type !== "set-span" && intent.type !== "set-placement")) return reject(session, "invalid-intent");
    const common = ["type", "sessionRef", "compositionRef", "nodeRef", "expectedDraftRevision", "columnSpan", "rowSpan"];
    const fields = intent.type === "set-placement" ? [...common, "parentRef", "slotRef"] : common;
    if (!exactFields(intent, fields) || !validRef(intent.sessionRef) ||
        !validRef(intent.compositionRef) || !validRef(intent.nodeRef)) return reject(session, "invalid-intent");

    if (!Number.isSafeInteger(intent.expectedDraftRevision) || intent.expectedDraftRevision < 0 ||
        intent.expectedDraftRevision !== session.draftRevision) return reject(session, "stale-draft-revision");
    if (intent.sessionRef !== session.sessionRef ||
        intent.compositionRef !== session.base.compositionRef ||
        !selection || selection.selectedRef !== intent.nodeRef) return reject(session, "selection-mismatch");

    const inspector = projectEditorInspector(session, selection, intent.expectedDraftRevision);
    if (!inspector.accepted) {
      if (inspector.reason === "stale-draft-revision") return reject(session, "stale-draft-revision");
      if (inspector.reason === "invalid-hierarchy") return reject(session, "invalid-hierarchy");
      return reject(session, inspector.reason === "invalid-session" ? "invalid-session" : "unknown-node");
    }
    if (inspector.snapshot.kind !== "node") return reject(session, "unknown-node");
    if (!inspector.snapshot.editable) return reject(session, "root-not-editable");
    if (!validSpan(intent.columnSpan) || !validSpan(intent.rowSpan)) return reject(session, "invalid-span");

    const graph = session.transaction.draft;
    const layers = projectEditorLayers(session);
    if (!layers.accepted || validateCompositionGraph(graph, registry).length !== 0) {
      return reject(session, "invalid-hierarchy");
    }
    const node = graph.nodes.find((entry) => entry.ref === intent.nodeRef);
    if (!node || !node.placement) return reject(session, "unknown-node");

    let placement: CompositionNodePlacement;
    if (intent.type === "set-span") {
      placement = { ...node.placement, columnSpan: intent.columnSpan, rowSpan: intent.rowSpan };
    } else {
      if (!validRef(intent.parentRef) || !validRef(intent.slotRef)) return reject(session, "invalid-placement");
      const byRef = new Map(graph.nodes.map((entry) => [entry.ref, entry]));
      if (!byRef.has(intent.parentRef)) return reject(session, "invalid-placement");
      const visited = new Set<string>();
      let parent: string | undefined = intent.parentRef;
      while (parent !== undefined) {
        if (parent === intent.nodeRef || visited.has(parent)) return reject(session, "invalid-placement");
        visited.add(parent);
        parent = byRef.get(parent)?.placement?.parentRef;
      }
      placement = {
        parentRef: intent.parentRef, slotRef: intent.slotRef,
        columnSpan: intent.columnSpan, rowSpan: intent.rowSpan,
      };
    }

    if (placement.parentRef === node.placement.parentRef &&
        placement.slotRef === node.placement.slotRef &&
        placement.columnSpan === node.placement.columnSpan &&
        placement.rowSpan === node.placement.rowSpan) {
      return Object.freeze({ accepted: true, changed: false, session });
    }

    // A changed edit must never overflow the safe-integer draft revision range.
    // Equivalent no-ops above remain valid because they do not increment revision.
    if (session.draftRevision === Number.MAX_SAFE_INTEGER) return reject(session, "invalid-session");

    const result = applyEditorSessionMutation(session, intent.expectedDraftRevision, {
      type: "replace-node", node: { ...node, placement },
    }, registry);
    if (!result.accepted) return reject(session, "invalid-mutation");
    if (!projectEditorLayers(result.session).accepted ||
        validateCompositionGraph(result.session.transaction.draft, registry).length !== 0) {
      return reject(session, "invalid-hierarchy");
    }
    return Object.freeze({ accepted: true, changed: result.changed, session: result.session });
  } catch {
    return reject(session, "invalid-mutation");
  }
}

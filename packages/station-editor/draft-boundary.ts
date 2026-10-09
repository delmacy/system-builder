import {
  createCompositionDraftTransaction, projectCompositionPreview, validateCompositionGraph,
  type ComponentRegistry, type CompositionGraph,
} from "@system-builder/station-composition";
import { projectEditorLayers } from "./layers.js";
import type { EditorSession } from "./session.js";

export type EditorDraftBoundaryRejectionReason =
  | "invalid-session" | "stale-draft-revision" | "invalid-composition";

export type EditorDraftAcceptResult =
  | { readonly accepted: true; readonly changed: boolean; readonly session: EditorSession;
      readonly acceptedComposition: CompositionGraph }
  | { readonly accepted: false; readonly reason: EditorDraftBoundaryRejectionReason;
      readonly session: EditorSession };

export type EditorDraftDiscardResult =
  | { readonly accepted: true; readonly changed: boolean; readonly session: EditorSession }
  | { readonly accepted: false; readonly reason: EditorDraftBoundaryRejectionReason;
      readonly session: EditorSession };

const ref = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
const revision = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const span = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;
function fields(value: object, expected: readonly string[]): boolean {
  const actual = Reflect.ownKeys(value);
  return actual.length === expected.length &&
    expected.every((key) => actual.includes(key));
}
function validGraph(graph: CompositionGraph, registry: ComponentRegistry, session: EditorSession): boolean {
  if (!graph || typeof graph !== "object" || !fields(graph, ["rootRef", "nodes"]) ||
      !ref(graph.rootRef) || !Array.isArray(graph.nodes)) return false;
  for (const node of graph.nodes) {
    if (!node || typeof node !== "object" || !ref(node.ref) || !ref(node.componentRef) ||
        !fields(node, node.ref === graph.rootRef ? ["ref", "componentRef"] :
          ["ref", "componentRef", "placement"])) return false;
    if (node.ref !== graph.rootRef) {
      const placement = node.placement;
      if (!placement || typeof placement !== "object" ||
          !fields(placement, ["parentRef", "slotRef", "columnSpan", "rowSpan"]) ||
          !ref(placement.parentRef) || !ref(placement.slotRef) ||
          !span(placement.columnSpan) || !span(placement.rowSpan)) return false;
    }
  }
  if (validateCompositionGraph(graph, registry).length !== 0) return false;
  return projectEditorLayers({ ...session, transaction: { ...session.transaction, draft: graph } }).accepted;
}
function validate(
  session: EditorSession, expectedDraftRevision: number, registry: ComponentRegistry,
): EditorDraftBoundaryRejectionReason | null {
  if (!session || typeof session !== "object" ||
      !fields(session, ["sessionRef", "base", "draftRevision", "draftCurrentness", "transaction", "authority"]) ||
      !ref(session.sessionRef) || !session.base || typeof session.base !== "object" ||
      !fields(session.base, ["applicationRef", "compositionRef", "revision", "currentness"]) ||
      !ref(session.base.applicationRef) || !ref(session.base.compositionRef) ||
      new Set([session.sessionRef, session.base.applicationRef, session.base.compositionRef]).size !== 3 ||
      !revision(session.base.revision) || session.base.currentness !== "current" ||
      !revision(session.draftRevision) || session.draftRevision < session.base.revision ||
      session.draftCurrentness !== "current" || session.authority !== "station-draft-projection" ||
      !session.transaction || typeof session.transaction !== "object" ||
      !fields(session.transaction, ["base", "draft", "findings", "dirty"]) ||
      !Array.isArray(session.transaction.findings) || session.transaction.findings.length !== 0 ||
      typeof session.transaction.dirty !== "boolean" ||
      !registry || typeof registry.get !== "function") return "invalid-session";
  if (!revision(expectedDraftRevision) || expectedDraftRevision !== session.draftRevision)
    return "stale-draft-revision";
  if (!validGraph(session.transaction.base, registry, session) ||
      !validGraph(session.transaction.draft, registry, session) ||
      session.transaction.dirty !==
        (JSON.stringify(session.transaction.base) !== JSON.stringify(session.transaction.draft)))
    return "invalid-composition";
  return null;
}
function reject<T extends EditorDraftAcceptResult | EditorDraftDiscardResult>(
  session: EditorSession, reason: EditorDraftBoundaryRejectionReason,
): T {
  return Object.freeze({ accepted: false, reason, session }) as T;
}

/** Station-local acceptance only: never an external persistence receipt or business command. */
export function acceptEditorDraft(
  session: EditorSession, expectedDraftRevision: number, registry: ComponentRegistry,
): EditorDraftAcceptResult {
  try {
    const reason = validate(session, expectedDraftRevision, registry);
    if (reason) return reject(session, reason);
    const dirty = session.transaction.dirty;
    if (dirty && session.draftRevision === Number.MAX_SAFE_INTEGER)
      return reject(session, "invalid-session");
    const clean = createCompositionDraftTransaction(session.transaction.draft, registry);
    const acceptedComposition = projectCompositionPreview(clean);
    if (!dirty) return Object.freeze({
      accepted: true, changed: false, session, acceptedComposition,
    });
    return Object.freeze({
      accepted: true, changed: true, acceptedComposition,
      session: Object.freeze({
        ...session, draftRevision: session.draftRevision + 1, transaction: clean,
      }),
    });
  } catch {
    return reject(session, "invalid-composition");
  }
}

/** Discard restores the Station-local baseline; it is not a business rollback. */
export function discardEditorDraft(
  session: EditorSession, expectedDraftRevision: number, registry: ComponentRegistry,
): EditorDraftDiscardResult {
  try {
    const reason = validate(session, expectedDraftRevision, registry);
    if (reason) return reject(session, reason);
    if (!session.transaction.dirty) return Object.freeze({
      accepted: true, changed: false, session,
    });
    if (session.draftRevision === Number.MAX_SAFE_INTEGER)
      return reject(session, "invalid-session");
    const clean = createCompositionDraftTransaction(session.transaction.base, registry);
    return Object.freeze({
      accepted: true, changed: true,
      session: Object.freeze({
        ...session, draftRevision: session.draftRevision + 1, transaction: clean,
      }),
    });
  } catch {
    return reject(session, "invalid-composition");
  }
}

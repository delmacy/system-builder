import { createCompositionDraftTransaction, type ComponentRegistry, type CompositionGraph } from "@system-builder/station-composition";
import { acceptEditorDraft } from "./draft-boundary.js";
import { applyEditorStructuralEditIntent } from "./edit.js";
import type { EditorStructuralEditIntent } from "./inspector.js";
import type { LayersSelection } from "./layers.js";
import type { EditorSession } from "./session.js";

export const EDITOR_HISTORY_LIMIT = 50;
/** Mounted-session presentation state only; never part of a portable artifact. */
export interface EditorHistory {
  readonly session: EditorSession;
  readonly past: readonly CompositionGraph[];
  readonly future: readonly CompositionGraph[];
}
export type EditorHistoryResult =
  | { readonly accepted: true; readonly changed: boolean; readonly history: EditorHistory }
  | { readonly accepted: false; readonly reason: "invalid-history" | "stale-draft-revision" | "invalid-edit" | "revision-overflow"; readonly history: EditorHistory };
const same = (a: CompositionGraph, b: CompositionGraph): boolean => JSON.stringify(a) === JSON.stringify(b);
const wrap = (session: EditorSession, past: readonly CompositionGraph[], future: readonly CompositionGraph[]): EditorHistory =>
  Object.freeze({ session, past: Object.freeze([...past]), future: Object.freeze([...future]) });
/** Call after a successful explicit checkpoint/open; failed operations keep the previous wrapper. */
export function createEditorHistory(session: EditorSession): EditorHistory { return wrap(session, [], []); }
function topology(graph: CompositionGraph): string {
  return JSON.stringify({ rootRef: graph.rootRef, nodes: graph.nodes.map(node => ({ ref: node.ref,
    componentRef: node.componentRef, ...(node.placement ? { parentRef: node.placement.parentRef, slotRef: node.placement.slotRef } : {}) })) });
}
function restored(session: EditorSession, graph: CompositionGraph, registry: ComponentRegistry, revision: number): EditorSession {
  const draft = createCompositionDraftTransaction(graph, registry).draft;
  return Object.freeze({ ...session, draftRevision: revision, transaction: Object.freeze({
    base: session.transaction.base, draft, findings: Object.freeze([]), dirty: !same(session.transaction.base, draft),
  }) });
}
function valid(history: EditorHistory, registry: ComponentRegistry): boolean {
  if (!history || typeof history !== "object" || Reflect.ownKeys(history).length !== 3 ||
      !Array.isArray(history.past) || !Array.isArray(history.future) ||
      history.past.length + history.future.length > EDITOR_HISTORY_LIMIT ||
      !acceptEditorDraft(history.session, history.session?.draftRevision, registry).accepted) return false;
  const session = history.session;
  const expected = topology(session.transaction.base);
  if (topology(session.transaction.draft) !== expected) return false;
  for (const graph of [...history.past, ...history.future]) {
    if (topology(graph) !== expected) return false;
    // Validate the original snapshot before snapshotting can drop unknown fields.
    const candidate = { ...session, transaction: { base: session.transaction.base, draft: graph,
      findings: [], dirty: !same(session.transaction.base, graph) } } as EditorSession;
    if (!acceptEditorDraft(candidate, session.draftRevision, registry).accepted) return false;
  }
  return true;
}
const rejected = (history: EditorHistory, reason: "invalid-history" | "stale-draft-revision" | "invalid-edit" | "revision-overflow"): EditorHistoryResult =>
  Object.freeze({ accepted: false, reason, history });
const accepted = (history: EditorHistory, changed: boolean): EditorHistoryResult => Object.freeze({ accepted: true, changed, history });

export function applyEditorHistoryEdit(history: EditorHistory, selection: LayersSelection,
  intent: EditorStructuralEditIntent, registry: ComponentRegistry): EditorHistoryResult {
  try {
    if (!valid(history, registry)) return rejected(history, "invalid-history");
    if (intent?.expectedDraftRevision !== history.session.draftRevision) return rejected(history, "stale-draft-revision");
    if (intent.type !== "set-span") return rejected(history, "invalid-edit");
    const result = applyEditorStructuralEditIntent(history.session, selection, intent, registry);
    if (!result.accepted) return rejected(history, "invalid-edit");
    if (!result.changed) return accepted(history, false);
    return accepted(wrap(result.session, [...history.past, history.session.transaction.draft].slice(-EDITOR_HISTORY_LIMIT), []), true);
  } catch { return rejected(history, "invalid-history"); }
}
/** Undo/redo never rewinds revision or changes the accepted baseline. Empty stacks are idempotent. */
export function moveEditorHistory(history: EditorHistory, direction: "undo" | "redo",
  expectedDraftRevision: number, registry: ComponentRegistry): EditorHistoryResult {
  try {
    if (!valid(history, registry) || (direction !== "undo" && direction !== "redo")) return rejected(history, "invalid-history");
    const session = history.session;
    if (expectedDraftRevision !== session.draftRevision) return rejected(history, "stale-draft-revision");
    const stack = direction === "undo" ? history.past : history.future;
    const target = stack.at(-1);
    if (!target) return accepted(history, false);
    if (session.draftRevision === Number.MAX_SAFE_INTEGER) return rejected(history, "revision-overflow");
    const next = restored(session, target, registry, session.draftRevision + 1);
    if (!acceptEditorDraft(next, next.draftRevision, registry).accepted) return rejected(history, "invalid-history");
    return accepted(direction === "undo"
      ? wrap(next, history.past.slice(0, -1), [...history.future, session.transaction.draft])
      : wrap(next, [...history.past, session.transaction.draft], history.future.slice(0, -1)), true);
  } catch { return rejected(history, "invalid-history"); }
}

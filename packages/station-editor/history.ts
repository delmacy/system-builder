import { createCompositionDraftTransaction, ComponentRegistry, type CompositionGraph } from "@system-builder/station-composition";
import { acceptEditorDraft } from "./draft-boundary.js";
import { applyEditorStructuralEditIntent } from "./edit.js";
import type { EditorStructuralEditIntent } from "./inspector.js";
import type { LayersSelection } from "./layers.js";
import type { EditorSession } from "./session.js";

import { applyEditorStructure, validateEditorAuthoredGraph, type EditorStructureIntent } from "./structure.js";

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
// Ownership is private and weak: caller copies never inherit a validation certificate.
const ownedHistories = new WeakSet<EditorHistory>();
const ownedGraphs = new WeakSet<CompositionGraph>();
interface SnapshotContext {
  readonly registry: ComponentRegistry;
  readonly registryText: string;
  readonly baseline: CompositionGraph;
  readonly base: EditorSession["base"];
  readonly sessionText: string;
}
const certificates = new WeakMap<CompositionGraph, SnapshotContext>();
const registryPrototype = ComponentRegistry.prototype;
const registryGet = registryPrototype.get;
const registryList = registryPrototype.list;
// Shallow freezing is insufficient; inspect data descriptors without invoking accessors.
function immutableData(value: unknown, seen = new WeakSet<object>()): boolean {
  if (value === null || typeof value !== "object") return typeof value !== "function" && typeof value !== "symbol";
  if (seen.has(value)) return true;
  if (!Object.isFrozen(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== Array.prototype && prototype !== null) return false;
  seen.add(value);
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string") return false;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !("value" in descriptor) || !immutableData(descriptor.value, seen)) return false;
  }
  return true;
}
function snapshotContext(session: EditorSession, registry: ComponentRegistry): SnapshotContext | null {
  // A frozen registry still has a mutable private Map. Include actual membership/content,
  // and bypass reuse for custom getters, subclasses or replaced prototype methods.
  if (Object.getPrototypeOf(registry) !== registryPrototype || Reflect.ownKeys(registry).length !== 0 ||
      registry.get !== registryGet || registry.list !== registryList ||
      !immutableData(session.base) || !immutableData(session.transaction.base)) return null;
  const descriptors = registry.list();
  if (!immutableData(descriptors)) return null;
  return { registry, registryText: JSON.stringify(descriptors), baseline: session.transaction.base,
    base: session.base, sessionText: JSON.stringify([session.sessionRef, session.base,
      session.transaction.base, session.draftRevision === Number.MAX_SAFE_INTEGER]) };
}
function sameContext(a: SnapshotContext, b: SnapshotContext): boolean {
  return a.registry === b.registry && a.registryText === b.registryText &&
    a.baseline === b.baseline && a.base === b.base && a.sessionText === b.sessionText;
}
function rememberProducedGraph(graph: CompositionGraph): void {
  // Only graphs normalized by a successful internal edit/restore reach this function.
  // Never freeze caller-owned input, nor certify createEditorHistory's input graph.
  if (immutableData(graph)) ownedGraphs.add(graph);
}
function wrap(session: EditorSession, past: readonly CompositionGraph[], future: readonly CompositionGraph[]): EditorHistory {
  const history = Object.freeze({ session, past: Object.freeze([...past]), future: Object.freeze([...future]) });
  ownedHistories.add(history);
  return history;
}
/** Call after a successful explicit checkpoint/open; failed operations keep the previous wrapper. */
export function createEditorHistory(session: EditorSession): EditorHistory { return wrap(session, [], []); }
function restored(session: EditorSession, graph: CompositionGraph, registry: ComponentRegistry, revision: number): EditorSession {
  const draft = createCompositionDraftTransaction(graph, registry).draft;
  rememberProducedGraph(draft);
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
  if (!validateEditorAuthoredGraph(session.transaction.draft, session, registry)) return false;
  const context = ownedHistories.has(history) ? snapshotContext(session, registry) : null;
  for (const graph of [...history.past, ...history.future]) {
    const certificate = context && ownedGraphs.has(graph) ? certificates.get(graph) : undefined;
    if (certificate && context && sameContext(certificate, context)) continue;
    if (!validateEditorAuthoredGraph(graph, session, registry)) return false;
    // Validate the original snapshot before snapshotting can drop unknown fields.
    const candidate = { ...session, transaction: { base: session.transaction.base, draft: graph,
      findings: [], dirty: !same(session.transaction.base, graph) } } as EditorSession;
    if (!acceptEditorDraft(candidate, session.draftRevision, registry).accepted) return false;
    if (context && ownedGraphs.has(graph)) certificates.set(graph, context);
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
    rememberProducedGraph(result.session.transaction.draft);
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

/** Structural commands share exactly the same ephemeral history/checkpoint lifecycle as span edits. */
export function applyEditorHistoryStructure(history: EditorHistory, intent: EditorStructureIntent,
  registry: ComponentRegistry): EditorHistoryResult {
  try {
    if (!valid(history, registry)) return rejected(history, "invalid-history");
    const result = applyEditorStructure(history.session, intent, registry);
    if (!result.accepted) return rejected(history, result.reason);
    if (!result.changed) return accepted(history, false);
    rememberProducedGraph(result.session.transaction.draft);
    return accepted(wrap(result.session, [...history.past, history.session.transaction.draft].slice(-EDITOR_HISTORY_LIMIT), []), true);
  } catch { return rejected(history, "invalid-history"); }
}

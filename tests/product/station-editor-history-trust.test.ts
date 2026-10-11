import assert from "node:assert/strict";
import test from "node:test";
import { ComponentRegistry } from "../../packages/station-composition/index.js";
import { initializeCatalogEditorSession } from "../../apps/station/web/app/station-editor-catalog.js";
import { applyEditorHistoryEdit, applyEditorHistoryStructure, createEditorHistory, createEditorSetSpanIntent,
  moveEditorHistory, type EditorHistory, type EditorHistoryResult } from "../../packages/station-editor/index.js";

type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> };
function clone<T>(value: T): Mutable<T> { return structuredClone(value) as Mutable<T>; }

function setup() {
  const result = initializeCatalogEditorSession("composition:example", "session:wp6-trust");
  if (!result.accepted) throw Error("catalog");
  return { history: createEditorHistory(result.session), registry: result.entry.registry, session: result.session,
    descriptors: result.entry.descriptors };
}
function ok(result: EditorHistoryResult): EditorHistory {
  assert.equal(result.accepted, true);
  if (!result.accepted) throw Error("history rejected");
  return result.history;
}
function reject(history: EditorHistory, registry: ComponentRegistry) {
  const before = JSON.stringify(history);
  const result = moveEditorHistory(history, "undo", history.session.draftRevision, registry);
  assert.equal(result.accepted, false);
  assert.strictEqual(result.history, history);
  assert.equal(JSON.stringify(history), before);
}
function edit(history: EditorHistory, registry: ComponentRegistry, columnSpan: number) {
  const selection = { selectedRef: "node:button-1" };
  const intent = createEditorSetSpanIntent(history.session, selection, history.session.draftRevision, { columnSpan, rowSpan: 1 });
  if (!intent.accepted) throw Error("intent");
  return ok(applyEditorHistoryEdit(history, selection, intent.intent, registry));
}
function warm() {
  const initial = setup(); let history = initial.history;
  for (let i = 0; i < 8; i++) history = edit(history, initial.registry, i % 2 ? 2 : 3);
  return { ...initial, history };
}
function withMarker(registry: ComponentRegistry, initial: EditorHistory) {
  const descriptor = registry.get("component:button");
  if (!descriptor) throw Error("descriptor");
  registry.register({ ...descriptor, id: "component:wp6-marker" });
  let history = ok(applyEditorHistoryStructure(initial, { type: "add-node", nodeRef: "node:marker",
    componentRef: "component:wp6-marker", parentRef: "node:root", slotRef: "content",
    sessionRef: initial.session.sessionRef, compositionRef: initial.session.base.compositionRef,
    expectedDraftRevision: initial.session.draftRevision }, registry));
  history = edit(history, registry, 3); history = edit(history, registry, 2);
  return ok(applyEditorHistoryStructure(history, { type: "remove-subtree", nodeRef: "node:marker",
    sessionRef: history.session.sessionRef, compositionRef: history.session.base.compositionRef,
    expectedDraftRevision: history.session.draftRevision }, registry));
}

test("WP6 warm history preserves branching, immutable snapshots and monotonically increasing revisions", () => {
  const initial = warm(); let history = initial.history; const registry = initial.registry;
  const original = history; const before = JSON.stringify(original);
  for (let i = 0; i < 8; i++) history = ok(moveEditorHistory(history, "undo", history.session.draftRevision, registry));
  assert.equal(history.session.transaction.dirty, false);
  assert.equal(history.session.draftRevision, original.session.draftRevision + 8);
  for (let i = 0; i < 8; i++) history = ok(moveEditorHistory(history, "redo", history.session.draftRevision, registry));
  assert.equal(history.session.draftRevision, original.session.draftRevision + 16);
  assert.equal(JSON.stringify(original), before);
  history = ok(moveEditorHistory(history, "undo", history.session.draftRevision, registry));
  history = edit(history, registry, 4); assert.equal(history.future.length, 0);
  assert.deepEqual(Object.keys(history).sort(), ["future", "past", "session"]);
});
test("WP6 mutable caller copies cannot inherit a successful snapshot validation", () => {
  const { history, registry } = warm(); const copy = clone(history);
  assert.equal(moveEditorHistory(copy, "undo", copy.session.draftRevision, registry).accepted, true);
  copy.past[0]!.nodes[1]!.placement!.columnSpan = 999;
  reject(copy, registry); assert.equal(Object.isFrozen(copy.past[0]!.nodes[1]!.placement), false);
});
test("WP6 frozen caller wrappers and unknown string/symbol snapshot fields fail closed", () => {
  const { history, registry } = warm();
  for (const key of ["foreign", Symbol("foreign")]) {
    const graph = Object.freeze({ ...history.past[1]!, [key]: true });
    const copy = Object.freeze({ ...history, past: Object.freeze([graph]) });
    reject(copy, registry);
  }
});
test("WP6 frozen accessors and mutable nested placement never become trusted snapshots", () => {
  const { history, registry } = warm();
  const graph = clone(history.past[1]!);
  let columns = 2;
  Object.defineProperty(graph.nodes[1]!.placement!, "columnSpan", { enumerable: true, get: () => columns });
  Object.freeze(graph.nodes[1]!.placement);
  const copy = Object.freeze({ ...history, past: Object.freeze([Object.freeze(graph)]) });
  reject(copy, registry);
  columns = 999; reject(copy, registry);
});
test("WP6 registry method replacement cannot reuse a past-only component verdict", () => {
  const initial = setup(); const history = withMarker(initial.registry, initial.history);
  assert.equal(history.session.transaction.draft.nodes.some(n => n.ref === "node:marker"), false);
  const get = initial.registry.get.bind(initial.registry);
  initial.registry.get = id => id === "component:wp6-marker" ? null : get(id);
  reject(history, initial.registry);
  delete (initial.registry as unknown as Record<string, unknown>).get;
  const restored = ok(moveEditorHistory(history, "undo", history.session.draftRevision, initial.registry));
  assert.equal(restored.session.transaction.draft.nodes.some(n => n.ref === "node:marker"), true);
});
test("WP6 stateful custom registries always validate historical snapshots again", () => {
  const initial = setup(); let markerAvailable = true;
  class CustomRegistry extends ComponentRegistry {
    override get(id: string) { return id === "component:wp6-marker" && !markerAvailable ? null : super.get(id); }
  }
  const registry = new CustomRegistry(initial.descriptors);
  const history = withMarker(registry, initial.history);
  assert.equal(moveEditorHistory(history, "undo", history.session.draftRevision, registry).accepted, true);
  markerAvailable = false; reject(history, registry);
  markerAvailable = true;
  assert.equal(moveEditorHistory(history, "undo", history.session.draftRevision, registry).accepted, true);
});
test("WP6 frozen registry private membership changes and different registries retain normal admission", () => {
  const { history, registry, descriptors } = warm(); Object.freeze(registry);
  const descriptor = registry.get("component:button"); if (!descriptor) throw Error("descriptor");
  registry.register({ ...descriptor, id: "component:later" });
  let restored = ok(moveEditorHistory(history, "undo", history.session.draftRevision, registry));
  const alternate = new ComponentRegistry(descriptors);
  restored = ok(moveEditorHistory(restored, "redo", restored.session.draftRevision, alternate));
  assert.deepEqual(restored.session.transaction.draft, history.session.transaction.draft);
});
test("WP6 mutable session context remains caller-owned and stale/source/overflow failures remain atomic", () => {
  const initial = setup(); const session = clone(initial.session);
  let history = createEditorHistory(session);
  history = edit(history, initial.registry, 3); history = edit(history, initial.registry, 2);
  assert.equal(Object.isFrozen(session.base), false);
  session.base.currentness = "stale"; reject(history, initial.registry);
  const warmed = warm();
  const overflow = { ...warmed.history, session: { ...warmed.history.session, draftRevision: Number.MAX_SAFE_INTEGER } };
  reject(overflow, warmed.registry);
  const foreign = { ...warmed.history, session: { ...warmed.history.session,
    transaction: { ...warmed.history.session.transaction,
      base: { ...warmed.history.session.transaction.base, rootRef: "node:foreign" } } } };
  reject(foreign, warmed.registry);
});

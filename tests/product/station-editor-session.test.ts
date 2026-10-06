import assert from "node:assert/strict";
import test from "node:test";

import { COMPONENT_FAMILIES, ComponentRegistry, defineCompositionGraph } from "../../packages/station-composition/index.js";
import { applyEditorSessionMutation, initializeEditorSession } from "../../packages/station-editor/index.js";

const atomic = { id: "component:button", family: "atomic", layout: "none", childPolicy: "none", constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2, minRows: 1, maxRows: 2, recommendedRows: 1 }, slots: [] } as const;
const layout = { id: "component:grid", family: "layout-container", layout: "grid", layoutOwnership: "self", childPolicy: "multiple", constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12, minRows: 1, maxRows: 12, recommendedRows: 4 }, slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: [...COMPONENT_FAMILIES] }] } as const;
const registry = new ComponentRegistry([layout, atomic]);
const composition = defineCompositionGraph({ rootRef: "node:root", nodes: [{ ref: "node:root", componentRef: "component:grid" }, { ref: "node:button", componentRef: "component:button", placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } }] });
const valid = { sessionRef: "editor-session:1", base: { applicationRef: "application:demo", compositionRef: "composition:demo", revision: 7, currentness: "current" as const }, composition };

test("TASK-636 initializes the same valid editor session deterministically and idempotently", () => {
  const first = initializeEditorSession(valid, registry);
  const second = initializeEditorSession(valid, registry);
  assert.deepEqual(first, second);
  assert.equal(first.accepted, true);
  if (!first.accepted) return;
  assert.equal(first.session.draftRevision, 7);
  assert.equal(first.session.draftCurrentness, "current");
  assert.equal(first.session.transaction.dirty, false);
});

test("TASK-636 keeps editor-session, composition and application identities distinct", () => {
  const result = initializeEditorSession(valid, registry);
  assert.equal(result.accepted, true);
  if (!result.accepted) return;
  assert.notEqual(result.session.sessionRef, result.session.base.compositionRef);
  assert.notEqual(result.session.sessionRef, result.session.base.applicationRef);
  assert.notEqual(result.session.base.compositionRef, result.session.base.applicationRef);
});

test("TASK-636 rejects malformed, colliding, stale, unknown and invalid revisions before draft creation", () => {
  assert.deepEqual(initializeEditorSession({ ...valid, sessionRef: "" }, registry), { accepted: false, currentness: "current", reason: "malformed-reference" });
  assert.deepEqual(initializeEditorSession({ ...valid, sessionRef: valid.base.compositionRef }, registry), { accepted: false, currentness: "current", reason: "identity-collision" });
  assert.deepEqual(initializeEditorSession({ ...valid, base: { ...valid.base, revision: -1 } }, registry), { accepted: false, currentness: "current", reason: "invalid-revision" });
  assert.deepEqual(initializeEditorSession({ ...valid, base: { ...valid.base, currentness: "stale" as const } }, registry), { accepted: false, currentness: "stale", reason: "stale-base" });
  assert.deepEqual(initializeEditorSession({ ...valid, base: { ...valid.base, currentness: "unknown" as const } }, registry), { accepted: false, currentness: "unknown", reason: "unknown-currentness" });
});

test("TASK-636 rejects duplicate or incompatible composition input with no caller mutation", () => {
  const duplicate = defineCompositionGraph({ rootRef: "node:root", nodes: [...composition.nodes, composition.nodes[1]!] });
  const before = structuredClone(duplicate);
  const result = initializeEditorSession({ ...valid, composition: duplicate }, registry);
  assert.deepEqual(result, { accepted: false, currentness: "current", reason: "invalid-composition" });
  assert.deepEqual(duplicate, before);
  const incompatible = defineCompositionGraph({ rootRef: "node:root", nodes: [{ ref: "node:root", componentRef: "component:missing" }] });
  assert.deepEqual(initializeEditorSession({ ...valid, composition: incompatible }, registry), { accepted: false, currentness: "current", reason: "invalid-composition" });
});

test("TASK-636 applies only validated draft mutations and rejects stale/invalid mutations without partial state", () => {
  const initialized = initializeEditorSession(valid, registry);
  assert.equal(initialized.accepted, true);
  if (!initialized.accepted) return;
  const original = initialized.session;
  const stale = applyEditorSessionMutation(original, 6, { type: "remove-node", nodeRef: "node:button" }, registry);
  assert.equal(stale.accepted, false);
  assert.strictEqual(stale.session, original);
  const invalid = applyEditorSessionMutation(original, 7, { type: "remove-node", nodeRef: "node:root" }, registry);
  assert.equal(invalid.accepted, false);
  assert.strictEqual(invalid.session, original);
  assert.equal(original.transaction.dirty, false);
});

test("TASK-636 draft projection has no business, command or persistence authority", () => {
  const initialized = initializeEditorSession(valid, registry);
  assert.equal(initialized.accepted, true);
  if (!initialized.accepted) return;
  assert.equal(initialized.session.authority, "station-draft-projection");
  assert.equal("businessAuthority" in initialized.session, false);
  assert.equal("commandAuthority" in initialized.session, false);
  assert.equal("persist" in initialized.session, false);
});

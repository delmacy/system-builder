import assert from "node:assert/strict";
import test from "node:test";

import { createTool, restoreToolContext, snapshotToolForRestoration, type ToolRestorationSnapshot } from "../../packages/station-tool/index";

function fixture(activeContextRef = "context.primary") {
  return createTool({
    id: "tool.component",
    requiredRoles: ["primary", "inspector"],
    participants: [
      { ref: "view.primary", role: "primary" },
      { ref: "view.inspector", role: "inspector" },
    ],
    contexts: [
      { ref: "context.primary", participantRef: "view.primary", routes: { save: { commandId: "save", targetRef: "view.primary" } } },
      { ref: "context.inspector", participantRef: "view.inspector", routes: { save: { commandId: "save", targetRef: "view.inspector" } } },
    ],
    activeContextRef,
  });
}

test("restoration rebinds active context deterministically while preserving declared identity", () => {
  const declared = fixture("context.primary");
  const snapshot = snapshotToolForRestoration(fixture("context.inspector"));
  const restored = restoreToolContext(declared, snapshot);

  assert.equal(restored.id, declared.id);
  assert.equal(restored.participants, declared.participants);
  assert.equal(restored.contexts, declared.contexts);
  assert.equal(restored.activeContextRef, "context.inspector");
  assert.deepEqual(restoreToolContext(declared, snapshot), restored);
  assert.equal(restoreToolContext(restored, snapshot), restored);
  assert.equal(Object.hasOwn(restored, "authorized"), false);
  assert.equal(Object.hasOwn(restored, "execute"), false);
});

test("stale, unknown, duplicate and incompatible restoration refs fail closed without mutation", () => {
  const declared = fixture();
  const before = structuredClone(declared);
  const valid = snapshotToolForRestoration(fixture("context.inspector"));
  const primaryParticipant = valid.participants.find((participant) => participant.ref === "view.primary");
  const primaryContext = valid.contexts.find((context) => context.ref === "context.primary");
  assert.ok(primaryParticipant);
  assert.ok(primaryContext);

  const cases: ToolRestorationSnapshot[] = [
    { ...valid, toolId: "tool.stale" },
    { ...valid, participants: [...valid.participants, primaryParticipant] },
    { ...valid, participants: valid.participants.map((participant) => participant.ref === "view.primary" ? { ...participant, role: "wrong" as never } : participant) },
    { ...valid, contexts: valid.contexts.map((context) => context.ref === "context.primary" ? { ...context, participantRef: "view.unknown" } : context) },
    { ...valid, contexts: valid.contexts.map((context) => context.ref === "context.primary" ? { ...context, routeRefs: ["save", "save"] } : context) },
    { ...valid, activeContextRef: "context.unknown" },
  ];

  for (const invalid of cases) {
    assert.throws(() => restoreToolContext(declared, invalid));
    assert.deepEqual(declared, before);
  }
});

test("snapshot is Station-owned references only and does not serialize command authority", () => {
  const snapshot = snapshotToolForRestoration(fixture());
  const primaryContext = snapshot.contexts.find((context) => context.ref === "context.primary");
  assert.ok(primaryContext);
  assert.deepEqual(primaryContext.routeRefs, ["save"]);
  assert.equal(Object.hasOwn(snapshot, "authorized"), false);
  assert.equal(Object.hasOwn(snapshot, "execute"), false);
  assert.equal(JSON.stringify(snapshot).includes("commandId"), false);
  assert.equal(JSON.stringify(snapshot).includes("targetRef"), false);
});

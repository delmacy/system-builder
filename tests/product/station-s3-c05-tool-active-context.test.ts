import assert from "node:assert/strict";
import test from "node:test";

import { activateToolContext, createTool, qualifyToolCommand } from "../../packages/station-tool/index";

function fixture() {
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
    activeContextRef: "context.primary",
  });
}

test("active context preserves tool and participant identity while qualifying the same command deterministically", () => {
  const initial = fixture();
  const switched = activateToolContext(initial, "context.inspector");

  assert.equal(switched.id, initial.id);
  assert.deepEqual(switched.participants, initial.participants);
  assert.deepEqual(qualifyToolCommand(initial, "save"), { commandId: "save", targetRef: "view.primary" });
  assert.deepEqual(qualifyToolCommand(switched, "save"), { commandId: "save", targetRef: "view.inspector" });
  assert.equal(Object.hasOwn(switched, "authorized"), false);
  assert.equal(Object.hasOwn(switched, "execute"), false);
});

test("ambiguous required-role admission fails closed without mutating input", () => {
  const input = {
    id: "tool.component",
    requiredRoles: ["primary"],
    participants: [
      { ref: "view.a", role: "primary" },
      { ref: "view.b", role: "primary" },
    ],
    contexts: [{ ref: "context.a", participantRef: "view.a", routes: {} }],
    activeContextRef: "context.a",
  } as const;
  const snapshot = structuredClone(input);

  assert.throws(() => createTool(input), /exactly one participant/);
  assert.deepEqual(input, snapshot);
});

test("normalized route-ref ambiguity fails closed without mutating input", () => {
  const input = {
    id: "tool.component",
    requiredRoles: ["primary"],
    participants: [{ ref: "view.primary", role: "primary" }],
    contexts: [{
      ref: "context.primary",
      participantRef: "view.primary",
      routes: {
        save: { commandId: "save", targetRef: "view.primary" },
        " save ": { commandId: "save.other", targetRef: "view.other" },
      },
    }],
    activeContextRef: "context.primary",
  } as const;
  const snapshot = structuredClone(input);

  assert.throws(() => createTool(input), /route refs must be unique after normalization/);
  assert.deepEqual(input, snapshot);
});

test("unknown participant/context and undeclared route fail closed", () => {
  assert.throws(() => createTool({
    id: "tool.component",
    requiredRoles: ["primary"],
    participants: [{ ref: "view.primary", role: "primary" }],
    contexts: [{ ref: "context.bad", participantRef: "view.unknown", routes: {} }],
    activeContextRef: "context.bad",
  }), /unknown participant/);

  const tool = fixture();
  assert.throws(() => activateToolContext(tool, "context.unknown"), /declared context/);
  assert.throws(() => qualifyToolCommand(tool, "delete"), /not declared/);
});

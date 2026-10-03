import assert from "node:assert/strict";
import test from "node:test";

import { activateToolContext, createTool } from "../../packages/station-tool/index";
import { projectToolViews, type ToolViewDeclaration } from "../../packages/station-tool/multiview";

function fixture(activeContextRef = "context.primary") {
  return createTool({
    id: "tool.component",
    requiredRoles: ["primary", "inspector"],
    participants: [
      { ref: "participant.primary", role: "primary" },
      { ref: "participant.inspector", role: "inspector" },
    ],
    contexts: [
      { ref: "context.primary", participantRef: "participant.primary", routes: { save: { commandId: "save", targetRef: "participant.primary" } } },
      { ref: "context.inspector", participantRef: "participant.inspector", routes: { save: { commandId: "save", targetRef: "participant.inspector" } } },
    ],
    activeContextRef,
  });
}

const views: readonly ToolViewDeclaration[] = [
  { ref: "view.main", participantRef: "participant.primary", contextRefs: ["context.primary", "context.inspector"] },
  { ref: "view.side", participantRef: "participant.inspector", contextRefs: ["context.primary", "context.inspector"] },
];

function requiredView(ref: string): ToolViewDeclaration {
  const view = views.find((candidate) => candidate.ref === ref);
  assert.ok(view, `missing required test view ${ref}`);
  return view;
}

test("multiple views project one canonical active context and converge after context switch", () => {
  const tool = fixture();
  const initial = projectToolViews(tool, views);
  assert.deepEqual(initial.map(({ activeContextRef }) => activeContextRef), ["context.primary", "context.primary"]);

  const switched = activateToolContext(tool, "context.inspector");
  const projected = projectToolViews(switched, views);
  assert.deepEqual(projected.map(({ activeContextRef }) => activeContextRef), ["context.inspector", "context.inspector"]);
  assert.deepEqual(projectToolViews(switched, views), projected);
  assert.equal(tool.activeContextRef, "context.primary");
  assert.deepEqual(projected.map(({ ref, participantRef }) => ({ ref, participantRef })), views.map(({ ref, participantRef }) => ({ ref, participantRef })));
  const mainProjection = projected.find(({ ref }) => ref === "view.main");
  assert.ok(mainProjection, "missing projected main view");
  assert.equal(Object.hasOwn(mainProjection, "authorized"), false);
  assert.equal(Object.hasOwn(mainProjection, "execute"), false);
});

test("stale, unknown, duplicate and incompatible view declarations fail closed without canonical mutation", () => {
  const tool = fixture();
  const before = structuredClone(tool);
  const mainView = requiredView("view.main");
  const cases: readonly (readonly ToolViewDeclaration[])[] = [
    [...views, mainView],
    [{ ref: "view.unknown-participant", participantRef: "participant.unknown", contextRefs: ["context.primary"] }],
    [{ ref: "view.unknown-context", participantRef: "participant.primary", contextRefs: ["context.unknown"] }],
    [{ ref: "view.duplicate-context", participantRef: "participant.primary", contextRefs: ["context.primary", "context.primary"] }],
    [{ ref: "view.incompatible", participantRef: "participant.primary", contextRefs: ["context.inspector"] }],
    [{ ref: " ", participantRef: "participant.primary", contextRefs: ["context.primary"] }],
  ];

  for (const invalid of cases) {
    assert.throws(() => projectToolViews(tool, invalid));
    assert.deepEqual(tool, before);
  }
});

test("view projection carries Station references only and cannot become command or business authority", () => {
  const projected = projectToolViews(fixture(), views);
  const serialized = JSON.stringify(projected);
  assert.equal(serialized.includes("commandId"), false);
  assert.equal(serialized.includes("targetRef"), false);
  assert.equal(serialized.includes("authorized"), false);
  assert.equal(serialized.includes("execute"), false);
});

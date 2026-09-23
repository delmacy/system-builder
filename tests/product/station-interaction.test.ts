import assert from "node:assert/strict";
import test from "node:test";

import {
  CommandUnavailableError,
  PresentationCommandRegistry,
  ShortcutRegistry,
  available,
  focusTarget,
  interactionContext,
  normalizeShortcut,
  selectionContext,
  unavailable,
  type CoreCommandIntent,
  type PresentationCommandDefinition,
} from "../../packages/station-interaction/index.js";

test("presentation registry re-checks availability at invocation time", async () => {
  let executions = 0;
  const registry = new PresentationCommandRegistry();

  registry.register({
    kind: "presentation",
    id: "window.close",
    title: "Close window",
    availability: (context) =>
      context.focus?.kind === "window"
        ? available()
        : unavailable("a window must be focused"),
    execute: () => {
      executions += 1;
    },
  });

  const windowContext = interactionContext({
    focus: focusTarget("window", "window:settings"),
  });
  assert.deepEqual(registry.availability("window.close", windowContext), {
    available: true,
  });

  await registry.invoke("window.close", windowContext);
  assert.equal(executions, 1);

  const noFocusContext = interactionContext();
  assert.deepEqual(registry.availability("window.close", noFocusContext), {
    available: false,
    reason: "a window must be focused",
  });

  await assert.rejects(
    registry.invoke("window.close", noFocusContext),
    (error: unknown) =>
      error instanceof CommandUnavailableError &&
      error.commandId === "window.close",
  );
  assert.equal(executions, 1);
});

test("multiple controls can resolve to one semantic command", async () => {
  const registry = new PresentationCommandRegistry();
  let executions = 0;

  registry.register({
    kind: "presentation",
    id: "settings.open",
    title: "Open settings",
    shortcut: "Ctrl+,",
    execute: () => {
      executions += 1;
    },
  });

  const toolbarCommand = registry.get("settings.open");
  const menuCommand = registry.resolveShortcut("control+,");

  assert.equal(toolbarCommand?.id, "settings.open");
  assert.equal(menuCommand?.id, "settings.open");

  await registry.invoke(toolbarCommand!.id, interactionContext());
  await registry.invoke(menuCommand!.id, interactionContext());
  assert.equal(executions, 2);
});

test("shortcut normalization and conflicts are deterministic", () => {
  assert.equal(normalizeShortcut("shift+ctrl+p"), "Ctrl+Shift+P");
  assert.equal(normalizeShortcut("cmd+k"), "Meta+K");

  const shortcuts = new ShortcutRegistry();
  shortcuts.register("shell.command", "Ctrl+K");

  assert.equal(shortcuts.resolve("control+k"), "shell.command");
  assert.throws(
    () => shortcuts.register("shell.search", "CTRL+k"),
    /shortcut conflict: Ctrl\+K is already assigned to shell\.command/,
  );
});

test("focus and selection are normalized presentation context only", () => {
  const selection = selectionContext(
    ["resource:a", "resource:b", "resource:a"],
    "resource:b",
  );

  const context = interactionContext({
    focus: focusTarget("tool", "tool:inspector"),
    selection,
    surfaceRef: "surface:desktop",
  });

  assert.deepEqual(context.selection.refs, ["resource:a", "resource:b"]);
  assert.equal(context.selection.primaryRef, "resource:b");
  assert.equal(context.focus?.ref, "tool:inspector");
  assert.equal(context.surfaceRef, "surface:desktop");

  assert.throws(
    () => selectionContext(["resource:a"], "resource:b"),
    /primary selection ref must be present/,
  );
});

test("Core command intents are explicitly distinct from executable presentation commands", () => {
  const coreIntent: CoreCommandIntent = {
    kind: "core-intent",
    id: "workflow.rename",
    actionRef: "workflow.rename",
    targetRef: "workflow:42",
    payload: { name: "Approval v2" },
  };

  assert.equal(coreIntent.kind, "core-intent");

  const registry = new PresentationCommandRegistry();
  assert.throws(
    () =>
      registry.register(
        coreIntent as unknown as PresentationCommandDefinition,
      ),
    /presentation registry accepts presentation commands only/,
  );
});

test("duplicate presentation command identity fails closed", () => {
  const registry = new PresentationCommandRegistry();
  const definition: PresentationCommandDefinition = {
    kind: "presentation",
    id: "settings.open",
    title: "Open settings",
    execute: () => undefined,
  };

  registry.register(definition);
  assert.throws(
    () => registry.register(definition),
    /duplicate presentation command id: settings\.open/,
  );
});

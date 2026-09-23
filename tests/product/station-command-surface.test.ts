import assert from "node:assert/strict";
import test from "node:test";

import {
  PresentationCommandRegistry,
  available,
  focusTarget,
  interactionContext,
  unavailable,
  type CoreCommandIntent,
} from "../../packages/station-interaction/index.js";
import {
  projectCoreCommandIntents,
  projectPresentationCommands,
} from "../../packages/station-shell/index.js";

test("command surface derives Presentation Command availability from interaction context", () => {
  const registry = new PresentationCommandRegistry();
  registry.register({
    kind: "presentation",
    id: "shell.test",
    title: "Test presentation command",
    shortcut: "Ctrl+K",
    availability: (context) =>
      context.focus?.kind === "window"
        ? available()
        : unavailable("a window must be focused"),
    execute: () => undefined,
  });

  const unavailableProjection = projectPresentationCommands(
    registry,
    interactionContext(),
  );
  assert.equal(unavailableProjection[0]?.available, false);
  assert.equal(
    unavailableProjection[0]?.reason,
    "a window must be focused",
  );

  const availableProjection = projectPresentationCommands(
    registry,
    interactionContext({
      focus: focusTarget("window", "window:settings:1"),
    }),
  );
  assert.equal(availableProjection[0]?.available, true);
  assert.equal(availableProjection[0]?.shortcut, "Ctrl+K");
});

test("Core Command Intent projection never becomes Station authorization", () => {
  const intent: CoreCommandIntent = Object.freeze({
    kind: "core-intent",
    id: "intent:test",
    actionRef: "test.request",
    targetRef: "test:target",
    payload: Object.freeze({}),
  });

  const [projection] = projectCoreCommandIntents([intent], "disconnected");
  assert.equal(projection?.authorization, "core-required");
  assert.equal(projection?.requestable, false);
  assert.match(projection?.reason ?? "", /Core is disconnected/);
});

test("command projection carries no executor or provider success state", () => {
  const source = projectCoreCommandIntents([], "disconnected");
  assert.deepEqual(source, []);
});

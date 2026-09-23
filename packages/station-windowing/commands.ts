import {
  available,
  unavailable,
  type PresentationCommandDefinition,
  type StationInteractionContext,
} from "../station-interaction/index.js";

import type { WindowAction } from "./types.js";

export const WINDOW_PRESENTATION_COMMAND_IDS = Object.freeze([
  "window.close",
  "window.minimize",
  "window.maximize",
  "window.restore",
] as const);

export type WindowPresentationCommandId =
  (typeof WINDOW_PRESENTATION_COMMAND_IDS)[number];

function focusedWindowRef(context: StationInteractionContext): string | null {
  return context.focus?.kind === "window" ? context.focus.ref : null;
}

export function createWindowPresentationCommands(
  dispatch: (action: WindowAction) => void,
): readonly PresentationCommandDefinition[] {
  const availability = (context: StationInteractionContext) =>
    focusedWindowRef(context) === null
      ? unavailable("a window must be focused")
      : available();

  const actionFor =
    (type: "CLOSE" | "MINIMIZE" | "MAXIMIZE" | "RESTORE") =>
    (context: StationInteractionContext): void => {
      const windowRef = focusedWindowRef(context);
      if (windowRef === null) {
        throw new Error("window command executed without focused window");
      }
      dispatch({ type, windowRef });
    };

  return Object.freeze([
    Object.freeze({
      kind: "presentation",
      id: "window.close",
      title: "Close window",
      shortcut: "Alt+F4",
      availability,
      execute: actionFor("CLOSE"),
    }),
    Object.freeze({
      kind: "presentation",
      id: "window.minimize",
      title: "Minimize window",
      availability,
      execute: actionFor("MINIMIZE"),
    }),
    Object.freeze({
      kind: "presentation",
      id: "window.maximize",
      title: "Maximize window",
      availability,
      execute: actionFor("MAXIMIZE"),
    }),
    Object.freeze({
      kind: "presentation",
      id: "window.restore",
      title: "Restore window",
      availability,
      execute: actionFor("RESTORE"),
    }),
  ]);
}

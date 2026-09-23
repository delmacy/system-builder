import {
  maximizeGeometry,
  normalizeBounds,
  normalizeGeometry,
  normalizeSize,
  snapGeometry,
} from "./geometry.js";
import type {
  WindowAction,
  WindowDefinition,
  WindowGeometry,
  WindowInstance,
  WindowRuntimeState,
} from "./types.js";

function token(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`${label} must be non-empty`);
  return normalized;
}

function normalizeDefinition(definition: WindowDefinition): WindowDefinition {
  const defaultSize = normalizeSize(definition.defaultSize);
  const minSize = normalizeSize(definition.minSize, { width: 120, height: 80 });

  return Object.freeze({
    id: token(definition.id, "window definition id"),
    appRef: token(definition.appRef, "window app ref"),
    title: token(definition.title, "window title"),
    icon: definition.icon,
    defaultSize: Object.freeze({
      width: Math.max(defaultSize.width, minSize.width),
      height: Math.max(defaultSize.height, minSize.height),
    }),
    minSize,
    multiInstance: definition.multiInstance,
    resizable: definition.resizable,
    commands: Object.freeze(
      [...new Set(definition.commands.map((command) => token(command, "window command id")))],
    ),
  });
}

export function createWindowRuntimeState(
  definitions: readonly WindowDefinition[],
  boundsInput: Readonly<{ width: number; height: number }>,
): WindowRuntimeState {
  const normalizedDefinitions = definitions.map(normalizeDefinition);
  const ids = new Set<string>();

  for (const definition of normalizedDefinitions) {
    if (ids.has(definition.id)) {
      throw new Error(`duplicate window definition id: ${definition.id}`);
    }
    ids.add(definition.id);
  }

  return Object.freeze({
    bounds: normalizeBounds(boundsInput),
    definitions: Object.freeze(normalizedDefinitions),
    instances: Object.freeze([]),
    activeWindowRef: null,
    nextOrdinal: 1,
    nextZOrder: 1,
  });
}

function definitionFor(
  state: WindowRuntimeState,
  definitionRef: string,
): WindowDefinition {
  const ref = token(definitionRef, "window definition ref");
  const definition = state.definitions.find((candidate) => candidate.id === ref);
  if (definition === undefined) {
    throw new Error(`unknown window definition: ${ref}`);
  }
  return definition;
}

function instanceFor(
  state: WindowRuntimeState,
  windowRef: string,
): WindowInstance {
  const ref = token(windowRef, "window ref");
  const instance = state.instances.find((candidate) => candidate.windowRef === ref);
  if (instance === undefined) throw new Error(`unknown window instance: ${ref}`);
  return instance;
}

function topOpenWindow(
  instances: readonly WindowInstance[],
  excludingRef?: string,
): WindowInstance | null {
  return (
    instances
      .filter(
        (instance) =>
          instance.lifecycle === "OPEN" &&
          (excludingRef === undefined || instance.windowRef !== excludingRef),
      )
      .sort((left, right) => right.zOrder - left.zOrder)[0] ?? null
  );
}

function replaceInstance(
  state: WindowRuntimeState,
  updated: WindowInstance,
  focusUpdated: boolean,
): WindowRuntimeState {
  const instances = state.instances.map((instance) => {
    if (instance.windowRef === updated.windowRef) return updated;
    if (focusUpdated && instance.focused) {
      return Object.freeze({ ...instance, focused: false });
    }
    return instance;
  });

  return Object.freeze({
    ...state,
    instances: Object.freeze(instances),
    activeWindowRef: focusUpdated ? updated.windowRef : state.activeWindowRef,
  });
}

function focusInstance(
  state: WindowRuntimeState,
  instance: WindowInstance,
): WindowRuntimeState {
  if (instance.lifecycle !== "OPEN") {
    throw new Error("only open windows can receive focus");
  }

  const focused = Object.freeze({
    ...instance,
    focused: true,
    zOrder: state.nextZOrder,
  });

  const replaced = replaceInstance(state, focused, true);
  return Object.freeze({ ...replaced, nextZOrder: state.nextZOrder + 1 });
}

function deactivate(
  state: WindowRuntimeState,
  updated: WindowInstance,
): WindowRuntimeState {
  const next = topOpenWindow(state.instances, updated.windowRef);
  const instances = state.instances.map((instance) => {
    if (instance.windowRef === updated.windowRef) return updated;
    if (next !== null && instance.windowRef === next.windowRef) {
      return Object.freeze({ ...instance, focused: true });
    }
    if (instance.focused) return Object.freeze({ ...instance, focused: false });
    return instance;
  });

  return Object.freeze({
    ...state,
    instances: Object.freeze(instances),
    activeWindowRef: next?.windowRef ?? null,
  });
}

function defaultGeometry(
  state: WindowRuntimeState,
  definition: WindowDefinition,
  ordinal: number,
): WindowGeometry {
  const cascade = ((ordinal - 1) % 8) * 28;
  return normalizeGeometry(
    {
      x: 48 + cascade,
      y: 48 + cascade,
      width: definition.defaultSize.width,
      height: definition.defaultSize.height,
    },
    state.bounds,
    definition.minSize,
    {
      x: 0,
      y: 0,
      width: definition.defaultSize.width,
      height: definition.defaultSize.height,
    },
  );
}

function openWindow(
  state: WindowRuntimeState,
  action: Extract<WindowAction, { type: "OPEN" }>,
): WindowRuntimeState {
  const definition = definitionFor(state, action.definitionRef);

  if (!definition.multiInstance) {
    const existing = state.instances.find(
      (instance) => instance.definitionRef === definition.id,
    );

    if (existing !== undefined) {
      const reopened = Object.freeze({
        ...existing,
        lifecycle: "OPEN" as const,
        presentationPayload: Object.freeze({
          ...(action.presentationPayload ?? existing.presentationPayload),
        }),
      });
      return focusInstance(replaceInstance(state, reopened, false), reopened);
    }
  }

  const geometry = normalizeGeometry(
    action.geometry ?? {},
    state.bounds,
    definition.minSize,
    defaultGeometry(state, definition, state.nextOrdinal),
  );

  const created: WindowInstance = Object.freeze({
    windowRef: `window:${definition.id}:${state.nextOrdinal}`,
    definitionRef: definition.id,
    lifecycle: "OPEN",
    mode: "NORMAL",
    geometry,
    restoreGeometry: null,
    snap: null,
    zOrder: state.nextZOrder,
    focused: true,
    presentationPayload: Object.freeze({ ...(action.presentationPayload ?? {}) }),
  });

  return Object.freeze({
    ...state,
    instances: Object.freeze([
      ...state.instances.map((instance) =>
        instance.focused ? Object.freeze({ ...instance, focused: false }) : instance,
      ),
      created,
    ]),
    activeWindowRef: created.windowRef,
    nextOrdinal: state.nextOrdinal + 1,
    nextZOrder: state.nextZOrder + 1,
  });
}

export function reduceWindowRuntime(
  state: WindowRuntimeState,
  action: WindowAction,
): WindowRuntimeState {
  switch (action.type) {
    case "OPEN":
      return openWindow(state, action);

    case "FOCUS":
      return focusInstance(state, instanceFor(state, action.windowRef));

    case "CLOSE": {
      const instance = instanceFor(state, action.windowRef);
      const closed = Object.freeze({
        ...instance,
        lifecycle: "CLOSED" as const,
        focused: false,
      });
      return deactivate(state, closed);
    }

    case "MINIMIZE": {
      const instance = instanceFor(state, action.windowRef);
      const minimized = Object.freeze({
        ...instance,
        lifecycle: "MINIMIZED" as const,
        focused: false,
      });
      return deactivate(state, minimized);
    }

    case "MAXIMIZE": {
      const instance = instanceFor(state, action.windowRef);
      if (instance.lifecycle !== "OPEN") {
        throw new Error("only open windows can be maximized");
      }
      const maximized = Object.freeze({
        ...instance,
        mode: "MAXIMIZED" as const,
        snap: null,
        restoreGeometry:
          instance.mode === "NORMAL"
            ? instance.geometry
            : instance.restoreGeometry,
        geometry: maximizeGeometry(state.bounds),
      });
      return replaceInstance(state, maximized, false);
    }

    case "RESTORE": {
      const instance = instanceFor(state, action.windowRef);
      const restoredGeometry =
        instance.mode === "NORMAL" || instance.restoreGeometry === null
          ? instance.geometry
          : normalizeGeometry(
              instance.restoreGeometry,
              state.bounds,
              definitionFor(state, instance.definitionRef).minSize,
              instance.geometry,
            );

      const restored = Object.freeze({
        ...instance,
        lifecycle: "OPEN" as const,
        mode: "NORMAL" as const,
        snap: null,
        geometry: restoredGeometry,
        restoreGeometry: null,
      });
      return focusInstance(replaceInstance(state, restored, false), restored);
    }

    case "SNAP": {
      const instance = instanceFor(state, action.windowRef);
      if (instance.lifecycle !== "OPEN") {
        throw new Error("only open windows can be snapped");
      }
      const definition = definitionFor(state, instance.definitionRef);
      const snapped = Object.freeze({
        ...instance,
        mode: "SNAPPED" as const,
        snap: action.snap,
        restoreGeometry:
          instance.mode === "NORMAL"
            ? instance.geometry
            : instance.restoreGeometry,
        geometry: snapGeometry(action.snap, state.bounds, definition.minSize),
      });
      return replaceInstance(state, snapped, false);
    }

    case "SET_GEOMETRY": {
      const instance = instanceFor(state, action.windowRef);
      if (instance.lifecycle !== "OPEN") {
        throw new Error("only open windows can change geometry");
      }
      const definition = definitionFor(state, instance.definitionRef);
      const requested = definition.resizable
        ? action.geometry
        : {
            ...(action.geometry.x === undefined ? {} : { x: action.geometry.x }),
            ...(action.geometry.y === undefined ? {} : { y: action.geometry.y }),
            width: instance.geometry.width,
            height: instance.geometry.height,
          };

      const updated = Object.freeze({
        ...instance,
        mode: "NORMAL" as const,
        snap: null,
        restoreGeometry: null,
        geometry: normalizeGeometry(
          requested,
          state.bounds,
          definition.minSize,
          instance.geometry,
        ),
      });
      return replaceInstance(state, updated, false);
    }
  }
}

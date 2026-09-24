import { reduceWindowRuntime, createWindowRuntimeState } from "./reducer.js";
import type { WindowBounds, WindowDefinition, WindowGeometry, WindowRuntimeState, WindowSnap } from "./types.js";

export const STATION_LAYOUT_STORAGE_KEY = "system-builder.station.layout.v1";

type PersistedWindow = Readonly<{ definitionRef: string; lifecycle: "OPEN" | "MINIMIZED"; mode: "NORMAL" | "MAXIMIZED" | "SNAPPED"; geometry: WindowGeometry; snap: WindowSnap | null }>;
type PersistedLayout = Readonly<{ version: 1; windows: readonly PersistedWindow[]; activeDefinitionRef: string | null }>;

export interface LayoutKeyValueStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void; }

function finiteGeometry(value: unknown): value is WindowGeometry {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return ["x", "y", "width", "height"].every((key) => typeof candidate[key] === "number" && Number.isFinite(candidate[key]));
}

function parseLayout(raw: string | null, definitions: readonly WindowDefinition[]): PersistedLayout | null {
  if (raw === null) return null;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    if (value.version !== 1 || !Array.isArray(value.windows) || value.windows.length > 32) return null;
    const known = new Set(definitions.map((definition) => definition.id));
    const windows: PersistedWindow[] = [];
    for (const item of value.windows) {
      if (typeof item !== "object" || item === null) return null;
      const candidate = item as Record<string, unknown>;
      if (typeof candidate.definitionRef !== "string" || !known.has(candidate.definitionRef) || !finiteGeometry(candidate.geometry)) return null;
      if (candidate.lifecycle !== "OPEN" && candidate.lifecycle !== "MINIMIZED") return null;
      if (candidate.mode !== "NORMAL" && candidate.mode !== "MAXIMIZED" && candidate.mode !== "SNAPPED") return null;
      if (candidate.snap !== null && candidate.snap !== "LEFT" && candidate.snap !== "RIGHT") return null;
      if (candidate.mode === "SNAPPED" && candidate.snap === null) return null;
      windows.push(Object.freeze({ definitionRef: candidate.definitionRef, lifecycle: candidate.lifecycle, mode: candidate.mode, geometry: candidate.geometry, snap: candidate.snap as WindowSnap | null }));
    }
    const activeDefinitionRef = typeof value.activeDefinitionRef === "string" && known.has(value.activeDefinitionRef) ? value.activeDefinitionRef : null;
    return Object.freeze({ version: 1, windows: Object.freeze(windows), activeDefinitionRef });
  } catch { return null; }
}

export function serializeWindowPresentationLayout(state: WindowRuntimeState): string {
  const active = state.activeWindowRef === null ? undefined : state.instances.find((instance) => instance.windowRef === state.activeWindowRef);
  const layout: PersistedLayout = Object.freeze({
    version: 1,
    windows: Object.freeze(state.instances.filter((instance) => instance.lifecycle !== "CLOSED").map((instance) => Object.freeze({ definitionRef: instance.definitionRef, lifecycle: instance.lifecycle as "OPEN" | "MINIMIZED", mode: instance.mode, geometry: instance.mode === "NORMAL" ? instance.geometry : (instance.restoreGeometry ?? instance.geometry), snap: instance.snap }))),
    activeDefinitionRef: active?.definitionRef ?? null,
  });
  return JSON.stringify(layout);
}

export function restoreWindowPresentationLayout(definitions: readonly WindowDefinition[], bounds: WindowBounds, raw: string | null): WindowRuntimeState | null {
  const layout = parseLayout(raw, definitions);
  if (layout === null) return null;
  let state = createWindowRuntimeState(definitions, bounds);
  for (const item of layout.windows) {
    state = reduceWindowRuntime(state, { type: "OPEN", definitionRef: item.definitionRef, geometry: item.geometry, presentationPayload: { source: "local-layout" } });
    const ref = state.activeWindowRef;
    if (ref === null) continue;
    if (item.mode === "MAXIMIZED") state = reduceWindowRuntime(state, { type: "MAXIMIZE", windowRef: ref });
    else if (item.mode === "SNAPPED" && item.snap !== null) state = reduceWindowRuntime(state, { type: "SNAP", windowRef: ref, snap: item.snap });
    if (item.lifecycle === "MINIMIZED") state = reduceWindowRuntime(state, { type: "MINIMIZE", windowRef: ref });
  }
  if (layout.activeDefinitionRef !== null) {
    const target = [...state.instances].reverse().find((instance) => instance.definitionRef === layout.activeDefinitionRef && instance.lifecycle === "OPEN");
    if (target !== undefined) state = reduceWindowRuntime(state, { type: "FOCUS", windowRef: target.windowRef });
  }
  return state;
}

export function loadWindowPresentationLayout(storage: LayoutKeyValueStorage, definitions: readonly WindowDefinition[], bounds: WindowBounds): WindowRuntimeState | null {
  return restoreWindowPresentationLayout(definitions, bounds, storage.getItem(STATION_LAYOUT_STORAGE_KEY));
}
export function saveWindowPresentationLayout(storage: LayoutKeyValueStorage, state: WindowRuntimeState): void { storage.setItem(STATION_LAYOUT_STORAGE_KEY, serializeWindowPresentationLayout(state)); }
export function resetWindowPresentationLayout(storage: LayoutKeyValueStorage): void { storage.removeItem(STATION_LAYOUT_STORAGE_KEY); }

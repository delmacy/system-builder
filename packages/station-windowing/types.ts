import type { IconToken } from "../ui-icons/index.js";

export type WindowLifecycle = "OPEN" | "MINIMIZED" | "CLOSED";
export type WindowMode = "NORMAL" | "MAXIMIZED" | "SNAPPED";
export type WindowSnap = "LEFT" | "RIGHT";

export type WindowSize = Readonly<{
  width: number;
  height: number;
}>;

export type WindowGeometry = WindowSize & Readonly<{
  x: number;
  y: number;
}>;

export type WindowBounds = Readonly<{
  width: number;
  height: number;
}>;

export type WindowDefinition = Readonly<{
  id: string;
  appRef: string;
  title: string;
  icon: IconToken;
  defaultSize: WindowSize;
  minSize: WindowSize;
  multiInstance: boolean;
  resizable: boolean;
  commands: readonly string[];
}>;

export type WindowInstance = Readonly<{
  windowRef: string;
  definitionRef: string;
  lifecycle: WindowLifecycle;
  mode: WindowMode;
  geometry: WindowGeometry;
  restoreGeometry: WindowGeometry | null;
  snap: WindowSnap | null;
  zOrder: number;
  focused: boolean;
  presentationPayload: Readonly<Record<string, unknown>>;
}>;

export type WindowRuntimeState = Readonly<{
  bounds: WindowBounds;
  definitions: readonly WindowDefinition[];
  instances: readonly WindowInstance[];
  activeWindowRef: string | null;
  nextOrdinal: number;
  nextZOrder: number;
}>;

export type WindowAction =
  | Readonly<{
      type: "OPEN";
      definitionRef: string;
      geometry?: Partial<WindowGeometry>;
      presentationPayload?: Readonly<Record<string, unknown>>;
    }>
  | Readonly<{ type: "CLOSE"; windowRef: string }>
  | Readonly<{ type: "MINIMIZE"; windowRef: string }>
  | Readonly<{ type: "MAXIMIZE"; windowRef: string }>
  | Readonly<{ type: "RESTORE"; windowRef: string }>
  | Readonly<{ type: "FOCUS"; windowRef: string }>
  | Readonly<{
      type: "SET_GEOMETRY";
      windowRef: string;
      geometry: Partial<WindowGeometry>;
    }>
  | Readonly<{ type: "SNAP"; windowRef: string; snap: WindowSnap }>;

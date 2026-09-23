import {
  normalizeGeometry,
} from "./geometry.js";
import type {
  WindowBounds,
  WindowDefinition,
  WindowGeometry,
} from "./types.js";

export type PointerPoint = Readonly<{ x: number; y: number }>;
export type ResizeEdge = "E" | "S" | "SE";

export type WindowPointerSession =
  | Readonly<{
      kind: "move";
      origin: PointerPoint;
      startGeometry: WindowGeometry;
    }>
  | Readonly<{
      kind: "resize";
      edge: ResizeEdge;
      origin: PointerPoint;
      startGeometry: WindowGeometry;
    }>;

export function beginMove(
  origin: PointerPoint,
  startGeometry: WindowGeometry,
): WindowPointerSession {
  return Object.freeze({
    kind: "move",
    origin: Object.freeze({ ...origin }),
    startGeometry: Object.freeze({ ...startGeometry }),
  });
}

export function beginResize(
  edge: ResizeEdge,
  origin: PointerPoint,
  startGeometry: WindowGeometry,
): WindowPointerSession {
  return Object.freeze({
    kind: "resize",
    edge,
    origin: Object.freeze({ ...origin }),
    startGeometry: Object.freeze({ ...startGeometry }),
  });
}

export function projectPointerGeometry(
  session: WindowPointerSession,
  current: PointerPoint,
  bounds: WindowBounds,
  definition: WindowDefinition,
): WindowGeometry {
  const dx = current.x - session.origin.x;
  const dy = current.y - session.origin.y;

  if (session.kind === "move") {
    return normalizeGeometry(
      {
        ...session.startGeometry,
        x: session.startGeometry.x + dx,
        y: session.startGeometry.y + dy,
      },
      bounds,
      definition.minSize,
      session.startGeometry,
    );
  }

  const requested: Partial<WindowGeometry> = {
    x: session.startGeometry.x,
    y: session.startGeometry.y,
    width:
      session.edge === "E" || session.edge === "SE"
        ? Math.max(definition.minSize.width, session.startGeometry.width + dx)
        : session.startGeometry.width,
    height:
      session.edge === "S" || session.edge === "SE"
        ? Math.max(definition.minSize.height, session.startGeometry.height + dy)
        : session.startGeometry.height,
  };

  return normalizeGeometry(
    requested,
    bounds,
    definition.minSize,
    session.startGeometry,
  );
}

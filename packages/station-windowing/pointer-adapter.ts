import {
  normalizeGeometry,
} from "./geometry.js";
import type {
  WindowBounds,
  WindowDefinition,
  WindowGeometry,
} from "./types.js";

export type PointerPoint = Readonly<{ x: number; y: number }>;
export type ResizeEdge = "N" | "S" | "E" | "W" | "NE" | "NW" | "SE" | "SW";

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

  const start = session.startGeometry;
  const startRight = start.x + start.width;
  const startBottom = start.y + start.height;
  const minWidth = Math.min(definition.minSize.width, bounds.width);
  const minHeight = Math.min(definition.minSize.height, bounds.height);

  let left = start.x;
  let top = start.y;
  let right = startRight;
  let bottom = startBottom;

  if (session.edge.includes("W")) {
    left = Math.min(
      Math.max(0, start.x + dx),
      startRight - minWidth,
    );
  } else if (session.edge.includes("E")) {
    right = Math.max(
      start.x + minWidth,
      Math.min(bounds.width, startRight + dx),
    );
  }

  if (session.edge.includes("N")) {
    top = Math.min(
      Math.max(0, start.y + dy),
      startBottom - minHeight,
    );
  } else if (session.edge.includes("S")) {
    bottom = Math.max(
      start.y + minHeight,
      Math.min(bounds.height, startBottom + dy),
    );
  }

  return normalizeGeometry(
    {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    },
    bounds,
    definition.minSize,
    session.startGeometry,
  );
}

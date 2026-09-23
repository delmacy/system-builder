import type {
  WindowBounds,
  WindowGeometry,
  WindowSize,
} from "./types.js";

function finite(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function positive(value: number, fallback: number): number {
  const normalized = finite(value, fallback);
  return normalized > 0 ? normalized : fallback;
}

export function normalizeBounds(input: WindowBounds): WindowBounds {
  return Object.freeze({
    width: Math.max(1, positive(input.width, 1)),
    height: Math.max(1, positive(input.height, 1)),
  });
}

export function normalizeSize(
  input: WindowSize,
  fallback: WindowSize = { width: 320, height: 240 },
): WindowSize {
  return Object.freeze({
    width: positive(input.width, fallback.width),
    height: positive(input.height, fallback.height),
  });
}

export function normalizeGeometry(
  input: Partial<WindowGeometry>,
  boundsInput: WindowBounds,
  minSizeInput: WindowSize,
  fallbackInput: WindowGeometry,
): WindowGeometry {
  const bounds = normalizeBounds(boundsInput);
  const minSize = normalizeSize(minSizeInput, { width: 120, height: 80 });
  const fallback = Object.freeze({
    x: finite(fallbackInput.x, 0),
    y: finite(fallbackInput.y, 0),
    width: positive(fallbackInput.width, minSize.width),
    height: positive(fallbackInput.height, minSize.height),
  });

  const width = Math.min(
    bounds.width,
    Math.max(minSize.width, positive(input.width ?? fallback.width, fallback.width)),
  );
  const height = Math.min(
    bounds.height,
    Math.max(minSize.height, positive(input.height ?? fallback.height, fallback.height)),
  );

  const rawX = finite(input.x ?? fallback.x, fallback.x);
  const rawY = finite(input.y ?? fallback.y, fallback.y);

  return Object.freeze({
    x: Math.min(Math.max(0, rawX), Math.max(0, bounds.width - width)),
    y: Math.min(Math.max(0, rawY), Math.max(0, bounds.height - height)),
    width,
    height,
  });
}

export function maximizeGeometry(boundsInput: WindowBounds): WindowGeometry {
  const bounds = normalizeBounds(boundsInput);
  return Object.freeze({ x: 0, y: 0, width: bounds.width, height: bounds.height });
}

export function snapGeometry(
  snap: "LEFT" | "RIGHT",
  boundsInput: WindowBounds,
  minSize: WindowSize,
): WindowGeometry {
  const bounds = normalizeBounds(boundsInput);
  const targetWidth = Math.max(minSize.width, Math.floor(bounds.width / 2));
  const width = Math.min(bounds.width, targetWidth);
  return Object.freeze({
    x: snap === "LEFT" ? 0 : Math.max(0, bounds.width - width),
    y: 0,
    width,
    height: bounds.height,
  });
}

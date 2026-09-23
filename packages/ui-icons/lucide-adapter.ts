import type { IconToken } from "./index.js";

export type LucideShapeTag = "path" | "circle" | "line" | "rect";
export type LucideShape = readonly [
  LucideShapeTag,
  Readonly<Record<string, string | number>>,
];

export type LucideIconDefinition = Readonly<{
  name: string;
  shapes: readonly LucideShape[];
}>;

function icon(name: string, shapes: readonly LucideShape[]): LucideIconDefinition {
  return Object.freeze({
    name,
    shapes: Object.freeze(shapes.map((shape) => Object.freeze(shape))),
  });
}

/**
 * Bounded Lucide subset used by STATION-VISUAL-M1.
 *
 * Source: lucide-icons/lucide, current main on 2026-09-23.
 * License: ISC; some glyphs are derived from Feather and retain MIT terms.
 * See THIRD_PARTY.md in this package.
 */
export const LUCIDE_ICON_DEFINITIONS: Readonly<Record<IconToken, LucideIconDefinition>> =
  Object.freeze({
    "shell.home": icon("house", [
      ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }],
      ["path", { d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }],
    ]),
    "shell.search": icon("search", [
      ["path", { d: "m21 21-4.34-4.34" }],
      ["circle", { cx: 11, cy: 11, r: 8 }],
    ]),
    "shell.command": icon("command", [
      ["path", { d: "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" }],
    ]),
    settings: icon("settings", [
      ["path", { d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" }],
      ["circle", { cx: 12, cy: 12, r: 3 }],
    ]),
    "window.close": icon("x", [
      ["path", { d: "M18 6 6 18" }],
      ["path", { d: "m6 6 12 12" }],
    ]),
    "window.minimize": icon("minus", [
      ["path", { d: "M5 12h14" }],
    ]),
    "window.maximize": icon("square", [
      ["rect", { width: 18, height: 18, x: 3, y: 3, rx: 2 }],
    ]),
    "status.warning": icon("circle-alert", [
      ["circle", { cx: 12, cy: 12, r: 10 }],
      ["line", { x1: 12, x2: 12, y1: 8, y2: 12 }],
      ["line", { x1: 12, x2: 12.01, y1: 16, y2: 16 }],
    ]),
    "status.success": icon("circle-check", [
      ["circle", { cx: 12, cy: 12, r: 10 }],
      ["path", { d: "m16 9-5.5 5.5L8 12" }],
    ]),
    "navigation.expand": icon("chevron-down", [
      ["path", { d: "m6 9 6 6 6-6" }],
    ]),
  });

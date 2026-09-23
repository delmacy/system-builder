export const UI_SEMANTIC_TOKENS = Object.freeze([
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
] as const);

export const STATION_SURFACE_TOKENS = Object.freeze([
  "sb-desktop",
  "sb-window",
  "sb-window-titlebar",
  "sb-taskbar",
  "sb-toolbar",
  "sb-selection",
  "sb-current",
  "sb-stale",
  "sb-unknown",
] as const);

export type UiSemanticToken = (typeof UI_SEMANTIC_TOKENS)[number];
export type StationSurfaceToken = (typeof STATION_SURFACE_TOKENS)[number];

export function cssVariable(token: UiSemanticToken | StationSurfaceToken): string {
  return `var(--${token})`;
}

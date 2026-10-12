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


export const STATION_FOUNDATION_TOKENS = Object.freeze([
  "sb-font-body", "sb-font-mono", "sb-text-xs", "sb-text-sm", "sb-text-base", "sb-text-title",
  "sb-leading-body", "sb-space-1", "sb-space-2", "sb-space-3", "sb-space-4", "sb-space-6",
  "sb-radius-control", "sb-radius-panel", "sb-elevation-control", "sb-elevation-panel",
  "sb-elevation-overlay", "sb-opacity-disabled", "sb-focus-width", "sb-focus-offset",
  "sb-motion-duration", "sb-control-height", "sb-control-height-sm", "sb-control-height-lg",
  "sb-control-padding", "sb-control-gap",
] as const);
export type StationFoundationToken = (typeof STATION_FOUNDATION_TOKENS)[number];
export const STATION_DENSITY_METRICS = Object.freeze({
  comfortable: Object.freeze({ controlHeight: 36, smallHeight: 32, largeHeight: 40, padding: 12, gap: 8 }),
  compact: Object.freeze({ controlHeight: 30, smallHeight: 26, largeHeight: 34, padding: 8, gap: 4 }),
});

export function cssVariable(token: UiSemanticToken | StationSurfaceToken | StationFoundationToken): string {
  return `var(--${token})`;
}

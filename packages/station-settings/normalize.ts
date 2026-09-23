import {
  DEFAULT_STATION_PRESENTATION_STATE,
  STATION_PRESENTATION_SCHEMA_VERSION,
  type StationDensity,
  type StationMotion,
  type StationPresentationState,
  type StationTheme,
} from "./model.js";

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function booleanOr(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function enumOr<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return typeof value === "string" && allowed.includes(value as T)
    ? (value as T)
    : fallback;
}

function accentOr(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length > 64) return fallback;
  if (!/^[a-zA-Z0-9._:-]+$/.test(normalized)) return fallback;
  return normalized;
}

export function normalizeStationPresentationState(
  input: unknown,
): StationPresentationState {
  const root = record(input);
  if (root === null) return DEFAULT_STATION_PRESENTATION_STATE;

  const shell = record(root.shell);
  const appearance = record(root.appearance);
  const windowing = record(root.windowing);

  return Object.freeze({
    schemaVersion: STATION_PRESENTATION_SCHEMA_VERSION,
    shell: Object.freeze({
      navbarVisible: booleanOr(
        shell?.navbarVisible,
        DEFAULT_STATION_PRESENTATION_STATE.shell.navbarVisible,
      ),
      toolbarVisible: booleanOr(
        shell?.toolbarVisible,
        DEFAULT_STATION_PRESENTATION_STATE.shell.toolbarVisible,
      ),
      taskbarVisible: booleanOr(
        shell?.taskbarVisible,
        DEFAULT_STATION_PRESENTATION_STATE.shell.taskbarVisible,
      ),
      taskbarAutoHide: booleanOr(
        shell?.taskbarAutoHide,
        DEFAULT_STATION_PRESENTATION_STATE.shell.taskbarAutoHide,
      ),
    }),
    appearance: Object.freeze({
      theme: enumOr<StationTheme>(
        appearance?.theme,
        ["system", "light", "dark"],
        DEFAULT_STATION_PRESENTATION_STATE.appearance.theme,
      ),
      density: enumOr<StationDensity>(
        appearance?.density,
        ["comfortable", "compact"],
        DEFAULT_STATION_PRESENTATION_STATE.appearance.density,
      ),
      motion: enumOr<StationMotion>(
        appearance?.motion,
        ["full", "reduced"],
        DEFAULT_STATION_PRESENTATION_STATE.appearance.motion,
      ),
      accent: accentOr(
        appearance?.accent,
        DEFAULT_STATION_PRESENTATION_STATE.appearance.accent,
      ),
    }),
    windowing: Object.freeze({
      snapEnabled: booleanOr(
        windowing?.snapEnabled,
        DEFAULT_STATION_PRESENTATION_STATE.windowing.snapEnabled,
      ),
    }),
  });
}

export function migrateStationPresentationState(
  input: unknown,
): StationPresentationState {
  const root = record(input);
  if (root === null) return DEFAULT_STATION_PRESENTATION_STATE;

  const version = root.schemaVersion;
  if (version === undefined || version === 0 || version === 1) {
    return normalizeStationPresentationState(root);
  }

  return DEFAULT_STATION_PRESENTATION_STATE;
}

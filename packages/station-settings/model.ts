export const STATION_PRESENTATION_SCHEMA_VERSION = 1 as const;

export type StationTheme = "system" | "light" | "dark";
export type StationDensity = "comfortable" | "compact";
export type StationMotion = "full" | "reduced";

export type StationPresentationState = Readonly<{
  schemaVersion: typeof STATION_PRESENTATION_SCHEMA_VERSION;
  shell: Readonly<{
    navbarVisible: boolean;
    toolbarVisible: boolean;
    taskbarVisible: boolean;
    taskbarAutoHide: boolean;
  }>;
  appearance: Readonly<{
    theme: StationTheme;
    density: StationDensity;
    motion: StationMotion;
    accent: string;
  }>;
  windowing: Readonly<{
    snapEnabled: boolean;
  }>;
}>;

export const DEFAULT_STATION_PRESENTATION_STATE: StationPresentationState =
  Object.freeze({
    schemaVersion: STATION_PRESENTATION_SCHEMA_VERSION,
    shell: Object.freeze({
      navbarVisible: true,
      toolbarVisible: true,
      taskbarVisible: true,
      taskbarAutoHide: false,
    }),
    appearance: Object.freeze({
      theme: "system",
      density: "comfortable",
      motion: "full",
      accent: "default",
    }),
    windowing: Object.freeze({
      snapEnabled: true,
    }),
  });

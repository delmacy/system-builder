import {
  DEFAULT_STATION_PRESENTATION_STATE,
  type StationDensity,
  type StationMotion,
  type StationPresentationState,
  type StationTheme,
} from "./model.js";
import { normalizeStationPresentationState } from "./normalize.js";

export type StationPresentationPatch = Readonly<{
  shell?: Partial<StationPresentationState["shell"]>;
  appearance?: Partial<{
    theme: StationTheme;
    density: StationDensity;
    motion: StationMotion;
    accent: string;
  }>;
  windowing?: Partial<StationPresentationState["windowing"]>;
}>;

export function updateStationPresentationState(
  current: StationPresentationState,
  patch: StationPresentationPatch,
): StationPresentationState {
  return normalizeStationPresentationState({
    ...current,
    shell: { ...current.shell, ...(patch.shell ?? {}) },
    appearance: { ...current.appearance, ...(patch.appearance ?? {}) },
    windowing: { ...current.windowing, ...(patch.windowing ?? {}) },
  });
}

export function resetStationPresentationState(): StationPresentationState {
  return DEFAULT_STATION_PRESENTATION_STATE;
}

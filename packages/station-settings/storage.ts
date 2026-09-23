import {
  DEFAULT_STATION_PRESENTATION_STATE,
  type StationPresentationState,
} from "./model.js";
import { migrateStationPresentationState } from "./normalize.js";

export interface StationPresentationStorage {
  load(): StationPresentationState;
  save(state: StationPresentationState): void;
  reset(): StationPresentationState;
}

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const STATION_PRESENTATION_STORAGE_KEY =
  "system-builder.station.presentation.v1";

export class BrowserLocalPresentationStorage implements StationPresentationStorage {
  constructor(
    private readonly storage: KeyValueStorage,
    private readonly key: string = STATION_PRESENTATION_STORAGE_KEY,
  ) {}

  load(): StationPresentationState {
    const raw = this.storage.getItem(this.key);
    if (raw === null) return DEFAULT_STATION_PRESENTATION_STATE;

    try {
      return migrateStationPresentationState(JSON.parse(raw));
    } catch {
      return DEFAULT_STATION_PRESENTATION_STATE;
    }
  }

  save(state: StationPresentationState): void {
    const normalized = migrateStationPresentationState(state);
    this.storage.setItem(this.key, JSON.stringify(normalized));
  }

  reset(): StationPresentationState {
    this.storage.removeItem(this.key);
    return DEFAULT_STATION_PRESENTATION_STATE;
  }
}

export function createBrowserLocalPresentationStorage(
  storage: KeyValueStorage,
): StationPresentationStorage {
  return new BrowserLocalPresentationStorage(storage);
}

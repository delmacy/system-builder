import assert from "node:assert/strict";
import test from "node:test";

import {
  BrowserLocalPresentationStorage,
  DEFAULT_STATION_PRESENTATION_STATE,
  STATION_PRESENTATION_SCHEMA_VERSION,
  migrateStationPresentationState,
  normalizeStationPresentationState,
  resetStationPresentationState,
  updateStationPresentationState,
  type KeyValueStorage,
} from "../../packages/station-settings/index.js";

class MemoryStorage implements KeyValueStorage {
  readonly data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }
}

test("malformed presentation state fails safe to defaults", () => {
  assert.deepEqual(
    normalizeStationPresentationState(null),
    DEFAULT_STATION_PRESENTATION_STATE,
  );

  const normalized = normalizeStationPresentationState({
    schemaVersion: 1,
    shell: {
      navbarVisible: "yes",
      toolbarVisible: false,
    },
    appearance: {
      theme: "neon",
      density: "compact",
      motion: "reduced",
      accent: "<script>",
    },
    windowing: {
      snapEnabled: "true",
    },
  });

  assert.equal(normalized.schemaVersion, STATION_PRESENTATION_SCHEMA_VERSION);
  assert.equal(normalized.shell.navbarVisible, true);
  assert.equal(normalized.shell.toolbarVisible, false);
  assert.equal(normalized.appearance.theme, "system");
  assert.equal(normalized.appearance.density, "compact");
  assert.equal(normalized.appearance.motion, "reduced");
  assert.equal(normalized.appearance.accent, "default");
  assert.equal(normalized.windowing.snapEnabled, true);
});

test("old and unknown versions migrate safely", () => {
  const old = migrateStationPresentationState({
    schemaVersion: 0,
    shell: { navbarVisible: false },
  });
  assert.equal(old.shell.navbarVisible, false);
  assert.equal(old.schemaVersion, 1);

  const future = migrateStationPresentationState({
    schemaVersion: 999,
    shell: { navbarVisible: false },
  });
  assert.deepEqual(future, DEFAULT_STATION_PRESENTATION_STATE);
});

test("updates remain bounded to presentation fields", () => {
  const updated = updateStationPresentationState(
    DEFAULT_STATION_PRESENTATION_STATE,
    {
      shell: { taskbarAutoHide: true },
      appearance: {
        theme: "dark",
        density: "compact",
        motion: "reduced",
        accent: "violet",
      },
      windowing: { snapEnabled: false },
    },
  );

  assert.equal(updated.shell.taskbarAutoHide, true);
  assert.equal(updated.appearance.theme, "dark");
  assert.equal(updated.appearance.density, "compact");
  assert.equal(updated.appearance.motion, "reduced");
  assert.equal(updated.appearance.accent, "violet");
  assert.equal(updated.windowing.snapEnabled, false);
  assert.equal("authorization" in updated, false);
  assert.equal("secrets" in updated, false);
  assert.equal("businessData" in updated, false);
});

test("browser-local adapter round-trips normalized presentation state", () => {
  const memory = new MemoryStorage();
  const storage = new BrowserLocalPresentationStorage(memory);

  const state = updateStationPresentationState(
    DEFAULT_STATION_PRESENTATION_STATE,
    {
      appearance: {
        theme: "dark",
        density: "compact",
        motion: "full",
        accent: "blue",
      },
    },
  );

  storage.save(state);
  assert.deepEqual(storage.load(), state);

  const reset = storage.reset();
  assert.deepEqual(reset, DEFAULT_STATION_PRESENTATION_STATE);
  assert.deepEqual(storage.load(), DEFAULT_STATION_PRESENTATION_STATE);
});

test("corrupt browser storage never becomes canonical truth", () => {
  const memory = new MemoryStorage();
  memory.setItem(
    "system-builder.station.presentation.v1",
    "{not-json",
  );

  const storage = new BrowserLocalPresentationStorage(memory);
  assert.deepEqual(storage.load(), DEFAULT_STATION_PRESENTATION_STATE);
});

test("reset is presentation-only and deterministic", () => {
  const reset = resetStationPresentationState();
  assert.deepEqual(reset, DEFAULT_STATION_PRESENTATION_STATE);
  assert.equal("session" in reset, false);
  assert.equal("credentials" in reset, false);
  assert.equal("authorization" in reset, false);
});

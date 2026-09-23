import type { WindowDefinition } from "@system-builder/station-windowing";

import type { AppLaunch, AppManifest, ToolManifest } from "./types.js";
import { normalizeAppManifest } from "./validation.js";

function token(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`${label} must be non-empty`);
  return normalized;
}

export class StationAppRegistry {
  readonly #apps = new Map<string, AppManifest>();

  constructor(manifests: readonly unknown[] = []) {
    for (const manifest of manifests) this.register(manifest);
  }

  register(input: unknown): AppManifest {
    const manifest = normalizeAppManifest(input);
    if (this.#apps.has(manifest.id)) throw new Error(`duplicate app manifest id: ${manifest.id}`);
    this.#apps.set(manifest.id, manifest);
    return manifest;
  }

  get(appRef: string): AppManifest | null {
    return this.#apps.get(token(appRef, "app ref")) ?? null;
  }

  list(): readonly AppManifest[] {
    return Object.freeze([...this.#apps.values()].sort((a, b) => a.id.localeCompare(b.id)));
  }

  listTools(): readonly Readonly<{ appRef: string; tool: ToolManifest }>[] {
    return Object.freeze(
      this.list()
        .flatMap((app) => app.tools.map((tool) => Object.freeze({ appRef: app.id, tool })))
        .sort((a, b) => a.tool.id.localeCompare(b.tool.id)),
    );
  }

  launch(appRef: string): AppLaunch {
    const app = this.get(appRef);
    if (app === null) throw new Error(`unknown app manifest: ${token(appRef, "app ref")}`);

    const windowDefinitions: readonly WindowDefinition[] = Object.freeze(
      app.windows.map((window) =>
        Object.freeze({
          ...window,
          multiInstance: app.launchPolicy === "MULTI_INSTANCE" ? true : window.multiInstance,
        }),
      ),
    );

    return Object.freeze({ appRef: app.id, windowDefinitions });
  }
}

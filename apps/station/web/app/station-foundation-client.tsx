"use client";

import { useEffect, useMemo, useReducer, useState } from "react";

import { Badge, Button, Panel } from "../../../../packages/ui-core/index";
import {
  M1_UTILITY_APPS,
  StationAppRegistry,
} from "../../../../packages/station-app-runtime/index";
import {
  WindowFrame,
  createWindowRuntimeState,
  reduceWindowRuntime,
} from "../../../../packages/station-windowing/index";
import {
  DEFAULT_STATION_PRESENTATION_STATE,
  createBrowserLocalPresentationStorage,
  updateStationPresentationState,
  type StationPresentationState,
} from "../../../../packages/station-settings/index";

const registry = new StationAppRegistry(M1_UTILITY_APPS);
const welcome = registry.launch("app:welcome");
const definitions = registry.list().flatMap((app) => registry.launch(app.id).windowDefinitions);
const bounds = Object.freeze({ width: 1180, height: 720 });

function initialWindows() {
  const base = createWindowRuntimeState(definitions, bounds);
  return reduceWindowRuntime(base, {
    type: "OPEN",
    definitionRef: welcome.windowDefinitions[0]!.id,
    presentationPayload: { source: "manifest" },
  });
}

export function StationFoundationClient() {
  const [windows, dispatch] = useReducer(reduceWindowRuntime, undefined, initialWindows);
  const [presentation, setPresentation] = useState<StationPresentationState>(
    DEFAULT_STATION_PRESENTATION_STATE,
  );
  const storage = useMemo(
    () =>
      typeof window === "undefined"
        ? null
        : createBrowserLocalPresentationStorage(window.localStorage),
    [],
  );

  useEffect(() => {
    if (storage !== null) setPresentation(storage.load());
  }, [storage]);

  const setDensity = () => {
    const next = updateStationPresentationState(presentation, {
      appearance: {
        density:
          presentation.appearance.density === "comfortable" ? "compact" : "comfortable",
      },
    });
    setPresentation(next);
    storage?.save(next);
  };

  const active = windows.instances.find((instance) => instance.lifecycle === "OPEN");
  const definition =
    active === undefined
      ? undefined
      : windows.definitions.find((candidate) => candidate.id === active.definitionRef);

  return (
    <main
      className="min-h-screen bg-[var(--sb-desktop)] p-6"
      data-density={presentation.appearance.density}
      data-station-core="disconnected"
    >
      <Panel className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1240px] flex-col overflow-hidden p-0">
        <header className="flex items-center justify-between gap-4 border-b px-5 py-3">
          <div className="flex items-center gap-3">
            <Badge>System Builder Station</Badge>
            <span className="text-sm text-muted-foreground">Empty desktop foundation</span>
          </div>
          <Badge className="bg-muted text-muted-foreground">Core: Disconnected</Badge>
        </header>

        <section
          aria-label="Station empty desktop"
          className="relative min-h-[720px] flex-1 overflow-hidden bg-[var(--sb-desktop)]"
          data-app-count={registry.list().length}
        >
          {active !== undefined && definition !== undefined ? (
            <WindowFrame
              bounds={windows.bounds}
              definition={definition}
              dispatch={dispatch}
              instance={active}
            >
              <div className="space-y-4 p-6">
                <h1 className="text-2xl font-semibold">Welcome</h1>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  This utility window is resolved from AppManifest → WindowDefinition → WindowFrame.
                  Station presentation state remains local and disposable; no Core truth is inferred.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={setDensity} variant="outline">
                    Density: {presentation.appearance.density}
                  </Button>
                  <Button
                    onClick={() => {
                      const next = storage?.reset() ?? DEFAULT_STATION_PRESENTATION_STATE;
                      setPresentation(next);
                    }}
                    variant="ghost"
                  >
                    Reset presentation
                  </Button>
                </div>
              </div>
            </WindowFrame>
          ) : (
            <div className="grid min-h-[720px] place-items-center text-sm text-muted-foreground">
              Empty desktop — no open windows
            </div>
          )}
        </section>
      </Panel>
    </main>
  );
}

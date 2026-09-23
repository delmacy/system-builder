"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import { Badge, Button } from "../../../../packages/ui-core/index";
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
const initialBounds = Object.freeze({ width: 1280, height: 720 });

function initialWindows() {
  const base = createWindowRuntimeState(definitions, initialBounds);
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
  const desktopRef = useRef<HTMLElement | null>(null);
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

  useEffect(() => {
    const desktop = desktopRef.current;
    if (desktop === null) return;

    const synchronizeBounds = () => {
      const rect = desktop.getBoundingClientRect();
      dispatch({
        type: "SET_BOUNDS",
        bounds: {
          width: Math.max(1, Math.floor(rect.width)),
          height: Math.max(1, Math.floor(rect.height)),
        },
      });
    };

    synchronizeBounds();

    const observer = new ResizeObserver(synchronizeBounds);
    observer.observe(desktop);

    return () => observer.disconnect();
  }, []);

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
      className="h-[100dvh] w-screen overflow-hidden bg-[var(--sb-desktop)]"
      data-density={presentation.appearance.density}
      data-station-core="disconnected"
    >
      <section className="flex h-full w-full flex-col overflow-hidden bg-card text-card-foreground">
        <header className="flex h-11 shrink-0 items-center justify-between gap-4 border-b px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Badge className="shrink-0">System Builder Station</Badge>
            <span className="truncate text-sm text-muted-foreground">
              Empty desktop foundation
            </span>
          </div>
          <Badge className="shrink-0 bg-muted text-muted-foreground">
            Core: Disconnected
          </Badge>
        </header>

        <section
          ref={desktopRef}
          aria-label="Station empty desktop"
          className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-[var(--sb-desktop)]"
          data-app-count={registry.list().length}
          data-window-bounds={`${windows.bounds.width}x${windows.bounds.height}`}
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
            <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
              Empty desktop — no open windows
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

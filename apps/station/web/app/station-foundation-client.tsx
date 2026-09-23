"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import { Badge, Button } from "../../../../packages/ui-core/index";
import { StationIcon } from "../../../../packages/ui-icons/index";
import { StationNavbar } from "../../../../packages/station-shell/index";
import {
  M1_UTILITY_APPS,
  StationAppRegistry,
} from "../../../../packages/station-app-runtime/index";
import {
  WindowFrame,
  createWindowRuntimeState,
  reduceWindowRuntime,
  type WindowDefinition,
  type WindowInstance,
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
const initialBounds = Object.freeze({ width: 1280, height: 672 });

function initialWindows() {
  const base = createWindowRuntimeState(definitions, initialBounds);
  return reduceWindowRuntime(base, {
    type: "OPEN",
    definitionRef: welcome.windowDefinitions[0]!.id,
    presentationPayload: { source: "manifest" },
  });
}

function definitionFor(
  instance: WindowInstance,
  allDefinitions: readonly WindowDefinition[],
) {
  return allDefinitions.find((candidate) => candidate.id === instance.definitionRef);
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

  const resetPresentation = () => {
    const next = storage?.reset() ?? DEFAULT_STATION_PRESENTATION_STATE;
    setPresentation(next);
  };

  const openApp = (appId: string) => {
    const launched = registry.launch(appId);
    const definition = launched.windowDefinitions[0];
    if (definition === undefined) return;

    dispatch({
      type: "OPEN",
      definitionRef: definition.id,
      presentationPayload: { source: "taskbar-launcher", appRef: appId },
    });
  };

  const activateWindow = (instance: WindowInstance) => {
    dispatch({
      type: instance.lifecycle === "MINIMIZED" ? "RESTORE" : "FOCUS",
      windowRef: instance.windowRef,
    });
  };

  const renderWindowBody = (definition: WindowDefinition) => {
    switch (definition.id) {
      case "settings":
        return (
          <div className="space-y-4 p-6">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Station presentation preferences remain local and disposable.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={setDensity} variant="outline">
                Density: {presentation.appearance.density}
              </Button>
              <Button onClick={resetPresentation} variant="ghost">
                Reset presentation
              </Button>
            </div>
          </div>
        );

      case "component-lab":
        return (
          <div className="space-y-4 p-6">
            <h1 className="text-2xl font-semibold">Component Lab</h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              M1 utility surface for inspecting Station-owned primitives and interaction states.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge>Button</Badge>
              <Badge>Badge</Badge>
              <Badge>WindowFrame</Badge>
              <Badge>Semantic icons</Badge>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4 p-6">
            <h1 className="text-2xl font-semibold">Welcome</h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              This utility window is resolved from AppManifest → WindowDefinition → WindowFrame.
              Station presentation state remains local and disposable; no Core truth is inferred.
            </p>
          </div>
        );
    }
  };

  const visibleWindows = windows.instances.filter(
    (instance) => instance.lifecycle !== "CLOSED",
  );
  const openWindows = windows.instances.filter(
    (instance) => instance.lifecycle === "OPEN",
  );
  const activeWindow =
    windows.activeWindowRef === null
      ? undefined
      : windows.instances.find(
          (instance) => instance.windowRef === windows.activeWindowRef,
        );
  const activeDefinition =
    activeWindow === undefined
      ? undefined
      : definitionFor(activeWindow, windows.definitions);
  const currentContext = activeDefinition?.title ?? "Desktop";

  return (
    <main
      className="h-[100dvh] w-screen overflow-hidden bg-[var(--sb-desktop)]"
      data-density={presentation.appearance.density}
      data-station-core="disconnected"
    >
      <section className="flex h-full w-full flex-col overflow-hidden bg-card text-card-foreground">
        {presentation.shell.navbarVisible ? (
          <StationNavbar
            connection="disconnected"
            contextLabel={currentContext}
            onHome={() => openApp("app:welcome")}
            onSettings={() => openApp("app:settings")}
          />
        ) : null}

        <section
          ref={desktopRef}
          aria-label="Station desktop"
          className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-[var(--sb-desktop)]"
          data-app-count={registry.list().length}
          data-window-bounds={`${windows.bounds.width}x${windows.bounds.height}`}
        >
          {openWindows.length === 0 ? (
            <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
              Empty desktop — launch an app from the taskbar
            </div>
          ) : null}

          {openWindows.map((instance) => {
            const definition = definitionFor(instance, windows.definitions);
            if (definition === undefined) return null;

            return (
              <WindowFrame
                key={instance.windowRef}
                bounds={windows.bounds}
                definition={definition}
                dispatch={dispatch}
                instance={instance}
              >
                {renderWindowBody(definition)}
              </WindowFrame>
            );
          })}
        </section>

        <footer
          data-slot="station-taskbar"
          className="flex h-12 shrink-0 items-center gap-2 border-t bg-[var(--sb-taskbar)] px-3"
        >
          <div className="flex shrink-0 items-center gap-1 border-r pr-2">
            {registry.list().map((app) => (
              <Button
                key={app.id}
                aria-label={`Launch ${app.name}`}
                size="icon"
                variant="ghost"
                onClick={() => openApp(app.id)}
              >
                <StationIcon token={app.icon} />
              </Button>
            ))}
          </div>

          <div
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
            data-slot="taskbar-windows"
          >
            {visibleWindows.map((instance) => {
              const definition = definitionFor(instance, windows.definitions);
              if (definition === undefined) return null;

              return (
                <Button
                  key={instance.windowRef}
                  className="max-w-56 justify-start"
                  data-window-active={windows.activeWindowRef === instance.windowRef ? "true" : "false"}
                  data-window-lifecycle={instance.lifecycle}
                  variant={
                    windows.activeWindowRef === instance.windowRef &&
                    instance.lifecycle === "OPEN"
                      ? "secondary"
                      : "ghost"
                  }
                  onClick={() => activateWindow(instance)}
                >
                  <StationIcon token={definition.icon} />
                  <span className="truncate">{definition.title}</span>
                </Button>
              );
            })}
          </div>
        </footer>
      </section>
    </main>
  );
}

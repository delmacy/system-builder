"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Badge, Button } from "../../../../packages/ui-core/index";
import { StationCommandSurface, StationNavbar, StationTaskbar, type CommandSurfaceMode } from "../../../../packages/station-shell/index";
import { PresentationCommandRegistry, focusTarget, interactionContext, selectionContext } from "../../../../packages/station-interaction/index";
import { M1_UTILITY_APPS, StationAppRegistry } from "../../../../packages/station-app-runtime/index";
import { WindowFrame, createWindowPresentationCommands, createWindowRuntimeState, reduceWindowRuntime, type WindowDefinition, type WindowInstance } from "../../../../packages/station-windowing/index";
import { DEFAULT_STATION_PRESENTATION_STATE, createBrowserLocalPresentationStorage, updateStationPresentationState, type StationPresentationState } from "../../../../packages/station-settings/index";

const registry = new StationAppRegistry(M1_UTILITY_APPS);
const welcome = registry.launch("app:welcome");
const definitions = registry.list().flatMap((app) => registry.launch(app.id).windowDefinitions);
const initialBounds = Object.freeze({ width: 1280, height: 672 });

function initialWindows() {
  const base = createWindowRuntimeState(definitions, initialBounds);
  return reduceWindowRuntime(base, { type: "OPEN", definitionRef: welcome.windowDefinitions[0]!.id, presentationPayload: { source: "manifest" } });
}

function definitionFor(instance: WindowInstance, allDefinitions: readonly WindowDefinition[]) {
  return allDefinitions.find((candidate) => candidate.id === instance.definitionRef);
}

export function StationFoundationClient() {
  const [windows, dispatch] = useReducer(reduceWindowRuntime, undefined, initialWindows);
  const [presentation, setPresentation] = useState<StationPresentationState>(DEFAULT_STATION_PRESENTATION_STATE);
  const [commandSurfaceExpanded, setCommandSurfaceExpanded] = useState(false);
  const [commandSurfaceMode, setCommandSurfaceMode] = useState<CommandSurfaceMode>("commands");
  const [launcherOpen, setLauncherOpen] = useState(false);
  const desktopRef = useRef<HTMLElement | null>(null);
  const commandRegistry = useMemo(() => {
    const commands = new PresentationCommandRegistry();
    for (const command of createWindowPresentationCommands(dispatch)) commands.register(command);
    return commands;
  }, [dispatch]);
  const storage = useMemo(() => typeof window === "undefined" ? null : createBrowserLocalPresentationStorage(window.localStorage), []);

  useEffect(() => { if (storage !== null) setPresentation(storage.load()); }, [storage]);
  useEffect(() => {
    const desktop = desktopRef.current;
    if (desktop === null) return;
    const synchronizeBounds = () => {
      const rect = desktop.getBoundingClientRect();
      dispatch({ type: "SET_BOUNDS", bounds: { width: Math.max(1, Math.floor(rect.width)), height: Math.max(1, Math.floor(rect.height)) } });
    };
    synchronizeBounds();
    const observer = new ResizeObserver(synchronizeBounds);
    observer.observe(desktop);
    return () => observer.disconnect();
  }, []);

  const setDensity = () => {
    const next = updateStationPresentationState(presentation, { appearance: { density: presentation.appearance.density === "comfortable" ? "compact" : "comfortable" } });
    setPresentation(next); storage?.save(next);
  };
  const resetPresentation = () => { const next = storage?.reset() ?? DEFAULT_STATION_PRESENTATION_STATE; setPresentation(next); };
  const openApp = (appId: string) => {
    const definition = registry.launch(appId).windowDefinitions[0];
    if (definition === undefined) return;
    dispatch({ type: "OPEN", definitionRef: definition.id, presentationPayload: { source: "taskbar-launcher", appRef: appId } });
  };
  const activateWindow = (instance: WindowInstance) => {
    const isActive = windows.activeWindowRef === instance.windowRef && instance.lifecycle === "OPEN";
    dispatch({ type: instance.lifecycle === "MINIMIZED" ? "RESTORE" : isActive ? "MINIMIZE" : "FOCUS", windowRef: instance.windowRef });
  };
  const renderWindowBody = (definition: WindowDefinition) => {
    switch (definition.id) {
      case "settings": return <div className="space-y-4 p-6"><h1 className="text-2xl font-semibold">Settings</h1><p className="max-w-xl text-sm leading-6 text-muted-foreground">Station presentation preferences remain local and disposable.</p><div className="flex flex-wrap gap-2"><Button onClick={setDensity} variant="outline">Density: {presentation.appearance.density}</Button><Button onClick={resetPresentation} variant="ghost">Reset presentation</Button></div></div>;
      case "component-lab": return <div className="space-y-4 p-6"><h1 className="text-2xl font-semibold">Component Lab</h1><p className="max-w-xl text-sm leading-6 text-muted-foreground">M1 utility surface for inspecting Station-owned primitives and interaction states.</p><div className="flex flex-wrap gap-2"><Badge>Button</Badge><Badge>Badge</Badge><Badge>WindowFrame</Badge><Badge>Semantic icons</Badge></div></div>;
      default: return <div className="space-y-4 p-6"><h1 className="text-2xl font-semibold">Welcome</h1><p className="max-w-xl text-sm leading-6 text-muted-foreground">This utility window is resolved from AppManifest → WindowDefinition → WindowFrame. Station presentation state remains local and disposable; no Core truth is inferred.</p></div>;
    }
  };

  const visibleWindows = windows.instances.filter((instance) => instance.lifecycle !== "CLOSED");
  const openWindows = windows.instances.filter((instance) => instance.lifecycle === "OPEN");
  const activeWindow = windows.activeWindowRef === null ? undefined : windows.instances.find((instance) => instance.windowRef === windows.activeWindowRef);
  const activeDefinition = activeWindow === undefined ? undefined : definitionFor(activeWindow, windows.definitions);
  const taskbarWindows = visibleWindows.flatMap((instance) => { const definition = definitionFor(instance, windows.definitions); return definition === undefined ? [] : [{ instance, definition }]; });
  const currentContext = activeDefinition?.title ?? "Desktop";
  const commandContext = interactionContext({ focus: activeWindow === undefined ? null : focusTarget("window", activeWindow.windowRef), selection: selectionContext(), surfaceRef: "station:desktop" });
  const openCommandSurface = (mode: CommandSurfaceMode) => { setCommandSurfaceMode(mode); setCommandSurfaceExpanded(true); };

  return <main className="h-[100dvh] w-screen overflow-hidden bg-[var(--sb-desktop)]" data-density={presentation.appearance.density} data-station-core="disconnected">
    <section className="flex h-full w-full flex-col overflow-hidden bg-card text-card-foreground">
      {presentation.shell.navbarVisible ? <StationNavbar connection="disconnected" contextLabel={currentContext} commandAvailable searchAvailable onCommand={() => openCommandSurface("commands")} onHome={() => openApp("app:welcome")} onSearch={() => openCommandSurface("search")} onSettings={() => openApp("app:settings")} /> : null}
      {presentation.shell.toolbarVisible ? <StationCommandSurface connection="disconnected" context={commandContext} expanded={commandSurfaceExpanded} mode={commandSurfaceMode} onExpandedChange={setCommandSurfaceExpanded} registry={commandRegistry} /> : null}
      <section ref={desktopRef} aria-label="Station desktop" className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-[var(--sb-desktop)]" data-app-count={registry.list().length} data-window-bounds={`${windows.bounds.width}x${windows.bounds.height}`}>
        {openWindows.length === 0 ? <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">Empty desktop — launch an app from the taskbar</div> : null}
        {openWindows.map((instance) => { const definition = definitionFor(instance, windows.definitions); if (definition === undefined) return null; return <WindowFrame key={instance.windowRef} bounds={windows.bounds} definition={definition} dispatch={dispatch} instance={instance} snapEnabled={presentation.windowing.snapEnabled}>{renderWindowBody(definition)}</WindowFrame>; })}
      </section>
      <StationTaskbar activeWindowRef={windows.activeWindowRef} apps={registry.list()} launcherOpen={launcherOpen} windows={taskbarWindows} onActivateWindow={activateWindow} onLaunchApp={openApp} onLauncherOpenChange={setLauncherOpen} />
    </section>
  </main>;
}

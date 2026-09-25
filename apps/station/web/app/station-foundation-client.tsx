"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge, Button, ButtonGroup, IconButton, PropertyInspector, Tree, type PropertyGroupDefinition, type TreeNode } from "../../../../packages/ui-core/index";
import { ICON_TOKENS, StationIcon } from "../../../../packages/ui-icons/index";
import { BUTTON_GROUP_DESCRIPTOR, ComponentRegistry, normalizeComponentDescriptor, validateCompositionPlacement } from "../../../../packages/station-composition/index";
import { StationCommandSurface, StationNavbar, StationTaskbar, type CommandSurfaceMode } from "../../../../packages/station-shell/index";
import { PresentationCommandRegistry, createCollectionIndex, emptySelection, focusTarget, interactionContext, selectedItem, selectionContext, type SelectionState } from "../../../../packages/station-interaction/index";
import { M1_UTILITY_APPS, StationAppRegistry } from "../../../../packages/station-app-runtime/index";
import { WindowFrame, createWindowPresentationCommands, createWindowRuntimeState, loadWindowPresentationLayout, reduceWindowRuntime, resetWindowPresentationLayout, saveWindowPresentationLayout, type WindowAction, type WindowDefinition, type WindowInstance } from "../../../../packages/station-windowing/index";
import { DEFAULT_STATION_PRESENTATION_STATE, createBrowserLocalPresentationStorage, updateStationPresentationState, type StationPresentationPatch, type StationPresentationState } from "../../../../packages/station-settings/index";

const registry = new StationAppRegistry(M1_UTILITY_APPS);
const welcome = registry.launch("app:welcome");
const definitions = registry.list().flatMap((app) => registry.launch(app.id).windowDefinitions);
const initialBounds = Object.freeze({ width: 1280, height: 672 });
const labAtomicButton = normalizeComponentDescriptor({ id: "component:lab-button", family: "atomic", layout: "none", childPolicy: "none", constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2, minRows: 1, maxRows: 1, recommendedRows: 1 }, slots: [] });
const labCollection = normalizeComponentDescriptor({ ...labAtomicButton, id: "component:lab-collection", family: "collection" });
const compositionRegistry = new ComponentRegistry([BUTTON_GROUP_DESCRIPTOR, labAtomicButton]);
function placementOutcome(child: typeof labAtomicButton): "valid" | "invalid" { try { validateCompositionPlacement({ parent: BUTTON_GROUP_DESCRIPTOR, child, slotId: "button-1", columnSpan: 2, rowSpan: 1 }); return "valid"; } catch { return "invalid"; } }

const labLayers: readonly TreeNode[] = [
  { ref: "layer:page", label: "Page", children: [
    { ref: "layer:toolbar", label: "Toolbar", children: [
      { ref: "layer:button-group", label: "ButtonGroup", children: [
        { ref: "layer:button-1", label: "Button 1" }, { ref: "layer:button-2", label: "Button 2" },
      ] },
    ] },
    { ref: "layer:content", label: "Content grid" },
  ] },
];
const labLayerData = [
  { ref: "layer:page", payload: { kind: "container", span: "12/12", slot: "root" } },
  { ref: "layer:toolbar", payload: { kind: "container", span: "12/12", slot: "page.toolbar" } },
  { ref: "layer:button-group", payload: { kind: "collection", span: "5/12", slot: "toolbar.actions" } },
  { ref: "layer:button-1", payload: { kind: "atomic", span: "1/5", slot: "button-1" } },
  { ref: "layer:button-2", payload: { kind: "atomic", span: "1/5", slot: "button-2" } },
  { ref: "layer:content", payload: { kind: "container", span: "7/12", slot: "page.content" } },
] as const;
const labLayerCollection = createCollectionIndex(labLayerData);
const initialLayerSelection: SelectionState = { selectedRef: "layer:button-group" };
const initialExpandedLayers = new Set(["layer:page", "layer:toolbar", "layer:button-group"]);
function inspectorGroups(selection: SelectionState): readonly PropertyGroupDefinition[] {
  const item = selectedItem(labLayerCollection, selection);
  if (item === null) return [];
  return [{ id: "identity", label: "Selected component", rows: [
    { id: "ref", label: "Reference", value: item.ref, readOnly: true },
    { id: "kind", label: "Family", value: item.payload.kind, readOnly: true },
    { id: "span", label: "Discrete span", value: item.payload.span, readOnly: true },
    { id: "slot", label: "Named slot", value: item.payload.slot, readOnly: true },
  ] }];
}
function initialWindows() { return reduceWindowRuntime(createWindowRuntimeState(definitions, initialBounds), { type: "OPEN", definitionRef: welcome.windowDefinitions[0]!.id, presentationPayload: { source: "manifest" } }); }
function definitionFor(instance: WindowInstance, allDefinitions: readonly WindowDefinition[]) { return allDefinitions.find((candidate) => candidate.id === instance.definitionRef); }

export function StationFoundationClient() {
  const [windows, setWindows] = useState(initialWindows);
  const dispatch = useCallback((action: WindowAction) => setWindows((current) => reduceWindowRuntime(current, action)), []);
  const [presentation, setPresentation] = useState<StationPresentationState>(DEFAULT_STATION_PRESENTATION_STATE);
  const [commandSurfaceExpanded, setCommandSurfaceExpanded] = useState(false);
  const [commandSurfaceMode, setCommandSurfaceMode] = useState<CommandSurfaceMode>("commands");
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [labSelection, setLabSelection] = useState<SelectionState>(initialLayerSelection);
  const [labExpanded, setLabExpanded] = useState<ReadonlySet<string>>(initialExpandedLayers);
  const desktopRef = useRef<HTMLElement | null>(null);
  const layoutHydrated = useRef(false);
  const commandRegistry = useMemo(() => { const commands = new PresentationCommandRegistry(); for (const command of createWindowPresentationCommands(dispatch)) commands.register(command); return commands; }, [dispatch]);
  const storage = useMemo(() => typeof window === "undefined" ? null : createBrowserLocalPresentationStorage(window.localStorage), []);
  const localStorageRef = useMemo(() => typeof window === "undefined" ? null : window.localStorage, []);
  useEffect(() => { if (storage !== null) setPresentation(storage.load()); }, [storage]);
  useEffect(() => { if (localStorageRef === null) return; const restored = loadWindowPresentationLayout(localStorageRef, definitions, initialBounds); if (restored !== null) setWindows(restored); layoutHydrated.current = true; }, [localStorageRef]);
  useEffect(() => { if (localStorageRef !== null && layoutHydrated.current) saveWindowPresentationLayout(localStorageRef, windows); }, [localStorageRef, windows]);
  useEffect(() => { const desktop = desktopRef.current; if (desktop === null) return; const synchronizeBounds = () => { const rect = desktop.getBoundingClientRect(); dispatch({ type: "SET_BOUNDS", bounds: { width: Math.max(1, Math.floor(rect.width)), height: Math.max(1, Math.floor(rect.height)) } }); }; synchronizeBounds(); const observer = new ResizeObserver(synchronizeBounds); observer.observe(desktop); return () => observer.disconnect(); }, [dispatch]);

  const patchPresentation = (patch: StationPresentationPatch) => { const next = updateStationPresentationState(presentation, patch); setPresentation(next); storage?.save(next); };
  const resetPresentation = () => { const next = storage?.reset() ?? DEFAULT_STATION_PRESENTATION_STATE; setPresentation(next); if (localStorageRef !== null) resetWindowPresentationLayout(localStorageRef); setWindows(initialWindows()); };
  const openApp = (appId: string) => { const definition = registry.launch(appId).windowDefinitions[0]; if (definition !== undefined) dispatch({ type: "OPEN", definitionRef: definition.id, presentationPayload: { source: "taskbar-launcher", appRef: appId } }); };
  const activateWindow = (instance: WindowInstance) => { const isActive = windows.activeWindowRef === instance.windowRef && instance.lifecycle === "OPEN"; dispatch({ type: instance.lifecycle === "MINIMIZED" ? "RESTORE" : isActive ? "MINIMIZE" : "FOCUS", windowRef: instance.windowRef }); };
  const settingButton = (label: string, value: string, onClick: () => void) => <Button onClick={onClick} variant="outline">{label}: {value}</Button>;
  const renderWindowBody = (definition: WindowDefinition) => {
    if (definition.id === "settings") return <div className="space-y-5 p-6"><div><h1 className="text-2xl font-semibold">Settings</h1><p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">Local presentation preferences only. These controls never mutate Core truth.</p></div><div className="flex flex-wrap gap-2">{settingButton("Theme", presentation.appearance.theme, () => patchPresentation({ appearance: { theme: presentation.appearance.theme === "system" ? "light" : presentation.appearance.theme === "light" ? "dark" : "system" } }))}{settingButton("Density", presentation.appearance.density, () => patchPresentation({ appearance: { density: presentation.appearance.density === "comfortable" ? "compact" : "comfortable" } }))}{settingButton("Motion", presentation.appearance.motion, () => patchPresentation({ appearance: { motion: presentation.appearance.motion === "full" ? "reduced" : "full" } }))}</div><div className="flex flex-wrap gap-2">{settingButton("Navbar", presentation.shell.navbarVisible ? "shown" : "hidden", () => patchPresentation({ shell: { navbarVisible: !presentation.shell.navbarVisible } }))}{settingButton("Toolbar", presentation.shell.toolbarVisible ? "shown" : "hidden", () => patchPresentation({ shell: { toolbarVisible: !presentation.shell.toolbarVisible } }))}{settingButton("Taskbar", presentation.shell.taskbarVisible ? "shown" : "hidden", () => patchPresentation({ shell: { taskbarVisible: !presentation.shell.taskbarVisible } }))}{settingButton("Auto-hide", presentation.shell.taskbarAutoHide ? "on" : "off", () => patchPresentation({ shell: { taskbarAutoHide: !presentation.shell.taskbarAutoHide } }))}{settingButton("Snap", presentation.windowing.snapEnabled ? "on" : "off", () => patchPresentation({ windowing: { snapEnabled: !presentation.windowing.snapEnabled } }))}</div><Button onClick={resetPresentation} variant="ghost">Reset presentation & layout</Button></div>;
    if (definition.id === "component-lab") return <div className="space-y-5 p-6" data-slot="composition-lab-proof"><div><h1 className="text-2xl font-semibold">Component Lab</h1><p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">Source-owned primitives plus the constrained LEGO composition substrate.</p></div><div className="flex flex-wrap gap-2"><Button>Primary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Badge>Badge</Badge><Badge>density:{presentation.appearance.density}</Badge><Badge>motion:{presentation.appearance.motion}</Badge><Badge>focus:{windows.activeWindowRef === null ? "none" : "window"}</Badge></div><section className="space-y-3 rounded-lg border p-4" aria-label="Composition contract proof"><div className="flex flex-wrap gap-2">{compositionRegistry.list().map((component) => <Badge key={component.id}>{component.id} · {component.family}</Badge>)}</div><div className="grid grid-cols-12 gap-2"><div className="col-span-5 rounded-md border p-3" data-column-span="5"><p className="mb-2 text-xs text-muted-foreground">ButtonGroup · span 5/12 · self-owned row slots</p><ButtonGroup aria-label="Five-button composition proof">{ICON_TOKENS.slice(0, 5).map((token) => <IconButton key={token} label={token} variant="outline"><StationIcon token={token} /></IconButton>)}</ButtonGroup></div><div className="col-span-7 rounded-md border p-3" data-column-span="7"><p className="text-xs">Constraint outcomes</p><div className="mt-2 flex gap-2"><Badge data-placement-outcome="valid">atomic → button-1: {placementOutcome(labAtomicButton)}</Badge><Badge data-placement-outcome="invalid">collection → button-1: {placementOutcome(labCollection)}</Badge></div></div></div></section><section className="grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" aria-label="Layers and inspector proof" data-slot="layers-inspector-proof"><div className="rounded-lg border p-3"><div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-semibold">Layers</h2><Badge>{labSelection.selectedRef ?? "none"}</Badge></div><Tree nodes={labLayers} collection={labLayerCollection} selection={labSelection} expandedRefs={labExpanded} onSelectionChange={setLabSelection} onExpandedChange={setLabExpanded} ariaLabel="Component layers" /></div><div className="rounded-lg border p-3"><h2 className="mb-2 text-sm font-semibold">Property Inspector</h2><PropertyInspector groups={inspectorGroups(labSelection)} empty="Unknown or unselected component reference" aria-label="Selected component properties" /><div className="mt-3 flex gap-2"><Button variant="outline" onClick={() => setLabSelection(emptySelection())}>Clear selection</Button><Button variant="ghost" onClick={() => setLabSelection({ selectedRef: "layer:unknown" })}>Prove unknown ref</Button></div></div></section><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{ICON_TOKENS.map((token) => <div key={token} className="flex items-center gap-2 rounded-md border p-2 text-xs"><StationIcon token={token} label={token} /><code>{token}</code></div>)}</div></div>;
    return <div className="space-y-4 p-6"><h1 className="text-2xl font-semibold">Welcome</h1><p className="max-w-xl text-sm leading-6 text-muted-foreground">This utility window is resolved from AppManifest → WindowDefinition → WindowFrame. Station presentation state remains local and disposable; no Core truth is inferred.</p></div>;
  };

  const visibleWindows = windows.instances.filter((instance) => instance.lifecycle !== "CLOSED"); const openWindows = windows.instances.filter((instance) => instance.lifecycle === "OPEN");
  const activeWindow = windows.activeWindowRef === null ? undefined : windows.instances.find((instance) => instance.windowRef === windows.activeWindowRef); const activeDefinition = activeWindow === undefined ? undefined : definitionFor(activeWindow, windows.definitions);
  const taskbarWindows = visibleWindows.flatMap((instance) => { const definition = definitionFor(instance, windows.definitions); return definition === undefined ? [] : [{ instance, definition }]; });
  const commandContext = interactionContext({ focus: activeWindow === undefined ? null : focusTarget("window", activeWindow.windowRef), selection: selectionContext(), surfaceRef: "station:desktop" });
  const openCommandSurface = useCallback((mode: CommandSurfaceMode) => { setCommandSurfaceMode(mode); setCommandSurfaceExpanded(true); }, []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const modifier = event.ctrlKey || event.metaKey;
      if (modifier && event.code === "Space") { event.preventDefault(); setLauncherOpen((open) => !open); return; }
      if (modifier && event.key.toLowerCase() === "k") { event.preventDefault(); openCommandSurface("commands"); return; }
      if (modifier && event.key === ",") { event.preventDefault(); openApp("app:settings"); return; }
      if (event.altKey && event.key === "Tab") { event.preventDefault(); if (visibleWindows.length === 0) return; const activeIndex = visibleWindows.findIndex((instance) => instance.windowRef === windows.activeWindowRef); const direction = event.shiftKey ? -1 : 1; const nextIndex = activeIndex < 0 ? 0 : (activeIndex + direction + visibleWindows.length) % visibleWindows.length; const next = visibleWindows[nextIndex]; if (next !== undefined) dispatch({ type: next.lifecycle === "MINIMIZED" ? "RESTORE" : "FOCUS", windowRef: next.windowRef }); }
    };
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch, openCommandSurface, visibleWindows, windows.activeWindowRef]);
  return <main className="h-[100dvh] w-screen overflow-hidden bg-[var(--sb-desktop)]" data-density={presentation.appearance.density} data-motion={presentation.appearance.motion} data-theme={presentation.appearance.theme} data-station-core="disconnected"><section className="flex h-full w-full flex-col overflow-hidden bg-card text-card-foreground">
    {presentation.shell.navbarVisible ? <StationNavbar connection="disconnected" contextLabel={activeDefinition?.title ?? "Desktop"} commandAvailable searchAvailable onCommand={() => openCommandSurface("commands")} onHome={() => openApp("app:welcome")} onSearch={() => openCommandSurface("search")} onSettings={() => openApp("app:settings")} /> : null}
    {presentation.shell.toolbarVisible ? <StationCommandSurface connection="disconnected" context={commandContext} expanded={commandSurfaceExpanded} mode={commandSurfaceMode} onExpandedChange={setCommandSurfaceExpanded} registry={commandRegistry} /> : null}
    <section ref={desktopRef} aria-label="Station desktop" className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-[var(--sb-desktop)]" data-app-count={registry.list().length} data-window-bounds={`${windows.bounds.width}x${windows.bounds.height}`}>{openWindows.length === 0 ? <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">Empty desktop — launch an app from the taskbar</div> : null}{openWindows.map((instance) => { const definition = definitionFor(instance, windows.definitions); return definition === undefined ? null : <WindowFrame key={instance.windowRef} bounds={windows.bounds} definition={definition} dispatch={dispatch} instance={instance} snapEnabled={presentation.windowing.snapEnabled}>{renderWindowBody(definition)}</WindowFrame>; })}</section>
    {presentation.shell.taskbarVisible ? <div data-taskbar-auto-hide={presentation.shell.taskbarAutoHide ? "true" : "false"} className={presentation.shell.taskbarAutoHide ? "opacity-35 transition-opacity hover:opacity-100 focus-within:opacity-100" : undefined}><StationTaskbar activeWindowRef={windows.activeWindowRef} apps={registry.list()} launcherOpen={launcherOpen} windows={taskbarWindows} onActivateWindow={activateWindow} onLaunchApp={openApp} onLauncherOpenChange={setLauncherOpen} /></div> : null}
  </section></main>;
}

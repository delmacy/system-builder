"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge, Button, ButtonGroup, IconButton, PropertyInspector, Tree, type PropertyGroupDefinition, type TreeNode } from "../../../../packages/ui-core/index";
import { ICON_TOKENS, StationIcon } from "../../../../packages/ui-icons/index";
import { BUTTON_GROUP_DESCRIPTOR, ComponentRegistry, normalizeComponentDescriptor, validateCompositionPlacement } from "../../../../packages/station-composition/index";
import { StationCommandSurface, StationNavbar, StationTaskbar, type CommandSurfaceMode } from "../../../../packages/station-shell/index";
import { PresentationCommandRegistry, createCollectionIndex, emptySelection, focusTarget, interactionContext, selectedItem, selectionContext, type CollectionItem, type SelectionState } from "../../../../packages/station-interaction/index";
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
type LabLayerPayload = Readonly<{ kind: string; span: string; slot: string }>;
const labLayerData: readonly CollectionItem<LabLayerPayload>[] = [
  { ref: "layer:page", payload: { kind: "container", span: "12/12", slot: "root" } },
  { ref: "layer:toolbar", payload: { kind: "container", span: "12/12", slot: "page.toolbar" } },
  { ref: "layer:button-group", payload: { kind: "collection", span: "5/12", slot: "toolbar.actions" } },
  { ref: "layer:button-1", payload: { kind: "atomic", span: "1/5", slot: "button-1" } },
  { ref: "layer:button-2", payload: { kind: "atomic", span: "1/5", slot: "button-2" } },
  { ref: "layer:content", payload: { kind: "container", span: "7/12", slot: "page.content" } },
];
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
    if (definition.id === "window:component-lab") {
      return <div className="station-lab-stack"><section className="station-lab-card"><strong>Component composition proof</strong><p>Registry resolves <code>{compositionRegistry.get(BUTTON_GROUP_DESCRIPTOR.id)?.id}</code> as a reusable collection descriptor.</p><ButtonGroup ariaLabel="Component Lab action group"><Button>Primary</Button><IconButton ariaLabel="Inspect component" icon={<StationIcon token={ICON_TOKENS.inspect} />} /></ButtonGroup><div className="station-lab-grid"><Badge variant="success">Valid placement: {placementOutcome(labAtomicButton)}</Badge><Badge variant="warning">Invalid placement: {placementOutcome(labCollection)}</Badge></div></section><section className="station-lab-card"><strong>Layers + Inspector proof</strong><div className="station-lab-grid"><Tree nodes={labLayers} selection={labSelection} expandedRefs={labExpanded} onSelectionChange={setLabSelection} onExpandedChange={setLabExpanded} ariaLabel="Component layers" /><PropertyInspector groups={inspectorGroups(labSelection)} ariaLabel="Selected component properties" /></div></section></div>;
    }
    if (definition.id === "window:settings") return <div className="station-settings-grid">{settingButton("Density", presentation.density, () => patchPresentation({ density: presentation.density === "comfortable" ? "compact" : "comfortable" }))}{settingButton("Contrast", presentation.contrast, () => patchPresentation({ contrast: presentation.contrast === "standard" ? "high" : "standard" }))}{settingButton("Motion", presentation.motion, () => patchPresentation({ motion: presentation.motion === "full" ? "reduced" : "full" }))}<Button onClick={resetPresentation} variant="outline">Reset presentation</Button></div>;
    return <div className="station-welcome"><strong>System Builder Station</strong><p>Desktop presentation shell ready.</p></div>;
  };

  return <main className={`station-root station-density-${presentation.density} station-contrast-${presentation.contrast} station-motion-${presentation.motion}`}><StationNavbar onToggleCommandSurface={() => setCommandSurfaceExpanded((current) => !current)} /><StationCommandSurface expanded={commandSurfaceExpanded} mode={commandSurfaceMode} onModeChange={setCommandSurfaceMode} context={interactionContext(focusTarget(windows.activeWindowRef ?? undefined), selectionContext(labSelection.selectedRef ?? undefined))} registry={commandRegistry} /><section ref={desktopRef} className="station-desktop">{windows.windows.map((instance) => { const definition = definitionFor(instance, definitions); if (definition === undefined || instance.lifecycle === "CLOSED") return null; return <WindowFrame key={instance.windowRef} instance={instance} definition={definition} focused={windows.activeWindowRef === instance.windowRef} onAction={dispatch}>{renderWindowBody(definition)}</WindowFrame>; })}</section><StationTaskbar windows={windows.windows} definitions={definitions} activeWindowRef={windows.activeWindowRef} launcherOpen={launcherOpen} apps={registry.list()} onToggleLauncher={() => setLauncherOpen((current) => !current)} onLaunchApp={(appId) => { openApp(appId); setLauncherOpen(false); }} onActivateWindow={activateWindow} /></main>;
}

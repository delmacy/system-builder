"use client";
import { useState } from "react";
import { OverlayPortalProvider, PresentationButton, PaneHeader, PropertyField, PropertySection, StatusBar, Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarToggleGroup, Input, SearchField, SelectField, TabStrip } from "../../../../packages/ui-core/index";
import { StationIcon } from "../../../../packages/ui-icons/index";

/** Construction D proof surface; commands are local demo state, not editor mutation. */
export function StationIndustrialFoundationLab() {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [presentationCount, setPresentationCount] = useState(0);
  const [alignment, setAlignment] = useState("align.left");
  const [saved, setSaved] = useState(false);
  const [width, setWidth] = useState("240");
  const [query, setQuery] = useState("");
  const [density, setDensity] = useState("compact");
  const [activeTab, setActiveTab] = useState("inspector");
  return <section ref={setContainer} className="space-y-3 rounded-lg border p-4" aria-label="Industrial toolbar foundation" data-slot="industrial-foundation-lab">
    <OverlayPortalProvider container={container}><PaneHeader title="Workstation components" subtitle="Construction D · source-owned presentation" />
    <TabStrip label="Workspace views" activeId={activeTab} onActiveChange={setActiveTab} tabs={[{id:"inspector",label:"Inspector"},{id:"assets",label:"Assets"}]} />
    <Toolbar label="Document toolbar">
      <ToolbarGroup label="File commands">
        <PresentationButton label="Save" mode="icon" icon="file.save" variant="ghost" onClick={() => setSaved(true)} />
        <ToolbarSeparator />
        <PresentationButton label="Undo" mode="icon" icon="edit.undo" variant="ghost" onClick={() => setSaved(false)} />
      </ToolbarGroup>
      <ToolbarToggleGroup label="Text alignment" value={alignment} onValueChange={setAlignment}
        options={[{ value: "align.left", label: "Align left", icon: <StationIcon token="text.align-left" /> }, { value: "align.center", label: "Align center", icon: <StationIcon token="text.align-center" /> }, { value: "align.right", label: "Align right", icon: <StationIcon token="text.align-right" /> }]} />
    </Toolbar>
    <Toolbar label="Button presentation modes">
      <PresentationButton label="Text action" onClick={() => setPresentationCount(n => n + 1)} />
      <PresentationButton label="Save with label" mode="icon-text" icon="file.save" onClick={() => setPresentationCount(n => n + 1)} />
      <PresentationButton label="Compact save" mode="icon" icon="file.save" onClick={() => setPresentationCount(n => n + 1)} />
      <PresentationButton label="Expand tools" mode="icon" icon="navigation.expand" expanded={expanded} onClick={() => setExpanded(value => !value)} />
      <PresentationButton label="Unavailable action" mode="icon" icon="file.save" disabled />
    </Toolbar>
    <p aria-live="polite" data-testid="presentation-actions">{presentationCount} presentation actions</p>
    <PropertySection title="Workspace controls">
      <PropertyField label="Search" control={<SearchField label="Search workstation controls" value={query} onChange={event => setQuery(event.target.value)} />} />
      <PropertyField label="Density" control={<SelectField label="Workstation density" value={density} onChange={event => setDensity(event.target.value)} options={[{value:"compact",label:"Compact"},{value:"comfortable",label:"Comfortable"}]} />} />
    </PropertySection>
    <PropertySection title="Geometry">
      <PropertyField label="Width" control={<Input aria-label="Width" type="number" min={1} value={width} onChange={event => setWidth(event.target.value)} />} />
    </PropertySection>
    <StatusBar label="Industrial component demo status" trailing={`${alignment} · ${density} · ${query.length} search chars`}>{saved ? "Saved locally" : "Unsaved demo"}</StatusBar>
  </OverlayPortalProvider></section>;
}

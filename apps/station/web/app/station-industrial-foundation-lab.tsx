"use client";
import { useState } from "react";
import { PaneHeader, PropertyField, PropertySection, StatusBar, Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarToggleGroup, Input, SearchField, SelectField, TabStrip, SplitPane, DockGroup, FilterBar } from "../../../../packages/ui-core/index";
import { StationIcon } from "../../../../packages/ui-icons/index";

/** Construction D proof surface; commands are local demo state, not editor mutation. */
export function StationIndustrialFoundationLab() {
  const [alignment, setAlignment] = useState("align.left");
  const [saved, setSaved] = useState(false);
  const [width, setWidth] = useState("240");
  const [query, setQuery] = useState("");
  const [density, setDensity] = useState("compact");
  const [activeTab, setActiveTab] = useState("inspector");
  const [splitFraction, setSplitFraction] = useState(0.45);
  const [dockActive, setDockActive] = useState("properties");
  const [onlyActive, setOnlyActive] = useState(false);
  return <section className="space-y-3 rounded-lg border p-4" aria-label="Industrial toolbar foundation" data-slot="industrial-foundation-lab">
    <PaneHeader title="Workstation components" subtitle="Construction D · source-owned presentation" />
    <TabStrip label="Workspace views" activeId={activeTab} onActiveChange={setActiveTab} tabs={[{id:"inspector",label:"Inspector"},{id:"assets",label:"Assets"}]} />
    <Toolbar label="Document toolbar">
      <ToolbarGroup label="File commands">
        <ToolbarButton label="Save" icon={<StationIcon token="file.save" />} onClick={() => setSaved(true)} />
        <ToolbarSeparator />
        <ToolbarButton label="Undo" icon={<StationIcon token="edit.undo" />} onClick={() => setSaved(false)} />
      </ToolbarGroup>
      <ToolbarToggleGroup label="Text alignment" value={alignment} onValueChange={setAlignment}
        options={[{ value: "align.left", label: "Align left", icon: <StationIcon token="text.align-left" /> }, { value: "align.center", label: "Align center", icon: <StationIcon token="text.align-center" /> }, { value: "align.right", label: "Align right", icon: <StationIcon token="text.align-right" /> }]} />
    </Toolbar>
    <PropertySection title="Workspace controls">
      <PropertyField label="Search" control={<SearchField label="Search workstation controls" value={query} onChange={event => setQuery(event.target.value)} />} />
      <PropertyField label="Density" control={<SelectField label="Workstation density" value={density} onChange={event => setDensity(event.target.value)} options={[{value:"compact",label:"Compact"},{value:"comfortable",label:"Comfortable"}]} />} />
    </PropertySection>
    <PropertySection title="Geometry">
      <PropertyField label="Width" control={<Input aria-label="Width" type="number" min={1} value={width} onChange={event => setWidth(event.target.value)} />} />
    </PropertySection>
    <FilterBar label="Document workspace" query={query} onQueryChange={setQuery} filters={[{id:"active",label:"Active items",selected:onlyActive,onToggle:()=>setOnlyActive(v=>!v)}]} actions={<ToolbarButton label="Refresh preview" icon={<StationIcon token="action.refresh" />} onClick={()=>setSaved(false)} />} />
    <SplitPane label="Document panel split" fraction={splitFraction} onFractionChange={setSplitFraction} className="h-56" first={
      <DockGroup label="Workspace docks" activeId={dockActive} onActiveChange={setDockActive} panels={[{id:"properties",label:"Properties",icon:"settings",content:<p className="text-sm">Properties pane</p>},{id:"layers",label:"Layers",icon:"view.list",content:<p className="text-sm">Layer hierarchy</p>}]} />
    } second={<div className="p-3 text-sm">Document preview area</div>} />
    <output aria-label="Split ratio" className="block text-xs">Split: {Math.round(splitFraction*100)}%</output>
    <StatusBar label="Industrial component demo status" trailing={`${alignment} · ${density} · ${query.length} search chars`}>{saved ? "Saved locally" : "Unsaved demo"}</StatusBar>
  </section>;
}

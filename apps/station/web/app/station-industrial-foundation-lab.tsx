"use client";
import { useState } from "react";
import { PaneHeader, PropertyField, PropertySection, StatusBar, Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarToggleGroup, Input, SearchField, SelectField } from "../../../../packages/ui-core/index";
import { StationIcon } from "../../../../packages/ui-icons/index";

/** Construction D proof surface; commands are local demo state, not editor mutation. */
export function StationIndustrialFoundationLab() {
  const [alignment, setAlignment] = useState("align.left");
  const [saved, setSaved] = useState(false);
  const [width, setWidth] = useState("240");
  const [query, setQuery] = useState("");
  const [density, setDensity] = useState("compact");
  return <section className="space-y-3 rounded-lg border p-4" aria-label="Industrial toolbar foundation" data-slot="industrial-foundation-lab">
    <PaneHeader title="Workstation components" subtitle="Construction D · source-owned presentation" />
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
    <StatusBar label="Industrial component demo status" trailing={`${alignment} · ${density} · ${query.length} search chars`}>{saved ? "Saved locally" : "Unsaved demo"}</StatusBar>
  </section>;
}

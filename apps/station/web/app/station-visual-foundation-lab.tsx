"use client";

import { useState } from "react";
import { Badge, Button, ButtonGroup, Input, Panel, Select, Separator, Toggle,
  STATION_SURFACE_TOKENS, cssVariable } from "../../../../packages/ui-core/index";
import type { StationPresentationState, StationPresentationPatch } from "../../../../packages/station-settings/index";

type Props = Readonly<{
  appearance: StationPresentationState["appearance"];
  onPresentationChange: (patch: StationPresentationPatch) => void;
}>;

/** C0 reference uses real shared controls; catalog insertion remains a later gate. */
export function StationVisualFoundationLab({ appearance, onPresentationChange }: Props) {
  const [selected, setSelected] = useState(true);
  return <section aria-label="Visual foundation reference" className="space-y-4 rounded-xl border bg-background p-4">
    <header className="space-y-1">
      <h2 className="font-semibold text-[length:var(--sb-text-title)]">Visual Foundation</h2>
      <p className="text-sm text-muted-foreground">Shared tokens and actual controls. Source reference; general editor insertion is not yet available.</p>
    </header>
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="space-y-1 text-sm">Reference theme<Select aria-label="Reference theme" value={appearance.theme}
        onChange={event => { const theme = event.currentTarget.value; if (theme === "light" || theme === "dark" || theme === "system") onPresentationChange({ appearance: { theme } }); }}>
        <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
      </Select></label>
      <label className="space-y-1 text-sm">Reference density<Select aria-label="Reference density" value={appearance.density}
        onChange={event => { const density = event.currentTarget.value; if (density === "comfortable" || density === "compact") onPresentationChange({ appearance: { density } }); }}>
        <option value="comfortable">Comfortable</option><option value="compact">Compact</option>
      </Select></label>
    </div>
    <ButtonGroup aria-label="Reference button variants" className="flex flex-wrap">
      <Button>Primary reference</Button><Button variant="secondary">Secondary reference</Button>
      <Button variant="outline">Outline reference</Button><Button variant="ghost">Ghost reference</Button>
      <Button variant="destructive">Destructive reference</Button><Button disabled>Disabled reference</Button>
      <Toggle pressed={selected} onPressedChange={setSelected}>Selected reference</Toggle>
    </ButtonGroup>
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="space-y-1 text-sm">Reference input<Input aria-label="Reference input" placeholder="Type to inspect focus" /></label>
      <label className="space-y-1 text-sm">Invalid reference<Input aria-label="Invalid reference" aria-invalid="true" aria-describedby="reference-error" defaultValue="Invalid value" /></label>
    </div>
    <p id="reference-error" className="text-sm text-destructive">Invalid state uses a border and this message, with an accessible relation.</p>
    <Separator />
    <div className="grid gap-2 sm:grid-cols-3" aria-label="Station surface tokens">
      {STATION_SURFACE_TOKENS.map(token => <Panel key={token} className="overflow-hidden p-2">
        <div data-reference-token={token} className="mb-2 h-8 rounded-md border" style={{ backgroundColor: cssVariable(token) }} />
        <code className="text-[length:var(--sb-text-xs)] font-[family-name:var(--sb-font-mono)]">{token}</code>
      </Panel>)}
    </div>
    <div className="flex flex-wrap items-center gap-2"><Badge>C0 reference</Badge>
      <span className="text-[length:var(--sb-text-xs)] text-muted-foreground">12 / 14 / 16 / 20px typography · shared spacing, radius and elevation</span>
    </div>
  </section>;
}

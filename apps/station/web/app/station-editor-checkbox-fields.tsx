import { Checkbox, Label } from "@system-builder/ui-core";
export function EditorCheckboxFields({ defaultChecked, disabled, change }: Readonly<{
  defaultChecked: string; disabled: string;
  change: (field: "checkboxDefaultChecked" | "propertyDisabled", value: string) => void;
}>) {
  return <fieldset className="space-y-3"><legend className="text-sm font-medium">Checkbox presentation</legend>
    <Label className="flex items-center gap-2"><Checkbox checked={defaultChecked === "true"} onChange={e => change("checkboxDefaultChecked", String(e.target.checked))} />Initially checked</Label>
    <Label className="flex items-center gap-2"><Checkbox checked={disabled === "true"} onChange={e => change("propertyDisabled", String(e.target.checked))} />Disabled preview</Label>
    <p className="text-xs text-muted-foreground">Initial appearance only. The consuming application owns the current checked state.</p>
  </fieldset>;
}

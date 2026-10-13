import { Input, Label, Select, Checkbox } from "@system-builder/ui-core";
export function EditorInputFields({ inputType, placeholder, readOnly, disabled, invalid, change }: Readonly<{
  inputType: string; placeholder: string; readOnly: string; disabled: string; invalid: boolean;
  change: (field: "inputType" | "inputPlaceholder" | "inputReadOnly" | "propertyDisabled", value: string) => void;
}>) {
  return <fieldset className="space-y-3"><legend className="text-sm font-medium">Input presentation</legend>
    <Label htmlFor="editor-input-type">Input type</Label>
    <Select id="editor-input-type" value={inputType} onChange={e => change("inputType", e.target.value)}>
      <option value="text">Text</option><option value="email">Email</option><option value="search">Search</option>
    </Select>
    <Label htmlFor="editor-input-placeholder">Placeholder</Label>
    <Input id="editor-input-placeholder" value={placeholder} onChange={e => change("inputPlaceholder", e.target.value)} aria-invalid={invalid} aria-describedby="input-properties-help editor-feedback" />
    <Label className="flex items-center gap-2"><Checkbox checked={readOnly === "true"} onChange={e => change("inputReadOnly", String(e.target.checked))} />Read only</Label>
    <Label className="flex items-center gap-2"><Checkbox checked={disabled === "true"} onChange={e => change("propertyDisabled", String(e.target.checked))} />Disabled preview</Label>
    <p id="input-properties-help" className="text-xs text-muted-foreground">Placeholder: up to 256 plain characters. Input values belong to the consuming application.</p>
  </fieldset>;
}

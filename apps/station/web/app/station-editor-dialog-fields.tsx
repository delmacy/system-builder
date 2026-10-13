import { Checkbox, Input, Label } from "@system-builder/ui-core";
export function EditorDialogFields({ title, description, disabled, invalid, change }: Readonly<{
  title: string; description: string; disabled: string; invalid: boolean;
  change: (field: "dialogTitle" | "dialogDescription" | "propertyDisabled", value: string) => void;
}>) {
  return <fieldset className="space-y-3"><legend className="text-sm font-medium">Dialog presentation</legend>
    <Label className="block">Dialog title<Input value={title} aria-invalid={invalid} aria-describedby="editor-feedback" onChange={event => change("dialogTitle", event.target.value)} /></Label>
    <Label className="block">Dialog description<Input value={description} aria-invalid={invalid} aria-describedby="editor-feedback" onChange={event => change("dialogDescription", event.target.value)} /></Label>
    <Label className="flex items-center gap-2"><Checkbox checked={disabled === "true"} onChange={event => change("propertyDisabled", String(event.target.checked))} />Disabled preview</Label>
    <p className="text-xs text-muted-foreground">Plain title and description. Opening the preview does not change or save the composition.</p>
  </fieldset>;
}

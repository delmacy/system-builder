"use client";

import { useState } from "react";
import { Alert, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Checkbox, DateTimeField, FileField, FieldDescription, FieldMessage, Label, NumberField, Progress, RadioGroup, Skeleton,
  Slider, Switch, Textarea } from "../../../../packages/ui-core/index";

export function StationPrimitiveFoundationLab() {
  const [enabled, setEnabled] = useState(false);
  const [alignment, setAlignment] = useState("left");
  const [quantity, setQuantity] = useState<number | undefined>(2);
  const [progress, setProgress] = useState(40);
  const [submissions, setSubmissions] = useState(0);
  const [appointment, setAppointment] = useState("");
  const [files, setFiles] = useState<readonly string[]>([]);
  const invalidQuantity = quantity !== undefined && (quantity < 0 || quantity > 10);
  return <section aria-label="Primitive foundation reference" className="space-y-4">
    <header><h2 className="text-xl font-semibold">Form and feedback primitives</h2>
      <p className="text-sm text-muted-foreground">Reusable source controls. Editor insertion and saved composition properties are a later qualification.</p></header>
    <Card><CardHeader><CardTitle>Native form controls</CardTitle><CardDescription>Keyboard behavior, disabled controls and native validity.</CardDescription></CardHeader>
      <CardContent><form aria-label="Primitive reference form" className="grid gap-4 sm:grid-cols-2"
        onSubmit={event => { event.preventDefault(); setSubmissions(current => current + 1); }}>
        <div className="space-y-2"><Label htmlFor="primitive-notes">Notes reference</Label>
          <Textarea id="primitive-notes" aria-describedby="primitive-notes-help" defaultValue="Source-owned notes" required />
          <FieldDescription id="primitive-notes-help">Required native textarea; plain text only.</FieldDescription></div>
        <div className="space-y-3">
          <Label className="flex items-center gap-2"><Checkbox defaultChecked />Checkbox reference</Label>
          <Label className="flex items-center gap-2"><Checkbox disabled />Disabled checkbox reference</Label>
          <Label className="flex items-center gap-2"><Switch checked={enabled} onChange={event => setEnabled(event.currentTarget.checked)} />Switch reference</Label>
          <Label className="flex items-center gap-2"><Switch disabled defaultChecked />Disabled switch reference</Label>
        </div>
        <RadioGroup label="Alignment reference" value={alignment} onValueChange={setAlignment}
          options={[{ value: "left", label: "Left reference" }, { value: "center", label: "Center reference" }, { value: "right", label: "Right reference" }, { value: "locked", label: "Disabled radio reference", disabled: true }]} />
        <RadioGroup label="Uncontrolled reference" defaultValue="a"
          options={[{ value: "a", label: "Option A reference" }, { value: "b", label: "Option B reference" }]} />
        <div className="space-y-2"><Label htmlFor="primitive-quantity">Quantity reference</Label>
          <NumberField id="primitive-quantity" min={0} max={10} step={1} value={quantity ?? ""} required onValueChange={setQuantity}
            aria-invalid={invalidQuantity || undefined} aria-describedby="primitive-quantity-help" />
          {invalidQuantity ? <FieldMessage id="primitive-quantity-help">Quantity must be between 0 and 10.</FieldMessage> :
            <FieldDescription id="primitive-quantity-help">Native limits 0–10, step 1; no silent clamping.</FieldDescription>}
        </div>
        <div className="space-y-2"><Label htmlFor="primitive-progress">Progress reference slider</Label>
          <Slider id="primitive-progress" min={0} max={100} step={5} value={progress} onChange={event => setProgress(Number(event.currentTarget.value))} />
          <Progress aria-label="Determinate reference" value={progress} /><output className="text-sm" aria-label="Progress reference value">{progress}%</output>
        </div>
        <div className="space-y-2"><Label htmlFor="primitive-appointment">Appointment date</Label><DateTimeField id="primitive-appointment" aria-label="Appointment date" value={appointment} onChange={event => setAppointment(event.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="primitive-files">Local files</Label><FileField id="primitive-files" aria-label="Local files" multiple onFilesChange={next => setFiles(next.map(file => file.name))} /><output aria-label="Selected local files" className="block text-xs text-muted-foreground">{files.length ? files.join(", ") : "No files selected"}</output><FieldDescription>Selection stays in this demo; no upload occurs.</FieldDescription></div>
        <div className="flex flex-wrap items-center gap-2 sm:col-span-2"><Button type="submit">Validate reference form</Button>
          <output aria-label="Reference submissions" className="text-sm">Accepted submissions: {submissions}</output></div>
      </form></CardContent>
      <CardFooter><span className="text-xs text-muted-foreground">Presentation-only reference. No owner service or business command is called.</span></CardFooter>
    </Card>
    <div className="grid gap-3 sm:grid-cols-2">
      <Alert>Information reference</Alert><Alert variant="success">Success reference</Alert>
      <Alert variant="warning">Warning reference</Alert><Alert variant="error">Error reference</Alert>
      <div className="space-y-2" aria-busy="true" aria-label="Loading reference"><FieldDescription>Loading reference</FieldDescription>
        <Skeleton className="w-3/4" /><Skeleton className="w-1/2" /></div>
      <div className="space-y-2"><FieldDescription>Indeterminate progress</FieldDescription><Progress aria-label="Indeterminate reference" /></div>
    </div>
  </section>;
}

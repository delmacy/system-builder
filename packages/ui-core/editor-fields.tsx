"use client";
import { useId, type ChangeEvent } from "react";
import { cn } from "./components.js";

export type ColorFieldProps = Readonly<{ label: string; value: string; onValueChange: (hex: string) => void; disabled?: boolean; className?: string }>;
/** Controlled opaque sRGB color; never evaluates arbitrary style strings. */
export function ColorField({ label, value, onValueChange, disabled = false, className }: ColorFieldProps) {
  const id = useId();
  if (!label.trim() || !/^#[0-9a-fA-F]{6}$/.test(value)) throw new Error("ColorField requires label and six-digit hex color");
  const commit = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.currentTarget.value;
    if (/^#[0-9a-fA-F]{6}$/.test(next)) onValueChange(next.toUpperCase());
  };
  return <div data-slot="color-field" className={cn("flex min-w-0 flex-wrap items-center gap-2", className)}>
    <label htmlFor={id} className="text-xs font-medium">{label}</label>
    <input id={id} aria-label={label + " picker"} type="color" value={value} disabled={disabled} onChange={commit}
      className="h-9 w-12 cursor-pointer rounded border border-input bg-background p-1 disabled:opacity-50" />
    <output aria-label={label + " hex"} className="rounded border border-input px-2 py-1 font-mono text-xs">{value.toUpperCase()}</output>
  </div>;
}

export type PropertyChoice = Readonly<{ id: string; label: string; disabled?: boolean }>;
export type PropertyPickerProps = Readonly<{
  label: string; value: string; choices: readonly PropertyChoice[]; onValueChange: (id: string) => void;
  disabled?: boolean; className?: string;
}>;
/** Closed-world property choices. Caller owns semantics and mutation authorization. */
export function PropertyPicker({ label, value, choices, onValueChange, disabled = false, className }: PropertyPickerProps) {
  const id = useId();
  if (!label.trim() || !choices.length || choices.some(c => !c.id.trim() || !c.label.trim()) ||
      new Set(choices.map(c => c.id)).size !== choices.length || !choices.some(c => c.id === value && !c.disabled))
    throw new Error("PropertyPicker requires enabled selection and unique labelled choices");
  return <div data-slot="property-picker" className={cn("grid min-w-0 gap-1", className)}>
    <label htmlFor={id} className="text-xs font-medium">{label}</label>
    <select id={id} aria-label={label} value={value} disabled={disabled}
      onChange={event => { const choice = choices.find(c => c.id === event.target.value && !c.disabled); if (choice) onValueChange(choice.id); }}
      className="h-9 min-w-0 rounded border border-input bg-background px-2 text-sm focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">
      {choices.map(choice => <option key={choice.id} value={choice.id} disabled={choice.disabled}>{choice.label}</option>)}
    </select>
  </div>;
}

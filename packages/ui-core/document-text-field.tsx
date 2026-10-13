"use client";
import { useId } from "react";
import { cn } from "./components.js";

export type DocumentTextFieldProps = Readonly<{
  label: string; value: string; onValueChange: (value: string) => void;
  maxLength?: number; rows?: number; disabled?: boolean; readOnly?: boolean; className?: string;
}>;
/** Plain document text only. Never parses markup, runs scripts or assumes canonical document storage. */
export function DocumentTextField({ label, value, onValueChange, maxLength = 2000, rows = 6, disabled = false, readOnly = false, className }: DocumentTextFieldProps) {
  const id = useId();
  if (!label.trim() || !Number.isSafeInteger(maxLength) || maxLength < 1 || maxLength > 100000 ||
      !Number.isSafeInteger(rows) || rows < 2 || rows > 30 || value.length > maxLength)
    throw new Error("DocumentTextField requires bounded plain text, valid rows and label");
  return <div data-slot="document-text-field" className={cn("grid min-w-0 gap-1", className)}>
    <label htmlFor={id} className="text-xs font-medium">{label}</label>
    <textarea id={id} aria-label={label} value={value} maxLength={maxLength} rows={rows} disabled={disabled} readOnly={readOnly}
      onChange={event => { if (event.currentTarget.value.length <= maxLength) onValueChange(event.currentTarget.value); }}
      className="w-full min-w-0 resize-y rounded border border-input bg-background p-2 font-mono text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50" />
    <output aria-label={label + " character count"} className="text-right text-xs text-muted-foreground">{value.length} / {maxLength}</output>
  </div>;
}

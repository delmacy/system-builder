"use client";

import { useId, useState, type FieldsetHTMLAttributes, type HTMLAttributes,
  type InputHTMLAttributes, type LabelHTMLAttributes, type ReactNode,
  type TextareaHTMLAttributes } from "react";
import { cn } from "./components.js";

const fieldClass = "w-full min-w-0 rounded-[var(--sb-radius-control)] border border-input bg-background px-[var(--sb-control-padding)] text-sm shadow-[var(--sb-elevation-control)] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";
const choiceClass = "size-4 shrink-0 accent-primary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} data-slot="label" className={cn("text-sm font-medium leading-none", className)} />;
}
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} data-slot="textarea" className={cn(fieldClass, "min-h-20 resize-y py-2", className)} />;
}
export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;
export function Checkbox({ className, ...props }: CheckboxProps) {
  return <input {...props} type="checkbox" data-slot="checkbox" className={cn(choiceClass, "rounded border-input", className)} />;
}
export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role">;
export function Switch({ className, ...props }: SwitchProps) {
  return <input {...props} type="checkbox" role="switch" data-slot="switch"
    className={cn("relative h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full border border-transparent bg-input transition-colors checked:bg-primary after:absolute after:left-0.5 after:top-0.5 after:size-3.5 after:rounded-full after:bg-background after:transition-transform checked:after:translate-x-4 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring", className)} />;
}
export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;
export function Slider({ className, ...props }: SliderProps) {
  return <input {...props} type="range" data-slot="slider" className={cn("h-[var(--sb-control-height)] w-full min-w-0 accent-primary disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring", className)} />;
}
export type NumberFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & Readonly<{
  onValueChange?: (value: number | undefined) => void;
}>;
export function NumberField({ className, onChange, onValueChange, ...props }: NumberFieldProps) {
  return <input {...props} type="number" data-slot="number-field" className={cn(fieldClass, "h-[var(--sb-control-height)]", className)}
    onChange={event => { onChange?.(event); if (!event.defaultPrevented) {
      const value = event.currentTarget.valueAsNumber;
      onValueChange?.(Number.isFinite(value) ? value : undefined);
    } }} />;
}

export type RadioOption = Readonly<{ value: string; label: ReactNode; disabled?: boolean }>;
export type RadioGroupProps = Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange" | "defaultValue" | "name"> & Readonly<{
  label: ReactNode; options: readonly RadioOption[]; name?: string;
  value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
}>;
/** Native radio relationships provide arrow/Space behavior; identity and state belong to SB. */
export function RadioGroup({ label, options, name, value, defaultValue, onValueChange, className, ...props }: RadioGroupProps) {
  const generatedName = useId();
  const [localValue, setLocalValue] = useState(defaultValue);
  const selected = value ?? localValue;
  const values = options.map(option => option.value);
  if (!values.length || values.some(item => typeof item !== "string" || !item.trim()) ||
    new Set(values).size !== values.length || (selected !== undefined && !values.includes(selected))) {
    throw new Error("RadioGroup requires unique nonempty options and a known selected value");
  }
  return <fieldset {...props} role="radiogroup" data-slot="radio-group" className={cn("min-w-0 space-y-2", className)}>
    <legend className="mb-2 text-sm font-medium">{label}</legend>
    {options.map(option => <Label key={option.value} className="flex items-center gap-2 font-normal">
      <input type="radio" data-slot="radio" name={name ?? generatedName} value={option.value}
        disabled={option.disabled} checked={selected === option.value} className={choiceClass}
        onChange={event => { if (event.currentTarget.checked) {
          if (value === undefined) setLocalValue(option.value);
          onValueChange?.(option.value);
        } }} />{option.label}
    </Label>)}
  </fieldset>;
}
export function FieldDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} data-slot="field-description" className={cn("text-sm text-muted-foreground", className)} />;
}
export function FieldMessage({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} role={props.role ?? "alert"} data-slot="field-message" className={cn("text-sm text-destructive", className)} />;
}

export type AlertProps = HTMLAttributes<HTMLDivElement> & Readonly<{ variant?: "info" | "success" | "warning" | "error" }>;
export function Alert({ variant = "info", className, ...props }: AlertProps) {
  return <div {...props} role={props.role ?? (variant === "error" ? "alert" : "status")} data-slot="alert" data-variant={variant}
    className={cn("rounded-[var(--sb-radius-control)] border bg-card p-3 text-sm text-card-foreground",
      variant === "error" ? "border-destructive" : variant === "warning" ? "border-[var(--sb-stale)]" :
      variant === "success" ? "border-[var(--sb-current)]" : "border-border", className)} />;
}
export type ProgressProps = Omit<HTMLAttributes<HTMLProgressElement>, "children"> & Readonly<{ value?: number; max?: number }>;
export function Progress({ value, max = 100, className, ...props }: ProgressProps) {
  if (!Number.isFinite(max) || max <= 0 || (value !== undefined && (!Number.isFinite(value) || value < 0 || value > max))) {
    throw new RangeError("Progress requires a positive finite max and a value between zero and max");
  }
  return <progress {...props} data-slot="progress" value={value} max={max}
    className={cn("h-2 w-full overflow-hidden rounded-full accent-primary", className)} />;
}
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} aria-hidden="true" data-slot="skeleton" className={cn("h-4 animate-pulse rounded-[var(--sb-radius-control)] bg-muted motion-reduce:animate-none", className)} />;
}
export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section {...props} data-slot="card" className={cn("rounded-[var(--sb-radius-panel)] border bg-card text-card-foreground shadow-[var(--sb-elevation-panel)]", className)} />;
}
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} data-slot="card-header" className={cn("space-y-1 p-4", className)} />;
}
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} data-slot="card-title" className={cn("text-base font-semibold", className)} />;
}
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} data-slot="card-description" className={cn("text-sm text-muted-foreground", className)} />;
}
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} data-slot="card-content" className={cn("p-4 pt-0", className)} />;
}
export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} data-slot="card-footer" className={cn("flex items-center gap-2 p-4 pt-0", className)} />;
}


export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & Readonly<{ label?: string }>;
/** Status indicator without ownership of the async operation. */
export function Spinner({ label = "Loading", className, ...props }: SpinnerProps) {
  return <span {...props} data-slot="spinner" role="status" aria-label={label}
    className={cn("inline-flex size-5 shrink-0 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-primary motion-reduce:animate-none", className)} />;
}

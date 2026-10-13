"use client";

import { type ChangeEvent, type InputHTMLAttributes } from "react";
import { cn } from "./components.js";

/** Native date/time entry retains browser locale and keyboard behavior. */
export type DateTimeFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & Readonly<{
  kind?: "date" | "time" | "datetime-local";
}>;
export function DateTimeField({ kind = "date", className, ...props }: DateTimeFieldProps) {
  return <input {...props} type={kind} data-slot="date-time-field"
    className={cn("h-[var(--sb-control-height)] w-full min-w-0 rounded-[var(--sb-radius-control)] border border-input bg-background px-[var(--sb-control-padding)] text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive", className)} />;
}

/** Explicit local file selection; upload/transport stays with the owning app. */
export type FileFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> & Readonly<{
  onFilesChange?: (files: readonly File[]) => void;
}>;
export function FileField({ onFilesChange, onChange, className, ...props }: FileFieldProps) {
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    if (!event.defaultPrevented) onFilesChange?.(Array.from(event.currentTarget.files ?? []));
  };
  return <input {...props} type="file" data-slot="file-field" onChange={change}
    className={cn("block w-full min-w-0 rounded-[var(--sb-radius-control)] border border-input bg-background text-sm file:mr-3 file:border-0 file:border-r file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring aria-invalid:border-destructive", className)} />;
}

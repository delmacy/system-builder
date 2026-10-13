"use client";

import { useState, type InputHTMLAttributes } from "react";
import { cn } from "./components.js";

export type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & Readonly<{
  showLabel?: string;
  hideLabel?: string;
}>;

/** Local visibility is presentation state; the entered secret remains owned by the caller. */
export function PasswordField({ showLabel = "Show password", hideLabel = "Hide password", className, disabled, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return <div data-slot="password-field" className={cn("flex min-w-0 items-center gap-1 rounded-[var(--sb-radius-control)] border border-input bg-background px-2 focus-within:outline focus-within:outline-2 focus-within:outline-ring", className)}>
    <input {...props} disabled={disabled} type={visible ? "text" : "password"}
      className="h-[var(--sb-control-height)] min-w-0 flex-1 bg-transparent px-1 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50" />
    <button type="button" disabled={disabled} aria-label={visible ? hideLabel : showLabel} aria-pressed={visible}
      className="shrink-0 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
      onClick={() => setVisible(current => !current)}>{visible ? "Hide" : "Show"}</button>
  </div>;
}

"use client";

import { type HTMLAttributes } from "react";
import { cn } from "./components.js";

export type StepperItem = Readonly<{ id: string; label: string; description?: string; disabled?: boolean }>;
export type StepperProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & Readonly<{
  steps: readonly StepperItem[];
  activeId: string;
  onActiveChange?: (id: string) => void;
}>;

/** Controlled process step navigation: never advances canonical workflow authority. */
export function Stepper({ steps, activeId, onActiveChange, className, ...props }: StepperProps) {
  if (steps.length === 0 || steps.some(step => !step.id.trim() || !step.label.trim()) ||
      new Set(steps.map(step => step.id)).size !== steps.length || !steps.some(step => step.id === activeId)) {
    throw new Error("Stepper requires unique nonempty steps and a known activeId");
  }
  const activeIndex = steps.findIndex(step => step.id === activeId);
  return <nav {...props} data-slot="stepper" aria-label={props["aria-label"] ?? "Steps"} className={cn("min-w-0", className)}>
    <ol className="flex min-w-0 flex-wrap gap-2">
      {steps.map((step, index) => <li key={step.id} className="min-w-0 flex-1 basis-32">
        <button type="button" disabled={step.disabled || !onActiveChange}
          aria-current={step.id === activeId ? "step" : undefined}
          onClick={() => onActiveChange?.(step.id)}
          className={cn("flex w-full min-w-0 items-center gap-2 rounded-[var(--sb-radius-control)] border px-3 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
            step.id === activeId ? "border-primary bg-accent" : "border-border hover:bg-muted")}>
          <span aria-hidden="true" className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-xs">{index + 1}</span>
          <span className="min-w-0"><span className="block truncate font-medium">{step.label}</span>
          {step.description ? <span className="block truncate text-xs text-muted-foreground">{step.description}</span> : null}</span>
        </button>
      </li>)}
    </ol>
    <span className="sr-only" aria-live="polite">Step {activeIndex + 1} of {steps.length}</span>
  </nav>;
}

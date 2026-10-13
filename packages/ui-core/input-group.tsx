"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "./components.js";

export type InputGroupProps = HTMLAttributes<HTMLDivElement> & Readonly<{
  leading?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
}>;

/** A presentation wrapper for existing semantic inputs, including icons and actions. */
export function InputGroup({ leading, trailing, children, className, ...props }: InputGroupProps) {
  return <div {...props} data-slot="input-group" className={cn(
    "flex min-w-0 items-center gap-2 rounded-[var(--sb-radius-control)] border border-input bg-background px-2 focus-within:outline focus-within:outline-2 focus-within:outline-ring",
    className
  )}>
    {leading ? <span data-slot="input-group-leading" className="flex shrink-0 items-center text-muted-foreground">{leading}</span> : null}
    <div data-slot="input-group-control" className="min-w-0 flex-1 [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:shadow-none [&_input]:outline-none [&_input]:focus-visible:outline-none">{children}</div>
    {trailing ? <span data-slot="input-group-trailing" className="flex shrink-0 items-center">{trailing}</span> : null}
  </div>;
}

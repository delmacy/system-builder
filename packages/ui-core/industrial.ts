import { createElement, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "./components.js";

/** Workstation toolbar. Commands remain owned by the caller, never this presentation layer. */
export type ToolbarProps = HTMLAttributes<HTMLDivElement> & Readonly<{ label: string; orientation?: "horizontal" | "vertical" }>;
export function Toolbar({ label, orientation = "horizontal", className, ...props }: ToolbarProps) {
  if (!label.trim()) throw new Error("Toolbar requires a nonempty accessible label");
  return createElement("div", {
    ...props, role: "toolbar", "aria-label": label, "aria-orientation": orientation,
    "data-slot": "toolbar", "data-orientation": orientation,
    className: cn("inline-flex max-w-full items-center gap-1 rounded-[var(--sb-radius-control)] border border-border bg-card p-1 text-card-foreground", orientation === "vertical" && "flex-col items-stretch", className),
  });
}

export type ToolbarGroupProps = HTMLAttributes<HTMLDivElement> & Readonly<{ label: string }>;
export function ToolbarGroup({ label, className, ...props }: ToolbarGroupProps) {
  if (!label.trim()) throw new Error("ToolbarGroup requires a nonempty accessible label");
  return createElement("div", {
    ...props, role: "group", "aria-label": label, "data-slot": "toolbar-group",
    className: cn("inline-flex items-center gap-0.5", className),
  });
}

export type ToolbarButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> & Readonly<{
  label: string;
  icon?: ReactNode;
  pressed?: boolean;
  children?: ReactNode;
}>;
export function ToolbarButton({ label, icon, pressed, children, className, type = "button", ...props }: ToolbarButtonProps) {
  if (!label.trim()) throw new Error("ToolbarButton requires a nonempty accessible label");
  return createElement("button", {
    ...props, type, "aria-label": label,
    ...(pressed === undefined ? {} : { "aria-pressed": pressed }),
    "data-slot": "toolbar-button", "data-state": pressed === undefined ? "action" : pressed ? "on" : "off",
    className: cn("inline-flex h-[var(--sb-control-height-sm)] min-w-[var(--sb-control-height-sm)] items-center justify-center gap-1 rounded-[var(--sb-radius-control)] px-2 text-xs hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-[var(--sb-selection)] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
  }, icon, children);
}

export function ToolbarSeparator({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return createElement("span", { ...props, role: "separator", "aria-orientation": "vertical", "data-slot": "toolbar-separator", className: cn("mx-1 h-5 w-px shrink-0 bg-border", className) });
}

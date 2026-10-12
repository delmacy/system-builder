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

/** Desktop pane heading with optional toolbar actions. */
export type PaneHeaderProps = HTMLAttributes<HTMLElement> & Readonly<{
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}>;
export function PaneHeader({ title, subtitle, actions, className, ...props }: PaneHeaderProps) {
  return createElement("header", { ...props, "data-slot": "pane-header", className: cn("flex min-w-0 items-center justify-between gap-3 border-b border-border px-3 py-2", className) },
    createElement("div", { className: "min-w-0" },
      createElement("div", { "data-slot": "pane-title", className: "truncate text-sm font-semibold" }, title),
      subtitle == null ? null : createElement("div", { "data-slot": "pane-subtitle", className: "truncate text-xs text-muted-foreground" }, subtitle)),
    actions == null ? null : createElement("div", { "data-slot": "pane-actions", className: "flex shrink-0 items-center gap-1" }, actions));
}

/** Presentation-only status surface; caller supplies truthful, accessible status text. */
export type StatusBarProps = HTMLAttributes<HTMLElement> & Readonly<{ label: string; trailing?: ReactNode }>;
export function StatusBar({ label, trailing, children, className, ...props }: StatusBarProps) {
  if (!label.trim()) throw new Error("StatusBar requires a nonempty accessible label");
  return createElement("footer", { ...props, role: "status", "aria-label": label, "data-slot": "status-bar", className: cn("flex min-w-0 items-center justify-between gap-2 border-t border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground", className) },
    createElement("div", { className: "min-w-0 truncate" }, children),
    trailing == null ? null : createElement("div", { className: "shrink-0" }, trailing));
}

/** Inspector grouping without assuming any editor schema or persistence authority. */
export type PropertySectionProps = HTMLAttributes<HTMLElement> & Readonly<{ title: string; description?: ReactNode }>;
export function PropertySection({ title, description, children, className, ...props }: PropertySectionProps) {
  if (!title.trim()) throw new Error("PropertySection requires a nonempty title");
  return createElement("section", { ...props, "aria-label": title, "data-slot": "property-section", className: cn("grid min-w-0 gap-2 border-b border-border px-3 py-3", className) },
    createElement("h3", { className: "text-xs font-semibold" }, title),
    description == null ? null : createElement("p", { className: "text-xs text-muted-foreground" }, description),
    children);
}

export type PropertyFieldProps = HTMLAttributes<HTMLDivElement> & Readonly<{ label: string; hint?: ReactNode; control: ReactNode }>;
export function PropertyField({ label, hint, control, className, ...props }: PropertyFieldProps) {
  if (!label.trim()) throw new Error("PropertyField requires a nonempty label");
  return createElement("div", { ...props, role: "group", "aria-label": label, "data-slot": "property-field", className: cn("grid min-w-0 grid-cols-[minmax(5rem,1fr)_minmax(0,2fr)] items-center gap-2 text-xs", className) },
    createElement("div", { className: "min-w-0" }, createElement("span", {}, label),
      hint == null ? null : createElement("div", { className: "text-muted-foreground" }, hint)),
    createElement("div", { className: "min-w-0" }, control));
}

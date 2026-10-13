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
    ...props, type, "aria-label": label, title: props.title ?? (children == null ? label : undefined),
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

/** A controlled group of mutually exclusive toolbar modes. */
export type ToolbarToggleGroupProps = HTMLAttributes<HTMLDivElement> & Readonly<{
  label: string;
  value: string;
  options: readonly Readonly<{ value: string; label: string; icon?: ReactNode; disabled?: boolean }>[];
  onValueChange?: (value: string) => void;
}>;
export function ToolbarToggleGroup({ label, value, options, onValueChange, className, ...props }: ToolbarToggleGroupProps) {
  if (!label.trim()) throw new Error("ToolbarToggleGroup requires a nonempty accessible label");
  if (options.length === 0 || options.some(option => !option.value.trim() || !option.label.trim()) ||
      new Set(options.map(option => option.value)).size !== options.length) throw new Error("ToolbarToggleGroup requires unique nonempty options");
  if (!options.some(option => option.value === value)) throw new Error("ToolbarToggleGroup requires known selected value");
  return createElement("div", { ...props, role: "group", "aria-label": label, "data-slot": "toolbar-toggle-group", className: cn("inline-flex items-center gap-0.5", className) },
    options.map(option => createElement(ToolbarButton, {
      key: option.value, label: option.label, icon: option.icon, disabled: option.disabled,
      pressed: value === option.value,
      onClick: () => { if (!option.disabled && option.value !== value) onValueChange?.(option.value); },
    })));
}

/** Native search control; caller owns query state, filtering and submission. */
export type SearchFieldProps = Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "type"> & Readonly<{ label: string }>;
export function SearchField({ label, className, ...props }: SearchFieldProps) {
  if (!label.trim()) throw new Error("SearchField requires a nonempty accessible label");
  return createElement("input", { ...props, type: "search", "aria-label": label, "data-slot": "search-field",
    className: cn("h-[var(--sb-control-height)] min-w-0 rounded-[var(--sb-radius-control)] border border-input bg-background px-[var(--sb-control-padding)] text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", className) });
}

/** Native select control with an owned visible label and explicit option identity. */
export type SelectFieldProps = Omit<import("react").SelectHTMLAttributes<HTMLSelectElement>, "children"> & Readonly<{
  label: string;
  options: readonly Readonly<{ value: string; label: string; disabled?: boolean }>[];
}>;
export function SelectField({ label, options, className, ...props }: SelectFieldProps) {
  if (!label.trim()) throw new Error("SelectField requires a nonempty accessible label");
  if (!options.length || options.some(option => !option.value.trim() || !option.label.trim()) ||
      new Set(options.map(option => option.value)).size !== options.length) throw new Error("SelectField requires unique nonempty options");
  return createElement("label", { "data-slot": "select-field", className: "inline-grid min-w-0 gap-1 text-xs" },
    createElement("span", {}, label),
    createElement("select", { ...props, "aria-label": label, className: cn("h-[var(--sb-control-height)] rounded-[var(--sb-radius-control)] border border-input bg-background px-2 text-sm disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring", className) },
      options.map(option => createElement("option", { key: option.value, value: option.value, disabled: option.disabled }, option.label))));
}

/** Split action composition: primary command plus caller-owned accessible menu trigger.
 * Pass a DropdownMenuTrigger/Content from overlays; never clone menu focus behavior here.
 */
export type SplitButtonProps = HTMLAttributes<HTMLDivElement> & Readonly<{
  label: string;
  primaryLabel: string;
  onPrimaryAction: () => void;
  menuTrigger: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}>;
export function SplitButton({ label, primaryLabel, onPrimaryAction, menuTrigger, disabled = false, icon, className, ...props }: SplitButtonProps) {
  if (!label.trim() || !primaryLabel.trim()) throw new Error("SplitButton requires nonempty accessible labels");
  return createElement("div", { ...props, role: "group", "aria-label": label, "data-slot": "split-button", className: cn("inline-flex items-stretch overflow-hidden rounded-[var(--sb-radius-control)] border border-border", className) },
    createElement("button", { type: "button", "aria-label": primaryLabel, "data-slot": "split-button-primary", disabled, onClick: onPrimaryAction,
      className: "inline-flex h-[var(--sb-control-height)] items-center gap-1 px-2 text-sm hover:bg-accent disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" }, icon, primaryLabel),
    createElement("span", { "data-slot": "split-button-menu", className: "inline-flex items-stretch border-l border-border" }, menuTrigger));
}

/** Controlled workstation tab strip. Panels use the existing accessible Tabs provider separately. */
export type TabStripProps = HTMLAttributes<HTMLDivElement> & Readonly<{
  label: string;
  activeId: string;
  tabs: readonly Readonly<{ id: string; label: string; disabled?: boolean; closable?: boolean }>[];
  onActiveChange: (id: string) => void;
  onClose?: (id: string) => void;
}>;
export function TabStrip({ label, activeId, tabs, onActiveChange, onClose, className, ...props }: TabStripProps) {
  if (!label.trim() || tabs.length === 0 || tabs.some(tab => !tab.id.trim() || !tab.label.trim()) ||
      new Set(tabs.map(tab => tab.id)).size !== tabs.length) throw new Error("TabStrip requires unique nonempty tabs and label");
  if (!tabs.some(tab => tab.id === activeId && !tab.disabled)) throw new Error("TabStrip requires enabled active tab");
  return createElement("div", { ...props, "data-slot": "tab-strip", "aria-label": label, role: "group",
    className: cn("flex min-w-0 items-stretch gap-1 overflow-x-auto border-b border-border", className) },
    tabs.map(tab => createElement("div", { key: tab.id, "data-slot": "tab-strip-item", "data-active": tab.id === activeId,
      className: "inline-flex shrink-0 items-stretch rounded-t-[var(--sb-radius-control)] border border-b-0 border-border data-[active=true]:bg-accent" },
      createElement("button", { type: "button", disabled: tab.disabled, "aria-current": tab.id === activeId ? "page" : undefined,
        "aria-label": tab.label, onClick: () => { if (!tab.disabled) onActiveChange(tab.id); },
        className: "px-3 py-1.5 text-xs focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" }, tab.label),
      tab.closable && onClose ? createElement("button", { type: "button", disabled: tab.disabled,
        "aria-label": `Close ${tab.label}`, onClick: () => onClose(tab.id),
        className: "px-1.5 text-xs hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring" }, "×") : null)));
}

import {
  createElement,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

export type ClassValue = string | false | null | undefined;

export function cn(...values: readonly ClassValue[]): string {
  return values.filter((value): value is string => typeof value === "string" && value.length > 0).join(" ");
}

export type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

const buttonVariantClass: Readonly<Record<ButtonVariant, string>> = Object.freeze({
  default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
});

const buttonSizeClass: Readonly<Record<ButtonSize, string>> = Object.freeze({
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-6",
  icon: "size-9 shrink-0",
});

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Readonly<{
  variant?: ButtonVariant;
  size?: ButtonSize;
}>;

export function Button({ className, variant = "default", size = "default", type = "button", ...props }: ButtonProps) {
  return createElement("button", { ...props, type, "data-slot": "button", className: cn("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", buttonVariantClass[variant], buttonSizeClass[size], className) });
}

export type IconButtonProps = Omit<ButtonProps, "size" | "children"> & Readonly<{ label: string; children: ReactNode }>;
export function IconButton({ label, children, ...props }: IconButtonProps) {
  return createElement(Button, { ...props, size: "icon", "aria-label": label }, children);
}

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & Readonly<{ children: ReactNode }>;
export function ButtonGroup({ className, children, ...props }: ButtonGroupProps) {
  return createElement("div", { ...props, role: props.role ?? "group", "data-slot": "button-group", className: cn("inline-flex items-center gap-1", className) }, children);
}

export function Input({ className, type = "text", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return createElement("input", { ...props, type, "data-slot": "input", className: cn("flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40", className) });
}
export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return createElement("select", { ...props, "data-slot": "select", className: cn("flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40", className) }, children);
}
export type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> & Readonly<{ pressed?: boolean; onPressedChange?: (pressed: boolean) => void }>;
export function Toggle({ className, pressed = false, onPressedChange, onClick, type = "button", ...props }: ToggleProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => { onClick?.(event); if (!event.defaultPrevented) onPressedChange?.(!pressed); };
  return createElement("button", { ...props, type, "data-slot": "toggle", "data-state": pressed ? "on" : "off", "aria-pressed": pressed, onClick: handleClick, className: cn("inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring/40", className) });
}
export type SeparatorProps = HTMLAttributes<HTMLDivElement> & Readonly<{ orientation?: "horizontal" | "vertical" }>;
export function Separator({ className, orientation = "horizontal", ...props }: SeparatorProps) { return createElement("div", { ...props, role: "separator", "aria-orientation": orientation, "data-slot": "separator", className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className) }); }
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) { return createElement("span", { ...props, "data-slot": "badge", className: cn("inline-flex items-center rounded-md border border-transparent bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground", className) }); }
export function Panel({ className, ...props }: HTMLAttributes<HTMLElement>) { return createElement("section", { ...props, "data-slot": "panel", className: cn("rounded-xl border bg-card text-card-foreground shadow-sm", className) }); }
export function ScrollArea({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return createElement("div", { ...props, "data-slot": "scroll-area", className: cn("overflow-auto overscroll-contain", className) }); }
export type TooltipProps = HTMLAttributes<HTMLSpanElement> & Readonly<{ content: ReactNode }>;
export function Tooltip({ className, content, children, ...props }: TooltipProps) { return createElement("span", { ...props, "data-slot": "tooltip", className: cn("group relative inline-flex", className) }, children, createElement("span", { role: "tooltip", "data-slot": "tooltip-content", className: "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md group-hover:block group-focus-within:block" }, content)); }
export function MenuSurface({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return createElement("div", { ...props, role: props.role ?? "menu", "data-slot": "menu-surface", className: cn("min-w-40 rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className) }); }

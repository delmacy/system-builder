import { createElement } from "react";
import { StationIcon, type IconToken } from "@system-builder/ui-icons";
import { Button, type ButtonProps } from "./components.js";
import { AccessibleTooltipProvider, AccessibleTooltip, AccessibleTooltipTrigger, AccessibleTooltipContent } from "./overlays.js";

export type PresentationButtonProps = Omit<ButtonProps, "children" | "aria-label" | "aria-labelledby" | "aria-expanded"> &
  Readonly<{ label: string; expanded?: boolean; iconPlacement?: "start" | "end" }> & (
    | Readonly<{ mode?: "text"; icon?: IconToken }>
    | Readonly<{ mode: "icon" | "icon-text"; icon: IconToken }>
  );
/** Caller owns commands and expansion; display mode never changes authority. */
export function PresentationButton({ label, mode = "text", icon, expanded, iconPlacement = "start", ...buttonProps }: PresentationButtonProps) {
  if (typeof label !== "string" || !label.trim()) throw new Error("PresentationButton requires an accessible label");
  if (!["text", "icon", "icon-text"].includes(mode)) throw new Error("Unsupported button display mode");
  if (mode !== "text" && !icon) throw new Error("Icon presentation requires a semantic icon");
  if (expanded !== undefined && typeof expanded !== "boolean") throw new Error("Expanded must be a controlled boolean");
  if (!["start", "end"].includes(iconPlacement)) throw new Error("Unsupported icon placement");
  const compact = mode === "icon" && expanded !== true;
  const props: ButtonProps & { "data-display-mode": string; "data-label-visible": string } = {
    ...buttonProps, "aria-label": label, ...(expanded === undefined ? {} : { "aria-expanded": expanded }),
    size: compact ? "icon" : buttonProps.size ?? "default",
    "data-display-mode": mode, "data-label-visible": String(!compact),
  };
  const glyph = mode === "text" ? null : createElement(StationIcon, { token: icon! });
  const text = compact ? null : createElement("span", { className: "min-w-0 truncate" }, label);
  const button = createElement(Button, props,
    iconPlacement === "start" ? glyph : text,
    iconPlacement === "start" ? text : glyph);
  if (mode !== "icon") return button;
  return createElement(AccessibleTooltipProvider, { delay: 150 },
    createElement(AccessibleTooltip, { disabled: !compact },
      createElement(AccessibleTooltipTrigger, { render: button, className: "" }),
      createElement(AccessibleTooltipContent, { "aria-label": label, className: "max-w-xs rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md" }, label)));
}

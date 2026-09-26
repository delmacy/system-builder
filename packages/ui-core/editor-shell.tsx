import { createElement, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "./components.js";

export type EditorShellProps = HTMLAttributes<HTMLElement> &
  Readonly<{
    toolbar?: ReactNode;
    palette?: ReactNode;
    workArea?: ReactNode;
    layers?: ReactNode;
    inspector?: ReactNode;
    status?: ReactNode;
  }>;

function region(name: string, label: string, content: ReactNode, className?: string) {
  return createElement(
    "section",
    {
      "data-editor-region": name,
      "aria-label": label,
      className: cn("min-h-0 min-w-0", className),
    },
    content,
  );
}

/**
 * Domain-neutral editor chrome. EditorShell owns layout only: callers retain
 * graph, selection, command, persistence and business authority.
 */
export function EditorShell({
  toolbar,
  palette,
  workArea,
  layers,
  inspector,
  status,
  className,
  ...props
}: EditorShellProps) {
  return createElement(
    "main",
    {
      ...props,
      "data-slot": "editor-shell",
      className: cn(
        "grid min-h-0 min-w-0 grid-cols-[minmax(12rem,1fr)_minmax(0,4fr)_minmax(14rem,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden",
        className,
      ),
    },
    region("toolbar", "Editor toolbar", toolbar, "col-span-3 border-b"),
    createElement(
      "aside",
      { "data-editor-region": "navigation", "aria-label": "Editor navigation", className: "flex min-h-0 min-w-0 flex-col border-r" },
      region("palette", "Component palette", palette, "min-h-0 flex-1 overflow-auto"),
      region("layers", "Layers", layers, "min-h-0 flex-1 overflow-auto border-t"),
    ),
    region("work-area", "Editor work area", workArea, "overflow-auto"),
    region("inspector", "Property inspector", inspector, "overflow-auto border-l"),
    region("status", "Editor status", status, "col-span-3 border-t"),
  );
}

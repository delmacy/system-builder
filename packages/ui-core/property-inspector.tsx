import { createElement, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "./components.js";

export type PropertyRowDefinition = Readonly<{
  id: string;
  label: ReactNode;
  value: ReactNode;
  readOnly?: boolean;
  known?: boolean;
}>;

export type PropertyGroupDefinition = Readonly<{
  id: string;
  label: ReactNode;
  rows: readonly PropertyRowDefinition[];
}>;

export type PropertyRowProps = HTMLAttributes<HTMLDivElement> &
  Readonly<{
    definition: PropertyRowDefinition;
  }>;

export function PropertyRow({ definition, className, ...props }: PropertyRowProps) {
  const known = definition.known !== false;
  const readOnly = definition.readOnly !== false || !known;

  return createElement(
    "div",
    {
      ...props,
      "data-slot": "property-row",
      "data-property-id": definition.id,
      "data-read-only": readOnly ? "true" : "false",
      "data-known": known ? "true" : "false",
      className: cn("grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-3 border-t border-border/60 px-3 py-2 text-sm", className),
    },
    createElement("div", { className: "truncate text-muted-foreground" }, definition.label),
    createElement(
      "div",
      { className: cn("min-w-0 text-foreground", readOnly && "opacity-80") },
      known ? definition.value : createElement("span", { className: "text-muted-foreground", "aria-label": "Unknown property" }, "—"),
    ),
  );
}

export type PropertyGroupProps = HTMLAttributes<HTMLElement> &
  Readonly<{
    definition: PropertyGroupDefinition;
  }>;

export function PropertyGroup({ definition, className, ...props }: PropertyGroupProps) {
  return createElement(
    "section",
    { ...props, "data-slot": "property-group", "data-property-group-id": definition.id, className: cn("overflow-hidden rounded-lg border bg-card text-card-foreground", className) },
    createElement("h3", { className: "px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground" }, definition.label),
    definition.rows.map((row) => createElement(PropertyRow, { key: row.id, definition: row })),
  );
}

export type PropertyInspectorProps = HTMLAttributes<HTMLElement> &
  Readonly<{
    groups: readonly PropertyGroupDefinition[];
    empty?: ReactNode;
  }>;

export function PropertyInspector({ groups, empty = "No properties", className, ...props }: PropertyInspectorProps) {
  return createElement(
    "aside",
    { ...props, "data-slot": "property-inspector", className: cn("flex min-w-0 flex-col gap-3", className) },
    groups.length > 0
      ? groups.map((group) => createElement(PropertyGroup, { key: group.id, definition: group }))
      : createElement("div", { "data-slot": "property-inspector-empty", className: "rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground" }, empty),
  );
}

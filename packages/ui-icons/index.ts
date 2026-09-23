import {
  createElement,
  type SVGAttributes,
} from "react";

import {
  LUCIDE_ICON_DEFINITIONS,
  type LucideIconDefinition,
} from "./lucide-adapter.js";

export const ICON_TOKENS = Object.freeze([
  "shell.home",
  "shell.search",
  "shell.command",
  "settings",
  "window.close",
  "window.minimize",
  "window.maximize",
  "status.warning",
  "status.success",
  "navigation.expand",
] as const);

export type IconToken = (typeof ICON_TOKENS)[number];

const ICON_TOKEN_SET: ReadonlySet<string> = new Set(ICON_TOKENS);

export function isIconToken(value: string): value is IconToken {
  return ICON_TOKEN_SET.has(value);
}

export function resolveIcon(token: string): LucideIconDefinition {
  if (!isIconToken(token)) {
    throw new Error(`unknown Station icon token: ${token}`);
  }

  const definition = LUCIDE_ICON_DEFINITIONS[token];
  if (definition === undefined) {
    throw new Error(`Station icon token has no provider mapping: ${token}`);
  }

  return definition;
}

export type StationIconProps = Omit<SVGAttributes<SVGSVGElement>, "children"> & Readonly<{
  token: IconToken;
  label?: string;
  size?: number;
}>;

export function StationIcon({
  token,
  label,
  size = 16,
  className,
  ...props
}: StationIconProps) {
  const definition = resolveIcon(token);
  const accessibility =
    label === undefined
      ? { "aria-hidden": true as const }
      : { "aria-label": label, role: "img" as const };

  return createElement(
    "svg",
    {
      ...props,
      ...accessibility,
      "data-slot": "icon",
      "data-icon-token": token,
      "data-icon-provider": "lucide",
      className,
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      focusable: "false",
    },
    definition.shapes.map(([tag, attributes], index) =>
      createElement(tag, { key: `${definition.name}:${index}`, ...attributes }),
    ),
  );
}

export type { LucideIconDefinition } from "./lucide-adapter.js";

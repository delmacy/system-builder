import {
  createElement,
  type SVGAttributes,
} from "react";

import { SEMANTIC_ICON_DEFINITIONS, SEMANTIC_ICON_TOKENS, type SemanticIconToken } from "./semantic-catalog.js";

import {
  LUCIDE_ICON_DEFINITIONS,
  type LucideIconDefinition,
} from "./lucide-adapter.js";

export const LEGACY_ICON_TOKENS = Object.freeze([
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
  "workspace.folder",
  "workspace.folder-open",
  "workspace.new-folder",
  "artifact.composition",
  "artifact.document",
  "view.grid",
  "view.list",
  "action.refresh",
  "navigation.parent",
  "action.import",
  "action.export",
  "studio.process-context",
  "studio.workflow",
  "studio.catalog",
  "studio.analysis",
  "studio.assembly",
  "studio.release",
  "studio.observe",
] as const);

export type LegacyIconToken = (typeof LEGACY_ICON_TOKENS)[number];
export type IconToken = LegacyIconToken | SemanticIconToken;
export const ICON_TOKENS = Object.freeze([...new Set<IconToken>([...LEGACY_ICON_TOKENS, ...SEMANTIC_ICON_TOKENS])]);
export { SEMANTIC_ICON_CATALOG, SEMANTIC_ICON_TOKENS } from "./semantic-catalog.js";
/** Defer the full asset metadata and geometry modules until the library is used. */
export async function getIconLibrary() { return import("./catalog-runtime.js"); }

/** Shared visual identifiers only; they do not install or authorize a Studio. */
export const SUITE_STUDIO_ICONS = Object.freeze({
  "mirror": "shell.search",
  "recipe": "artifact.document",
  "analysis": "studio.analysis",
  "design": "view.grid",
  "catalog": "studio.catalog",
  "assembly": "studio.assembly",
  "validation": "status.success",
  "compiler": "artifact.composition",
  "release": "studio.release",
  "deploy": "action.import",
  "observe": "studio.observe",
  "support": "settings"
}) satisfies Readonly<Record<string, IconToken>>;
export type SuiteStudioId = keyof typeof SUITE_STUDIO_ICONS;

const ICON_TOKEN_SET: ReadonlySet<string> = new Set(ICON_TOKENS);

export function isIconToken(value: string): value is IconToken {
  return ICON_TOKEN_SET.has(value);
}

export function resolveIcon(token: string): LucideIconDefinition {
  if (!isIconToken(token)) {
    throw new Error(`unknown Station icon token: ${token}`);
  }

  const definition = Object.hasOwn(LUCIDE_ICON_DEFINITIONS, token)
    ? LUCIDE_ICON_DEFINITIONS[token as LegacyIconToken]
    : SEMANTIC_ICON_DEFINITIONS[token as SemanticIconToken];
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

export function StationGlyph({
  definition,
  token,
  label,
  size = 16,
  className,
  ...props
}: Omit<StationIconProps, "token"> & { readonly definition: LucideIconDefinition; readonly token?: string }) {
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
      "data-icon-provider": definition.provider ?? "lucide",
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

/** Semantic toolbar roles and legacy tokens share one renderer. */
export function StationIcon({ token, ...props }: StationIconProps) { return StationGlyph({ ...props, token, definition: resolveIcon(token) }); }


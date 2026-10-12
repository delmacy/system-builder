import { getIconLibrary, StationGlyph, type LucideIconDefinition } from "@system-builder/ui-icons";
import { createElement, useEffect, useState } from "react";
import { Button, type ButtonProps } from "../../../../packages/ui-core/index.js";
import { validButtonProperties, type ButtonProperties } from "../../../../packages/station-composition/index.js";

/** An inert visual snapshot inside the existing named preview image. */
export function EditorButtonPreview({ label, properties }: Readonly<{ label: string; properties?: ButtonProperties | undefined }>) {
  if (properties !== undefined && !validButtonProperties(properties)) throw new Error("Invalid admitted button preview properties");
  const presentation = properties?.presentation;
  const assetRef = presentation?.icon.assetRef;
  const catalogVersion = presentation?.icon.catalogVersion;
  const mode = presentation?.mode ?? "text";
  const key = JSON.stringify([assetRef, catalogVersion]);
  const [loaded, setLoaded] = useState<{ key: string; status: string; definition?: LucideIconDefinition } | null>(null);
  useEffect(() => {
    if (mode === "text" || !assetRef || !catalogVersion) return;
    let current = true;
    getIconLibrary().then(library => library.loadIconAsset({ assetRef, catalogVersion })).then(result => {
      if (current) setLoaded({ key, status: result.status, ...(result.status === "ready" ? { definition: result.definition } : {}) });
    }).catch(() => { if (current) setLoaded({ key, status: "unavailable" }); });
    return () => { current = false; };
  }, [assetRef, catalogVersion, mode, key]);
  const result = loaded?.key === key ? loaded : null;
  const ready = mode !== "text" && result?.status === "ready" && result.definition;
  const compact = mode === "icon" && !!ready;
  const props: ButtonProps & { "data-preview-variant": ButtonProperties["variant"] } = {
    size: compact ? "icon" : "default",
    variant: properties?.variant ?? "default", disabled: properties?.disabled ?? false,
    type: "button", title: label, tabIndex: -1, "aria-hidden": true,
    "data-preview-variant": properties?.variant ?? "default",
    className: "pointer-events-none min-w-0 max-w-full",
  };
  const glyph = ready ? createElement(StationGlyph, { definition: ready, ...(assetRef ? { token: assetRef } : {}) }) : null;
  const text = compact ? null : createElement("span", { className: "min-w-0 truncate", title: label }, label);
  const displayProps = { ...props, "data-display-mode": mode, "data-label-visible": String(!compact),
    "data-icon-status": mode === "text" ? "not-requested" : result?.status ?? "loading" };
  return createElement(Button, displayProps,
    presentation?.placement === "end" ? text : glyph,
    presentation?.placement === "end" ? glyph : text,
    mode !== "text" && result && result.status !== "ready" ? createElement("span", { className: "text-xs" }, "Icon unavailable") : null);

}

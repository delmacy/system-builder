import { createElement } from "react";
import { Input, Label } from "@system-builder/ui-core";
import { validInputProperties, type ComponentProperties } from "../../../../packages/station-composition/index.js";
/** Source-owned inert presentation; composition carries no domain input value. */
export function EditorInputPreview({ label, properties }: Readonly<{ label: string; properties?: ComponentProperties | undefined }>) {
  if (properties !== undefined && !validInputProperties(properties)) throw new Error("Invalid admitted Input preview properties");
  return createElement("div", { className: "pointer-events-none w-full min-w-0 space-y-1 text-left", "data-slot": "input-preview" },
    createElement(Label, { className: "block max-w-full truncate", title: label }, label),
    createElement(Input, { type: properties?.inputType ?? "text", placeholder: properties?.placeholder ?? "",
      disabled: properties?.disabled ?? false, readOnly: properties?.readOnly ?? false, tabIndex: -1, "aria-hidden": true,
      className: "pointer-events-none", title: label }));
}

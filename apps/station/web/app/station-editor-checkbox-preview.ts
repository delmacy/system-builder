import { createElement } from "react";
import { Checkbox, Label } from "@system-builder/ui-core";
import { validCheckboxProperties, type ComponentProperties } from "../../../../packages/station-composition/index.js";
/** Inert initial appearance; never application checked-state or approval authority. */
export function EditorCheckboxPreview({ label, properties }: Readonly<{ label: string; properties?: ComponentProperties | undefined }>) {
  if (properties !== undefined && !validCheckboxProperties(properties)) throw new Error("Invalid admitted Checkbox preview properties");
  return createElement(Label, { className: "pointer-events-none flex w-full min-w-0 items-center gap-2", title: label },
    createElement(Checkbox, { checked: properties?.defaultChecked ?? false, disabled: properties?.disabled ?? false, readOnly: true, tabIndex: -1, "aria-hidden": true }),
    createElement("span", { className: "min-w-0 truncate", title: label }, label));
}

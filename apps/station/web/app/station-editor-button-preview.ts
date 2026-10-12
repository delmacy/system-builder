import { createElement } from "react";
import { Button, type ButtonProps } from "../../../../packages/ui-core/index.js";
import { validButtonProperties, type ButtonProperties } from "../../../../packages/station-composition/index.js";

/** An inert visual snapshot inside the existing named preview image. */
export function EditorButtonPreview({ label, properties }: Readonly<{ label: string; properties?: ButtonProperties | undefined }>) {
  if (properties !== undefined && !validButtonProperties(properties)) throw new Error("Invalid admitted button preview properties");
  const props: ButtonProps & { "data-preview-variant": ButtonProperties["variant"] } = {
    variant: properties?.variant ?? "default", disabled: properties?.disabled ?? false,
    type: "button", title: label, tabIndex: -1, "aria-hidden": true,
    "data-preview-variant": properties?.variant ?? "default",
    className: "pointer-events-none min-w-0 max-w-full",
  };
  return createElement(Button, props, createElement("span", { className: "min-w-0 truncate", title: label }, label));
}

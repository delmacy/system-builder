import { createElement, type CSSProperties, type ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../packages/ui-core/index.js";
import type { EditorPreviewNode } from "../../../../packages/station-editor/index.js";

export function EditorCardPreview({ node, label, style, children }: Readonly<{
  node: Extract<EditorPreviewNode, { kind: "node" }>; label: string;
  style?: CSSProperties | undefined; children?: ReactNode;
}>) {
  if (node.componentRef !== "component:card") throw new Error("Card preview requires an admitted Card descriptor");
  const props = {
    role: "group", "aria-label": label + " preview", style,
    "data-node-ref": node.nodeRef, "data-parent-ref": node.parentRef, "data-slot-ref": node.slotRef,
    "data-column-span": node.columnSpan, "data-row-span": node.rowSpan,
    "data-selected": node.selected ? "true" : "false",
    className: "min-w-0 overflow-auto" + (node.selected ? " ring-2 ring-primary/30" : ""),
  };
  return createElement(Card, props,
    createElement(CardHeader, null, createElement(CardTitle, null, label)),
    createElement(CardContent, { className: "flex min-w-0 flex-col gap-2" }, children));
}

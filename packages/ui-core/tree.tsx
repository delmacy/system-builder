import { createElement, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "./components.js";
import type { CollectionIndex, CollectionItemRef, SelectionState } from "@system-builder/station-interaction";
import { selectKnownRef } from "@system-builder/station-interaction";

export interface TreeNode {
  readonly ref: CollectionItemRef;
  readonly label: ReactNode;
  readonly children?: readonly TreeNode[];
}

export interface TreeProps {
  readonly nodes: readonly TreeNode[];
  readonly collection: CollectionIndex;
  readonly selection: SelectionState;
  readonly expandedRefs?: ReadonlySet<CollectionItemRef>;
  readonly onSelectionChange?: (state: SelectionState) => void;
  readonly onExpandedChange?: (expanded: ReadonlySet<CollectionItemRef>) => void;
  readonly className?: string;
  readonly ariaLabel?: string;
}

type VisibleNode = Readonly<{ node: TreeNode; depth: number }>;

function flattenVisible(nodes: readonly TreeNode[], expanded: ReadonlySet<CollectionItemRef>, depth = 1): VisibleNode[] {
  const visible: VisibleNode[] = [];
  for (const node of nodes) {
    visible.push({ node, depth });
    if (node.children?.length && expanded.has(node.ref)) visible.push(...flattenVisible(node.children, expanded, depth + 1));
  }
  return visible;
}

function toggleExpanded(expanded: ReadonlySet<CollectionItemRef>, ref: CollectionItemRef): ReadonlySet<CollectionItemRef> {
  const next = new Set(expanded);
  if (next.has(ref)) next.delete(ref); else next.add(ref);
  return next;
}

export function Tree({ nodes, collection, selection, expandedRefs = new Set(), onSelectionChange, onExpandedChange, className, ariaLabel = "Tree" }: TreeProps) {
  const visible = flattenVisible(nodes, expandedRefs);
  const select = (ref: CollectionItemRef) => {
    const result = selectKnownRef(collection, selection, ref);
    if (result.ok) onSelectionChange?.(result.state);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    const current = visible[index];
    if (!current) return;
    let target: VisibleNode | undefined;
    if (event.key === "ArrowDown") target = visible[index + 1];
    else if (event.key === "ArrowUp") target = visible[index - 1];
    else if (event.key === "Home") target = visible[0];
    else if (event.key === "End") target = visible[visible.length - 1];
    else if (event.key === "ArrowRight" && current.node.children?.length && !expandedRefs.has(current.node.ref)) {
      onExpandedChange?.(toggleExpanded(expandedRefs, current.node.ref));
    } else if (event.key === "ArrowLeft" && expandedRefs.has(current.node.ref)) {
      onExpandedChange?.(toggleExpanded(expandedRefs, current.node.ref));
    } else return;
    event.preventDefault();
    if (target) select(target.node.ref);
  };
  return createElement("div", { role: "tree", "aria-label": ariaLabel, "data-slot": "tree", className: cn("flex flex-col gap-0.5", className) },
    visible.map(({ node, depth }, index) => createElement("div", {
      key: node.ref,
      role: "treeitem",
      tabIndex: selection.selectedRef === node.ref || (selection.selectedRef === null && index === 0) ? 0 : -1,
      "aria-level": depth,
      "aria-selected": selection.selectedRef === node.ref,
      "aria-expanded": node.children?.length ? expandedRefs.has(node.ref) : undefined,
      "data-ref": node.ref,
      "data-slot": "tree-item",
      onClick: () => select(node.ref),
      onDoubleClick: () => node.children?.length && onExpandedChange?.(toggleExpanded(expandedRefs, node.ref)),
      onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => handleKeyDown(event, index),
      className: "flex min-h-8 cursor-default items-center rounded-md px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/40 aria-selected:bg-accent aria-selected:text-accent-foreground",
      style: { paddingInlineStart: `${8 + (depth - 1) * 16}px` },
    }, node.label)));
}

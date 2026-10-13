"use client";

import { useState, type KeyboardEvent } from "react";
import { cn } from "./components.js";

export type NavigationTreeNode = Readonly<{ id: string; label: string; disabled?: boolean; children?: readonly NavigationTreeNode[] }>;
export type NavigationTreeProps = Readonly<{
  label: string;
  nodes: readonly NavigationTreeNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}>;

/** Lightweight, controlled identity selection and local disclosure; no File Manager ownership. */
export function NavigationTree({ label, nodes, selectedId, onSelect }: NavigationTreeProps) {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
  const flatten = (items: readonly NavigationTreeNode[], depth = 1): Array<{node: NavigationTreeNode; depth: number}> =>
    items.flatMap(node => [{ node, depth }, ...(node.children?.length && expanded.has(node.id) ? flatten(node.children, depth + 1) : [])]);
  const visible = flatten(nodes);
  const toggle = (id: string) => setExpanded(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, node: NavigationTreeNode) => {
    const index = visible.findIndex(item => item.node.id === node.id);
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const target = event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1 : (index + direction + visible.length) % visible.length;
      const next = visible[target]?.node;
      if (next) document.getElementById("nav-tree-" + CSS.escape(next.id))?.focus();
    } else if (event.key === "ArrowRight" && node.children?.length && !expanded.has(node.id)) { event.preventDefault(); toggle(node.id); }
    else if (event.key === "ArrowLeft" && expanded.has(node.id)) { event.preventDefault(); toggle(node.id); }
  };
  const inspect = (items: readonly NavigationTreeNode[]): string[] => items.flatMap(node => [node.id, ...inspect(node.children ?? [])]);
  const ids = inspect(nodes);
  if (ids.some(id => !id.trim()) || new Set(ids).size !== ids.length) throw new Error("NavigationTree requires unique nonempty IDs");
  return <nav data-slot="navigation-tree" aria-label={label} className="min-w-0">
    <ul role="tree" aria-label={label} className="space-y-1">{visible.map(({node,depth}) =>
      <li key={node.id} role="none"><button id={"nav-tree-" + node.id} role="treeitem" type="button" disabled={node.disabled}
        aria-level={depth} aria-expanded={node.children?.length ? expanded.has(node.id) : undefined}
        aria-selected={selectedId === node.id} onKeyDown={event => handleKey(event,node)}
        onClick={() => { if (node.children?.length) toggle(node.id); onSelect(node.id); }}
        className={cn("flex w-full min-w-0 items-center gap-2 rounded px-2 py-1.5 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50", selectedId === node.id ? "bg-accent" : "hover:bg-muted")}
        style={{paddingInlineStart: (depth - 1) * 16 + 8}}>
        <span aria-hidden="true">{node.children?.length ? expanded.has(node.id) ? "▾" : "▸" : "•"}</span><span className="truncate">{node.label}</span>
      </button></li>)}</ul>
  </nav>;
}

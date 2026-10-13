"use client";

import { useState, type KeyboardEvent } from "react";
import { cn } from "./components.js";
import { StationIcon, type IconToken } from "@system-builder/ui-icons";

export type NavigationTreeNode = Readonly<{ id: string; label: string; disabled?: boolean; icon?: IconToken; children?: readonly NavigationTreeNode[] }>;
export type NavigationTreeProps = Readonly<{
  label: string;
  nodes: readonly NavigationTreeNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  compact?: boolean;
}>;

/** Lightweight, controlled identity selection and local disclosure; no File Manager ownership. */
export function NavigationTree({ label, nodes, selectedId, onSelect, compact = false }: NavigationTreeProps) {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
  const [focusId, setFocusId] = useState<string | null>(null);
  const flatten = (items: readonly NavigationTreeNode[], depth = 1): Array<{node: NavigationTreeNode; depth: number; position: number; size: number}> =>
    items.flatMap((node, index) => [{ node, depth, position: index + 1, size: items.length }, ...(node.children?.length && expanded.has(node.id) ? flatten(node.children, depth + 1) : [])]);
  const visible = flatten(nodes);
  const firstEnabled = visible.find(item => !item.node.disabled)?.node.id;
  const tabStop = visible.some(item => item.node.id === focusId && !item.node.disabled) ? focusId : firstEnabled;
  const toggle = (id: string) => setExpanded(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const parentOf = (id: string, items: readonly NavigationTreeNode[] = nodes, parent: string | null = null): string | null => {
    for (const item of items) {
      if (item.id === id) return parent;
      const result = parentOf(id, item.children ?? [], item.id);
      if (result !== null) return result;
    }
    return null;
  };
  const focusNode = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    const items = event.currentTarget.closest('[role="tree"]')?.querySelectorAll<HTMLButtonElement>('[role="treeitem"]');
    const index = visible.findIndex(item => item.node.id === id);
    if (index >= 0) { setFocusId(id); items?.[index]?.focus(); }
  };
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, node: NavigationTreeNode) => {
    const navigable = visible.filter(item => !item.node.disabled);
    const index = navigable.findIndex(item => item.node.id === node.id);
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const target = event.key === "Home" ? 0 : event.key === "End" ? navigable.length - 1 : (index + direction + navigable.length) % navigable.length;
      const next = navigable[target]?.node;
      if (next) focusNode(event, next.id);
    } else if (event.key === "ArrowRight" && node.children?.length && !expanded.has(node.id)) { event.preventDefault(); toggle(node.id); }
    else if (event.key === "ArrowLeft") {
      if (expanded.has(node.id)) { event.preventDefault(); toggle(node.id); }
      else { const parent = parentOf(node.id); if (parent) { event.preventDefault(); focusNode(event, parent); } }
    }
    else if (event.key === "ArrowRight" && node.children?.length && expanded.has(node.id)) {
      const parentIndex = visible.findIndex(item => item.node.id === node.id);
      const parent = visible[parentIndex];
      const next = parent ? visible.slice(parentIndex + 1).find(item => item.depth === parent.depth + 1 && !item.node.disabled) : undefined;
      if (next) { event.preventDefault(); focusNode(event, next.node.id); }
    }
    else if ((event.key === "Enter" || event.key === " ") && !node.disabled) { event.preventDefault(); if (node.children?.length) toggle(node.id); onSelect(node.id); }
  };
  const inspect = (items: readonly NavigationTreeNode[]): string[] => items.flatMap(node => [node.id, ...inspect(node.children ?? [])]);
  const ids = inspect(nodes);
  if (ids.some(id => !id.trim()) || new Set(ids).size !== ids.length) throw new Error("NavigationTree requires unique nonempty IDs");
  return <nav data-slot="navigation-tree" aria-label={label} className="min-w-0">
    <ul role="tree" aria-label={label} className="max-w-full space-y-1 overflow-x-hidden">{visible.map(({node,depth,position,size}) =>
      <li key={node.id} role="none"><button role="treeitem" type="button" disabled={node.disabled}
        aria-level={depth} aria-posinset={position} aria-setsize={size} aria-expanded={node.children?.length ? expanded.has(node.id) : undefined}
        aria-selected={selectedId === node.id} tabIndex={node.disabled ? -1 : node.id === tabStop ? 0 : -1} onFocus={() => setFocusId(node.id)} aria-label={node.label} title={compact ? node.label : undefined} onKeyDown={event => handleKey(event,node)}
        onClick={() => { if (node.children?.length) toggle(node.id); onSelect(node.id); }}
        className={cn("flex w-full min-w-0 items-center gap-2 rounded px-2 py-1.5 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50", selectedId === node.id ? "bg-accent" : "hover:bg-muted")}
        style={{paddingInlineStart: compact ? 8 : (depth - 1) * 16 + 8}}>
        <span aria-hidden="true" className="shrink-0">{node.children?.length ? expanded.has(node.id) ? "▾" : "▸" : "•"}</span><StationIcon token={node.icon ?? (node.children?.length ? expanded.has(node.id) ? "workspace.folder-open" : "workspace.folder" : "artifact.document")} /><span className={cn("truncate", compact && "sr-only")}>{node.label}</span>
      </button></li>)}</ul>
  </nav>;
}

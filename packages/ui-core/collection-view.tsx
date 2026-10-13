"use client";

import type { ReactNode } from "react";
import { cn } from "./components.js";

export type CollectionState = "ready" | "loading" | "error";
export type CollectionViewProps<Row> = Readonly<{
  label: string;
  rows: readonly Row[];
  rowKey: (row: Row) => string;
  renderItem: (row: Row) => ReactNode;
  selectedKey?: string | null;
  onSelect?: (key: string) => void;
  state?: CollectionState;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  columns?: 1 | 2 | 3;
  className?: string;
}>;
/** Bounded responsive card collection. Caller owns filtering, paging, data and selection. */
export function CollectionView<Row>({
  label, rows, rowKey, renderItem, selectedKey, onSelect, state = "ready",
  loadingMessage = "Loading collection", errorMessage = "Collection unavailable", emptyMessage = "No items",
  columns = 2, className,
}: CollectionViewProps<Row>) {
  if (!label.trim() || ![1, 2, 3].includes(columns)) throw new Error("CollectionView requires label and supported columns");
  const keys = rows.map(rowKey);
  if (keys.some(key => !key.trim()) || new Set(keys).size !== keys.length) throw new Error("CollectionView requires unique nonempty row IDs");
  if (selectedKey != null && !keys.includes(selectedKey)) throw new Error("CollectionView selectedKey must exist among visible rows");
  const status = state === "loading" ? loadingMessage : state === "error" ? errorMessage : rows.length === 0 ? emptyMessage : null;
  return <section aria-label={label} aria-busy={state === "loading"} data-slot="collection-view"
    data-state={state} className={cn("min-w-0", className)}>
    {status != null ? <p role={state === "error" ? "alert" : "status"} className="rounded border border-border p-4 text-sm text-muted-foreground">{status}</p> :
      <ul className={cn("grid min-w-0 gap-2", columns === 1 ? "grid-cols-1" : columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3")}>
        {rows.map((row, i) => <li key={keys[i]} className="min-w-0">
          {onSelect ? <button type="button" aria-label={"Select " + keys[i]} aria-pressed={selectedKey === keys[i]}
            onClick={() => onSelect(keys[i]!)} className="block w-full min-w-0 rounded border border-border p-3 text-left text-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-accent">
            {renderItem(row)}
          </button> : <article className="min-w-0 rounded border border-border p-3 text-sm">{renderItem(row)}</article>}
        </li>)}
      </ul>}
  </section>;
}

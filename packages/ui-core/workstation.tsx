"use client";

import { useId, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "./components.js";
import { StationIcon, type IconToken } from "@system-builder/ui-icons";

export type SplitPaneProps = Readonly<{
  label: string; direction?: "horizontal" | "vertical"; fraction: number;
  onFractionChange: (value: number) => void; first: ReactNode; second: ReactNode;
  minFraction?: number; maxFraction?: number; disabled?: boolean; className?: string;
}>;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
/** Controlled nested panel proportions only; shell/window size remains owned by windowing. */
export function SplitPane({ label, direction = "horizontal", fraction, onFractionChange, first, second,
  minFraction = 0.15, maxFraction = 0.85, disabled = false, className }: SplitPaneProps) {
  const id = useId();
  if (!label.trim() || !Number.isFinite(fraction) || !Number.isFinite(minFraction) || !Number.isFinite(maxFraction) ||
      minFraction < 0.05 || maxFraction > 0.95 || minFraction >= maxFraction || fraction < minFraction || fraction > maxFraction)
    throw new Error("SplitPane requires bounded fraction, limits and label");
  const vertical = direction === "vertical";
  const commit = (value: number) => { if (!disabled) onFractionChange(clamp(Math.round(value * 1000) / 1000, minFraction, maxFraction)); };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta = event.shiftKey ? 0.1 : 0.02;
    const sign = (event.key === (vertical ? "ArrowDown" : "ArrowRight")) ? 1 :
      (event.key === (vertical ? "ArrowUp" : "ArrowLeft")) ? -1 : 0;
    if (sign) { event.preventDefault(); commit(fraction + sign * delta); }
    else if (event.key === "Home") { event.preventDefault(); commit(minFraction); }
    else if (event.key === "End") { event.preventDefault(); commit(maxFraction); }
  };
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;
    const target = event.currentTarget;
    const host = target.parentElement;
    if (!host) return;
    const bounds = host.getBoundingClientRect();
    const size = vertical ? bounds.height : bounds.width;
    if (size <= 0) return;
    target.setPointerCapture(event.pointerId);
    const move = (next: globalThis.PointerEvent) => {
      const value = ((vertical ? next.clientY - bounds.top : next.clientX - bounds.left) / size);
      commit(value);
    };
    const done = () => { target.removeEventListener("pointermove", move); target.removeEventListener("pointerup", done); target.removeEventListener("pointercancel", done); };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", done);
    target.addEventListener("pointercancel", done);
  };
  return <div data-slot="split-pane" data-direction={direction} aria-label={label}
    className={cn("flex min-h-0 min-w-0 overflow-hidden rounded border border-border", vertical ? "flex-col" : "flex-row", className)}
    style={{ "--split-first": `${fraction * 100}%` } as CSSProperties}>
    <section id={id + "-first"} data-slot="split-pane-first" className="min-h-0 min-w-0 overflow-auto" style={{ flex: `0 0 ${fraction * 100}%` }}>{first}</section>
    <div role="separator" tabIndex={disabled ? -1 : 0} aria-label={label + " divider"}
      aria-orientation={vertical ? "horizontal" : "vertical"}
      aria-controls={id + "-first"} aria-valuemin={Math.round(minFraction * 100)} aria-valuemax={Math.round(maxFraction * 100)} aria-valuenow={Math.round(fraction * 100)}
      aria-disabled={disabled} onKeyDown={keyDown} onPointerDown={pointerDown}
      data-slot="split-pane-divider" className={cn("z-10 shrink-0 bg-border hover:bg-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring", vertical ? "h-1.5 w-full cursor-row-resize" : "w-1.5 cursor-col-resize")} />
    <section data-slot="split-pane-second" className="min-h-0 min-w-0 flex-1 overflow-auto">{second}</section>
  </div>;
}

export type DockPanel = Readonly<{ id: string; label: string; content: ReactNode; icon?: IconToken; disabled?: boolean }>;
export type DockGroupProps = Readonly<{
  label: string; panels: readonly DockPanel[]; activeId: string; onActiveChange: (id: string) => void;
  onClose?: (id: string) => void; className?: string;
}>;
/** Controlled panel identity; no global docking/window ownership or reorder side effects. */
export function DockGroup({ label, panels, activeId, onActiveChange, onClose, className }: DockGroupProps) {
  if (!label.trim() || !panels.length || panels.some(p => !p.id.trim() || !p.label.trim()) ||
      new Set(panels.map(p => p.id)).size !== panels.length || !panels.some(p => p.id === activeId && !p.disabled))
    throw new Error("DockGroup requires valid unique panels and enabled activeId");
  const active = panels.find(p => p.id === activeId)!;
  return <section data-slot="dock-group" aria-label={label} className={cn("flex min-h-0 min-w-0 flex-col rounded border border-border", className)}>
    <div role="toolbar" aria-label={label + " tabs"} className="flex min-w-0 gap-1 overflow-x-auto border-b border-border p-1">
      {panels.map(panel => <div key={panel.id} className="flex shrink-0 items-center rounded bg-muted/30" data-active={panel.id === activeId}>
        <button type="button" title={panel.label} aria-label={panel.label} aria-pressed={panel.id === activeId} disabled={panel.disabled}
          onClick={() => onActiveChange(panel.id)} className="flex items-center gap-1 rounded px-2 py-1 text-xs data-[active=true]:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
          {panel.icon && <StationIcon token={panel.icon} />}<span className="max-w-32 truncate">{panel.label}</span>
        </button>
        {onClose && <button type="button" aria-label={"Close " + panel.label} disabled={panel.disabled}
          onClick={() => onClose(panel.id)} className="rounded px-1 text-xs hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">×</button>}
      </div>)}
    </div>
    <div role="region" aria-label={active.label + " panel"} data-slot="dock-panel" className="min-h-0 min-w-0 flex-1 overflow-auto p-2">{active.content}</div>
  </section>;
}

export type FilterBarProps = Readonly<{
  label: string; query: string; onQueryChange: (value: string) => void;
  filters?: readonly Readonly<{ id: string; label: string; selected: boolean; onToggle: () => void; disabled?: boolean }>[];
  actions?: ReactNode; className?: string;
}>;
/** Presentation-only controlled search/filter/action compound; caller owns dataset and filtering. */
export function FilterBar({ label, query, onQueryChange, filters = [], actions, className }: FilterBarProps) {
  if (!label.trim() || new Set(filters.map(f => f.id)).size !== filters.length ||
      filters.some(f => !f.id.trim() || !f.label.trim())) throw new Error("FilterBar requires unique labelled filters");
  return <div role="toolbar" aria-label={label} data-slot="filter-bar" className={cn("flex min-w-0 flex-wrap items-center gap-2 rounded border border-border p-2", className)}>
    <input type="search" aria-label={label + " search"} value={query} onChange={event => onQueryChange(event.target.value)}
      className="min-w-0 flex-1 basis-32 rounded border border-input bg-background px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-ring" />
    {filters.map(filter => <button key={filter.id} type="button" aria-pressed={filter.selected} aria-label={filter.label}
      title={filter.label} disabled={filter.disabled} onClick={filter.onToggle}
      className="shrink-0 rounded border px-2 py-1 text-xs aria-pressed:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">{filter.label}</button>)}
    {actions && <div role="group" aria-label={label + " actions"} className="flex items-center gap-1">{actions}</div>}
  </div>;
}

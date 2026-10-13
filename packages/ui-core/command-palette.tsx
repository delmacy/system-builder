"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./overlays.js";

export type CommandPaletteAction = Readonly<{ id: string; label: string; keywords?: string; disabled?: boolean; onSelect: () => void }>;
export type CommandPaletteProps = Readonly<{ open: boolean; onOpenChange: (open: boolean) => void; actions: readonly CommandPaletteAction[]; title?: string }>;

/** A presentation-only command chooser; command authorization remains with its caller. */
export function CommandPalette({ open, onOpenChange, actions, title = "Commands" }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  if (new Set(actions.map(action => action.id)).size !== actions.length || actions.some(action => !action.id.trim() || !action.label.trim())) throw new Error("CommandPalette action ids and labels must be unique and nonempty");
  const filtered = useMemo(() => actions.filter(action => (action.label + " " + (action.keywords ?? "")).toLocaleLowerCase().includes(query.toLocaleLowerCase())), [actions, query]);
  const enabled = filtered.filter(action => !action.disabled);
  const execute = (action: CommandPaletteAction) => { if (action.disabled) return; onOpenChange(false); setQuery(""); setActive(0); action.onSelect(); };
  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setActive(index => (index + (event.key === "ArrowDown" ? 1 : -1) + Math.max(enabled.length, 1)) % Math.max(enabled.length, 1)); }
    if (event.key === "Home") { event.preventDefault(); setActive(0); }
    if (event.key === "End") { event.preventDefault(); setActive(Math.max(0, enabled.length - 1)); }
    if (event.key === "Enter" && enabled[active]) { event.preventDefault(); execute(enabled[active]); }
  };
  return <Dialog open={open} onOpenChange={next => { onOpenChange(next); if (!next) { setQuery(""); setActive(0); } }}>
    <DialogContent data-slot="command-palette" aria-label={title}>
      <DialogTitle>{title}</DialogTitle><DialogDescription>Search available commands and press Enter to select.</DialogDescription>
      <input aria-label="Search commands" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="command-palette-list" autoComplete="off" autoFocus
        className="w-full rounded border border-input bg-background px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        value={query} onChange={event => { setQuery(event.target.value); setActive(0); }} onKeyDown={handleKey} />
      <div role="listbox" id="command-palette-list" aria-label="Available commands" className="max-h-56 overflow-auto rounded border p-1">
        {filtered.length ? filtered.map(action => <button type="button" role="option" key={action.id} aria-selected={enabled[active]?.id === action.id} disabled={action.disabled}
          className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-accent focus-visible:bg-accent disabled:opacity-50"
          onClick={() => execute(action)}>{action.label}</button>) : <p className="px-3 py-2 text-sm text-muted-foreground">No commands found</p>}
      </div>
    </DialogContent>
  </Dialog>;
}

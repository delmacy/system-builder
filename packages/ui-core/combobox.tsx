"use client";

import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { cn } from "./components.js";

export type ComboboxOption = Readonly<{ value: string; label: string; disabled?: boolean }>;
export type ComboboxProps = Readonly<{
  label: string;
  options: readonly ComboboxOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
}>;

/** Bounded local autocomplete. Selection is controlled; filtering remains presentation-only. */
export function Combobox({ label, options, value, onValueChange, placeholder, disabled = false, emptyMessage = "No matches", }: ComboboxProps) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const filtered = useMemo(() => options.filter(option => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [options, query]);
  const enabled = filtered.filter(option => !option.disabled);
  const selected = options.find(option => option.value === value);
  const listboxId = id + "-options";
  const optionId = (key: string) => id + "-option-" + encodeURIComponent(key);
  if (options.some(option => !option.value.trim() || !option.label.trim()) || new Set(options.map(option => option.value)).size !== options.length) {
    throw new Error("Combobox requires unique nonempty option values and labels");
  }
  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    onValueChange(option.value); setQuery(option.label); setOpen(false); setActive(0);
  };
  const keyboard = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") { if (open) { event.preventDefault(); setOpen(false); setQuery(selected?.label ?? ""); } return; }
    if (event.key === "Home" && open) { event.preventDefault(); setActive(0); return; }
    if (event.key === "End" && open) { event.preventDefault(); setActive(Math.max(0, enabled.length - 1)); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) { setOpen(true); setActive(0); return; }
      setActive(index => (index + (event.key === "ArrowDown" ? 1 : -1) + Math.max(1, enabled.length)) % Math.max(1, enabled.length));
    }
    if (event.key === "Enter" && open && enabled[active]) { event.preventDefault(); choose(enabled[active]); }
    if (event.key === "Tab" && open) setOpen(false);
  };
  return <div className="relative min-w-0" data-slot="combobox">
    <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
    <input id={id} role="combobox" type="text" autoComplete="off" disabled={disabled} placeholder={placeholder}
      aria-autocomplete="list" aria-expanded={open} aria-controls={listboxId}
      aria-activedescendant={open && enabled[active] ? optionId(enabled[active].value) : undefined}
      value={open || query ? query : (selected?.label ?? "")}
      onFocus={() => { setOpen(true); setActive(0); }}
      onBlur={event => { if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) setOpen(false); }}
      onChange={event => { setQuery(event.target.value); setOpen(true); setActive(0); }}
      onKeyDown={keyboard}
      className={cn("h-[var(--sb-control-height)] w-full min-w-0 rounded-[var(--sb-radius-control)] border border-input bg-background px-[var(--sb-control-padding)] text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50")} />
    {open ? <div id={listboxId} role="listbox" aria-label={label + " options"} className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
      {filtered.length ? filtered.map(option => <button type="button" role="option" key={option.value}
        id={optionId(option.value)} aria-selected={value === option.value} disabled={option.disabled}
        className={cn("block w-full rounded px-2 py-1 text-left text-sm hover:bg-accent focus-visible:bg-accent disabled:opacity-50", enabled[active]?.value === option.value && "bg-accent")}
        onMouseDown={event => event.preventDefault()} onClick={() => choose(option)}>{option.label}</button>) :
        <p className="px-2 py-1 text-sm text-muted-foreground">{emptyMessage}</p>}
    </div> : null}
  </div>;
}

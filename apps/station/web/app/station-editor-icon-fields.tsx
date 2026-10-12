"use client";
import { useEffect, useState } from "react";
import { getIconLibrary } from "@system-builder/ui-icons";
type Library = Awaited<ReturnType<typeof getIconLibrary>>;
export function EditorIconFields({ mode, placement, assetRef, catalogVersion, change }: Readonly<{
  mode: string; placement: string; assetRef: string; catalogVersion: string;
  change: (field: "propertyMode" | "propertyPlacement" | "propertyAsset" | "propertyCatalog", value: string) => void;
}>) {
  const [library, setLibrary] = useState<Library | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => { let current = true;
    getIconLibrary().then(value => { if (current) setLibrary(value); }).catch(() => { if (current) setUnavailable(true); });
    return () => { current = false; };
  }, []);
  const page = library?.searchIconCatalog(query, { limit: 48 });
  const retained = assetRef && (catalogVersion !== library?.ICON_CATALOG_VERSION || !page?.items.some(item => item.assetRef === assetRef));
  return <fieldset className="space-y-2"><legend className="text-sm font-medium">Icon presentation</legend>
    <label htmlFor="editor-button-mode" className="block text-sm">Button display</label>
    <select id="editor-button-mode" value={mode} onChange={e => change("propertyMode", e.target.value)} className="w-full rounded-md border bg-background p-2">
      <option value="text">Text</option><option value="icon-text">Icon and text</option><option value="icon">Icon only</option>
    </select>
    <label htmlFor="editor-button-placement" className="block text-sm">Icon position</label>
    <select id="editor-button-placement" value={placement} onChange={e => change("propertyPlacement", e.target.value)} className="w-full rounded-md border bg-background p-2">
      <option value="start">Start</option><option value="end">End</option>
    </select>
    <label htmlFor="editor-icon-search" className="block text-sm">Search icons</label>
    <input id="editor-icon-search" value={query} maxLength={128} onChange={e => setQuery(e.target.value.replace(/[\p{Cc}]/gu, ""))} className="w-full rounded-md border bg-background p-2" />
    <label htmlFor="editor-button-icon" className="block text-sm">Button icon</label>
    <select id="editor-button-icon" value={assetRef} disabled={!library} onChange={e => {
      change("propertyAsset", e.target.value); change("propertyCatalog", e.target.value ? library!.ICON_CATALOG_VERSION : "");
    }} className="w-full rounded-md border bg-background p-2">
      <option value="">No icon</option>
      {retained ? <option value={assetRef}>{assetRef} · retained {catalogVersion}</option> : null}
      {page?.items.map(item => <option key={item.assetRef} value={item.assetRef}>{item.roles[0]?.label ?? item.name} · {item.name}</option>)}
    </select>
    <p aria-live="polite" className="text-xs text-muted-foreground">{library ? `${page!.total} matching icons. Showing up to 48; refine your search.` : unavailable ? "Icon library unavailable. Retained references are preserved." : "Loading icon library…"}</p>
    <p className="text-xs text-muted-foreground">Icon modes require an icon. The button label is preserved.</p>
  </fieldset>;
}

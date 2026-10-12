"use client";
import { useMemo, useState } from "react";
import { DataTable, SearchField, SelectField, type DataTableColumn } from "../../../../packages/ui-core/index";

type AssetRow = { id: string; name: string; kind: string };
const assets: readonly AssetRow[] = [
  { id: "asset-001", name: "Document template", kind: "Document" },
  { id: "asset-002", name: "Workspace layout", kind: "Composition" },
  { id: "asset-003", name: "Process overview", kind: "Process" },
];
const columns: readonly DataTableColumn<AssetRow>[] = [
  { id: "name", label: "Name", sortable: true, cell: row => row.name },
  { id: "kind", label: "Kind", sortable: true, cell: row => row.kind },
];
export function StationCollectionFoundationLab() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [sort, setSort] = useState<{columnId:string;direction:"asc"|"desc"}>({columnId:"name",direction:"asc"});
  const filtered = useMemo(() => assets.filter(row =>
    (kind === "all" || row.kind === kind) && row.name.toLowerCase().includes(query.toLowerCase())), [query, kind]);
  const sorted = useMemo(() => [...filtered].sort((a,b) => { const comparison = a[sort.columnId as "name"|"kind"].localeCompare(b[sort.columnId as "name"|"kind"]); return sort.direction === "asc" ? comparison : -comparison; }), [filtered,sort]);
  const visibleSelection = selectedKey && filtered.some(row => row.id === selectedKey) ? selectedKey : null;
  return <section className="space-y-3 rounded-lg border p-4" aria-label="Collection foundation reference" data-slot="collection-foundation-lab">
    <h2 className="text-sm font-semibold">Collections · DataTable</h2>
    <div className="flex flex-wrap gap-2">
      <SearchField label="Search collection assets" placeholder="Search assets" value={query} onChange={event => setQuery(event.target.value)} />
      <SelectField label="Filter collection kind" value={kind} onChange={event => setKind(event.target.value)} options={[
        { value: "all", label: "All kinds" }, { value: "Document", label: "Document" },
        { value: "Composition", label: "Composition" }, { value: "Process", label: "Process" }]} />
    </div>
    <DataTable label="Reference assets" rows={sorted} columns={columns} sort={sort} onSortChange={setSort} rowKey={row => row.id} selectedKey={visibleSelection} onSelect={setSelectedKey} />
    <p role="status" aria-label="Collection selection state" className="text-xs text-muted-foreground">Selected: {visibleSelection ?? "none"} · Rows: {filtered.length}</p>
  </section>;
}

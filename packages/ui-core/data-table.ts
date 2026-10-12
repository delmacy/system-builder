import { createElement, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "./components.js";

export interface DataTableColumn<Row> {
  readonly id: string;
  readonly label: string;
  readonly cell: (row: Row) => ReactNode;
  readonly sortable?: boolean;
}
export type DataTableProps<Row> = Omit<HTMLAttributes<HTMLTableElement>, "children"> & Readonly<{
  label: string;
  rows: readonly Row[];
  columns: readonly DataTableColumn<Row>[];
  rowKey: (row: Row) => string;
  selectedKey?: string | null;
  sort?: Readonly<{ columnId: string; direction: "asc" | "desc" }>;
  onSortChange?: (sort: { columnId: string; direction: "asc" | "desc" }) => void;
  onSelect?: (key: string) => void;
  state?: "ready" | "loading" | "error";
  message?: string;
}>;
/** Local semantic table only. DataGrid virtualization, sorting and paging require separate gates. */
export function DataTable<Row>({ label, rows, columns, rowKey, selectedKey, onSelect, sort, onSortChange, state = "ready", message, className, ...props }: DataTableProps<Row>) {
  if (!label.trim() || columns.length === 0 || columns.some(column => !column.id.trim() || !column.label.trim()) ||
    new Set(columns.map(column => column.id)).size !== columns.length) throw new Error("DataTable requires unique nonempty column IDs and labels");
  if (sort && !columns.some(column => column.id === sort.columnId && column.sortable)) throw new Error("DataTable sort must reference a sortable column");
  const keys = rows.map(rowKey);
  if (keys.some(key => !key.trim()) || new Set(keys).size !== keys.length) throw new Error("DataTable requires unique nonempty row keys");
  if (selectedKey != null && !keys.includes(selectedKey)) throw new Error("DataTable selectedKey must exist");
  const notice = state !== "ready" ? message || (state === "loading" ? "Loading" : "Unable to load") :
    rows.length === 0 ? (message || "No results") : null;
  return createElement("div", { "data-slot": "data-table-container", className: "max-w-full overflow-x-auto" },
    createElement("table", { ...props, "aria-label": label, "aria-busy": state === "loading" ? true : undefined,
      "data-slot": "data-table", className: cn("w-full border-collapse text-left text-sm", className) },
      createElement("thead", {}, createElement("tr", {}, columns.map(column =>
        createElement("th", { key: column.id, scope: "col", "aria-sort": sort?.columnId === column.id ? (sort.direction === "asc" ? "ascending" : "descending") : undefined, className: "border-b border-border bg-muted/40 px-3 py-2 text-xs font-semibold" },
          column.sortable && onSortChange ? createElement("button", { type: "button", "aria-label": `Sort by ${column.label}`, onClick: () => onSortChange({columnId: column.id, direction: sort?.columnId === column.id && sort.direction === "asc" ? "desc" : "asc"}), className: "focus-visible:outline-2 focus-visible:outline-ring" }, column.label) : column.label)))),
      createElement("tbody", {}, notice !== null ?
        createElement("tr", {}, createElement("td", { colSpan: columns.length, role: state === "error" ? "alert" : "status", className: "px-3 py-4 text-muted-foreground" }, notice)) :
        rows.map((row, index) => createElement("tr", { key: keys[index], "data-row-key": keys[index],
          "aria-selected": selectedKey === keys[index] ? true : undefined, "data-selected": selectedKey === keys[index],
          className: "border-b border-border hover:bg-accent/40 data-[selected=true]:bg-accent/60" },
          columns.map(column => createElement("td", { key: column.id, className: "px-3 py-2" },
            onSelect && column === columns[0] ?
              createElement("button", { type: "button", "aria-label": `Select ${keys[index]}`,
                onClick: () => onSelect(keys[index]!), className: "text-left underline-offset-2 focus-visible:underline focus-visible:outline-2" }, column.cell(row)) :
              column.cell(row))))))));
}

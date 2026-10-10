"use client";

import { useReducer, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "../../../../packages/ui-core/index";
import { COMPONENT_FAMILIES, ComponentRegistry, defineCompositionGraph } from "../../../../packages/station-composition/index";
import {
  initializeEditorSession, projectEditorLayers, selectEditorLayer,
  projectEditorInspector, projectEditorPreview, createEditorSetSpanIntent,
  applyEditorStructuralEditIntent, acceptEditorDraft, discardEditorDraft,
  type EditorSession, type LayersSelection,
} from "../../../../packages/station-editor/index";

const registry = new ComponentRegistry([
  { id: "component:grid", family: "layout-container", layout: "grid", layoutOwnership: "self",
    childPolicy: "multiple", constraints: { minColumns: 1, maxColumns: 12, recommendedColumns: 12,
      minRows: 1, maxRows: 12, recommendedRows: 4 },
    slots: [{ id: "content", childPolicy: "multiple", acceptsFamilies: [...COMPONENT_FAMILIES] }] },
  { id: "component:button", family: "atomic", layout: "none", childPolicy: "none",
    constraints: { minColumns: 1, maxColumns: 4, recommendedColumns: 2,
      minRows: 1, maxRows: 2, recommendedRows: 1 }, slots: [] },
]);
const graph = defineCompositionGraph({ rootRef: "node:root", nodes: [
  { ref: "node:root", componentRef: "component:grid" },
  { ref: "node:button-1", componentRef: "component:button",
    placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } },
  { ref: "node:button-2", componentRef: "component:button",
    placement: { parentRef: "node:root", slotRef: "content", columnSpan: 2, rowSpan: 1 } },
] });
const labels: Readonly<Record<string, string>> = {
  "node:root": "Grid", "node:button-1": "Button 1", "node:button-2": "Button 2",
};
type State = Readonly<{
  session: EditorSession; selection: LayersSelection;
  columns: string; rows: string; message: string; invalid: boolean;
}>;
type Action =
  | { type: "select"; ref: string }
  | { type: "field"; field: "columns" | "rows"; value: string }
  | { type: "apply" | "save" | "discard" };

function fields(session: EditorSession, selection: LayersSelection) {
  const result = projectEditorInspector(session, selection, session.draftRevision);
  const placement = result.accepted && result.snapshot.kind === "node" ? result.snapshot.placement : null;
  return { columns: placement ? String(placement.columnSpan) : "", rows: placement ? String(placement.rowSpan) : "" };
}
function initialState(): State {
  const result = initializeEditorSession({
    sessionRef: "session:visual-workbench",
    base: { applicationRef: "app:composition-editor", compositionRef: "composition:example",
      revision: 7, currentness: "current" }, composition: graph,
  }, registry);
  if (!result.accepted) throw new Error("Unable to initialize the example composition");
  return { session: result.session, selection: { selectedRef: null },
    columns: "", rows: "", message: "Select a layer to edit its size.", invalid: false };
}
function reducer(state: State, action: Action): State {
  if (action.type === "field") return { ...state, [action.field]: action.value, invalid: false };
  if (action.type === "select") {
    const result = selectEditorLayer(projectEditorLayers(state.session), state.selection, action.ref);
    if (!result.accepted) return { ...state, message: "This layer is unavailable.", invalid: true };
    return { ...state, selection: result.selection, ...fields(state.session, result.selection),
      message: action.ref === "node:root" ? "The root grid is read-only." : "Layer selected.", invalid: false };
  }
  if (action.type === "apply") {
    const proposal = createEditorSetSpanIntent(state.session, state.selection, state.session.draftRevision,
      { columnSpan: Number(state.columns), rowSpan: Number(state.rows) });
    if (!proposal.accepted) return { ...state, invalid: true,
      message: "Enter whole numbers: 1–4 columns and 1–2 rows. The composition is unchanged." };
    const result = applyEditorStructuralEditIntent(state.session, state.selection, proposal.intent, registry);
    if (!result.accepted) return { ...state, invalid: true,
      message: "This size is not allowed. Use 1–4 columns and 1–2 rows. The composition is unchanged." };
    return { ...state, session: result.session, invalid: false,
      message: result.changed ? "Size updated. Save or discard your changes." : "The size is already applied." };
  }
  const result = action.type === "save"
    ? acceptEditorDraft(state.session, state.session.draftRevision, registry)
    : discardEditorDraft(state.session, state.session.draftRevision, registry);
  if (!result.accepted) return { ...state, invalid: true,
    message: "The changes could not be accepted. Your composition is unchanged." };
  return { ...state, session: result.session, ...fields(result.session, state.selection), invalid: false,
    message: action.type === "save"
      ? (result.changed ? "Changes saved for this session." : "No changes to save.")
      : (result.changed ? "Changes discarded." : "No changes to discard.") };
}

export function StationEditorWorkbench() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [expanded, setExpanded] = useState(true);
  const [focusedRef, setFocusedRef] = useState("node:root");
  const items = useRef(new Map<string, HTMLButtonElement>());
  const layers = projectEditorLayers(state.session);
  const inspector = projectEditorInspector(state.session, state.selection, state.session.draftRevision);
  const preview = projectEditorPreview(state.session, registry, state.selection);
  const selected = inspector.accepted && inspector.snapshot.kind === "node" ? inspector.snapshot : null;
  const editable = selected?.editable === true;
  const visible = layers.accepted ? [layers.root, ...(expanded ? layers.root.children : [])] : [];
  const focusable = visible.some(node => node.nodeRef === focusedRef) ? focusedRef : "node:root";
  const focus = (ref: string) => { setFocusedRef(ref); items.current.get(ref)?.focus(); };
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const node = visible[index];
    if (!node) return;
    let target: string | undefined;
    if (event.key === "ArrowDown") target = visible[index + 1]?.nodeRef;
    else if (event.key === "ArrowUp") target = visible[index - 1]?.nodeRef;
    else if (event.key === "Home") target = visible[0]?.nodeRef;
    else if (event.key === "End") target = visible[visible.length - 1]?.nodeRef;
    else if (event.key === "ArrowRight" && node.parentRef === null) {
      if (!expanded) setExpanded(true); else target = visible[index + 1]?.nodeRef;
    } else if (event.key === "ArrowLeft") {
      if (node.parentRef === null) setExpanded(false); else target = node.parentRef;
    } else return;
    event.preventDefault();
    if (target) focus(target);
  };

  return <section aria-label="Composition editor" data-draft-revision={state.session.draftRevision}
    data-base-revision={state.session.base.revision} className="overflow-hidden rounded-xl border bg-card shadow-sm">
    <header className="flex flex-wrap items-center gap-3 border-b p-4">
      <p className="mr-auto font-semibold">Example composition</p>
      <span data-testid="draft-state" className="text-sm text-muted-foreground">
        {state.session.transaction.dirty ? "Unsaved changes" : "All changes saved"}
      </span>
      <Button aria-disabled={!state.session.transaction.dirty} onClick={() => dispatch({ type: "save" })}>Save changes</Button>
      <Button variant="outline" aria-disabled={!state.session.transaction.dirty} onClick={() => dispatch({ type: "discard" })}>Discard changes</Button>
    </header>
    <div className="grid min-h-[28rem] lg:grid-cols-[14rem_minmax(0,1fr)_18rem]">
      <section aria-labelledby="layers-heading" className="border-b p-4 lg:border-b-0 lg:border-r">
        <h2 id="layers-heading" className="mb-3 font-semibold">Layers</h2>
        <p className="mb-3 text-xs text-muted-foreground">Use arrows to move focus, Enter to select.</p>
        <div role="tree" aria-label="Composition layers" className="space-y-1">
          {visible.map((node, index) => <button key={node.nodeRef} type="button" role="treeitem"
            aria-level={node.parentRef === null ? 1 : 2}
            aria-selected={state.selection.selectedRef === node.nodeRef}
            aria-expanded={node.children.length ? expanded : undefined}
            tabIndex={focusable === node.nodeRef ? 0 : -1}
            ref={element => { if (element) items.current.set(node.nodeRef, element); else items.current.delete(node.nodeRef); }}
            onFocus={() => setFocusedRef(node.nodeRef)}
            onClick={() => dispatch({ type: "select", ref: node.nodeRef })}
            onKeyDown={event => navigate(event, index)}
            className={"block w-full rounded-md border border-transparent py-2 text-left text-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-selected:bg-accent " + (node.parentRef === null ? "px-2" : "pl-6 pr-2")}>
            {labels[node.nodeRef] ?? node.nodeRef}
          </button>)}
        </div>
      </section>
      <section aria-labelledby="preview-heading" className="min-w-0 border-b p-5 lg:border-b-0">
        <h2 id="preview-heading" className="mb-4 font-semibold">Preview</h2>
        {preview.accepted ? <div className="grid grid-cols-12 auto-rows-[3rem] gap-2 rounded-lg border bg-muted/30 p-3"
          aria-label="Composition preview">
          {preview.snapshot.nodes.filter(node => node.kind === "node").map(node => <div
            key={node.nodeRef} role="img" aria-label={(labels[node.nodeRef] ?? node.nodeRef) + " preview"}
            data-node-ref={node.nodeRef} data-column-span={node.columnSpan} data-row-span={node.rowSpan}
            data-selected={node.selected ? "true" : "false"}
            style={{ gridColumn: "span " + node.columnSpan, gridRow: "span " + node.rowSpan }}
            className={"flex items-center justify-center overflow-hidden rounded-md border px-2 text-sm " +
              (node.selected ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "bg-card")}>
            {labels[node.nodeRef] ?? node.nodeRef}
          </div>)}
        </div> : <p role="alert">Preview unavailable. Your composition has been preserved.</p>}
      </section>
      <section aria-labelledby="inspector-heading" className="p-4 lg:border-l">
        <h2 id="inspector-heading" className="mb-3 font-semibold">Inspector</h2>
        {selected ? <p className="mb-3 text-sm">{labels[selected.nodeRef] ?? selected.nodeRef}</p> :
          <p className="mb-3 text-sm text-muted-foreground">Select a layer to inspect it.</p>}
        {selected && !editable ? <p className="mb-3 text-sm text-muted-foreground">The root grid is read-only.</p> : null}
        <form onSubmit={event => { event.preventDefault(); dispatch({ type: "apply" }); }} className="space-y-3">
          <div><label htmlFor="editor-columns" className="mb-1 block text-sm">Columns</label>
            <input id="editor-columns" inputMode="numeric" autoComplete="off" disabled={!editable}
              value={state.columns} onChange={event => dispatch({ type: "field", field: "columns", value: event.target.value })}
              aria-invalid={state.invalid} aria-describedby="span-help editor-feedback"
              className="w-full rounded-md border bg-background p-2 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring" /></div>
          <div><label htmlFor="editor-rows" className="mb-1 block text-sm">Rows</label>
            <input id="editor-rows" inputMode="numeric" autoComplete="off" disabled={!editable}
              value={state.rows} onChange={event => dispatch({ type: "field", field: "rows", value: event.target.value })}
              aria-invalid={state.invalid} aria-describedby="span-help editor-feedback"
              className="w-full rounded-md border bg-background p-2 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring" /></div>
          <p id="span-help" className="text-xs text-muted-foreground">Whole numbers: 1–4 columns and 1–2 rows.</p>
          <Button type="submit" variant="outline" disabled={!editable}>Apply size</Button>
        </form>
      </section>
    </div>
    <footer className="border-t p-4">
      <p id="editor-feedback" role="status" aria-live="polite" aria-atomic="true" className="text-sm">{state.message}</p>
      <p className="mt-2 text-xs text-muted-foreground">Changes are kept for this session. Reloading starts a new example.</p>
    </footer>
  </section>;
}

"use client";

import { useReducer, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Button } from "../../../../packages/ui-core/index";
import { DEFAULT_COMPOSITION_REF, initializeCatalogEditorSession, listEditorCatalog, resolveEditorCatalogEntry, type EditorCatalogEntry } from "./station-editor-catalog";
import { prepareEditorArtifact, readEditorArtifact, requestArtifactDownload, sameEditorArtifactGraph } from "./station-editor-files";
import type { EditorLayer } from "../../../../packages/station-editor/index";
import {
  projectEditorLayers, selectEditorLayer,
  projectEditorInspector, projectEditorPreview, createEditorSetSpanIntent,
  applyEditorStructuralEditIntent, acceptEditorDraft, discardEditorDraft,
  initializeEditorSession, openStoredArtifact, saveStoredArtifact,
  type EditorSession, type LayersSelection, type CompositionArtifact,
} from "../../../../packages/station-editor/index";

type State = Readonly<{
  entry: EditorCatalogEntry; session: EditorSession; selection: LayersSelection;
  pendingRef: string | null;
  columns: string; rows: string; message: string; invalid: boolean;
  document: CompositionArtifact | null; savedText: string | null;
  pendingArtifact: Readonly<{ document: CompositionArtifact; savedText: string | null }> | null;
}>;
type Action =
  | { type: "select"; ref: string }
  | { type: "field"; field: "columns" | "rows"; value: string }
  | { type: "apply" | "save" | "discard" }
  | { type: "request-switch"; ref: string }
  | { type: "cancel-switch" | "confirm-switch" }
  | { type: "feedback"; message: string; invalid: boolean; expectedSession: EditorSession }
  | { type: "request-open"; document: CompositionArtifact; savedText: string | null; expectedSession: EditorSession }
  | { type: "cancel-open" | "confirm-open" }
  | { type: "saved-artifact"; document: CompositionArtifact; savedText: string; expectedSession: EditorSession };

function fields(session: EditorSession, selection: LayersSelection) {
  const result = projectEditorInspector(session, selection, session.draftRevision);
  const placement = result.accepted && result.snapshot.kind === "node" ? result.snapshot.placement : null;
  return { columns: placement ? String(placement.columnSpan) : "", rows: placement ? String(placement.rowSpan) : "" };
}
function initialState(ref: string): State | null {
  const result = initializeCatalogEditorSession(ref, "session:visual-workbench");
  if (!result.accepted) return null;
  return { entry: result.entry, session: result.session, selection: { selectedRef: null },
    columns: "", rows: "", message: "Select a layer to edit its size.", invalid: false, pendingRef: null,
    document: null, savedText: null, pendingArtifact: null };
}
function replaceArtifact(state: State, candidate: { document: CompositionArtifact; savedText: string | null }): State {
  const entry = resolveEditorCatalogEntry(candidate.document.payload.compositionRef);
  if (!entry) return { ...state, pendingArtifact: null, invalid: true, message: "Composition unavailable. Your session is unchanged." };
  const result = initializeEditorSession({ sessionRef: "session:visual-workbench", base: {
    applicationRef: entry.applicationRef, compositionRef: entry.compositionRef, revision: entry.revision, currentness: "current" },
    composition: candidate.document.payload.graph }, entry.registry);
  if (!result.accepted) return { ...state, pendingArtifact: null, invalid: true, message: "Unable to open the artifact. Your session is unchanged." };
  const selectedRef = state.entry.compositionRef === entry.compositionRef &&
    result.session.transaction.draft.nodes.some(node => node.ref === state.selection.selectedRef) ? state.selection.selectedRef : null;
  const selection = { selectedRef };
  return { ...state, entry, session: result.session, selection, ...fields(result.session, selection),
    document: candidate.document, savedText: candidate.savedText, pendingRef: null, pendingArtifact: null,
    invalid: false, message: "Composition opened. Edit it or save a new version." };
}
function sizeHelp(state: State): string {
  const node = state.session.transaction.draft.nodes.find(item => item.ref === state.selection.selectedRef);
  const bounds = node && state.entry.registry.get(node.componentRef)?.constraints;
  return bounds ? `${bounds.minColumns}–${bounds.maxColumns} columns and ${bounds.minRows}–${bounds.maxRows} ${bounds.maxRows === 1 ? "row" : "rows"}` : "1–4 columns and 1–2 rows";
}
function reducer(state: State | null, action: Action): State | null {
  if (!state) return null;
  if (action.type === "feedback") return action.expectedSession === state.session
    ? { ...state, message: action.message, invalid: action.invalid } : state;
  if (action.type === "request-open") {
    if (action.expectedSession !== state.session) return state;
    const candidate = { document: action.document, savedText: action.savedText };
    const currentFields = fields(state.session, state.selection);
    return state.session.transaction.dirty || state.columns !== currentFields.columns || state.rows !== currentFields.rows ||
      !sameEditorArtifactGraph(state.session.transaction.draft, state.document?.payload.graph ?? state.entry.composition)
      ? { ...state, pendingArtifact: candidate, pendingRef: null }
      : replaceArtifact(state, candidate);
  }
  if (action.type === "cancel-open") return { ...state, pendingArtifact: null };
  if (action.type === "confirm-open") return state.pendingArtifact ? replaceArtifact(state, state.pendingArtifact) : state;
  if (action.type === "saved-artifact") {
    if (action.expectedSession !== state.session) return state;
    const result = acceptEditorDraft(state.session, state.session.draftRevision, state.entry.registry);
    if (!result.accepted) return { ...state, invalid: true, message: "File retained locally, but this session could not be accepted." };
    return { ...state, session: result.session, document: action.document, savedText: action.savedText,
      ...fields(result.session, state.selection), invalid: false, message: "Composition saved locally in this browser." };
  }
  if (action.type === "request-switch") {
    if (action.ref === state.entry.compositionRef) return state;
    if (state.session.transaction.dirty) return { ...state, pendingRef: action.ref };
    return initialState(action.ref) ?? { ...state, invalid: true, message: "Composition unavailable. Your session is unchanged." };
  }
  if (action.type === "cancel-switch") return { ...state, pendingRef: null };
  if (action.type === "confirm-switch") {
    if (!state.pendingRef) return state;
    const discarded = discardEditorDraft(state.session, state.session.draftRevision, state.entry.registry);
    if (!discarded.accepted) return { ...state, invalid: true, message: "Unable to switch. Your session is unchanged." };
    return initialState(state.pendingRef) ?? { ...state, pendingRef: null, invalid: true,
      message: "Composition unavailable. Your session is unchanged." };
  }
  if (action.type === "field") return { ...state, [action.field]: action.value, invalid: false };
  if (action.type === "select") {
    const result = selectEditorLayer(projectEditorLayers(state.session), state.selection, action.ref);
    if (!result.accepted) return { ...state, message: "This layer is unavailable.", invalid: true };
    return { ...state, selection: result.selection, ...fields(state.session, result.selection),
      message: action.ref === state.session.transaction.draft.rootRef ? "The root is read-only." : "Layer selected.", invalid: false };
  }
  if (action.type === "apply") {
    const proposal = createEditorSetSpanIntent(state.session, state.selection, state.session.draftRevision,
      { columnSpan: Number(state.columns), rowSpan: Number(state.rows) });
    if (!proposal.accepted) return { ...state, invalid: true,
      message: `Enter whole numbers: ${sizeHelp(state)}. The composition is unchanged.` };
    const result = applyEditorStructuralEditIntent(state.session, state.selection, proposal.intent, state.entry.registry);
    if (!result.accepted) return { ...state, invalid: true,
      message: `This size is not allowed. Use ${sizeHelp(state)}. The composition is unchanged.` };
    return { ...state, session: result.session, invalid: false,
      message: result.changed ? "Size updated. Save or discard your changes." : "The size is already applied." };
  }
  const result = action.type === "save"
    ? acceptEditorDraft(state.session, state.session.draftRevision, state.entry.registry)
    : discardEditorDraft(state.session, state.session.draftRevision, state.entry.registry);
  if (!result.accepted) return { ...state, invalid: true,
    message: "The changes could not be accepted. Your composition is unchanged." };
  return { ...state, session: result.session, ...fields(result.session, state.selection), invalid: false,
    message: action.type === "save"
      ? (result.changed ? "Changes saved for this session." : "No changes to save.")
      : (result.changed ? "Changes discarded." : "No changes to discard.") };
}

export function StationEditorWorkbench({ initialCompositionRef = DEFAULT_COMPOSITION_REF }: { initialCompositionRef?: string }) {
  const [state, dispatch] = useReducer(reducer, initialCompositionRef, initialState);
  const catalogSelect = useRef<HTMLSelectElement>(null);
  if (!state) return <section aria-label="Composition editor"><p role="alert">Composition unavailable.</p></section>;
  return <ActiveWorkbench key={state.entry.compositionRef} state={state} dispatch={dispatch} catalogSelect={catalogSelect} />;
}
function ActiveWorkbench({ state, dispatch, catalogSelect }: { state: State; dispatch: (action: Action) => void;
  catalogSelect: React.RefObject<HTMLSelectElement | null> }) {
  const [expanded, setExpanded] = useState(() => new Set([state.session.transaction.draft.rootRef]));
  const [focusedRef, setFocusedRef] = useState(state.session.transaction.draft.rootRef);
  const items = useRef(new Map<string, HTMLButtonElement>());
  const fileInput = useRef<HTMLInputElement>(null);
  const workbench = useRef<HTMLElement>(null);
  const returnFocus = useRef<"file" | "saved">("file");
  const readSequence = useRef(0);
  const latestState = useRef(state); latestState.current = state;
  const feedback = (message: string, invalid: boolean, expectedSession = state.session) =>
    dispatch({ type: "feedback", message, invalid, expectedSession });
  const operation = () => ({ artifactId: `urn:uuid:${crypto.randomUUID()}`, createdAt: new Date().toISOString() });
  const saveLocal = () => {
    try {
      const prepared = prepareEditorArtifact(state.entry.compositionRef, state.session.transaction.draft, state.document, operation());
      if (!prepared.accepted) { feedback("Unable to prepare this composition. Your session is unchanged.", true); return; }
      const saved = saveStoredArtifact(window.localStorage, prepared.document, state.savedText, resolveEditorCatalogEntry);
      if (!saved.accepted) { feedback(saved.reason === "storage-conflict"
        ? "A saved artifact already exists or changed. Open saved before replacing it. Your draft is unchanged."
        : "Local storage is unavailable or full. Your draft and prior saved artifact are unchanged.", true); return; }
      dispatch({ type: "saved-artifact", document: saved.document, savedText: saved.storedText, expectedSession: state.session });
    } catch { feedback("Local storage is unavailable. Your draft is unchanged.", true); }
  };
  const openSaved = () => {
    readSequence.current++; returnFocus.current = "saved";
    try {
      const result = openStoredArtifact(window.localStorage, state.entry.compositionRef, resolveEditorCatalogEntry);
      if (!result.accepted) { feedback(result.reason === "not-found" ? "No composition has been saved locally."
        : "Unable to open the saved artifact. Your session is unchanged.", true); return; }
      dispatch({ type: "request-open", document: result.document, savedText: result.storedText, expectedSession: state.session });
    } catch { feedback("Local storage is unavailable. Your session is unchanged.", true); }
  };
  const saveFile = () => {
    try {
      const prepared = prepareEditorArtifact(state.entry.compositionRef, state.session.transaction.draft, state.document, operation(), true);
      if (!prepared.accepted) { feedback("Unable to prepare this composition file. Your session is unchanged.", true); return; }
      requestArtifactDownload(prepared.text, state.entry.compositionRef);
      feedback("Download requested. Keep the file to reopen it; your draft remains unchanged.", false);
    } catch { feedback("Unable to request the download. Your draft is unchanged.", true); }
  };
  const openFile = async (file: File) => {
    const sequence = ++readSequence.current; const expected = state;
    returnFocus.current = "file";
    const result = await readEditorArtifact(file);
    if (sequence !== readSequence.current || latestState.current !== expected) {
      feedback("File opening was superseded by a newer interaction. Your session is unchanged.", false, latestState.current.session); return;
    }
    if (!result.accepted) { feedback("Unable to open this composition file. Your session is unchanged.", true, expected.session); return; }
    dispatch({ type: "request-open", document: result.document, savedText: null, expectedSession: expected.session });
  };
  const layers = projectEditorLayers(state.session);
  const inspector = projectEditorInspector(state.session, state.selection, state.session.draftRevision);
  const preview = projectEditorPreview(state.session, state.entry.registry, state.selection);
  const selected = inspector.accepted && inspector.snapshot.kind === "node" ? inspector.snapshot : null;
  const editable = selected?.editable === true;
  const visible: { node: EditorLayer; level: number; position: number; siblings: number }[] = [];
  const walk = (node: EditorLayer, level: number, position: number, siblings: number) => {
    visible.push({ node, level, position, siblings });
    if (expanded.has(node.nodeRef)) node.children.forEach((child, index) =>
      walk(child, level + 1, index + 1, node.children.length));
  };
  if (layers.accepted) walk(layers.root, 1, 1, 1);
  const focusable = visible.some(item => item.node.nodeRef === focusedRef)
    ? focusedRef : state.session.transaction.draft.rootRef;
  const focus = (ref: string) => { setFocusedRef(ref); items.current.get(ref)?.focus(); };
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const node = visible[index]?.node;
    if (!node) return;
    let target: string | undefined;
    if (event.key === "ArrowDown") target = visible[index + 1]?.node.nodeRef;
    else if (event.key === "ArrowUp") target = visible[index - 1]?.node.nodeRef;
    else if (event.key === "Home") target = visible[0]?.node.nodeRef;
    else if (event.key === "End") target = visible[visible.length - 1]?.node.nodeRef;
    else if (event.key === "ArrowRight" && node.children.length > 0) {
      if (!expanded.has(node.nodeRef)) setExpanded(previous => new Set([...previous, node.nodeRef]));
      else target = node.children[0]?.nodeRef;
    } else if (event.key === "ArrowLeft") {
      if (node.children.length && expanded.has(node.nodeRef))
        setExpanded(previous => { const next = new Set(previous); next.delete(node.nodeRef); return next; });
      else if (node.parentRef !== null) target = node.parentRef;
    } else return;
    event.preventDefault();
    if (target) focus(target);
  };

  const byPreviewRef = new Map(preview.accepted ? preview.snapshot.nodes.map(node => [node.nodeRef, node] as const) : []);
  const renderPreview = (layer: EditorLayer): ReactNode => {
    const node = byPreviewRef.get(layer.nodeRef);
    if (!node) return null;
    const layout = state.entry.registry.get(node.componentRef)?.layout;
    const children = layer.children.map(child => renderPreview(child));
    const container = layout === "grid" ? "grid grid-cols-12 auto-rows-[3rem] gap-2" :
      layout === "row" ? "flex flex-wrap gap-2" : "flex flex-col gap-2";
    if (node.kind === "root") return <div data-root-ref={node.nodeRef} className={container}>{children}</div>;
    const parent = byPreviewRef.get(node.parentRef);
    const parentLayout = parent && state.entry.registry.get(parent.componentRef)?.layout;
    return <div key={node.nodeRef} role="img" aria-label={(state.entry.labels[node.nodeRef] ?? node.nodeRef) + " preview"}
      data-node-ref={node.nodeRef} data-parent-ref={node.parentRef} data-slot-ref={node.slotRef}
      data-column-span={node.columnSpan} data-row-span={node.rowSpan}
      data-selected={node.selected ? "true" : "false"}
      style={parentLayout === "grid" ? { gridColumn: `span ${node.columnSpan}`, gridRow: `span ${node.rowSpan}` } :
        parentLayout === "row" ? { flexBasis: `${node.columnSpan / 12 * 100}%` } : undefined}
      className={"flex min-h-12 min-w-0 items-center justify-center overflow-hidden rounded-md border px-2 text-sm " +
        (node.selected ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "bg-card")}>
      {state.entry.labels[node.nodeRef] ?? node.nodeRef}{children.length ? <div className={container}>{children}</div> : null}
    </div>;
  };
  return <section ref={workbench} aria-label="Composition editor" data-draft-revision={state.session.draftRevision}
    data-base-revision={state.session.base.revision} className="overflow-hidden rounded-xl border bg-card shadow-sm">
    <header className="flex flex-wrap items-center gap-3 border-b p-4">
      <div className="mr-auto"><label htmlFor="editor-composition" className="mb-1 block text-sm">Composition</label>
        <select id="editor-composition" ref={catalogSelect} value={state.entry.compositionRef}
          disabled={state.pendingArtifact !== null}
          onChange={event => dispatch({ type: "request-switch", ref: event.target.value })}
          className="rounded-md border bg-background p-2">{listEditorCatalog().map(item =>
            <option key={item.compositionRef} value={item.compositionRef}>{item.title}</option>)}</select></div>
      <span data-testid="draft-state" className="text-sm text-muted-foreground">
        {state.session.transaction.dirty ? "Unsaved changes" : "All changes saved"}
      </span>
      <Button aria-disabled={!state.session.transaction.dirty} onClick={() => dispatch({ type: "save" })}>Save changes</Button>
      <Button variant="outline" aria-disabled={!state.session.transaction.dirty} onClick={() => dispatch({ type: "discard" })}>Discard changes</Button>
      <Button variant="outline" onClick={saveLocal} disabled={state.pendingArtifact !== null}>Save locally</Button>
      <Button variant="outline" data-artifact-open="saved" onClick={openSaved} disabled={state.pendingArtifact !== null}>Open saved</Button>
      <Button variant="outline" onClick={saveFile}>Save As file</Button>
      <Button variant="outline" data-artifact-open="file" onClick={() => fileInput.current?.click()} disabled={state.pendingArtifact !== null}>Open file</Button>
      <input ref={fileInput} type="file" accept=".composition.json,.json,application/json" aria-label="Composition file" className="sr-only"
        onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void openFile(file); }} />
    </header>
    {state.pendingArtifact ? <div className="flex flex-wrap items-center gap-3 border-b p-4" role="group" aria-label="Unsaved artifact open">
      <p>Unsaved changes. Discard them and open this composition artifact?</p>
      <Button variant="outline" onClick={() => { dispatch({ type: "cancel-open" });
        workbench.current?.querySelector<HTMLButtonElement>(`[data-artifact-open="${returnFocus.current}"]`)?.focus(); }}>Cancel open</Button>
      <Button onClick={() => dispatch({ type: "confirm-open" })}>Discard changes and open file</Button>
    </div> : null}
    {state.pendingRef ? <div className="flex flex-wrap items-center gap-3 border-b p-4" role="group" aria-label="Unsaved composition switch">
      <p>Unsaved changes. Discard them and open the selected composition?</p>
      <Button variant="outline" onClick={() => { dispatch({ type: "cancel-switch" }); catalogSelect.current?.focus(); }}>Cancel switch</Button>
      <Button onClick={() => dispatch({ type: "confirm-switch" })}>Discard changes and open</Button>
    </div> : null}
    <div className="grid min-h-[28rem] lg:grid-cols-[14rem_minmax(0,1fr)_18rem]">
      <section aria-labelledby="layers-heading" className="border-b p-4 lg:border-b-0 lg:border-r">
        <h2 id="layers-heading" className="mb-3 font-semibold">Layers</h2>
        <p className="mb-3 text-xs text-muted-foreground">Use arrows to move focus, Enter to select.</p>
        <div role="tree" aria-label="Composition layers" className="space-y-1">
          {visible.map(({ node, level, position, siblings }, index) => <button key={node.nodeRef} type="button" role="treeitem"
            aria-level={level} aria-posinset={position} aria-setsize={siblings}
            aria-selected={state.selection.selectedRef === node.nodeRef}
            aria-expanded={node.children.length ? expanded.has(node.nodeRef) : undefined}
            tabIndex={focusable === node.nodeRef ? 0 : -1}
            ref={element => { if (element) items.current.set(node.nodeRef, element); else items.current.delete(node.nodeRef); }}
            onFocus={() => setFocusedRef(node.nodeRef)}
            onClick={() => dispatch({ type: "select", ref: node.nodeRef })}
            onKeyDown={event => navigate(event, index)}
            className={"block w-full rounded-md border border-transparent py-2 text-left text-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-selected:bg-accent " + (level === 1 ? "px-2" : "pl-6 pr-2")}>
            {state.entry.labels[node.nodeRef] ?? node.nodeRef}
          </button>)}
        </div>
      </section>
      <section aria-labelledby="preview-heading" className="min-w-0 border-b p-5 lg:border-b-0">
        <h2 id="preview-heading" className="mb-4 font-semibold">Preview</h2>
        {preview.accepted ? <div className="rounded-lg border bg-muted/30 p-3" aria-label="Composition preview">
          {layers.accepted ? renderPreview(layers.root) : null}
        </div> : <p role="alert">Preview unavailable. Your composition has been preserved.</p>}
      </section>
      <section aria-labelledby="inspector-heading" className="p-4 lg:border-l">
        <h2 id="inspector-heading" className="mb-3 font-semibold">Inspector</h2>
        {selected ? <p className="mb-3 text-sm">{state.entry.labels[selected.nodeRef] ?? selected.nodeRef}</p> :
          <p className="mb-3 text-sm text-muted-foreground">Select a layer to inspect it.</p>}
        {selected && !editable ? <p className="mb-3 text-sm text-muted-foreground">The root is read-only.</p> : null}
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
          <p id="span-help" className="text-xs text-muted-foreground">Whole numbers: {sizeHelp(state)}.</p>
          <Button type="submit" variant="outline" disabled={!editable}>Apply size</Button>
        </form>
      </section>
    </div>
    <footer className="border-t p-4">
      <p id="editor-feedback" role="status" aria-live="polite" aria-atomic="true" className="text-sm">{state.message}</p>
      <p className="mt-2 text-xs text-muted-foreground">Save changes accepts this session. Save locally retains a separate copy in this browser; use Open saved after reload.</p>
      <p className="text-xs text-muted-foreground">Save As file requests a portable download. Browser storage can be cleared; keep exported files for retention.</p>
    </footer>
  </section>;
}

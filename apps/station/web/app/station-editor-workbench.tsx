"use client";

import { useEffect, useReducer, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Button } from "../../../../packages/ui-core/index";
import { DEFAULT_COMPOSITION_REF, initializeCatalogEditorSession, listEditorCatalog, resolveEditorCatalogEntry, type EditorCatalogEntry } from "./station-editor-catalog";
import { prepareEditorArtifact, readEditorArtifact, requestArtifactDownload, sameEditorArtifactGraph } from "./station-editor-files";
import type { EditorLayer } from "../../../../packages/station-editor/index";
import {
  projectEditorLayers, selectEditorLayer,
  projectEditorInspector, projectEditorPreview, createEditorSetSpanIntent,
  applyEditorHistoryStructure, repairEditorSelection, applyEditorHistoryEdit, createEditorHistory, moveEditorHistory, acceptEditorDraft, discardEditorDraft,
  initializeEditorSession, openStoredArtifact, saveStoredArtifact,
  type EditorSession, type EditorHistory, type LayersSelection, type CompositionArtifact,
} from "../../../../packages/station-editor/index";

type State = Readonly<{
  entry: EditorCatalogEntry; history: EditorHistory; selection: LayersSelection;
  pendingRef: string | null;
  columns: string; rows: string; message: string; invalid: boolean;
  document: CompositionArtifact | null; savedText: string | null;
  pendingArtifact: Readonly<{ document: CompositionArtifact; savedText: string | null }> | null;
}>;
type Action =
  | { type: "structure"; operation: "add-node" | "remove-subtree" | "reorder-node"; componentRef?: string; parentRef?: string; slotRef?: string; direction?: "before" | "after" }
  | { type: "select"; ref: string }
  | { type: "field"; field: "columns" | "rows"; value: string }
  | { type: "apply" | "save" | "discard" | "undo" | "redo" }
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
  return { entry: result.entry, history: createEditorHistory(result.session), selection: { selectedRef: null },
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
  return { ...state, entry, history: createEditorHistory(result.session), selection, ...fields(result.session, selection),
    document: candidate.document, savedText: candidate.savedText, pendingRef: null, pendingArtifact: null,
    invalid: false, message: "Composition opened. Edit it or save a new version." };
}
function sizeHelp(state: State): string {
  const node = state.history.session.transaction.draft.nodes.find(item => item.ref === state.selection.selectedRef);
  const bounds = node && state.entry.registry.get(node.componentRef)?.constraints;
  return bounds ? `${bounds.minColumns}–${bounds.maxColumns} columns and ${bounds.minRows}–${bounds.maxRows} ${bounds.maxRows === 1 ? "row" : "rows"}` : "1–4 columns and 1–2 rows";
}
function historyBlocked(state: State): boolean {
  const applied = fields(state.history.session, state.selection);
  return state.pendingArtifact !== null || state.pendingRef !== null ||
    state.columns !== applied.columns || state.rows !== applied.rows;
}
function repaired(state: State, session: EditorSession, preferred = state.selection.selectedRef) {
  const selection = { selectedRef: repairEditorSelection(state.history.session.transaction.draft, session.transaction.draft, preferred) };
  return { selection, ...fields(session, selection) };
}
function componentName(ref: string): string {
  return ref.replace(/^component:/, "").replace(/^lab-/, "").split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
function layerName(state: State, ref: string): string {
  if (Object.hasOwn(state.entry.labels, ref)) return state.entry.labels[ref]!;
  const node = state.history.session.transaction.draft.nodes.find(item => item.ref === ref);
  const suffix = /^node:added-(\d+)$/.exec(ref)?.[1];
  return node ? componentName(node.componentRef) + " " + (suffix ?? (state.history.session.transaction.draft.nodes.indexOf(node) + 1)) : "Component";
}
function reducer(state: State | null, action: Action): State | null {
  if (!state) return null;
  if (action.type === "feedback") return action.expectedSession === state.history.session
    ? { ...state, message: action.message, invalid: action.invalid } : state;
  if (action.type === "request-open") {
    if (action.expectedSession !== state.history.session) return state;
    const candidate = { document: action.document, savedText: action.savedText };
    const currentFields = fields(state.history.session, state.selection);
    return state.history.session.transaction.dirty || state.columns !== currentFields.columns || state.rows !== currentFields.rows ||
      !sameEditorArtifactGraph(state.history.session.transaction.draft, state.document?.payload.graph ?? state.entry.composition)
      ? { ...state, pendingArtifact: candidate, pendingRef: null }
      : replaceArtifact(state, candidate);
  }
  if (action.type === "cancel-open") return { ...state, pendingArtifact: null };
  if (action.type === "confirm-open") return state.pendingArtifact ? replaceArtifact(state, state.pendingArtifact) : state;
  if (action.type === "saved-artifact") {
    if (action.expectedSession !== state.history.session) return state;
    const result = acceptEditorDraft(state.history.session, state.history.session.draftRevision, state.entry.registry);
    if (!result.accepted) return { ...state, invalid: true, message: "File retained locally, but this session could not be accepted." };
    return { ...state, history: createEditorHistory(result.session), document: action.document, savedText: action.savedText,
      ...fields(result.session, state.selection), invalid: false, message: "Composition saved locally in this browser." };
  }
  if (action.type === "request-switch") {
    if (action.ref === state.entry.compositionRef) return state;
    if (state.history.session.transaction.dirty) return { ...state, pendingRef: action.ref };
    return initialState(action.ref) ?? { ...state, invalid: true, message: "Composition unavailable. Your session is unchanged." };
  }
  if (action.type === "cancel-switch") return { ...state, pendingRef: null };
  if (action.type === "confirm-switch") {
    if (!state.pendingRef) return state;
    const discarded = discardEditorDraft(state.history.session, state.history.session.draftRevision, state.entry.registry);
    if (!discarded.accepted) return { ...state, invalid: true, message: "Unable to switch. Your session is unchanged." };
    return initialState(state.pendingRef) ?? { ...state, pendingRef: null, invalid: true,
      message: "Composition unavailable. Your session is unchanged." };
  }
  if (action.type === "field") return { ...state, [action.field]: action.value, invalid: false };
  if (action.type === "select") {
    const result = selectEditorLayer(projectEditorLayers(state.history.session), state.selection, action.ref);
    if (!result.accepted) return { ...state, message: "This layer is unavailable.", invalid: true };
    return { ...state, selection: result.selection, ...fields(state.history.session, result.selection),
      message: action.ref === state.history.session.transaction.draft.rootRef ? "The root is read-only." : "Layer selected.", invalid: false };
  }
  if (action.type === "structure") {
    if (historyBlocked(state)) return { ...state, invalid: false, message: "Apply or restore the Inspector fields and finish the pending open before changing structure." };
    const graph = state.history.session.transaction.draft;
    let sequence = 3;
    for (const node of graph.nodes) {
      const value = /^node:added-(\d+)$/.exec(node.ref)?.[1];
      if (value) sequence = Math.max(sequence, Number(value) + 1);
    }
    const common = { sessionRef: state.history.session.sessionRef, compositionRef: state.entry.compositionRef,
      expectedDraftRevision: state.history.session.draftRevision };
    const nodeRef = state.selection.selectedRef ?? graph.rootRef;
    const intent = action.operation === "add-node"
      ? { ...common, type: "add-node" as const, nodeRef: `node:added-${sequence}`, componentRef: action.componentRef ?? "",
        parentRef: action.parentRef ?? "", slotRef: action.slotRef ?? "" }
      : action.operation === "remove-subtree" ? { ...common, type: "remove-subtree" as const, nodeRef }
      : { ...common, type: "reorder-node" as const, nodeRef, direction: action.direction ?? "before" };
    const result = applyEditorHistoryStructure(state.history, intent, state.entry.registry);
    if (!result.accepted) return { ...state, invalid: true, message: "This component cannot be placed here. Check the container and slot. Your composition is unchanged." };
    return { ...state, history: result.history,
      ...repaired(state, result.history.session, action.operation === "add-node" ? intent.nodeRef : state.selection.selectedRef),
      invalid: false, message: result.changed ? "Composition updated. Save or discard your changes." : "The component is already at this position." };
  }
  if (action.type === "undo" || action.type === "redo") {
    if (historyBlocked(state)) return { ...state, invalid: false,
      message: "Apply or restore the Inspector fields and finish the pending open before undo or redo." };
    const result = moveEditorHistory(state.history, action.type, state.history.session.draftRevision, state.entry.registry);
    if (!result.accepted) return { ...state, invalid: true, message: "Unable to change history. Your composition is unchanged." };
    return { ...state, history: result.history, ...repaired(state, result.history.session), invalid: false,
      message: result.changed ? (action.type === "undo" ? "Size change undone." : "Size change redone.") : "No size changes to " + action.type + "." };
  }
  if (action.type === "apply") {
    const proposal = createEditorSetSpanIntent(state.history.session, state.selection, state.history.session.draftRevision,
      { columnSpan: Number(state.columns), rowSpan: Number(state.rows) });
    if (!proposal.accepted) return { ...state, invalid: true,
      message: `Enter whole numbers: ${sizeHelp(state)}. The composition is unchanged.` };
    const result = applyEditorHistoryEdit(state.history, state.selection, proposal.intent, state.entry.registry);
    if (!result.accepted) return { ...state, invalid: true,
      message: `This size is not allowed. Use ${sizeHelp(state)}. The composition is unchanged.` };
    return { ...state, history: result.history, invalid: false,
      message: result.changed ? "Size updated. Save or discard your changes." : "The size is already applied." };
  }
  const result = action.type === "save"
    ? acceptEditorDraft(state.history.session, state.history.session.draftRevision, state.entry.registry)
    : discardEditorDraft(state.history.session, state.history.session.draftRevision, state.entry.registry);
  if (!result.accepted) return { ...state, invalid: true,
    message: "The changes could not be accepted. Your composition is unchanged." };
  return { ...state, history: createEditorHistory(result.session), ...repaired(state, result.session), invalid: false,
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
  const [expanded, setExpanded] = useState(() => new Set([state.history.session.transaction.draft.rootRef]));
  const [paletteRef, setPaletteRef] = useState(() => state.entry.registry.list()[0]?.id ?? "");
  const [parentRef, setParentRef] = useState(state.history.session.transaction.draft.rootRef);
  const [slotRef, setSlotRef] = useState("");
  const [focusedRef, setFocusedRef] = useState(state.history.session.transaction.draft.rootRef);
  const items = useRef(new Map<string, HTMLButtonElement>());
  const fileInput = useRef<HTMLInputElement>(null);
  const workbench = useRef<HTMLElement>(null);
  const returnFocus = useRef<"file" | "saved">("file");
  const restoreOpenFocus = useRef(false);
  useEffect(() => {
    if (state.pendingArtifact === null && restoreOpenFocus.current) {
      restoreOpenFocus.current = false;
      workbench.current?.querySelector<HTMLButtonElement>(`[data-artifact-open="${returnFocus.current}"]`)?.focus();
    }
  }, [state.pendingArtifact]);
  const readSequence = useRef(0);
  const latestState = useRef(state); latestState.current = state;
  const feedback = (message: string, invalid: boolean, expectedSession = state.history.session) =>
    dispatch({ type: "feedback", message, invalid, expectedSession });
  const operation = () => ({ artifactId: `urn:uuid:${crypto.randomUUID()}`, createdAt: new Date().toISOString() });
  const saveLocal = () => {
    try {
      const prepared = prepareEditorArtifact(state.entry.compositionRef, state.history.session.transaction.draft, state.document, operation());
      if (!prepared.accepted) { feedback("Unable to prepare this composition. Your session is unchanged.", true); return; }
      const saved = saveStoredArtifact(window.localStorage, prepared.document, state.savedText, resolveEditorCatalogEntry);
      if (!saved.accepted) { feedback(saved.reason === "storage-conflict"
        ? "A saved artifact already exists or changed. Open saved before replacing it. Your draft is unchanged."
        : "Local storage is unavailable or full. Your draft and prior saved artifact are unchanged.", true); return; }
      dispatch({ type: "saved-artifact", document: saved.document, savedText: saved.storedText, expectedSession: state.history.session });
    } catch { feedback("Local storage is unavailable. Your draft is unchanged.", true); }
  };
  const openSaved = () => {
    readSequence.current++; returnFocus.current = "saved";
    try {
      const result = openStoredArtifact(window.localStorage, state.entry.compositionRef, resolveEditorCatalogEntry);
      if (!result.accepted) { feedback(result.reason === "not-found" ? "No composition has been saved locally."
        : "Unable to open the saved artifact. Your session is unchanged.", true); return; }
      dispatch({ type: "request-open", document: result.document, savedText: result.storedText, expectedSession: state.history.session });
    } catch { feedback("Local storage is unavailable. Your session is unchanged.", true); }
  };
  const saveFile = () => {
    try {
      const prepared = prepareEditorArtifact(state.entry.compositionRef, state.history.session.transaction.draft, state.document, operation(), true);
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
      feedback("File opening was superseded by a newer interaction. Your session is unchanged.", false, latestState.current.history.session); return;
    }
    if (!result.accepted) { feedback("Unable to open this composition file. Your session is unchanged.", true, expected.history.session); return; }
    dispatch({ type: "request-open", document: result.document, savedText: null, expectedSession: expected.history.session });
  };
  const layers = projectEditorLayers(state.history.session);
  const inspector = projectEditorInspector(state.history.session, state.selection, state.history.session.draftRevision);
  const preview = projectEditorPreview(state.history.session, state.entry.registry, state.selection);
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
    ? focusedRef : state.history.session.transaction.draft.rootRef;
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
    return <div key={node.nodeRef} role={children.length ? "group" : "img"} aria-label={layerName(state, node.nodeRef) + " preview"}
      data-node-ref={node.nodeRef} data-parent-ref={node.parentRef} data-slot-ref={node.slotRef}
      data-column-span={node.columnSpan} data-row-span={node.rowSpan}
      data-selected={node.selected ? "true" : "false"}
      style={parentLayout === "grid" ? { gridColumn: `span ${node.columnSpan}`, gridRow: `span ${node.rowSpan}` } :
        parentLayout === "row" ? { flexBasis: `${node.columnSpan / 12 * 100}%` } : undefined}
      className={"flex min-h-12 min-w-0 flex-col items-center justify-center overflow-hidden rounded-md border px-2 text-sm " +
        (node.selected ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "bg-card")}>
      {layerName(state, node.nodeRef)}{children.length ? <div className={container + " w-full"}>{children}</div> : null}
    </div>;
  };
  const blocked = historyBlocked(state);
  const graph = state.history.session.transaction.draft;
  const parents = graph.nodes.filter(node => state.entry.registry.get(node.componentRef)?.slots.some(slot => slot.childPolicy !== "none"));
  const activeParent = parents.find(node => node.ref === parentRef) ?? parents[0];
  const slots = activeParent ? state.entry.registry.get(activeParent.componentRef)?.slots.filter(slot => slot.childPolicy !== "none") ?? [] : [];
  const activeSlot = slots.find(slot => slot.id === slotRef)?.id ?? slots[0]?.id ?? "";
  const selectedNode = graph.nodes.find(node => node.ref === state.selection.selectedRef);
  const siblings = selectedNode?.placement ? graph.nodes.filter(node => node.placement?.parentRef === selectedNode.placement!.parentRef &&
    node.placement?.slotRef === selectedNode.placement!.slotRef) : [];
  const siblingIndex = siblings.findIndex(node => node.ref === selectedNode?.ref);
  const canRemove = !blocked && !!selectedNode?.placement;
  const canUndo = !blocked && state.history.past.length > 0;
  const canRedo = !blocked && state.history.future.length > 0;
  const historyShortcut = (event: KeyboardEvent<HTMLElement>) => {
    const target = event.target;
    if (event.defaultPrevented || event.repeat || event.altKey || event.nativeEvent.isComposing ||
      !(event.ctrlKey || event.metaKey) || !(target instanceof HTMLElement) ||
      target.isContentEditable || target.closest("input,textarea,select")) return;
    const key = event.key.toLowerCase();
    const direction = key === "z" ? (event.shiftKey ? "redo" : "undo") :
      key === "y" && event.ctrlKey && !event.metaKey && !event.shiftKey ? "redo" : null;
    if (!direction) return;
    event.preventDefault(); dispatch({ type: direction });
  };
  return <section ref={workbench} onKeyDown={historyShortcut} aria-label="Composition editor" data-draft-revision={state.history.session.draftRevision}
    data-base-revision={state.history.session.base.revision} className="overflow-hidden rounded-xl border bg-card shadow-sm">
    <header className="flex flex-wrap items-center gap-3 border-b p-4">
      <div className="mr-auto"><label htmlFor="editor-composition" className="mb-1 block text-sm">Composition</label>
        <select id="editor-composition" ref={catalogSelect} value={state.entry.compositionRef}
          disabled={state.pendingArtifact !== null}
          onChange={event => dispatch({ type: "request-switch", ref: event.target.value })}
          className="rounded-md border bg-background p-2">{listEditorCatalog().map(item =>
            <option key={item.compositionRef} value={item.compositionRef}>{item.title}</option>)}</select></div>
      <span data-testid="draft-state" className="text-sm text-muted-foreground">
        {state.history.session.transaction.dirty ? "Unsaved changes" : "All changes saved"}
      </span>
      <Button variant="outline" aria-disabled={!canUndo} aria-keyshortcuts="Control+z Meta+z"
        onClick={() => dispatch({ type: "undo" })}>Undo</Button>
      <Button variant="outline" aria-disabled={!canRedo} aria-keyshortcuts="Control+Shift+z Meta+Shift+z Control+y"
        onClick={() => dispatch({ type: "redo" })}>Redo</Button>
      <Button aria-disabled={!state.history.session.transaction.dirty} onClick={() => dispatch({ type: "save" })}>Save changes</Button>
      <Button variant="outline" aria-disabled={!state.history.session.transaction.dirty} onClick={() => dispatch({ type: "discard" })}>Discard changes</Button>
      <Button variant="outline" onClick={saveLocal} disabled={state.pendingArtifact !== null}>Save locally</Button>
      <Button variant="outline" data-artifact-open="saved" onClick={openSaved} disabled={state.pendingArtifact !== null}>Open saved</Button>
      <Button variant="outline" onClick={saveFile}>Save As file</Button>
      <Button variant="outline" data-artifact-open="file" onClick={() => fileInput.current?.click()} disabled={state.pendingArtifact !== null}>Open file</Button>
      <input ref={fileInput} type="file" accept=".composition.json,.json,application/json" aria-label="Composition file" className="sr-only"
        onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void openFile(file); }} />
    </header>
    {state.pendingArtifact ? <div className="flex flex-wrap items-center gap-3 border-b p-4" role="group" aria-label="Unsaved artifact open">
      <p>Unsaved changes. Discard them and open this composition artifact?</p>
      <Button variant="outline" onClick={() => { restoreOpenFocus.current = true; dispatch({ type: "cancel-open" }); }}>Cancel open</Button>
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
            {layerName(state, node.nodeRef)}
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
        {selected ? <p className="mb-3 text-sm">{layerName(state, selected.nodeRef)}</p> :
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
        <div role="group" aria-label="Composition structure" className="mt-5 space-y-3 border-t pt-4">
          <h3 className="font-semibold">Build composition</h3>
          <div><label htmlFor="editor-component" className="mb-1 block text-sm">Component to add</label>
            <select id="editor-component" value={paletteRef} disabled={blocked} onChange={event => setPaletteRef(event.target.value)}
              className="w-full rounded-md border bg-background p-2">
              {state.entry.registry.list().map(component => <option key={component.id} value={component.id}>{componentName(component.id)}</option>)}
            </select></div>
          <div><label htmlFor="editor-parent" className="mb-1 block text-sm">Container</label>
            <select id="editor-parent" value={activeParent?.ref ?? ""} disabled={blocked} onChange={event => { setParentRef(event.target.value); setSlotRef(""); }}
              className="w-full rounded-md border bg-background p-2">
              {parents.map(node => <option key={node.ref} value={node.ref}>{layerName(state, node.ref)}</option>)}
            </select></div>
          <div><label htmlFor="editor-slot" className="mb-1 block text-sm">Slot</label>
            <select id="editor-slot" value={activeSlot} disabled={blocked} onChange={event => setSlotRef(event.target.value)}
              className="w-full rounded-md border bg-background p-2">
              {slots.map(slot => <option key={slot.id} value={slot.id}>{slot.id === "content" ? "Content" : slot.id.replace("button-", "Button ")}</option>)}
            </select></div>
          <Button variant="outline" disabled={blocked || !activeParent || !activeSlot || !paletteRef}
            onClick={() => { if (activeParent) setExpanded(previous => new Set([...previous, activeParent.ref]));
              dispatch({ type: "structure", operation: "add-node", componentRef: paletteRef, parentRef: activeParent?.ref ?? "", slotRef: activeSlot }); }}>Add component</Button>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={!canRemove} onClick={() => dispatch({ type: "structure", operation: "remove-subtree" })}>Remove subtree</Button>
            <Button variant="outline" disabled={blocked || siblingIndex <= 0} onClick={() => dispatch({ type: "structure", operation: "reorder-node", direction: "before" })}>Move earlier</Button>
            <Button variant="outline" disabled={blocked || siblingIndex < 0 || siblingIndex >= siblings.length - 1}
              onClick={() => dispatch({ type: "structure", operation: "reorder-node", direction: "after" })}>Move later</Button>
          </div>
          <p className="text-xs text-muted-foreground">Remove subtree removes the selected component and its children. Undo restores them. Move changes order within the same container and slot.</p>
        </div>
      </section>
    </div>
    <footer className="border-t p-4">
      <p id="editor-feedback" role="status" aria-live="polite" aria-atomic="true" className="text-sm">{state.message}</p>
      <p className="mt-2 text-xs text-muted-foreground">Undo/Redo keeps up to 50 applied size or structure edits in this session. Saving, discarding or opening a composition clears history.</p>
      <p className="text-xs text-muted-foreground">Save changes accepts this session. Save locally retains a separate copy in this browser; use Open saved after reload.</p>
      <p className="text-xs text-muted-foreground">Save As file requests a portable download. Browser storage can be cleared; keep exported files for retention.</p>
    </footer>
  </section>;
}

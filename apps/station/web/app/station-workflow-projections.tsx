"use client";
import { useState } from "react";
import { Button, Input, PropertyInspector } from "@system-builder/ui-core";
import { createCollectionIndex, selectedItem, selectKnownRef, type SelectionState } from "@system-builder/station-interaction";
import { workflowSelectionKey, type WorkflowSession, type WorkflowCommand, type WorkflowTransition } from "@system-builder/station-workflow-authoring";
type WorkflowItem = Readonly<{ kind: "state" | "transition"; id: string }>;
export function workflowItems(session: WorkflowSession, processId: string) {
  const p = session.document.payload.processes.find(p => p.id === processId);
  return createCollectionIndex<WorkflowItem>(p ? [
    ...p.states.map(id => ({ ref: workflowSelectionKey(session.document, p.id, "state", id), payload: { kind: "state" as const, id } })),
    ...(p.transitions ?? []).map(t => ({ ref: workflowSelectionKey(session.document, p.id, "transition", t.id), payload: { kind: "transition" as const, id: t.id } })),
  ] : []);
}
interface ProjectionProps { readonly session: WorkflowSession; readonly processId: string; readonly selection: SelectionState; readonly onSelect: (state: SelectionState) => void; readonly onCommand: (command: WorkflowCommand) => boolean; readonly blocked: boolean; readonly onFormChange: () => void }
function TransitionEditor({ transition, states, actions, blocked, onApply, onFormChange }: { transition: WorkflowTransition; states: readonly string[]; actions: readonly string[]; blocked: boolean; onApply: (t: WorkflowTransition) => boolean; onFormChange: () => void }) {
  const [draft, setDraft] = useState<{ base: WorkflowTransition; from: string; to: string; actionRef: string } | null>(null);
  const values = draft?.base === transition ? draft : { from: transition.from, to: transition.to, actionRef: transition.actionRef ?? "" };
  const update = (key: "from" | "to" | "actionRef", value: string) => { onFormChange(); setDraft({ base: transition, ...values, [key]: value }); };
  return <div className="space-y-3">
    <label className="block text-sm">Transition source<select aria-label="Transition source" className="mt-1 w-full rounded-md border p-2" value={values.from} onChange={e => update("from", e.target.value)} disabled={blocked}>{states.map(id => <option key={id}>{id}</option>)}</select></label>
    <label className="block text-sm">Transition target<select aria-label="Transition target" className="mt-1 w-full rounded-md border p-2" value={values.to} onChange={e => update("to", e.target.value)} disabled={blocked}>{states.map(id => <option key={id}>{id}</option>)}</select></label>
    <label className="block text-sm">Transition action<select aria-label="Transition action" className="mt-1 w-full rounded-md border p-2" value={values.actionRef} onChange={e => update("actionRef", e.target.value)} disabled={blocked}><option value="">No action</option>{actions.map(id => <option key={id}>{id}</option>)}</select></label>
    <Button disabled={blocked} onClick={() => { if (onApply({ id: transition.id, from: values.from, to: values.to, ...(values.actionRef ? { actionRef: values.actionRef } : {}) })) setDraft(null); }}>Apply transition</Button>
  </div>;
}
export function StationWorkflowProjections({ session, processId, selection, onSelect, onCommand, blocked, onFormChange }: ProjectionProps) {
  const [view, setView] = useState<"diagram" | "table">("diagram");
  const [stateId, setStateId] = useState("");
  const [transitionId, setTransitionId] = useState("");
  const p = session.document.payload.processes.find(p => p.id === processId);
  const collection = workflowItems(session, processId); const selected = selectedItem(collection, selection);
  const transition = p?.transitions?.find(t => selected?.payload.kind === "transition" && t.id === selected.payload.id);
  const choose = (ref: string) => { const r = selectKnownRef(collection, selection, ref); if (r.ok && !blocked) onSelect(r.state); };
  if (!p) return <p>Select a process.</p>;
  return <section aria-label="Workflow Tools" data-selected-ref={selected?.ref ?? ""} className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.2fr)]">
    <section aria-label="Workflow Explorer" className="min-w-0 space-y-3 rounded-lg border p-3">
      <h2 className="font-semibold">Explorer</h2>
      <ul className="space-y-1">{collection.items.map(item => <li key={item.ref}><Button className="h-auto w-full justify-start whitespace-normal break-all text-left" variant="ghost" disabled={blocked} aria-pressed={selection.selectedRef === item.ref} onClick={() => choose(item.ref)} aria-label={`Select ${item.payload.kind} ${item.payload.id}`}>{item.payload.kind === "state" ? "State" : "Transition"}: {item.payload.id}</Button></li>)}</ul>
      <label className="block text-sm">New state id<Input value={stateId} onChange={e => { onFormChange(); setStateId(e.target.value); }} disabled={blocked} /></label>
      <Button disabled={blocked} onClick={() => { if (onCommand({ kind: "add-state", processId, state: stateId })) setStateId(""); }}>Add state</Button>
      <label className="block text-sm">New transition id<Input value={transitionId} onChange={e => { onFormChange(); setTransitionId(e.target.value); }} disabled={blocked} /></label>
      <Button disabled={blocked || !p.initialState} onClick={() => { if (onCommand({ kind: "add-transition", processId, transition: { id: transitionId, from: p.initialState!, to: p.initialState! } })) setTransitionId(""); }}>Add transition</Button>
    </section>
    <section aria-label="Workflow visualization" className="min-w-0 space-y-3 rounded-lg border p-3">
      <div className="flex flex-wrap gap-2"><h2 className="mr-auto font-semibold">{p.name}</h2><Button variant="outline" aria-pressed={view === "diagram"} onClick={() => setView("diagram")}>Workflow diagram</Button><Button variant="outline" aria-pressed={view === "table"} onClick={() => setView("table")}>Workflow table</Button></div>
      {view === "diagram" ? <div aria-label="Workflow state diagram" className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">{p.states.map(id => <Button key={id} className="h-auto min-h-16 whitespace-normal break-all rounded-xl" variant="outline" aria-pressed={selected?.payload.kind === "state" && selected.payload.id === id} aria-label={`Inspect state ${id}`} disabled={blocked} onClick={() => choose(workflowSelectionKey(session.document, processId, "state", id))}>{id}{p.initialState === id ? " · Initial" : ""}</Button>)}</div>
        <ul className="space-y-2">{(p.transitions ?? []).map(t => <li key={t.id}><Button className="h-auto w-full whitespace-normal break-all" variant="outline" aria-label={`Inspect transition ${t.id}`} aria-pressed={selected?.payload.kind === "transition" && selected.payload.id === t.id} disabled={blocked} onClick={() => choose(workflowSelectionKey(session.document, processId, "transition", t.id))}>{t.from} → {t.to} · {t.id}</Button></li>)}</ul>
        <p className="text-xs text-muted-foreground">Deterministic state grid and transition connections. Layout does not change workflow meaning.</p>
      </div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Workflow transitions</caption><thead><tr><th scope="col">Transition</th><th scope="col">From</th><th scope="col">To</th><th scope="col">Action</th></tr></thead><tbody>{(p.transitions ?? []).map(t => <tr key={t.id}><td><Button variant="ghost" disabled={blocked} onClick={() => choose(workflowSelectionKey(session.document, processId, "transition", t.id))} aria-label={`Inspect transition ${t.id}`}>{t.id}</Button></td><td className="break-all">{t.from}</td><td className="break-all">{t.to}</td><td className="break-all">{t.actionRef ?? "None"}</td></tr>)}</tbody></table></div>}
    </section>
    <section aria-label="Workflow Inspector" data-item-ref={selected?.ref ?? ""} className="min-w-0 space-y-3 rounded-lg border p-3">
      <h2 className="font-semibold">Inspector</h2>
      <PropertyInspector aria-label="Workflow selection properties" groups={selected ? [{ id: "selected", label: "Selected element", rows: [{ id: "id", label: "Identity", value: <span className="break-all">{selected.payload.id}</span> }, { id: "kind", label: "Kind", value: selected.payload.kind }, { id: "revision", label: "Draft revision", value: session.revision }] }] : []} empty="Select a state or transition." />
      {selected?.payload.kind === "state" ? <div className="flex flex-wrap gap-2"><Button disabled={blocked} onClick={() => onCommand({ kind: "set-initial", processId, state: selected.payload.id })}>Set initial state</Button><Button variant="outline" disabled={blocked} onClick={() => onCommand({ kind: "remove-state", processId, state: selected.payload.id })}>Remove state</Button></div> : null}
      {transition ? <><TransitionEditor key={selected!.ref} transition={transition} states={p.states} actions={session.document.payload.actions.map(a => a.id)} blocked={blocked} onFormChange={onFormChange} onApply={t => onCommand({ kind: "edit-transition", processId, transition: t })} /><Button variant="outline" disabled={blocked} onClick={() => onCommand({ kind: "remove-transition", processId, transitionId: transition.id })}>Remove transition</Button></> : null}
    </section>
  </section>;
}

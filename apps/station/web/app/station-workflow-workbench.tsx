"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input } from "@system-builder/ui-core";
import { emptySelection, type SelectionState } from "@system-builder/station-interaction";
import { applyWorkflowCommand, isWorkflowProcessEditable, compareWorkflows, createWorkflow, encodeWorkflow, materializeWorkflow, openWorkflow, type WorkflowCommand, type WorkflowDocument, type WorkflowSession } from "@system-builder/station-workflow-authoring";
import { StationWorkflowProjections, workflowItems } from "./station-workflow-projections";
import { loadWorkflowCandidates, readWorkflowFile, saveWorkflowCandidates, type WorkflowStoreResult } from "./station-workflow-store";
import { StationWorkflowConnectionPanel } from "./station-workflow-connection-panel";
const initialFields = { name: "", processId: "", analysisRef: "", recipeRef: "", requirementRef: "", state: "open" };
const nextPatch = (version: string) => { const [major, minor, patch] = version.split(/[+-]/)[0]!.split("."); return `${major}.${minor}.${BigInt(patch!) + 1n}`; };
export function StationWorkflowWorkbench() {
  const [session, setSession] = useState<WorkflowSession | null>(null);
  const [processId, setProcessId] = useState("");
  const [selection, setSelection] = useState<SelectionState>(emptySelection);
  const [fields, setFields] = useState(initialFields);
  const [formDirty, setFormDirty] = useState(false);
  const [formGeneration, setFormGeneration] = useState(0);
  const [pending, setPending] = useState<WorkflowDocument | null>(null);
  const [storage, setStorage] = useState<WorkflowStoreResult>({ accepted: false, reason: "storage-unavailable" });
  const [retained, setRetained] = useState(""); const [comparison, setComparison] = useState("");
  const [version, setVersion] = useState("");
  const [message, setMessage] = useState("Create a technical workflow or import a complete definition.");
  const input = useRef<HTMLInputElement>(null), sequence = useRef(0);
  const refresh = useCallback(() => {
    sequence.current++;
    try { const result = loadWorkflowCandidates(window.localStorage); setStorage(result); setRetained(""); setComparison(""); setMessage(result.accepted ? "Candidate storage refreshed. Opening is explicit." : "Candidate storage unavailable or invalid. Draft preserved."); }
    catch { setStorage({ accepted: false, reason: "storage-unavailable" }); setMessage("Candidate storage unavailable. Draft preserved."); }
  }, []);
  useEffect(() => { refresh(); return () => { sequence.current++; }; }, [refresh]);
  const resetForms = () => { setFields(initialFields); setFormDirty(false); setFormGeneration(n => n + 1); };
  const install = (document: WorkflowDocument) => {
    const r = openWorkflow(document); if (!r.accepted) { setMessage(`Cannot open: ${r.reason}. Draft preserved.`); return; }
    sequence.current++; setSession(r.session); setProcessId(document.payload.processes.find(isWorkflowProcessEditable)?.id ?? ""); setSelection(emptySelection()); setPending(null); resetForms(); setVersion(nextPatch(document.artifactVersion)); setMessage("Local candidate opened. Upstream references remain unresolved.");
  };
  const requestInstall = (document: WorkflowDocument) => { sequence.current++; if (session && (session.dirty || formDirty)) { setPending(document); setMessage("Confirm replacement or Cancel to preserve the draft and pending fields."); } else install(document); };
  const command = (c: WorkflowCommand): boolean => {
    sequence.current++;
    if (!session || pending) return false;
    const r = applyWorkflowCommand(session, session.revision, c);
    if (!r.accepted) { setMessage(`Change rejected: ${r.reason}. Draft and history unchanged.`); return false; }
    setSession(r.session); setFormDirty(false);
    if (c.kind === "add-process") { setProcessId(c.process.id); setSelection(emptySelection()); setFields(initialFields); }
    else if (selection.selectedRef && !workflowItems(r.session, processId).byRef.has(selection.selectedRef)) setSelection(emptySelection());
    setMessage(r.changed ? "Workflow change applied locally." : "No workflow change. Revision unchanged."); return true;
  };
  const create = () => {
    sequence.current++;
    const r = createWorkflow({ artifactId: "urn:uuid:" + crypto.randomUUID(), createdAt: new Date().toISOString(), analysisRef: fields.analysisRef, recipeRef: fields.recipeRef,
      process: { id: fields.processId, name: fields.name, requirementRefs: [fields.requirementRef], states: [fields.state], initialState: fields.state } });
    if (!r.accepted) { setMessage(`Creation rejected: ${r.reason}. Draft preserved.`); return; } requestInstall(r.document);
  };
  const importFile = async (file: File) => {
    const request = ++sequence.current; const result = await readWorkflowFile(file);
    if (sequence.current !== request) return;
    if (!result.accepted) { setMessage(`Unable to import workflow: ${result.reason}. Draft preserved.`); return; } requestInstall(result.document);
  };
  const save = () => {
    sequence.current++;
    if (!session || !storage.accepted || pending || formDirty) return;
    const r = materializeWorkflow(session, session.revision, version, new Date().toISOString());
    if (!r.accepted) { setMessage(`Candidate rejected: ${r.reason}. Draft preserved.`); return; }
    try {
      const saved = saveWorkflowCandidates(window.localStorage, [session.base, r.document], storage.storedText);
      if (!saved.accepted) { setStorage(saved); setMessage(`Unable to save workflow: ${saved.reason}. Draft and retained revisions preserved. Refresh storage before deliberate retry.`); return; }
      setStorage(saved); setRetained(String(saved.documents.length - 1)); setComparison(String(saved.documents.findIndex(d => d.artifactId === session.base.artifactId && d.artifactVersion === session.base.artifactVersion)));
      install(r.document); setMessage("New workflow revision saved locally. Previous revisions retained; no publication or execution.");
    } catch { setStorage({ accepted: false, reason: "storage-unavailable" }); setMessage("Unable to save workflow. Draft preserved."); }
  };
  const download = () => {
    sequence.current++; if (!session || pending || formDirty) return;
    if (session.dirty) { setMessage("Save a new candidate revision before exporting changed meaning."); return; }
    const r = encodeWorkflow(session.document); if (!r.accepted) return;
    const url = URL.createObjectURL(new Blob([r.text], { type: "application/json" })), link = window.document.createElement("a");
    try { link.href = url; link.download = "definition.workflow.json"; link.hidden = true; window.document.body.append(link); link.click(); setMessage("Portable workflow download requested."); }
    finally { link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  };
  const field = (key: keyof typeof initialFields, value: string) => { sequence.current++; setFields(current => ({ ...current, [key]: value })); if (session) setFormDirty(true); };
  const documents = storage.accepted ? storage.documents : [];
  const compared = session && comparison !== "" && documents[Number(comparison)] ? compareWorkflows(documents[Number(comparison)]!, session.document) : session ? compareWorkflows(session.base, session.document) : null;
  return <section aria-label="Workflow Studio" className="min-w-0 space-y-4 overflow-hidden rounded-xl border bg-background p-4" data-draft-revision={session?.revision ?? ""} data-artifact-version={session?.document.artifactVersion ?? ""}>
    <header className="flex flex-wrap items-center gap-2"><h1 className="mr-auto text-lg font-semibold">Workflow Studio</h1><Button variant="outline" onClick={refresh}>Refresh workflow storage</Button><Button variant="outline" disabled={!!pending} onClick={() => input.current?.click()}>Import workflow</Button>
      <input ref={input} className="sr-only" type="file" aria-label="Import workflow file" accept=".workflow.json,application/json" onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void importFile(file); }} />
    </header>
    <p className="text-sm text-muted-foreground">Technical SystemDefinition candidate · Local and unpublished · Owner connection is explicit below · Upstream references unresolved</p>
    <details className="rounded-lg border p-3"><summary className="cursor-pointer font-medium">Create workflow or add process</summary>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{([ ["name", "Process name"], ["processId", "Process id"], ["analysisRef", "Analysis reference"], ["recipeRef", "Recipe reference"], ["requirementRef", "Requirement reference"], ["state", "First state id"] ] as const).map(([key, label]) => <label key={key} className="block text-sm">{label}<Input value={fields[key]} onChange={e => field(key, e.target.value)} disabled={!!pending} /></label>)}</div>
      <div className="mt-3 flex flex-wrap gap-2"><Button disabled={!!pending} onClick={create}>Create workflow</Button>{session ? <Button variant="outline" disabled={!!pending} onClick={() => command({ kind: "add-process", process: { id: fields.processId, name: fields.name, requirementRefs: [fields.requirementRef], states: [fields.state], initialState: fields.state } })}>Add process</Button> : null}</div>
    </details>
    <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"><label className="block min-w-0 text-sm">Retained workflow revision<select aria-label="Retained workflow revision" className="mt-1 w-full rounded-md border p-2" value={retained} onChange={e => { sequence.current++; setRetained(e.target.value); }}><option value="">Choose a revision</option>{documents.map((d, i) => <option key={i} value={i}>{d.artifactId} · v{d.artifactVersion}</option>)}</select></label><Button variant="outline" disabled={retained === "" || !!pending} onClick={() => { const d = documents[Number(retained)]; if (d) requestInstall(d); }}>Open workflow revision</Button></div>
    {pending ? <div role="dialog" aria-label="Replace workflow draft" className="space-y-3 rounded-lg border p-3"><p>Discard the current draft and pending fields?</p><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { sequence.current++; setPending(null); setMessage("Replacement cancelled. Workflow draft and fields preserved."); }}>Cancel workflow replacement</Button><Button onClick={() => install(pending)}>Discard workflow and open</Button></div></div> : null}
    {session ? <>
      <div className="flex flex-wrap items-center gap-2"><span data-testid="workflow-draft-state" className="mr-auto text-sm">{session.dirty ? "Unsaved workflow changes" : "Clean local candidate"} · Draft revision {session.revision} · Artifact v{session.document.artifactVersion}</span><Button variant="outline" disabled={!session.past.length || !!pending || formDirty} onClick={() => command({ kind: "undo" })}>Undo workflow</Button><Button variant="outline" disabled={!session.future.length || !!pending || formDirty} onClick={() => command({ kind: "redo" })}>Redo workflow</Button><Button variant="outline" disabled={!!pending} onClick={() => { sequence.current++; resetForms(); setMessage("Pending workflow fields reset. Applied draft preserved."); }}>Reset pending fields</Button></div>
      <label className="block text-sm">Workflow process<select aria-label="Workflow process" className="mt-1 w-full rounded-md border p-2" value={processId} disabled={!!pending || formDirty} onChange={e => { sequence.current++; setProcessId(e.target.value); setSelection(emptySelection()); setFormGeneration(n => n + 1); }}>{session.document.payload.processes.map(p => <option key={p.id} value={p.id} disabled={!isWorkflowProcessEditable(p)}>{p.name} · {p.id}{!isWorkflowProcessEditable(p) ? " · Read-only: edit limit" : ""}</option>)}</select></label>
      <StationWorkflowProjections key={`${processId}:${formGeneration}`} session={session} processId={processId} selection={selection} blocked={!!pending} onFormChange={() => { sequence.current++; setFormDirty(true); }} onSelect={next => { sequence.current++; if (formDirty) { setMessage("Apply or reset pending fields before changing selection."); return; } setSelection(next); }} onCommand={command} />
      <div className="flex flex-wrap items-end gap-2"><label className="block text-sm">New workflow version<Input value={version} onChange={e => { sequence.current++; setVersion(e.target.value); }} disabled={!!pending} /></label><Button disabled={!storage.accepted || !!pending || formDirty} onClick={save}>Save new workflow revision</Button><Button variant="outline" disabled={!!pending || formDirty} onClick={download}>Export workflow</Button><Button variant="outline" disabled={!!pending || formDirty} onClick={() => { sequence.current++; const r = encodeWorkflow(session.document); setMessage(r.accepted ? "Local schema and workflow rules valid. Upstream references unresolved; not release validation." : `Validation rejected: ${r.reason}. Draft preserved.`); }}>Validate workflow</Button></div>
      <section aria-label="Workflow revision comparison" className="space-y-2 rounded-lg border p-3"><h2 className="font-semibold">Revision comparison</h2><label className="block text-sm">Compare with revision<select aria-label="Compare with revision" className="mt-1 w-full rounded-md border p-2" value={comparison} onChange={e => setComparison(e.target.value)}><option value="">Current draft base</option>{documents.map((d, i) => <option key={i} value={i}>{d.artifactId} · v{d.artifactVersion}</option>)}</select></label><p className="break-all text-sm">v{compared?.baseVersion} → v{compared?.candidateVersion} · {compared?.processesChanged ? "Workflow changed" : "Workflow unchanged"}</p></section>
      <details className="rounded-lg border p-3"><summary>Complete definition snapshot</summary><pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-all text-xs">{JSON.stringify(session.document, null, 2)}</pre></details>
    </> : <p className="text-sm">No workflow is open. Retained revisions are opened explicitly.</p>}
    <StationWorkflowConnectionPanel document={session?.document ?? null} submitBlocked={!!pending || formDirty || !!session?.dirty} replacementBlocked={!!pending} getGeneration={() => sequence.current} onOpen={requestInstall} />
    <p role="status" className="break-words text-sm">{message}</p>
  </section>;
}

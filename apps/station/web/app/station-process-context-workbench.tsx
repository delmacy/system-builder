"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input } from "../../../../packages/ui-core/index";
import { createProcessContext, encodeProcessContext, type ProcessContextDocument, type ProcessContextView, type CompositionReference } from "../../../../packages/station-process-context/index";
import { normalizeProcessRevisionIdentity } from "@system-builder/contracts/process-versioning";
import { loadProcessContext, saveProcessContext, readProcessContextFile, resolveContextComposition } from "./station-process-context-store";
import { loadArtifactWorkspace, workspaceDocument, type ArtifactWorkspace } from "./station-artifact-workspace";
import { StationEditorWorkbench, type EditorArtifactOpenRequest } from "./station-editor-workbench";
import { createProjectionState, refreshProjectionState, selectProjectionItem, switchProjection, type ProjectionState } from "../../../../packages/station-model-projections/index";
import { StationContextProjections } from "./station-context-projections";
const resolveReference=(reference:CompositionReference)=>{try{return resolveContextComposition(window.localStorage,reference);}catch{return {status:"unavailable" as const};}};
const emptyFields = { title: "", process: "", revision: "", number: "1", previous: "" };
export function StationProcessContextWorkbench({ onOpen }: { onOpen: (text: string) => void }) {
  const [projection, setProjection] = useState<ProjectionState | null>(null);
  const document = projection?.document ?? null;
  const [dirty, setDirty] = useState(false);
  const [expected, setExpected] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [workspace, setWorkspace] = useState<{ data: ArtifactWorkspace; text: string | null } | null>(null);
  const [fields, setFields] = useState(emptyFields);
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, setPending] = useState<{ document: ProcessContextDocument; retained: boolean } | null>(null);
  const [message, setMessage] = useState("Choose a retained context or create explicit references.");
  const sequence = useRef(0), input = useRef<HTMLInputElement>(null);
  const refreshStorage = useCallback(() => {
    sequence.current++;
    try {
      const result = loadProcessContext(window.localStorage);
      if (!result.accepted) { setStorageReady(false); setMessage("Context storage unavailable or invalid. Visible context is preserved."); return; }
      setExpected(result.storedText); setStorageReady(true); setMessage("Context storage refreshed. Opening remains explicit.");
    } catch { setStorageReady(false); setMessage("Context storage unavailable. Visible context is preserved."); }
  }, []);
  const refreshWorkspace = useCallback(() => {
    sequence.current++;
    try {
      const result = loadArtifactWorkspace(window.localStorage);
      if (!result.accepted) { setWorkspace(null); setMessage("Workspace unavailable or invalid. Context is preserved."); return; }
      setWorkspace({ data: result.workspace, text: result.storedText }); setSelected([]);
      setMessage("Composition choices refreshed.");
    } catch { setWorkspace(null); setMessage("Workspace unavailable. Context is preserved."); }
  }, []);
  useEffect(() => { refreshStorage(); refreshWorkspace(); return () => { sequence.current++; }; }, [refreshStorage, refreshWorkspace]);
  const refreshReferences = () => {
    if (!projection) return;
    const result=refreshProjectionState(projection,projection.document,resolveReference);
    if(result.accepted)setProjection(result.state);
  };
  const formPending = selected.length > 0 || Object.keys(fields).some(key => fields[key as keyof typeof fields] !== emptyFields[key as keyof typeof fields]);
  const install = (next: ProcessContextDocument, retained = false) => {
    const result=createProjectionState(next,resolveReference);
    if(!result.accepted){setMessage("Invalid context. Current context preserved.");return;}
    sequence.current++; setProjection(result.state); setDirty(!retained); setFields(emptyFields); setSelected([]); setPending(null); setMessage(retained ? "Retained context opened." : "Context opened. Save locally or export a portable copy.");
  };
  const requestInstall = (next: ProcessContextDocument, retained = false) => {
    if (dirty || formPending) { setPending({ document: next, retained }); setMessage("Confirm replacement or Cancel to preserve the current context and form."); }
    else install(next, retained);
  };
  const create = () => {
    sequence.current++;
    try {
      if (!workspace) return;
      const current = loadArtifactWorkspace(window.localStorage);
      if (!current.accepted || current.storedText !== workspace.text) { setWorkspace(null); setMessage("Workspace changed. Refresh composition choices before creating."); return; }
      if (!/^[1-9][0-9]*$/.test(fields.number)) { setMessage("Invalid process revision. Context unchanged."); return; }
      const processRevision = normalizeProcessRevisionIdentity({ contractVersion: "1.0.0", artifactRef: fields.process, revisionRef: fields.revision, revisionNumber: Number(fields.number), previousRevisionRef: fields.previous || null });
      const views: ProcessContextView[] = selected.map(ref => {
        const file = current.workspace.files.find(f => f.ref === ref); const doc = file && workspaceDocument(file);
        if (!file || !doc) throw Error("missing");
        return { ref: "view:" + ref, title: file.name, composition: { artifactType: "urn:system-builder:station:composition", artifactId: doc.artifactId, artifactVersion: doc.artifactVersion } };
      });
      const result = createProcessContext(processRevision, fields.title, views, { artifactId: "urn:uuid:" + crypto.randomUUID(), createdAt: new Date().toISOString() });
      if (!result.accepted) { setMessage("Invalid context or reference limit. Context unchanged."); return; }
      if (dirty) { setPending({ document: result.document, retained: false }); setMessage("Confirm replacement or Cancel to preserve the current context and form."); }
      else install(result.document);
    } catch { setMessage("Invalid process revision or composition reference. Context unchanged."); }
  };
  const importFile = async (file: File) => {
    const request = ++sequence.current;
    const result = await readProcessContextFile(file);
    if (request !== sequence.current) return;
    if (!result.accepted) { setMessage("Unable to import context. Use a valid .process.json file; current context is unchanged."); return; }
    requestInstall(result.document);
  };
  const openSaved = () => {
    sequence.current++;
    try {
      const result = loadProcessContext(window.localStorage);
      if (!result.accepted) { setStorageReady(false); setMessage("Context storage unavailable or invalid. Visible context is preserved."); return; }
      setExpected(result.storedText); setStorageReady(true);
      if (!result.document) { setMessage("No retained context. Current context unchanged."); return; }
      requestInstall(result.document, true);
    } catch { setStorageReady(false); setMessage("Context storage unavailable. Visible context is preserved."); }
  };
  const save = () => {
    sequence.current++;
    if (!document || !storageReady || pending || formPending) return;
    try {
      const result = saveProcessContext(window.localStorage, document, expected);
      if (!result.accepted) {
        setStorageReady(false); setMessage(result.reason === "storage-conflict" ? "Context storage changed. Refresh context storage, review and deliberately retry." : "Unable to save context. Current context and stored bytes are preserved."); return;
      }
      setExpected(result.storedText); setDirty(false); setMessage("Context saved locally. Process and compositions unchanged.");
    } catch { setStorageReady(false); setMessage("Unable to save context. Current context is preserved."); }
  };
  const download = () => {
    if (!document || pending || formPending) return;
    const result = encodeProcessContext(document); if (!result.accepted) return;
    const url = URL.createObjectURL(new Blob([result.text], { type: "application/json" })); const link = window.document.createElement("a");
    try { link.href = url; link.download = "context.process.json"; link.hidden = true; window.document.body.append(link); link.click(); setMessage("Portable download requested. Keep referenced compositions separately."); }
    finally { link.remove(); setTimeout(() => URL.revokeObjectURL(url),1000); }
  };
  const openView = (view: ProcessContextView) => {
    sequence.current++;
    if(!projection||pending)return;
    const item=projection.items.find(candidate=>candidate.viewRef===view.ref);
    if(!item)return;
    const selectedResult=selectProjectionItem(projection,item.ref);
    if(!selectedResult.accepted)return;
    const refreshed=refreshProjectionState(selectedResult.state,projection.document,resolveReference);
    if(refreshed.accepted)setProjection(refreshed.state);
    try {
      const result=resolveContextComposition(window.localStorage,view.composition);
      if(result.status!=="available"){setMessage("Reference is "+result.status+". Editor unchanged.");return;}
      onOpen(result.text);setMessage("Open requested. Finish any pending confirmation in the editor.");
    } catch {setMessage("Reference unavailable. Editor unchanged.");}
  };
  const selectReference=(ref:string)=>{
    sequence.current++;if(!projection||pending)return;
    const result=selectProjectionItem(projection,ref);if(result.accepted)setProjection(result.state);
  };
  const chooseProjection=(id:string)=>{
    sequence.current++;if(!projection||pending)return;
    const result=switchProjection(projection,id);if(result.accepted)setProjection(result.state);
  };
  const openSelected=()=>{
    const item=projection?.items.find(candidate=>candidate.ref===projection.selectedRef);
    const view=document?.payload.views.find(candidate=>candidate.ref===item?.viewRef);
    if(view)openView(view);
  };
  const field = (key: keyof typeof fields, value: string) => { sequence.current++; setFields(current => ({ ...current, [key]: value })); };
  return <section aria-label="Process context" className="min-w-0 space-y-4 overflow-hidden rounded-xl border bg-background p-4">
    <header className="flex flex-wrap items-center gap-2"><h1 className="mr-auto text-lg font-semibold">Process Context</h1>
      <Button variant="outline" onClick={refreshStorage}>Refresh context storage</Button>
      <Button variant="outline" onClick={openSaved}>Open retained context</Button>
      <Button variant="outline" disabled={!!pending} onClick={() => input.current?.click()}>Import context</Button>
      <input ref={input} type="file" accept=".process.json,application/json" aria-label="Import process context file" className="sr-only" onChange={event => { const file = event.target.files?.[0]; event.target.value=""; if(file) void importFile(file); }} />
    </header>
    <p className="text-sm text-muted-foreground">Process references and visual layouts stay separate. A recorded revision is not business validation.</p>
    <details className="rounded-lg border p-3"><summary className="cursor-pointer font-medium">Create context from references</summary>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Context title<Input value={fields.title} onChange={e=>field("title",e.target.value)} /></label>
        <label className="text-sm">Process identity<Input value={fields.process} onChange={e=>field("process",e.target.value)} /></label>
        <label className="text-sm">Process revision identity<Input value={fields.revision} onChange={e=>field("revision",e.target.value)} /></label>
        <label className="text-sm">Process revision number<Input value={fields.number} onChange={e=>field("number",e.target.value)} inputMode="numeric" /></label>
        <label className="text-sm">Previous process revision<Input value={fields.previous} onChange={e=>field("previous",e.target.value)} /></label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2"><Button variant="outline" onClick={refreshWorkspace}>Refresh composition choices</Button><Button disabled={!workspace || !!pending} onClick={create}>Create context</Button></div>
      <fieldset className="mt-3 space-y-2"><legend className="text-sm font-medium">Composition references</legend>
        {workspace?.data.files.map(file => { const doc = workspaceDocument(file); return doc ? <label key={file.ref} className="flex items-start gap-2 break-all text-sm"><input type="checkbox" checked={selected.includes(file.ref)} onChange={e=>{sequence.current++;setSelected(current=>e.target.checked?[...current,file.ref]:current.filter(ref=>ref!==file.ref));}} />{file.name} (v{doc.artifactVersion})</label> : null; })}
        {workspace?.data.files.length === 0 ? <p className="text-sm text-muted-foreground">Save or import a composition in File Manager first.</p> : null}
      </fieldset>
    </details>
    {pending ? <div role="dialog" aria-label="Replace process context" className="space-y-3 rounded-lg border p-3"><p>Replace the current context and discard pending form changes?</p>
      <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={()=>{sequence.current++;setPending(null);setMessage("Replacement cancelled. Context and form preserved.");}}>Cancel context replacement</Button><Button onClick={()=>install(pending.document, pending.retained)}>Discard context and open</Button></div>
    </div> : null}
    {document ? <section aria-label="Opened process references" className="space-y-3">
      <div className="flex flex-wrap items-center gap-2"><h2 className="mr-auto break-all font-semibold">{document.payload.title}</h2><span className="text-sm">{dirty ? "Context not retained" : "Context retained locally"}</span>
        <Button variant="outline" disabled={!storageReady||!!pending||formPending} onClick={save}>Save context locally</Button><Button variant="outline" disabled={!!pending||formPending} onClick={download}>Export context</Button>
        <Button variant="outline" onClick={()=>{sequence.current++;refreshReferences();setMessage("Reference statuses refreshed.");}}>Refresh references</Button>
      </div>
      <dl className="grid gap-2 break-all text-sm sm:grid-cols-2"><div><dt>Process identity</dt><dd>{document.payload.processRevision.artifactRef}</dd></div><div><dt>Process revision</dt><dd>{document.payload.processRevision.revisionRef} · {document.payload.processRevision.revisionNumber}</dd></div><div><dt>Context identity</dt><dd>{document.artifactId}</dd></div></dl>
      <p data-testid="process-owner-status" className="text-sm">Process owner: {projection?.items[0]?.status??"unavailable"}. Semantic rules are not loaded or edited here.</p>
      {projection ? <StationContextProjections state={projection} blocked={!!pending} onSelect={selectReference} onProjection={chooseProjection} onOpen={openSelected} /> : null}
      <ul className="space-y-2">{document.payload.views.map(view => <li key={view.ref} aria-label={view.title} className="rounded-lg border p-3"><div className="flex flex-wrap items-center gap-2"><span className="mr-auto break-all font-medium">{view.title}</span><span data-testid="context-reference-status">{projection?.items.find(item=>item.viewRef===view.ref)?.status ?? "unavailable"}</span>
        <Button variant="outline" disabled={!!pending||projection?.items.find(item=>item.viewRef===view.ref)?.status!=="available"} onClick={()=>openView(view)}>Open referenced composition</Button></div><p className="mt-2 break-all text-xs text-muted-foreground">{view.composition.artifactId} · v{view.composition.artifactVersion}</p></li>)}</ul>
    </section> : <p className="text-sm">No process context is open.</p>}
    <p role="status" className="break-words text-sm">{message}</p>
  </section>;
}
export function StationProcessContextStandalone() {
  const [request,setRequest]=useState<EditorArtifactOpenRequest|null>(null);
  const [opened,setOpened]=useState(false); const next=useRef(0);
  const consumed=useCallback((id:number)=>setRequest(current=>current?.id===id?null:current),[]);
  return <div className="mx-auto max-w-7xl space-y-4"><StationProcessContextWorkbench onOpen={text=>{setOpened(true);setRequest({id:++next.current,text});}} />
    {opened ? <StationEditorWorkbench artifactRequest={request} onArtifactRequestConsumed={consumed} /> : null}</div>;
}

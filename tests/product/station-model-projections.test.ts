import assert from "node:assert/strict";
import test from "node:test";
import { createProcessContext, encodeProcessContext, decodeProcessContext,  } from "../../packages/station-process-context/index.js";
import { normalizeProcessRevisionIdentity } from "../../packages/contracts/process-versioning/index.js";
import { loadProcessContext, saveProcessContext, resolveContextComposition, PROCESS_CONTEXT_KEY } from "../../apps/station/web/app/station-process-context-store.js";
import { initializeCatalogEditorSession } from "../../apps/station/web/app/station-editor-catalog.js";
import { prepareEditorArtifact } from "../../apps/station/web/app/station-editor-files.js";
import { mutateArtifactWorkspace, WORKSPACE_KEY, WORKSPACE_ROOT } from "../../apps/station/web/app/station-artifact-workspace.js";
import { appendWorkspaceRevision } from "../../apps/station/web/app/station-workspace-revisions.js";
import { createEditorHistory, applyEditorHistoryStructure, type ArtifactStore } from "../../packages/station-editor/index.js";
const createdAt = "2026-10-11T18:00:00Z";
const anchor = normalizeProcessRevisionIdentity({ contractVersion: "1.0.0", artifactRef: "process:orders", revisionRef: "revision:orders-1", revisionNumber: 1, previousRevisionRef: null });
function setup() {
  const values = new Map<string, string>(); let writes = 0;
  const store: ArtifactStore = { getItem: k => values.get(k) ?? null, setItem: (k,v) => { writes++; values.set(k,v); } };
  const initial = initializeCatalogEditorSession("composition:example", "session:wp13");
  assert.ok(initial.accepted); if (!initial.accepted) throw Error("initial");
  const first = prepareEditorArtifact(initial.entry.compositionRef, initial.entry.composition, null, { artifactId: "urn:uuid:wp13-composition", createdAt });
  assert.ok(first.accepted); if (!first.accepted) throw Error("first");
  const saved = mutateArtifactWorkspace(store, null, { type: "append-file", ref: "file:one", folderRef: WORKSPACE_ROOT, name: "one.composition.json", text: first.text });
  assert.ok(saved.accepted); if (!saved.accepted) throw Error("saved");
  const history = createEditorHistory(initial.session);
  const edited = applyEditorHistoryStructure(history, { type: "set-text", nodeRef: "node:button-1", text: "Process projection", expectedDraftRevision: initial.session.draftRevision, sessionRef: initial.session.sessionRef, compositionRef: initial.entry.compositionRef }, initial.entry.registry);
  assert.ok(edited.accepted); if (!edited.accepted) throw Error("edited");
  const second = prepareEditorArtifact(initial.entry.compositionRef, edited.history.session.transaction.draft, first.document, { artifactId: first.document.artifactId, createdAt });
  assert.ok(second.accepted); if (!second.accepted) throw Error("second");
  const revisions = appendWorkspaceRevision(store, saved.storedText, { baseRef: "file:one", ref: "file:two", name: "two.composition.json", text: second.text });
  assert.ok(revisions.accepted);
  const tuple = { artifactType: "urn:system-builder:station:composition" as const, artifactId: first.document.artifactId, artifactVersion: "1.0.0" };
  const result = createProcessContext(anchor, "Orders", [{ ref: "view:layout", title: "Layout", composition: tuple }], { artifactId: "urn:uuid:context", createdAt });
  assert.ok(result.accepted); if (!result.accepted) throw Error("context");
  return { values, store, first, second, tuple, context: result.document, text: result.text, writes: () => writes };
}

import { createProjectionState, selectProjectionItem, switchProjection, refreshProjectionState, projectionInspector, selectedCompositionReference, validateProjectionDescriptors, INSTALLED_PROJECTIONS, type ProjectionState, type CompositionStatusResolver } from "../../packages/station-model-projections/index.js";
function model(input:unknown,resolver:CompositionStatusResolver=()=>({status:"available"})):ProjectionState{
 const r=createProjectionState(input,resolver);assert.ok(r.accepted);if(!r.accepted)throw Error("unexpected rejected result");return r.state;
}
function selected(s:ProjectionState,index=1){const r=selectProjectionItem(s,s.items[index]!.ref);assert.ok(r.accepted);if(!r.accepted)throw Error("unexpected rejected result");return r.state;}
test("WP14 real editor/revisions -> retained/portable reopen -> selection -> exact historical reference",()=>{
 const m=setup(),before=m.store.getItem(WORKSPACE_KEY);assert.ok(saveProcessContext(m.store,m.context,null).accepted);
 const local=loadProcessContext(m.store);assert.ok(local.accepted);if(!local.accepted||!local.document)throw Error("local");
 const portable=decodeProcessContext(m.text);assert.ok(portable.accepted);if(!portable.accepted)throw Error("portable");
 const s=selected(model(local.document,ref=>resolveContextComposition(m.store,ref)));
 const r=switchProjection(s,"reference-table");assert.ok(r.accepted);if(!r.accepted)throw Error("switch");
 assert.equal(r.state.selectedRef,s.selectedRef);assert.deepEqual(projectionInspector(r.state)?.item.composition,m.tuple);
 assert.deepEqual(resolveContextComposition(m.store,selectedCompositionReference(r.state)!),{status:"available",text:m.first.text,fileRef:"file:one"});
 assert.equal(r.state.canonicalText,m.text);assert.equal(m.store.getItem(WORKSPACE_KEY),before);
 assert.equal(m.store.getItem(PROCESS_CONTEXT_KEY),m.text);assert.deepEqual(portable.document,local.document);
});
test("WP14 duplicate labels/tuples use unique view identities and reject unknown/cross-context selection",()=>{
 const m=setup(),views=["a","b"].map(ref=>({...m.context.payload.views[0]!,composition:{...m.tuple},ref,title:"Same"}));
 const s=selected(model({...m.context,payload:{...m.context.payload,views}}),2);
 assert.notEqual(s.items[1]!.ref,s.items[2]!.ref);assert.equal(projectionInspector(s)?.item.viewRef,"b");
 const other=model({...m.context,artifactId:"urn:uuid:other"});
 assert.equal(selectProjectionItem(s,other.items[1]!.ref).accepted,false);
 assert.deepEqual(selectProjectionItem(s,"unknown"),{accepted:false,reason:"unknown-ref"});
 assert.equal(switchProjection(s,"uninstalled").accepted,false);assert.equal(projectionInspector(s)?.item.ref,s.selectedRef);
});
test("WP14 unresolved refresh keeps selection but removes open affordance for all failure statuses",()=>{
 const m=setup(),s=selected(model(m.context));
 for(const status of ["missing","stale","invalid","unavailable"] as const){
  const r=refreshProjectionState(s,m.context,()=>({status}));assert.ok(r.accepted);if(!r.accepted)throw Error("refresh");
  assert.equal(r.state.selectedRef,s.selectedRef);assert.equal(projectionInspector(r.state)?.item.status,status);
  assert.deepEqual(projectionInspector(r.state)?.capabilities,["inspect"]);assert.equal(selectedCompositionReference(r.state),null);
 }
 const root=selected(model(m.context),0);assert.deepEqual(projectionInspector(root)?.capabilities,["inspect"]);
 assert.equal(root.items[0]!.status,"unavailable");assert.equal(selectedCompositionReference(root),null);
});
test("WP14 replaced identity/revision/anchor/content resets selection, unchanged context preserves it",()=>{
 const m=setup(),s=selected(model(m.context));
 for(const doc of [{...m.context,artifactId:"urn:uuid:new"},{...m.context,artifactVersion:"1.0.1"},
 {...m.context,payload:{...m.context.payload,title:"Changed"}},
 {...m.context,payload:{...m.context.payload,processRevision:{...anchor,revisionRef:"revision:next",revisionNumber:2,previousRevisionRef:anchor.revisionRef}}}]){
 const r=refreshProjectionState(s,doc);assert.ok(r.accepted);if(r.accepted)assert.equal(r.state.selectedRef,null);
 }
 const r=refreshProjectionState(s,JSON.parse(m.text));assert.ok(r.accepted);if(r.accepted)assert.equal(r.state.selectedRef,s.selectedRef);
 assert.equal(refreshProjectionState(s,{}).accepted,false);assert.equal(projectionInspector(s)?.item.ref,s.selectedRef);
});
test("WP14 actual context codec admits 0/16 views and rejects 17; immutable model rejects forged state",()=>{
 const m=setup(),views=Array.from({length:16},(_,i)=>({...m.context.payload.views[0]!,composition:{...m.tuple},ref:"view:"+i}));
 assert.equal(model({...m.context,payload:{...m.context.payload,views:[]}}).items.length,1);
 assert.equal(model({...m.context,payload:{...m.context.payload,views}}).items.length,17);
 assert.equal(createProjectionState({...m.context,payload:{...m.context.payload,views:[...views,{...views[0],ref:"overflow"}]}}).accepted,false);
 const s=selected(model(m.context));assert.ok(Object.isFrozen(s)&&Object.isFrozen(s.items)&&Object.isFrozen(s.items[1]));
 assert.throws(()=>{(s.items[1] as {title:string}).title="changed";});
 assert.equal(selectProjectionItem({...s},"x").accepted,false);assert.equal(projectionInspector({...s}),null);
});
test("WP14 installed descriptor validation rejects duplicates/unknown capabilities/imported renderer/accessors",()=>{
 assert.equal(validateProjectionDescriptors(INSTALLED_PROJECTIONS),true);
 const d=JSON.parse(JSON.stringify(INSTALLED_PROJECTIONS));
 for(const value of [[d[0],d[0]],[{...d[0],id:"unknown"},d[1]],[{...d[0],capabilities:["edit-business"]},d[1]],[{...d[0],render:"https://remote"},d[1]]])
 assert.equal(validateProjectionDescriptors(value),false);
 let reads=0;const hostile={...d[0]};Object.defineProperty(hostile,"id",{enumerable:true,get(){reads++;return "context-outline";}});
 assert.equal(validateProjectionDescriptors([hostile,d[1]]),false);assert.equal(reads,0);
 const m=setup(),doc={...m.context};Object.defineProperty(doc,"payload",{enumerable:true,get(){reads++;return m.context.payload;}});
 assert.equal(createProjectionState(doc).accepted,false);assert.equal(reads,0);
 assert.equal(createProjectionState(JSON.parse('{"__proto__":{}}')).accepted,false);
});
test("WP14 real corrupt workspace and denied resolver block open without changing context bytes",()=>{
 const m=setup(),s=selected(model(m.context,ref=>resolveContextComposition(m.store,ref)));
 m.values.set(WORKSPACE_KEY,"corrupt");const r=refreshProjectionState(s,m.context,ref=>resolveContextComposition(m.store,ref));
 assert.ok(r.accepted);if(r.accepted){assert.equal(r.state.selectedRef,s.selectedRef);assert.equal(projectionInspector(r.state)?.item.status,"invalid");assert.equal(selectedCompositionReference(r.state),null);}
 assert.equal(encodeProcessContext(m.context).accepted,true);assert.equal(s.canonicalText,m.text);
 assert.equal(model(m.context,()=>{throw Error("denied");}).items[1]!.status,"unavailable");
});

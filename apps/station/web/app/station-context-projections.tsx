"use client";
import { Button } from "../../../../packages/ui-core/index";
import { INSTALLED_PROJECTIONS, projectionInspector, type ProjectionItem, type ProjectionState } from "../../../../packages/station-model-projections/index";
export function StationContextProjections({ state, blocked, onSelect, onProjection, onOpen }: {
 state: ProjectionState; blocked: boolean; onSelect:(ref:string)=>void; onProjection:(id:string)=>void; onOpen:()=>void;
}) {
 const inspector=projectionInspector(state), anchor=state.items[0]!;
 const pick=(item:ProjectionItem,prefix:string)=><Button variant={state.selectedRef===item.ref?"secondary":"outline"}
  className="h-auto w-full whitespace-normal break-all text-left" disabled={blocked}
  aria-label={prefix+" "+item.title} aria-pressed={state.selectedRef===item.ref}
  data-item-ref={item.ref} onClick={()=>onSelect(item.ref)}>{item.title}</Button>;
 return <section aria-label="Shared context projections" className="min-w-0 space-y-3" data-selected-ref={state.selectedRef??""}>
  <div className="flex flex-wrap gap-2" role="group" aria-label="Context projection choice">
   {INSTALLED_PROJECTIONS.map(descriptor=><Button key={descriptor.id} variant={state.projectionId===descriptor.id?"secondary":"outline"}
    disabled={blocked} aria-pressed={state.projectionId===descriptor.id} onClick={()=>onProjection(descriptor.id)}>{descriptor.title}</Button>)}
  </div>
  <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]">
   <section aria-label="Context Explorer" className="min-w-0 space-y-2 rounded-lg border p-3">
    <h3 className="font-semibold">Explorer</h3><ul className="space-y-2">{state.items.map(item=><li key={item.ref}>{pick(item,"Select")}</li>)}</ul>
   </section>
   {state.projectionId==="context-outline"?<section aria-label="Context outline" className="min-w-0 rounded-lg border p-3">
    <h3 className="mb-2 font-semibold">Context outline</h3>{pick(anchor,"Inspect")}
    <p className="break-all text-xs">Process revision: {state.document.payload.processRevision.revisionRef} · {anchor.status}</p>
    <ul className="mt-3 space-y-2 border-l pl-3">{state.items.slice(1).map(item=><li key={item.ref}>
     {pick(item,"Inspect")}<p className="break-all text-xs">v{item.composition?.artifactVersion} · {item.status}</p></li>)}</ul>
   </section>:<section aria-label="Reference table" className="min-w-0 rounded-lg border p-3">
    <h3 className="mb-2 font-semibold">Reference table</h3><div className="max-w-full overflow-x-auto">
     <table className="w-full table-fixed text-sm"><thead><tr><th scope="col">Reference</th><th scope="col">Revision</th><th scope="col">Status</th></tr></thead>
      <tbody>{state.items.map(item=><tr key={item.ref} data-item-ref={item.ref} aria-selected={state.selectedRef===item.ref}>
       <td className="p-1 align-top">{pick(item,"Inspect")}</td><td className="break-all p-1 align-top">{item.composition?.artifactVersion??state.document.payload.processRevision.revisionRef}</td>
       <td className="break-all p-1 align-top">{item.status}</td></tr>)}</tbody></table>
    </div>
   </section>}
   <section aria-label="Context Inspector" className="min-w-0 space-y-2 rounded-lg border p-3" data-item-ref={inspector?.item.ref??""}>
    <h3 className="font-semibold">Inspector</h3>{inspector?<><p className="break-all font-medium">{inspector.item.title}</p>
     <dl className="space-y-2 break-all text-xs"><div><dt>Item kind</dt><dd>{inspector.item.kind}</dd></div>
      <div><dt>Context identity</dt><dd>{inspector.contextIdentity.artifactId} · v{inspector.contextIdentity.artifactVersion}</dd></div>
      <div><dt>Authored view reference</dt><dd>{inspector.item.viewRef??"Process anchor"}</dd></div>
      <div><dt>Logical reference</dt><dd>{inspector.item.composition?.artifactId??inspector.processRevision.artifactRef}</dd></div>
      <div><dt>Pinned revision</dt><dd>{inspector.item.composition?.artifactVersion??inspector.processRevision.revisionRef}</dd></div>
      <div><dt>Status</dt><dd data-testid="inspector-reference-status">{inspector.item.status}</dd></div></dl>
     <p className="text-xs text-muted-foreground">Read-only reference inspection.</p>
     {inspector.item.kind==="composition-reference"?<Button variant="outline" className="h-auto whitespace-normal"
      disabled={blocked||!inspector.capabilities.includes("request-open-composition")} onClick={onOpen}>Open selected composition</Button>:null}
    </>:<p className="text-sm text-muted-foreground">Select a context reference.</p>}
   </section>
  </div>
 </section>;
}

import assert from "node:assert/strict";
import test from "node:test";
import { encodeCatalogEntry, catalogCanonicalText, type CatalogEntry } from "../../packages/contracts/catalog-owner/index.js";
import { CatalogOwnerService, type CatalogOwnerRepository } from "../../packages/catalog/owner-service.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates, admitCatalogProcessRevision } from "../../packages/catalog/index.js";
function software(): CatalogEntry {
  const record = new SoftwareCatalogRegistry().register({capability:"workflow-engine",provider:"reference",version:"1.0.0"});
  return {contractVersion:"1.0.0",family:"software",id:"workflow-engine::reference::1.0.0",version:record.version,payload:record};
}
test("Catalog owner DTO uses actual software registry output and preserves normalized dependency/compatibility semantics",()=>{
  const entry=software(),r=encodeCatalogEntry(entry);assert.ok(r.accepted);assert.equal(r.text,catalogCanonicalText(entry));
  const registry=new SoftwareCatalogRegistry();registry.register(entry.payload as Parameters<SoftwareCatalogRegistry["register"]>[0]);
  assert.equal(resolveCatalogCandidates(registry,{capability:"workflow-engine",version:"1.0.0"}).ok,true);
  assert.equal(resolveCatalogCandidates(registry,{capability:"workflow-engine",compatibility:{os:"unknown"}}).ok,false);
  assert.equal(Object.isFrozen(r.entry.payload),true);
});
test("Catalog codec rejects foreign fields, family confusion, unsafe/accessor/cyclic/overlimit data without invocation",()=>{
  const entry=software();let invoked=false;
  const hostile=Object.defineProperty({...entry},"payload",{enumerable:true,get(){invoked=true;throw Error("no");}});
  for(const bad of [hostile,{...entry,approved:true},{...entry,family:"business"},{...entry,version:"2.0.0"},{...entry,payload:{...entry.payload,dependencies:Array.from({length:33},(_,i)=>"d:"+i)}},{...entry,id:"x".repeat(513)},JSON.parse('{"__proto__":{},"family":"software"}')])assert.equal(encodeCatalogEntry(bad).accepted,false);
  assert.equal(invoked,false);const cyclic:Record<string,unknown>={};cyclic.self=cyclic;assert.equal(encodeCatalogEntry(cyclic).accepted,false);
});
test("Business reference is derived from canonical process admission, never software SemVer or client approval",()=>{
  const revision={contractVersion:"1.0.0",artifactRef:"process:example",revisionRef:"revision:1",revisionNumber:1,previousRevisionRef:null} as const;
  const admitted=admitCatalogProcessRevision({artifact:{contractVersion:"1.0.0",artifactRef:revision.artifactRef},revision,publication:{...revision,immutableContentRef:"content:immutable:1"},lifecycle:{...revision,lifecycleState:"active",supersedesRevisionRef:null}});
  const entry={contractVersion:"1.0.0",family:"business",id:admitted.artifactRef,version:admitted.revisionRef,payload:{sourceRef:"source:trusted:1",revisionNumber:admitted.revisionNumber,immutableContentRef:admitted.immutableContentRef}};
  assert.equal(encodeCatalogEntry(entry).accepted,true);
  assert.equal(encodeCatalogEntry({...entry,payload:{...entry.payload,approval:true}}).accepted,false);
});
test("Denied Catalog actor never invokes storage or trusted Business source and invalid request is atomic",async()=>{
  let calls=0;
  const repository:CatalogOwnerRepository={commit:async()=>{calls++;throw Error("no");},exact:async()=>{calls++;return null;},head:async()=>{calls++;return null;},list:async()=>{calls++;return{records:[],next:null};},result:async()=>{calls++;return null;}};
  const owner=new CatalogOwnerService(repository,{authorize:async()=>{throw Error("denied");}},{resolve:async()=>{calls++;return null;}});
  const actor={scopeRef:"scope:one",actorRef:"actor:one",actorRevisionRef:"identity:1"},input={...actor,commandRef:"command:1",expectedOwnerRevision:null,entry:software()};
  assert.deepEqual(await owner.register("wrong",input),{status:"rejected",commandRef:"command:1",reason:"denied"});
  assert.equal((await owner.exact("wrong",{...actor,family:"software",id:input.entry.id,version:input.entry.version})).status,"denied");
  assert.equal((await owner.register("wrong",{...input,approved:true} as never)).status,"rejected");assert.equal(calls,0);
});

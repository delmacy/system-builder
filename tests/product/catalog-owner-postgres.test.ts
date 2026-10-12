import assert from "node:assert/strict";
import test from "node:test";
import {createHash,randomUUID} from "node:crypto";
import {PostgresCatalogOwnerRepository} from "../../packages/catalog/owner-postgres.js";
import {SoftwareCatalogRegistry} from "../../packages/catalog/index.js";
import {catalogCanonicalText,encodeCatalogEntry,type CatalogEntry,type CatalogRegistration} from "../../packages/contracts/catalog-owner/index.js";
const url=process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const actor={scopeRef:"catalog-heavy:"+randomUUID(),actorRef:"actor:test",actorRevisionRef:"identity:1"};
const sha=(s:string)=>createHash("sha256").update(s).digest("hex");
function entry(capability="capability:"+randomUUID()):CatalogEntry{
  const record=new SoftwareCatalogRegistry().register({capability,provider:"reference",version:"1.0.0"});
  return{contractVersion:"1.0.0",family:"software",id:record.capability+"::"+record.provider+"::"+record.version,version:record.version,payload:record};
}
function commit(e:CatalogEntry,commandRef="command:"+randomUUID(),expectedOwnerRevision:string|null=null){
 const request:CatalogRegistration={...actor,commandRef,expectedOwnerRevision,entry:e},encoded=encodeCatalogEntry(e);assert.ok(encoded.accepted);
 return{request,text:encoded.text,digest:sha(encoded.text),fingerprint:sha(catalogCanonicalText(request)),retainedAt:new Date().toISOString()};
}
test("Catalog actual PostgreSQL atomically persists immutable entry/head/result and survives reconstruction",async()=>{
 assert.ok(url,"real PostgreSQL URL required; no success skip");
 const repo=await PostgresCatalogOwnerRepository.open(url),input=commit(entry()),result=await repo.commit(input);assert.equal(result.status,"retained");if(result.status!=="retained")throw Error("fixture");
 const restarted=await PostgresCatalogOwnerRepository.open(url);
 assert.deepEqual(await restarted.exact(actor.scopeRef,"software",input.request.entry.id,"1.0.0"),result.record);
 assert.equal(await restarted.head(actor.scopeRef,"software",input.request.entry.id),result.record.ownerRevision);
 assert.deepEqual(await restarted.result(actor.scopeRef,actor.actorRef,input.request.commandRef),result);
 assert.deepEqual(await restarted.commit(input),result);
 assert.equal((await restarted.commit({...input,fingerprint:"changed"})).status,"rejected");
 assert.equal(await restarted.exact("foreign","software",input.request.entry.id,"1.0.0"),null);
 assert.equal(await restarted.result(actor.scopeRef,"actor:foreign",input.request.commandRef),null);
});
test("Catalog actual concurrent writers reject duplicate immutable identity and retain each result",async()=>{
 assert.ok(url);const a=await PostgresCatalogOwnerRepository.open(url),b=await PostgresCatalogOwnerRepository.open(url),e=entry(),first=commit(e),second=commit(e);
 const results=await Promise.all([a.commit(first),b.commit(second)]);
 assert.equal(results.filter(r=>r.status==="retained").length,1);
 assert.equal(results.filter(r=>r.status==="rejected"&&r.reason==="duplicate").length,1);
 assert.deepEqual(await a.result(actor.scopeRef,actor.actorRef,first.request.commandRef),results[0]);
 assert.deepEqual(await b.result(actor.scopeRef,actor.actorRef,second.request.commandRef),results[1]);
});
test("Catalog actual stale baseline rejection has durable result and zero entry/head mutation",async()=>{
 assert.ok(url);const repo=await PostgresCatalogOwnerRepository.open(url),input=commit(entry(),"command:"+randomUUID(),"catalog-revision:foreign");
 const r=await repo.commit(input);assert.deepEqual(r,{status:"rejected",commandRef:input.request.commandRef,reason:"stale-owner-revision"});
 assert.equal(await repo.exact(actor.scopeRef,"software",input.request.entry.id,"1.0.0"),null);
 assert.equal(await repo.head(actor.scopeRef,"software",input.request.entry.id),null);
 assert.deepEqual(await repo.result(actor.scopeRef,actor.actorRef,input.request.commandRef),r);
});
test("Catalog actual bounded pages and family/scope separation survive exact cursor replay",async()=>{
 assert.ok(url);const repo=await PostgresCatalogOwnerRepository.open(url),scope="catalog-page:"+randomUUID(),who={...actor,scopeRef:scope};
 for(const cap of ["cap:a","cap:b","cap:c"]){const input=commit(entry(cap));await repo.commit({...input,request:{...input.request,scopeRef:scope},fingerprint:sha(catalogCanonicalText({...input.request,scopeRef:scope}))});}
 const first=await repo.list({...who,family:"software",after:null,limit:2});assert.equal(first.records.length,2);assert.ok(first.next);
 const second=await repo.list({...who,family:"software",after:first.next,limit:2});assert.equal(second.records.length,1);assert.equal(second.next,null);
 assert.equal(new Set([...first.records,...second.records].map(r=>r.id)).size,3);
 assert.equal((await repo.list({...who,family:"business",after:null,limit:2})).records.length,0);
});

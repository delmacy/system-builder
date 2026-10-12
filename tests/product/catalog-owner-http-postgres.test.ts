import assert from "node:assert/strict";
import test from "node:test";
import {randomUUID} from "node:crypto";
import {spawn,type ChildProcess} from "node:child_process";
import {mkdtemp,writeFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {admitCatalogProcessRevision,SoftwareCatalogRegistry} from "../../packages/catalog/index.js";
import {LocalCatalogAuthorization} from "../../packages/catalog/local-authorization.js";
import {LocalCatalogTrustedSource} from "../../packages/catalog/trusted-source.js";
import {openConfiguredLocalCatalogServer} from "../../apps/station-gateway/catalog-local-server.js";
import type {CatalogEntry,CatalogRecord,CatalogRead,CatalogReceipt} from "../../packages/contracts/catalog-owner/index.js";
const pg=process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL,token=randomUUID()+randomUUID(),scope="catalog-http:"+randomUUID();
const actor={actorRef:"actor:catalog",actorRevisionRef:"identity:1"},coreRef="core:catalog-local",session={coreRef,stationRef:"station:local",sessionRef:"session:local"},context={coreRef,workspaceRef:scope};
const actions=["catalog.software.register","catalog.software.read","catalog.business.register","catalog.business.read","catalog.result.read"];
const principal={token,...actor,scopeRef:scope,expiresAt:new Date(Date.now()+3600000).toISOString(),revoked:false,grants:actions.map(action=>({action,resource:"*"}))};
const revision={contractVersion:"1.0.0",artifactRef:"process:"+randomUUID(),revisionRef:"revision:"+randomUUID(),revisionNumber:1,previousRevisionRef:null} as const;
const sourceInput={artifact:{contractVersion:"1.0.0",artifactRef:revision.artifactRef},revision,publication:{...revision,immutableContentRef:"content:immutable:"+randomUUID()},lifecycle:{...revision,lifecycleState:"active",supersedesRevisionRef:null}};
const admission=admitCatalogProcessRevision(sourceInput);
const business:CatalogEntry={contractVersion:"1.0.0",family:"business",id:admission.artifactRef,version:admission.revisionRef,payload:{sourceRef:"source:published:1",revisionNumber:admission.revisionNumber,immutableContentRef:admission.immutableContentRef}};
function software():CatalogEntry{const r=new SoftwareCatalogRegistry().register({capability:"capability:"+randomUUID(),provider:"reference",version:"1.0.0"});return{contractVersion:"1.0.0",family:"software",id:r.capability+"::"+r.provider+"::"+r.version,version:r.version,payload:r};}
function command(entry:CatalogEntry,commandRef="command:"+randomUUID()){return{commandRef,session,context,...actor,actionRef:"catalog."+entry.family+".register",targetRef:entry.id,expectedRevisionRef:null,payload:{entry}};}
function query(resourceRef:string,parameters:Record<string,unknown>){return{requestRef:"request:"+randomUUID(),session,context,resourceRef,projectionRef:"projection:"+randomUUID(),parameters};}
interface Body{readonly ok:boolean;readonly value:{readonly status:string;readonly diagnostic:{readonly detail:string};readonly payload:{readonly result:CatalogRead<CatalogRecord|CatalogReceipt>}}}
async function post(url:string,route:string,input:unknown,credential=token,origin?:string){const r=await fetch(url+"/station/"+route,{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+credential,...origin?{Origin:origin}:{}},body:JSON.stringify(input),signal:AbortSignal.timeout(15000)});return{status:r.status,body:await r.json() as Body};}
async function setup(){assert.ok(pg,"actual PostgreSQL required");const dir=await mkdtemp(join(tmpdir(),"catalog-source-")),path=join(dir,"source.json");
 const snapshot={contractVersion:"1.0.0",scopeRef:scope,sourceAuthorityRef:"owner:process:operator-attested",revisions:[{sourceRef:"source:published:1",input:sourceInput}]};
 await writeFile(path,JSON.stringify(snapshot));
 const env={...process.env,SYSTEM_BUILDER_CATALOG_PROFILE:"local-single-operator",SYSTEM_BUILDER_CATALOG_POSTGRES_URL:pg,SYSTEM_BUILDER_CATALOG_TOKEN:token,SYSTEM_BUILDER_CATALOG_ACTOR:actor.actorRef,SYSTEM_BUILDER_CATALOG_ACTOR_REVISION:actor.actorRevisionRef,SYSTEM_BUILDER_CATALOG_WORKSPACE:scope,SYSTEM_BUILDER_CATALOG_EXPIRES_AT:principal.expiresAt,SYSTEM_BUILDER_CATALOG_GRANTS:JSON.stringify(principal.grants),SYSTEM_BUILDER_CATALOG_CORE:coreRef,SYSTEM_BUILDER_CATALOG_STATION:session.stationRef,SYSTEM_BUILDER_CATALOG_SESSION:session.sessionRef,SYSTEM_BUILDER_CATALOG_SOURCE_FILE:path,SYSTEM_BUILDER_CATALOG_PORT:"0"};
 return{dir,path,snapshot,env};}
test("Catalog actual authenticated HTTP retains software and server-resolved Business revision with exact PG readback",async()=>{
 const s=await setup();const server=await openConfiguredLocalCatalogServer(s.env);
 try{for(const entry of [software(),business]){const c=command(entry),r=await post(server.url,"command",c);assert.equal(r.body.value.status,"ACCEPTED");
  const exact=await post(server.url,"query",query(entry.id,{operation:"exact",family:entry.family,version:entry.version}));assert.equal(exact.body.value.payload.result.status,"found");if(exact.body.value.payload.result.status!=="found")throw Error("read");const record=exact.body.value.payload.result.value as CatalogRecord;assert.equal(JSON.parse(record.text).family,entry.family);assert.equal(JSON.parse(record.text).id,entry.id);
  const result=await post(server.url,"query",query(c.commandRef,{operation:"result"}));assert.equal(result.body.value.payload.result.status,"found");
  assert.equal((await post(server.url,"command",command(entry))).body.value.status,"REJECTED");
 }}
 finally{await server.close();await rm(s.dir,{recursive:true,force:true});}
});
test("Catalog denies credential/actor/context/origin and missing Business source without owner mutation",async()=>{
 const s=await setup(),server=await openConfiguredLocalCatalogServer(s.env),entry=software(),c=command(entry);
 try{
  assert.equal((await post(server.url,"command",c,"wrong-token")).status,401);
  assert.equal((await post(server.url,"command",{...c,actorRef:"actor:forged"})).body.value.status,"REJECTED");
  assert.equal((await post(server.url,"command",{...c,context:{...context,workspaceRef:"foreign"}})).body.ok,false);
  assert.equal((await post(server.url,"command",c,token,"https://foreign.example")).status,403);
  assert.equal((await post(server.url,"query",query(entry.id,{operation:"exact",family:"software",version:"1.0.0"}))).body.value.payload.result.status,"absent");
  const missing={...business,id:"process:missing"};const denied=await post(server.url,"command",command(missing));assert.equal(denied.body.value.status,"REJECTED");assert.equal(denied.body.value.diagnostic.detail,"source-unavailable");
  assert.equal((await post(server.url,"command",{...command(business),payload:{entry:business,approval:true}})).body.value.status,"REJECTED");
 }
 finally{await server.close();await rm(s.dir,{recursive:true,force:true});}
});
test("Catalog current grant expiry/revocation and pinned source changes fail closed",async()=>{
 const denied=new LocalCatalogAuthorization({...principal,grants:[{action:"catalog.software.read",resource:"catalog:software"}]});
 await assert.rejects(()=>denied.authorize(token,{scopeRef:scope,...actor,action:"catalog.software.register",resource:"capability:any"}),/DENIED/);
 assert.equal(new LocalCatalogAuthorization({...principal,revoked:true}).authenticate(token),null);
 assert.equal(new LocalCatalogAuthorization({...principal,expiresAt:new Date(0).toISOString()}).authenticate(token),null);
 const s=await setup();try{const source=await LocalCatalogTrustedSource.open(s.path,scope);assert.ok(await source.resolve(scope,"source:published:1"));assert.equal(await source.resolve("foreign","source:published:1"),null);
 await writeFile(s.path,JSON.stringify({...s.snapshot,revisions:[]}));assert.equal(await source.resolve(scope,"source:published:1"),null);
 await assert.rejects(()=>LocalCatalogTrustedSource.open(s.path,"foreign"),/SCOPE_DENIED/);await assert.rejects(()=>LocalCatalogTrustedSource.open("relative.json",scope),/ABSOLUTE/);
 }finally{await rm(s.dir,{recursive:true,force:true});}
});
async function childServer(env:NodeJS.ProcessEnv):Promise<{child:ChildProcess;url:string;stop():Promise<void>}>{
 const child=spawn(process.execPath,["--import","tsx","apps/station-gateway/catalog-local-server.ts"],{env,stdio:["ignore","pipe","pipe"]});
 const url=await new Promise<string>((resolve,reject)=>{let output="";const timer=setTimeout(()=>{child.kill();reject(Error("CATALOG_CHILD_TIMEOUT"));},15000);child.once("exit",()=>{clearTimeout(timer);reject(Error("CATALOG_CHILD_EXIT"));});child.stdout!.on("data",(b:Buffer)=>{output+=b.toString();const found=/Catalog local Gateway: (http:\/\/127\.0\.0\.1:\d+)/.exec(output);if(found){clearTimeout(timer);resolve(found[1]!);}});});
 return{child,url,stop:()=>new Promise<void>(resolve=>{if(child.exitCode!==null||child.signalCode!==null){resolve();return;}const timer=setTimeout(()=>child.kill("SIGKILL"),5000);child.once("exit",()=>{clearTimeout(timer);resolve();});child.kill("SIGTERM");})};
}
test("Catalog actual owner process restart recovers exact entry and identical durable command result",async()=>{
 const s=await setup(),entry=software(),c=command(entry);let child=await childServer(s.env);
 try{const retained=await post(child.url,"command",c);assert.equal(retained.body.value.status,"ACCEPTED");await child.stop();child=await childServer(s.env);
  const result=await post(child.url,"query",query(c.commandRef,{operation:"result"}));assert.equal(result.body.value.payload.result.status,"found");
  assert.deepEqual((await post(child.url,"command",c)).body,retained.body);
  assert.equal((await post(child.url,"query",query(entry.id,{operation:"exact",family:"software",version:entry.version}))).body.value.payload.result.status,"found");
 }finally{await child.stop();await rm(s.dir,{recursive:true,force:true});}
});
test("Catalog configured runtime rejects absent or unqualified profile instead of default grants",async()=>{
 await assert.rejects(()=>openConfiguredLocalCatalogServer({}),/CONFIG_MISSING/);
 await assert.rejects(()=>openConfiguredLocalCatalogServer({SYSTEM_BUILDER_CATALOG_PROFILE:"production"}),/PROFILE_REQUIRED/);
});

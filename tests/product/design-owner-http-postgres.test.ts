import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { spawn, type ChildProcess } from "node:child_process";
import { PostgresDesignCandidateRepository } from "../../packages/design/postgres.js";
import { DesignCandidateService } from "../../packages/design/index.js";
import { LocalDesignAuthorization } from "../../packages/design/local-authorization.js";
import { openConfiguredLocalDesignServer } from "../../apps/station-gateway/local-server.js";
import { createWorkflow, openWorkflow, applyWorkflowCommand, materializeWorkflow } from "../../packages/station-workflow-authoring/index.js";
import type { CandidateRecord } from "../../packages/contracts/design-candidate/index.js";
import type { StationCommand, StationQuery } from "../../packages/contracts/station-core/index.js";
const postgresUrl=process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const token=randomUUID()+randomUUID(), scope="design-heavy:"+randomUUID();
const principal={token,scopeRef:scope,actorRef:"actor:local",actorRevisionRef:"identity:1",expiresAt:new Date(Date.now()+3600000).toISOString(),revoked:false};
const coreRef="core:design-local",session={coreRef,stationRef:"station:local",sessionRef:"session:local"},context={coreRef,workspaceRef:scope};
function candidate(){
  const initial=createWorkflow({artifactId:"urn:test:design:"+randomUUID(),createdAt:new Date().toISOString(),analysisRef:"analysis:unresolved",recipeRef:"recipe:unresolved",process:{id:"ticket",name:"Ticket",requirementRefs:["req:1"],states:["open"]}});assert.ok(initial.accepted);
  const input=JSON.parse(initial.text);input.extensions={"org.example.metadata":{opaque:["preserve",42]}};input.payload.sessionPolicy={lifetimeSeconds:300};
  const opened=openWorkflow(input);assert.ok(opened.accepted);const edited=applyWorkflowCommand(opened.session,0,{kind:"add-state",processId:"ticket",state:"closed"});assert.ok(edited.accepted);
  const result=materializeWorkflow(edited.session,1,"1.1.0",new Date().toISOString());assert.ok(result.accepted);return result;
}
function command(c:ReturnType<typeof candidate>["document"],commandRef="command:"+randomUUID(),expectedRevisionRef:string|null=null):StationCommand{return{commandRef,session,context,actorRef:principal.actorRef,actorRevisionRef:principal.actorRevisionRef,actionRef:"design.candidate.submit",targetRef:c.artifactId,expectedRevisionRef,payload:{candidate:c}};}
function query(resourceRef:string,parameters:Record<string,unknown>):StationQuery{return{requestRef:"request:"+randomUUID(),session,context,resourceRef,projectionRef:"projection:"+randomUUID(),parameters};}
interface GatewayBody { readonly ok: boolean; readonly value: { readonly status: string; readonly resultingRevisionRef: string; readonly diagnostic: { readonly detail: string }; readonly payload: { readonly result: { readonly status: string; readonly value: CandidateRecord & { readonly status: string; readonly record: CandidateRecord } } } } }
async function post(url:string,route:string,input:unknown,credential=token){const r=await fetch(url+"/station/"+route,{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+credential},body:JSON.stringify(input),signal:AbortSignal.timeout(15000)});return{status:r.status,body:await r.json() as GatewayBody};}
async function start():Promise<{child:ChildProcess;url:string;stop():Promise<void>}>{
  assert.ok(postgresUrl);
  const child=spawn(process.execPath,["--import","tsx","tests/product/fixtures/design-owner-server.ts"],{env:{...process.env,SYSTEM_BUILDER_DESIGN_PROFILE:"local-single-operator",SYSTEM_BUILDER_DESIGN_POSTGRES_URL:postgresUrl,SYSTEM_BUILDER_DESIGN_TOKEN:token,SYSTEM_BUILDER_DESIGN_ACTOR:principal.actorRef,SYSTEM_BUILDER_DESIGN_ACTOR_REVISION:principal.actorRevisionRef,SYSTEM_BUILDER_DESIGN_WORKSPACE:scope,SYSTEM_BUILDER_DESIGN_EXPIRES_AT:principal.expiresAt,SYSTEM_BUILDER_DESIGN_CORE:coreRef,SYSTEM_BUILDER_DESIGN_STATION:session.stationRef,SYSTEM_BUILDER_DESIGN_SESSION:session.sessionRef,SYSTEM_BUILDER_DESIGN_PORT:"0"},stdio:["ignore","pipe","pipe"]});
  const url=await new Promise<string>((resolve,reject)=>{let output="";const timer=setTimeout(()=>{child.kill();reject(new Error("DESIGN_CHILD_START_TIMEOUT"));},15000);child.once("exit",()=>{clearTimeout(timer);reject(new Error("DESIGN_CHILD_EXIT"));});child.stdout!.on("data",(b:Buffer)=>{output+=b.toString();if(output.includes("\n")){clearTimeout(timer);try{resolve((JSON.parse(output.split("\n")[0]!) as {url:string}).url);}catch{reject(new Error("DESIGN_CHILD_MESSAGE_INVALID"));}}});});
  return{child,url,stop:()=>new Promise<void>((resolve)=>{if(child.exitCode!==null||child.signalCode!==null){resolve();return;}const timer=setTimeout(()=>child.kill("SIGKILL"),5000);child.once("exit",()=>{clearTimeout(timer);resolve();});child.kill("SIGTERM");})};
}
test("actual PostgreSQL + authenticated Gateway HTTP preserves authored candidate, concurrency and process restart", {skip:postgresUrl===undefined?"SYSTEM_BUILDER_TEST_POSTGRES_URL not configured":false,timeout:90000},async()=>{
  let server=await start();
  try{
    const authored=candidate(),c=command(authored.document);
    const hello=await post(server.url,"handshake",{stationRef:session.stationRef,stationVersion:"1.0.0",supportedProtocolVersions:["1.0.0"]});assert.equal(hello.body.ok,true);
    assert.equal((await post(server.url,"command",c,"wrong-token")).status,401);
    assert.equal((await post(server.url,"command",{...c,actorRef:"actor:forged"})).body.value.status,"REJECTED");
    assert.equal((await post(server.url,"command",{...c,context:{...context,workspaceRef:"wrong"}})).body.ok,false);
    const malformed=command({...authored.document,artifactVersion:"bad"});assert.equal((await post(server.url,"command",malformed)).body.value.status,"REJECTED");
    const oversized=await post(server.url,"command",{padding:"x".repeat(1_100_000)});assert.equal(oversized.status,413);
    const retained=await post(server.url,"command",c);assert.equal(retained.body.ok,true);assert.equal(retained.body.value.status,"ACCEPTED");
    const ownerRevision=retained.body.value.resultingRevisionRef as string;assert.ok(ownerRevision);
    assert.deepEqual((await post(server.url,"command",c)).body,retained.body);
    const exact=await post(server.url,"query",query(c.targetRef,{operation:"exact",artifactVersion:"1.1.0"}));
    assert.equal(exact.body.value.payload.result.status,"found");const record=exact.body.value.payload.result.value;
    assert.equal(record.text,authored.text);assert.deepEqual(JSON.parse(record.text),authored.document);
    assert.equal(record.ownerRevision,ownerRevision);
    assert.equal((await post(server.url,"query",query(c.targetRef,{operation:"exact",artifactVersion:"9.0.0"}))).body.value.payload.result.status,"absent");
    assert.equal((await post(server.url,"command",{...c,expectedRevisionRef:ownerRevision})).body.value.diagnostic.detail,"command-conflict");
    assert.equal((await post(server.url,"command",command(authored.document))).body.value.diagnostic.detail,"immutable-conflict");
    const [a,b]=await Promise.all(["1.2.0","1.3.0"].map(v=>post(server.url,"command",command({...authored.document,artifactVersion:v},undefined,ownerRevision))));
    assert.ok(a && b);
    assert.deepEqual([a.body.value.status,b.body.value.status].sort(),["ACCEPTED","REJECTED"]);
    assert.equal([a,b].find(r=>r.body.value.status==="REJECTED")!.body.value.diagnostic.detail,"stale-owner-revision");
    await server.stop();server=await start();
    const restarted=await post(server.url,"query",query(c.targetRef,{operation:"exact",artifactVersion:"1.1.0"}));assert.deepEqual(restarted.body.value.payload.result.value,record);
    assert.deepEqual((await post(server.url,"command",c)).body,retained.body);
    const recovered=await post(server.url,"query",query(c.commandRef,{operation:"result"}));assert.equal(recovered.body.value.payload.result.value.status,"retained");assert.deepEqual(recovered.body.value.payload.result.value.record,record);
    assert.equal(JSON.stringify(restarted.body).includes(postgresUrl!),false);assert.equal(JSON.stringify(restarted.body).includes(token),false);
  }finally{await server.stop();}
});
test("actual PostgreSQL command committed before lost response remains recoverable; auth expiry and revocation deny", {skip:postgresUrl===undefined?"SYSTEM_BUILDER_TEST_POSTGRES_URL not configured":false},async()=>{
  assert.ok(postgresUrl);const repo=await PostgresDesignCandidateRepository.open(postgresUrl),original=repo.commit.bind(repo);
  repo.commit=async input=>{await original(input);throw new Error("lost result after committed transaction");};
  const auth=new LocalDesignAuthorization(principal),owner=new DesignCandidateService(repo,auth),authored=candidate();
  const input={...principal,commandRef:"command:"+randomUUID(),expectedOwnerRevision:null,candidate:authored.document};
  // Credential is ingress-only; retain only actor/context fields in the command.
  const request={scopeRef:input.scopeRef,actorRef:input.actorRef,actorRevisionRef:input.actorRevisionRef,commandRef:input.commandRef,expectedOwnerRevision:input.expectedOwnerRevision,candidate:input.candidate};
  assert.equal((await owner.submit(token,request)).status,"unknown");
  const reconstructed=new DesignCandidateService(await PostgresDesignCandidateRepository.open(postgresUrl),auth);
  const result=await reconstructed.result(token,{...request});assert.equal(result.status,"found");if(result.status==="found"){assert.equal(result.value.status,"retained");if(result.value.status==="retained")assert.equal(result.value.record.text,authored.text);}
  for(const p of [{...principal,revoked:true},{...principal,expiresAt:"2020-01-01T00:00:00Z"}])assert.equal(new LocalDesignAuthorization(p).authenticate(token),null);
  await assert.rejects(()=>openConfiguredLocalDesignServer({}),/DESIGN_LOCAL_CONFIG_MISSING/);
});

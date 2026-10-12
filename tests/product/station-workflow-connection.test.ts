import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { WorkflowOwnerConnection, type WorkflowConnectionOptions } from "../../packages/station-workflow-connection/index.js";
import { StationHttpTransport } from "../../packages/station-sdk/index.js";
import { openConfiguredLocalDesignServer } from "../../apps/station-gateway/local-server.js";
import { createWorkflow, openWorkflow, applyWorkflowCommand, materializeWorkflow } from "../../packages/station-workflow-authoring/index.js";
import type { StationProjection } from "../../packages/contracts/station-core/index.js";
const postgresUrl=process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const token=randomUUID()+randomUUID();
const options:WorkflowConnectionOptions={stationRef:"station:wp16",coreRef:"core:wp16",sessionRef:"session:wp16",scopeRef:"scope:wp16:"+randomUUID(),actorRef:"actor:wp16",actorRevisionRef:"identity:1"};
function authored(){
  const r=createWorkflow({artifactId:"urn:uuid:"+randomUUID(),createdAt:new Date().toISOString(),analysisRef:"analysis:unresolved",recipeRef:"recipe:unresolved",process:{id:"ticket",name:"Ticket",requirementRefs:["req:1"],states:["open"]}});assert.ok(r.accepted);
  const input=JSON.parse(r.text);input.extensions={"org.example.metadata":{opaque:["preserve",42]}};input.provenance.operation={note:"preserve"};
  const opened=openWorkflow(input);assert.ok(opened.accepted);const edited=applyWorkflowCommand(opened.session,0,{kind:"add-state",processId:"ticket",state:"closed"});assert.ok(edited.accepted);
  const result=materializeWorkflow(edited.session,1,"1.1.0",new Date().toISOString());assert.ok(result.accepted);return result;
}
async function server(){
  assert.ok(postgresUrl);
  return openConfiguredLocalDesignServer({SYSTEM_BUILDER_DESIGN_PROFILE:"local-single-operator",SYSTEM_BUILDER_DESIGN_POSTGRES_URL:postgresUrl,SYSTEM_BUILDER_DESIGN_TOKEN:token,SYSTEM_BUILDER_DESIGN_ACTOR:options.actorRef,SYSTEM_BUILDER_DESIGN_ACTOR_REVISION:options.actorRevisionRef,SYSTEM_BUILDER_DESIGN_WORKSPACE:options.scopeRef,SYSTEM_BUILDER_DESIGN_EXPIRES_AT:new Date(Date.now()+3600000).toISOString(),SYSTEM_BUILDER_DESIGN_CORE:options.coreRef,SYSTEM_BUILDER_DESIGN_STATION:options.stationRef,SYSTEM_BUILDER_DESIGN_SESSION:options.sessionRef});
}
const json=(value:unknown)=>new Response(JSON.stringify(value),{headers:{"content-type":"application/json"}});
const hello={ok:true,hello:{coreRef:options.coreRef,coreVersion:"1.0.0",protocolVersion:"1.0.0",capabilityRefs:["design.candidate.submit","design.candidate.exact","design.candidate.head","design.candidate.result"]}};
test("actual authored candidate -> SDK/client -> Gateway HTTP -> Design/PostgreSQL -> exact immutable readback", {skip:postgresUrl===undefined?"SYSTEM_BUILDER_TEST_POSTGRES_URL not configured":false},async()=>{
  const endpoint=await server();try{
    const transport=new StationHttpTransport({baseUrl:endpoint.url,token}),connection=new WorkflowOwnerConnection(options,transport);
    assert.equal(await connection.connect(),true);const candidate=authored(),result=await connection.submit(candidate.document,null);
    assert.equal(result.status,"retained");if(result.status!=="retained")return;
    assert.equal(result.record.text,candidate.text);assert.deepEqual(result.document,candidate.document);assert.equal(connection.pendingCommandRef,null);
    assert.deepEqual(await connection.head(candidate.document.artifactId),{status:"found",value:result.record.ownerRevision});
    assert.equal((await connection.exact(candidate.document.artifactId,"9.0.0")).status,"absent");
    const [a,b]=await Promise.all(["1.2.0","1.3.0"].map(async version=>{const c=new WorkflowOwnerConnection(options,new StationHttpTransport({baseUrl:endpoint.url,token}));assert.equal(await c.connect(),true);return c.submit({...candidate.document,artifactVersion:version},result.record.ownerRevision);}));
    assert.ok(a&&b);assert.deepEqual([a.status,b.status].sort(),["rejected","retained"]);
    const rejected=[a,b].find(v=>v.status==="rejected");assert.ok(rejected&&rejected.status!=="retained");assert.equal(rejected.reason,"stale-owner-revision");
    const forged=new WorkflowOwnerConnection({...options,actorRef:"actor:forged"},new StationHttpTransport({baseUrl:endpoint.url,token}));assert.equal(await forged.connect(),true);
    assert.equal((await forged.submit(authored().document,null)).status,"rejected");
    const denied=new WorkflowOwnerConnection(options,new StationHttpTransport({baseUrl:endpoint.url,token:"invalid"}));assert.equal(await denied.connect(),false);
    connection.disconnect();assert.equal((await connection.exact(candidate.document.artifactId,"1.1.0")).status,"unknown");
    assert.deepEqual(candidate.document,result.document);
  }finally{await endpoint.close();}
});
test("actual commit with lost HTTP response recovers same pending command result and prevents changed retry", {skip:postgresUrl===undefined?"SYSTEM_BUILDER_TEST_POSTGRES_URL not configured":false},async()=>{
  const endpoint=await server();try{
    let lose=true;const transport=new StationHttpTransport({baseUrl:endpoint.url,token,fetch:async(input,init)=>{const response=await fetch(input,init);if(String(input).endsWith("/command")&&lose){lose=false;await response.arrayBuffer();throw new Error("lost committed response");}return response;}});
    const connection=new WorkflowOwnerConnection(options,transport);assert.equal(await connection.connect(),true);
    const candidate=authored(),commandRef="command:"+randomUUID();assert.equal((await connection.submit(candidate.document,null,commandRef)).status,"unknown");assert.equal(connection.pendingCommandRef,commandRef);
    const blocked=await connection.submit({...candidate.document,artifactVersion:"1.2.0"},null);assert.ok(blocked.status!=="retained");assert.equal(blocked.reason,"recover-pending-command-first");
    const recovered=await connection.recover();assert.equal(recovered.status,"retained");if(recovered.status==="retained"){assert.equal(recovered.commandRef,commandRef);assert.equal(recovered.record.text,candidate.text);}
    assert.equal(connection.pendingCommandRef,null);
  }finally{await endpoint.close();}
});
test("actual owner replies with wrong correlation/source/currentness/completeness/hash are never installed", {skip:postgresUrl===undefined?"SYSTEM_BUILDER_TEST_POSTGRES_URL not configured":false},async()=>{
  const endpoint=await server();try{
    const normal=new WorkflowOwnerConnection(options,new StationHttpTransport({baseUrl:endpoint.url,token}));assert.equal(await normal.connect(),true);
    const candidate=authored();assert.equal((await normal.submit(candidate.document,null)).status,"retained");
    const corruptions:((p:StationProjection)=>unknown)[]=[
      p=>({...p,requestRef:"wrong"}),p=>({...p,context:{...p.context,workspaceRef:"wrong"}}),p=>({...p,sourceRef:"wrong"}),p=>({...p,sourceAuthorityRef:"wrong"}),p=>({...p,currentness:"STALE"}),p=>({...p,completeness:"PARTIAL"}),p=>({...p,sourceRevisionRef:"wrong"}),
      p=>{const result=p.payload.result as {value:Record<string,unknown>};return{...p,payload:{...p.payload,result:{status:"found",value:{...result.value,digest:"bad"}}}};},
    ];
    for(const corrupt of corruptions){
      const connection=new WorkflowOwnerConnection(options,new StationHttpTransport({baseUrl:endpoint.url,token,fetch:async(input,init)=>{const response=await fetch(input,init);if(!String(input).endsWith("/query"))return response;const r=await response.json() as {ok:true;value:StationProjection};return json({...r,value:corrupt(r.value)});}}));
      assert.equal(await connection.connect(),true);assert.equal((await connection.exact(candidate.document.artifactId,"1.1.0")).status,"unknown");
    }
    let release!:()=>void,ready!:()=>void;const held=new Promise<void>(resolve=>release=resolve),started=new Promise<void>(resolve=>ready=resolve);
    const late=new WorkflowOwnerConnection(options,new StationHttpTransport({baseUrl:endpoint.url,token,fetch:async(input,init)=>{const response=await fetch(input,init);if(String(input).endsWith("/query")){ready();await held;}return response;}}));
    assert.equal(await late.connect(),true);const result=late.exact(candidate.document.artifactId,"1.1.0");await started;late.disconnect();release();assert.equal((await result).status,"unknown");
  }finally{await endpoint.close();}
});
test("malformed/oversized/unavailable transport, endpoint credentials and timeout fail closed",async()=>{
  assert.throws(()=>new StationHttpTransport({baseUrl:"http://example.com",token}),/ENDPOINT_INVALID/);
  assert.throws(()=>new StationHttpTransport({baseUrl:"http://user:secret@127.0.0.1",token}),/ENDPOINT_INVALID/);
  for(const response of [()=>json({ok:true,hello:{}}),()=>json({...hello,extra:"wrong"}),()=>new Response("x".repeat(1_200_000),{headers:{"content-type":"application/json"}}),()=>new Response("denied",{status:401})]){
    const connection=new WorkflowOwnerConnection(options,new StationHttpTransport({baseUrl:"http://127.0.0.1:1",token,fetch:async()=>response()}));assert.equal(await connection.connect(),false);
  }
  const transport=new StationHttpTransport({baseUrl:"http://127.0.0.1:1",token,timeoutMs:100,fetch:(_input,init)=>new Promise<Response>((_resolve,reject)=>init?.signal?.addEventListener("abort",()=>reject(new Error("timeout")),{once:true}))});
  assert.equal(await new WorkflowOwnerConnection(options,transport).connect(),false);
});
test("late handshake cannot disconnect a newer successful connection",async()=>{
  let release!:()=>void,ready!:()=>void,calls=0;const held=new Promise<void>(resolve=>release=resolve),started=new Promise<void>(resolve=>ready=resolve);
  const connection=new WorkflowOwnerConnection(options,new StationHttpTransport({baseUrl:"http://127.0.0.1:1",token,fetch:async()=>{if(++calls===1){ready();await held;}return json(hello);}}));
  const first=connection.connect();await started;assert.equal(await connection.connect(),true);release();assert.equal(await first,false);assert.equal(connection.connected,true);
});

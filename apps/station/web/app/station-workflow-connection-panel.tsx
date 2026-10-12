"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input } from "@system-builder/ui-core";
import { StationHttpTransport } from "@system-builder/station-sdk";
import { WorkflowOwnerConnection, type WorkflowOwnerResult } from "@system-builder/station-workflow-connection";
import { workflowCanonicalText, type WorkflowDocument } from "@system-builder/station-workflow-authoring";
import type { CandidateRecord } from "@system-builder/contracts/design-candidate";
const initial={endpoint:"http://127.0.0.1:4000",token:"",coreRef:"core:design-local",stationRef:"station:local",sessionRef:"session:local",scopeRef:"workspace:local",actorRef:"actor:local",actorRevisionRef:"identity:1"};
const labels=[["endpoint","Owner endpoint"],["token","Owner access token"],["coreRef","Owner Core reference"],["stationRef","Owner Station reference"],["sessionRef","Owner session reference"],["scopeRef","Owner workspace reference"],["actorRef","Owner actor reference"],["actorRevisionRef","Owner actor revision"]] as const;
interface Props { readonly document:WorkflowDocument|null;readonly submitBlocked:boolean;readonly replacementBlocked:boolean;readonly getGeneration:()=>number;readonly onOpen:(document:WorkflowDocument)=>void }
export function StationWorkflowConnectionPanel(props:Props){
  const [fields,setFields]=useState(initial),[connected,setConnected]=useState(false),[busy,setBusy]=useState(false);
  const [message,setMessage]=useState("Owner disconnected. Local draft and storage remain available.");
  const [lookupId,setLookupId]=useState(""),[lookupVersion,setLookupVersion]=useState("");
  const [fetched,setFetched]=useState<{document:WorkflowDocument;record:CandidateRecord}|null>(null),[retained,setRetained]=useState<CandidateRecord|null>(null);
  const [pendingRef,setPendingRef]=useState<string|null>(null),[lastCommand,setLastCommand]=useState("");
  const connection=useRef<{key:string;client:WorkflowOwnerConnection;transport:StationHttpTransport}|null>(null),sequence=useRef(0);
  const localText=useMemo(()=>props.document?workflowCanonicalText(props.document):"",[props.document]);
  useEffect(()=>()=>{sequence.current++;connection.current?.client.disconnect();connection.current?.transport.cancel();},[]);
  const basedOn=(record:CandidateRecord|null)=>!!record&&!!props.document&&record.artifactId===props.document.artifactId&&(record.text===localText||Array.isArray(props.document.provenance.inputs)&&props.document.provenance.inputs.some((input:unknown)=>{if(input===null||typeof input!=="object")return false;const r=input as Record<string,unknown>;return r.artifactType===props.document?.artifactType&&r.artifactId===record.artifactId&&r.artifactVersion===record.artifactVersion;}));
  const anchor=fetched&&basedOn(fetched.record)?fetched.record:retained&&basedOn(retained)?retained:null;
  const disconnect=()=>{sequence.current++;connection.current?.client.disconnect();connection.current?.transport.cancel();setConnected(false);setBusy(false);setFetched(null);setPendingRef(connection.current?.client.pendingCommandRef??null);setMessage("Owner disconnected. Draft preserved; an unknown command may already be retained.");};
  const reset=()=>{disconnect();connection.current=null;setFetched(null);setRetained(null);setPendingRef(null);setFields(current=>({...current,token:""}));setMessage(lastCommand?"Connection reset. Owner result may still exist; query the exact artifact revision before sending again.":"Connection reset. Local draft preserved.");};
  const edit=(key:keyof typeof initial,value:string)=>{sequence.current++;connection.current?.client.disconnect();connection.current?.transport.cancel();connection.current=null;setConnected(false);setFetched(null);setRetained(null);setFields(current=>({...current,[key]:value}));};
  const connect=async()=>{
    if(busy)return;const request=++sequence.current,draftGeneration=props.getGeneration();setBusy(true);
    try{
      const key=JSON.stringify(fields);
      if(!connection.current||connection.current.key!==key){
        const transport=new StationHttpTransport({baseUrl:fields.endpoint,token:fields.token});
        const {endpoint: _endpoint,token: _token,...options}=fields;
        // Endpoint and credential remain only in ephemeral connection state.
        void _endpoint;void _token;
        connection.current={key,transport,client:new WorkflowOwnerConnection(options,transport)};
      }
      const current=connection.current,ok=await current.client.connect();
      if(sequence.current!==request||connection.current!==current)return;
      setConnected(ok);setPendingRef(current.client.pendingCommandRef);
      setMessage(ok?"Owner connected. Retention is technical; upstream references remain unresolved.":"Cannot connect to owner. Check configured endpoint, identity and credential. Draft preserved.");
      if(ok&&props.document&&props.getGeneration()===draftGeneration){setLookupId(props.document.artifactId);setLookupVersion(props.document.artifactVersion);}
    }catch{if(sequence.current===request)setMessage("Owner connection configuration invalid or unavailable. Draft preserved.");}
    finally{if(sequence.current===request)setBusy(false);}
  };
  const begin=()=>{const current=connection.current;if(!current||!current.client.connected||busy)return null;const request=++sequence.current,generation=props.getGeneration();setBusy(true);return{current,request,generation};};
  const live=(operation:NonNullable<ReturnType<typeof begin>>)=>sequence.current===operation.request&&connection.current===operation.current&&props.getGeneration()===operation.generation;
  const finish=(operation:NonNullable<ReturnType<typeof begin>>)=>{if(sequence.current===operation.request){setBusy(false);setPendingRef(operation.current.client.pendingCommandRef);if(props.getGeneration()!==operation.generation)setMessage("Draft changed during owner operation. Response not applied; read the exact revision or recover the command result.");}};
  const show=(result:WorkflowOwnerResult)=>{
    setLastCommand(result.commandRef);setPendingRef(connection.current?.client.pendingCommandRef??null);
    if(result.status==="retained"){setFetched({document:result.document,record:result.record});setRetained(result.record);setLookupId(result.record.artifactId);setLookupVersion(result.record.artifactVersion);setMessage("Owner retained exact technical candidate. Readback verified; no business approval or publication.");}
    else if(result.status==="rejected")setMessage("Owner rejected: "+result.reason+". Draft preserved. Reconcile explicitly; no overwrite.");
    else setMessage("Owner result unknown: "+result.reason+". Draft preserved. Recover result before deliberate identical retry.");
  };
  const send=async()=>{
    if(!props.document||props.submitBlocked)return;const operation=begin();if(!operation)return;
    try{
      const head=await operation.current.client.head(props.document.artifactId);if(!live(operation))return;
      if(head.status==="unknown"){setMessage("Owner head unavailable. Draft preserved; nothing sent.");return;}
      if(head.status==="found"&&(!anchor||head.value!==anchor.ownerRevision)){setMessage("Owner revision changed or base unverified. Draft preserved. Read and open the exact owner base before sending.");return;}
      if(head.status==="absent"&&anchor){setMessage("Owner baseline unavailable. Draft preserved; nothing sent.");return;}
      const commandRef="command:"+crypto.randomUUID();setLastCommand(commandRef);setLookupId(props.document.artifactId);setLookupVersion(props.document.artifactVersion);
      const result=await operation.current.client.submit(props.document,anchor?.ownerRevision??null,commandRef);if(live(operation))show(result);
    }catch{if(live(operation))setMessage("Owner operation unavailable or unproven. Draft preserved.");}finally{finish(operation);}
  };
  const read=async()=>{
    if(!lookupId||!lookupVersion)return;const operation=begin();if(!operation)return;
    try{const result=await operation.current.client.exact(lookupId,lookupVersion);if(!live(operation))return;
      if(result.status==="found"){setFetched(result.value);setMessage("Exact owner revision verified. Opening is explicit; draft replacement requires confirmation.");}
      else{setFetched(null);setMessage(result.status==="absent"?"Exact owner revision absent. No latest fallback; draft preserved.":"Owner read unavailable or unproven. Draft preserved.");}
    }finally{finish(operation);}
  };
  const recover=async(retry:boolean)=>{
    const operation=begin();if(!operation)return;
    try{const result=retry?await operation.current.client.retry():await operation.current.client.recover();if(live(operation))show(result);}
    finally{finish(operation);}
  };
  return <details className="rounded-lg border p-3"><summary className="cursor-pointer font-medium">Design owner connection</summary><section aria-label="Workflow owner connection" className="mt-3 space-y-3">
    <p className="text-sm text-muted-foreground">Configured local authenticated owner · credentials stay in this session · technical retention only</p>
    <div className="grid gap-3 sm:grid-cols-2">{labels.map(([key,label])=><label key={key} className="block min-w-0 text-sm">{label}<Input type={key==="token"?"password":"text"} autoComplete="off" value={fields[key]} disabled={connected||busy||!!pendingRef} onChange={event=>edit(key,event.target.value)} /></label>)}</div>
    <div className="flex flex-wrap gap-2"><Button disabled={busy||connected} onClick={()=>void connect()}>Connect owner</Button><Button variant="outline" disabled={!connected&&!busy&&!pendingRef} onClick={disconnect}>Disconnect owner</Button><Button variant="outline" disabled={busy} onClick={reset}>Reset owner connection</Button></div>
    <p data-testid="workflow-owner-status" aria-live="polite" className="break-words text-sm">{message}</p>
    {lastCommand?<p className="break-all text-xs">Last command: {lastCommand}</p>:null}
    <p className="break-all text-xs">Verified exact owner revision: {fetched?.record.ownerRevision??"none"}</p>
    <p className="break-all text-xs">Verified owner base: {anchor?.ownerRevision??"new artifact / unverified"} · Pending command: {pendingRef??"none"}</p>
    <div className="flex flex-wrap gap-2"><Button disabled={!connected||busy||!props.document||props.submitBlocked||!!pendingRef} onClick={()=>void send()}>Send candidate to owner</Button><Button variant="outline" disabled={!connected||busy||!pendingRef} onClick={()=>void recover(false)}>Recover owner result</Button><Button variant="outline" disabled={!connected||busy||!pendingRef} onClick={()=>void recover(true)}>Retry identical owner command</Button></div>
    <div className="grid gap-3 sm:grid-cols-2"><label className="block min-w-0 text-sm">Owner artifact ID<Input value={lookupId} disabled={busy} onChange={event=>{sequence.current++;setLookupId(event.target.value);setFetched(null);}} /></label><label className="block text-sm">Owner artifact version<Input value={lookupVersion} disabled={busy} onChange={event=>{sequence.current++;setLookupVersion(event.target.value);setFetched(null);}} /></label></div>
    <div className="flex flex-wrap gap-2"><Button variant="outline" disabled={!connected||busy||!lookupId||!lookupVersion} onClick={()=>void read()}>Read exact owner revision</Button><Button variant="outline" disabled={!fetched||busy||props.replacementBlocked} onClick={()=>{if(fetched)props.onOpen(fetched.document);}}>Open owner revision</Button></div>
  </section></details>;
}

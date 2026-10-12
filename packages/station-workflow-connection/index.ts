import { StationClient, type StationTransport } from "@system-builder/station-sdk";
import { candidateCanonicalText, decodeDesignCandidate, encodeDesignCandidate, type CandidateRecord, type DesignCandidateDocument } from "@system-builder/contracts/design-candidate";
import type { StationCommand, StationContext, StationProjection, StationQuery, StationSessionRef } from "@system-builder/contracts/station-core";
export interface WorkflowConnectionOptions { readonly stationRef:string;readonly coreRef:string;readonly sessionRef:string;readonly scopeRef:string;readonly actorRef:string;readonly actorRevisionRef:string }
export type WorkflowOwnerRead<T> = Readonly<{status:"found";value:T}> | Readonly<{status:"absent"|"unknown";reason?:string}>;
export type WorkflowOwnerResult = Readonly<{status:"retained";commandRef:string;record:CandidateRecord;document:DesignCandidateDocument}> | Readonly<{status:"rejected"|"unknown";commandRef:string;reason:string}>;
const object=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const token=(v:unknown):v is string=>typeof v==="string"&&v.length>0&&v.length<=1024;
async function digest(text:string):Promise<string>{return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text)))).map(v=>v.toString(16).padStart(2,"0")).join("");}
export class WorkflowOwnerConnection {
  readonly #options:WorkflowConnectionOptions;readonly #client:StationClient;readonly #session:StationSessionRef;readonly #context:StationContext;
  #connected=false;#generation=0;#pending:StationCommand|null=null;#sending=false;
  constructor(options:WorkflowConnectionOptions,transport:StationTransport){
    if(!Object.values(options).every(token))throw new Error("WORKFLOW_CONNECTION_CONTEXT_INVALID");
    this.#options=Object.freeze({...options});this.#client=new StationClient({stationRef:options.stationRef,stationVersion:"1.0.0"},transport);
    this.#session={stationRef:options.stationRef,coreRef:options.coreRef,sessionRef:options.sessionRef};this.#context={coreRef:options.coreRef,workspaceRef:options.scopeRef};
  }
  get connected():boolean{return this.#connected;}
  get pendingCommandRef():string|null{return this.#pending?.commandRef??null;}
  disconnect():void{this.#generation++;this.#connected=false;}
  async connect():Promise<boolean>{
    const generation=++this.#generation;this.#connected=false;
    try{const r=await this.#client.handshake();if(generation!==this.#generation)return false;this.#connected=r.ok&&r.hello.coreRef===this.#options.coreRef&&["design.candidate.submit","design.candidate.exact","design.candidate.head","design.candidate.result"].every(capability=>r.hello.capabilityRefs.includes(capability));return this.#connected;}
    catch{if(generation===this.#generation)this.#connected=false;return false;}
  }
  async #query(resourceRef:string,parameters:Record<string,unknown>):Promise<StationProjection|null>{
    if(!this.#connected)return null;const generation=this.#generation;
    const q:StationQuery={requestRef:"request:"+crypto.randomUUID(),session:this.#session,context:this.#context,resourceRef,projectionRef:"projection:"+crypto.randomUUID(),parameters};
    try{const r=await this.#client.query(q);return generation===this.#generation&&this.#connected&&r.ok&&r.value.sourceRef===resourceRef&&r.value.sourceAuthorityRef==="design:candidate-owner"&&r.value.completeness==="KNOWN"?r.value:null;}catch{return null;}
  }
  async #record(input:unknown,artifactId?:string,artifactVersion?:string):Promise<{record:CandidateRecord;document:DesignCandidateDocument}|null>{
    if(!object(input)||Object.keys(input).sort().join(",")!=="artifactId,artifactVersion,digest,ownerRevision,predecessorOwnerRevision,retainedAt,scopeRef,text"||input.scopeRef!==this.#options.scopeRef||!token(input.ownerRevision)||!(input.predecessorOwnerRevision===null||token(input.predecessorOwnerRevision))||typeof input.text!=="string"||typeof input.digest!=="string"||typeof input.retainedAt!=="string"||!Number.isFinite(Date.parse(input.retainedAt)))return null;
    const decoded=decodeDesignCandidate(input.text);if(!decoded.accepted||decoded.text!==input.text||input.artifactId!==decoded.document.artifactId||input.artifactVersion!==decoded.document.artifactVersion||artifactId!==undefined&&input.artifactId!==artifactId||artifactVersion!==undefined&&input.artifactVersion!==artifactVersion||await digest(input.text)!==input.digest)return null;
    return{record:Object.freeze({...input}) as unknown as CandidateRecord,document:decoded.document};
  }
  async exact(artifactId:string,artifactVersion:string):Promise<WorkflowOwnerRead<{record:CandidateRecord;document:DesignCandidateDocument}>>{
    const generation=this.#generation,projection=await this.#query(artifactId,{operation:"exact",artifactVersion});const r=projection?.payload.result;
    if(!object(r))return{status:"unknown"};
    if(r.status==="absent")return{status:"absent"};
    if(r.status!=="found"||projection?.currentness!=="CURRENT")return{status:"unknown"};
    const value=await this.#record(r.value,artifactId,artifactVersion);
    return value&&generation===this.#generation&&this.#connected&&projection.sourceRevisionRef===value.record.ownerRevision?{status:"found",value}:{status:"unknown"};
  }
  async head(artifactId:string):Promise<WorkflowOwnerRead<string>>{
    const projection=await this.#query(artifactId,{operation:"head"}),r=projection?.payload.result;if(!object(r))return{status:"unknown"};
    if(r.status==="absent")return{status:"absent"};
    return r.status==="found"&&projection?.currentness==="CURRENT"&&token(r.value)&&projection.sourceRevisionRef===r.value?{status:"found",value:r.value}:{status:"unknown"};
  }
  async submit(document:DesignCandidateDocument,expectedOwnerRevision:string|null,commandRef="command:"+crypto.randomUUID()):Promise<WorkflowOwnerResult>{
    if(this.#pending)return{status:"unknown",commandRef:this.#pending.commandRef,reason:"recover-pending-command-first"};
    const candidate=encodeDesignCandidate(document);if(!candidate.accepted||!token(commandRef)||!(expectedOwnerRevision===null||token(expectedOwnerRevision)))return{status:"rejected",commandRef,reason:"invalid-candidate"};
    if(!this.#connected)return{status:"unknown",commandRef,reason:"disconnected"};
    const o=this.#options;
    this.#pending={commandRef,session:this.#session,context:this.#context,actorRef:o.actorRef,actorRevisionRef:o.actorRevisionRef,actionRef:"design.candidate.submit",targetRef:document.artifactId,expectedRevisionRef:expectedOwnerRevision,payload:{candidate:candidate.document}};
    return this.#send();
  }
  async #send():Promise<WorkflowOwnerResult>{
    const command=this.#pending;if(!command)return{status:"unknown",commandRef:"",reason:"no-pending-command"};
    if(this.#sending)return{status:"unknown",commandRef:command.commandRef,reason:"command-in-flight"};
    this.#sending=true;const generation=this.#generation;
    try{
      const r=await this.#client.command(command);
      if(generation!==this.#generation||!this.#connected)return{status:"unknown",commandRef:command.commandRef,reason:"disconnected"};
      if(!r.ok||r.value.status==="UNKNOWN")return{status:"unknown",commandRef:command.commandRef,reason:"result-unknown"};
      if(r.value.status==="REJECTED"){this.#pending=null;return{status:"rejected",commandRef:command.commandRef,reason:r.value.diagnostic?.detail??"rejected"};}
      const expected=command.payload.candidate as DesignCandidateDocument;
      const found=await this.exact(expected.artifactId,expected.artifactVersion);
      if(generation!==this.#generation||!this.#connected||found.status!=="found"||found.value.record.ownerRevision!==r.value.resultingRevisionRef||found.value.record.predecessorOwnerRevision!==command.expectedRevisionRef||candidateCanonicalText(found.value.document)!==candidateCanonicalText(expected))return{status:"unknown",commandRef:command.commandRef,reason:"readback-unproven"};
      this.#pending=null;return{status:"retained",commandRef:command.commandRef,...found.value};
    }catch{return{status:"unknown",commandRef:command.commandRef,reason:"result-unknown"};}finally{this.#sending=false;}
  }
  async recover():Promise<WorkflowOwnerResult>{
    const command=this.#pending;if(!command)return{status:"unknown",commandRef:"",reason:"no-pending-command"};
    if(this.#sending)return{status:"unknown",commandRef:command.commandRef,reason:"command-in-flight"};
    const generation=this.#generation,projection=await this.#query(command.commandRef,{operation:"result"}),r=projection?.payload.result;
    if(generation!==this.#generation||!this.#connected||projection?.currentness!=="CURRENT"||!object(r)||r.status!=="found"||!object(r.value)||r.value.commandRef!==command.commandRef)return{status:"unknown",commandRef:command.commandRef,reason:"result-unknown"};
    const receipt=r.value;
    if(receipt.status==="rejected"&&token(receipt.reason)){this.#pending=null;return{status:"rejected",commandRef:command.commandRef,reason:receipt.reason};}
    const expected=command.payload.candidate as DesignCandidateDocument,value=await this.#record(receipt.record,expected.artifactId,expected.artifactVersion);
    if(receipt.status!=="retained"||!value||generation!==this.#generation||!this.#connected||projection?.currentness!=="CURRENT"||projection.sourceRevisionRef!==value.record.ownerRevision||value.record.predecessorOwnerRevision!==command.expectedRevisionRef||candidateCanonicalText(value.document)!==candidateCanonicalText(expected))return{status:"unknown",commandRef:command.commandRef,reason:"readback-unproven"};
    this.#pending=null;return{status:"retained",commandRef:command.commandRef,...value};
  }
  async retry():Promise<WorkflowOwnerResult>{return this.#connected?this.#send():{status:"unknown",commandRef:this.#pending?.commandRef??"",reason:"disconnected"};}
}

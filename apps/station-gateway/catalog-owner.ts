import type {StationCommand,StationCommandReceipt,StationContext,StationProjection,StationQuery,StationSessionRef,StationSubscription} from "@system-builder/contracts/station-core";
import {catalogCanonicalText,catalogFamily,catalogRef,type CatalogEntry} from "@system-builder/contracts/catalog-owner";
import {CatalogOwnerService} from "@system-builder/catalog/owner";
import type {LocalCatalogPrincipal} from "../../packages/catalog/local-authorization.js";
import type {StationCorePort} from "./index.js";
export interface CatalogGatewayBinding{readonly coreRef:string;readonly session:StationSessionRef;readonly context:StationContext}
export class CatalogOwnerCorePort implements StationCorePort {
 constructor(private readonly owner:CatalogOwnerService,private readonly credential:unknown,private readonly principal:LocalCatalogPrincipal,private readonly binding:CatalogGatewayBinding){}
 private check(session:StationSessionRef,context:StationContext):void{
  if(catalogCanonicalText(session)!==catalogCanonicalText(this.binding.session)||catalogCanonicalText(context)!==catalogCanonicalText(this.binding.context)||context.coreRef!==this.binding.coreRef||context.workspaceRef!==this.principal.scopeRef)throw Error("CATALOG_CONTEXT_DENIED");
 }
 async command(command:StationCommand):Promise<StationCommandReceipt>{
  this.check(command.session,command.context);
  const entry=command.payload.entry as CatalogEntry|undefined;
  if(!entry||!catalogFamily(entry.family)||command.actionRef!=="catalog."+entry.family+".register"||command.targetRef!==entry.id||command.actorRef!==this.principal.actorRef||command.actorRevisionRef!==this.principal.actorRevisionRef||Object.keys(command.payload).join(",")!=="entry")
   return{commandRef:command.commandRef,status:"REJECTED",resultingRevisionRef:null,evidenceRefs:[],diagnostic:{code:"STATION_CORE_REJECTED",detail:"CATALOG_COMMAND_DENIED",retryable:false,reconcileRequired:false}};
  const result=await this.owner.register(this.credential,{scopeRef:this.principal.scopeRef,actorRef:command.actorRef,actorRevisionRef:command.actorRevisionRef,commandRef:command.commandRef,expectedOwnerRevision:command.expectedRevisionRef,entry});
  return{commandRef:command.commandRef,status:result.status==="retained"?"ACCEPTED":result.status==="rejected"?"REJECTED":"UNKNOWN",resultingRevisionRef:result.status==="retained"?result.record.ownerRevision:null,evidenceRefs:result.status==="retained"?["catalog-result:"+command.commandRef]:[],diagnostic:result.status==="retained"?null:{code:result.status==="unknown"?"STATION_CORE_UNAVAILABLE":"STATION_CORE_REJECTED",detail:result.reason,retryable:result.status==="unknown",reconcileRequired:result.status==="unknown"||result.reason==="stale-owner-revision"}};
 }
 async query(query:StationQuery):Promise<StationProjection>{
  this.check(query.session,query.context);
  const actor={scopeRef:this.principal.scopeRef,actorRef:this.principal.actorRef,actorRevisionRef:this.principal.actorRevisionRef},p=query.parameters;
  const result=p.operation==="result"?await this.owner.result(this.credential,{...actor,commandRef:query.resourceRef})
   :catalogFamily(p.family)&&p.operation==="exact"&&catalogRef(p.version)?await this.owner.exact(this.credential,{...actor,family:p.family,id:query.resourceRef,version:p.version})
   :catalogFamily(p.family)&&p.operation==="head"?await this.owner.head(this.credential,{...actor,family:p.family,id:query.resourceRef})
   :catalogFamily(p.family)&&p.operation==="list"&&query.resourceRef==="catalog:"+p.family&&typeof p.limit==="number"&&(p.after===null||typeof p.after==="string")?await this.owner.list(this.credential,{...actor,family:p.family,after:p.after,limit:p.limit})
   :{status:"invalid-request" as const};
  const revision=result.status==="found"?typeof result.value==="string"?result.value:"ownerRevision" in result.value?result.value.ownerRevision:"catalog-result:"+query.requestRef:"catalog-source:unknown";
  return{requestRef:query.requestRef,context:query.context,projectionRef:query.projectionRef,projectionRevisionRef:"catalog-projection:"+query.requestRef,sourceRef:query.resourceRef,sourceRevisionRef:revision,sourceAuthorityRef:"catalog:owner",currentness:result.status==="found"?"CURRENT":"UNKNOWN",completeness:result.status==="found"||result.status==="absent"?"KNOWN":"UNKNOWN",payload:{result,meaning:"cataloged-reference-or-software",businessSourceProfile:"operator-trusted-published-process-metadata"}};
 }
 async events(subscription:StationSubscription):Promise<readonly never[]>{this.check(subscription.session,subscription.context);throw Error("CATALOG_EVENTS_UNSUPPORTED");}
}

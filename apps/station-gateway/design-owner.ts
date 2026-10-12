import type { StationCommand, StationCommandReceipt, StationContext, StationProjection, StationQuery, StationSessionRef, StationSubscription } from "@system-builder/contracts/station-core";
import { candidateCanonicalText, type DesignCandidateDocument } from "@system-builder/contracts/design-candidate";
import { DesignCandidateService } from "@system-builder/design";
import type { LocalDesignPrincipal } from "../../packages/design/local-authorization.js";
import type { StationCorePort } from "./index.js";
export interface DesignGatewayBinding {
  readonly coreRef: string; readonly session: StationSessionRef; readonly context: StationContext;
}
export class DesignOwnerCorePort implements StationCorePort {
  constructor(private readonly owner: DesignCandidateService, private readonly credential: unknown, private readonly principal: LocalDesignPrincipal, private readonly binding: DesignGatewayBinding) {}
  private check(session: StationSessionRef, context: StationContext): void {
    if (candidateCanonicalText(session)!==candidateCanonicalText(this.binding.session) || candidateCanonicalText(context)!==candidateCanonicalText(this.binding.context) || context.coreRef!==this.binding.coreRef || context.workspaceRef!==this.principal.scopeRef) throw new Error("DESIGN_CONTEXT_DENIED");
  }
  async command(command: StationCommand): Promise<StationCommandReceipt> {
    this.check(command.session,command.context);
    if (command.actionRef!=="design.candidate.submit" || command.actorRef!==this.principal.actorRef || command.actorRevisionRef!==this.principal.actorRevisionRef || command.payload.candidate===null || typeof command.payload.candidate!=="object" || (command.payload.candidate as Record<string,unknown>).artifactId!==command.targetRef) return {commandRef:command.commandRef,status:"REJECTED",resultingRevisionRef:null,evidenceRefs:[],diagnostic:{code:"STATION_CORE_REJECTED",detail:"DESIGN_COMMAND_DENIED",retryable:false,reconcileRequired:false}};
    const r=await this.owner.submit(this.credential,{scopeRef:this.principal.scopeRef,actorRef:command.actorRef,actorRevisionRef:command.actorRevisionRef,commandRef:command.commandRef,expectedOwnerRevision:command.expectedRevisionRef,candidate:command.payload.candidate as DesignCandidateDocument});
    return {commandRef:command.commandRef,status:r.status==="retained"?"ACCEPTED":r.status==="rejected"?"REJECTED":"UNKNOWN",resultingRevisionRef:r.status==="retained"?r.record.ownerRevision:null,evidenceRefs:r.status==="retained"?["design-result:"+command.commandRef]:[],diagnostic:r.status==="retained"?null:{code:r.status==="unknown"?"STATION_CORE_UNAVAILABLE":"STATION_CORE_REJECTED",detail:r.reason,retryable:r.status==="unknown",reconcileRequired:r.status==="unknown" || r.reason==="stale-owner-revision"}};
  }
  async query(query: StationQuery): Promise<StationProjection> {
    this.check(query.session,query.context);
    const actor={scopeRef:this.principal.scopeRef,actorRef:this.principal.actorRef,actorRevisionRef:this.principal.actorRevisionRef};
    const operation=query.parameters.operation;
    const result=operation==="exact" && typeof query.parameters.artifactVersion==="string"
      ? await this.owner.exact(this.credential,{...actor,artifactId:query.resourceRef,artifactVersion:query.parameters.artifactVersion})
      : operation==="head" ? await this.owner.head(this.credential,{...actor,artifactId:query.resourceRef})
      : operation==="result" ? await this.owner.result(this.credential,{...actor,commandRef:query.resourceRef})
      : {status:"invalid-request" as const};
    const revision=result.status==="found" ? typeof result.value==="string" ? result.value : "ownerRevision" in result.value ? result.value.ownerRevision : result.value.status==="retained" ? result.value.record.ownerRevision : "design-result:rejected" : "design-source:unknown";
    return {requestRef:query.requestRef,context:query.context,projectionRef:query.projectionRef,projectionRevisionRef:"design-projection:"+query.requestRef,sourceRef:query.resourceRef,sourceRevisionRef:revision,sourceAuthorityRef:"design:candidate-owner",currentness:result.status==="found"?"CURRENT":"UNKNOWN",completeness:result.status==="found"||result.status==="absent"?"KNOWN":"UNKNOWN",payload:{result,upstreamStatus:"unresolved",meaning:"technical-candidate-retention"}};
  }
  async events(subscription: StationSubscription): Promise<readonly never[]> { this.check(subscription.session,subscription.context); throw new Error("DESIGN_EVENTS_UNSUPPORTED"); }
}

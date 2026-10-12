import { createHash, timingSafeEqual } from "node:crypto";
import type { AuthorizationDecision } from "@system-builder/contracts/identity-authorization";
import type { CurrentnessQualification, DefinitionRevisionRef } from "@system-builder/contracts/semantic-substrate";
import type { DesignAuthorizationPort } from "./index.js";
export interface LocalDesignPrincipal {
  readonly token: string; readonly actorRef: string; readonly actorRevisionRef: string; readonly scopeRef: string;
  readonly expiresAt: string; readonly revoked: boolean;
}
function revision(id: string, version: string): DefinitionRevisionRef { return { contractVersion: "1.0.0", semanticOwner: "design-local-profile", semanticKind: "qualified-reference", canonicalRef: id, definitionRef: id, revisionOwner: "design-local-profile", revisionDimension: "definition", revisionRef: version }; }
/** Explicit isolated single-operator profile. Not a production identity/provider implementation. */
export class LocalDesignAuthorization implements DesignAuthorizationPort {
  private readonly principal: LocalDesignPrincipal;
  constructor(principal: LocalDesignPrincipal, private readonly clock: () => Date = () => new Date()) {
    if (principal.token.length < 32 || !Number.isFinite(Date.parse(principal.expiresAt)) || !principal.actorRef || !principal.actorRevisionRef || !principal.scopeRef) throw new Error("DESIGN_LOCAL_PRINCIPAL_INVALID");
    this.principal=Object.freeze({...principal});
  }
  authenticate(credential: unknown): LocalDesignPrincipal | null {
    if (typeof credential!=="string" || this.principal.revoked || this.clock().getTime()>=Date.parse(this.principal.expiresAt)) return null;
    const hash=(v:string)=>createHash("sha256").update(v).digest();
    return timingSafeEqual(hash(credential),hash(this.principal.token)) ? this.principal : null;
  }
  async authorize(credential: unknown, request: Parameters<DesignAuthorizationPort["authorize"]>[1]): Promise<AuthorizationDecision> {
    const p=this.authenticate(credential);
    if (!p || p.actorRef!==request.actorRef || p.actorRevisionRef!==request.actorRevisionRef || p.scopeRef!==request.scopeRef || !["design.candidate.submit","design.candidate.read"].includes(request.action)) throw new Error("DESIGN_LOCAL_DENIED");
    const now=this.clock().toISOString(), locality={scopeKind:"STATION" as const,localityRef:"design-local-loopback"};
    const current=(subject:DefinitionRevisionRef):CurrentnessQualification=>({contractVersion:"1.0.0",subject,revisionVector:[{revisionOwner:subject.revisionOwner,revisionDimension:subject.revisionDimension,revisionRef:subject.revisionRef}],temporal:{occurredAt:null,observedAt:now,evaluatedAt:now,effectiveFrom:null,effectiveUntil:p.expiresAt,reconciledAt:null},populationScope:p.scopeRef,localityScope:locality.localityRef,currentnessHorizon:{assessedAt:now,validUntil:p.expiresAt},state:"CURRENT",reason:"explicit single-operator local profile"});
    const identity=revision(p.actorRef,p.actorRevisionRef), evidence=revision("design-local-authentication",p.actorRevisionRef), policy=revision("design-local-policy","1"), grant=revision("design-local-eligibility",p.actorRevisionRef);
    return {contractVersion:"1.0.0",disposition:"ALLOW",request:{contractVersion:"1.0.0",actor:{contractVersion:"1.0.0",identity:{contractVersion:"1.0.0",identity},authentication:{contractVersion:"1.0.0",subjectIdentity:identity,evidence,currentness:current(evidence),locality,state:"AUTHENTICATED"}},authorityPolicy:policy,policyCurrentness:current(policy),authorizationEvidence:{contractVersion:"1.0.0",evidence:grant,currentness:current(grant),locality,state:"SUFFICIENT"},requested:{action:request.action,resource:request.resource,scope:request.scopeRef,locality}}};
  }
}

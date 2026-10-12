import { createHash, timingSafeEqual } from "node:crypto";
import type { AuthorizationDecision } from "@system-builder/contracts/identity-authorization";
import type { CurrentnessQualification, DefinitionRevisionRef } from "@system-builder/contracts/semantic-substrate";
import type { CatalogAuthorizationPort } from "./owner-service.js";
export interface LocalCatalogPrincipal {
  readonly token: string; readonly actorRef: string; readonly actorRevisionRef: string; readonly scopeRef: string;
  readonly expiresAt: string; readonly revoked: boolean; readonly grants: readonly Readonly<{action:string;resource:string}>[];
}
function revision(id: string, version: string): DefinitionRevisionRef { return { contractVersion: "1.0.0", semanticOwner: "catalog-local-profile", semanticKind: "qualified-reference", canonicalRef: id, definitionRef: id, revisionOwner: "catalog-local-profile", revisionDimension: "definition", revisionRef: version }; }
/** Explicit isolated single-operator profile. Not a production identity/provider implementation. */
export class LocalCatalogAuthorization implements CatalogAuthorizationPort {
  private readonly principal: LocalCatalogPrincipal;
  constructor(principal: LocalCatalogPrincipal, private readonly clock: () => Date = () => new Date()) {
    if (principal.token.length < 32 || !Number.isFinite(Date.parse(principal.expiresAt)) || !principal.actorRef || !principal.actorRevisionRef || !principal.scopeRef) throw new Error("CATALOG_LOCAL_PRINCIPAL_INVALID");
    if (!Array.isArray(principal.grants) || principal.grants.length < 1 || principal.grants.length > 16 || principal.grants.some(g => !["catalog.software.register","catalog.software.read","catalog.business.register","catalog.business.read","catalog.result.read"].includes(g.action) || typeof g.resource !== "string" || !g.resource || g.resource.length > 512)) throw Error("CATALOG_LOCAL_GRANTS_INVALID");
    this.principal=Object.freeze({...principal,grants:Object.freeze(principal.grants.map(g=>Object.freeze({...g}))) });
  }
  authenticate(credential: unknown): LocalCatalogPrincipal | null {
    if (typeof credential!=="string" || this.principal.revoked || this.clock().getTime()>=Date.parse(this.principal.expiresAt)) return null;
    const hash=(v:string)=>createHash("sha256").update(v).digest();
    return timingSafeEqual(hash(credential),hash(this.principal.token)) ? this.principal : null;
  }
  async authorize(credential: unknown, request: Parameters<CatalogAuthorizationPort["authorize"]>[1]): Promise<AuthorizationDecision> {
    const p=this.authenticate(credential);
    if (!p || p.actorRef!==request.actorRef || p.actorRevisionRef!==request.actorRevisionRef || p.scopeRef!==request.scopeRef || !p.grants.some(g=>g.action===request.action&&(g.resource==="*"||g.resource===request.resource))) throw new Error("CATALOG_LOCAL_DENIED");
    const now=this.clock().toISOString(), locality={scopeKind:"STATION" as const,localityRef:"catalog-local-loopback"};
    const current=(subject:DefinitionRevisionRef):CurrentnessQualification=>({contractVersion:"1.0.0",subject,revisionVector:[{revisionOwner:subject.revisionOwner,revisionDimension:subject.revisionDimension,revisionRef:subject.revisionRef}],temporal:{occurredAt:null,observedAt:now,evaluatedAt:now,effectiveFrom:null,effectiveUntil:p.expiresAt,reconciledAt:null},populationScope:p.scopeRef,localityScope:locality.localityRef,currentnessHorizon:{assessedAt:now,validUntil:p.expiresAt},state:"CURRENT",reason:"explicit single-operator local profile"});
    const identity=revision(p.actorRef,p.actorRevisionRef), evidence=revision("catalog-local-authentication",p.actorRevisionRef), policy=revision("catalog-local-policy","1"), grant=revision("catalog-local-eligibility",p.actorRevisionRef);
    return {contractVersion:"1.0.0",disposition:"ALLOW",request:{contractVersion:"1.0.0",actor:{contractVersion:"1.0.0",identity:{contractVersion:"1.0.0",identity},authentication:{contractVersion:"1.0.0",subjectIdentity:identity,evidence,currentness:current(evidence),locality,state:"AUTHENTICATED"}},authorityPolicy:policy,policyCurrentness:current(policy),authorizationEvidence:{contractVersion:"1.0.0",evidence:grant,currentness:current(grant),locality,state:"SUFFICIENT"},requested:{action:request.action,resource:request.resource,scope:request.scopeRef,locality}}};
  }
}

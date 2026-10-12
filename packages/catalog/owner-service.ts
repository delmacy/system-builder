import { createHash } from "node:crypto";
import { assertCatalogJson, catalogCanonicalText, catalogFamily, catalogRef, encodeCatalogEntry, type CatalogActor, type CatalogEntry, type CatalogExact, type CatalogFamily, type CatalogHead, type CatalogList, type CatalogPage, type CatalogRead, type CatalogReceipt, type CatalogRecord, type CatalogRegistration, type SoftwarePayload } from "@system-builder/contracts/catalog-owner";
import { normalizeAuthorizationDecision, type AuthorizationDecision } from "@system-builder/contracts/identity-authorization";
import { SoftwareCatalogRegistry, admitCatalogProcessRevision, type CatalogProcessRevisionAdmissionInput } from "./index.js";
export interface CatalogAuthorizationPort { authorize(credential: unknown, request: CatalogActor & { action: string; resource: string }): Promise<AuthorizationDecision> }
export interface CatalogTrustedSourcePort { resolve(scopeRef: string, sourceRef: string): Promise<CatalogProcessRevisionAdmissionInput | null> }
export interface CatalogCommit { readonly request: CatalogRegistration; readonly fingerprint: string; readonly text: string; readonly digest: string; readonly retainedAt: string }
export interface CatalogOwnerRepository {
  commit(input: CatalogCommit): Promise<CatalogReceipt>;
  exact(scope: string, family: CatalogFamily, id: string, version: string): Promise<CatalogRecord | null>;
  head(scope: string, family: CatalogFamily, id: string): Promise<string | null>;
  list(input: CatalogList): Promise<CatalogPage>;
  result(scope: string, actor: string, command: string): Promise<CatalogReceipt | null>;
}
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const who = (a: CatalogActor) => !!a && catalogRef(a.scopeRef) && catalogRef(a.actorRef) && catalogRef(a.actorRevisionRef);
const inert = (v: unknown) => { try { assertCatalogJson(v); return true; } catch { return false; } };
const snapshot = <T>(v: T): T => JSON.parse(catalogCanonicalText(v)) as T;
export class CatalogOwnerService {
  constructor(private readonly repository: CatalogOwnerRepository, private readonly authorization: CatalogAuthorizationPort, private readonly sources: CatalogTrustedSourcePort, private readonly clock: () => Date = () => new Date()) {}
  private async eligible(credential: unknown, actor: CatalogActor, action: string, resource: string): Promise<boolean> {
    try {
      const d = normalizeAuthorizationDecision(await this.authorization.authorize(credential,{scopeRef:actor.scopeRef,actorRef:actor.actorRef,actorRevisionRef:actor.actorRevisionRef,action,resource}));
      const r = d.request, i = r.actor.identity.identity, now = this.clock().getTime();
      return d.disposition === "ALLOW" && i.canonicalRef === actor.actorRef && i.revisionRef === actor.actorRevisionRef &&
        r.requested.scope === actor.scopeRef && r.requested.action === action && r.requested.resource === resource &&
        [r.actor.authentication.currentness,r.policyCurrentness,r.authorizationEvidence.currentness].every(q =>
          q.state === "CURRENT" && q.populationScope === actor.scopeRef && Date.parse(q.currentnessHorizon.assessedAt) <= now && now < Date.parse(q.currentnessHorizon.validUntil) &&
          (q.temporal.effectiveFrom === null || Date.parse(q.temporal.effectiveFrom) <= now) && (q.temporal.effectiveUntil === null || now < Date.parse(q.temporal.effectiveUntil)));
    } catch { return false; }
  }
  private async source(entry: CatalogEntry, scope: string): Promise<boolean> {
    if (entry.family === "software") return true;
    try {
      const payload = entry.payload as {sourceRef:string;revisionNumber:number;immutableContentRef:string};
      const resolved = await this.sources.resolve(scope,payload.sourceRef);
      if (!resolved) return false;
      const admitted = admitCatalogProcessRevision(resolved);
      return admitted.lifecycleState === "active" && admitted.artifactRef === entry.id && admitted.revisionRef === entry.version &&
        admitted.revisionNumber === payload.revisionNumber && admitted.immutableContentRef === payload.immutableContentRef;
    } catch { return false; }
  }
  async register(credential: unknown, input: CatalogRegistration): Promise<CatalogReceipt> {
    const commandRef = inert(input) && catalogRef(input?.commandRef) ? input.commandRef : "";
    const reject = (reason: "invalid-request"|"denied"|"source-unavailable"): CatalogReceipt => ({status:"rejected",commandRef,reason});
    if (!inert(input) || !input || !who(input) || !commandRef || !(input.expectedOwnerRevision === null || catalogRef(input.expectedOwnerRevision)) ||
      Object.keys(input).sort().join(",") !== "actorRef,actorRevisionRef,commandRef,entry,expectedOwnerRevision,scopeRef") return reject("invalid-request");
    let encoded = encodeCatalogEntry(input.entry); if (!encoded.accepted) return reject("invalid-request");
    if (encoded.entry.family === "software") {
      try { encoded = encodeCatalogEntry({...encoded.entry,payload:new SoftwareCatalogRegistry().register(encoded.entry.payload as SoftwarePayload)}); }
      catch { return reject("invalid-request"); }
      if (!encoded.accepted) return reject("invalid-request");
    }
    const request = snapshot({...input,entry:encoded.entry});
    if (!await this.eligible(credential,request,"catalog."+request.entry.family+".register",request.entry.id)) return reject("denied");
    if (!await this.source(request.entry,request.scopeRef)) return reject("source-unavailable");
    try { return await this.repository.commit({request,fingerprint:sha(catalogCanonicalText(request)),text:encoded.text,digest:sha(encoded.text),retainedAt:this.clock().toISOString()}); }
    catch { return {status:"unknown",commandRef,reason:"unavailable"}; }
  }
  private async verified(record: CatalogRecord | null): Promise<CatalogRecord | null> {
    if (!record) return null;
    const decoded = encodeCatalogEntry(JSON.parse(record.text));
    if (!decoded.accepted || decoded.text !== record.text || sha(record.text) !== record.digest || decoded.entry.family !== record.family || decoded.entry.id !== record.id || decoded.entry.version !== record.version ||
        !await this.source(decoded.entry,record.scopeRef)) throw Error("CATALOG_READ_UNQUALIFIED");
    return record;
  }
  async exact(credential: unknown, input: CatalogExact): Promise<CatalogRead<CatalogRecord>> {
    if (!inert(input) || !who(input) || !catalogFamily(input.family) || !catalogRef(input.id) || !catalogRef(input.version)) return {status:"invalid-request"};
    const q = snapshot(input);
    if (!await this.eligible(credential,q,"catalog."+q.family+".read",q.id)) return {status:"denied"};
    try { const value = await this.verified(await this.repository.exact(q.scopeRef,q.family,q.id,q.version)); return value ? {status:"found",value} : {status:"absent"}; } catch { return {status:"unavailable"}; }
  }
  async head(credential: unknown, input: CatalogHead): Promise<CatalogRead<string>> {
    if (!inert(input) || !who(input) || !catalogFamily(input.family) || !catalogRef(input.id)) return {status:"invalid-request"};
    const q = snapshot(input);
    if (!await this.eligible(credential,q,"catalog."+q.family+".read",q.id)) return {status:"denied"};
    try { const value=await this.repository.head(q.scopeRef,q.family,q.id); return value ? {status:"found",value} : {status:"absent"}; } catch { return {status:"unavailable"}; }
  }
  async list(credential: unknown, input: CatalogList): Promise<CatalogRead<CatalogPage>> {
    if (!inert(input) || !who(input) || !catalogFamily(input.family) || !(input.after === null || typeof input.after === "string" && input.after.length <= 2048 && ![...input.after].some(c => c.charCodeAt(0) < 32)) || !Number.isInteger(input.limit) || input.limit < 1 || input.limit > 50) return {status:"invalid-request"};
    const q=snapshot(input);
    if (!await this.eligible(credential,q,"catalog."+q.family+".read","catalog:"+q.family)) return {status:"denied"};
    try { const page=await this.repository.list(q); if (page.records.length>q.limit) throw Error("CATALOG_PAGE_INVALID"); for (const record of page.records) await this.verified(record); return {status:"found",value:page}; } catch { return {status:"unavailable"}; }
  }
  async result(credential: unknown, input: CatalogActor & {commandRef:string}): Promise<CatalogRead<CatalogReceipt>> {
    if (!inert(input) || !who(input) || !catalogRef(input.commandRef)) return {status:"invalid-request"};
    const q=snapshot(input);
    if (!await this.eligible(credential,q,"catalog.result.read",q.commandRef)) return {status:"denied"};
    try { const value=await this.repository.result(q.scopeRef,q.actorRef,q.commandRef); if(value?.status==="retained") { if (!await this.eligible(credential,q,"catalog."+value.record.family+".read",value.record.id)) return {status:"denied"}; await this.verified(value.record); } return value ? {status:"found",value} : {status:"absent"}; } catch { return {status:"unavailable"}; }
  }
}

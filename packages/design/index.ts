import { createHash } from "node:crypto";
import { assertCandidateJson, candidateCanonicalText, encodeDesignCandidate, type CandidateActor, type CandidateHeadQuery, type CandidateQuery, type CandidateRead, type CandidateReceipt, type CandidateRecord, type CandidateResultQuery, type SubmitCandidate } from "@system-builder/contracts/design-candidate";
import { normalizeAuthorizationDecision, type AuthorizationDecision } from "@system-builder/contracts/identity-authorization";

export interface DesignAuthorizationPort {
  /** Credential is supplied by trusted ingress; the decision is produced server-side. */
  authorize(credential: unknown, request: CandidateActor & { action: string; resource: string }): Promise<AuthorizationDecision>;
}
export interface CandidateCommit {
  readonly request: SubmitCandidate; readonly fingerprint: string; readonly text: string; readonly digest: string; readonly retainedAt: string;
}
export interface DesignCandidateRepository {
  /** Must atomically serialize head check, immutable tuple retention and result ledger, including rejected commands. */
  commit(input: CandidateCommit): Promise<CandidateReceipt>;
  exact(scopeRef: string, artifactId: string, artifactVersion: string): Promise<CandidateRecord | null>;
  head(scopeRef: string, artifactId: string): Promise<string | null>;
  result(scopeRef: string, actorRef: string, commandRef: string): Promise<CandidateReceipt | null>;
}
const sha256 = (text: string): string => createHash("sha256").update(text).digest("hex");
const ref = (v: unknown): v is string => typeof v === "string" && v.length > 0 && v.length <= 1024 && ![...v].some(c => c.charCodeAt(0) < 32);
function actor(v: CandidateActor): boolean { return ref(v.scopeRef) && ref(v.actorRef) && ref(v.actorRevisionRef); }
function inert(input: unknown): boolean { try { assertCandidateJson(input); return true; } catch { return false; } }
function frozen<T>(v: T): T { if (v !== null && typeof v === "object") { Object.values(v).forEach(frozen); Object.freeze(v); } return v; }
export class DesignCandidateService {
  constructor(private readonly repository: DesignCandidateRepository, private readonly authorization: DesignAuthorizationPort, private readonly clock: () => Date = () => new Date()) {}
  private async eligible(credential: unknown, who: CandidateActor, action: string, resource: string): Promise<boolean> {
    try {
      const d = normalizeAuthorizationDecision(await this.authorization.authorize(credential, { ...who, action, resource }));
      const r = d.request, identity = r.actor.identity.identity, now = this.clock().getTime();
      const current = [r.actor.authentication.currentness, r.policyCurrentness, r.authorizationEvidence.currentness].every(q => q.state === "CURRENT" && q.populationScope === who.scopeRef && Date.parse(q.currentnessHorizon.assessedAt) <= now && now < Date.parse(q.currentnessHorizon.validUntil) && (q.temporal.effectiveFrom === null || Date.parse(q.temporal.effectiveFrom) <= now) && (q.temporal.effectiveUntil === null || now < Date.parse(q.temporal.effectiveUntil)));
      return d.disposition === "ALLOW" && identity.canonicalRef === who.actorRef && identity.revisionRef === who.actorRevisionRef && r.requested.scope === who.scopeRef && r.requested.action === action && r.requested.resource === resource && current;
    } catch { return false; }
  }
  async submit(credential: unknown, input: SubmitCandidate): Promise<CandidateReceipt> {
    const commandRef = inert(input) && ref(input?.commandRef) ? input.commandRef : "";
    const reject = (reason: "invalid-request" | "denied"): CandidateReceipt => ({ status: "rejected", commandRef, reason });
    if (!inert(input) || !input || !actor(input) || !commandRef || !(input.expectedOwnerRevision === null || ref(input.expectedOwnerRevision))) return reject("invalid-request");
    const encoded = encodeDesignCandidate(input.candidate); if (!encoded.accepted) return reject("invalid-request");
    // Snapshot before await: caller mutation cannot change authority, fingerprint or retained text.
    const request = frozen(JSON.parse(candidateCanonicalText({ ...input, candidate: encoded.document })) as SubmitCandidate);
    if (!await this.eligible(credential, request, "design.candidate.submit", request.candidate.artifactId)) return reject("denied");
    try { return await this.repository.commit({ request, fingerprint: sha256(candidateCanonicalText(request)), text: encoded.text, digest: sha256(encoded.text), retainedAt: this.clock().toISOString() }); }
    catch { return { status: "unknown", commandRef, reason: "unavailable" }; }
  }
  private async read<T>(credential: unknown, input: CandidateActor, resource: string, load: () => Promise<T | null>): Promise<CandidateRead<T>> {
    if (!await this.eligible(credential, input, "design.candidate.read", resource)) return { status: "denied" };
    try { const value = await load(); return value === null ? { status: "absent" } : { status: "found", value }; } catch { return { status: "unavailable" }; }
  }
  async exact(credential: unknown, input: CandidateQuery): Promise<CandidateRead<CandidateRecord>> {
    if (!inert(input) || !input || !actor(input) || !ref(input.artifactId) || !ref(input.artifactVersion)) return { status: "invalid-request" };
    const q = frozen({ ...input }); return this.read(credential, q, q.artifactId, () => this.repository.exact(q.scopeRef, q.artifactId, q.artifactVersion));
  }
  async head(credential: unknown, input: CandidateHeadQuery): Promise<CandidateRead<string>> {
    if (!inert(input) || !input || !actor(input) || !ref(input.artifactId)) return { status: "invalid-request" };
    const q = frozen({ ...input }); return this.read(credential, q, q.artifactId, () => this.repository.head(q.scopeRef, q.artifactId));
  }
  async result(credential: unknown, input: CandidateResultQuery): Promise<CandidateRead<CandidateReceipt>> {
    if (!inert(input) || !input || !actor(input) || !ref(input.commandRef)) return { status: "invalid-request" };
    const q = frozen({ ...input }); return this.read(credential, q, q.commandRef, () => this.repository.result(q.scopeRef, q.actorRef, q.commandRef));
  }
}
/** Isolated model for contract tests only. Not durable and never an O1–O4 readiness implementation. */
export class MemoryDesignCandidateRepository implements DesignCandidateRepository {
  private readonly records = new Map<string, CandidateRecord>();
  private readonly heads = new Map<string, string>();
  private readonly ledger = new Map<string, { fingerprint: string; receipt: CandidateReceipt }>();
  private sequence = 0;
  private key(...parts: string[]): string { return JSON.stringify(parts); }
  async commit(input: CandidateCommit): Promise<CandidateReceipt> {
    const r = input.request, c = r.candidate, key = this.key(r.scopeRef, r.actorRef, r.commandRef), old = this.ledger.get(key);
    if (old) return old.fingerprint === input.fingerprint ? old.receipt : { status: "rejected", commandRef: r.commandRef, reason: "command-conflict" };
    const tuple = this.key(r.scopeRef, c.artifactId, c.artifactVersion), headKey = this.key(r.scopeRef, c.artifactId), head = this.heads.get(headKey) ?? null;
    let receipt: CandidateReceipt;
    if (this.records.has(tuple)) receipt = { status: "rejected", commandRef: r.commandRef, reason: "immutable-conflict" };
    else if (head !== r.expectedOwnerRevision) receipt = { status: "rejected", commandRef: r.commandRef, reason: "stale-owner-revision" };
    else {
      const record: CandidateRecord = frozen({ scopeRef: r.scopeRef, artifactId: c.artifactId, artifactVersion: c.artifactVersion, ownerRevision: `design-revision:${++this.sequence}`, predecessorOwnerRevision: head, text: input.text, digest: input.digest, retainedAt: input.retainedAt });
      this.records.set(tuple, record); this.heads.set(headKey, record.ownerRevision);
      receipt = { status: "retained", commandRef: r.commandRef, record };
    }
    frozen(receipt); this.ledger.set(key, { fingerprint: input.fingerprint, receipt }); return receipt;
  }
  async exact(scope: string, id: string, version: string): Promise<CandidateRecord | null> { return this.records.get(this.key(scope, id, version)) ?? null; }
  async head(scope: string, id: string): Promise<string | null> { return this.heads.get(this.key(scope, id)) ?? null; }
  async result(scope: string, actorRef: string, command: string): Promise<CandidateReceipt | null> { return this.ledger.get(this.key(scope, actorRef, command))?.receipt ?? null; }
}

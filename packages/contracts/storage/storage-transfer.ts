export const STORAGE_TRANSFER_CONTRACT_VERSION = "1.0.0" as const;

export type TransferMode = "COMPLETE" | "MULTIPART" | "RESUMED" | "REPLAY" | "OFFLINE_RECONCILIATION";
export type TransferState = "PENDING" | "TRANSFERRING" | "ACKNOWLEDGED" | "COMPLETED" | "FAILED" | "PARTIAL" | "UNKNOWN";
export type EvidenceCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type CurrentnessState = "CURRENT" | "STALE" | "UNKNOWN";
export type ProviderQualificationState = "QUALIFIED" | "UNQUALIFIED" | "UNKNOWN";
export type QualifiedAvailability = "AVAILABLE" | "UNAVAILABLE" | "INCONCLUSIVE" | "UNKNOWN";
export type RetryDisposition = "SAFE_TO_RETRY" | "RECONCILE_REQUIRED" | "DO_NOT_RETRY";

type Currentness = Readonly<{ state: CurrentnessState; assessedAt: string; validUntil: string }>;
export type ProviderQualificationEvidence = Readonly<{
  providerRef: string;
  qualificationRevisionRef: string;
  state: ProviderQualificationState;
  currentness: Currentness;
}>;

export type StorageTransferEvidence = Readonly<{
  contractVersion: typeof STORAGE_TRANSFER_CONTRACT_VERSION;
  transferRef: string;
  attemptRef: string;
  lineageRootRef: string;
  predecessorAttemptRef: string | null;
  canonicalObjectRef: string;
  canonicalRevisionRef: string;
  providerCopyRef: string;
  providerRef: string;
  mode: TransferMode;
  state: TransferState;
  acknowledgedAt: string | null;
  integrityVerified: boolean | null;
  durabilityEvidenceRef: string | null;
  resumeCheckpointRef: string | null;
  completeness: EvidenceCompleteness;
  currentness: Currentness;
  providerQualification: ProviderQualificationEvidence;
}>;

type R = Record<string, unknown>;
const rec = (v: unknown, l: string): R => { if (typeof v !== "object" || v === null || Array.isArray(v)) throw new Error(`${l} must be an object`); return v as R; };
const exact = (r: R, f: readonly string[], l: string) => { for (const k of Object.keys(r)) if (!f.includes(k)) throw new Error(`${l} has unexpected field ${k}`); for (const k of f) if (!(k in r)) throw new Error(`${l} is missing field ${k}`); };
const str = (v: unknown, l: string) => { if (typeof v !== "string" || !v.trim()) throw new Error(`${l} must be a non-empty string`); return v.trim(); };
const ts = (v: unknown, l: string) => { const s = str(v, l); if (!Number.isFinite(Date.parse(s))) throw new Error(`${l} must be an ISO timestamp`); return s; };
const en = <T extends string>(v: unknown, a: readonly T[], l: string): T => { if (!a.includes(v as T)) throw new Error(`invalid ${l}`); return v as T; };
const nullableString = (v: unknown, l: string) => v === null ? null : str(v, l);

function currentness(v: unknown): Currentness {
  const r = rec(v, "currentness"); exact(r, ["state", "assessedAt", "validUntil"], "currentness");
  const assessedAt = ts(r.assessedAt, "assessedAt"); const validUntil = ts(r.validUntil, "validUntil");
  if (Date.parse(validUntil) < Date.parse(assessedAt)) throw new Error("currentness horizon cannot end before assessment");
  return Object.freeze({ state: en(r.state, ["CURRENT", "STALE", "UNKNOWN"] as const, "currentness state"), assessedAt, validUntil });
}

function qualification(v: unknown): ProviderQualificationEvidence {
  const r = rec(v, "provider qualification"); exact(r, ["providerRef", "qualificationRevisionRef", "state", "currentness"], "provider qualification");
  return Object.freeze({ providerRef: str(r.providerRef, "providerRef"), qualificationRevisionRef: str(r.qualificationRevisionRef, "qualificationRevisionRef"), state: en(r.state, ["QUALIFIED", "UNQUALIFIED", "UNKNOWN"] as const, "qualification state"), currentness: currentness(r.currentness) });
}

export function normalizeStorageTransferEvidence(input: unknown): StorageTransferEvidence {
  const r = rec(input, "storage transfer evidence");
  exact(r, ["contractVersion","transferRef","attemptRef","lineageRootRef","predecessorAttemptRef","canonicalObjectRef","canonicalRevisionRef","providerCopyRef","providerRef","mode","state","acknowledgedAt","integrityVerified","durabilityEvidenceRef","resumeCheckpointRef","completeness","currentness","providerQualification"], "storage transfer evidence");
  if (r.contractVersion !== STORAGE_TRANSFER_CONTRACT_VERSION) throw new Error("unsupported storage transfer contract version");
  if (r.integrityVerified !== null && typeof r.integrityVerified !== "boolean") throw new Error("integrityVerified must be boolean or null");
  const q = qualification(r.providerQualification); const providerRef = str(r.providerRef, "providerRef");
  if (q.providerRef !== providerRef) throw new Error("provider qualification must match transfer provider");
  const transferRef = str(r.transferRef, "transferRef");
  const attemptRef = str(r.attemptRef, "attemptRef");
  const canonicalObjectRef = str(r.canonicalObjectRef, "canonicalObjectRef");
  const canonicalRevisionRef = str(r.canonicalRevisionRef, "canonicalRevisionRef");
  const providerCopyRef = str(r.providerCopyRef, "providerCopyRef");
  const identityRefs = [transferRef, attemptRef, canonicalObjectRef, canonicalRevisionRef, providerCopyRef];
  if (new Set(identityRefs).size !== identityRefs.length) throw new Error("transfer/attempt identity must remain distinct from canonical object, revision and provider copy identity");
  const mode = en(r.mode, ["COMPLETE","MULTIPART","RESUMED","REPLAY","OFFLINE_RECONCILIATION"] as const, "transfer mode");
  const predecessorAttemptRef = nullableString(r.predecessorAttemptRef, "predecessorAttemptRef");
  const resumeCheckpointRef = nullableString(r.resumeCheckpointRef, "resumeCheckpointRef");
  if ((mode === "RESUMED" || mode === "REPLAY") && predecessorAttemptRef === null) throw new Error("resumed/replayed transfer requires predecessor lineage");
  if (mode === "RESUMED" && resumeCheckpointRef === null) throw new Error("resumed transfer requires checkpoint evidence");
  return Object.freeze({
    contractVersion: STORAGE_TRANSFER_CONTRACT_VERSION,
    transferRef, attemptRef, lineageRootRef: str(r.lineageRootRef, "lineageRootRef"), predecessorAttemptRef,
    canonicalObjectRef, canonicalRevisionRef, providerCopyRef, providerRef,
    mode, state: en(r.state, ["PENDING","TRANSFERRING","ACKNOWLEDGED","COMPLETED","FAILED","PARTIAL","UNKNOWN"] as const, "transfer state"), acknowledgedAt: r.acknowledgedAt === null ? null : ts(r.acknowledgedAt, "acknowledgedAt"),
    integrityVerified: r.integrityVerified as boolean | null, durabilityEvidenceRef: nullableString(r.durabilityEvidenceRef, "durabilityEvidenceRef"), resumeCheckpointRef,
    completeness: en(r.completeness, ["KNOWN","PARTIAL","UNKNOWN"] as const, "evidence completeness"), currentness: currentness(r.currentness), providerQualification: q,
  });
}

const currentAt = (c: Currentness, at: number) => c.state === "CURRENT" && at >= Date.parse(c.assessedAt) && at <= Date.parse(c.validUntil);

export function assessQualifiedProviderCopyAvailability(e: StorageTransferEvidence, evaluatedAt: string): QualifiedAvailability {
  const at = Date.parse(ts(evaluatedAt, "evaluatedAt"));
  if (e.completeness !== "KNOWN" || !currentAt(e.currentness, at)) return "UNKNOWN";
  if (!currentAt(e.providerQualification.currentness, at)) return "UNKNOWN";
  if (e.providerQualification.state === "UNKNOWN") return "UNKNOWN";
  if (e.providerQualification.state === "UNQUALIFIED") return "UNAVAILABLE";
  if (e.state === "FAILED") return "UNAVAILABLE";
  if (e.state !== "COMPLETED") return e.state === "UNKNOWN" || e.state === "PARTIAL" ? "UNKNOWN" : "INCONCLUSIVE";
  if (e.integrityVerified !== true || e.durabilityEvidenceRef === null) return "INCONCLUSIVE";
  return "AVAILABLE";
}

export function retryDisposition(e: StorageTransferEvidence, evaluatedAt: string): RetryDisposition {
  const at = Date.parse(ts(evaluatedAt, "evaluatedAt"));
  if (e.completeness !== "KNOWN" || !currentAt(e.currentness, at) || e.state === "UNKNOWN" || e.state === "PARTIAL") return "RECONCILE_REQUIRED";
  if (!currentAt(e.providerQualification.currentness, at) || e.providerQualification.state !== "QUALIFIED") return "RECONCILE_REQUIRED";
  if (assessQualifiedProviderCopyAvailability(e, evaluatedAt) === "AVAILABLE") return "DO_NOT_RETRY";
  return e.state === "FAILED" ? "SAFE_TO_RETRY" : "RECONCILE_REQUIRED";
}

export function assertTransferContinuation(previous: StorageTransferEvidence, next: StorageTransferEvidence): void {
  if (next.predecessorAttemptRef !== previous.attemptRef) throw new Error("transfer continuation predecessor mismatch");
  for (const key of ["lineageRootRef","canonicalObjectRef","canonicalRevisionRef","providerCopyRef","providerRef"] as const) if (next[key] !== previous[key]) throw new Error(`transfer continuation ${key} mismatch`);
}

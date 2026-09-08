import { ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION, normalizeQuestionOccurrenceContext, normalizeQuestionOccurrenceIdentity, type QuestionOccurrenceContext, type QuestionOccurrenceIdentity } from "./index.js";

export const EKB_CAPABILITY_LENS_ROUTE_OUTCOMES = ["ROUTED", "MULTI_CANDIDATE", "INCONCLUSIVE"] as const;
export type EKBCapabilityLensRouteOutcome = (typeof EKB_CAPABILITY_LENS_ROUTE_OUTCOMES)[number];

export type EKBCapabilityLensRevision = Readonly<{ lensRef: string; revisionRef: string }>;
export type EKBSemanticOwnerCandidate = Readonly<{ ownerRef: string; authorityRef: string }>;
export type EKBCapabilityLensRoute = Readonly<{
  contractVersion: typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
  routeRef: string;
  sourceFollowUpRef: string;
  producingLensRevision: EKBCapabilityLensRevision;
  sourceOccurrence: QuestionOccurrenceIdentity;
  sourceContext: QuestionOccurrenceContext;
  targetOwners: readonly EKBSemanticOwnerCandidate[];
  outcome: EKBCapabilityLensRouteOutcome;
  rationale: string;
}>;

type UnknownRecord = Record<string, unknown>;
function asRecord(value: unknown, label: string): UnknownRecord { if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`); return value as UnknownRecord; }
function exact(record: UnknownRecord, fields: readonly string[], label: string): void { for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`); for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`); }
function nonEmpty(value: unknown, field: string): string { if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} must be a non-empty string`); return value.trim(); }
function oneOf<T extends readonly string[]>(value: unknown, allowed: T, field: string): T[number] { if (typeof value !== "string" || !allowed.includes(value)) throw new Error(`${field} must be one of ${allowed.join(", ")}`); return value as T[number]; }
function normalizeLens(value: unknown): EKBCapabilityLensRevision { const r = asRecord(value, "capability lens revision"); exact(r, ["lensRef", "revisionRef"], "capability lens revision"); return Object.freeze({ lensRef: nonEmpty(r.lensRef, "producingLensRevision.lensRef"), revisionRef: nonEmpty(r.revisionRef, "producingLensRevision.revisionRef") }); }
function normalizeOwner(value: unknown): EKBSemanticOwnerCandidate { const r = asRecord(value, "semantic owner candidate"); exact(r, ["ownerRef", "authorityRef"], "semantic owner candidate"); return Object.freeze({ ownerRef: nonEmpty(r.ownerRef, "targetOwners.ownerRef"), authorityRef: nonEmpty(r.authorityRef, "targetOwners.authorityRef") }); }

export function normalizeEKBCapabilityLensRoute(input: unknown): EKBCapabilityLensRoute {
  const record = asRecord(input, "EKB capability lens route");
  exact(record, ["contractVersion", "routeRef", "sourceFollowUpRef", "producingLensRevision", "sourceOccurrence", "sourceContext", "targetOwners", "outcome", "rationale"], "EKB capability lens route");
  if (record.contractVersion !== ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION) throw new Error(`unsupported EKB contract version: ${String(record.contractVersion)}`);
  if (!Array.isArray(record.targetOwners)) throw new Error("targetOwners must be an array");
  const targetOwners = Object.freeze(record.targetOwners.map(normalizeOwner));
  const outcome = oneOf(record.outcome, EKB_CAPABILITY_LENS_ROUTE_OUTCOMES, "outcome");
  if (outcome === "ROUTED" && targetOwners.length !== 1) throw new Error("ROUTED requires exactly one explicit semantic owner candidate");
  if (outcome === "MULTI_CANDIDATE" && targetOwners.length < 2) throw new Error("MULTI_CANDIDATE requires multiple explicit semantic owner candidates");
  if (outcome === "INCONCLUSIVE" && targetOwners.length !== 0) throw new Error("INCONCLUSIVE must not choose or fabricate a semantic owner");
  const ownerKeys = targetOwners.map((candidate) => `${candidate.ownerRef}\u0000${candidate.authorityRef}`);
  if (new Set(ownerKeys).size !== ownerKeys.length) throw new Error("targetOwners must not duplicate semantic owner candidates");
  return Object.freeze({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    routeRef: nonEmpty(record.routeRef, "routeRef"),
    sourceFollowUpRef: nonEmpty(record.sourceFollowUpRef, "sourceFollowUpRef"),
    producingLensRevision: normalizeLens(record.producingLensRevision),
    sourceOccurrence: normalizeQuestionOccurrenceIdentity(record.sourceOccurrence),
    sourceContext: normalizeQuestionOccurrenceContext(record.sourceContext),
    targetOwners,
    outcome,
    rationale: nonEmpty(record.rationale, "rationale"),
  });
}

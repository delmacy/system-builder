export const COMMERCIAL_CONTRACT_VERSION = "1.0.0" as const;

export type CommercialFactState = "CURRENT" | "NOT_YET_EFFECTIVE" | "EXPIRED" | "STALE" | "CONFLICTED" | "UNKNOWN";
export type CommercialFactCurrentness = "CURRENT" | "STALE" | "UNKNOWN";
export type CommercialFactPopulation = "COMPLETE" | "PARTIAL" | "UNKNOWN";

export type CommercialRevision = Readonly<{
  id: string;
  revisionRef: string;
  scopeRef: string;
  provenanceRef: string;
  effectiveAt: string;
  effectiveUntil?: string;
  supersedesRevisionRef?: string;
  currentness: CommercialFactCurrentness;
  population: CommercialFactPopulation;
}>;

export type CommercialProduct = CommercialRevision & Readonly<{ kind: "PRODUCT" }>;
export type CommercialOffer = CommercialRevision & Readonly<{ kind: "OFFER"; productRef: string }>;
export type CommercialPlan = CommercialRevision & Readonly<{ kind: "PLAN"; offerRef: string }>;
export type CommercialPrice = CommercialRevision & Readonly<{ kind: "PRICE"; planRef: string; amountMinor: number; currency: string }>;
export type CustomerContract = CommercialRevision & Readonly<{ kind: "CONTRACT"; customerRef: string; offerRef: string; planRef: string; priceRef: string; priceRevisionRef: string; priceProvenanceRef: string }>;

const TOKEN = /^\S+$/;
const UTC = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+)?Z$/;
function token(value: unknown, path: string): string { if (typeof value !== "string" || !TOKEN.test(value)) throw new TypeError(`Invalid commercial contract at ${path}`); return value; }
function time(value: unknown, path: string): string { if (typeof value !== "string" || !UTC.test(value)) throw new TypeError(`Invalid commercial contract at ${path}`); return value; }
function epoch(value: string): number { return Date.parse(value); }

export function commercialRevisionState(revision: CommercialRevision, at: string): CommercialFactState {
  const instant = epoch(time(at, "$at"));
  if (revision.currentness !== "CURRENT" || revision.population !== "COMPLETE") return revision.currentness === "STALE" ? "STALE" : "UNKNOWN";
  if (instant < epoch(revision.effectiveAt)) return "NOT_YET_EFFECTIVE";
  if (revision.effectiveUntil !== undefined && instant >= epoch(revision.effectiveUntil)) return "EXPIRED";
  return "CURRENT";
}

export function selectCommercialRevision<T extends CommercialRevision>(revisions: readonly T[], id: string, scopeRef: string, at: string): Readonly<{ state: CommercialFactState; revision?: T }> {
  const candidates = revisions.filter(r => r.id === id && r.scopeRef === scopeRef && commercialRevisionState(r, at) === "CURRENT");
  if (candidates.length === 0) return { state: "UNKNOWN" };
  const superseded = new Set(candidates.map(r => r.supersedesRevisionRef).filter((value): value is string => value !== undefined));
  const leaves = candidates.filter(r => !superseded.has(r.revisionRef));
  if (leaves.length !== 1) return { state: "CONFLICTED" };
  const revision = leaves[0];
  return revision === undefined ? { state: "UNKNOWN" } : { state: "CURRENT", revision };
}

export function bindCustomerContract(input: Readonly<{ contract: Omit<CustomerContract, "kind" | "priceRef" | "priceRevisionRef" | "priceProvenanceRef">; price: CommercialPrice; at: string }>): CustomerContract {
  const priceState = commercialRevisionState(input.price, input.at);
  if (priceState !== "CURRENT") throw new TypeError(`Cannot bind customer contract from ${priceState} price`);
  if (input.contract.planRef !== input.price.planRef || input.contract.scopeRef !== input.price.scopeRef) throw new TypeError("Cannot bind customer contract to unrelated price");
  token(input.contract.customerRef, "$contract.customerRef");
  token(input.price.provenanceRef, "$price.provenanceRef");
  return { ...input.contract, kind: "CONTRACT", priceRef: input.price.id, priceRevisionRef: input.price.revisionRef, priceProvenanceRef: input.price.provenanceRef };
}

export function validateCommercialRevision(revision: CommercialRevision): CommercialRevision {
  token(revision.id, "$revision.id"); token(revision.revisionRef, "$revision.revisionRef"); token(revision.scopeRef, "$revision.scopeRef"); token(revision.provenanceRef, "$revision.provenanceRef"); time(revision.effectiveAt, "$revision.effectiveAt");
  if (revision.effectiveUntil !== undefined && epoch(time(revision.effectiveUntil, "$revision.effectiveUntil")) <= epoch(revision.effectiveAt)) throw new TypeError("Invalid commercial contract at $revision.effectiveUntil");
  if (revision.supersedesRevisionRef !== undefined) token(revision.supersedesRevisionRef, "$revision.supersedesRevisionRef");
  return revision;
}

export const FINOPS_CONTRACT_VERSION = "1.0.0" as const;

export type FinOpsQualification = "COMPLETE" | "PARTIAL" | "UNKNOWN";
export type FinOpsCurrentness = "CURRENT" | "STALE" | "UNKNOWN";

export type ProviderCostEvidence = Readonly<{ kind: "PROVIDER_COST_EVIDENCE"; id: string; revisionRef: string; sourceRef: string; scopeRef: string; amountMinor: number; currency: string; effectiveAt: string; provenanceRef: string; currentness: FinOpsCurrentness; population: FinOpsQualification }>;
export type CostConversion = Readonly<{ revisionRef: string; fromCurrency: string; toCurrency: string; numerator: number; denominator: number; effectiveAt: string; provenanceRef: string; currentness: FinOpsCurrentness; population: FinOpsQualification }>;
export type NormalizedCostEvidence = Readonly<{ kind: "NORMALIZED_COST_EVIDENCE"; revisionRef: string; sourceEvidenceRevisionRef: string; sourceRef: string; scopeRef: string; amountMinor: number; currency: string; sourceCurrency: string; effectiveAt: string; provenanceRef: string; conversionRevisionRef?: string; conversionProvenanceRef?: string; currentness: "CURRENT"; population: "COMPLETE"; customerCommercialTruth: false }>;
export type CostNormalizationResult = Readonly<{ state: "NORMALIZED"; evidence: NormalizedCostEvidence; reason: string }> | Readonly<{ state: "UNKNOWN"; reason: string }>;

export type AllocationTarget = Readonly<{ dimensionRef: string; targetRef: string; weight: number }>;
export type CostAllocationEvidence = Readonly<{ kind: "COST_ALLOCATION_EVIDENCE"; revisionRef: string; sourceEvidenceRevisionRef: string; scopeRef: string; currency: string; sourceAmountMinor: number; allocations: ReadonlyArray<Readonly<{ dimensionRef: string; targetRef: string; amountMinor: number }>>; roundingResidualMinor: number; provenanceRef: string; currentness: "CURRENT"; population: "COMPLETE" }>;
export type CostAllocationResult = Readonly<{ state: "ALLOCATED"; evidence: CostAllocationEvidence; reason: string }> | Readonly<{ state: "UNKNOWN"; reason: string }>;

export type PlanningEvidenceKind = "BUDGET" | "FORECAST" | "COMMITMENT";
export type PlanningCostEvidence = Readonly<{ kind: PlanningEvidenceKind; revisionRef: string; scopeRef: string; periodRef: string; amountMinor: number; currency: string; provenanceRef: string; currentness: FinOpsCurrentness; population: FinOpsQualification }>;
export type ActualQualifiedCost = Readonly<{ kind: "ACTUAL"; evidence: NormalizedCostEvidence }>;
export type QualifiedCostPosition = PlanningCostEvidence | ActualQualifiedCost;

const TOKEN = /^\S+$/;
const CURRENCY = /^[A-Z]{3}$/;
const UTC = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+)?Z$/;
function token(value: unknown, path: string): string { if (typeof value !== "string" || !TOKEN.test(value)) throw new TypeError(`Invalid FinOps evidence at ${path}`); return value; }
function currency(value: unknown, path: string): string { if (typeof value !== "string" || !CURRENCY.test(value)) throw new TypeError(`Invalid FinOps currency at ${path}`); return value; }
function time(value: unknown, path: string): string { if (typeof value !== "string" || !UTC.test(value) || !Number.isFinite(Date.parse(value))) throw new TypeError(`Invalid FinOps time at ${path}`); return value; }
function safeAmount(value: unknown, path: string): number { if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new TypeError(`Invalid FinOps amount at ${path}`); return value; }
function qualified(value: { currentness: FinOpsCurrentness; population: FinOpsQualification }): boolean { return value.currentness === "CURRENT" && value.population === "COMPLETE"; }

export function normalizeTechnologyCost(input: Readonly<{ source: ProviderCostEvidence; targetCurrency: string; revisionRef: string; provenanceRef: string; conversion?: CostConversion }>): CostNormalizationResult {
  const source = input.source; token(source.id, "$source.id"); token(source.revisionRef, "$source.revisionRef"); token(source.sourceRef, "$source.sourceRef"); token(source.scopeRef, "$source.scopeRef"); token(source.provenanceRef, "$source.provenanceRef"); safeAmount(source.amountMinor, "$source.amountMinor");
  const sourceCurrency = currency(source.currency, "$source.currency"); time(source.effectiveAt, "$source.effectiveAt"); const targetCurrency = currency(input.targetCurrency, "$targetCurrency");
  if (!qualified(source)) return { state: "UNKNOWN", reason: "source-cost-evidence-not-qualified" };
  let amountMinor = source.amountMinor; let conversionFields: Pick<NormalizedCostEvidence, "conversionRevisionRef" | "conversionProvenanceRef"> = {};
  if (sourceCurrency !== targetCurrency) {
    const conversion = input.conversion; if (conversion === undefined) return { state: "UNKNOWN", reason: "missing-currency-conversion" }; if (!qualified(conversion)) return { state: "UNKNOWN", reason: "currency-conversion-not-qualified" };
    if (currency(conversion.fromCurrency, "$conversion.fromCurrency") !== sourceCurrency || currency(conversion.toCurrency, "$conversion.toCurrency") !== targetCurrency) return { state: "UNKNOWN", reason: "currency-conversion-mismatch" };
    token(conversion.revisionRef, "$conversion.revisionRef"); token(conversion.provenanceRef, "$conversion.provenanceRef"); const conversionEffectiveAt = time(conversion.effectiveAt, "$conversion.effectiveAt"); if (conversionEffectiveAt !== source.effectiveAt) return { state: "UNKNOWN", reason: "currency-conversion-effective-time-conflict" };
    if (!Number.isSafeInteger(conversion.numerator) || conversion.numerator <= 0 || !Number.isSafeInteger(conversion.denominator) || conversion.denominator <= 0) throw new TypeError("Invalid FinOps conversion ratio");
    amountMinor = Math.round((source.amountMinor * conversion.numerator) / conversion.denominator); if (!Number.isSafeInteger(amountMinor)) throw new TypeError("Normalized FinOps amount exceeds safe integer range"); conversionFields = { conversionRevisionRef: conversion.revisionRef, conversionProvenanceRef: conversion.provenanceRef };
  }
  return { state: "NORMALIZED", reason: "qualified-cost-evidence-normalized", evidence: { kind: "NORMALIZED_COST_EVIDENCE", revisionRef: token(input.revisionRef, "$revisionRef"), sourceEvidenceRevisionRef: source.revisionRef, sourceRef: source.sourceRef, scopeRef: source.scopeRef, amountMinor, currency: targetCurrency, sourceCurrency, effectiveAt: source.effectiveAt, provenanceRef: token(input.provenanceRef, "$provenanceRef"), ...conversionFields, currentness: "CURRENT", population: "COMPLETE", customerCommercialTruth: false } };
}

export function allocateNormalizedCost(input: Readonly<{ source?: NormalizedCostEvidence; targets: ReadonlyArray<AllocationTarget>; revisionRef: string; provenanceRef: string }>): CostAllocationResult {
  const source = input.source;
  if (source === undefined) return { state: "UNKNOWN", reason: "missing-normalized-cost-population" };
  if (source.currentness !== "CURRENT" || source.population !== "COMPLETE") return { state: "UNKNOWN", reason: "normalized-cost-not-qualified" };
  if (input.targets.length === 0) return { state: "UNKNOWN", reason: "missing-allocation-population" };
  const targets = input.targets.map((target, index) => ({ dimensionRef: token(target.dimensionRef, `$targets[${index}].dimensionRef`), targetRef: token(target.targetRef, `$targets[${index}].targetRef`), weight: target.weight }));
  if (targets.some((target) => !Number.isSafeInteger(target.weight) || target.weight <= 0)) throw new TypeError("Invalid FinOps allocation weight");
  const totalWeight = targets.reduce((sum, target) => sum + target.weight, 0); if (!Number.isSafeInteger(totalWeight)) throw new TypeError("FinOps allocation weight exceeds safe integer range");
  const allocations = targets.map((target) => ({ dimensionRef: target.dimensionRef, targetRef: target.targetRef, amountMinor: Math.floor((source.amountMinor * target.weight) / totalWeight) }));
  const allocatedMinor = allocations.reduce((sum, item) => sum + item.amountMinor, 0); const roundingResidualMinor = source.amountMinor - allocatedMinor;
  return { state: "ALLOCATED", reason: "qualified-cost-conservatively-allocated", evidence: { kind: "COST_ALLOCATION_EVIDENCE", revisionRef: token(input.revisionRef, "$revisionRef"), sourceEvidenceRevisionRef: source.revisionRef, scopeRef: source.scopeRef, currency: source.currency, sourceAmountMinor: source.amountMinor, allocations, roundingResidualMinor, provenanceRef: token(input.provenanceRef, "$provenanceRef"), currentness: "CURRENT", population: "COMPLETE" } };
}

export function qualifyPlanningCost(input: PlanningCostEvidence | NormalizedCostEvidence): QualifiedCostPosition | Readonly<{ kind: "UNKNOWN"; reason: string }> {
  if (input.kind === "NORMALIZED_COST_EVIDENCE") return { kind: "ACTUAL", evidence: input };
  token(input.revisionRef, "$planning.revisionRef"); token(input.scopeRef, "$planning.scopeRef"); token(input.periodRef, "$planning.periodRef"); token(input.provenanceRef, "$planning.provenanceRef"); safeAmount(input.amountMinor, "$planning.amountMinor"); currency(input.currency, "$planning.currency");
  if (!qualified(input)) return { kind: "UNKNOWN", reason: "planning-cost-not-qualified" };
  return input;
}

export const FINOPS_CONTRACT_VERSION = "1.0.0" as const;

export type FinOpsQualification = "COMPLETE" | "PARTIAL" | "UNKNOWN";
export type FinOpsCurrentness = "CURRENT" | "STALE" | "UNKNOWN";

export type ProviderCostEvidence = Readonly<{
  kind: "PROVIDER_COST_EVIDENCE";
  id: string;
  revisionRef: string;
  sourceRef: string;
  scopeRef: string;
  amountMinor: number;
  currency: string;
  effectiveAt: string;
  provenanceRef: string;
  currentness: FinOpsCurrentness;
  population: FinOpsQualification;
}>;

export type CostConversion = Readonly<{
  revisionRef: string;
  fromCurrency: string;
  toCurrency: string;
  numerator: number;
  denominator: number;
  effectiveAt: string;
  provenanceRef: string;
  currentness: FinOpsCurrentness;
  population: FinOpsQualification;
}>;

export type NormalizedCostEvidence = Readonly<{
  kind: "NORMALIZED_COST_EVIDENCE";
  revisionRef: string;
  sourceEvidenceRevisionRef: string;
  sourceRef: string;
  scopeRef: string;
  amountMinor: number;
  currency: string;
  sourceCurrency: string;
  effectiveAt: string;
  provenanceRef: string;
  conversionRevisionRef?: string;
  conversionProvenanceRef?: string;
  currentness: "CURRENT";
  population: "COMPLETE";
  customerCommercialTruth: false;
}>;

export type CostNormalizationResult =
  | Readonly<{
      state: "NORMALIZED";
      evidence: NormalizedCostEvidence;
      reason: string;
    }>
  | Readonly<{
      state: "UNKNOWN";
      reason: string;
    }>;

const TOKEN = /^\S+$/;
const CURRENCY = /^[A-Z]{3}$/;
const UTC = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+)?Z$/;

function token(value: unknown, path: string): string {
  if (typeof value !== "string" || !TOKEN.test(value)) throw new TypeError(`Invalid FinOps evidence at ${path}`);
  return value;
}

function currency(value: unknown, path: string): string {
  if (typeof value !== "string" || !CURRENCY.test(value)) throw new TypeError(`Invalid FinOps currency at ${path}`);
  return value;
}

function time(value: unknown, path: string): string {
  if (typeof value !== "string" || !UTC.test(value) || !Number.isFinite(Date.parse(value))) throw new TypeError(`Invalid FinOps time at ${path}`);
  return value;
}

function safeAmount(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new TypeError(`Invalid FinOps amount at ${path}`);
  return value;
}

function qualified(value: { currentness: FinOpsCurrentness; population: FinOpsQualification }): boolean {
  return value.currentness === "CURRENT" && value.population === "COMPLETE";
}

export function normalizeTechnologyCost(input: Readonly<{
  source: ProviderCostEvidence;
  targetCurrency: string;
  revisionRef: string;
  provenanceRef: string;
  conversion?: CostConversion;
}>): CostNormalizationResult {
  const source = input.source;
  token(source.id, "$source.id");
  token(source.revisionRef, "$source.revisionRef");
  token(source.sourceRef, "$source.sourceRef");
  token(source.scopeRef, "$source.scopeRef");
  token(source.provenanceRef, "$source.provenanceRef");
  safeAmount(source.amountMinor, "$source.amountMinor");
  const sourceCurrency = currency(source.currency, "$source.currency");
  time(source.effectiveAt, "$source.effectiveAt");
  const targetCurrency = currency(input.targetCurrency, "$targetCurrency");

  if (!qualified(source)) return { state: "UNKNOWN", reason: "source-cost-evidence-not-qualified" };

  let amountMinor = source.amountMinor;
  let conversionFields: Pick<NormalizedCostEvidence, "conversionRevisionRef" | "conversionProvenanceRef"> = {};
  if (sourceCurrency !== targetCurrency) {
    const conversion = input.conversion;
    if (conversion === undefined) return { state: "UNKNOWN", reason: "missing-currency-conversion" };
    if (!qualified(conversion)) return { state: "UNKNOWN", reason: "currency-conversion-not-qualified" };
    if (currency(conversion.fromCurrency, "$conversion.fromCurrency") !== sourceCurrency || currency(conversion.toCurrency, "$conversion.toCurrency") !== targetCurrency) return { state: "UNKNOWN", reason: "currency-conversion-mismatch" };
    token(conversion.revisionRef, "$conversion.revisionRef");
    token(conversion.provenanceRef, "$conversion.provenanceRef");
    time(conversion.effectiveAt, "$conversion.effectiveAt");
    if (!Number.isSafeInteger(conversion.numerator) || conversion.numerator <= 0 || !Number.isSafeInteger(conversion.denominator) || conversion.denominator <= 0) throw new TypeError("Invalid FinOps conversion ratio");
    amountMinor = Math.round((source.amountMinor * conversion.numerator) / conversion.denominator);
    if (!Number.isSafeInteger(amountMinor)) throw new TypeError("Normalized FinOps amount exceeds safe integer range");
    conversionFields = { conversionRevisionRef: conversion.revisionRef, conversionProvenanceRef: conversion.provenanceRef };
  }

  return {
    state: "NORMALIZED",
    reason: "qualified-cost-evidence-normalized",
    evidence: {
      kind: "NORMALIZED_COST_EVIDENCE",
      revisionRef: token(input.revisionRef, "$revisionRef"),
      sourceEvidenceRevisionRef: source.revisionRef,
      sourceRef: source.sourceRef,
      scopeRef: source.scopeRef,
      amountMinor,
      currency: targetCurrency,
      sourceCurrency,
      effectiveAt: source.effectiveAt,
      provenanceRef: token(input.provenanceRef, "$provenanceRef"),
      ...conversionFields,
      currentness: "CURRENT",
      population: "COMPLETE",
      customerCommercialTruth: false,
    },
  };
}

import { normalizeCurrentnessQualification, normalizeDefinitionRevisionRef, type CurrentnessQualification, type DefinitionRevisionRef } from "../semantic-substrate/index.js";

export const PROVIDER_QUALIFICATION_CONTRACT_VERSION = "1.0.0" as const;
export type ProviderQualificationStatus = "SUPPORTED" | "PARTIAL" | "UNSUPPORTED" | "UNKNOWN" | "INCONCLUSIVE";
export type ProviderEvidenceAuthority = "AUTHORITATIVE" | "OBSERVED" | "INFERRED";
export type ProviderQualificationDimension = Readonly<{ dimension: string; status: ProviderQualificationStatus; reason: string }>;
export type ProviderBindingQualification = Readonly<{
  contractVersion: typeof PROVIDER_QUALIFICATION_CONTRACT_VERSION;
  binding: DefinitionRevisionRef;
  providerRealizationRef: string;
  evidence: DefinitionRevisionRef;
  currentness: CurrentnessQualification;
  evidenceAuthority: ProviderEvidenceAuthority;
  dimensions: readonly ProviderQualificationDimension[];
  disposition: ProviderQualificationStatus;
}>;

type UnknownRecord = Record<string, unknown>;
function asRecord(value: unknown, label: string): UnknownRecord { if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`); return value as UnknownRecord; }
function exact(record: UnknownRecord, fields: readonly string[], label: string): void { for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`); for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`); }
function nonEmpty(value: unknown, label: string): string { if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be a non-empty string`); return value.trim(); }
function revisionKey(value: DefinitionRevisionRef): string { return [value.semanticOwner,value.semanticKind,value.canonicalRef,value.definitionRef,value.revisionOwner,value.revisionDimension,value.revisionRef].join("\u0000"); }
function status(value: unknown, label: string): ProviderQualificationStatus { if (value!=="SUPPORTED"&&value!=="PARTIAL"&&value!=="UNSUPPORTED"&&value!=="UNKNOWN"&&value!=="INCONCLUSIVE") throw new Error(`${label} must be SUPPORTED, PARTIAL, UNSUPPORTED, UNKNOWN or INCONCLUSIVE`); return value; }
function authority(value: unknown): ProviderEvidenceAuthority { if(value!=="AUTHORITATIVE"&&value!=="OBSERVED"&&value!=="INFERRED") throw new Error("evidenceAuthority must be AUTHORITATIVE, OBSERVED or INFERRED"); return value; }

export function normalizeProviderQualificationDimension(input: unknown): ProviderQualificationDimension {
  const record=asRecord(input,"provider qualification dimension");
  exact(record,["dimension","status","reason"],"provider qualification dimension");
  return Object.freeze({dimension:nonEmpty(record.dimension,"qualification dimension"),status:status(record.status,"qualification dimension status"),reason:nonEmpty(record.reason,"qualification dimension reason")});
}

export function normalizeProviderBindingQualification(input: unknown): ProviderBindingQualification {
  const record=asRecord(input,"provider binding qualification");
  exact(record,["contractVersion","binding","providerRealizationRef","evidence","currentness","evidenceAuthority","dimensions","disposition"],"provider binding qualification");
  if(record.contractVersion!==PROVIDER_QUALIFICATION_CONTRACT_VERSION) throw new Error(`unsupported provider qualification contract version: ${String(record.contractVersion)}`);
  const binding=normalizeDefinitionRevisionRef(record.binding);
  const providerRealizationRef=nonEmpty(record.providerRealizationRef,"provider realization ref");
  if(providerRealizationRef===binding.canonicalRef||providerRealizationRef===binding.definitionRef||providerRealizationRef===binding.revisionRef) throw new Error("provider realization id cannot substitute canonical binding identity or revision");
  const evidence=normalizeDefinitionRevisionRef(record.evidence);
  const currentness=normalizeCurrentnessQualification(record.currentness);
  if(revisionKey(currentness.subject)!==revisionKey(evidence)) throw new Error("provider qualification currentness must qualify the exact evidence revision");
  const evidenceAuthority=authority(record.evidenceAuthority);
  if(!Array.isArray(record.dimensions)||record.dimensions.length===0) throw new Error("provider qualification requires at least one explicit dimension");
  const dimensions=Object.freeze(record.dimensions.map(normalizeProviderQualificationDimension));
  const seen=new Set<string>(); for(const d of dimensions){if(seen.has(d.dimension)) throw new Error(`duplicate provider qualification dimension ${d.dimension}`); seen.add(d.dimension);}
  const disposition=status(record.disposition,"provider qualification disposition");
  if(disposition==="SUPPORTED") {
    if(currentness.state!=="CURRENT") throw new Error("stale or UNKNOWN evidence cannot be promoted to SUPPORTED; reconcile-before-retry");
    if(evidenceAuthority!=="AUTHORITATIVE") throw new Error("observed or AI-inferred evidence cannot establish provider support authority");
    if(dimensions.some(d=>d.status!=="SUPPORTED")) throw new Error("PARTIAL, UNKNOWN, INCONCLUSIVE or UNSUPPORTED dimensions cannot strengthen to SUPPORTED");
  }
  if(dimensions.some(d=>d.status==="UNSUPPORTED")&&disposition==="PARTIAL") throw new Error("UNSUPPORTED dimension cannot be hidden by PARTIAL disposition");
  return Object.freeze({contractVersion:PROVIDER_QUALIFICATION_CONTRACT_VERSION,binding,providerRealizationRef,evidence,currentness,evidenceAuthority,dimensions,disposition});
}

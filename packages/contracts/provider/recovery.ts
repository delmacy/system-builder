import { normalizeProviderBindingQualification, type ProviderBindingQualification } from "./qualification.js";

export const PROVIDER_RECOVERY_CONTRACT_VERSION = "1.0.0" as const;
export type ProviderRecoveryDisposition = "RECONCILE_REQUIRED" | "RETRY_ELIGIBLE";
export type ProviderRecovery = Readonly<{
  contractVersion: typeof PROVIDER_RECOVERY_CONTRACT_VERSION;
  previous: ProviderBindingQualification;
  current: ProviderBindingQualification;
  disposition: ProviderRecoveryDisposition;
}>;

type UnknownRecord = Record<string, unknown>;
function asRecord(value: unknown): UnknownRecord { if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("provider recovery must be an object"); return value as UnknownRecord; }
function revisionKey(value: ProviderBindingQualification["evidence"]): string { return [value.semanticOwner,value.semanticKind,value.canonicalRef,value.definitionRef,value.revisionOwner,value.revisionDimension,value.revisionRef].join("\u0000"); }
function bindingKey(value: ProviderBindingQualification["binding"]): string { return revisionKey(value); }

export function normalizeProviderRecovery(input: unknown): ProviderRecovery {
  const record=asRecord(input);
  const fields=["contractVersion","previous","current","disposition"] as const;
  for(const key of Object.keys(record)) if(!fields.includes(key as typeof fields[number])) throw new Error(`provider recovery has unexpected field ${key}`);
  for(const key of fields) if(!(key in record)) throw new Error(`provider recovery is missing field ${key}`);
  if(record.contractVersion!==PROVIDER_RECOVERY_CONTRACT_VERSION) throw new Error(`unsupported provider recovery contract version: ${String(record.contractVersion)}`);
  const previous=normalizeProviderBindingQualification(record.previous);
  const current=normalizeProviderBindingQualification(record.current);
  if(record.disposition!=="RECONCILE_REQUIRED"&&record.disposition!=="RETRY_ELIGIBLE") throw new Error("provider recovery disposition must be RECONCILE_REQUIRED or RETRY_ELIGIBLE");
  const degraded=current.currentness.state!=="CURRENT" || current.evidenceAuthority!=="AUTHORITATIVE" || current.disposition!=="SUPPORTED";
  const drift=revisionKey(previous.evidence)!==revisionKey(current.evidence) || bindingKey(previous.binding)!==bindingKey(current.binding) || previous.currentness.localityScope!==current.currentness.localityScope;
  if(record.disposition==="RETRY_ELIGIBLE") {
    if(degraded) throw new Error("degraded provider evidence requires authoritative reconcile-before-retry");
    if(drift) throw new Error("revision, binding or locality drift requires explicit authoritative reconciliation before retry");
  }
  if((degraded||drift)&&record.disposition!=="RECONCILE_REQUIRED") throw new Error("provider degradation must remain RECONCILE_REQUIRED");
  return Object.freeze({contractVersion:PROVIDER_RECOVERY_CONTRACT_VERSION,previous,current,disposition:record.disposition});
}

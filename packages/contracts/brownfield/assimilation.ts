import { normalizeCurrentnessQualification, normalizeDefinitionRevisionRef, type CurrentnessQualification, type DefinitionRevisionRef } from "../semantic-substrate/index.js";

export const BROWNFIELD_ASSIMILATION_CONTRACT_VERSION = "1.0.0" as const;
export type BrownfieldEvidenceAuthority = "AUTHORITATIVE" | "OBSERVED" | "INFERRED";
export type BrownfieldEvidenceCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type BrownfieldReconciliationDisposition = "PRESERVE_CANONICAL" | "RECONCILE_REQUIRED" | "ASSIMILATE";

export type BrownfieldEvidenceRecord = Readonly<{
  evidenceRef: string;
  subject: DefinitionRevisionRef;
  ownerRef: string;
  provenanceRef: string;
  localityScope: string;
  authority: BrownfieldEvidenceAuthority;
  completeness: BrownfieldEvidenceCompleteness;
  currentness: CurrentnessQualification;
}>;

export type BrownfieldAssimilation = Readonly<{
  contractVersion: typeof BROWNFIELD_ASSIMILATION_CONTRACT_VERSION;
  canonicalState: DefinitionRevisionRef;
  evidence: readonly BrownfieldEvidenceRecord[];
  disposition: BrownfieldReconciliationDisposition;
}>;

type UnknownRecord = Record<string, unknown>;
function asRecord(value: unknown, label: string): UnknownRecord { if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`); return value as UnknownRecord; }
function exact(record: UnknownRecord, fields: readonly string[], label: string): void { for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`); for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`); }
function nonEmpty(value: unknown, label: string): string { if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be a non-empty string`); return value.trim(); }
function revisionKey(value: DefinitionRevisionRef): string { return [value.semanticOwner,value.semanticKind,value.canonicalRef,value.definitionRef,value.revisionOwner,value.revisionDimension,value.revisionRef].join("\u0000"); }
function authority(value: unknown): BrownfieldEvidenceAuthority { if(value!=="AUTHORITATIVE"&&value!=="OBSERVED"&&value!=="INFERRED") throw new Error("authority must be AUTHORITATIVE, OBSERVED or INFERRED"); return value; }
function completeness(value: unknown): BrownfieldEvidenceCompleteness { if(value!=="KNOWN"&&value!=="PARTIAL"&&value!=="UNKNOWN") throw new Error("completeness must be KNOWN, PARTIAL or UNKNOWN"); return value; }
function disposition(value: unknown): BrownfieldReconciliationDisposition { if(value!=="PRESERVE_CANONICAL"&&value!=="RECONCILE_REQUIRED"&&value!=="ASSIMILATE") throw new Error("disposition must be PRESERVE_CANONICAL, RECONCILE_REQUIRED or ASSIMILATE"); return value; }

export function normalizeBrownfieldEvidenceRecord(input: unknown): BrownfieldEvidenceRecord {
  const record=asRecord(input,"brownfield evidence");
  exact(record,["evidenceRef","subject","ownerRef","provenanceRef","localityScope","authority","completeness","currentness"],"brownfield evidence");
  const subject=normalizeDefinitionRevisionRef(record.subject);
  const currentness=normalizeCurrentnessQualification(record.currentness);
  const localityScope=nonEmpty(record.localityScope,"locality scope");
  if(revisionKey(currentness.subject)!==revisionKey(subject)) throw new Error("brownfield currentness must qualify the exact observed revision");
  if(currentness.localityScope!==localityScope) throw new Error("brownfield currentness must qualify the same locality as the evidence");
  return Object.freeze({evidenceRef:nonEmpty(record.evidenceRef,"evidence ref"),subject,ownerRef:nonEmpty(record.ownerRef,"owner ref"),provenanceRef:nonEmpty(record.provenanceRef,"provenance ref"),localityScope,authority:authority(record.authority),completeness:completeness(record.completeness),currentness});
}

export function normalizeBrownfieldAssimilation(input: unknown): BrownfieldAssimilation {
  const record=asRecord(input,"brownfield assimilation");
  exact(record,["contractVersion","canonicalState","evidence","disposition"],"brownfield assimilation");
  if(record.contractVersion!==BROWNFIELD_ASSIMILATION_CONTRACT_VERSION) throw new Error(`unsupported brownfield assimilation contract version: ${String(record.contractVersion)}`);
  const canonicalState=normalizeDefinitionRevisionRef(record.canonicalState);
  if(!Array.isArray(record.evidence)||record.evidence.length===0) throw new Error("brownfield assimilation requires explicit evidence; missing evidence is not absence");
  const evidence=Object.freeze(record.evidence.map(normalizeBrownfieldEvidenceRecord));
  const result=disposition(record.disposition);
  const seen=new Set<string>(); for(const item of evidence){if(seen.has(item.evidenceRef)) throw new Error(`duplicate brownfield evidence ${item.evidenceRef}`); seen.add(item.evidenceRef);}
  const uncertainty=evidence.some(item=>item.completeness!=="KNOWN"||item.currentness.state!=="CURRENT");
  const nonAuthoritative=evidence.some(item=>item.authority!=="AUTHORITATIVE");
  const conflict=evidence.some(item=>revisionKey(item.subject)!==revisionKey(canonicalState));
  if(result==="ASSIMILATE") {
    if(nonAuthoritative) throw new Error("scan or AI inference cannot become authoritative state implicitly");
    if(uncertainty) throw new Error("stale, PARTIAL or UNKNOWN evidence requires reconcile-before-retry");
    if(conflict) throw new Error("assimilation cannot silently replace existing canonical truth");
  }
  if((uncertainty||conflict)&&result==="PRESERVE_CANONICAL") throw new Error("conflicting, stale or UNKNOWN evidence must remain visible as RECONCILE_REQUIRED");
  return Object.freeze({contractVersion:BROWNFIELD_ASSIMILATION_CONTRACT_VERSION,canonicalState,evidence,disposition:result});
}

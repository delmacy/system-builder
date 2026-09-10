import type { BrownfieldEvidenceAuthority, BrownfieldEvidenceCompleteness } from "./assimilation.js";

export const EXTERNAL_IDENTITY_COEXISTENCE_CONTRACT_VERSION = "1.0.0" as const;
export type ExternalBindingState = "ACTIVE" | "RESIDUAL" | "DRAINED";
export type RebindingQualification = "CONFIRMED" | "PARTIAL" | "UNKNOWN" | "INCONCLUSIVE";

export type ExternalSourceAuthority = Readonly<{
  sourceRef: string;
  scopeRef: string;
  epoch: number;
  fencingToken: string;
  canonical: boolean;
}>;

export type ExternalIdentityBinding = Readonly<{
  bindingRef: string;
  providerRef: string;
  scopeRef: string;
  externalId: string;
  canonicalEntityRef: string;
  bindingRevision: string;
  epoch: number;
  sourceRef: string;
  fencingToken: string;
  evidenceRef: string;
  evidenceAuthority: BrownfieldEvidenceAuthority;
  state: ExternalBindingState;
}>;

export type ExternalIdentityRebinding = Readonly<{
  rebindRef: string;
  priorBindingRef: string;
  nextBindingRef: string;
  qualification: RebindingQualification;
  evidenceRef: string;
  evidenceAuthority: BrownfieldEvidenceAuthority;
}>;

export type ResidualBindingCohort = Readonly<{
  cohortRef: string;
  providerRef: string;
  scopeRef: string;
  externalId: string;
  bindingRefs: readonly string[];
  completeness: BrownfieldEvidenceCompleteness;
  drained: boolean;
}>;

export type ExternalIdentityCoexistence = Readonly<{
  contractVersion: typeof EXTERNAL_IDENTITY_COEXISTENCE_CONTRACT_VERSION;
  sourceAuthorities: readonly ExternalSourceAuthority[];
  bindings: readonly ExternalIdentityBinding[];
  rebindings: readonly ExternalIdentityRebinding[];
  residualCohorts: readonly ResidualBindingCohort[];
}>;

type UnknownRecord = Record<string, unknown>;
const asRecord = (value: unknown, label: string): UnknownRecord => { if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`); return value as UnknownRecord; };
const exact = (record: UnknownRecord, fields: readonly string[], label: string): void => { for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`); for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`); };
const nonEmpty = (value: unknown, label: string): string => { if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be a non-empty string`); return value.trim(); };
const epoch = (value: unknown, label: string): number => { if (typeof value !== "number" || !Number.isInteger(value) || value < 0) throw new Error(`${label} must be a non-negative integer`); return value; };
const evidenceAuthority = (value: unknown): BrownfieldEvidenceAuthority => { if (value !== "AUTHORITATIVE" && value !== "OBSERVED" && value !== "INFERRED") throw new Error("invalid evidence authority"); return value; };
const completeness = (value: unknown): BrownfieldEvidenceCompleteness => { if (value !== "KNOWN" && value !== "PARTIAL" && value !== "UNKNOWN") throw new Error("invalid residual completeness"); return value; };
const bindingState = (value: unknown): ExternalBindingState => { if (value !== "ACTIVE" && value !== "RESIDUAL" && value !== "DRAINED") throw new Error("invalid binding state"); return value; };
const qualification = (value: unknown): RebindingQualification => { if (value !== "CONFIRMED" && value !== "PARTIAL" && value !== "UNKNOWN" && value !== "INCONCLUSIVE") throw new Error("invalid rebinding qualification"); return value; };
const externalKey = (value: Pick<ExternalIdentityBinding,"providerRef"|"scopeRef"|"externalId">): string => `${value.providerRef}\u0000${value.scopeRef}\u0000${value.externalId}`;

function normalizeAuthority(value: unknown): ExternalSourceAuthority {
  const record=asRecord(value,"external source authority"); exact(record,["sourceRef","scopeRef","epoch","fencingToken","canonical"],"external source authority");
  if(typeof record.canonical!=="boolean") throw new Error("source authority canonical must be boolean");
  return Object.freeze({sourceRef:nonEmpty(record.sourceRef,"sourceRef"),scopeRef:nonEmpty(record.scopeRef,"scopeRef"),epoch:epoch(record.epoch,"source authority epoch"),fencingToken:nonEmpty(record.fencingToken,"fencingToken"),canonical:record.canonical});
}

function normalizeBinding(value: unknown): ExternalIdentityBinding {
  const record=asRecord(value,"external identity binding"); exact(record,["bindingRef","providerRef","scopeRef","externalId","canonicalEntityRef","bindingRevision","epoch","sourceRef","fencingToken","evidenceRef","evidenceAuthority","state"],"external identity binding");
  return Object.freeze({bindingRef:nonEmpty(record.bindingRef,"bindingRef"),providerRef:nonEmpty(record.providerRef,"providerRef"),scopeRef:nonEmpty(record.scopeRef,"scopeRef"),externalId:nonEmpty(record.externalId,"externalId"),canonicalEntityRef:nonEmpty(record.canonicalEntityRef,"canonicalEntityRef"),bindingRevision:nonEmpty(record.bindingRevision,"bindingRevision"),epoch:epoch(record.epoch,"binding epoch"),sourceRef:nonEmpty(record.sourceRef,"sourceRef"),fencingToken:nonEmpty(record.fencingToken,"fencingToken"),evidenceRef:nonEmpty(record.evidenceRef,"evidenceRef"),evidenceAuthority:evidenceAuthority(record.evidenceAuthority),state:bindingState(record.state)});
}

function normalizeRebinding(value: unknown): ExternalIdentityRebinding {
  const record=asRecord(value,"external identity rebinding"); exact(record,["rebindRef","priorBindingRef","nextBindingRef","qualification","evidenceRef","evidenceAuthority"],"external identity rebinding");
  const normalized=Object.freeze({rebindRef:nonEmpty(record.rebindRef,"rebindRef"),priorBindingRef:nonEmpty(record.priorBindingRef,"priorBindingRef"),nextBindingRef:nonEmpty(record.nextBindingRef,"nextBindingRef"),qualification:qualification(record.qualification),evidenceRef:nonEmpty(record.evidenceRef,"evidenceRef"),evidenceAuthority:evidenceAuthority(record.evidenceAuthority)});
  if(normalized.qualification==="CONFIRMED"&&normalized.evidenceAuthority!=="AUTHORITATIVE") throw new Error("confirmed rebinding requires AUTHORITATIVE evidence");
  return normalized;
}

function normalizeResidual(value: unknown): ResidualBindingCohort {
  const record=asRecord(value,"residual binding cohort"); exact(record,["cohortRef","providerRef","scopeRef","externalId","bindingRefs","completeness","drained"],"residual binding cohort");
  if(!Array.isArray(record.bindingRefs)||record.bindingRefs.length===0) throw new Error("residual binding cohort requires explicit bindingRefs");
  if(typeof record.drained!=="boolean") throw new Error("residual binding cohort drained must be boolean");
  const normalizedCompleteness=completeness(record.completeness);
  if(record.drained&&normalizedCompleteness!=="KNOWN") throw new Error("drained residual binding cohort requires KNOWN completeness");
  return Object.freeze({cohortRef:nonEmpty(record.cohortRef,"cohortRef"),providerRef:nonEmpty(record.providerRef,"providerRef"),scopeRef:nonEmpty(record.scopeRef,"scopeRef"),externalId:nonEmpty(record.externalId,"externalId"),bindingRefs:Object.freeze(record.bindingRefs.map((item)=>nonEmpty(item,"bindingRef"))),completeness:normalizedCompleteness,drained:record.drained});
}

export function normalizeExternalIdentityCoexistence(input: unknown): ExternalIdentityCoexistence {
  const record=asRecord(input,"external identity coexistence"); exact(record,["contractVersion","sourceAuthorities","bindings","rebindings","residualCohorts"],"external identity coexistence");
  if(record.contractVersion!==EXTERNAL_IDENTITY_COEXISTENCE_CONTRACT_VERSION) throw new Error("unsupported external identity coexistence contract version");
  if(!Array.isArray(record.sourceAuthorities)||record.sourceAuthorities.length===0||!Array.isArray(record.bindings)||!Array.isArray(record.rebindings)||!Array.isArray(record.residualCohorts)) throw new Error("sourceAuthorities, bindings, rebindings and residualCohorts must be explicit arrays");
  const sourceAuthorities=record.sourceAuthorities.map(normalizeAuthority);
  const authorityEpochs=new Set<string>();
  const authoritiesByScope=new Map<string,ExternalSourceAuthority[]>();
  for(const item of sourceAuthorities){
    const key=`${item.scopeRef}\u0000${item.epoch}`; if(authorityEpochs.has(key)) throw new Error("source authority epoch cannot be reused within scope"); authorityEpochs.add(key);
    const group=authoritiesByScope.get(item.scopeRef)??[]; group.push(item); authoritiesByScope.set(item.scopeRef,group);
  }
  const canonicalByScope=new Map<string,ExternalSourceAuthority>();
  for(const [scopeRef,group] of authoritiesByScope){
    const canonical=group.filter((item)=>item.canonical);
    if(canonical.length!==1) throw new Error(`coexistence requires exactly one canonical source authority per scope: ${scopeRef}`);
    const highestEpoch=Math.max(...group.map((item)=>item.epoch));
    if(canonical[0]!.epoch!==highestEpoch) throw new Error("stale source authority cannot be canonical after fencing");
    canonicalByScope.set(scopeRef,canonical[0]!);
  }

  const bindings=record.bindings.map(normalizeBinding); const byRef=new Map<string,ExternalIdentityBinding>();
  for(const item of bindings){if(byRef.has(item.bindingRef)) throw new Error(`duplicate external binding ${item.bindingRef}`); byRef.set(item.bindingRef,item);}
  for(const item of bindings){if(item.state==="ACTIVE"){if(item.evidenceAuthority!=="AUTHORITATIVE") throw new Error("active external binding requires AUTHORITATIVE evidence"); const canonicalAuthority=canonicalByScope.get(item.scopeRef); if(!canonicalAuthority||item.sourceRef!==canonicalAuthority.sourceRef||item.epoch!==canonicalAuthority.epoch||item.fencingToken!==canonicalAuthority.fencingToken) throw new Error("stale binding cannot resurrect authority after fencing/cutover");}}
  const activeKeys=new Set<string>(); for(const item of bindings.filter((candidate)=>candidate.state==="ACTIVE")){const key=externalKey(item); if(activeKeys.has(key)) throw new Error("external identity cannot have two active canonical bindings"); activeKeys.add(key);}

  const rebindings=record.rebindings.map(normalizeRebinding); const rebindRefs=new Set<string>();
  for(const item of rebindings){if(rebindRefs.has(item.rebindRef)) throw new Error(`duplicate rebinding ${item.rebindRef}`); rebindRefs.add(item.rebindRef); const prior=byRef.get(item.priorBindingRef); const next=byRef.get(item.nextBindingRef); if(!prior||!next) throw new Error("rebinding must reference existing bindings"); if(externalKey(prior)!==externalKey(next)) throw new Error("rebinding must preserve provider/scope/external-id lineage"); if(next.epoch<=prior.epoch) throw new Error("rebinding must advance epoch");}
  const groups=new Map<string,ExternalIdentityBinding[]>(); for(const item of bindings){const key=externalKey(item); const group=groups.get(key)??[]; group.push(item); groups.set(key,group);}
  for(const group of groups.values()){group.sort((a,b)=>a.epoch-b.epoch); for(let index=1;index<group.length;index++){const prior=group[index-1]!; const next=group[index]!; if(prior.canonicalEntityRef!==next.canonicalEntityRef){const proof=rebindings.find((item)=>item.priorBindingRef===prior.bindingRef&&item.nextBindingRef===next.bindingRef&&item.qualification==="CONFIRMED"&&item.evidenceAuthority==="AUTHORITATIVE"); if(!proof) throw new Error("external ID reuse cannot imply same or rebound entity without confirmed authoritative rebinding");}}}

  const residualCohorts=record.residualCohorts.map(normalizeResidual); const visibleResiduals=new Set<string>();
  for(const cohort of residualCohorts){for(const bindingRef of cohort.bindingRefs){const binding=byRef.get(bindingRef); if(!binding) throw new Error("residual cohort references unknown binding"); if(externalKey(binding)!==`${cohort.providerRef}\u0000${cohort.scopeRef}\u0000${cohort.externalId}`) throw new Error("residual cohort identity must match referenced binding"); if(cohort.drained&&binding.state!=="DRAINED") throw new Error("drained cohort may reference only DRAINED bindings"); if(!cohort.drained&&binding.state==="DRAINED") throw new Error("DRAINED binding cannot remain in an undrained cohort"); visibleResiduals.add(bindingRef);}}
  for(const binding of bindings){if(binding.state==="RESIDUAL"&&!visibleResiduals.has(binding.bindingRef)) throw new Error("residual binding cohorts must remain explicit until drained/reconciled");}
  return Object.freeze({contractVersion:EXTERNAL_IDENTITY_COEXISTENCE_CONTRACT_VERSION,sourceAuthorities:Object.freeze(sourceAuthorities),bindings:Object.freeze(bindings),rebindings:Object.freeze(rebindings),residualCohorts:Object.freeze(residualCohorts)});
}

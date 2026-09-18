import { z } from "zod";

export const GOVERNANCE_CONTRACT_VERSION = "1.1.0" as const;
export type GovernanceEvidenceCurrentness = "CURRENT" | "STALE" | "UNKNOWN";
export type GovernanceEvidencePopulation = "COMPLETE" | "PARTIAL" | "UNKNOWN";
export type GovernanceAssessmentState = "SATISFIED" | "NOT_SATISFIED" | "INDETERMINATE";
export type GovernanceAuthorityState = "CURRENT" | "NOT_YET_EFFECTIVE" | "EXPIRED" | "REVOKED" | "STALE" | "CONFLICTED" | "UNKNOWN";

export type GovernancePolicy = Readonly<{ contractVersion: typeof GOVERNANCE_CONTRACT_VERSION; policyId: string; revisionRef: string; effectiveAt: string; effectiveUntil?: string; supersedesRevisionRef?: string; scopeRef: string }>;
export type GovernanceWaiver = Readonly<{ waiverId:string; policyRef:string; policyRevisionRef:string; issuerAuthorityRef:string; scopeRef:string; revisionRef:string; effectiveAt:string; expiresAt:string; revokedAt?:string; reasonRef:string }>;
export type GovernanceDecision = Readonly<{ decisionId: string; policyRef: string; policyRevisionRef: string; basisRefs: readonly string[]; authorityRef?: string; inferenceRef?: string }>;
export type GovernanceEnforcementObservation = Readonly<{ enforcementId: string; decisionRef: string; outcome: "APPLIED" | "REJECTED" | "UNKNOWN"; observedAt: string }>;
export type GovernanceEvidence = Readonly<{ evidenceId: string; subjectRef: string; policyRef: string; policyRevisionRef: string; provenanceRef: string; observedAt: string; currentness: GovernanceEvidenceCurrentness; population: GovernanceEvidencePopulation; result: "PASS" | "FAIL" | "UNKNOWN" }>;
export type GovernanceAssessment = Readonly<{ assessmentId: string; policyRef: string; policyRevisionRef: string; evidenceRefs: readonly string[]; state: GovernanceAssessmentState; reason: string }>;

const token=(v:unknown,p:string)=>{if(typeof v!=="string"||v.trim()==="")throw new TypeError(`${p} must be a non-empty string`);return v};
const record=(v:unknown,p:string)=>{if(!v||typeof v!=="object"||Array.isArray(v))throw new TypeError(`${p} must be an object`);return v as Record<string,unknown>};
const keys=(v:Record<string,unknown>,allowed:readonly string[],p:string)=>{const extra=Object.keys(v).filter(k=>!allowed.includes(k));if(extra.length)throw new TypeError(`${p} has unknown fields: ${extra.join(", ")}`)};
const refs=(v:unknown,p:string)=>{if(!Array.isArray(v))throw new TypeError(`${p} must be an array`);return Object.freeze(v.map((x,i)=>token(x,`${p}[${i}]`)))};
const time=(v:unknown,p:string)=>{const s=token(v,p);if(Number.isNaN(Date.parse(s)))throw new TypeError(`${p} must be an ISO timestamp`);return s};
const epoch=(v:string)=>Date.parse(v);

export function normalizeGovernancePolicy(input: unknown): GovernancePolicy {
  const v=record(input,"$policy"); keys(v,["contractVersion","policyId","revisionRef","effectiveAt","effectiveUntil","supersedesRevisionRef","scopeRef"],"$policy");
  if(v.contractVersion!==GOVERNANCE_CONTRACT_VERSION)throw new TypeError("$policy.contractVersion unsupported");
  const out:{contractVersion:typeof GOVERNANCE_CONTRACT_VERSION;policyId:string;revisionRef:string;effectiveAt:string;effectiveUntil?:string;supersedesRevisionRef?:string;scopeRef:string}={contractVersion:GOVERNANCE_CONTRACT_VERSION,policyId:token(v.policyId,"$policy.policyId"),revisionRef:token(v.revisionRef,"$policy.revisionRef"),effectiveAt:time(v.effectiveAt,"$policy.effectiveAt"),scopeRef:token(v.scopeRef,"$policy.scopeRef")};
  if(v.effectiveUntil!==undefined) out.effectiveUntil=time(v.effectiveUntil,"$policy.effectiveUntil");
  if(v.supersedesRevisionRef!==undefined) out.supersedesRevisionRef=token(v.supersedesRevisionRef,"$policy.supersedesRevisionRef");
  if(out.effectiveUntil&&epoch(out.effectiveUntil)<=epoch(out.effectiveAt))throw new TypeError("$policy.effectiveUntil must be after effectiveAt");
  return out;
}

export function normalizeGovernanceWaiver(input:unknown):GovernanceWaiver {
  const v=record(input,"$waiver"); keys(v,["waiverId","policyRef","policyRevisionRef","issuerAuthorityRef","scopeRef","revisionRef","effectiveAt","expiresAt","revokedAt","reasonRef"],"$waiver");
  const out:{waiverId:string;policyRef:string;policyRevisionRef:string;issuerAuthorityRef:string;scopeRef:string;revisionRef:string;effectiveAt:string;expiresAt:string;revokedAt?:string;reasonRef:string}={waiverId:token(v.waiverId,"$waiver.waiverId"),policyRef:token(v.policyRef,"$waiver.policyRef"),policyRevisionRef:token(v.policyRevisionRef,"$waiver.policyRevisionRef"),issuerAuthorityRef:token(v.issuerAuthorityRef,"$waiver.issuerAuthorityRef"),scopeRef:token(v.scopeRef,"$waiver.scopeRef"),revisionRef:token(v.revisionRef,"$waiver.revisionRef"),effectiveAt:time(v.effectiveAt,"$waiver.effectiveAt"),expiresAt:time(v.expiresAt,"$waiver.expiresAt"),reasonRef:token(v.reasonRef,"$waiver.reasonRef")};
  if(v.revokedAt!==undefined) out.revokedAt=time(v.revokedAt,"$waiver.revokedAt");
  if(epoch(out.expiresAt)<=epoch(out.effectiveAt))throw new TypeError("$waiver.expiresAt must be after effectiveAt");
  return out;
}

export function policyAuthorityState(policy:GovernancePolicy,at:string):GovernanceAuthorityState {
  const t=epoch(time(at,"$at")); if(t<epoch(policy.effectiveAt)) return "NOT_YET_EFFECTIVE"; if(policy.effectiveUntil&&t>=epoch(policy.effectiveUntil)) return "EXPIRED"; return "CURRENT";
}

export function waiverAuthorityState(waiver:GovernanceWaiver, policy:GovernancePolicy, at:string):GovernanceAuthorityState {
  const t=epoch(time(at,"$at"));
  if(waiver.policyRef!==policy.policyId||waiver.policyRevisionRef!==policy.revisionRef||waiver.scopeRef!==policy.scopeRef) return "STALE";
  if(policyAuthorityState(policy,at)!=="CURRENT") return "STALE";
  if(t<epoch(waiver.effectiveAt)) return "NOT_YET_EFFECTIVE";
  if(waiver.revokedAt&&t>=epoch(waiver.revokedAt)) return "REVOKED";
  if(t>=epoch(waiver.expiresAt)) return "EXPIRED";
  return "CURRENT";
}

export function selectCurrentPolicy(policies:readonly GovernancePolicy[], policyId:string, scopeRef:string, at:string):Readonly<{state:GovernanceAuthorityState;policy?:GovernancePolicy}> {
  const candidates=policies.filter(p=>p.policyId===policyId&&p.scopeRef===scopeRef&&policyAuthorityState(p,at)==="CURRENT");
  if(candidates.length===0) return {state:"UNKNOWN"};
  const superseded=new Set(candidates.map(p=>p.supersedesRevisionRef).filter((v):v is string=>v!==undefined));
  const leaves=candidates.filter(p=>!superseded.has(p.revisionRef));
  if(leaves.length!==1) return {state:"CONFLICTED"};
  const policy=leaves[0];
  if(policy===undefined) return {state:"UNKNOWN"};
  return {state:"CURRENT",policy};
}

export function normalizeGovernanceDecision(input: unknown): GovernanceDecision {
  const v=record(input,"$decision"); keys(v,["decisionId","policyRef","policyRevisionRef","basisRefs","authorityRef","inferenceRef"],"$decision");
  const out:{decisionId:string;policyRef:string;policyRevisionRef:string;basisRefs:readonly string[];authorityRef?:string;inferenceRef?:string}={decisionId:token(v.decisionId,"$decision.decisionId"),policyRef:token(v.policyRef,"$decision.policyRef"),policyRevisionRef:token(v.policyRevisionRef,"$decision.policyRevisionRef"),basisRefs:refs(v.basisRefs,"$decision.basisRefs")};
  if(v.authorityRef!==undefined) out.authorityRef=token(v.authorityRef,"$decision.authorityRef");
  if(v.inferenceRef!==undefined) out.inferenceRef=token(v.inferenceRef,"$decision.inferenceRef");
  return out;
}

export function normalizeGovernanceEnforcement(input: unknown): GovernanceEnforcementObservation {
  const v=record(input,"$enforcement"); keys(v,["enforcementId","decisionRef","outcome","observedAt"],"$enforcement");
  if(v.outcome!=="APPLIED"&&v.outcome!=="REJECTED"&&v.outcome!=="UNKNOWN")throw new TypeError("$enforcement.outcome invalid");
  return {enforcementId:token(v.enforcementId,"$enforcement.enforcementId"),decisionRef:token(v.decisionRef,"$enforcement.decisionRef"),outcome:v.outcome,observedAt:time(v.observedAt,"$enforcement.observedAt")};
}

export function normalizeGovernanceEvidence(input: unknown): GovernanceEvidence {
  const schema=z.object({evidenceId:z.string().min(1),subjectRef:z.string().min(1),policyRef:z.string().min(1),policyRevisionRef:z.string().min(1),provenanceRef:z.string().min(1),observedAt:z.string().datetime(),currentness:z.enum(["CURRENT","STALE","UNKNOWN"]),population:z.enum(["COMPLETE","PARTIAL","UNKNOWN"]),result:z.enum(["PASS","FAIL","UNKNOWN"])}).strict();
  return schema.parse(input);
}

export function assessGovernance(assessmentId:string, policy:GovernancePolicy, evidence:readonly GovernanceEvidence[]):GovernanceAssessment {
  const relevant=evidence.filter(e=>e.policyRef===policy.policyId&&e.policyRevisionRef===policy.revisionRef);
  if(relevant.length===0)return {assessmentId,policyRef:policy.policyId,policyRevisionRef:policy.revisionRef,evidenceRefs:[],state:"INDETERMINATE",reason:"missing evidence is not proof"};
  const usable=relevant.filter(e=>e.currentness==="CURRENT"&&e.population==="COMPLETE");
  if(usable.length!==relevant.length||usable.some(e=>e.result==="UNKNOWN"))return {assessmentId,policyRef:policy.policyId,policyRevisionRef:policy.revisionRef,evidenceRefs:relevant.map(e=>e.evidenceId),state:"INDETERMINATE",reason:"stale, partial, unknown, or mixed evidence cannot strengthen authority"};
  const failed=usable.some(e=>e.result==="FAIL");
  return {assessmentId,policyRef:policy.policyId,policyRevisionRef:policy.revisionRef,evidenceRefs:usable.map(e=>e.evidenceId),state:failed?"NOT_SATISFIED":"SATISFIED",reason:failed?"complete current evidence contains a failure":"complete current evidence supports the assessment"};
}

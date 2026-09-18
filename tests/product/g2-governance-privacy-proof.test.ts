import assert from "node:assert/strict";
import test from "node:test";
import {
  GOVERNANCE_CONTRACT_VERSION,
  assessGovernance,
  normalizeGovernanceDecision,
  normalizeGovernanceEnforcement,
  normalizeGovernanceEvidence,
  normalizeGovernancePolicy,
  normalizeGovernanceWaiver,
  policyAuthorityState,
  selectCurrentPolicy,
  waiverAuthorityState,
} from "../../packages/contracts/governance/index.js";

const now="2026-09-18T12:00:00Z";
const policy=normalizeGovernancePolicy({contractVersion:GOVERNANCE_CONTRACT_VERSION,policyId:"policy:retention",revisionRef:"rev:1",effectiveAt:now,scopeRef:"scope:tenant-a"});
const decision=normalizeGovernanceDecision({decisionId:"decision:1",policyRef:policy.policyId,policyRevisionRef:policy.revisionRef,basisRefs:["evidence:1"],inferenceRef:"ai:recommendation:1"});
const enforcement=normalizeGovernanceEnforcement({enforcementId:"enforcement:1",decisionRef:decision.decisionId,observedAt:now,result:"APPLIED"});
const complete=normalizeGovernanceEvidence({evidenceId:"evidence:1",provenanceRef:"provenance:1",currentness:"CURRENT",population:"COMPLETE",observedAt:now});

test("TASK-563 keeps policy decision enforcement evidence and assessment distinct",()=>{
  assert.notEqual(policy.policyId,decision.decisionId);
  assert.notEqual(decision.decisionId,enforcement.enforcementId);
  assert.equal(decision.inferenceRef,"ai:recommendation:1");
  assert.equal(decision.authorityRef,undefined,"AI inference does not acquire authority");
  const assessment=assessGovernance({assessmentId:"assessment:1",policyRef:policy.policyId,evidence:[complete],assertionSatisfied:true,assessedAt:now});
  assert.equal(assessment.outcome,"SATISFIED");
});

test("missing stale partial or unknown evidence cannot strengthen compliance truth",()=>{
  assert.equal(assessGovernance({assessmentId:"a:missing",policyRef:policy.policyId,evidence:[],assertionSatisfied:true,assessedAt:now}).outcome,"INDETERMINATE");
  for(const [currentness,population] of [["STALE","COMPLETE"],["UNKNOWN","COMPLETE"],["CURRENT","PARTIAL"],["CURRENT","UNKNOWN"]] as const){
    const evidence=normalizeGovernanceEvidence({evidenceId:`evidence:${currentness}:${population}`,provenanceRef:"provenance:bounded",currentness,population,observedAt:now});
    assert.equal(assessGovernance({assessmentId:`a:${currentness}:${population}`,policyRef:policy.policyId,evidence:[evidence],assertionSatisfied:true,assessedAt:now}).outcome,"INDETERMINATE");
  }
});

test("complete current evidence can support negative assessment without becoming authority",()=>{
  const assessment=assessGovernance({assessmentId:"assessment:negative",policyRef:policy.policyId,evidence:[complete],assertionSatisfied:false,assessedAt:now});
  assert.equal(assessment.outcome,"NOT_SATISFIED");
  assert.equal(Object.hasOwn(complete,"authorityRef"),false);
});

test("TASK-564 resolves effective-dated policy supersession deterministically",()=>{
  const rev1=normalizeGovernancePolicy({contractVersion:GOVERNANCE_CONTRACT_VERSION,policyId:"policy:access",revisionRef:"rev:1",effectiveAt:"2026-01-01T00:00:00Z",scopeRef:"scope:a"});
  const rev2=normalizeGovernancePolicy({contractVersion:GOVERNANCE_CONTRACT_VERSION,policyId:"policy:access",revisionRef:"rev:2",effectiveAt:"2026-06-01T00:00:00Z",supersedesRevisionRef:"rev:1",scopeRef:"scope:a"});
  const selected=selectCurrentPolicy([rev1,rev2],"policy:access","scope:a","2026-09-18T12:00:00Z");
  assert.equal(selected.state,"CURRENT"); assert.equal(selected.policy?.revisionRef,"rev:2");
  const competing=normalizeGovernancePolicy({contractVersion:GOVERNANCE_CONTRACT_VERSION,policyId:"policy:access",revisionRef:"rev:parallel",effectiveAt:"2026-07-01T00:00:00Z",scopeRef:"scope:a"});
  assert.equal(selectCurrentPolicy([rev1,rev2,competing],"policy:access","scope:a","2026-09-18T12:00:00Z").state,"CONFLICTED");
});

test("waiver authority is issuer scope revision time expiry and revocation bounded",()=>{
  const governed=normalizeGovernancePolicy({contractVersion:GOVERNANCE_CONTRACT_VERSION,policyId:"policy:retention",revisionRef:"rev:2",effectiveAt:"2026-01-01T00:00:00Z",scopeRef:"scope:tenant-a"});
  const waiver=normalizeGovernanceWaiver({waiverId:"waiver:1",policyRef:governed.policyId,policyRevisionRef:governed.revisionRef,issuerAuthorityRef:"authority:privacy-officer",scopeRef:governed.scopeRef,rationaleRef:"case:123",effectiveAt:"2026-09-01T00:00:00Z",expiresAt:"2026-10-01T00:00:00Z"});
  assert.equal(waiverAuthorityState(waiver,governed,"2026-09-18T12:00:00Z"),"CURRENT");
  assert.equal(waiverAuthorityState(waiver,governed,"2026-10-01T00:00:00Z"),"EXPIRED");
  const stalePolicy=normalizeGovernancePolicy({contractVersion:GOVERNANCE_CONTRACT_VERSION,policyId:governed.policyId,revisionRef:"rev:3",effectiveAt:"2026-09-10T00:00:00Z",scopeRef:governed.scopeRef});
  assert.equal(waiverAuthorityState(waiver,stalePolicy,"2026-09-18T12:00:00Z"),"STALE");
  const revoked=normalizeGovernanceWaiver({...waiver,revokedAt:"2026-09-15T00:00:00Z"});
  assert.equal(waiverAuthorityState(revoked,governed,"2026-09-18T12:00:00Z"),"REVOKED");
});

test("acknowledgement evidence or AI inference cannot create waiver authority",()=>{
  assert.equal(Object.hasOwn(complete,"issuerAuthorityRef"),false);
  assert.equal(decision.inferenceRef,"ai:recommendation:1");
  assert.equal(decision.authorityRef,undefined);
  assert.equal(policyAuthorityState(policy,"2026-09-18T12:00:00Z"),"CURRENT");
});

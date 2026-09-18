import assert from "node:assert/strict";
import test from "node:test";
import {
  GOVERNANCE_CONTRACT_VERSION,
  assessGovernance,
  normalizeGovernanceDecision,
  normalizeGovernanceEnforcement,
  normalizeGovernanceEvidence,
  normalizeGovernancePolicy,
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

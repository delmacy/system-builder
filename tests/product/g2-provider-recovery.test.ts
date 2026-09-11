import test from "node:test";
import assert from "node:assert/strict";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";
import { PROVIDER_QUALIFICATION_CONTRACT_VERSION, normalizeProviderRecovery } from "../../packages/contracts/provider/index.js";

const revision=(revisionRef="r1", canonicalRef="canonical", semanticKind="provider-qualification-evidence")=>({contractVersion:SEMANTIC_SUBSTRATE_CONTRACT_VERSION,semanticOwner:"provider-owner",semanticKind,canonicalRef,definitionRef:`${canonicalRef}-definition`,revisionOwner:"provider-owner",revisionDimension:"definition",revisionRef});
const binding=revision("binding-r1","payment-binding","provider-binding");
const currentness=(subject:ReturnType<typeof revision>, state:"CURRENT"|"STALE"|"UNKNOWN", localityScope:string)=>({contractVersion:SEMANTIC_SUBSTRATE_CONTRACT_VERSION,subject,revisionVector:[{revisionOwner:subject.revisionOwner,revisionDimension:subject.revisionDimension,revisionRef:subject.revisionRef}],temporal:{occurredAt:null,observedAt:"2026-09-11T00:00:00Z",evaluatedAt:null,effectiveFrom:null,effectiveUntil:null,reconciledAt:"2026-09-11T00:01:00Z"},populationScope:"provider-binding/payment",localityScope,currentnessHorizon:{assessedAt:"2026-09-11T00:00:00Z",validUntil:"2026-09-11T01:00:00Z"},state,reason:"provider recovery proof"});
const qualification=(state:"CURRENT"|"STALE"|"UNKNOWN"="CURRENT", revisionRef="r1", localityScope="station-a")=>{const evidence=revision(revisionRef);return {contractVersion:PROVIDER_QUALIFICATION_CONTRACT_VERSION,binding,providerRealizationRef:"provider/payment/42",evidence,currentness:currentness(evidence,state,localityScope),evidenceAuthority:"AUTHORITATIVE" as const,dimensions:[{dimension:"capability",status:"SUPPORTED" as const,reason:"authoritative evidence"}],disposition:"SUPPORTED" as const};};

test("provider recovery permits retry only from unchanged current authoritative evidence",()=>{
  const current=qualification();
  assert.equal(normalizeProviderRecovery({contractVersion:"1.0.0",previous:current,current,disposition:"RETRY_ELIGIBLE"}).disposition,"RETRY_ELIGIBLE");
});

test("provider recovery requires reconciliation after stale, unknown, revision or locality degradation",()=>{
  const previous=qualification();
  for(const current of [qualification("STALE"),qualification("UNKNOWN"),qualification("CURRENT","r2"),qualification("CURRENT","r1","station-b")]) {
    assert.throws(()=>normalizeProviderRecovery({contractVersion:"1.0.0",previous,current,disposition:"RETRY_ELIGIBLE"}),/reconcile|reconciliation/);
  }
});

test("historical success cannot convert observed or inferred recovery into authority",()=>{
  const previous=qualification();
  for(const evidenceAuthority of ["OBSERVED","INFERRED"] as const) {
    const current={...qualification(),evidenceAuthority,disposition:"UNKNOWN" as const};
    assert.throws(()=>normalizeProviderRecovery({contractVersion:"1.0.0",previous,current,disposition:"RETRY_ELIGIBLE"}),/reconcile|reconciliation/);
  }
});

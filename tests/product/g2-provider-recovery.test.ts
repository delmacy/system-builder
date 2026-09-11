import test from "node:test";
import assert from "node:assert/strict";
import { normalizeProviderRecovery } from "../../packages/contracts/provider/index.js";

const revision=(revisionRef="r1")=>({semanticOwner:"provider",semanticKind:"binding",canonicalRef:"canonical",definitionRef:"definition",revisionOwner:"provider",revisionDimension:"contract",revisionRef});
const qualification=(state:"CURRENT"|"STALE"|"UNKNOWN"="CURRENT", revisionRef="r1", localityScope="station-a")=>({contractVersion:"1.0.0",binding:revision("binding-r1"),providerRealizationRef:"provider-realization",evidence:revision(revisionRef),currentness:{contractVersion:"1.0.0",subject:revision(revisionRef),localityScope,state,qualifiedAt:"2026-09-11T00:00:00.000Z",evidenceRef:"evidence"},evidenceAuthority:"AUTHORITATIVE",dimensions:[{dimension:"capability",status:"SUPPORTED",reason:"authoritative evidence"}],disposition:"SUPPORTED"});

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
    const current={...qualification(),evidenceAuthority,disposition:"UNKNOWN"};
    assert.throws(()=>normalizeProviderRecovery({contractVersion:"1.0.0",previous,current,disposition:"RETRY_ELIGIBLE"}),/reconcile|reconciliation/);
  }
});

import assert from "node:assert/strict";
import test from "node:test";
import { EXTERNAL_IDENTITY_COEXISTENCE_CONTRACT_VERSION, normalizeExternalIdentityCoexistence } from "../../packages/contracts/brownfield/external-identity-coexistence.js";

const authority=(sourceRef:string,epoch:number,canonical:boolean,fencingToken=`fence-${epoch}`,scopeRef="tenant-a/assets")=>({sourceRef,scopeRef,epoch,fencingToken,canonical});
const binding=(overrides:Record<string,unknown>={})=>({bindingRef:"binding-old",providerRef:"provider-a",scopeRef:"tenant-a/assets",externalId:"device-7",canonicalEntityRef:"asset-a",bindingRevision:"r1",epoch:1,sourceRef:"source-old",fencingToken:"fence-1",evidenceRef:"evidence-old",evidenceAuthority:"AUTHORITATIVE",state:"RESIDUAL",...overrides});
const cohort=(overrides:Record<string,unknown>={})=>({cohortRef:"residual-device-7",providerRef:"provider-a",scopeRef:"tenant-a/assets",externalId:"device-7",bindingRefs:["binding-old"],completeness:"KNOWN",drained:false,...overrides});
const valid=()=>({contractVersion:EXTERNAL_IDENTITY_COEXISTENCE_CONTRACT_VERSION,sourceAuthorities:[authority("source-old",1,false),authority("source-new",2,true)],bindings:[binding(),binding({bindingRef:"binding-new",canonicalEntityRef:"asset-b",bindingRevision:"r2",epoch:2,sourceRef:"source-new",fencingToken:"fence-2",evidenceRef:"evidence-new",state:"ACTIVE"})],rebindings:[{rebindRef:"rebind-1",priorBindingRef:"binding-old",nextBindingRef:"binding-new",qualification:"CONFIRMED",evidenceRef:"rebinding-proof",evidenceAuthority:"AUTHORITATIVE"}],residualCohorts:[cohort()]});

test("accepts explicit authoritative rebinding while preserving residual lineage",()=>{const normalized=normalizeExternalIdentityCoexistence(valid()); assert.equal(normalized.bindings[1]!.canonicalEntityRef,"asset-b"); assert.equal(normalized.residualCohorts[0]!.bindingRefs[0],"binding-old");});

test("accepts independent canonical source truth per scope",()=>{const input=valid(); const sourceAuthorities=[...input.sourceAuthorities,authority("source-b-old",7,false,"fence-b-7","tenant-b/assets"),authority("source-b-new",8,true,"fence-b-8","tenant-b/assets")]; const bindings=[...input.bindings,binding({bindingRef:"binding-b",scopeRef:"tenant-b/assets",externalId:"device-b",canonicalEntityRef:"asset-b2",bindingRevision:"rb8",epoch:8,sourceRef:"source-b-new",fencingToken:"fence-b-8",evidenceRef:"evidence-b",state:"ACTIVE"})]; const normalized=normalizeExternalIdentityCoexistence({...input,sourceAuthorities,bindings}); assert.equal(normalized.sourceAuthorities.filter((item)=>item.canonical).length,2);});

test("rejects external ID reuse as implicit identity or rebinding",()=>{const input=valid(); assert.throws(()=>normalizeExternalIdentityCoexistence({...input,rebindings:[]}),/cannot imply same or rebound entity/);});

test("rejects stale binding authority resurrection after fencing",()=>{const input=valid(); const bindings=[binding({state:"ACTIVE"}),input.bindings[1]]; assert.throws(()=>normalizeExternalIdentityCoexistence({...input,bindings}),/stale binding cannot resurrect authority/);});

test("rejects two canonical source truths within one scope",()=>{const input=valid(); assert.throws(()=>normalizeExternalIdentityCoexistence({...input,sourceAuthorities:[authority("source-old",1,true),authority("source-new",2,true)]}),/exactly one canonical source authority per scope/);});

test("rejects hidden residual binding cohorts",()=>{const input=valid(); assert.throws(()=>normalizeExternalIdentityCoexistence({...input,residualCohorts:[]}),/residual binding cohorts must remain explicit/);});

test("rejects PARTIAL or UNKNOWN strengthening to drained",()=>{const input=valid(); assert.throws(()=>normalizeExternalIdentityCoexistence({...input,bindings:[binding({state:"DRAINED"}),input.bindings[1]],residualCohorts:[cohort({drained:true,completeness:"UNKNOWN"})]}),/drained residual binding cohort requires KNOWN/);});

test("rejects observed evidence as confirmed rebinding authority",()=>{const input=valid(); assert.throws(()=>normalizeExternalIdentityCoexistence({...input,rebindings:[{...input.rebindings[0],evidenceAuthority:"OBSERVED"}]}),/confirmed rebinding requires AUTHORITATIVE/);});

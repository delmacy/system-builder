import assert from "node:assert/strict";
import test from "node:test";

import { BROWNFIELD_RECOVERY_CONTRACT_VERSION, normalizeBrownfieldRecovery } from "../../packages/contracts/brownfield/recovery.js";
import { EXTERNAL_IDENTITY_COEXISTENCE_CONTRACT_VERSION } from "../../packages/contracts/brownfield/external-identity-coexistence.js";
import { LOCALITY_RECONCILIATION_CONTRACT_VERSION } from "../../packages/contracts/locality/reconciliation.js";
import { PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION, normalizePhysicalPeripheralInteraction, normalizePhysicalPeripheralQualification } from "../../packages/contracts/physical/governance.js";
import { PROVIDER_QUALIFICATION_CONTRACT_VERSION, normalizeProviderRecovery } from "../../packages/contracts/provider/index.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const rev=(canonicalRef:string,revisionRef:string,semanticKind:string)=>({contractVersion:SEMANTIC_SUBSTRATE_CONTRACT_VERSION,semanticOwner:"g2-recovery-proof",semanticKind,canonicalRef,definitionRef:`${canonicalRef}-definition`,revisionOwner:"g2-recovery-proof",revisionDimension:"definition",revisionRef});
const binding=rev("provider/gate-a","binding-r2","provider-binding");
const providerEvidence=rev("provider/gate-a/evidence","evidence-r2","provider-qualification-evidence");
const peripheral=rev("asset-b","r2","external-binding");
const currentness=(subject:ReturnType<typeof rev>,localityScope:string,state:"CURRENT"|"STALE"|"UNKNOWN"="CURRENT",populationScope="tenant-a/assets")=>({contractVersion:SEMANTIC_SUBSTRATE_CONTRACT_VERSION,subject,revisionVector:[{revisionOwner:subject.revisionOwner,revisionDimension:subject.revisionDimension,revisionRef:subject.revisionRef}],temporal:{occurredAt:null,observedAt:"2026-09-11T06:00:00Z",evaluatedAt:"2026-09-11T06:01:00Z",effectiveFrom:null,effectiveUntil:null,reconciledAt:state==="CURRENT"?"2026-09-11T06:01:00Z":null},populationScope,localityScope,currentnessHorizon:{assessedAt:"2026-09-11T06:01:00Z",validUntil:"2026-09-11T07:01:00Z"},state,reason:`TASK-518 ${state}`});
const provider=(state:"CURRENT"|"STALE"|"UNKNOWN"="CURRENT",authority:"AUTHORITATIVE"|"OBSERVED"|"INFERRED"="AUTHORITATIVE")=>({contractVersion:PROVIDER_QUALIFICATION_CONTRACT_VERSION,binding,providerRealizationRef:"vendor/gate-a/42",evidence:providerEvidence,currentness:currentness(providerEvidence,"station-alpha",state,"provider-binding/payment"),evidenceAuthority:authority,dimensions:[{dimension:"transport",status:state==="CURRENT"&&authority==="AUTHORITATIVE"?"SUPPORTED" as const:"UNKNOWN" as const,reason:"recovery qualification"}],disposition:state==="CURRENT"&&authority==="AUTHORITATIVE"?"SUPPORTED" as const:"UNKNOWN" as const});
const locality=()=>({contractVersion:LOCALITY_RECONCILIATION_CONTRACT_VERSION,canonicalSource:peripheral,observations:[{kind:"FLEET" as const,localityRef:"fleet:primary",subject:peripheral,currentness:currentness(peripheral,"fleet:primary"),authority:"CANONICAL_SOURCE" as const}],conflict:"NONE" as const,reconciliation:"RECONCILED" as const,residuals:[{localityRef:"station:legacy",subject:peripheral,state:"DRAINED" as const}]});
const coexistence=(drained=true)=>({contractVersion:EXTERNAL_IDENTITY_COEXISTENCE_CONTRACT_VERSION,sourceAuthorities:[{sourceRef:"source-old",scopeRef:"tenant-a/assets",epoch:1,fencingToken:"fence-1",canonical:false},{sourceRef:"source-new",scopeRef:"tenant-a/assets",epoch:2,fencingToken:"fence-2",canonical:true}],bindings:[{bindingRef:"binding-old",providerRef:"provider-a",scopeRef:"tenant-a/assets",externalId:"device-7",canonicalEntityRef:"asset-a",bindingRevision:"r1",epoch:1,sourceRef:"source-old",fencingToken:"fence-1",evidenceRef:"old",evidenceAuthority:"AUTHORITATIVE" as const,state:drained?"DRAINED" as const:"RESIDUAL" as const},{bindingRef:"binding-new",providerRef:"provider-a",scopeRef:"tenant-a/assets",externalId:"device-7",canonicalEntityRef:"asset-b",bindingRevision:"r2",epoch:2,sourceRef:"source-new",fencingToken:"fence-2",evidenceRef:"new",evidenceAuthority:"AUTHORITATIVE" as const,state:"ACTIVE" as const}],rebindings:[{rebindRef:"rebind-1",priorBindingRef:"binding-old",nextBindingRef:"binding-new",qualification:"CONFIRMED" as const,evidenceRef:"proof",evidenceAuthority:"AUTHORITATIVE" as const}],residualCohorts:[{cohortRef:"residual-device-7",providerRef:"provider-a",scopeRef:"tenant-a/assets",externalId:"device-7",bindingRefs:["binding-old"],completeness:"KNOWN" as const,drained}]});
const brownfieldRecovery=(drained=true)=>({contractVersion:BROWNFIELD_RECOVERY_CONTRACT_VERSION,coexistence:coexistence(drained),locality:locality(),drainageEvidence:drained?[{cohortRef:"residual-device-7",evidenceRef:"drain-proof",evidenceAuthority:"AUTHORITATIVE" as const,completeness:"KNOWN" as const}]:[],disposition:drained?"RECOVERY_ELIGIBLE" as const:"RECONCILE_REQUIRED" as const});
const physicalQualification=(overrides:Record<string,unknown>={})=>({contractVersion:PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION,peripheral,providerQualification:provider(),localityRef:"station-alpha",currentness:currentness(peripheral,"station-alpha"),capability:"SUPPORTED" as const,...overrides});
const actuation=(overrides:Record<string,unknown>={})=>({contractVersion:PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION,qualification:physicalQualification(),intentKind:"ACTUATE" as const,requestedIntentRef:"intent/open-gate",owningDomainAuthorityRef:"access-control/authorization/77",authorization:"AUTHORIZED" as const,observedTelemetry:"PRESENT" as const,effect:"CONFIRMED" as const,...overrides});

test("TASK-518 proves reconcile-before-retry from provider degradation through authoritative recovery",()=>{
  const previous=provider();
  assert.throws(()=>normalizeProviderRecovery({contractVersion:"1.0.0",previous,current:provider("UNKNOWN"),reconciliationOutcome:"NOT_RECONCILED",disposition:"RETRY_ELIGIBLE"}),/reconcile|reconciliation/);
  assert.throws(()=>normalizeProviderRecovery({contractVersion:"1.0.0",previous,current:provider("CURRENT","INFERRED"),reconciliationOutcome:"AUTHORITATIVELY_RECONCILED",disposition:"RETRY_ELIGIBLE"}),/reconcile|authority/);
  assert.equal(normalizeProviderRecovery({contractVersion:"1.0.0",previous,current:provider(),reconciliationOutcome:"AUTHORITATIVELY_RECONCILED",disposition:"RETRY_ELIGIBLE"}).disposition,"RETRY_ELIGIBLE");
});

test("TASK-518 proves rebinding fencing residual drainage and canonical truth before recovery",()=>{
  assert.equal(normalizeBrownfieldRecovery(brownfieldRecovery(true)).disposition,"RECOVERY_ELIGIBLE");
  assert.equal(normalizeBrownfieldRecovery(brownfieldRecovery(false)).disposition,"RECONCILE_REQUIRED");
  const stale=coexistence(true); stale.bindings[0]={...stale.bindings[0],state:"ACTIVE"};
  assert.throws(()=>normalizeBrownfieldRecovery({...brownfieldRecovery(true),coexistence:stale}),/stale binding cannot resurrect authority/);
  const dual=coexistence(true); dual.sourceAuthorities=dual.sourceAuthorities.map(x=>({...x,canonical:true}));
  assert.throws(()=>normalizeBrownfieldRecovery({...brownfieldRecovery(true),coexistence:dual}),/exactly one canonical source authority/);
  assert.throws(()=>normalizeBrownfieldRecovery({...brownfieldRecovery(true),drainageEvidence:[{cohortRef:"residual-device-7",evidenceRef:"weak",evidenceAuthority:"AUTHORITATIVE",completeness:"UNKNOWN"}]}),/AUTHORITATIVE KNOWN drainage evidence/);
});

test("TASK-518 keeps Local Station Fleet recovery and physical reconnection from manufacturing authority or effect",()=>{
  assert.throws(()=>normalizePhysicalPeripheralQualification(physicalQualification({currentness:currentness(peripheral,"station-alpha","UNKNOWN")})),/cannot strengthen/);
  assert.throws(()=>normalizePhysicalPeripheralInteraction(actuation({owningDomainAuthorityRef:null})),/requires external owning-domain authority/);
  assert.throws(()=>normalizePhysicalPeripheralInteraction(actuation({observedTelemetry:"MISSING"})),/cannot imply confirmed physical effect/);
  assert.equal(normalizePhysicalPeripheralInteraction(actuation({effect:"NOT_CONFIRMED"})).effect,"NOT_CONFIRMED");
});

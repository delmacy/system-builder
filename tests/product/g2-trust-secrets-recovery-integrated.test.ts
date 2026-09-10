import assert from "node:assert/strict";
import test from "node:test";
import { IDENTITY_AUTHORIZATION_CONTRACT_VERSION, normalizeAuthorizationDecision, normalizeAuthorizationRequest } from "../../packages/contracts/identity-authorization/index.js";
import { REVOCATION_CONVERGENCE_CONTRACT_VERSION, normalizeRevocationConvergence } from "../../packages/contracts/identity-authorization/revocation.js";
import { normalizeConsumerEffectiveSecretConfigState, normalizeDesiredSecretConfigState, normalizeMaterializedSecretConfigState, normalizeSecretConfigReference } from "../../packages/contracts/identity-authorization/secret-config.js";
import { normalizeRotationAcknowledgement, normalizeRotationConvergence } from "../../packages/contracts/identity-authorization/rotation-drainage.js";
import { normalizeDegradedAuthorityCeiling, normalizeExternalEffectAssessment, normalizeFencingObservation, normalizeRecoveryVerification, RECOVERY_CONTRACT_VERSION, type ResidualRecoveryKind } from "../../packages/contracts/identity-authorization/recovery.js";
import { TRUST_QUALIFICATION_CONTRACT_VERSION, normalizeTrustQualification } from "../../packages/contracts/identity-authorization/trust.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const rev=(canonicalRef:string,revisionRef:string,kind="evidence",definitionRef=`${canonicalRef}-definition`)=>({contractVersion:SEMANTIC_SUBSTRATE_CONTRACT_VERSION,semanticOwner:"g2-wp04",semanticKind:kind,canonicalRef,definitionRef,revisionOwner:"g2-wp04",revisionDimension:"definition",revisionRef});
const locality={scopeKind:"STATION" as const,localityRef:"station-a"};
const currentness=(subject:ReturnType<typeof rev>,state:"CURRENT"|"STALE"|"UNKNOWN"="CURRENT")=>({contractVersion:SEMANTIC_SUBSTRATE_CONTRACT_VERSION,subject,revisionVector:[],temporal:{occurredAt:null,observedAt:"2026-09-10T04:20:00Z",evaluatedAt:null,effectiveFrom:null,effectiveUntil:null,reconciledAt:null},populationScope:"station-a",localityScope:"station-a",currentnessHorizon:{assessedAt:"2026-09-10T04:20:00Z",validUntil:"2026-09-10T05:20:00Z"},state,reason:"TASK-504 integrated Product Proof"});

const identity=rev("operator-42","identity-r3","identity");
const authEvidence=rev("authentication-evidence","auth-r7");
const policy=rev("maintenance-policy","policy-r4","authority-policy");
const decisionEvidence=rev("authorization-evidence","decision-r9");
const actor={contractVersion:IDENTITY_AUTHORIZATION_CONTRACT_VERSION,identity:{contractVersion:IDENTITY_AUTHORIZATION_CONTRACT_VERSION,identity},authentication:{contractVersion:IDENTITY_AUTHORIZATION_CONTRACT_VERSION,subjectIdentity:identity,evidence:authEvidence,currentness:currentness(authEvidence),locality,state:"AUTHENTICATED" as const}};
const request=normalizeAuthorizationRequest({contractVersion:IDENTITY_AUTHORIZATION_CONTRACT_VERSION,actor,authorityPolicy:policy,policyCurrentness:currentness(policy),authorizationEvidence:{contractVersion:IDENTITY_AUTHORIZATION_CONTRACT_VERSION,evidence:decisionEvidence,currentness:currentness(decisionEvidence),locality,state:"SUFFICIENT"},requested:{action:"work-order.update",resource:"work-order:42",scope:"maintenance",locality}});
const allow=normalizeAuthorizationDecision({contractVersion:IDENTITY_AUTHORIZATION_CONTRACT_VERSION,request,disposition:"ALLOW"},request);

const trustDomain=rev("maintenance-trust","domain-r2","trust-domain");
const trustGeneration=rev("maintenance-bundle","bundle-r4","trust-generation");
const trustCredential=rev("operator-credential","credential-r8","credential");
const trustEvidence=rev("credential-status","status-r9","credential-status-evidence");
const trustGen={contractVersion:TRUST_QUALIFICATION_CONTRACT_VERSION,trustDomain,generation:trustGeneration,providerRealizationRef:"provider/bundle/42"};
const trust={contractVersion:TRUST_QUALIFICATION_CONTRACT_VERSION,admittedGeneration:trustGen,verifierEffectiveGeneration:trustGen,credentialStatus:{contractVersion:TRUST_QUALIFICATION_CONTRACT_VERSION,credential:trustCredential,evidence:trustEvidence,currentness:currentness(trustEvidence),locality,status:"VALID" as const,cryptographicValidity:"VALID" as const},purpose:"operator-authentication",scope:"maintenance",locality,disposition:"TRUSTED" as const};

const secretDefinition=rev("secret/db-password","r1","secret-config","db-password");
const desiredRevision=rev("secret/db-password","r2","secret-config","db-password");
const materializedGeneration=rev("secret/db-password","r1","secret-config","db-password");
const materializationEvidence=rev("evidence/materialization","e1","secret-config");
const consumerEvidence=rev("evidence/consumer","e1","secret-config");
const reference={contractVersion:"1.0.0",definition:secretDefinition,providerRealizationRef:"vault/path/db-password#42"};
const desired={contractVersion:"1.0.0",reference,desiredRevision,presence:"VALUE_REF",locality};
const materialized={contractVersion:"1.0.0",desired,materializedGeneration,evidence:materializationEvidence,currentness:currentness(materializationEvidence),locality};

const oldRotation=rev("trust/domain-a","g1","rotation","domain-a");
const newRotation=rev("trust/domain-a","g2","rotation","domain-a");
const ackEvidence=rev("evidence/ack","ack-e1","rotation","domain-a");
const adoptionEvidence=rev("evidence/adoption","adopt-e1","rotation","domain-a");
const residualEvidence=rev("evidence/residual","residual-e1","rotation","domain-a");
const convergenceEvidence=rev("evidence/convergence","convergence-e1","rotation","domain-a");
const intent={contractVersion:"1.0.0",domain:"TRUST",oldGeneration:oldRotation,newGeneration:newRotation,providerVersionRef:"provider-v2",populationRef:"verifier-set-a",populationKnowledge:"KNOWN",eligiblePopulation:10,locality};
const ack={contractVersion:"1.0.0",intent,providerVersionRef:"provider-v2",evidence:ackEvidence,currentness:currentness(ackEvidence),locality};
const adoption={contractVersion:"1.0.0",intent,populationRef:"verifier-set-a",generation:newRotation,populationKnowledge:"KNOWN",observedPopulation:10,adoptedPopulation:10,disposition:"ADOPTED",evidence:adoptionEvidence,currentness:currentness(adoptionEvidence),locality};
const residual=(kind:"VERIFIER"|"CONSUMER"|"CACHE"|"OFFLINE"|"RECOVERY")=>({contractVersion:"1.0.0",intent,cohortId:`${kind.toLowerCase()}-old`,kind,generation:oldRotation,populationKnowledge:"KNOWN",population:0,disposition:"DRAINED",evidence:residualEvidence,currentness:currentness(residualEvidence),locality});

const horizonEvidence=rev("degraded-horizon","horizon-r1");
const ceiling={contractVersion:RECOVERY_CONTRACT_VERSION,sourceDecision:allow,allowedScope:"maintenance",prohibitedScopes:["fleet-admin"],locality,horizonEvidence,currentness:currentness(horizonEvidence),expiresAt:"2026-09-10T05:00:00Z",reviewCondition:"revalidate before extension"};
const authorityCurrent=policy,trustCurrent=trustGeneration,configCurrent=desiredRevision,cutRef=rev("recovery-cut","cut-r2");
const cut={contractVersion:RECOVERY_CONTRACT_VERSION,sourceCut:cutRef,restoredAuthority:authorityCurrent,currentAuthority:authorityCurrent,restoredTrust:trustCurrent,currentTrust:trustCurrent,restoredConfig:configCurrent,currentConfig:configCurrent,postCutRevocations:[rev("revocation-log","rev-r10")],postCutRotations:[rev("rotation-log","rotation-r11")],postCutConfigRevisions:[rev("config-log","config-r12")],restoreState:"RESTORED" as const,locality};
const epoch=rev("fencing-epoch","epoch-r4","fencing"),oldEpoch=rev("fencing-epoch","epoch-r3","fencing"),fenceEvidence=rev("fencing-evidence","fence-r5");
const fencing={contractVersion:RECOVERY_CONTRACT_VERSION,actor:identity,epoch,supersededEpoch:oldEpoch,oldActorState:"QUIESCED" as const,evidence:fenceEvidence,currentness:currentness(fenceEvidence),locality};
const effect={contractVersion:RECOVERY_CONTRACT_VERSION,effectRef:"external-effect-42",outcome:"UNKNOWN" as const,retryDisposition:"RECONCILE_BEFORE_RETRY" as const,duplicateSafetyEvidence:null,currentness:null,locality};
const recoveryEvidence=rev("residual-recovery","residual-r1");
const recoveryResidual=(kind:ResidualRecoveryKind)=>({contractVersion:RECOVERY_CONTRACT_VERSION,cohortRef:`${kind.toLowerCase()}-old`,kind,generation:oldEpoch,populationKnowledge:"KNOWN" as const,population:0,disposition:"DRAINED" as const,evidence:recoveryEvidence,currentness:currentness(recoveryEvidence),locality});
const recoveryResiduals=[recoveryResidual("OLD_ACTOR"),recoveryResidual("TRUST"),recoveryResidual("CONFIG"),recoveryResidual("CACHE"),recoveryResidual("OFFLINE"),recoveryResidual("RECOVERY_PATH")];
const reprotectionEvidence=rev("reprotection-evidence","protect-r6");
const verification={contractVersion:RECOVERY_CONTRACT_VERSION,ceiling,cut,fencing,effect,residualCohorts:recoveryResiduals,reprotectionEvidence,currentness:currentness(reprotectionEvidence),locality,state:"VERIFIED" as const};

test("TASK-504 integrates trust, authorization, config, rotation and recovery without strengthening",()=>{
  const normalizedTrust=normalizeTrustQualification(trust,{purpose:"operator-authentication",scope:"maintenance"});
  const normalizedDesired=normalizeDesiredSecretConfigState(desired);
  const normalizedMaterialized=normalizeMaterializedSecretConfigState(materialized);
  const effective=normalizeConsumerEffectiveSecretConfigState({contractVersion:"1.0.0",materialized,consumerPopulation:"consumer-set-a",effectiveGeneration:materializedGeneration,adoption:"CURRENT",evidence:consumerEvidence,currentness:currentness(consumerEvidence),locality});
  const convergence=normalizeRotationConvergence({contractVersion:"1.0.0",intent,acknowledgement:ack,adoption,residualCohorts:[residual("VERIFIER"),residual("CONSUMER"),residual("CACHE"),residual("OFFLINE"),residual("RECOVERY")],evidence:convergenceEvidence,currentness:currentness(convergenceEvidence),locality,state:"CONVERGED"});
  assert.equal(normalizedTrust.disposition,"TRUSTED");assert.equal("authorization" in normalizedTrust,false);assert.equal(allow.disposition,"ALLOW");
  assert.equal(normalizedDesired.desiredRevision.revisionRef,"r2");assert.equal(normalizedMaterialized.materializedGeneration.revisionRef,"r1");assert.equal(effective.adoption,"CURRENT");assert.equal(convergence.state,"CONVERGED");assert.equal(normalizeRecoveryVerification(verification).state,"VERIFIED");
  for(const presence of ["VALUE_REF","ABSENT","NULL","DEFAULT","DELETE"] as const){assert.equal(normalizeDesiredSecretConfigState({...desired,presence}).presence,presence);}
});

test("TASK-504 rejects promotion, leakage, substitution, hidden residuals and unsafe retry",()=>{
  const unknownDecision=normalizeAuthorizationDecision({contractVersion:IDENTITY_AUTHORIZATION_CONTRACT_VERSION,request,disposition:"UNKNOWN"},request);
  assert.throws(()=>normalizeDegradedAuthorityCeiling({...ceiling,sourceDecision:unknownDecision}),/cannot mint authority/);
  assert.throws(()=>normalizeTrustQualification({...trust,verifierEffectiveGeneration:{...trustGen,generation:rev("maintenance-bundle","bundle-r3","trust-generation")}}, {purpose:"operator-authentication",scope:"maintenance"}));
  assert.throws(()=>normalizeSecretConfigReference({...reference,secretValue:"forbidden"}));
  assert.throws(()=>normalizeDesiredSecretConfigState({...desired,presence:"VALUE_REF",desiredRevision:rev("secret/other","r2","secret-config","other")}));
  assert.throws(()=>normalizeConsumerEffectiveSecretConfigState({contractVersion:"1.0.0",materialized,consumerPopulation:"consumer-set-a",effectiveGeneration:desiredRevision,adoption:"CURRENT",evidence:consumerEvidence,currentness:currentness(consumerEvidence),locality}));
  assert.throws(()=>normalizeRotationAcknowledgement({...ack,providerVersionRef:"provider-v3"}));
  assert.throws(()=>normalizeRotationConvergence({contractVersion:"1.0.0",intent,acknowledgement:ack,adoption,residualCohorts:[],evidence:convergenceEvidence,currentness:currentness(convergenceEvidence),locality,state:"CONVERGED"}));
  assert.throws(()=>normalizeRecoveryVerification({...verification,residualCohorts:recoveryResiduals.slice(0,-1)}),/hidden residuals/);
  assert.throws(()=>normalizeRecoveryVerification({...verification,cut:{...cut,restoredAuthority:rev("maintenance-policy","policy-r3","authority-policy")}}),/cannot promote stale/);
  assert.throws(()=>normalizeFencingObservation({...fencing,epoch:oldEpoch,supersededEpoch:oldEpoch}),/cannot be reused/);
  assert.throws(()=>normalizeExternalEffectAssessment({...effect,retryDisposition:"SAFE_TO_RETRY"}),/reconcile-before-retry/);
  assert.throws(()=>normalizeRecoveryVerification({...verification,locality:{scopeKind:"FLEET",localityRef:"fleet-a"}}),/locality/);
});

test("TASK-504 preserves UNKNOWN/PARTIAL/INCONCLUSIVE and Product Proof remains distinct from Production Readiness",()=>{
  const unknownEffect=normalizeExternalEffectAssessment(effect);assert.equal(unknownEffect.outcome,"UNKNOWN");assert.equal(unknownEffect.retryDisposition,"RECONCILE_BEFORE_RETRY");
  const unknownTrust={...trust,credentialStatus:{...trust.credentialStatus,status:"UNKNOWN" as const,currentness:currentness(trustEvidence,"UNKNOWN")},disposition:"INCONCLUSIVE" as const};
  assert.throws(()=>normalizeTrustQualification(unknownTrust,{purpose:"operator-authentication",scope:"maintenance"}));
  const revocationEvidence=rev("revocation-evidence","rev-e1","revocation");
  const revocationIntent={contractVersion:REVOCATION_CONVERGENCE_CONTRACT_VERSION,identity:{contractVersion:IDENTITY_AUTHORIZATION_CONTRACT_VERSION,identity},authorityRevision:policy,desiredState:"REVOKED" as const,evidence:revocationEvidence,currentness:currentness(revocationEvidence),locality};
  const partial=normalizeRevocationConvergence({contractVersion:REVOCATION_CONVERGENCE_CONTRACT_VERSION,intent:revocationIntent,observedAuthorityRevision:policy,observedState:"ACTIVE",acknowledged:true,status:"PARTIAL",convergenceEvidence:revocationEvidence,convergenceCurrentness:currentness(revocationEvidence),residualCohorts:[{kind:"SESSION",populationCount:"UNKNOWN",evidence:revocationEvidence,currentness:currentness(revocationEvidence),locality}]},policy);
  assert.equal(partial.status,"PARTIAL");assert.equal(partial.observedState,"ACTIVE");assert.equal(partial.residualCohorts[0]?.populationCount,"UNKNOWN");
  assert.equal("productionReadiness" in verification,false);assert.equal("deployment" in verification,false);
});

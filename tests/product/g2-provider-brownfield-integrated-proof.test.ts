import assert from "node:assert/strict";
import test from "node:test";

import { BROWNFIELD_ASSIMILATION_CONTRACT_VERSION, normalizeBrownfieldAssimilation } from "../../packages/contracts/brownfield/assimilation.js";
import { EXTERNAL_IDENTITY_COEXISTENCE_CONTRACT_VERSION, normalizeExternalIdentityCoexistence } from "../../packages/contracts/brownfield/external-identity-coexistence.js";
import { LOCALITY_RECONCILIATION_CONTRACT_VERSION, normalizeLocalityReconciliation } from "../../packages/contracts/locality/reconciliation.js";
import { PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION, normalizePhysicalPeripheralInteraction } from "../../packages/contracts/physical/governance.js";
import { PROVIDER_QUALIFICATION_CONTRACT_VERSION, normalizeProviderBindingQualification } from "../../packages/contracts/provider/qualification.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const rev = (canonicalRef: string, revisionRef: string, semanticKind: string) => ({
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "g2-proof-owner",
  semanticKind,
  canonicalRef,
  definitionRef: `${canonicalRef}-definition`,
  revisionOwner: "g2-proof-owner",
  revisionDimension: "definition",
  revisionRef,
});
const peripheral = rev("peripheral/gate-a", "r2", "physical-peripheral");
const providerBinding = rev("provider/gate-a", "binding-r4", "provider-binding");
const providerEvidence = rev("provider/gate-a/evidence", "evidence-r9", "provider-qualification-evidence");
const currentness = (subject: ReturnType<typeof rev>, localityScope: string, state: "CURRENT" | "STALE" | "UNKNOWN" = "CURRENT") => ({
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  subject,
  revisionVector: [{ revisionOwner: subject.revisionOwner, revisionDimension: subject.revisionDimension, revisionRef: subject.revisionRef }],
  temporal: { occurredAt: null, observedAt: "2026-09-11T04:00:00Z", evaluatedAt: null, effectiveFrom: null, effectiveUntil: null, reconciledAt: state === "CURRENT" ? "2026-09-11T04:01:00Z" : null },
  populationScope: "g2/wp-06/proof",
  localityScope,
  currentnessHorizon: { assessedAt: "2026-09-11T04:00:00Z", validUntil: "2026-09-11T05:00:00Z" },
  state,
  reason: `TASK-515 ${state.toLowerCase()} evidence`,
});
const provider = (overrides: Record<string, unknown> = {}) => ({
  contractVersion: PROVIDER_QUALIFICATION_CONTRACT_VERSION,
  binding: providerBinding,
  providerRealizationRef: "vendor/gate-a/42",
  evidence: providerEvidence,
  currentness: currentness(providerEvidence, "station-alpha"),
  evidenceAuthority: "AUTHORITATIVE" as const,
  dimensions: [{ dimension: "transport", status: "SUPPORTED" as const, reason: "qualified transport" }],
  disposition: "SUPPORTED" as const,
  ...overrides,
});
const brownfieldEvidence = (overrides: Record<string, unknown> = {}) => ({
  evidenceRef: "scan-42",
  subject: peripheral,
  ownerRef: "ops-team",
  provenanceRef: "scanner/session-42",
  localityScope: "station-alpha",
  authority: "AUTHORITATIVE" as const,
  completeness: "KNOWN" as const,
  currentness: currentness(peripheral, "station-alpha"),
  ...overrides,
});
const brownfield = (overrides: Record<string, unknown> = {}) => ({
  contractVersion: BROWNFIELD_ASSIMILATION_CONTRACT_VERSION,
  canonicalState: peripheral,
  evidence: [brownfieldEvidence()],
  disposition: "ASSIMILATE" as const,
  ...overrides,
});
const authority = (sourceRef: string, epoch: number, canonical: boolean) => ({ sourceRef, scopeRef: "tenant-a/assets", epoch, fencingToken: `fence-${epoch}`, canonical });
const binding = (overrides: Record<string, unknown> = {}) => ({ bindingRef: "binding-old", providerRef: "provider-a", scopeRef: "tenant-a/assets", externalId: "device-7", canonicalEntityRef: "asset-a", bindingRevision: "r1", epoch: 1, sourceRef: "source-old", fencingToken: "fence-1", evidenceRef: "evidence-old", evidenceAuthority: "AUTHORITATIVE" as const, state: "RESIDUAL" as const, ...overrides });
const coexistence = () => ({
  contractVersion: EXTERNAL_IDENTITY_COEXISTENCE_CONTRACT_VERSION,
  sourceAuthorities: [authority("source-old", 1, false), authority("source-new", 2, true)],
  bindings: [binding(), binding({ bindingRef: "binding-new", canonicalEntityRef: "asset-b", bindingRevision: "r2", epoch: 2, sourceRef: "source-new", fencingToken: "fence-2", evidenceRef: "evidence-new", state: "ACTIVE" })],
  rebindings: [{ rebindRef: "rebind-1", priorBindingRef: "binding-old", nextBindingRef: "binding-new", qualification: "CONFIRMED", evidenceRef: "rebinding-proof", evidenceAuthority: "AUTHORITATIVE" }],
  residualCohorts: [{ cohortRef: "residual-device-7", providerRef: "provider-a", scopeRef: "tenant-a/assets", externalId: "device-7", bindingRefs: ["binding-old"], completeness: "KNOWN", drained: false }],
});
const observation = (kind: "LOCAL" | "STATION" | "FLEET", localityRef: string, authorityState: "LOCAL_AUTHORITY" | "CANONICAL_SOURCE" | "OBSERVED", state: "CURRENT" | "STALE" | "UNKNOWN" = "CURRENT") => ({ kind, localityRef, subject: peripheral, currentness: currentness(peripheral, localityRef, state), authority: authorityState });
const locality = () => ({
  contractVersion: LOCALITY_RECONCILIATION_CONTRACT_VERSION,
  canonicalSource: peripheral,
  observations: [observation("LOCAL", "local:gate-a", "LOCAL_AUTHORITY"), observation("STATION", "station-alpha", "OBSERVED"), observation("FLEET", "fleet:primary", "CANONICAL_SOURCE")],
  conflict: "NONE" as const,
  reconciliation: "RECONCILED" as const,
  residuals: [{ localityRef: "station:legacy", subject: peripheral, state: "DRAINED" as const }],
});
const physicalQualification = (overrides: Record<string, unknown> = {}) => ({ contractVersion: PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION, peripheral, providerQualification: provider(), localityRef: "station-alpha", currentness: currentness(peripheral, "station-alpha"), capability: "SUPPORTED" as const, ...overrides });
const actuation = (overrides: Record<string, unknown> = {}) => ({ contractVersion: PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION, qualification: physicalQualification(), intentKind: "ACTUATE" as const, requestedIntentRef: "intent/open-gate", owningDomainAuthorityRef: "access-control/authorization/77", authorization: "AUTHORIZED" as const, observedTelemetry: "PRESENT" as const, effect: "CONFIRMED" as const, ...overrides });

test("TASK-515 proves the integrated happy path without manufacturing new authority", () => {
  assert.equal(normalizeProviderBindingQualification(provider()).disposition, "SUPPORTED");
  assert.equal(normalizeBrownfieldAssimilation(brownfield()).disposition, "ASSIMILATE");
  assert.equal(normalizeExternalIdentityCoexistence(coexistence()).residualCohorts[0]!.bindingRefs[0], "binding-old");
  assert.equal(normalizeLocalityReconciliation(locality()).observations[2]!.authority, "CANONICAL_SOURCE");
  assert.equal(normalizePhysicalPeripheralInteraction(actuation()).effect, "CONFIRMED");
});

test("TASK-515 rejects parity inference staleness identity reuse dual truth hidden residual local promotion and implicit actuation authority", () => {
  assert.throws(() => normalizeProviderBindingQualification(provider({ dimensions: [{ dimension: "transport", status: "PARTIAL", reason: "API parity only" }] })), /cannot strengthen/);
  assert.throws(() => normalizeProviderBindingQualification(provider({ evidenceAuthority: "INFERRED" })), /cannot establish provider support authority/);
  assert.throws(() => normalizeBrownfieldAssimilation(brownfield({ evidence: [brownfieldEvidence({ currentness: currentness(peripheral, "station-alpha", "UNKNOWN") })] })), /reconcile-before-retry/);
  const identity = coexistence();
  assert.throws(() => normalizeExternalIdentityCoexistence({ ...identity, rebindings: [] }), /cannot imply same or rebound entity/);
  assert.throws(() => normalizeExternalIdentityCoexistence({ ...identity, sourceAuthorities: [authority("source-old", 1, true), authority("source-new", 2, true)] }), /exactly one canonical source authority/);
  assert.throws(() => normalizeExternalIdentityCoexistence({ ...identity, residualCohorts: [] }), /residual binding cohorts must remain explicit/);
  const local = locality();
  assert.throws(() => normalizeLocalityReconciliation({ ...local, observations: [observation("LOCAL", "local:gate-a", "LOCAL_AUTHORITY")] }), /local authority cannot substitute canonical source ownership/);
  assert.throws(() => normalizePhysicalPeripheralInteraction(actuation({ owningDomainAuthorityRef: null })), /requires external owning-domain authority/);
  assert.throws(() => normalizePhysicalPeripheralInteraction(actuation({ observedTelemetry: "MISSING" })), /missing telemetry cannot imply confirmed physical effect/);
});

test("TASK-515 proves conservative UNKNOWN recovery through explicit reconciliation", () => {
  const unknownProvider = normalizeProviderBindingQualification(provider({ dimensions: [{ dimension: "transport", status: "UNKNOWN", reason: "needs reconciliation" }], disposition: "UNKNOWN" }));
  assert.equal(unknownProvider.disposition, "UNKNOWN");
  assert.equal(normalizeProviderBindingQualification(provider()).disposition, "SUPPORTED");

  const uncertainBrownfield = normalizeBrownfieldAssimilation(brownfield({ evidence: [brownfieldEvidence({ completeness: "UNKNOWN" })], disposition: "RECONCILE_REQUIRED" }));
  assert.equal(uncertainBrownfield.disposition, "RECONCILE_REQUIRED");
  assert.equal(normalizeBrownfieldAssimilation(brownfield()).disposition, "ASSIMILATE");

  const partitioned = normalizeLocalityReconciliation({ ...locality(), observations: [observation("STATION", "station-alpha", "OBSERVED", "UNKNOWN")], conflict: "UNKNOWN", reconciliation: "PARTITIONED", residuals: [{ localityRef: "station-alpha", subject: peripheral, state: "VISIBLE" }] });
  assert.equal(partitioned.reconciliation, "PARTITIONED");
  assert.equal(normalizeLocalityReconciliation(locality()).reconciliation, "RECONCILED");
});

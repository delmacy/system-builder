import assert from "node:assert/strict";
import test from "node:test";

import { BROWNFIELD_RECOVERY_CONTRACT_VERSION, normalizeBrownfieldRecovery } from "../../packages/contracts/brownfield/recovery.js";
import { EXTERNAL_IDENTITY_COEXISTENCE_CONTRACT_VERSION } from "../../packages/contracts/brownfield/external-identity-coexistence.js";
import { LOCALITY_RECONCILIATION_CONTRACT_VERSION } from "../../packages/contracts/locality/reconciliation.js";
import { PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION, normalizePhysicalPeripheralInteraction } from "../../packages/contracts/physical/governance.js";
import { PROVIDER_QUALIFICATION_CONTRACT_VERSION, normalizeProviderRecovery } from "../../packages/contracts/provider/index.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const rev = (canonicalRef: string, revisionRef: string, semanticKind: string) => ({
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "g2-recovery-proof",
  semanticKind,
  canonicalRef,
  definitionRef: `${canonicalRef}-definition`,
  revisionOwner: "g2-recovery-proof",
  revisionDimension: "definition",
  revisionRef,
});

const currentness = (subject: ReturnType<typeof rev>, localityScope: string, state: "CURRENT" | "STALE" | "UNKNOWN" = "CURRENT", populationScope = "tenant-a/assets") => ({
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  subject,
  revisionVector: [{ revisionOwner: subject.revisionOwner, revisionDimension: subject.revisionDimension, revisionRef: subject.revisionRef }],
  temporal: { occurredAt: null, observedAt: "2026-09-11T09:00:00Z", evaluatedAt: null, effectiveFrom: null, effectiveUntil: null, reconciledAt: state === "CURRENT" ? "2026-09-11T09:01:00Z" : null },
  populationScope,
  localityScope,
  currentnessHorizon: { assessedAt: "2026-09-11T09:00:00Z", validUntil: "2026-09-11T10:00:00Z" },
  state,
  reason: `TASK-518 ${state.toLowerCase()} proof`,
});

const providerBinding = rev("provider/payment", "binding-r1", "provider-binding");
const providerEvidence = rev("provider/payment/evidence", "r1", "provider-qualification-evidence");
const providerQualification = (state: "CURRENT" | "STALE" | "UNKNOWN" = "CURRENT", evidenceAuthority: "AUTHORITATIVE" | "OBSERVED" | "INFERRED" = "AUTHORITATIVE") => ({
  contractVersion: PROVIDER_QUALIFICATION_CONTRACT_VERSION,
  binding: providerBinding,
  providerRealizationRef: "provider/payment/42",
  evidence: providerEvidence,
  currentness: currentness(providerEvidence, "station-alpha", state, "provider-binding/payment"),
  evidenceAuthority,
  dimensions: [{ dimension: "capability", status: evidenceAuthority === "AUTHORITATIVE" && state === "CURRENT" ? "SUPPORTED" as const : "UNKNOWN" as const, reason: "recovery proof" }],
  disposition: evidenceAuthority === "AUTHORITATIVE" && state === "CURRENT" ? "SUPPORTED" as const : "UNKNOWN" as const,
});

const asset = rev("asset-b", "r2", "external-binding");
const authority = (sourceRef: string, epoch: number, canonical: boolean) => ({ sourceRef, scopeRef: "tenant-a/assets", epoch, fencingToken: `fence-${epoch}`, canonical });
const binding = (overrides: Record<string, unknown> = {}) => ({ bindingRef: "binding-old", providerRef: "provider-a", scopeRef: "tenant-a/assets", externalId: "device-7", canonicalEntityRef: "asset-a", bindingRevision: "r1", epoch: 1, sourceRef: "source-old", fencingToken: "fence-1", evidenceRef: "old", evidenceAuthority: "AUTHORITATIVE" as const, state: "DRAINED" as const, ...overrides });
const coexistence = (drained = true) => ({
  contractVersion: EXTERNAL_IDENTITY_COEXISTENCE_CONTRACT_VERSION,
  sourceAuthorities: [authority("source-old", 1, false), authority("source-new", 2, true)],
  bindings: [binding(), binding({ bindingRef: "binding-new", canonicalEntityRef: "asset-b", bindingRevision: "r2", epoch: 2, sourceRef: "source-new", fencingToken: "fence-2", evidenceRef: "new", state: "ACTIVE" })],
  rebindings: [{ rebindRef: "rebind-1", priorBindingRef: "binding-old", nextBindingRef: "binding-new", qualification: "CONFIRMED", evidenceRef: "rebinding-proof", evidenceAuthority: "AUTHORITATIVE" }],
  residualCohorts: [{ cohortRef: "residual-device-7", providerRef: "provider-a", scopeRef: "tenant-a/assets", externalId: "device-7", bindingRefs: ["binding-old"], completeness: "KNOWN", drained }],
});
const locality = (overrides: Record<string, unknown> = {}) => ({
  contractVersion: LOCALITY_RECONCILIATION_CONTRACT_VERSION,
  canonicalSource: asset,
  observations: [{ kind: "FLEET", localityRef: "fleet:primary", subject: asset, currentness: currentness(asset, "fleet:primary"), authority: "CANONICAL_SOURCE" }],
  conflict: "NONE" as const,
  reconciliation: "RECONCILED" as const,
  residuals: [{ localityRef: "station:legacy", subject: asset, state: "DRAINED" as const }],
  ...overrides,
});
const brownfieldRecovery = (overrides: Record<string, unknown> = {}) => ({
  contractVersion: BROWNFIELD_RECOVERY_CONTRACT_VERSION,
  coexistence: coexistence(true),
  locality: locality(),
  drainageEvidence: [{ cohortRef: "residual-device-7", evidenceRef: "drain-proof", evidenceAuthority: "AUTHORITATIVE", completeness: "KNOWN" }],
  disposition: "RECOVERY_ELIGIBLE" as const,
  ...overrides,
});

const peripheral = rev("peripheral/gate-a", "r2", "physical-peripheral");
const physicalProviderEvidence = rev("provider/gate-a/evidence", "evidence-r9", "provider-qualification-evidence");
const physicalProviderBinding = rev("provider/gate-a", "binding-r4", "provider-binding");
const physicalProvider = () => ({ contractVersion: PROVIDER_QUALIFICATION_CONTRACT_VERSION, binding: physicalProviderBinding, providerRealizationRef: "vendor/gate-a/42", evidence: physicalProviderEvidence, currentness: currentness(physicalProviderEvidence, "station-alpha", "CURRENT", "g2/wp-06/proof"), evidenceAuthority: "AUTHORITATIVE" as const, dimensions: [{ dimension: "transport", status: "SUPPORTED" as const, reason: "qualified transport" }], disposition: "SUPPORTED" as const });
const physicalInteraction = (overrides: Record<string, unknown> = {}) => ({ contractVersion: PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION, qualification: { contractVersion: PHYSICAL_PERIPHERAL_GOVERNANCE_CONTRACT_VERSION, peripheral, providerQualification: physicalProvider(), localityRef: "station-alpha", currentness: currentness(peripheral, "station-alpha", "CURRENT", "g2/wp-06/proof"), capability: "SUPPORTED" as const }, intentKind: "ACTUATE" as const, requestedIntentRef: "intent/open-gate", owningDomainAuthorityRef: "access-control/authorization/77", authorization: "AUTHORIZED" as const, observedTelemetry: "PRESENT" as const, effect: "CONFIRMED" as const, ...overrides });

test("TASK-518 keeps degraded or inferred provider authority conservative until authoritative reconciliation", () => {
  const previous = providerQualification();
  for (const current of [providerQualification("UNKNOWN"), providerQualification("STALE"), providerQualification("CURRENT", "INFERRED")]) {
    assert.throws(() => normalizeProviderRecovery({ contractVersion: "1.0.0", previous, current, reconciliationOutcome: "NOT_RECONCILED", disposition: "RETRY_ELIGIBLE" }), /reconcile|reconciliation/);
  }
  assert.equal(normalizeProviderRecovery({ contractVersion: "1.0.0", previous, current: providerQualification(), reconciliationOutcome: "AUTHORITATIVELY_RECONCILED", disposition: "RETRY_ELIGIBLE" }).disposition, "RETRY_ELIGIBLE");
});

test("TASK-518 preserves fencing, one canonical truth and explicit residual drainage through recovery", () => {
  assert.equal(normalizeBrownfieldRecovery(brownfieldRecovery()).disposition, "RECOVERY_ELIGIBLE");
  const base = coexistence(true);
  assert.throws(() => normalizeBrownfieldRecovery(brownfieldRecovery({ coexistence: { ...base, bindings: [{ ...base.bindings[0], state: "ACTIVE" }, base.bindings[1]] } })), /stale binding cannot resurrect authority/);
  assert.throws(() => normalizeBrownfieldRecovery(brownfieldRecovery({ coexistence: { ...base, sourceAuthorities: base.sourceAuthorities.map((item) => ({ ...item, canonical: true })) } })), /exactly one canonical source authority/);
  assert.equal(normalizeBrownfieldRecovery(brownfieldRecovery({ coexistence: coexistence(false), drainageEvidence: [], disposition: "RECONCILE_REQUIRED" })).disposition, "RECONCILE_REQUIRED");
  assert.throws(() => normalizeBrownfieldRecovery(brownfieldRecovery({ coexistence: coexistence(false), drainageEvidence: [] })), /reconcile-before-retry/);
});

test("TASK-518 rejects local reconnect promotion to global truth", () => {
  assert.throws(() => normalizeBrownfieldRecovery(brownfieldRecovery({ locality: locality({ observations: [{ kind: "LOCAL", localityRef: "local:gate-a", subject: asset, currentness: currentness(asset, "local:gate-a"), authority: "LOCAL_AUTHORITY" }] }) })), /local authority cannot substitute canonical source ownership|reconcile/);
});

test("TASK-518 keeps connectivity authorization and confirmed physical effect separate after recovery", () => {
  assert.equal(normalizePhysicalPeripheralInteraction(physicalInteraction()).effect, "CONFIRMED");
  assert.throws(() => normalizePhysicalPeripheralInteraction(physicalInteraction({ owningDomainAuthorityRef: null })), /requires external owning-domain authority/);
  assert.throws(() => normalizePhysicalPeripheralInteraction(physicalInteraction({ observedTelemetry: "MISSING" })), /missing telemetry cannot imply confirmed physical effect/);
});

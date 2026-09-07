import assert from "node:assert/strict";
import test from "node:test";
import { normalizeFederatedSemanticEdgeQualification } from "../../packages/contracts/semantic-substrate/federation.js";

const revision = (semanticOwner: string, canonicalRef: string, revisionRef: string) => ({
  contractVersion: "1.0.0",
  semanticOwner,
  semanticKind: "status",
  canonicalRef,
  definitionRef: `${canonicalRef}:definition`,
  revisionOwner: semanticOwner,
  revisionDimension: "definition",
  revisionRef,
});

const stationStatus = revision("station-a", "asset:radar-01", "station-r3");
const fleetProjection = revision("fleet-view", "asset:radar-01", "fleet-r8");

const temporal = {
  occurredAt: null,
  observedAt: "2026-09-07T16:00:00Z",
  evaluatedAt: "2026-09-07T16:01:00Z",
  effectiveFrom: null,
  effectiveUntil: null,
  reconciledAt: null,
};

const currentness = (subject: typeof stationStatus, localityScope: string, state: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT") => ({
  contractVersion: "1.0.0",
  subject,
  revisionVector: [{ revisionOwner: subject.revisionOwner, revisionDimension: subject.revisionDimension, revisionRef: subject.revisionRef }],
  temporal,
  populationScope: "asset:radar",
  localityScope,
  currentnessHorizon: { assessedAt: "2026-09-07T16:01:00Z", validUntil: "2026-09-07T16:06:00Z" },
  state,
  reason: `${state.toLowerCase()} at source`,
});

const qualification = () => ({
  contractVersion: "1.0.0",
  producerSystem: { contractVersion: "1.0.0", systemOwner: "operations-a", systemRef: "station-system-a", systemRevisionRef: "release-21" },
  consumerSystem: { contractVersion: "1.0.0", systemOwner: "fleet-office", systemRef: "fleet-projection", systemRevisionRef: "release-9" },
  relation: { relationKind: "derives_from", source: stationStatus, target: fleetProjection, metadata: { projection: "fleet" } },
  producerCurrentness: currentness(stationStatus, "station:A", "STALE"),
  consumerCurrentness: currentness(fleetProjection, "fleet:global", "CURRENT"),
  producerLocality: { scopeKind: "STATION", localityRef: "station:A" },
  consumerLocality: { scopeKind: "FLEET", localityRef: "fleet:global" },
  connectivity: "DISCONNECTED",
});

test("federation preserves bilateral system revision, semantic ownership and independent locality/currentness", () => {
  const normalized = normalizeFederatedSemanticEdgeQualification(qualification());
  assert.equal(normalized.producerSystem.systemRevisionRef, "release-21");
  assert.equal(normalized.consumerSystem.systemRevisionRef, "release-9");
  assert.equal(normalized.relation.source.semanticOwner, "station-a");
  assert.equal(normalized.relation.target.semanticOwner, "fleet-view");
  assert.equal(normalized.producerLocality.scopeKind, "STATION");
  assert.equal(normalized.consumerLocality.scopeKind, "FLEET");
  assert.equal(normalized.producerCurrentness.state, "STALE");
  assert.equal(normalized.consumerCurrentness.state, "CURRENT");
  assert.equal(normalized.connectivity, "DISCONNECTED");
  assert.ok(Object.isFrozen(normalized));
});

test("fleet currentness cannot substitute for or silently strengthen station currentness", () => {
  const value = qualification();
  value.producerCurrentness = currentness(fleetProjection, "fleet:global", "CURRENT");
  assert.throws(
    () => normalizeFederatedSemanticEdgeQualification(value),
    /producer currentness must qualify the exact producer semantic revision/,
  );

  const localityDrift = qualification();
  localityDrift.producerLocality = { scopeKind: "FLEET", localityRef: "fleet:global" };
  assert.throws(
    () => normalizeFederatedSemanticEdgeQualification(localityDrift),
    /producer currentness locality must exactly match producer locality qualification/,
  );
});

test("remote stale or unknown qualification remains explicit and does not imply synchronized truth", () => {
  for (const state of ["STALE", "UNKNOWN"] as const) {
    const value = qualification();
    value.consumerCurrentness = currentness(fleetProjection, "remote:fleet", state);
    value.consumerLocality = { scopeKind: "REMOTE", localityRef: "remote:fleet" };
    value.connectivity = state === "UNKNOWN" ? "UNKNOWN" : "DISCONNECTED";
    const normalized = normalizeFederatedSemanticEdgeQualification(value);

    assert.equal(normalized.producerCurrentness.state, "STALE");
    assert.equal(normalized.consumerCurrentness.state, state);
    assert.equal(normalized.producerCurrentness.subject.revisionRef, "station-r3");
    assert.equal(normalized.consumerCurrentness.subject.revisionRef, "fleet-r8");
    assert.equal(normalized.producerCurrentness.localityScope, "station:A");
    assert.equal(normalized.consumerCurrentness.localityScope, "remote:fleet");
    assert.equal(normalized.producerLocality.scopeKind, "STATION");
    assert.equal(normalized.consumerLocality.scopeKind, "REMOTE");
    assert.notEqual(normalized.producerSystem.systemRef, normalized.consumerSystem.systemRef);
    assert.notEqual(normalized.producerCurrentness.subject.semanticOwner, normalized.consumerCurrentness.subject.semanticOwner);
    assert.notEqual(normalized.producerCurrentness.subject.revisionRef, normalized.consumerCurrentness.subject.revisionRef);
    assert.notEqual(normalized.producerCurrentness.localityScope, normalized.consumerCurrentness.localityScope);
    assert.notEqual(normalized.consumerCurrentness.state, "CURRENT");
  }
});

test("duplicate-looking remote canonical refs remain owner-qualified and systems cannot collapse bilaterally", () => {
  const normalized = normalizeFederatedSemanticEdgeQualification(qualification());
  assert.equal(normalized.relation.source.canonicalRef, normalized.relation.target.canonicalRef);
  assert.notEqual(normalized.relation.source.semanticOwner, normalized.relation.target.semanticOwner);

  const sameSystem = qualification();
  sameSystem.consumerSystem = { ...sameSystem.producerSystem, systemRevisionRef: "release-22" };
  assert.throws(
    () => normalizeFederatedSemanticEdgeQualification(sameSystem),
    /requires distinct producer and consumer systems/,
  );
});

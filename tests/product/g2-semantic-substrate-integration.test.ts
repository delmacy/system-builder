import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeCanonicalSemanticIdentityRef,
  normalizeCurrentnessQualification,
  normalizeDefinitionRef,
  normalizeDefinitionRevisionRef,
  normalizeFederatedSemanticEdgeQualification,
  normalizeOccurrenceRef,
  normalizeRealizationIdentityRef,
  normalizeRevisionVector,
  normalizeTypedSemanticGraph,
} from "../../packages/contracts/semantic-substrate/index.js";

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

const temporal = {
  occurredAt: "2026-09-07T17:00:00Z",
  observedAt: "2026-09-07T17:01:00Z",
  evaluatedAt: "2026-09-07T17:02:00Z",
  effectiveFrom: null,
  effectiveUntil: null,
  reconciledAt: null,
};

const currentness = (
  subject: ReturnType<typeof revision>,
  localityScope: string,
  state: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT",
) => ({
  contractVersion: "1.0.0",
  subject,
  revisionVector: [
    { revisionOwner: "shared-schema", revisionDimension: "schema", revisionRef: "schema-r2" },
    { revisionOwner: subject.revisionOwner, revisionDimension: subject.revisionDimension, revisionRef: subject.revisionRef },
  ],
  temporal,
  populationScope: "asset:radar",
  localityScope,
  currentnessHorizon: { assessedAt: "2026-09-07T17:02:00Z", validUntil: "2026-09-07T17:07:00Z" },
  state,
  reason: `${state.toLowerCase()} at source`,
});

test("public semantic substrate composes owner-qualified identity, revision, currentness, graph and federation without strengthening", () => {
  const stationCanonical = normalizeCanonicalSemanticIdentityRef({
    contractVersion: "1.0.0",
    semanticOwner: "station-a",
    semanticKind: "status",
    canonicalRef: "asset:radar-01",
  });
  const stationDefinition = normalizeDefinitionRef({ ...stationCanonical, definitionRef: "asset:radar-01:definition" });
  const stationOccurrence = normalizeOccurrenceRef({ ...stationCanonical, occurrenceRef: "observation:1442" });
  const stationRealization = normalizeRealizationIdentityRef({
    contractVersion: "1.0.0",
    semanticOwner: "station-a",
    semanticKind: "status",
    realizationProvider: "adapter-a",
    realizationRef: "provider-row-991",
  });
  const stationRevision = normalizeDefinitionRevisionRef(revision("station-a", "asset:radar-01", "station-r3"));
  const fleetRevision = normalizeDefinitionRevisionRef(revision("fleet-view", "asset:radar-01", "fleet-r8"));

  assert.equal(stationCanonical.canonicalRef, stationDefinition.canonicalRef);
  assert.equal(stationDefinition.definitionRef, stationRevision.definitionRef);
  assert.notEqual(stationOccurrence.occurrenceRef, stationDefinition.definitionRef);
  assert.notEqual(stationRealization.realizationRef, stationRevision.revisionRef);

  const vector = normalizeRevisionVector([
    { revisionOwner: "station-a", revisionDimension: "definition", revisionRef: "station-r3" },
    { revisionOwner: "shared-schema", revisionDimension: "schema", revisionRef: "schema-r2" },
  ]);
  assert.deepEqual(vector.map(({ revisionOwner, revisionDimension }) => `${revisionOwner}/${revisionDimension}`), [
    "shared-schema/schema",
    "station-a/definition",
  ]);

  const producerCurrentness = normalizeCurrentnessQualification(currentness(stationRevision, "station:A", "STALE"));
  const consumerCurrentness = normalizeCurrentnessQualification(currentness(fleetRevision, "fleet:global", "UNKNOWN"));
  assert.equal(producerCurrentness.state, "STALE");
  assert.equal(consumerCurrentness.state, "UNKNOWN");

  const graph = normalizeTypedSemanticGraph({
    contractVersion: "1.0.0",
    nodes: [
      { ref: fleetRevision, metadata: { role: "projection" } },
      { ref: stationRevision, metadata: { role: "source" } },
    ],
    relations: [
      { relationKind: "derives_from", source: stationRevision, target: fleetRevision, metadata: { direction: "producer-to-consumer" } },
    ],
  });
  assert.equal(graph.nodes[0]?.ref.semanticOwner, "fleet-view");
  assert.equal(graph.nodes[1]?.ref.semanticOwner, "station-a");
  assert.equal(graph.relations[0]?.source.semanticOwner, "station-a");
  assert.equal(graph.relations[0]?.target.semanticOwner, "fleet-view");

  const federated = normalizeFederatedSemanticEdgeQualification({
    contractVersion: "1.0.0",
    producerSystem: { contractVersion: "1.0.0", systemOwner: "operations-a", systemRef: "station-system-a", systemRevisionRef: "release-21" },
    consumerSystem: { contractVersion: "1.0.0", systemOwner: "fleet-office", systemRef: "fleet-projection", systemRevisionRef: "release-9" },
    relation: graph.relations[0],
    producerCurrentness,
    consumerCurrentness,
    producerLocality: { scopeKind: "STATION", localityRef: "station:A" },
    consumerLocality: { scopeKind: "FLEET", localityRef: "fleet:global" },
    connectivity: "DISCONNECTED",
  });
  assert.equal(federated.producerCurrentness.state, "STALE");
  assert.equal(federated.consumerCurrentness.state, "UNKNOWN");
  assert.equal(federated.producerLocality.scopeKind, "STATION");
  assert.equal(federated.consumerLocality.scopeKind, "FLEET");
  assert.equal(federated.connectivity, "DISCONNECTED");
});

test("integrated semantic substrate fails closed on identity, revision, owner, currentness, relation and locality substitution", () => {
  const stationRevision = revision("station-a", "asset:radar-01", "station-r3");
  const fleetRevision = revision("fleet-view", "asset:radar-01", "fleet-r8");

  assert.throws(
    () => normalizeCanonicalSemanticIdentityRef({ ...stationRevision, realizationRef: "provider-row-991" }),
    /unexpected field/,
  );

  assert.throws(
    () => normalizeRevisionVector([
      { revisionOwner: "station-a", revisionDimension: "definition", revisionRef: "station-r3" },
      { revisionOwner: "station-a", revisionDimension: "definition", revisionRef: "station-r4" },
    ]),
    /duplicate revision dimension/,
  );

  assert.throws(
    () => normalizeTypedSemanticGraph({
      contractVersion: "1.0.0",
      nodes: [{ ref: stationRevision, metadata: {} }, { ref: fleetRevision, metadata: {} }],
      relations: [{ relationKind: "authoritative_for", source: stationRevision, target: fleetRevision, metadata: {} }],
    }),
    /unknown semantic relation kind/,
  );

  const producerCurrentness = currentness(stationRevision, "station:A", "STALE");
  const consumerCurrentness = currentness(fleetRevision, "fleet:global", "UNKNOWN");
  const base = {
    contractVersion: "1.0.0",
    producerSystem: { contractVersion: "1.0.0", systemOwner: "operations-a", systemRef: "station-system-a", systemRevisionRef: "release-21" },
    consumerSystem: { contractVersion: "1.0.0", systemOwner: "fleet-office", systemRef: "fleet-projection", systemRevisionRef: "release-9" },
    relation: { relationKind: "derives_from", source: stationRevision, target: fleetRevision, metadata: {} },
    producerCurrentness,
    consumerCurrentness,
    producerLocality: { scopeKind: "STATION", localityRef: "station:A" },
    consumerLocality: { scopeKind: "FLEET", localityRef: "fleet:global" },
    connectivity: "DISCONNECTED",
  };

  assert.throws(
    () => normalizeFederatedSemanticEdgeQualification({ ...base, producerCurrentness: currentness(fleetRevision, "fleet:global", "CURRENT") }),
    /producer currentness must qualify the exact producer semantic revision/,
  );

  assert.throws(
    () => normalizeFederatedSemanticEdgeQualification({ ...base, producerLocality: { scopeKind: "FLEET", localityRef: "fleet:global" } }),
    /producer currentness locality must exactly match producer locality qualification/,
  );
});

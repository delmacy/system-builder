import assert from "node:assert/strict";
import test from "node:test";

import { type DrainageAssumptions, type FiniteFlowPopulationIdentity } from "../../packages/contracts/finite-flow/finite-flow.js";
import type { UnitReference } from "../../packages/contracts/mathematical-semantics/index.js";
import { STORAGE_DISPOSITION_CONTRACT_VERSION, assessStorageDisposition, normalizeStorageDispositionEvidence } from "../../packages/contracts/storage/storage-disposition.js";
import { STORAGE_IDENTITY_CONTRACT_VERSION, normalizeCanonicalStorageIdentity } from "../../packages/contracts/storage/storage-identity.js";

const rateUnit: UnitReference = {
  state: "KNOWN",
  unitRef: "copies-per-second",
  unitRevision: "1",
  dimension: { terms: [{ axis: "copy", exponent: 1 }, { axis: "time", exponent: -1 }] },
};
const population: FiniteFlowPopulationIdentity = { queueRef: "queue:storage-disposition", populationRef: "object:1:copies", scopeRef: "tenant:1" };
const identity = normalizeCanonicalStorageIdentity({
  contractVersion: STORAGE_IDENTITY_CONTRACT_VERSION,
  canonicalObjectRef: "object:1",
  canonicalRevisionRef: "object:1:r7",
  objectKind: "DOCUMENT",
  sourceOfTruth: { authorityRef: "authority:documents", authorityRevisionRef: "authority:documents:r4", providerCopyRef: "copy:source" },
  providerCopies: [
    { copyRef: "copy:source", providerRef: "provider:a", providerKey: "source", copyRevisionRef: "copy:source:r1", transportAttemptRef: "attempt:source", integrity: null, lifecycle: "ACTIVE", availability: "AVAILABLE", completeness: "KNOWN", currentness: { state: "CURRENT", assessedAt: "2026-09-12T00:00:00Z", validUntil: "2026-09-13T00:00:00Z" } },
    { copyRef: "copy:residual", providerRef: "provider:b", providerKey: "residual", copyRevisionRef: "copy:residual:r1", transportAttemptRef: "attempt:residual", integrity: null, lifecycle: "RESIDUAL", availability: "AVAILABLE", completeness: "KNOWN", currentness: { state: "CURRENT", assessedAt: "2026-09-12T00:00:00Z", validUntil: "2026-09-13T00:00:00Z" } },
  ],
});

const disposition = (overrides: Record<string, unknown> = {}) => normalizeStorageDispositionEvidence({
  contractVersion: STORAGE_DISPOSITION_CONTRACT_VERSION,
  dispositionRef: "disposition:1",
  canonicalObjectRef: "object:1",
  canonicalRevisionRef: "object:1:r7",
  target: {
    populationRef: population.populationRef,
    scopeRef: population.scopeRef,
    authorityRef: "authority:documents",
    authorityRevisionRef: "authority:documents:r4",
    providerCopyRefs: ["copy:residual"],
    transferLineageRefs: ["lineage:residual"],
  },
  acknowledgedCopyRefs: ["copy:residual"],
  residualCohorts: [{ cohortRef: "cohort:residual", populationRef: population.populationRef, scopeRef: population.scopeRef, providerCopyRefs: ["copy:residual"], knowledge: "KNOWN", telemetryComplete: true }],
  knowledge: "KNOWN",
  sourceOfTruthEvidencePreserved: true,
  lifecycleEvidencePreserved: true,
  ...overrides,
});

const flow = (overrides: Partial<DrainageAssumptions> = {}): DrainageAssumptions => ({
  horizonMs: 1000,
  arrival: { value: 1, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  service: { value: 5, unit: rateUnit, populationRef: population.populationRef, scopeRef: population.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items: 1, knowledge: "KNOWN", telemetryComplete: true },
  replay: { requestedItems: 0, maximumReplayItems: 2, deduplicationBoundItems: 2 },
  ...overrides,
});

test("TASK-525 deletion ACK never proves residual provider copies drained", () => {
  const result = assessStorageDisposition(identity, disposition(), population, flow());
  assert.equal(result.residualCopyCount, 1);
  assert.equal(result.drainage, "DRAINABLE");
  assert.notEqual(result.drainage, "DRAINED");
});

test("TASK-525 proves drained only from explicit zero residual population and finite-flow evidence", () => {
  const evidence = disposition({ residualCohorts: [] });
  const result = assessStorageDisposition(identity, evidence, population, flow({ backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items: 0, knowledge: "KNOWN", telemetryComplete: true } }));
  assert.equal(result.valid, true);
  assert.equal(result.residualCopyCount, 0);
  assert.equal(result.drainage, "DRAINED");
});

test("TASK-525 PARTIAL UNKNOWN or incomplete telemetry cannot manufacture zero residual population", () => {
  for (const residualCohorts of [
    [{ cohortRef: "cohort:partial", populationRef: population.populationRef, scopeRef: population.scopeRef, providerCopyRefs: [], knowledge: "PARTIAL", telemetryComplete: true }],
    [{ cohortRef: "cohort:unknown", populationRef: population.populationRef, scopeRef: population.scopeRef, providerCopyRefs: [], knowledge: "UNKNOWN", telemetryComplete: true }],
    [{ cohortRef: "cohort:gap", populationRef: population.populationRef, scopeRef: population.scopeRef, providerCopyRefs: [], knowledge: "KNOWN", telemetryComplete: false }],
  ]) {
    const result = assessStorageDisposition(identity, disposition({ residualCohorts }), population, flow({ backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items: 0, knowledge: "KNOWN", telemetryComplete: true } }));
    assert.equal(result.residualCopyCount, null);
    assert.equal(result.drainage, "UNKNOWN");
    assert.ok(result.reasons.includes("RESIDUAL_TELEMETRY_NOT_KNOWN"));
  }
});

test("TASK-525 rejects authority population and residual-count mismatches", () => {
  const wrongAuthority = disposition({ target: { populationRef: population.populationRef, scopeRef: population.scopeRef, authorityRef: "authority:other", authorityRevisionRef: "authority:documents:r4", providerCopyRefs: ["copy:residual"], transferLineageRefs: ["lineage:residual"] } });
  assert.equal(assessStorageDisposition(identity, wrongAuthority, population, flow()).drainage, "INVALID");

  const wrongPopulation = { ...population, populationRef: "other-population" };
  assert.equal(assessStorageDisposition(identity, disposition(), wrongPopulation, flow()).drainage, "INVALID");

  const wrongBacklog = flow({ backlog: { populationRef: population.populationRef, scopeRef: population.scopeRef, items: 0, knowledge: "KNOWN", telemetryComplete: true } });
  assert.ok(assessStorageDisposition(identity, disposition(), population, wrongBacklog).reasons.includes("BACKLOG_RESIDUAL_COUNT_MISMATCH"));
});

test("TASK-525 keeps source-of-truth and lifecycle evidence through disposal and dedup", () => {
  assert.ok(assessStorageDisposition(identity, disposition({ sourceOfTruthEvidencePreserved: false }), population, flow()).reasons.includes("SOURCE_OF_TRUTH_EVIDENCE_NOT_PRESERVED"));
  assert.ok(assessStorageDisposition(identity, disposition({ lifecycleEvidencePreserved: false }), population, flow()).reasons.includes("LIFECYCLE_EVIDENCE_NOT_PRESERVED"));
});

test("TASK-525 rejects unbounded replay and replay without transfer lineage", () => {
  const unbounded = flow({ replay: { requestedItems: 5, maximumReplayItems: 5, deduplicationBoundItems: 2 } });
  const unboundedResult = assessStorageDisposition(identity, disposition(), population, unbounded);
  assert.equal(unboundedResult.drainage, "INVALID");
  assert.ok(unboundedResult.reasons.includes("FINITE_FLOW_REPLAY_EXCEEDS_DEDUPLICATION_BOUND"));

  const noLineage = disposition({ target: { populationRef: population.populationRef, scopeRef: population.scopeRef, authorityRef: "authority:documents", authorityRevisionRef: "authority:documents:r4", providerCopyRefs: ["copy:residual"], transferLineageRefs: [] } });
  const replay = flow({ replay: { requestedItems: 1, maximumReplayItems: 2, deduplicationBoundItems: 2 } });
  assert.ok(assessStorageDisposition(identity, noLineage, population, replay).reasons.includes("REPLAY_WITHOUT_TRANSFER_LINEAGE"));
});

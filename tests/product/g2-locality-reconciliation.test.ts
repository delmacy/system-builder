import assert from "node:assert/strict";
import test from "node:test";

import {
  LOCALITY_RECONCILIATION_CONTRACT_VERSION,
  normalizeLocalityObservation,
  normalizeLocalityReconciliation,
} from "../../packages/contracts/locality/reconciliation.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const subject = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "brownfield",
  semanticKind: "external-binding",
  canonicalRef: "asset:device-7",
  definitionRef: "binding:device-7",
  revisionOwner: "brownfield",
  revisionDimension: "binding-revision",
  revisionRef: "r2",
} as const;

function currentness(localityScope: string, state: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT" = "CURRENT") {
  return {
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    subject,
    revisionVector: [
      {
        revisionOwner: subject.revisionOwner,
        revisionDimension: subject.revisionDimension,
        revisionRef: subject.revisionRef,
      },
    ],
    temporal: {
      occurredAt: null,
      observedAt: "2026-09-11T01:00:00Z",
      evaluatedAt: "2026-09-11T01:01:00Z",
      effectiveFrom: null,
      effectiveUntil: null,
      reconciledAt: state === "CURRENT" ? "2026-09-11T01:01:00Z" : null,
    },
    populationScope: "tenant-a/assets",
    localityScope,
    currentnessHorizon: {
      assessedAt: "2026-09-11T01:01:00Z",
      validUntil: "2026-09-11T02:01:00Z",
    },
    state,
    reason: `locality qualification is ${state.toLowerCase()}`,
  } as const;
}

const observation = (
  kind: "LOCAL" | "STATION" | "FLEET",
  localityRef: string,
  authority: "LOCAL_AUTHORITY" | "CANONICAL_SOURCE" | "OBSERVED",
  state: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT" = "CURRENT",
) => ({ kind, localityRef, subject, currentness: currentness(localityRef, state), authority });

const reconciled = () => ({
  contractVersion: LOCALITY_RECONCILIATION_CONTRACT_VERSION,
  canonicalSource: subject,
  observations: [
    observation("LOCAL", "local:device-7", "LOCAL_AUTHORITY"),
    observation("STATION", "station:alpha", "OBSERVED"),
    observation("FLEET", "fleet:primary", "CANONICAL_SOURCE"),
  ],
  conflict: "NONE",
  reconciliation: "RECONCILED",
  residuals: [{ localityRef: "station:legacy", subject, state: "DRAINED" }],
} as const);

test("accepts current reconciled Local Station Fleet observations while preserving canonical ownership", () => {
  const normalized = normalizeLocalityReconciliation(reconciled());
  assert.deepEqual(normalized.observations.map((item) => item.kind), ["LOCAL", "STATION", "FLEET"]);
  assert.equal(normalized.observations[0]!.authority, "LOCAL_AUTHORITY");
  assert.equal(normalized.observations[2]!.authority, "CANONICAL_SOURCE");
  assert.equal(normalized.reconciliation, "RECONCILED");
});

test("rejects stale locality promotion to reconciled global truth", () => {
  const input = reconciled();
  assert.throws(
    () => normalizeLocalityReconciliation({ ...input, observations: [observation("LOCAL", "local:device-7", "LOCAL_AUTHORITY", "STALE"), ...input.observations.slice(1)] }),
    /stale or UNKNOWN locality cannot be promoted to current global truth/,
  );
});

test("keeps partitioned disconnected evidence explicit instead of treating it as absent", () => {
  const normalized = normalizeLocalityReconciliation({
    ...reconciled(),
    observations: [observation("STATION", "station:offline", "OBSERVED", "UNKNOWN")],
    conflict: "UNKNOWN",
    reconciliation: "PARTITIONED",
    residuals: [{ localityRef: "station:offline", subject, state: "VISIBLE" }],
  });
  assert.equal(normalized.reconciliation, "PARTITIONED");
  assert.equal(normalized.observations[0]!.currentness.state, "UNKNOWN");
  assert.equal(normalized.residuals[0]!.state, "VISIBLE");
  assert.equal(normalized.observations[0]!.subject.canonicalRef, subject.canonicalRef);
});

test("rejects UNKNOWN conflict as resolved", () => {
  assert.throws(
    () => normalizeLocalityReconciliation({ ...reconciled(), conflict: "UNKNOWN", reconciliation: "RECONCILED" }),
    /conflict cannot be silently resolved|UNKNOWN conflict requires reconcile-before-retry/,
  );
});

test("rejects local authority as a substitute for canonical source ownership", () => {
  assert.throws(
    () => normalizeLocalityReconciliation({ ...reconciled(), observations: [observation("LOCAL", "local:device-7", "LOCAL_AUTHORITY")] }),
    /local authority cannot substitute canonical source ownership/,
  );
});

test("rejects currentness qualified for a different locality", () => {
  assert.throws(
    () => normalizeLocalityObservation({ ...observation("STATION", "station:alpha", "OBSERVED"), currentness: currentness("station:beta") }),
    /currentness must qualify the exact subject and locality/,
  );
});

test("keeps residual lineage visible until it is explicitly drained", () => {
  assert.throws(
    () => normalizeLocalityReconciliation({ ...reconciled(), residuals: [{ localityRef: "station:legacy", subject, state: "VISIBLE" }] }),
    /residual lineage must remain visible until drained/,
  );
});

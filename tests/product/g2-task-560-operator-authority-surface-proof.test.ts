import assert from "node:assert/strict";
import test from "node:test";
import {
  canOperatorProjectionClaimConvergence,
  projectOperatorAuthority,
  type ObservabilityEvidence,
  type OperatorEffectEvidence,
} from "../../packages/contracts/observability/index.js";

const evidence: ObservabilityEvidence = {
  source: {
    sourceId: "service:payments",
    producerId: "provider:runtime",
    producerRevision: "service@42",
    locality: "STATION",
    populationRef: "station:alpha",
  },
  observedAt: "2026-09-17T13:00:00Z",
  currentness: "CURRENT",
  evidenceState: "KNOWN",
};

const projection = projectOperatorAuthority("authority:operator-policy@11", "owner:payments", evidence);
const effect: OperatorEffectEvidence = {
  requestId: "operator-request:restart-1",
  authorityRef: projection.authorityRef,
  ownerId: projection.ownerId,
  requestedRevision: projection.sourceRevision,
  effectRevision: "service@43",
  locality: projection.locality,
  populationRef: projection.populationRef,
  evidence,
  disposition: "CONVERGED",
};

test("operator projection convergence binds the requested revision to the authoritative projected revision", () => {
  assert.equal(canOperatorProjectionClaimConvergence(projection, effect), true);
  assert.equal(
    canOperatorProjectionClaimConvergence(projection, { ...effect, requestedRevision: "service@41" }),
    false,
  );
});

test("matching producer evidence cannot mask a requested-revision mismatch", () => {
  const mismatchedRequest = { ...effect, requestedRevision: "service@99" };
  assert.equal(mismatchedRequest.evidence.source.producerRevision, projection.sourceRevision);
  assert.equal(canOperatorProjectionClaimConvergence(projection, mismatchedRequest), false);
});

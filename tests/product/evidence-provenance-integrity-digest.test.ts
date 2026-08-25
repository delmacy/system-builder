import assert from "node:assert/strict";
import test from "node:test";
import { computeEvidenceProvenanceIntegrity } from "../../packages/contracts/evidence-provenance/integrity-digest.js";

function evidence(evidenceId = "urn:system-builder:evidence:digest"): Record<string, unknown> {
  return {
    extensionVersion: "1.0.0",
    evidenceId,
    sources: [],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  };
}

test("provenance integrity digest matches a stable known value", () => {
  assert.deepEqual(computeEvidenceProvenanceIntegrity(evidence()), {
    algorithm: "sha256",
    digest: "845c86016c4ab9bfcb70f1deff504f6f2af1eb346f578ebade889dc5d26d173d",
  });
  assert.deepEqual(computeEvidenceProvenanceIntegrity(evidence()), computeEvidenceProvenanceIntegrity(evidence()));
});

test("meaningful canonical input changes alter provenance integrity digest", () => {
  assert.notEqual(
    computeEvidenceProvenanceIntegrity(evidence()).digest,
    computeEvidenceProvenanceIntegrity(evidence("urn:system-builder:evidence:digest-changed")).digest,
  );
});

test("unsupported integrity algorithms fail explicitly", () => {
  assert.throws(
    () => computeEvidenceProvenanceIntegrity(evidence(), "sha512"),
    /Unsupported evidence provenance integrity algorithm: sha512/,
  );
});

test("computed integrity output contains no provider, storage or sensitive material", () => {
  const serialized = JSON.stringify(computeEvidenceProvenanceIntegrity(evidence()));
  assert.equal(serialized.includes("provider"), false);
  assert.equal(serialized.includes("storage"), false);
  assert.equal(serialized.includes("credential"), false);
  assert.equal(serialized.includes("secret"), false);
});

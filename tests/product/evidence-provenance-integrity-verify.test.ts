import assert from "node:assert/strict";
import test from "node:test";
import { computeEvidenceProvenanceIntegrity } from "../../packages/contracts/evidence-provenance/integrity-digest.js";
import { verifyEvidenceProvenanceIntegrity } from "../../packages/contracts/evidence-provenance/integrity-verify.js";

function evidence(evidenceId = "urn:system-builder:evidence:verify"): Record<string, unknown> {
  return {
    extensionVersion: "1.0.0",
    evidenceId,
    sources: [],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  };
}

test("valid provenance integrity verifies without granting authority", () => {
  const base = evidence();
  const integrity = computeEvidenceProvenanceIntegrity(base);
  const result = verifyEvidenceProvenanceIntegrity({ ...base, integrity });
  assert.equal(result.status, "verified");
  assert.equal("authorized" in result, false);
  assert.equal("authority" in result, false);
});

test("mutated provenance produces an explicit integrity mismatch", () => {
  const original = evidence();
  const integrity = computeEvidenceProvenanceIntegrity(original);
  const result = verifyEvidenceProvenanceIntegrity({
    ...evidence("urn:system-builder:evidence:verify-mutated"),
    integrity,
  });
  assert.equal(result.status, "mismatch");
  if (result.status === "mismatch") assert.notEqual(result.suppliedDigest, result.computedDigest);
});

test("malformed or unsupported integrity metadata is invalid", () => {
  assert.deepEqual(
    verifyEvidenceProvenanceIntegrity({
      ...evidence(),
      integrity: { algorithm: "sha512", digest: "0".repeat(128) },
    }),
    { status: "invalid", reason: "INVALID_PROVENANCE_INTEGRITY" },
  );
  assert.deepEqual(
    verifyEvidenceProvenanceIntegrity({
      ...evidence(),
      integrity: { algorithm: "sha256", digest: "not-a-digest" },
    }),
    { status: "invalid", reason: "INVALID_PROVENANCE_INTEGRITY" },
  );
});

test("absence of integrity is distinguishable from verified evidence", () => {
  assert.deepEqual(verifyEvidenceProvenanceIntegrity(evidence()), { status: "absent" });
});

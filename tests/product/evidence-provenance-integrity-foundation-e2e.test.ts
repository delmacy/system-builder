import assert from "node:assert/strict";
import test from "node:test";
import {
  EVIDENCE_PROVENANCE_EXTENSION_KEY,
  normalizeEvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";
import { computeEvidenceProvenanceIntegrity } from "../../packages/contracts/evidence-provenance/integrity-digest.js";
import { verifyEvidenceProvenanceIntegrity } from "../../packages/contracts/evidence-provenance/integrity-verify.js";

function roundTrip<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function baseEvidence() {
  return normalizeEvidenceProvenanceExtension({
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:integrity-foundation",
    sources: [
      { sourceId: "urn:source:b", sourceType: "document" },
      { sourceId: "urn:source:a", sourceType: "api" },
    ],
    transformations: [
      { descriptorId: "derive", descriptorVersion: "1.0.0" },
    ],
    lineage: {
      predecessorEvidenceIds: ["urn:evidence:b", "urn:evidence:a"],
    },
  });
}

test("P14 integrity foundation composes normalization, digest, verification and round-trip", () => {
  const normalized = baseEvidence();
  const integrity = computeEvidenceProvenanceIntegrity(normalized);
  const withIntegrity = normalizeEvidenceProvenanceExtension({ ...normalized, integrity });

  assert.equal(verifyEvidenceProvenanceIntegrity(withIntegrity).status, "verified");

  const envelope = {
    artifactId: "urn:system-builder:artifact:integrity-foundation",
    artifactVersion: "1.0.0",
    requiredExtensions: [EVIDENCE_PROVENANCE_EXTENSION_KEY],
    extensions: { [EVIDENCE_PROVENANCE_EXTENSION_KEY]: withIntegrity },
  };
  const restoredEnvelope = roundTrip(envelope);
  const restored = normalizeEvidenceProvenanceExtension(
    restoredEnvelope.extensions[EVIDENCE_PROVENANCE_EXTENSION_KEY],
  );

  assert.deepEqual(restored, withIntegrity);
  assert.equal(verifyEvidenceProvenanceIntegrity(restored).status, "verified");
  assert.deepEqual(restored.integrity, integrity);
  assert.equal(JSON.stringify(restoredEnvelope).includes("provider"), false);
  assert.equal(JSON.stringify(restoredEnvelope).includes("authority"), false);
  assert.equal(JSON.stringify(restoredEnvelope).includes("authorized"), false);
});

test("P14 integrity foundation detects mutation and preserves backward-compatible absence", () => {
  const normalized = baseEvidence();
  const integrity = computeEvidenceProvenanceIntegrity(normalized);
  const mutated = normalizeEvidenceProvenanceExtension({
    ...normalized,
    evidenceId: "urn:system-builder:evidence:integrity-foundation-mutated",
    integrity,
  });

  assert.equal(verifyEvidenceProvenanceIntegrity(mutated).status, "mismatch");

  const historical = roundTrip(normalized);
  assert.equal(historical.integrity, undefined);
  assert.deepEqual(verifyEvidenceProvenanceIntegrity(historical), { status: "absent" });
  assert.deepEqual(historical, normalized);
});

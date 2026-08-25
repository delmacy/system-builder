import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  EVIDENCE_PROVENANCE_EXTENSION_KEY,
  normalizeEvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";
import { computeEvidenceProvenanceIntegrity } from "../../packages/contracts/evidence-provenance/integrity-digest.js";

type JsonObject = Record<string, unknown>;

const historicalEnvelopePath = join(
  process.cwd(),
  "specs",
  "contracts",
  "artifact-envelope",
  "fixtures",
  "valid",
  "minimal.envelope.json",
);

function historicalEnvelope(): JsonObject {
  return JSON.parse(readFileSync(historicalEnvelopePath, "utf8")) as JsonObject;
}

function roundTrip<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function provenanceWithIntegrity(): ReturnType<typeof normalizeEvidenceProvenanceExtension> {
  const base = {
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:artifact-integrity-roundtrip",
    sources: [{ sourceId: "urn:source:artifact-integrity", sourceType: "artifact" }],
    transformations: [{ descriptorId: "artifact-extension", descriptorVersion: "1.0.0" }],
    lineage: { predecessorEvidenceIds: ["urn:system-builder:evidence:predecessor"] },
  };
  const integrity = computeEvidenceProvenanceIntegrity(base);
  return normalizeEvidenceProvenanceExtension({ ...base, integrity });
}

test("historical ArtifactEnvelope remains unchanged when integrity metadata is absent", () => {
  const historical = historicalEnvelope();
  const reemitted = roundTrip(historical);

  assert.deepEqual(reemitted, historical);
  assert.equal(Object.prototype.hasOwnProperty.call(reemitted, "requiredExtensions"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(reemitted, "extensions"), false);
});

test("provenance integrity round-trips through the existing ArtifactEnvelope extension boundary", () => {
  const historical = historicalEnvelope();
  const provenance = provenanceWithIntegrity();
  const envelope: JsonObject = {
    ...historical,
    requiredExtensions: [EVIDENCE_PROVENANCE_EXTENSION_KEY],
    extensions: {
      [EVIDENCE_PROVENANCE_EXTENSION_KEY]: provenance,
    },
  };

  const parsed = roundTrip(envelope);
  const extensions = parsed.extensions as JsonObject;
  const normalized = normalizeEvidenceProvenanceExtension(
    extensions[EVIDENCE_PROVENANCE_EXTENSION_KEY],
  );

  assert.deepEqual(normalized, provenance);
  assert.deepEqual(normalized.integrity, provenance.integrity);
  assert.equal(parsed.artifactId, historical.artifactId);
  assert.equal(parsed.artifactVersion, historical.artifactVersion);
  assert.deepEqual(parsed.schema, historical.schema);
  assert.deepEqual(parsed.provenance, historical.provenance);
  assert.deepEqual(parsed.payload, historical.payload);
});

test("owning provenance contract rejects malformed integrity metadata carried by ArtifactEnvelope", () => {
  const historical = historicalEnvelope();
  const valid = provenanceWithIntegrity();
  const envelope: JsonObject = {
    ...historical,
    extensions: {
      [EVIDENCE_PROVENANCE_EXTENSION_KEY]: {
        ...valid,
        integrity: { algorithm: "sha256", digest: "not-a-sha256-digest" },
      },
    },
  };
  const parsed = roundTrip(envelope);
  const extensions = parsed.extensions as JsonObject;

  assert.throws(
    () => normalizeEvidenceProvenanceExtension(extensions[EVIDENCE_PROVENANCE_EXTENSION_KEY]),
    /Invalid evidence provenance at \$evidenceProvenance\.integrity\.digest: malformed value/,
  );
});

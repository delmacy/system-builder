import assert from "node:assert/strict";
import test from "node:test";
import { normalizeEvidenceProvenanceExtension } from "../../packages/contracts/evidence-provenance/index.js";

test("evidence provenance normalization is deterministic for equivalent evidence sets", () => {
  const first = normalizeEvidenceProvenanceExtension({
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:normalized",
    sources: [
      { sourceId: "urn:source:z", sourceType: "ticket" },
      { sourceId: "urn:source:a", sourceType: "document", authorRef: "actor:1" },
    ],
    classification: { label: "observed", confidence: 0.75 },
    transformations: [
      { descriptorId: "extract", descriptorVersion: "1.0.0" },
      { descriptorId: "classify", descriptorVersion: "2.1.0", provider: { id: "logical-provider" } },
    ],
    lineage: {
      predecessorEvidenceIds: ["urn:evidence:z", "urn:evidence:a"],
    },
  });
  const second = normalizeEvidenceProvenanceExtension({
    evidenceId: "urn:system-builder:evidence:normalized",
    extensionVersion: "1.0.0",
    lineage: {
      predecessorEvidenceIds: ["urn:evidence:a", "urn:evidence:z"],
    },
    transformations: [
      { descriptorVersion: "1.0.0", descriptorId: "extract" },
      { provider: { id: "logical-provider" }, descriptorVersion: "2.1.0", descriptorId: "classify" },
    ],
    classification: { confidence: 0.75, label: "observed" },
    sources: [
      { authorRef: "actor:1", sourceType: "document", sourceId: "urn:source:a" },
      { sourceType: "ticket", sourceId: "urn:source:z" },
    ],
  });

  assert.deepEqual(second, first);
  assert.deepEqual(first.sources.map((source) => source.sourceId), ["urn:source:a", "urn:source:z"]);
  assert.deepEqual(first.lineage.predecessorEvidenceIds, ["urn:evidence:a", "urn:evidence:z"]);
  assert.deepEqual(first.transformations.map((item) => item.descriptorId), ["extract", "classify"]);
});

test("normalization rejects malformed identifiers and unsupported extension versions", () => {
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        extensionVersion: "2.0.0",
        evidenceId: "urn:evidence:1",
        sources: [],
        transformations: [],
        lineage: { predecessorEvidenceIds: [] },
      }),
    /unsupported version/,
  );
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        extensionVersion: "1.0.0",
        evidenceId: "not a uri",
        sources: [],
        transformations: [],
        lineage: { predecessorEvidenceIds: [] },
      }),
    /evidenceId: malformed value/,
  );
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        extensionVersion: "1.0.0",
        evidenceId: "urn:evidence:1",
        sources: [{ sourceId: "bad id", sourceType: "ticket" }],
        transformations: [],
        lineage: { predecessorEvidenceIds: [] },
      }),
    /sourceId: malformed value/,
  );
});

test("normalization rejects duplicate ambiguous evidence entries", () => {
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        extensionVersion: "1.0.0",
        evidenceId: "urn:evidence:1",
        sources: [
          { sourceId: "urn:source:1", sourceType: "ticket" },
          { sourceId: "urn:source:1", sourceType: "document" },
        ],
        transformations: [],
        lineage: { predecessorEvidenceIds: [] },
      }),
    /duplicate sourceId/,
  );
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        extensionVersion: "1.0.0",
        evidenceId: "urn:evidence:1",
        sources: [],
        transformations: [
          { descriptorId: "normalize", descriptorVersion: "1.0.0" },
          { descriptorId: "normalize", descriptorVersion: "1.0.0", tool: { id: "other" } },
        ],
        lineage: { predecessorEvidenceIds: [] },
      }),
    /duplicate descriptor/,
  );
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        extensionVersion: "1.0.0",
        evidenceId: "urn:evidence:1",
        sources: [],
        transformations: [],
        lineage: { predecessorEvidenceIds: ["urn:evidence:prior", "urn:evidence:prior"] },
      }),
    /duplicate predecessor evidence identifier/,
  );
});

test("normalization is provider-neutral, value-free, and rejects unknown fields", () => {
  const normalized = normalizeEvidenceProvenanceExtension({
    extensionVersion: "1.0.0",
    evidenceId: "urn:evidence:1",
    sources: [],
    transformations: [
      {
        descriptorId: "normalize",
        descriptorVersion: "1.0.0",
        provider: { id: "logical-provider" },
      },
    ],
    lineage: { predecessorEvidenceIds: [] },
  });
  assert.equal(JSON.stringify(normalized).includes("credential"), false);
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        extensionVersion: "1.0.0",
        evidenceId: "urn:evidence:1",
        sources: [],
        transformations: [],
        lineage: { predecessorEvidenceIds: [] },
        secretValue: "forbidden",
      }),
    /unexpected field secretValue/,
  );
});

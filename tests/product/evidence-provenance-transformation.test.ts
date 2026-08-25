import assert from "node:assert/strict";
import test from "node:test";
import {
  evidenceProvenanceExtensionSchema,
  normalizeEvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";

const baseEvidence = {
  extensionVersion: "1.0.0",
  evidenceId: "urn:system-builder:evidence:transformation-provenance",
  sources: [],
  transformations: [],
  lineage: { predecessorEvidenceIds: [] },
} as const;

test("transformation provenance requires stable descriptor identity and version only", () => {
  const normalized = normalizeEvidenceProvenanceExtension({
    ...baseEvidence,
    transformations: [{ descriptorId: "normalize-evidence", descriptorVersion: "1.2.0" }],
  });

  assert.deepEqual(normalized.transformations, [
    { descriptorId: "normalize-evidence", descriptorVersion: "1.2.0" },
  ]);
});

test("tool and logical provider details remain optional portable evidence", () => {
  const portable = normalizeEvidenceProvenanceExtension({
    ...baseEvidence,
    transformations: [
      {
        descriptorId: "extract-source",
        descriptorVersion: "2.0.1",
        tool: { id: "system-builder.contract-normalizer", version: "3.4.5" },
        provider: { id: "logical-provider" },
      },
    ],
  });

  assert.deepEqual(portable.transformations[0], {
    descriptorId: "extract-source",
    descriptorVersion: "2.0.1",
    tool: { id: "system-builder.contract-normalizer", version: "3.4.5" },
    provider: { id: "logical-provider" },
  });
});

test("transformation validation is deterministic and preserves declared derivation order", () => {
  const input = {
    ...baseEvidence,
    transformations: [
      { descriptorId: "capture", descriptorVersion: "1.0.0" },
      { descriptorId: "normalize", descriptorVersion: "1.0.0" },
    ],
  };

  const first = normalizeEvidenceProvenanceExtension(input);
  const second = normalizeEvidenceProvenanceExtension(input);
  assert.deepEqual(first, second);
  assert.deepEqual(
    first.transformations.map(({ descriptorId }) => descriptorId),
    ["capture", "normalize"],
  );

  const reversed = normalizeEvidenceProvenanceExtension({
    ...input,
    transformations: [...input.transformations].reverse(),
  });
  assert.deepEqual(
    reversed.transformations.map(({ descriptorId }) => descriptorId),
    ["normalize", "capture"],
  );
});

test("transformation descriptors reject malformed identity and ambiguous duplicates", () => {
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        ...baseEvidence,
        transformations: [{ descriptorVersion: "1.0.0" }],
      }),
    /transformations\[0\]\.descriptorId: malformed value/,
  );
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        ...baseEvidence,
        transformations: [{ descriptorId: "normalize", descriptorVersion: "v1" }],
      }),
    /transformations\[0\]\.descriptorVersion: malformed value/,
  );
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        ...baseEvidence,
        transformations: [
          { descriptorId: "normalize", descriptorVersion: "1.0.0" },
          { descriptorId: "normalize", descriptorVersion: "1.0.0" },
        ],
      }),
    /duplicate descriptor normalize@1\.0\.0/,
  );
});

test("transformation provenance rejects credentials provider topology and execution fields", () => {
  for (const forbidden of [
    { credential: "secret-ref" },
    { accountId: "acct-123" },
    { endpoint: "https://provider.example/api" },
    { storageLocator: "s3://bucket/object" },
    { command: "execute" },
  ]) {
    assert.throws(
      () =>
        normalizeEvidenceProvenanceExtension({
          ...baseEvidence,
          transformations: [
            {
              descriptorId: "portable-transform",
              descriptorVersion: "1.0.0",
              ...forbidden,
            },
          ],
        }),
      /unexpected field/,
    );
  }

  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        ...baseEvidence,
        transformations: [
          {
            descriptorId: "portable-transform",
            descriptorVersion: "1.0.0",
            tool: { id: "tool", credential: "secret-ref" },
          },
        ],
      }),
    /unexpected field credential/,
  );
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        ...baseEvidence,
        transformations: [
          {
            descriptorId: "portable-transform",
            descriptorVersion: "1.0.0",
            provider: { id: "logical-provider", accountId: "acct-123" },
          },
        ],
      }),
    /unexpected field accountId/,
  );
});

test("schema keeps provider and tool details optional and bounded", () => {
  const schema = evidenceProvenanceExtensionSchema as {
    properties?: {
      transformations?: {
        items?: {
          required?: readonly string[];
          properties?: Record<
            string,
            { required?: readonly string[]; properties?: Record<string, unknown> }
          >;
        };
      };
    };
  };
  const item = schema.properties?.transformations?.items;
  const properties = item?.properties ?? {};

  assert.deepEqual(item?.required, ["descriptorId", "descriptorVersion"]);
  assert.equal("tool" in properties, true);
  assert.equal("provider" in properties, true);
  assert.deepEqual(properties.tool?.required, ["id"]);
  assert.deepEqual(properties.provider?.required, ["id"]);
  assert.deepEqual(Object.keys(properties.tool?.properties ?? {}).sort(), ["id", "version"]);
  assert.deepEqual(Object.keys(properties.provider?.properties ?? {}).sort(), ["id"]);
});
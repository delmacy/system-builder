import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  EVIDENCE_PROVENANCE_EXTENSION_KEY,
  evidenceProvenanceExtensionSchema,
  normalizeEvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";

type JsonObject = Record<string, unknown>;

const artifactFixturePath = join(
  process.cwd(),
  "specs",
  "contracts",
  "artifact-envelope",
  "fixtures",
  "valid",
  "minimal.envelope.json",
);
const artifactSchemaPath = join(
  process.cwd(),
  "specs",
  "contracts",
  "artifact-envelope",
  "artifact-envelope.schema.json",
);

function readJson(path: string): JsonObject {
  return JSON.parse(readFileSync(path, "utf8")) as JsonObject;
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function roundTrip<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function assertRequiredExtensionsSupported(envelope: JsonObject, supported: ReadonlySet<string>): void {
  const required = envelope.requiredExtensions;
  if (required === undefined) return;
  if (!Array.isArray(required)) throw new TypeError("requiredExtensions must be an array");
  for (const name of required) {
    if (typeof name !== "string" || !supported.has(name)) {
      throw new Error(`unsupported required extension: ${String(name)}`);
    }
  }
}

test("Construction A growing proof composes complete M14 provenance without conflating artifact inputs and sources", () => {
  const historical = readJson(artifactFixturePath);
  const provenance = normalizeEvidenceProvenanceExtension({
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:growing-proof",
    sources: [
      {
        sourceId: "urn:source:operator-note:42",
        sourceType: "operator-note",
        capturedAt: "2026-08-25T00:00:00Z",
        authorRef: "operator:42",
      },
    ],
    classification: { label: "reviewed", confidence: 0.9 },
    transformations: [
      {
        descriptorId: "extract-evidence",
        descriptorVersion: "1.0.0",
        tool: { id: "system-builder.evidence-extractor", version: "1.0.0" },
      },
      {
        descriptorId: "normalize-evidence",
        descriptorVersion: "1.1.0",
        provider: { id: "logical-provider" },
      },
    ],
    lineage: { predecessorEvidenceIds: ["urn:system-builder:evidence:predecessor"] },
  });
  const provenanceCore = historical.provenance;
  assert.ok(isObject(provenanceCore));
  const artifactInput = {
    artifactType: "system-builder/process-mirror",
    artifactId: "urn:uuid:11111111-2222-4333-8444-555555555555",
    artifactVersion: "1.0.0",
  };
  const envelope: JsonObject = {
    ...historical,
    provenance: {
      ...provenanceCore,
      inputs: [artifactInput],
    },
    requiredExtensions: [EVIDENCE_PROVENANCE_EXTENSION_KEY],
    extensions: {
      [EVIDENCE_PROVENANCE_EXTENSION_KEY]: provenance,
      "com.example.opaque": { preserved: [1, 2, 3] },
    },
    payload: {
      ...(isObject(historical.payload) ? historical.payload : {}),
      confidentialPayloadOnly: "payload-secret-must-stay-outside-provenance",
    },
  };

  assertRequiredExtensionsSupported(envelope, new Set([EVIDENCE_PROVENANCE_EXTENSION_KEY]));
  const parsed = roundTrip(envelope);
  const parsedExtensions = parsed.extensions;
  assert.ok(isObject(parsedExtensions));
  parsedExtensions[EVIDENCE_PROVENANCE_EXTENSION_KEY] = normalizeEvidenceProvenanceExtension(
    parsedExtensions[EVIDENCE_PROVENANCE_EXTENSION_KEY],
  );
  const reemitted = roundTrip(parsed);
  const reemittedExtensions = reemitted.extensions;
  assert.ok(isObject(reemittedExtensions));

  assert.deepEqual(reemittedExtensions[EVIDENCE_PROVENANCE_EXTENSION_KEY], provenance);
  assert.deepEqual(reemittedExtensions["com.example.opaque"], { preserved: [1, 2, 3] });
  assert.deepEqual((reemitted.provenance as JsonObject).inputs, [artifactInput]);
  assert.deepEqual(
    (reemittedExtensions[EVIDENCE_PROVENANCE_EXTENSION_KEY] as { sources: unknown }).sources,
    provenance.sources,
  );
  assert.notDeepEqual((reemitted.provenance as JsonObject).inputs, provenance.sources);
  assert.equal(
    JSON.stringify(reemittedExtensions[EVIDENCE_PROVENANCE_EXTENSION_KEY]).includes(
      "payload-secret-must-stay-outside-provenance",
    ),
    false,
  );
});

test("Construction A growing proof keeps classification confidence optional", () => {
  const normalized = normalizeEvidenceProvenanceExtension({
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:no-classification",
    sources: [],
    transformations: [{ descriptorId: "identity", descriptorVersion: "1.0.0" }],
    lineage: { predecessorEvidenceIds: [] },
  });

  assert.equal(normalized.classification, undefined);
  assert.equal(Object.prototype.hasOwnProperty.call(normalized, "classification"), false);
});

test("Construction A growing proof fails malformed ambiguous and unsupported-required evidence explicitly", () => {
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        extensionVersion: "1.0.0",
        evidenceId: "urn:system-builder:evidence:malformed",
        sources: [{ sourceId: "not a uri", sourceType: "document" }],
        transformations: [],
        lineage: { predecessorEvidenceIds: [] },
      }),
    /sources\[0\]\.sourceId: malformed value/,
  );
  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        extensionVersion: "1.0.0",
        evidenceId: "urn:system-builder:evidence:ambiguous",
        sources: [
          { sourceId: "urn:source:duplicate", sourceType: "document" },
          { sourceId: "urn:source:duplicate", sourceType: "operator-note" },
        ],
        transformations: [],
        lineage: { predecessorEvidenceIds: [] },
      }),
    /duplicate sourceId urn:source:duplicate/,
  );

  const historical = readJson(artifactFixturePath);
  assert.throws(
    () =>
      assertRequiredExtensionsSupported(
        {
          ...historical,
          requiredExtensions: [EVIDENCE_PROVENANCE_EXTENSION_KEY, "urn:unsupported:policy"],
        },
        new Set([EVIDENCE_PROVENANCE_EXTENSION_KEY]),
      ),
    /unsupported required extension: urn:unsupported:policy/,
  );
});

test("Construction A growing proof keeps provider secrets topology and storage outside the portable schema", () => {
  const schemaText = JSON.stringify(evidenceProvenanceExtensionSchema);
  for (const forbiddenField of ["credential", "accountId", "storageLocator", "secretValue", "accessToken"]) {
    assert.equal(schemaText.includes(`\"${forbiddenField}\"`), false);
  }

  assert.throws(
    () =>
      normalizeEvidenceProvenanceExtension({
        extensionVersion: "1.0.0",
        evidenceId: "urn:system-builder:evidence:no-leak",
        sources: [],
        transformations: [
          {
            descriptorId: "portable-transform",
            descriptorVersion: "1.0.0",
            provider: { id: "logical-provider", credential: "must-not-be-accepted" },
          },
        ],
        lineage: { predecessorEvidenceIds: [] },
      }),
    /unexpected field credential/,
  );
});

test("historical artifact-envelope 1.0.0 remains valid without requiring the M14 extension", () => {
  const historical = readJson(artifactFixturePath);
  const artifactSchema = readJson(artifactSchemaPath);
  const required = Array.isArray(artifactSchema.required) ? artifactSchema.required : [];

  assert.equal(required.includes("extensions"), false);
  assert.equal(required.includes("requiredExtensions"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(historical, "extensions"), false);
  assert.deepEqual(roundTrip(historical), historical);
});
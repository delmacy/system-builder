import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  EVIDENCE_PROVENANCE_EXTENSION_KEY,
  normalizeEvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";

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

const supportedRequiredExtensions = new Set<string>([EVIDENCE_PROVENANCE_EXTENSION_KEY]);

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function jsonRoundTrip<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function compatibleReemit(input: JsonObject, supported: ReadonlySet<string>): JsonObject {
  const envelope = jsonRoundTrip(input);
  const requiredExtensions = envelope.requiredExtensions;
  if (requiredExtensions !== undefined) {
    if (!Array.isArray(requiredExtensions)) throw new TypeError("requiredExtensions must be an array");
    for (const extensionName of requiredExtensions) {
      if (typeof extensionName !== "string" || !supported.has(extensionName)) {
        throw new Error(`unsupported required extension: ${String(extensionName)}`);
      }
    }
  }

  if (envelope.extensions !== undefined) {
    if (!isObject(envelope.extensions)) throw new TypeError("extensions must be an object");
    if (Object.prototype.hasOwnProperty.call(envelope.extensions, EVIDENCE_PROVENANCE_EXTENSION_KEY)) {
      envelope.extensions[EVIDENCE_PROVENANCE_EXTENSION_KEY] = normalizeEvidenceProvenanceExtension(
        envelope.extensions[EVIDENCE_PROVENANCE_EXTENSION_KEY],
      );
    }
  }
  return envelope;
}

function readHistoricalEnvelope(): JsonObject {
  return JSON.parse(readFileSync(historicalEnvelopePath, "utf8")) as JsonObject;
}

test("normalized evidence lineage survives compatible serialize parse and re-emission", () => {
  const historical = readHistoricalEnvelope();
  const provenance = normalizeEvidenceProvenanceExtension({
    extensionVersion: "1.0.0",
    evidenceId: "urn:system-builder:evidence:lineage-roundtrip",
    sources: [
      { sourceId: "urn:source:z", sourceType: "document" },
      { sourceId: "urn:source:a", sourceType: "operator-note" },
    ],
    classification: { label: "derived", confidence: 0.75 },
    transformations: [
      { descriptorId: "capture", descriptorVersion: "1.0.0" },
      {
        descriptorId: "normalize",
        descriptorVersion: "1.1.0",
        tool: { id: "system-builder.contract-normalizer", version: "1.0.0" },
      },
    ],
    lineage: {
      predecessorEvidenceIds: ["urn:evidence:z", "urn:evidence:a"],
    },
  });
  const envelope: JsonObject = {
    ...historical,
    requiredExtensions: [EVIDENCE_PROVENANCE_EXTENSION_KEY],
    extensions: {
      [EVIDENCE_PROVENANCE_EXTENSION_KEY]: provenance,
      "com.example.optional": {
        nested: ["preserve", { exact: true }],
      },
    },
    payload: {
      ...(isObject(historical.payload) ? historical.payload : {}),
      secretPayloadOnly: "must-not-enter-provenance",
    },
  };

  const parsed = jsonRoundTrip(envelope);
  const reemitted = compatibleReemit(parsed, supportedRequiredExtensions);
  const extensions = reemitted.extensions as JsonObject;

  assert.deepEqual(extensions[EVIDENCE_PROVENANCE_EXTENSION_KEY], provenance);
  assert.deepEqual(extensions["com.example.optional"], {
    nested: ["preserve", { exact: true }],
  });
  assert.deepEqual(jsonRoundTrip(reemitted), reemitted);
  assert.equal(
    JSON.stringify(extensions[EVIDENCE_PROVENANCE_EXTENSION_KEY]).includes("must-not-enter-provenance"),
    false,
  );
});

test("unknown optional sibling extensions are preserved without becoming required semantics", () => {
  const historical = readHistoricalEnvelope();
  const envelope: JsonObject = {
    ...historical,
    extensions: {
      "urn:third-party:opaque-evidence": {
        version: 7,
        values: [3, 1, 4],
        nested: { untouched: true },
      },
    },
  };

  const reemitted = compatibleReemit(envelope, supportedRequiredExtensions);
  assert.deepEqual(reemitted.extensions, envelope.extensions);
});

test("unsupported required extensions fail explicitly before compatible re-emission", () => {
  const historical = readHistoricalEnvelope();
  const envelope: JsonObject = {
    ...historical,
    requiredExtensions: [EVIDENCE_PROVENANCE_EXTENSION_KEY, "urn:third-party:required-policy"],
    extensions: {
      [EVIDENCE_PROVENANCE_EXTENSION_KEY]: normalizeEvidenceProvenanceExtension({
        extensionVersion: "1.0.0",
        evidenceId: "urn:system-builder:evidence:required-extension-check",
        sources: [],
        transformations: [],
        lineage: { predecessorEvidenceIds: [] },
      }),
      "urn:third-party:required-policy": { allow: true },
    },
  };

  assert.throws(
    () => compatibleReemit(envelope, supportedRequiredExtensions),
    /unsupported required extension: urn:third-party:required-policy/,
  );
});

test("historical artifact-envelope 1.0.0 without M14 metadata round-trips unchanged", () => {
  const historical = readHistoricalEnvelope();
  assert.equal(Object.prototype.hasOwnProperty.call(historical, "extensions"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(historical, "requiredExtensions"), false);

  const reemitted = compatibleReemit(historical, supportedRequiredExtensions);
  assert.deepEqual(reemitted, historical);
  assert.equal(Object.prototype.hasOwnProperty.call(reemitted, "extensions"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(reemitted, "requiredExtensions"), false);
});
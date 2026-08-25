import assert from "node:assert/strict";
import test from "node:test";
import artifactEnvelopeSchema from "../../specs/contracts/artifact-envelope/artifact-envelope.schema.json";
import {
  EVIDENCE_PROVENANCE_EXTENSION_KEY,
  EVIDENCE_PROVENANCE_EXTENSION_VERSION,
  evidenceProvenanceExtensionSchema,
} from "../../packages/contracts/evidence-provenance/index.js";
import {
  invalidEvidenceProvenanceFixtures,
  validEvidenceProvenanceFixtures,
} from "./fixtures/evidence-provenance.js";

type SchemaNode = Readonly<{
  required?: readonly string[];
  properties?: Readonly<Record<string, SchemaNode>>;
  additionalProperties?: boolean;
  const?: unknown;
  minimum?: number;
  maximum?: number;
}>;

const URI_PATTERN = /^[A-Za-z][A-Za-z0-9+.-]*:\S+$/;

function fixtureMatchesFoundationContract(value: unknown): boolean {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  const allowed = new Set(["extensionVersion", "evidenceId", "sources", "classification", "transformations", "lineage"]);
  if (Object.keys(candidate).some((key) => !allowed.has(key))) return false;
  if (candidate.extensionVersion !== "1.0.0") return false;
  if (typeof candidate.evidenceId !== "string" || !URI_PATTERN.test(candidate.evidenceId)) return false;
  if (!Array.isArray(candidate.sources) || !Array.isArray(candidate.transformations)) return false;
  if (typeof candidate.lineage !== "object" || candidate.lineage === null || Array.isArray(candidate.lineage)) return false;
  const lineage = candidate.lineage as Record<string, unknown>;
  if (!Array.isArray(lineage.predecessorEvidenceIds)) return false;
  if (!lineage.predecessorEvidenceIds.every((item) => typeof item === "string" && URI_PATTERN.test(item))) return false;
  if (candidate.classification !== undefined) {
    if (typeof candidate.classification !== "object" || candidate.classification === null || Array.isArray(candidate.classification)) return false;
    const classification = candidate.classification as Record<string, unknown>;
    if (typeof classification.label !== "string" || classification.label.trim().length === 0) return false;
    if (classification.confidence !== undefined &&
        (typeof classification.confidence !== "number" || classification.confidence < 0 || classification.confidence > 1)) return false;
  }
  return true;
}

test("evidence provenance extension is additive and namespaced", () => {
  const schema = evidenceProvenanceExtensionSchema as SchemaNode;
  assert.equal(EVIDENCE_PROVENANCE_EXTENSION_KEY, "system-builder.evidence-provenance");
  assert.equal(EVIDENCE_PROVENANCE_EXTENSION_VERSION, "1.0.0");
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ["extensionVersion", "evidenceId", "sources", "transformations", "lineage"]);
  assert.equal(schema.properties?.extensionVersion?.const, "1.0.0");

  const envelope = artifactEnvelopeSchema as SchemaNode;
  assert.equal(envelope.required?.includes("extensions"), false);
  assert.equal(envelope.required?.includes("requiredExtensions"), false);
});

test("evidence provenance extension does not reinterpret ArtifactEnvelope producer or input fields", () => {
  const properties = (evidenceProvenanceExtensionSchema as SchemaNode).properties ?? {};
  assert.equal("producer" in properties, false);
  assert.equal("inputs" in properties, false);
  assert.equal("payload" in properties, false);
  assert.equal("artifactId" in properties, false);
  assert.equal("artifactVersion" in properties, false);
});

test("evidence provenance extension remains value-free and provider-neutral", () => {
  const serialized = JSON.stringify(evidenceProvenanceExtensionSchema);
  for (const forbidden of ["credential", "secretValue", "token", "providerResourceId", "storageLocator", "endpoint"]) {
    assert.equal(serialized.includes(`"${forbidden}"`), false, forbidden);
  }
  const classification = (evidenceProvenanceExtensionSchema as SchemaNode).properties?.classification;
  assert.equal(classification?.properties?.confidence?.minimum, 0);
  assert.equal(classification?.properties?.confidence?.maximum, 1);
});

test("deterministic evidence provenance fixtures separate accepted and rejected foundation shapes", () => {
  for (const fixture of validEvidenceProvenanceFixtures) {
    assert.equal(fixtureMatchesFoundationContract(fixture), true);
  }
  for (const fixture of invalidEvidenceProvenanceFixtures) {
    assert.equal(fixtureMatchesFoundationContract(fixture), false);
  }
});

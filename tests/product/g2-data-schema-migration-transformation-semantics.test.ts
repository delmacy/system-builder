import assert from "node:assert/strict";
import test from "node:test";
import {
  DATA_TRANSFORMATION_CONTRACT_VERSION,
  normalizeQualifiedFieldTransformation,
} from "../../packages/contracts/data-schema/transformation.js";

const revision = (revisionRef: string, semanticKind = "canonical-schema") => ({
  contractVersion: "1.0.0" as const,
  semanticOwner: "data-schema",
  semanticKind,
  canonicalRef: "customer-record",
  definitionRef: "customer-record-definition",
  revisionOwner: "data-schema",
  revisionDimension: "schema",
  revisionRef,
});

const evidence = () => ({
  extensionVersion: "1.0.0" as const,
  evidenceId: "evidence:transformation/customer-r1-r2",
  sources: [{
    sourceId: "evidence-source:transformation/customer-r1-r2",
    sourceType: "schema-transformation-proof",
    capturedAt: "2026-09-10T11:00:00Z",
  }],
  transformations: [],
  lineage: { predecessorEvidenceIds: [] },
});

const unit = (unitRef: string, axis = "length") => ({
  state: "KNOWN" as const,
  unitRef,
  unitRevision: `${unitRef}:r1`,
  dimension: { terms: [{ axis, exponent: 1 }] },
});

const precision = (policyRef: string, precisionValue: number, scale: number, roundingMode = "HALF_EVEN") => ({
  policyRef,
  policyRevision: `${policyRef}:r1`,
  precision: precisionValue,
  scale,
  roundingMode,
});

const baseInput = (overrides: Record<string, unknown> = {}) => ({
  contractVersion: DATA_TRANSFORMATION_CONTRACT_VERSION,
  transformationRevision: {
    ...revision("transform-r1-r2-v1", "schema-transformation"),
    canonicalRef: "customer-record-r1-r2-transform",
    definitionRef: "customer-record-r1-r2-transform-definition",
  },
  sourceSchemaRevision: revision("r1"),
  targetSchemaRevision: revision("r2"),
  fieldRef: "customer.height",
  sourcePresence: "VALUE_REF",
  targetPresence: "VALUE_REF",
  defaultDefinitionRevision: null,
  unitConversion: {
    sourceUnit: unit("unit:centimeter"),
    targetUnit: unit("unit:meter"),
  },
  precision: {
    sourcePolicy: precision("precision:source", 12, 4),
    targetPolicy: precision("precision:target", 12, 4),
  },
  lossiness: "LOSSLESS",
  compatibility: "FULLY_COMPATIBLE",
  evidence: evidence(),
  ...overrides,
});

test("TASK-506 preserves distinct presence intents and explicit revision-qualified defaults", () => {
  for (const intent of ["VALUE_REF", "ABSENT", "NULL", "DELETE"] as const) {
    const normalized = normalizeQualifiedFieldTransformation(baseInput({
      sourcePresence: intent,
      targetPresence: intent,
      defaultDefinitionRevision: null,
    }));
    assert.equal(normalized.sourcePresence, intent);
    assert.equal(normalized.targetPresence, intent);
  }

  const defaultRevision = revision("r2-default-v3");
  const withDefault = normalizeQualifiedFieldTransformation(baseInput({
    sourcePresence: "ABSENT",
    targetPresence: "DEFAULT",
    defaultDefinitionRevision: defaultRevision,
  }));
  assert.equal(withDefault.targetPresence, "DEFAULT");
  assert.equal(withDefault.defaultDefinitionRevision?.revisionRef, "r2-default-v3");
});

test("TASK-506 rejects presence strengthening and hidden default injection", () => {
  for (const [sourcePresence, targetPresence] of [
    ["ABSENT", "NULL"],
    ["NULL", "DEFAULT"],
    ["DELETE", "ABSENT"],
  ] as const) {
    assert.throws(
      () => normalizeQualifiedFieldTransformation(baseInput({ sourcePresence, targetPresence })),
      /presence intent transition/,
    );
  }

  assert.throws(
    () => normalizeQualifiedFieldTransformation(baseInput({
      sourcePresence: "ABSENT",
      targetPresence: "DEFAULT",
      defaultDefinitionRevision: null,
    })),
    /explicit default definition revision/,
  );

  assert.throws(
    () => normalizeQualifiedFieldTransformation(baseInput({
      sourcePresence: "VALUE_REF",
      targetPresence: "VALUE_REF",
      defaultDefinitionRevision: revision("r2-default-v3"),
    })),
    /only valid for DEFAULT presence/,
  );
});

test("TASK-506 keeps unit conversion dimension and revision semantics explicit", () => {
  const normalized = normalizeQualifiedFieldTransformation(baseInput());
  assert.equal(normalized.unitConversion?.sourceUnit.state, "KNOWN");
  assert.equal(normalized.unitConversion?.targetUnit.state, "KNOWN");
  if (normalized.unitConversion?.sourceUnit.state === "KNOWN") {
    assert.equal(normalized.unitConversion.sourceUnit.dimension.terms[0]?.axis, "length");
    assert.equal(normalized.unitConversion.sourceUnit.unitRevision, "unit:centimeter:r1");
  }

  assert.throws(
    () => normalizeQualifiedFieldTransformation(baseInput({
      unitConversion: { sourceUnit: unit("unit:centimeter", "length"), targetUnit: unit("unit:second", "time") },
    })),
    /unit dimensions are incompatible/,
  );

  assert.throws(
    () => normalizeQualifiedFieldTransformation(baseInput({
      unitConversion: {
        sourceUnit: { state: "UNKNOWN", reason: "legacy metadata unavailable" },
        targetUnit: unit("unit:meter"),
      },
    })),
    /requires known source and target unit semantics/,
  );
});

test("TASK-506 makes precision and rounding explicit and rejects undeclared losslessness", () => {
  const normalized = normalizeQualifiedFieldTransformation(baseInput({
    precision: {
      sourcePolicy: precision("precision:source", 12, 4, "HALF_EVEN"),
      targetPolicy: precision("precision:target", 10, 2, "HALF_UP"),
    },
    lossiness: "LOSSY",
    compatibility: "PARTIAL",
  }));
  assert.equal(normalized.precision?.targetPolicy.roundingMode, "HALF_UP");
  assert.equal(normalized.lossiness, "LOSSY");

  assert.throws(
    () => normalizeQualifiedFieldTransformation(baseInput({
      precision: {
        sourcePolicy: precision("precision:source", 12, 4),
        targetPolicy: precision("precision:target", 10, 2),
      },
      lossiness: "LOSSLESS",
      compatibility: "FULLY_COMPATIBLE",
    })),
    /precision reduction cannot be qualified as LOSSLESS/,
  );
});

test("TASK-506 never promotes lossy or unknown-lossiness transformations to fully compatible", () => {
  for (const declaredLossiness of ["LOSSY", "UNKNOWN"] as const) {
    assert.throws(
      () => normalizeQualifiedFieldTransformation(baseInput({
        lossiness: declaredLossiness,
        compatibility: "FULLY_COMPATIBLE",
      })),
      /cannot be FULLY_COMPATIBLE/,
    );
  }

  const partial = normalizeQualifiedFieldTransformation(baseInput({
    lossiness: "UNKNOWN",
    compatibility: "UNKNOWN",
  }));
  assert.equal(partial.compatibility, "UNKNOWN");
});

test("TASK-506 binds transformations to canonical source/target schema revisions and evidence", () => {
  const normalized = normalizeQualifiedFieldTransformation(baseInput());
  assert.equal(normalized.sourceSchemaRevision.revisionRef, "r1");
  assert.equal(normalized.targetSchemaRevision.revisionRef, "r2");
  assert.equal(normalized.evidence.evidenceId, "evidence:transformation/customer-r1-r2");

  assert.throws(
    () => normalizeQualifiedFieldTransformation(baseInput({
      targetSchemaRevision: { ...revision("r2"), canonicalRef: "other-record" },
    })),
    /same canonical schema definition/,
  );

  assert.throws(
    () => normalizeQualifiedFieldTransformation(baseInput({ targetSchemaRevision: revision("r1") })),
    /distinct source and target schema revisions/,
  );
});

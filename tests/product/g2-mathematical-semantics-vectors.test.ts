import assert from "node:assert/strict";
import test from "node:test";
import {
  MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  normalizeAnalyticalInputBinding,
  normalizeAnalyticalPrecisionTemporalBinding,
  normalizeAnalyticalUnitBinding,
} from "../../packages/contracts/mathematical-semantics/index.js";
import {
  assertVectorTransitionQualified,
  normalizeAnalyticalVectorBinding,
  type AnalyticalVectorBinding,
} from "../../packages/contracts/mathematical-semantics/vector.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const analyticalRevision = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "mathematical-semantics",
  semanticKind: "analytical-definition",
  canonicalRef: "analysis:station-vector",
  definitionRef: "definition:station-vector",
  revisionOwner: "mathematical-semantics",
  revisionDimension: "definition",
  revisionRef: "revision:station-vector:r1",
} as const;
const sourceRevision = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "operations-domain",
  semanticKind: "observed-capability",
  canonicalRef: "capability:station-alpha",
  definitionRef: "definition:station-alpha-vector",
  revisionOwner: "operations-domain",
  revisionDimension: "observation-schema",
  revisionRef: "revision:station-alpha:r7",
} as const;
const input = normalizeAnalyticalInputBinding({
  contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  inputRef: "input:station-alpha-vector",
  producingAnalyticalRevision: analyticalRevision,
  sourceRevision,
  valueType: "VECTOR",
}, analyticalRevision);
const unit = normalizeAnalyticalUnitBinding({
  contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  valueRef: "value:station-alpha-vector",
  producingAnalyticalRevision: analyticalRevision,
  sourceRevision,
  unit: { state: "KNOWN", unitRef: "unit:ratio", unitRevision: "unit:ratio:r1", dimension: { terms: [] } },
}, input);
const qualified = normalizeAnalyticalPrecisionTemporalBinding({
  contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  valueRef: unit.valueRef,
  producingAnalyticalRevision: analyticalRevision,
  sourceRevision,
  unit: unit.unit,
  precisionPolicy: { policyRef: "precision:station-vector", policyRevision: "precision:station-vector:r1", precision: 6, scale: 3, roundingMode: "HALF_EVEN" },
  temporalContext: { state: "INSTANT", at: "2026-09-09T00:00:00Z", anchor: { kind: "OBSERVATION", anchorRef: "obs:station-alpha", anchorRevision: "obs:station-alpha:r1" } },
}, unit, { policyRef: "precision:station-vector", policyRevision: "precision:station-vector:r1" });

function vector(overrides: Record<string, unknown> = {}): AnalyticalVectorBinding {
  return normalizeAnalyticalVectorBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    shape: "VECTOR",
    vectorRef: "vector:station-alpha",
    qualifiedValue: qualified,
    basis: { basisRef: "basis:health", basisRevision: "basis:health:r1", dimension: 2, coordinateOrder: ["availability", "latency"] },
    coordinates: ["availability", "latency"],
    locality: { level: "STATION", localityOwner: "operations-domain", localityRef: "station:alpha", localityRevision: "station:alpha:r4" },
    ...overrides,
  }, qualified);
}

test("TASK-487 preserves explicit vector basis, order, dimension and predecessor qualification", () => {
  const normalized = vector();
  assert.equal(normalized.shape, "VECTOR");
  assert.equal(normalized.basis.dimension, 2);
  assert.deepEqual(normalized.basis.coordinateOrder, ["availability", "latency"]);
  assert.deepEqual(normalized.qualifiedValue, qualified);
});

test("TASK-487 rejects dimension mismatch, coordinate reorder and scalarization", () => {
  assert.throws(() => vector({ basis: { basisRef: "basis:health", basisRevision: "basis:health:r1", dimension: 3, coordinateOrder: ["availability", "latency"] } }), /dimension/);
  assert.throws(() => vector({ coordinates: ["latency", "availability"] }), /basis order/);
  assert.throws(() => vector({ shape: "SCALAR" }), /VECTOR/);
});

test("TASK-487 rejects basis substitution and Fleet-to-Station strengthening without qualified transform", () => {
  const source = vector({ locality: { level: "FLEET", localityOwner: "fleet-owner", localityRef: "fleet:south", localityRevision: "fleet:south:r2" } });
  const target = vector({ basis: { basisRef: "basis:health-v2", basisRevision: "basis:health-v2:r1", dimension: 2, coordinateOrder: ["latency", "availability"] }, coordinates: ["latency", "availability"] });
  assert.throws(() => assertVectorTransitionQualified(source, target), /owner-qualified transform/);
});

test("TASK-487 accepts reorder or locality change only when transform exactly binds source and target", () => {
  const source = vector({ locality: { level: "FLEET", localityOwner: "fleet-owner", localityRef: "fleet:south", localityRevision: "fleet:south:r2" } });
  const target = vector({ basis: { basisRef: "basis:health-v2", basisRevision: "basis:health-v2:r1", dimension: 2, coordinateOrder: ["latency", "availability"] }, coordinates: ["latency", "availability"] });
  const transform = {
    transformRef: "transform:fleet-health-to-station",
    transformRevision: "transform:fleet-health-to-station:r1",
    transformOwner: "operations-domain",
    sourceBasisRef: source.basis.basisRef,
    sourceBasisRevision: source.basis.basisRevision,
    targetBasisRef: target.basis.basisRef,
    targetBasisRevision: target.basis.basisRevision,
    sourceDimension: source.basis.dimension,
    targetDimension: target.basis.dimension,
    sourceCoordinateOrder: source.basis.coordinateOrder,
    targetCoordinateOrder: target.basis.coordinateOrder,
    sourceLocality: source.locality,
    targetLocality: target.locality,
  } as const;
  assert.doesNotThrow(() => assertVectorTransitionQualified(source, target, transform));
  assert.throws(() => assertVectorTransitionQualified(source, target, { ...transform, transformOwner: "" }), /transformOwner/);
});

test("TASK-487 rejects precision or source-lineage substitution inside vector qualification", () => {
  assert.throws(() => normalizeAnalyticalVectorBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    shape: "VECTOR",
    vectorRef: "vector:station-alpha",
    qualifiedValue: { ...qualified, precisionPolicy: { ...qualified.precisionPolicy, policyRevision: "precision:station-vector:latest" } },
    basis: { basisRef: "basis:health", basisRevision: "basis:health:r1", dimension: 2, coordinateOrder: ["availability", "latency"] },
    coordinates: ["availability", "latency"],
    locality: { level: "STATION", localityOwner: "operations-domain", localityRef: "station:alpha", localityRevision: "station:alpha:r4" },
  }, qualified), /historical policy revision/);
});

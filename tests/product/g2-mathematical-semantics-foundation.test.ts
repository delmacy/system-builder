import assert from "node:assert/strict";
import test from "node:test";
import {
  MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  assertCompatibleDimensions,
  normalizeAnalyticalDefinitionRevision,
  normalizeAnalyticalInputBinding,
  normalizeAnalyticalPrecisionTemporalBinding,
  normalizeAnalyticalUnitBinding,
  normalizeUnitReference,
} from "../../packages/contracts/mathematical-semantics/index.js";
import {
  assertVectorTransitionQualified,
  normalizeAnalyticalVectorBinding,
} from "../../packages/contracts/mathematical-semantics/vector.js";
import {
  assertAnalyticalTransformDoesNotStrengthen,
  normalizeAnalyticalValueQualification,
} from "../../packages/contracts/mathematical-semantics/uncertainty.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const analyticalRevision = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "mathematical-semantics",
  semanticKind: "analytical-definition",
  canonicalRef: "analysis:foundation",
  definitionRef: "definition:foundation",
  revisionOwner: "mathematical-semantics",
  revisionDimension: "definition",
  revisionRef: "revision:foundation:r1",
} as const;

const sourceRevision = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "operations-domain",
  semanticKind: "observed-capability",
  canonicalRef: "capability:station-alpha",
  definitionRef: "definition:station-alpha",
  revisionOwner: "operations-domain",
  revisionDimension: "observation-schema",
  revisionRef: "revision:station-alpha:r7",
} as const;

function buildIntegratedChain(dimensionTerms: readonly unknown[]) {
  const definition = normalizeAnalyticalDefinitionRevision({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    ref: analyticalRevision,
    kind: "DERIVATION",
  });
  const input = normalizeAnalyticalInputBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    inputRef: "input:foundation",
    producingAnalyticalRevision: definition.ref,
    sourceRevision,
    valueType: "VECTOR",
  }, definition.ref);
  const unit = normalizeAnalyticalUnitBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    valueRef: "value:foundation",
    producingAnalyticalRevision: definition.ref,
    sourceRevision,
    unit: {
      state: "KNOWN",
      unitRef: "unit:velocity",
      unitRevision: "unit:velocity:r2",
      dimension: { terms: dimensionTerms },
    },
  }, input);
  const qualified = normalizeAnalyticalPrecisionTemporalBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    valueRef: unit.valueRef,
    producingAnalyticalRevision: definition.ref,
    sourceRevision,
    unit: unit.unit,
    precisionPolicy: {
      policyRef: "precision:foundation",
      policyRevision: "precision:foundation:r3",
      precision: 8,
      scale: 4,
      roundingMode: "HALF_EVEN",
    },
    temporalContext: {
      state: "WINDOW",
      start: "2026-09-09T00:00:00Z",
      end: "2026-09-09T00:00:00.125Z",
      startBoundary: "CLOSED",
      endBoundary: "OPEN",
      anchor: { kind: "OBSERVATION", anchorRef: "obs:alpha", anchorRevision: "obs:alpha:r11" },
    },
  }, unit, { policyRef: "precision:foundation", policyRevision: "precision:foundation:r3" });
  const vector = normalizeAnalyticalVectorBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    shape: "VECTOR",
    vectorRef: "vector:foundation",
    qualifiedValue: qualified,
    basis: { basisRef: "basis:enu", basisRevision: "basis:enu:r4", dimension: 2, coordinateOrder: ["east", "north"] },
    coordinates: ["east", "north"],
    locality: { level: "STATION", localityOwner: "operations-domain", localityRef: "station:alpha", localityRevision: "station:alpha:r5" },
  }, qualified);
  const value = normalizeAnalyticalValueQualification({
    qualificationRef: "qualification:foundation",
    qualificationRevision: "qualification:foundation:r2",
    qualificationOwner: "operations-domain",
    epistemicState: "PARTIAL",
    vector,
    evidence: [{ evidenceRef: "evidence:obs-alpha", evidenceRevision: "evidence:obs-alpha:r9", evidenceOwner: "operations-domain" }],
    uncertainty: { state: "BOUNDED", uncertaintyRef: "uncertainty:foundation", uncertaintyRevision: "uncertainty:foundation:r2", uncertaintyOwner: "operations-domain" },
    associationKind: "CORRELATION",
  }, vector);
  return { definition, input, unit, qualified, vector, value };
}

test("TASK-489 proves the complete Construction A lineage deterministically", () => {
  const left = buildIntegratedChain([{ axis: "TIME", exponent: -1 }, { axis: "LENGTH", exponent: 1 }]);
  const right = buildIntegratedChain([{ axis: "LENGTH", exponent: 1 }, { axis: "TIME", exponent: -1 }]);

  assert.deepEqual(left, right);
  assert.equal(left.input.producingAnalyticalRevision.revisionRef, "revision:foundation:r1");
  assert.equal(left.input.sourceRevision.revisionRef, "revision:station-alpha:r7");
  assert.equal(left.qualified.precisionPolicy.policyRevision, "precision:foundation:r3");
  assert.equal(left.vector.basis.basisRevision, "basis:enu:r4");
  assert.equal(left.vector.locality.localityRevision, "station:alpha:r5");
  assert.equal(left.value.epistemicState, "PARTIAL");
  assert.equal(left.value.evidence[0]?.evidenceRevision, "evidence:obs-alpha:r9");
});

test("TASK-489 integrated negative boundaries fail closed without predecessor mutation", () => {
  const chain = buildIntegratedChain([{ axis: "LENGTH", exponent: 1 }, { axis: "TIME", exponent: -1 }]);

  assert.throws(() => normalizeAnalyticalInputBinding({
    ...chain.input,
    producingAnalyticalRevision: { ...analyticalRevision, revisionRef: "revision:foundation:latest" },
  }, analyticalRevision), /producing revision/);

  const incompatible = normalizeUnitReference({
    state: "KNOWN",
    unitRef: "unit:duration",
    unitRevision: "unit:duration:r1",
    dimension: { terms: [{ axis: "TIME", exponent: 1 }] },
  });
  assert.throws(() => assertCompatibleDimensions(chain.unit.unit, incompatible), /incompatible/);

  assert.throws(() => normalizeAnalyticalPrecisionTemporalBinding({
    ...chain.qualified,
    precisionPolicy: { ...chain.qualified.precisionPolicy, roundingMode: undefined },
  }, chain.unit, { policyRef: "precision:foundation", policyRevision: "precision:foundation:r3" }), /roundingMode|rounding/);

  assert.throws(() => normalizeAnalyticalPrecisionTemporalBinding({
    ...chain.qualified,
    temporalContext: { ...chain.qualified.temporalContext, endBoundary: undefined },
  }, chain.unit, { policyRef: "precision:foundation", policyRevision: "precision:foundation:r3" }), /endBoundary|boundary/);

  assert.throws(() => normalizeAnalyticalVectorBinding({
    ...chain.vector,
    coordinates: ["north", "east"],
  }, chain.qualified), /basis order/);

  assert.throws(() => assertVectorTransitionQualified(chain.vector, {
    ...chain.vector,
    locality: { ...chain.vector.locality, localityRevision: "station:alpha:latest" },
  }), /transform/);

  const unknown = normalizeAnalyticalValueQualification({
    ...chain.value,
    qualificationRef: "qualification:unknown",
    epistemicState: "UNKNOWN",
    evidence: [],
    uncertainty: { state: "UNRESOLVED" },
  }, chain.vector);
  const known = normalizeAnalyticalValueQualification({
    ...chain.value,
    qualificationRef: "qualification:known",
    epistemicState: "KNOWN",
    uncertainty: { state: "NONE_DECLARED" },
  }, chain.vector);
  assert.throws(() => assertAnalyticalTransformDoesNotStrengthen([unknown], known), /strengthen|UNKNOWN/);
  assert.throws(() => normalizeAnalyticalValueQualification({
    ...chain.value,
    associationKind: "CAUSAL",
  }, chain.vector), /causal authority/);
});

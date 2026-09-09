import assert from "node:assert/strict";
import test from "node:test";
import { MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, normalizeAnalyticalInputBinding, normalizeAnalyticalPrecisionTemporalBinding, normalizeAnalyticalUnitBinding } from "../../packages/contracts/mathematical-semantics/index.js";
import { normalizeAnalyticalVectorBinding } from "../../packages/contracts/mathematical-semantics/vector.js";
import { assertAnalyticalTransformDoesNotStrengthen, normalizeAnalyticalValueQualification } from "../../packages/contracts/mathematical-semantics/uncertainty.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const analyticalRevision = { contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION, semanticOwner: "mathematical-semantics", semanticKind: "analytical-definition", canonicalRef: "analysis:uncertainty", definitionRef: "definition:uncertainty", revisionOwner: "mathematical-semantics", revisionDimension: "definition", revisionRef: "revision:uncertainty:r1" } as const;
const sourceRevision = { contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION, semanticOwner: "operations-domain", semanticKind: "observed-capability", canonicalRef: "capability:station-alpha", definitionRef: "definition:station-alpha", revisionOwner: "operations-domain", revisionDimension: "observation-schema", revisionRef: "revision:station-alpha:r7" } as const;
const input = normalizeAnalyticalInputBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, inputRef: "input:uncertainty", producingAnalyticalRevision: analyticalRevision, sourceRevision, valueType: "VECTOR" }, analyticalRevision);
const unit = normalizeAnalyticalUnitBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, valueRef: "value:uncertainty", producingAnalyticalRevision: analyticalRevision, sourceRevision, unit: { state: "KNOWN", unitRef: "unit:ratio", unitRevision: "unit:ratio:r1", dimension: { terms: [] } } }, input);
const qualified = normalizeAnalyticalPrecisionTemporalBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, valueRef: unit.valueRef, producingAnalyticalRevision: analyticalRevision, sourceRevision, unit: unit.unit, precisionPolicy: { policyRef: "precision:u", policyRevision: "precision:u:r1", precision: 6, scale: 3, roundingMode: "HALF_EVEN" }, temporalContext: { state: "INSTANT", at: "2026-09-09T00:00:00Z", anchor: { kind: "OBSERVATION", anchorRef: "obs:alpha", anchorRevision: "obs:alpha:r1" } } }, unit, { policyRef: "precision:u", policyRevision: "precision:u:r1" });
const vector = normalizeAnalyticalVectorBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, shape: "VECTOR", vectorRef: "vector:u", qualifiedValue: qualified, basis: { basisRef: "basis:u", basisRevision: "basis:u:r1", dimension: 2, coordinateOrder: ["x", "y"] }, coordinates: ["x", "y"], locality: { level: "STATION", localityOwner: "operations-domain", localityRef: "station:alpha", localityRevision: "station:alpha:r4" } }, qualified);

function q(epistemicState: "UNKNOWN" | "INCONCLUSIVE" | "PARTIAL" | "KNOWN", overrides: Record<string, unknown> = {}) {
  return normalizeAnalyticalValueQualification({ qualificationRef: `qualification:${epistemicState}`, qualificationRevision: "qualification:r1", qualificationOwner: "operations-domain", epistemicState, vector, evidence: epistemicState === "UNKNOWN" ? [] : [{ evidenceRef: "evidence:obs", evidenceRevision: "evidence:obs:r1", evidenceOwner: "operations-domain" }], uncertainty: epistemicState === "KNOWN" ? { state: "NONE_DECLARED" } : { state: "UNRESOLVED" }, associationKind: "EVIDENCE_ASSOCIATION", ...overrides }, vector);
}

test("TASK-488 preserves UNKNOWN PARTIAL INCONCLUSIVE and KNOWN as distinct qualifications", () => {
  assert.equal(q("UNKNOWN").epistemicState, "UNKNOWN");
  assert.equal(q("PARTIAL").epistemicState, "PARTIAL");
  assert.equal(q("INCONCLUSIVE").epistemicState, "INCONCLUSIVE");
  assert.equal(q("KNOWN").epistemicState, "KNOWN");
});

test("TASK-488 rejects unknown-to-known and partial-to-complete strengthening", () => {
  assert.throws(() => assertAnalyticalTransformDoesNotStrengthen([q("UNKNOWN")], q("KNOWN")), /strengthen|UNKNOWN/);
  assert.throws(() => assertAnalyticalTransformDoesNotStrengthen([q("PARTIAL")], q("KNOWN")), /strengthen/);
});

test("TASK-488 does not turn missing evidence into zero false default or authority", () => {
  assert.throws(() => q("KNOWN", { evidence: [] }), /explicit evidence/);
  assert.throws(() => q("KNOWN", { uncertainty: { state: "UNRESOLVED" } }), /unresolved uncertainty/);
});

test("TASK-488 rejects evidence omission by shape, causality promotion and lineage substitution", () => {
  assert.throws(() => q("PARTIAL", { evidence: undefined }), /evidence/);
  assert.throws(() => q("PARTIAL", { associationKind: "CAUSAL" }), /causal authority/);
  assert.throws(() => q("PARTIAL", { vector: { ...vector, locality: { ...vector.locality, localityRevision: "station:alpha:latest" } } }), /lineage/);
});

test("TASK-488 permits only conservative output from mixed epistemic inputs", () => {
  assert.doesNotThrow(() => assertAnalyticalTransformDoesNotStrengthen([q("KNOWN"), q("PARTIAL")], q("PARTIAL")));
  assert.throws(() => assertAnalyticalTransformDoesNotStrengthen([q("KNOWN"), q("INCONCLUSIVE")], q("PARTIAL")), /strengthen|INCONCLUSIVE/);
});

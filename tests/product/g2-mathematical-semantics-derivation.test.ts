import assert from "node:assert/strict";
import test from "node:test";
import {
  MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  normalizeAnalyticalDefinitionRevision,
  normalizeAnalyticalInputBinding,
  normalizeAnalyticalPrecisionTemporalBinding,
  normalizeAnalyticalUnitBinding,
} from "../../packages/contracts/mathematical-semantics/index.js";
import { normalizeAnalyticalEvaluationEnvelope, normalizeAnalyticalEvaluationOutcome } from "../../packages/contracts/mathematical-semantics/evaluation.js";
import { normalizeAnalyticalDerivationLineage } from "../../packages/contracts/mathematical-semantics/derivation.js";
import { normalizeAnalyticalVectorBinding } from "../../packages/contracts/mathematical-semantics/vector.js";
import { normalizeAnalyticalValueQualification } from "../../packages/contracts/mathematical-semantics/uncertainty.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const definitionRef = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "mathematical-semantics",
  semanticKind: "analytical-definition",
  canonicalRef: "analysis:task-492",
  definitionRef: "definition:task-492",
  revisionOwner: "mathematical-semantics",
  revisionDimension: "definition",
  revisionRef: "revision:task-492:r3",
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

function qualified(epistemicState: "UNKNOWN" | "PARTIAL") {
  const definition = normalizeAnalyticalDefinitionRevision({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, ref: definitionRef, kind: "RULE" });
  const input = normalizeAnalyticalInputBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, inputRef: "input:velocity", producingAnalyticalRevision: definition.ref, sourceRevision, valueType: "VECTOR" }, definition.ref);
  const unit = normalizeAnalyticalUnitBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, valueRef: "value:velocity", producingAnalyticalRevision: definition.ref, sourceRevision, unit: { state: "KNOWN", unitRef: "unit:mps", unitRevision: "unit:mps:r2", dimension: { terms: [{ axis: "LENGTH", exponent: 1 }, { axis: "TIME", exponent: -1 }] } } }, input);
  const temporal = normalizeAnalyticalPrecisionTemporalBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, valueRef: unit.valueRef, producingAnalyticalRevision: definition.ref, sourceRevision, unit: unit.unit, precisionPolicy: { policyRef: "precision:velocity", policyRevision: "precision:velocity:r4", precision: 8, scale: 3, roundingMode: "HALF_EVEN" }, temporalContext: { state: "INSTANT", at: "2026-09-09T09:00:00Z", anchor: { kind: "OBSERVATION", anchorRef: "observation:alpha", anchorRevision: "observation:alpha:r9" } } }, unit, { policyRef: "precision:velocity", policyRevision: "precision:velocity:r4" });
  const vector = normalizeAnalyticalVectorBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, shape: "VECTOR", vectorRef: "vector:velocity", qualifiedValue: temporal, basis: { basisRef: "basis:enu", basisRevision: "basis:enu:r2", dimension: 2, coordinateOrder: ["east", "north"] }, coordinates: ["east", "north"], locality: { level: "STATION", localityOwner: "operations-domain", localityRef: "station:alpha", localityRevision: "station:alpha:r5" } }, temporal);
  const value = normalizeAnalyticalValueQualification({ qualificationRef: `qualification:${epistemicState.toLowerCase()}`, qualificationRevision: "qualification:r2", qualificationOwner: "operations-domain", epistemicState, vector, evidence: epistemicState === "UNKNOWN" ? [] : [{ evidenceRef: "evidence:velocity", evidenceRevision: "evidence:velocity:r8", evidenceOwner: "operations-domain" }], uncertainty: { state: "UNRESOLVED" }, associationKind: "EVIDENCE_ASSOCIATION" }, vector);
  return { definition, value };
}

function fixture() {
  const partial = qualified("PARTIAL");
  const expectedInputs = [{ inputRef: "input:velocity", qualification: partial.value }];
  const envelope = normalizeAnalyticalEvaluationEnvelope({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, evaluationRef: "evaluation:task-492", definition: partial.definition, inputs: expectedInputs }, partial.definition, expectedInputs);
  const resolved = normalizeAnalyticalEvaluationOutcome({ kind: "RESOLVED", evaluation: envelope, value: partial.value }, envelope, "RESOLVED", partial.value);
  const transform = { contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, transformRef: "transform:identity", transformRevision: partial.definition, transformOwner: "mathematical-semantics", kind: "DERIVATION" as const };
  const parent = { parentRef: "parent:velocity", outcome: resolved };
  return { ...partial, envelope, transform, parent };
}

test("TASK-492 normalizes exact owner-preserving historical derivation lineage deterministically", () => {
  const { value, transform, parent } = fixture();
  const lineage = { contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, derivationRef: "derivation:velocity", transform, sourceParentRef: parent.parentRef, parents: [parent], output: value };
  const normalized = normalizeAnalyticalDerivationLineage(lineage, transform, [parent], value);
  assert.equal(normalized.output.vector.qualifiedValue.sourceRevision.revisionOwner, "operations-domain");
  assert.equal(normalized.output.vector.qualifiedValue.producingAnalyticalRevision.revisionRef, "revision:task-492:r3");
  assert.deepEqual(normalizeAnalyticalDerivationLineage({ ...lineage, parents: [...lineage.parents].reverse() }, transform, [parent], value), normalized);
});

test("TASK-492 rejects dropped duplicate latest owner locality and disposition strengthening", () => {
  const { value, envelope, transform, parent } = fixture();
  const lineage = { contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, derivationRef: "derivation:velocity", transform, sourceParentRef: parent.parentRef, parents: [parent], output: value };

  assert.throws(() => normalizeAnalyticalDerivationLineage({ ...lineage, parents: [] }, transform, [parent], value), /parent/);
  assert.throws(() => normalizeAnalyticalDerivationLineage({ ...lineage, parents: [parent, parent] }, transform, [parent], value), /drop|add|duplicated|ambiguous/);
  assert.throws(() => normalizeAnalyticalDerivationLineage({ ...lineage, transform: { ...transform, transformRevision: { ...transform.transformRevision, ref: { ...transform.transformRevision.ref, revisionRef: "latest" } } } }, transform, [parent], value), /historical revision/);
  assert.throws(() => normalizeAnalyticalDerivationLineage({ ...lineage, output: { ...value, qualificationOwner: "mathematical-semantics" } }, transform, [parent], value), /qualification|owner|preserve/);
  assert.throws(() => normalizeAnalyticalDerivationLineage({ ...lineage, output: { ...value, vector: { ...value.vector, locality: { ...value.vector.locality, level: "FLEET", localityRef: "fleet:alpha", localityRevision: "fleet:alpha:r1" } } } }, transform, [parent], value), /locality|preserve|lineage/);

  const unresolved = normalizeAnalyticalEvaluationOutcome({ kind: "UNRESOLVED", evaluation: envelope, reason: "missing second parent", evidence: [] }, envelope, "UNRESOLVED");
  const unresolvedParent = { parentRef: "parent:missing", outcome: unresolved };
  const knownLike = { ...value, epistemicState: "PARTIAL" as const };
  assert.throws(() => normalizeAnalyticalDerivationLineage({ ...lineage, parents: [parent, unresolvedParent], output: knownLike }, transform, [parent, unresolvedParent], knownLike), /UNRESOLVED|UNKNOWN|promote/);
});

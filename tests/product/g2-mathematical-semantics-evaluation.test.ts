import assert from "node:assert/strict";
import test from "node:test";
import {
  MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  normalizeAnalyticalDefinitionRevision,
  normalizeAnalyticalInputBinding,
  normalizeAnalyticalPrecisionTemporalBinding,
  normalizeAnalyticalUnitBinding,
} from "../../packages/contracts/mathematical-semantics/index.js";
import { normalizeAnalyticalEvaluationEnvelope } from "../../packages/contracts/mathematical-semantics/evaluation.js";
import { normalizeAnalyticalVectorBinding } from "../../packages/contracts/mathematical-semantics/vector.js";
import { normalizeAnalyticalValueQualification } from "../../packages/contracts/mathematical-semantics/uncertainty.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const definitionRef = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "mathematical-semantics",
  semanticKind: "analytical-definition",
  canonicalRef: "analysis:task-490",
  definitionRef: "definition:task-490",
  revisionOwner: "mathematical-semantics",
  revisionDimension: "definition",
  revisionRef: "revision:task-490:r3",
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

function chain(epistemicState: "UNKNOWN" | "PARTIAL") {
  const definition = normalizeAnalyticalDefinitionRevision({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    ref: definitionRef,
    kind: "RULE",
  });
  const input = normalizeAnalyticalInputBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    inputRef: "input:velocity",
    producingAnalyticalRevision: definition.ref,
    sourceRevision,
    valueType: "VECTOR",
  }, definition.ref);
  const unit = normalizeAnalyticalUnitBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    valueRef: "value:velocity",
    producingAnalyticalRevision: definition.ref,
    sourceRevision,
    unit: { state: "KNOWN", unitRef: "unit:mps", unitRevision: "unit:mps:r2", dimension: { terms: [{ axis: "LENGTH", exponent: 1 }, { axis: "TIME", exponent: -1 }] } },
  }, input);
  const qualified = normalizeAnalyticalPrecisionTemporalBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    valueRef: unit.valueRef,
    producingAnalyticalRevision: definition.ref,
    sourceRevision,
    unit: unit.unit,
    precisionPolicy: { policyRef: "precision:velocity", policyRevision: "precision:velocity:r4", precision: 8, scale: 3, roundingMode: "HALF_EVEN" },
    temporalContext: { state: "INSTANT", at: "2026-09-09T09:00:00Z", anchor: { kind: "OBSERVATION", anchorRef: "observation:alpha", anchorRevision: "observation:alpha:r9" } },
  }, unit, { policyRef: "precision:velocity", policyRevision: "precision:velocity:r4" });
  const vector = normalizeAnalyticalVectorBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    shape: "VECTOR",
    vectorRef: "vector:velocity",
    qualifiedValue: qualified,
    basis: { basisRef: "basis:enu", basisRevision: "basis:enu:r2", dimension: 2, coordinateOrder: ["east", "north"] },
    coordinates: ["east", "north"],
    locality: { level: "STATION", localityOwner: "operations-domain", localityRef: "station:alpha", localityRevision: "station:alpha:r5" },
  }, qualified);
  const qualification = normalizeAnalyticalValueQualification({
    qualificationRef: `qualification:${epistemicState.toLowerCase()}`,
    qualificationRevision: "qualification:r2",
    qualificationOwner: "operations-domain",
    epistemicState,
    vector,
    evidence: epistemicState === "UNKNOWN" ? [] : [{ evidenceRef: "evidence:velocity", evidenceRevision: "evidence:velocity:r8", evidenceOwner: "operations-domain" }],
    uncertainty: { state: "UNRESOLVED" },
    associationKind: "EVIDENCE_ASSOCIATION",
  }, vector);
  return { definition, qualification };
}

test("TASK-490 normalizes equivalent explicit evaluation envelopes deterministically", () => {
  const first = chain("PARTIAL");
  const unknown = chain("UNKNOWN");
  const expected = [
    { inputRef: "input:z-unknown", qualification: unknown.qualification },
    { inputRef: "input:a-partial", qualification: first.qualification },
  ];
  const envelope = {
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    evaluationRef: "evaluation:task-490",
    definition: first.definition,
    inputs: [...expected].reverse(),
  };
  const normalized = normalizeAnalyticalEvaluationEnvelope(envelope, first.definition, expected);
  assert.deepEqual(normalized.inputs.map((input) => input.inputRef), ["input:a-partial", "input:z-unknown"]);
  assert.equal(normalized.definition.ref.revisionRef, "revision:task-490:r3");
  assert.equal(normalized.inputs[1]?.qualification.epistemicState, "UNKNOWN");
  assert.equal(normalized.inputs[0]?.qualification.vector.locality.localityRevision, "station:alpha:r5");
  assert.deepEqual(normalized, normalizeAnalyticalEvaluationEnvelope({ ...envelope, inputs: expected }, first.definition, expected));
});

test("TASK-490 rejects latest revision substitution, missing/defaulted and strengthened bindings", () => {
  const partial = chain("PARTIAL");
  const expected = [{ inputRef: "input:velocity", qualification: partial.qualification }];
  const base = {
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    evaluationRef: "evaluation:task-490",
    definition: partial.definition,
    inputs: expected,
  };

  assert.throws(() => normalizeAnalyticalEvaluationEnvelope({ ...base, definition: { ...partial.definition, ref: { ...partial.definition.ref, revisionRef: "latest" } } }, partial.definition, expected), /historical revision/);
  assert.throws(() => normalizeAnalyticalEvaluationEnvelope({ ...base, inputs: [] }, partial.definition, expected), /missing inputs|defaulted/);
  assert.throws(() => normalizeAnalyticalEvaluationEnvelope({ ...base, inputs: [expected[0], expected[0]] }, partial.definition, expected), /explicit|duplicated|ambiguous/);
  assert.throws(() => normalizeAnalyticalEvaluationEnvelope({ ...base, inputs: [{ inputRef: "input:velocity", qualification: { ...partial.qualification, qualificationOwner: "evaluation-engine" } }] }, partial.definition, expected), /preserve|lineage|owner/);
  assert.throws(() => normalizeAnalyticalEvaluationEnvelope({ ...base, inputs: [{ inputRef: "input:velocity", qualification: { ...partial.qualification, vector: { ...partial.qualification.vector, locality: { ...partial.qualification.vector.locality, localityRevision: "latest" } } } }] }, partial.definition, expected), /preserve|lineage|locality/);
});

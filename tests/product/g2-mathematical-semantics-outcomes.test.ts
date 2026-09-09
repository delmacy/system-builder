import assert from "node:assert/strict";
import test from "node:test";
import {
  MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  normalizeAnalyticalDefinitionRevision,
  normalizeAnalyticalInputBinding,
  normalizeAnalyticalPrecisionTemporalBinding,
  normalizeAnalyticalUnitBinding,
} from "../../packages/contracts/mathematical-semantics/index.js";
import {
  normalizeAnalyticalEvaluationEnvelope,
  normalizeAnalyticalEvaluationOutcome,
} from "../../packages/contracts/mathematical-semantics/evaluation.js";
import { normalizeAnalyticalVectorBinding } from "../../packages/contracts/mathematical-semantics/vector.js";
import { normalizeAnalyticalValueQualification } from "../../packages/contracts/mathematical-semantics/uncertainty.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const definitionRef = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "mathematical-semantics",
  semanticKind: "analytical-definition",
  canonicalRef: "analysis:task-491",
  definitionRef: "definition:task-491",
  revisionOwner: "mathematical-semantics",
  revisionDimension: "definition",
  revisionRef: "revision:task-491:r3",
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

function qualification(epistemicState: "UNKNOWN" | "PARTIAL") {
  const definition = normalizeAnalyticalDefinitionRevision({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, ref: definitionRef, kind: "RULE" });
  const input = normalizeAnalyticalInputBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, inputRef: "input:velocity", producingAnalyticalRevision: definition.ref, sourceRevision, valueType: "VECTOR" }, definition.ref);
  const unit = normalizeAnalyticalUnitBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, valueRef: "value:velocity", producingAnalyticalRevision: definition.ref, sourceRevision, unit: { state: "KNOWN", unitRef: "unit:mps", unitRevision: "unit:mps:r2", dimension: { terms: [{ axis: "LENGTH", exponent: 1 }, { axis: "TIME", exponent: -1 }] } } }, input);
  const temporal = normalizeAnalyticalPrecisionTemporalBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, valueRef: unit.valueRef, producingAnalyticalRevision: definition.ref, sourceRevision, unit: unit.unit, precisionPolicy: { policyRef: "precision:velocity", policyRevision: "precision:velocity:r4", precision: 8, scale: 3, roundingMode: "HALF_EVEN" }, temporalContext: { state: "INSTANT", at: "2026-09-09T09:00:00Z", anchor: { kind: "OBSERVATION", anchorRef: "observation:alpha", anchorRevision: "observation:alpha:r9" } } }, unit, { policyRef: "precision:velocity", policyRevision: "precision:velocity:r4" });
  const vector = normalizeAnalyticalVectorBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, shape: "VECTOR", vectorRef: "vector:velocity", qualifiedValue: temporal, basis: { basisRef: "basis:enu", basisRevision: "basis:enu:r2", dimension: 2, coordinateOrder: ["east", "north"] }, coordinates: ["east", "north"], locality: { level: "STATION", localityOwner: "operations-domain", localityRef: "station:alpha", localityRevision: "station:alpha:r5" } }, temporal);
  const value = normalizeAnalyticalValueQualification({ qualificationRef: `qualification:${epistemicState.toLowerCase()}`, qualificationRevision: "qualification:r2", qualificationOwner: "operations-domain", epistemicState, vector, evidence: epistemicState === "UNKNOWN" ? [] : [{ evidenceRef: "evidence:velocity", evidenceRevision: "evidence:velocity:r8", evidenceOwner: "operations-domain" }], uncertainty: { state: "UNRESOLVED" }, associationKind: "EVIDENCE_ASSOCIATION" }, vector);
  return { definition, value };
}

function fixture() {
  const partial = qualification("PARTIAL");
  const expectedInputs = [{ inputRef: "input:velocity", qualification: partial.value }];
  const envelope = normalizeAnalyticalEvaluationEnvelope({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, evaluationRef: "evaluation:task-491", definition: partial.definition, inputs: expectedInputs }, partial.definition, expectedInputs);
  return { ...partial, envelope };
}

test("TASK-491 normalizes resolved unresolved and error dispositions deterministically", () => {
  const { value, envelope } = fixture();
  const resolved = normalizeAnalyticalEvaluationOutcome({ kind: "RESOLVED", evaluation: envelope, value }, envelope, "RESOLVED", value);
  assert.equal(resolved.kind, "RESOLVED");
  assert.equal(resolved.value.vector.qualifiedValue.sourceRevision.revisionRef, "revision:station-alpha:r7");
  assert.equal(resolved.value.vector.locality.localityRevision, "station:alpha:r5");

  const evidence = [
    { evidenceRef: "evidence:z", evidenceRevision: "r2", evidenceOwner: "operations-domain" },
    { evidenceRef: "evidence:a", evidenceRevision: "r1", evidenceOwner: "operations-domain" },
  ];
  const unresolved = normalizeAnalyticalEvaluationOutcome({ kind: "UNRESOLVED", evaluation: envelope, reason: "missing observation", evidence }, envelope, "UNRESOLVED");
  const unresolvedReordered = normalizeAnalyticalEvaluationOutcome({ kind: "UNRESOLVED", evaluation: envelope, reason: "missing observation", evidence: [...evidence].reverse() }, envelope, "UNRESOLVED");
  assert.deepEqual(unresolved, unresolvedReordered);

  const error = normalizeAnalyticalEvaluationOutcome({ kind: "ERROR", evaluation: envelope, errorCode: "E_EVALUATION", reason: "bounded execution failure", evidence: [] }, envelope, "ERROR");
  assert.equal(error.kind, "ERROR");
});

test("TASK-491 rejects masking defaults revision substitution and qualification strengthening", () => {
  const { value, envelope } = fixture();
  assert.throws(() => normalizeAnalyticalEvaluationOutcome({ kind: "UNRESOLVED", evaluation: envelope, reason: "masked", evidence: [] }, envelope, "ERROR"), /masked|substituted/);
  assert.throws(() => normalizeAnalyticalEvaluationOutcome({ kind: "ERROR", evaluation: envelope, errorCode: "E", reason: "failed", evidence: [], value: false }, envelope, "ERROR"), /unexpected field/);
  assert.throws(() => normalizeAnalyticalEvaluationOutcome({ kind: "UNRESOLVED", evaluation: envelope, reason: "", evidence: [] }, envelope, "UNRESOLVED"), /non-empty/);
  assert.throws(() => normalizeAnalyticalEvaluationOutcome({ kind: "UNRESOLVED", evaluation: { ...envelope, definition: { ...envelope.definition, ref: { ...envelope.definition.ref, revisionRef: "latest" } } }, reason: "missing", evidence: [] }, envelope, "UNRESOLVED"), /historical revision/);

  const known = { ...value, epistemicState: "KNOWN" as const, uncertainty: { state: "NONE_DECLARED" as const } };
  assert.throws(() => normalizeAnalyticalEvaluationOutcome({ kind: "RESOLVED", evaluation: envelope, value: known }, envelope, "RESOLVED", known), /strengthen|UNKNOWN|INCONCLUSIVE/);
  assert.throws(() => normalizeAnalyticalEvaluationOutcome({ kind: "RESOLVED", evaluation: envelope, value: { ...value, vector: { ...value.vector, locality: { ...value.vector.locality, localityRevision: "latest" } } } }, envelope, "RESOLVED", value), /preserve|lineage|locality/);
});

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
import { normalizeAnalyticalAssociationDescriptor } from "../../packages/contracts/mathematical-semantics/association.js";
import { normalizeAnalyticalVectorBinding } from "../../packages/contracts/mathematical-semantics/vector.js";
import { normalizeAnalyticalValueQualification } from "../../packages/contracts/mathematical-semantics/uncertainty.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const definitionRef = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "mathematical-semantics",
  semanticKind: "analytical-definition",
  canonicalRef: "analysis:task-494",
  definitionRef: "definition:task-494",
  revisionOwner: "mathematical-semantics",
  revisionDimension: "definition",
  revisionRef: "revision:task-494:r4",
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

function fixture() {
  const definition = normalizeAnalyticalDefinitionRevision({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, ref: definitionRef, kind: "RULE" });
  const input = normalizeAnalyticalInputBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, inputRef: "input:velocity", producingAnalyticalRevision: definition.ref, sourceRevision, valueType: "VECTOR" }, definition.ref);
  const unit = normalizeAnalyticalUnitBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, valueRef: "value:velocity", producingAnalyticalRevision: definition.ref, sourceRevision, unit: { state: "KNOWN", unitRef: "unit:mps", unitRevision: "unit:mps:r2", dimension: { terms: [{ axis: "LENGTH", exponent: 1 }, { axis: "TIME", exponent: -1 }] } } }, input);
  const temporal = normalizeAnalyticalPrecisionTemporalBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, valueRef: unit.valueRef, producingAnalyticalRevision: definition.ref, sourceRevision, unit: unit.unit, precisionPolicy: { policyRef: "precision:velocity", policyRevision: "precision:velocity:r4", precision: 8, scale: 3, roundingMode: "HALF_EVEN" }, temporalContext: { state: "INSTANT", at: "2026-09-09T09:00:00Z", anchor: { kind: "OBSERVATION", anchorRef: "observation:alpha", anchorRevision: "observation:alpha:r9" } } }, unit, { policyRef: "precision:velocity", policyRevision: "precision:velocity:r4" });
  const vector = normalizeAnalyticalVectorBinding({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, shape: "VECTOR", vectorRef: "vector:velocity", qualifiedValue: temporal, basis: { basisRef: "basis:enu", basisRevision: "basis:enu:r2", dimension: 2, coordinateOrder: ["east", "north"] }, coordinates: ["east", "north"], locality: { level: "STATION", localityOwner: "operations-domain", localityRef: "station:alpha", localityRevision: "station:alpha:r5" } }, temporal);
  const value = normalizeAnalyticalValueQualification({ qualificationRef: "qualification:velocity", qualificationRevision: "qualification:velocity:r2", qualificationOwner: "operations-domain", epistemicState: "PARTIAL", vector, evidence: [{ evidenceRef: "evidence:velocity", evidenceRevision: "evidence:velocity:r8", evidenceOwner: "operations-domain" }], uncertainty: { state: "BOUNDED", uncertaintyRef: "uncertainty:velocity", uncertaintyRevision: "uncertainty:velocity:r3", uncertaintyOwner: "operations-domain" }, associationKind: "EVIDENCE_ASSOCIATION" }, vector);
  const expectedInputs = [{ inputRef: "input:velocity", qualification: value }] as const;
  const envelope = normalizeAnalyticalEvaluationEnvelope({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, evaluationRef: "evaluation:task-494", definition, inputs: expectedInputs }, definition, expectedInputs);
  const resolved = normalizeAnalyticalEvaluationOutcome({ kind: "RESOLVED", evaluation: envelope, value }, envelope, "RESOLVED", value);
  const unresolved = normalizeAnalyticalEvaluationOutcome({ kind: "UNRESOLVED", evaluation: envelope, reason: "missing owner evidence", evidence: [] }, envelope, "UNRESOLVED");
  const error = normalizeAnalyticalEvaluationOutcome({ kind: "ERROR", evaluation: envelope, errorCode: "E_DOMAIN_INPUT", reason: "invalid owner input", evidence: [] }, envelope, "ERROR");
  const transform = { contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, transformRef: "transform:identity", transformRevision: definition, transformOwner: "mathematical-semantics", kind: "DERIVATION" as const };
  const parent = { parentRef: "parent:velocity", outcome: resolved };
  const lineage = normalizeAnalyticalDerivationLineage({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, derivationRef: "derivation:velocity", transform, sourceParentRef: parent.parentRef, parents: [parent], output: value }, transform, [parent], value);
  const participants = [{ participantRef: "participant:source", qualification: value }, { participantRef: "participant:derived", qualification: lineage.output }] as const;
  const evidence = [{ evidenceRef: "evidence:association", evidenceRevision: "evidence:association:r8", evidenceOwner: "operations-domain" }] as const;
  const uncertainty = { state: "BOUNDED", uncertaintyRef: "uncertainty:association", uncertaintyRevision: "uncertainty:association:r3", uncertaintyOwner: "operations-domain" } as const;
  const associationCandidate = { contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, associationRef: "association:source-derived", kind: "CORRELATION", analyticalRevision: definition, participants, evidence, uncertainty } as const;
  return { definition, value, envelope, resolved, unresolved, error, transform, parent, lineage, participants, evidence, uncertainty, associationCandidate };
}

test("TASK-494 proves the integrated revision-pinned evaluation, derivation and non-causal association chain", () => {
  const f = fixture();
  assert.deepEqual(normalizeAnalyticalEvaluationEnvelope({ ...f.envelope }, f.definition, f.envelope.inputs), f.envelope);
  assert.equal(f.resolved.kind, "RESOLVED");
  assert.equal(f.unresolved.kind, "UNRESOLVED");
  assert.equal(f.error.kind, "ERROR");
  assert.equal(f.lineage.output.qualificationOwner, "operations-domain");
  assert.equal(f.lineage.output.vector.qualifiedValue.sourceRevision.revisionRef, "revision:station-alpha:r7");
  assert.equal(f.lineage.output.vector.locality.localityRevision, "station:alpha:r5");
  const association = normalizeAnalyticalAssociationDescriptor(f.associationCandidate, f.definition, f.participants, f.evidence, f.uncertainty);
  assert.equal(association.kind, "CORRELATION");
  assert.deepEqual(normalizeAnalyticalAssociationDescriptor({ ...f.associationCandidate }, f.definition, f.participants, f.evidence, f.uncertainty), association);
});

test("TASK-494 rejects latest revision substitution, implicit defaults and disposition masking", () => {
  const f = fixture();
  assert.throws(() => normalizeAnalyticalEvaluationEnvelope({ ...f.envelope, definition: { ...f.definition, ref: { ...f.definition.ref, revisionRef: "latest" } } }, f.definition, f.envelope.inputs), /historical revision|preserve|exact/i);
  assert.throws(() => normalizeAnalyticalEvaluationEnvelope({ ...f.envelope, inputs: [] }, f.definition, f.envelope.inputs), /missing inputs|default/i);
  assert.throws(() => normalizeAnalyticalEvaluationOutcome({ ...f.unresolved, kind: "RESOLVED", value: f.value }, f.envelope, "UNRESOLVED"), /kind cannot be masked|substituted/i);
  assert.throws(() => normalizeAnalyticalEvaluationOutcome({ ...f.error, kind: "UNRESOLVED" }, f.envelope, "ERROR"), /kind cannot be masked|substituted/i);
});

test("TASK-494 rejects owner/locality strengthening, dropped lineage and causal or authority promotion", () => {
  const f = fixture();
  const lineageCandidate = { contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, derivationRef: "derivation:velocity", transform: f.transform, sourceParentRef: f.parent.parentRef, parents: [f.parent], output: f.value } as const;
  assert.throws(() => normalizeAnalyticalDerivationLineage({ ...lineageCandidate, parents: [] }, f.transform, [f.parent], f.value), /parent/);
  assert.throws(() => normalizeAnalyticalDerivationLineage({ ...lineageCandidate, output: { ...f.value, qualificationOwner: "mathematical-semantics" } }, f.transform, [f.parent], f.value), /qualification|owner|preserve/i);
  assert.throws(() => normalizeAnalyticalDerivationLineage({ ...lineageCandidate, output: { ...f.value, vector: { ...f.value.vector, locality: { ...f.value.vector.locality, level: "FLEET", localityRef: "fleet:alpha", localityRevision: "fleet:alpha:r1" } } } }, f.transform, [f.parent], f.value), /locality|preserve|lineage/i);
  assert.throws(() => normalizeAnalyticalAssociationDescriptor({ ...f.associationCandidate, causalRole: "CAUSE" }, f.definition, f.participants, f.evidence, f.uncertainty), /unexpected field causalRole/);
  assert.throws(() => normalizeAnalyticalAssociationDescriptor({ ...f.associationCandidate, authority: "DOMAIN_DECISION" }, f.definition, f.participants, f.evidence, f.uncertainty), /unexpected field authority/);
});

test("TASK-494 Product Proof is contract evidence only and makes no Production Readiness claim", () => {
  const f = fixture();
  const normalized = normalizeAnalyticalAssociationDescriptor(f.associationCandidate, f.definition, f.participants, f.evidence, f.uncertainty);
  assert.equal("productionReady" in normalized, false);
  assert.equal("runtimeAuthority" in normalized, false);
  assert.equal("causalAuthority" in normalized, false);
});

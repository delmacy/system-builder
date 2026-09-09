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
import { normalizeAnalyticalDerivationLineage } from "../../packages/contracts/mathematical-semantics/derivation.js";
import { normalizeAnalyticalAssociationDescriptor } from "../../packages/contracts/mathematical-semantics/association.js";
import { normalizeAnalyticalVectorBinding } from "../../packages/contracts/mathematical-semantics/vector.js";
import { normalizeAnalyticalValueQualification } from "../../packages/contracts/mathematical-semantics/uncertainty.js";
import {
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  type DefinitionRevisionRef,
} from "../../packages/contracts/semantic-substrate/index.js";

const analyticalRef = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "mathematical-semantics",
  semanticKind: "analytical-definition",
  canonicalRef: "analysis:task-494",
  definitionRef: "definition:task-494",
  revisionOwner: "mathematical-semantics",
  revisionDimension: "definition",
  revisionRef: "revision:task-494:r4",
} as const;

const sourceA = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "operations-domain",
  semanticKind: "observed-capability",
  canonicalRef: "capability:station-alpha:a",
  definitionRef: "definition:station-alpha:a",
  revisionOwner: "operations-domain",
  revisionDimension: "observation-schema",
  revisionRef: "revision:station-alpha:a:r7",
} as const;

const sourceB = {
  ...sourceA,
  canonicalRef: "capability:station-alpha:b",
  definitionRef: "definition:station-alpha:b",
  revisionRef: "revision:station-alpha:b:r3",
} as const;

const definition = normalizeAnalyticalDefinitionRevision({
  contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  ref: analyticalRef,
  kind: "RULE",
});

function qualification(
  sourceRevision: DefinitionRevisionRef,
  ref: string,
  epistemicState: "UNKNOWN" | "INCONCLUSIVE" | "PARTIAL",
) {
  const input = normalizeAnalyticalInputBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    inputRef: `input:${ref}`,
    producingAnalyticalRevision: definition.ref,
    sourceRevision,
    valueType: "VECTOR",
  }, definition.ref);
  const unit = normalizeAnalyticalUnitBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    valueRef: `value:${ref}`,
    producingAnalyticalRevision: definition.ref,
    sourceRevision,
    unit: {
      state: "KNOWN",
      unitRef: "unit:mps",
      unitRevision: "unit:mps:r2",
      dimension: { terms: [{ axis: "LENGTH", exponent: 1 }, { axis: "TIME", exponent: -1 }] },
    },
  }, input);
  const temporal = normalizeAnalyticalPrecisionTemporalBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    valueRef: unit.valueRef,
    producingAnalyticalRevision: definition.ref,
    sourceRevision,
    unit: unit.unit,
    precisionPolicy: {
      policyRef: "precision:task-494",
      policyRevision: "precision:task-494:r2",
      precision: 8,
      scale: 3,
      roundingMode: "HALF_EVEN",
    },
    temporalContext: {
      state: "WINDOW",
      start: "2026-09-09T09:00:00Z",
      end: "2026-09-09T09:05:00.125Z",
      anchor: {
        kind: "OBSERVATION",
        anchorRef: `observation:${ref}`,
        anchorRevision: `observation:${ref}:r5`,
      },
    },
  }, unit, { policyRef: "precision:task-494", policyRevision: "precision:task-494:r2" });
  const vector = normalizeAnalyticalVectorBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    shape: "VECTOR",
    vectorRef: `vector:${ref}`,
    qualifiedValue: temporal,
    basis: {
      basisRef: "basis:enu",
      basisRevision: "basis:enu:r2",
      dimension: 2,
      coordinateOrder: ["east", "north"],
    },
    coordinates: ["east", "north"],
    locality: {
      level: "STATION",
      localityOwner: "operations-domain",
      localityRef: "station:alpha",
      localityRevision: "station:alpha:r5",
    },
  }, temporal);
  return normalizeAnalyticalValueQualification({
    qualificationRef: `qualification:${ref}`,
    qualificationRevision: `qualification:${ref}:r2`,
    qualificationOwner: "operations-domain",
    epistemicState,
    vector,
    evidence: epistemicState === "PARTIAL" ? [{
      evidenceRef: `evidence:${ref}`,
      evidenceRevision: `evidence:${ref}:r8`,
      evidenceOwner: "operations-domain",
    }] : [],
    uncertainty: epistemicState === "PARTIAL" ? {
      state: "BOUNDED",
      uncertaintyRef: `uncertainty:${ref}`,
      uncertaintyRevision: `uncertainty:${ref}:r3`,
      uncertaintyOwner: "operations-domain",
    } : { state: "UNRESOLVED" },
    associationKind: "EVIDENCE_ASSOCIATION",
  }, vector);
}

function integratedFixture() {
  const qa = qualification(sourceA, "a", "PARTIAL");
  const qb = qualification(sourceB, "b", "PARTIAL");
  const expectedInputs = [
    { inputRef: "input:b", qualification: qb },
    { inputRef: "input:a", qualification: qa },
  ] as const;
  const envelopeCandidate = {
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    evaluationRef: "evaluation:task-494",
    definition,
    inputs: [...expectedInputs].reverse(),
  };
  const envelope = normalizeAnalyticalEvaluationEnvelope(envelopeCandidate, definition, expectedInputs);
  const resolved = normalizeAnalyticalEvaluationOutcome({
    kind: "RESOLVED",
    evaluation: envelope,
    value: qa,
  }, envelope, "RESOLVED", qa);
  const transform = {
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    transformRef: "transform:task-494",
    transformRevision: definition,
    transformOwner: "mathematical-semantics",
    kind: "DERIVATION" as const,
  };
  const parent = { parentRef: "parent:a", outcome: resolved };
  const lineageCandidate = {
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    derivationRef: "derivation:task-494",
    transform,
    sourceParentRef: parent.parentRef,
    parents: [parent],
    output: qa,
  };
  const lineage = normalizeAnalyticalDerivationLineage(lineageCandidate, transform, [parent], qa);
  const participants = [
    { participantRef: "participant:derived-a", qualification: lineage.output },
    { participantRef: "participant:b", qualification: qb },
  ] as const;
  const evidence = [{
    evidenceRef: "evidence:association:task-494",
    evidenceRevision: "evidence:association:task-494:r3",
    evidenceOwner: "operations-domain",
  }] as const;
  const uncertainty = {
    state: "BOUNDED",
    uncertaintyRef: "uncertainty:association:task-494",
    uncertaintyRevision: "uncertainty:association:task-494:r2",
    uncertaintyOwner: "operations-domain",
  } as const;
  const associationCandidate = {
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    associationRef: "association:task-494",
    kind: "CORRELATION",
    analyticalRevision: definition,
    participants,
    evidence,
    uncertainty,
  } as const;
  const association = normalizeAnalyticalAssociationDescriptor(
    associationCandidate,
    definition,
    participants,
    evidence,
    uncertainty,
  );
  return { qa, qb, expectedInputs, envelopeCandidate, envelope, resolved, transform, parent, lineageCandidate, lineage, participants, evidence, uncertainty, associationCandidate, association };
}

test("TASK-494 proves the integrated evaluation outcome derivation and correlation chain deterministically", () => {
  const fixture = integratedFixture();
  assert.deepEqual(fixture.envelope.inputs.map((input) => input.inputRef), ["input:a", "input:b"]);
  assert.equal(fixture.resolved.kind, "RESOLVED");
  assert.equal(fixture.lineage.output.qualificationOwner, "operations-domain");
  assert.equal(fixture.lineage.output.vector.qualifiedValue.sourceRevision.revisionRef, sourceA.revisionRef);
  assert.equal(fixture.lineage.output.vector.qualifiedValue.producingAnalyticalRevision.revisionRef, analyticalRef.revisionRef);
  assert.equal(fixture.lineage.output.vector.locality.localityRevision, "station:alpha:r5");
  assert.equal(fixture.association.kind, "CORRELATION");
  assert.deepEqual(
    normalizeAnalyticalEvaluationEnvelope({ ...fixture.envelopeCandidate, inputs: fixture.expectedInputs }, definition, fixture.expectedInputs),
    fixture.envelope,
  );
  assert.deepEqual(
    normalizeAnalyticalDerivationLineage(fixture.lineageCandidate, fixture.transform, [fixture.parent], fixture.qa),
    fixture.lineage,
  );
  assert.deepEqual(
    normalizeAnalyticalAssociationDescriptor(fixture.associationCandidate, definition, fixture.participants, fixture.evidence, fixture.uncertainty),
    fixture.association,
  );
});

test("TASK-494 keeps unresolved error UNKNOWN and INCONCLUSIVE explicit without defaults or masking", () => {
  const unknown = qualification(sourceA, "unknown", "UNKNOWN");
  const inconclusive = qualification(sourceB, "inconclusive", "INCONCLUSIVE");
  const expectedInputs = [
    { inputRef: "input:unknown", qualification: unknown },
    { inputRef: "input:inconclusive", qualification: inconclusive },
  ];
  const envelope = normalizeAnalyticalEvaluationEnvelope({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    evaluationRef: "evaluation:uncertain:task-494",
    definition,
    inputs: expectedInputs,
  }, definition, expectedInputs);
  assert.deepEqual(envelope.inputs.map((input) => input.qualification.epistemicState).sort(), ["INCONCLUSIVE", "UNKNOWN"]);

  const unresolved = normalizeAnalyticalEvaluationOutcome({
    kind: "UNRESOLVED",
    evaluation: envelope,
    reason: "required evidence is unresolved",
    evidence: [],
  }, envelope, "UNRESOLVED");
  const error = normalizeAnalyticalEvaluationOutcome({
    kind: "ERROR",
    evaluation: envelope,
    errorCode: "E_BOUNDED_EVALUATION",
    reason: "evaluation failed without producing a value",
    evidence: [],
  }, envelope, "ERROR");
  assert.equal(unresolved.kind, "UNRESOLVED");
  assert.equal(error.kind, "ERROR");
  assert.equal("value" in unresolved, false);
  assert.equal("value" in error, false);
  assert.throws(() => normalizeAnalyticalEvaluationOutcome({ ...error, kind: "UNRESOLVED" }, envelope, "ERROR"), /masked|substituted/);
});

test("TASK-494 adversarially rejects revision defaults lineage strengthening and causal authority", () => {
  const fixture = integratedFixture();

  assert.throws(() => normalizeAnalyticalEvaluationEnvelope({
    ...fixture.envelopeCandidate,
    definition: { ...definition, ref: { ...definition.ref, revisionRef: "latest" } },
  }, definition, fixture.expectedInputs), /historical revision/);
  assert.throws(() => normalizeAnalyticalEvaluationEnvelope({
    ...fixture.envelopeCandidate,
    inputs: [fixture.expectedInputs[0]],
  }, definition, fixture.expectedInputs), /explicit|missing|defaulted/);

  assert.throws(() => normalizeAnalyticalDerivationLineage({
    ...fixture.lineageCandidate,
    parents: [],
  }, fixture.transform, [fixture.parent], fixture.qa), /parent/);
  assert.throws(() => normalizeAnalyticalDerivationLineage({
    ...fixture.lineageCandidate,
    output: { ...fixture.qa, qualificationOwner: "mathematical-semantics" },
  }, fixture.transform, [fixture.parent], fixture.qa), /owner|qualification|preserve/);
  assert.throws(() => normalizeAnalyticalDerivationLineage({
    ...fixture.lineageCandidate,
    output: {
      ...fixture.qa,
      vector: {
        ...fixture.qa.vector,
        locality: {
          level: "FLEET",
          localityOwner: "operations-domain",
          localityRef: "fleet:alpha",
          localityRevision: "fleet:alpha:r1",
        },
      },
    },
  }, fixture.transform, [fixture.parent], fixture.qa), /locality|preserve|lineage/);

  assert.throws(() => normalizeAnalyticalAssociationDescriptor({
    ...fixture.associationCandidate,
    causalRole: "CAUSE",
  }, definition, fixture.participants, fixture.evidence, fixture.uncertainty), /unexpected field causalRole/);
  assert.throws(() => normalizeAnalyticalAssociationDescriptor({
    ...fixture.associationCandidate,
    authority: "DOMAIN_DECISION",
  }, definition, fixture.participants, fixture.evidence, fixture.uncertainty), /unexpected field authority/);
});

test("TASK-494 Product Proof is contract evidence and does not claim Production Readiness", () => {
  assert.equal("productionReadiness" in integratedFixture().association, false);
  assert.equal("runtimeAuthority" in integratedFixture().lineage, false);
});

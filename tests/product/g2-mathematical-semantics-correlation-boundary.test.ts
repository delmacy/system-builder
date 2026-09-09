import assert from "node:assert/strict";
import test from "node:test";
import {
  MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  normalizeAnalyticalDefinitionRevision,
  normalizeAnalyticalInputBinding,
  normalizeAnalyticalPrecisionTemporalBinding,
  normalizeAnalyticalUnitBinding,
} from "../../packages/contracts/mathematical-semantics/index.js";
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
  canonicalRef: "analysis:correlation",
  definitionRef: "definition:correlation",
  revisionOwner: "mathematical-semantics",
  revisionDimension: "definition",
  revisionRef: "revision:correlation:r4",
} as const;
const sourceA = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "operations-domain",
  semanticKind: "observed-capability",
  canonicalRef: "capability:a",
  definitionRef: "definition:a",
  revisionOwner: "operations-domain",
  revisionDimension: "observation-schema",
  revisionRef: "revision:a:r7",
} as const;
const sourceB = {
  ...sourceA,
  canonicalRef: "capability:b",
  definitionRef: "definition:b",
  revisionRef: "revision:b:r3",
} as const;

function qualification(sourceRevision: DefinitionRevisionRef, ref: string) {
  const definition = normalizeAnalyticalDefinitionRevision({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    ref: analyticalRef,
    kind: "MODEL",
  });
  const input = normalizeAnalyticalInputBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    inputRef: ref,
    producingAnalyticalRevision: definition.ref,
    sourceRevision,
    valueType: "VECTOR",
  }, definition.ref);
  const unit = normalizeAnalyticalUnitBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    valueRef: ref,
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
    valueRef: ref,
    producingAnalyticalRevision: definition.ref,
    sourceRevision,
    unit: unit.unit,
    precisionPolicy: {
      policyRef: "precision:correlation",
      policyRevision: "precision:correlation:r1",
      precision: 6,
      scale: 2,
      roundingMode: "HALF_EVEN",
    },
    temporalContext: {
      state: "INSTANT",
      at: "2026-09-09T10:00:00Z",
      anchor: {
        kind: "OBSERVATION",
        anchorRef: `observation:${ref}`,
        anchorRevision: `observation:${ref}:r1`,
      },
    },
  }, unit, { policyRef: "precision:correlation", policyRevision: "precision:correlation:r1" });
  const vector = normalizeAnalyticalVectorBinding({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    shape: "VECTOR",
    vectorRef: `vector:${ref}`,
    qualifiedValue: temporal,
    basis: {
      basisRef: "basis:scalar",
      basisRevision: "basis:scalar:r1",
      dimension: 1,
      coordinateOrder: ["scalar"],
    },
    coordinates: ["scalar"],
    locality: {
      level: "STATION",
      localityOwner: "operations-domain",
      localityRef: "station:alpha",
      localityRevision: "station:alpha:r2",
    },
  }, temporal);
  return normalizeAnalyticalValueQualification({
    qualificationRef: `qualification:${ref}`,
    qualificationRevision: `qualification:${ref}:r2`,
    qualificationOwner: "operations-domain",
    epistemicState: "PARTIAL",
    vector,
    evidence: [{
      evidenceRef: `evidence:${ref}`,
      evidenceRevision: `evidence:${ref}:r5`,
      evidenceOwner: "operations-domain",
    }],
    uncertainty: {
      state: "BOUNDED",
      uncertaintyRef: `uncertainty:${ref}`,
      uncertaintyRevision: `uncertainty:${ref}:r2`,
      uncertaintyOwner: "operations-domain",
    },
    associationKind: "CORRELATION",
  }, vector);
}

const analyticalRevision = normalizeAnalyticalDefinitionRevision({
  contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  ref: analyticalRef,
  kind: "MODEL",
});
const qa = qualification(sourceA, "a");
const qb = qualification(sourceB, "b");
const participants = [
  { participantRef: "participant:a", qualification: qa },
  { participantRef: "participant:b", qualification: qb },
] as const;
const evidence = [{
  evidenceRef: "evidence:association",
  evidenceRevision: "evidence:association:r8",
  evidenceOwner: "operations-domain",
}] as const;
const uncertainty = {
  state: "BOUNDED",
  uncertaintyRef: "uncertainty:association",
  uncertaintyRevision: "uncertainty:association:r3",
  uncertaintyOwner: "operations-domain",
} as const;

function candidate() {
  return {
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    associationRef: "association:a-b",
    kind: "CORRELATION",
    analyticalRevision,
    participants,
    evidence,
    uncertainty,
  } as const;
}

test("TASK-493 normalizes bounded correlation with exact participant, evidence and revision lineage", () => {
  const normalized = normalizeAnalyticalAssociationDescriptor(candidate(), analyticalRevision, participants, evidence, uncertainty);
  assert.equal(normalized.kind, "CORRELATION");
  assert.deepEqual(normalized.participants.map((p) => p.participantRef), ["participant:a", "participant:b"]);
  assert.deepEqual(normalized.participants[0]?.qualification.vector.qualifiedValue.sourceRevision, sourceA);
  assert.deepEqual(normalized.participants[1]?.qualification.vector.qualifiedValue.sourceRevision, sourceB);
});

test("TASK-493 rejects causal/authority fields, participant reorder and source revision substitution", () => {
  assert.throws(() => normalizeAnalyticalAssociationDescriptor({ ...candidate(), causalRole: "CAUSE" }, analyticalRevision, participants, evidence, uncertainty), /unexpected field causalRole/);
  assert.throws(() => normalizeAnalyticalAssociationDescriptor({ ...candidate(), authority: "DOMAIN_DECISION" }, analyticalRevision, participants, evidence, uncertainty), /unexpected field authority/);
  assert.throws(() => normalizeAnalyticalAssociationDescriptor({ ...candidate(), participants: [participants[1], participants[0]] }, analyticalRevision, participants, evidence, uncertainty), /order and identity/);
  const substituted = {
    ...candidate(),
    participants: [
      {
        ...participants[0],
        qualification: {
          ...participants[0].qualification,
          vector: {
            ...participants[0].qualification.vector,
            qualifiedValue: {
              ...participants[0].qualification.vector.qualifiedValue,
              sourceRevision: {
                ...participants[0].qualification.vector.qualifiedValue.sourceRevision,
                revisionRef: "revision:a:latest",
              },
            },
          },
        },
      },
      participants[1],
    ],
  };
  assert.throws(() => normalizeAnalyticalAssociationDescriptor(substituted, analyticalRevision, participants, evidence, uncertainty), /source revision|preserve|substitute/i);
});

test("TASK-493 rejects evidence, uncertainty and locality strengthening", () => {
  assert.throws(() => normalizeAnalyticalAssociationDescriptor({ ...candidate(), evidence: [{ ...evidence[0], evidenceRevision: "evidence:association:r9" }] }, analyticalRevision, participants, evidence, uncertainty), /evidence revisions/);
  assert.throws(() => normalizeAnalyticalAssociationDescriptor({ ...candidate(), uncertainty: { state: "NONE_DECLARED" } }, analyticalRevision, participants, evidence, uncertainty), /uncertainty cannot be strengthened/);
  const strengthened = {
    ...candidate(),
    participants: [
      {
        ...participants[0],
        qualification: {
          ...participants[0].qualification,
          vector: {
            ...participants[0].qualification.vector,
            locality: {
              ...participants[0].qualification.vector.locality,
              level: "FLEET",
            },
          },
        },
      },
      participants[1],
    ],
  };
  assert.throws(() => normalizeAnalyticalAssociationDescriptor(strengthened, analyticalRevision, participants, evidence, uncertainty), /locality|preserve|substitute/i);
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  assertCompatibleDimensions,
  normalizeAnalyticalInputBinding,
  normalizeAnalyticalUnitBinding,
  normalizeUnitReference,
} from "../../packages/contracts/mathematical-semantics/index.js";
import { SEMANTIC_SUBSTRATE_CONTRACT_VERSION } from "../../packages/contracts/semantic-substrate/index.js";

const analyticalRevision = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "mathematical-semantics",
  semanticKind: "analytical-definition",
  canonicalRef: "analysis:availability-risk",
  definitionRef: "definition:availability-risk",
  revisionOwner: "mathematical-semantics",
  revisionDimension: "definition",
  revisionRef: "revision:availability-risk:r1",
} as const;

const sourceRevision = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "operations-domain",
  semanticKind: "observed-capability",
  canonicalRef: "capability:station-alpha",
  definitionRef: "definition:station-alpha-availability",
  revisionOwner: "operations-domain",
  revisionDimension: "observation-schema",
  revisionRef: "revision:station-alpha:r7",
} as const;

const inputBinding = normalizeAnalyticalInputBinding(
  {
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    inputRef: "input:station-alpha-availability",
    producingAnalyticalRevision: analyticalRevision,
    sourceRevision,
    valueType: "NUMBER",
  },
  analyticalRevision,
);

const lengthUnit = {
  state: "KNOWN",
  unitRef: "unit:meter",
  unitRevision: "unit:meter:r1",
  dimension: { terms: [{ axis: "LENGTH", exponent: 1 }] },
} as const;

const timeUnit = {
  state: "KNOWN",
  unitRef: "unit:second",
  unitRevision: "unit:second:r1",
  dimension: { terms: [{ axis: "TIME", exponent: 1 }] },
} as const;

test("TASK-485 preserves unit/dimension semantics and source lineage", () => {
  const normalized = normalizeAnalyticalUnitBinding(
    {
      contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
      valueRef: "value:station-alpha-distance",
      producingAnalyticalRevision: analyticalRevision,
      sourceRevision,
      unit: lengthUnit,
    },
    inputBinding,
  );

  assert.equal(normalized.unit.state, "KNOWN");
  if (normalized.unit.state === "KNOWN") {
    assert.equal(normalized.unit.unitRef, "unit:meter");
    assert.equal(normalized.unit.unitRevision, "unit:meter:r1");
    assert.deepEqual(normalized.unit.dimension.terms, [{ axis: "LENGTH", exponent: 1 }]);
  }
  assert.equal(normalized.producingAnalyticalRevision.revisionRef, "revision:availability-risk:r1");
  assert.equal(normalized.sourceRevision.semanticOwner, "operations-domain");
  assert.equal(normalized.sourceRevision.revisionRef, "revision:station-alpha:r7");
});

test("TASK-485 rejects incompatible dimensions and label-based equivalence", () => {
  const meter = normalizeUnitReference(lengthUnit);
  const renamedMeter = normalizeUnitReference({
    ...lengthUnit,
    unitRef: "unit:distance-display-label",
  });
  const second = normalizeUnitReference(timeUnit);

  assert.doesNotThrow(() => assertCompatibleDimensions(meter, renamedMeter));
  assert.throws(() => assertCompatibleDimensions(meter, second), /dimensions are incompatible/);
});

test("TASK-485 distinguishes dimensionless from UNKNOWN and fails closed on unresolved compatibility", () => {
  const dimensionless = normalizeUnitReference({
    state: "KNOWN",
    unitRef: "unit:ratio",
    unitRevision: "unit:ratio:r1",
    dimension: { terms: [] },
  });
  const unknown = normalizeUnitReference({
    state: "UNKNOWN",
    reason: "source evidence does not establish a unit",
  });

  assert.equal(dimensionless.state, "KNOWN");
  assert.equal(unknown.state, "UNKNOWN");
  assert.throws(() => assertCompatibleDimensions(dimensionless, unknown), /unresolved/);
  assert.throws(
    () => normalizeUnitReference({ state: "UNKNOWN", reason: "missing", unitRef: "unit:ratio" }),
    /unexpected field unitRef/,
  );
});

test("TASK-485 rejects lineage loss and malformed dimensional signatures", () => {
  assert.throws(
    () =>
      normalizeAnalyticalUnitBinding(
        {
          contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
          valueRef: "value:station-alpha-distance",
          producingAnalyticalRevision: { ...analyticalRevision, revisionRef: "revision:availability-risk:r2" },
          sourceRevision,
          unit: lengthUnit,
        },
        inputBinding,
      ),
    /must preserve the analytical input producing revision/,
  );

  assert.throws(
    () =>
      normalizeAnalyticalUnitBinding(
        {
          contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
          valueRef: "value:station-alpha-distance",
          producingAnalyticalRevision: analyticalRevision,
          sourceRevision: { ...sourceRevision, revisionRef: "revision:station-alpha:r8" },
          unit: lengthUnit,
        },
        inputBinding,
      ),
    /must preserve the analytical input source revision/,
  );

  assert.throws(
    () =>
      normalizeUnitReference({
        state: "KNOWN",
        unitRef: "unit:bad",
        unitRevision: "unit:bad:r1",
        dimension: { terms: [{ axis: "LENGTH", exponent: 0 }] },
      }),
    /omit zero exponents/,
  );
});

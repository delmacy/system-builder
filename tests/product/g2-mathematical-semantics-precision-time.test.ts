import assert from "node:assert/strict";
import test from "node:test";
import {
  MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  normalizeAnalyticalInputBinding,
  normalizeAnalyticalPrecisionTemporalBinding,
  normalizeAnalyticalUnitBinding,
  normalizePrecisionPolicy,
  normalizeTemporalContext,
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

const unitBinding = normalizeAnalyticalUnitBinding(
  {
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    valueRef: "value:station-alpha-availability",
    producingAnalyticalRevision: analyticalRevision,
    sourceRevision,
    unit: {
      state: "KNOWN",
      unitRef: "unit:ratio",
      unitRevision: "unit:ratio:r1",
      dimension: { terms: [] },
    },
  },
  inputBinding,
);

const precisionPolicy = {
  policyRef: "precision-policy:availability",
  policyRevision: "precision-policy:availability:r3",
  precision: 5,
  scale: 2,
  roundingMode: "HALF_EVEN",
} as const;

const temporalWindow = {
  state: "WINDOW",
  start: "2026-09-01T00:00:00Z",
  end: "2026-09-08T00:00:00Z",
  startBoundary: "CLOSED",
  endBoundary: "OPEN",
  anchor: {
    kind: "OBSERVATION",
    anchorRef: "observation-window:station-alpha",
    anchorRevision: "observation-window:station-alpha:r2",
  },
} as const;

test("TASK-486 preserves precision, temporal qualification and predecessor lineage", () => {
  const normalized = normalizeAnalyticalPrecisionTemporalBinding(
    {
      contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
      valueRef: unitBinding.valueRef,
      producingAnalyticalRevision: analyticalRevision,
      sourceRevision,
      unit: unitBinding.unit,
      precisionPolicy,
      temporalContext: temporalWindow,
    },
    unitBinding,
    {
      policyRef: precisionPolicy.policyRef,
      policyRevision: precisionPolicy.policyRevision,
    },
  );

  assert.equal(normalized.precisionPolicy.roundingMode, "HALF_EVEN");
  assert.equal(normalized.precisionPolicy.scale, 2);
  assert.equal(normalized.temporalContext.state, "WINDOW");
  assert.equal(normalized.producingAnalyticalRevision.revisionRef, "revision:availability-risk:r1");
  assert.equal(normalized.sourceRevision.revisionRef, "revision:station-alpha:r7");
  assert.deepEqual(normalized.unit, unitBinding.unit);
});

test("TASK-486 requires explicit rounding and rejects latest-policy substitution", () => {
  assert.throws(
    () =>
      normalizePrecisionPolicy(
        {
          policyRef: precisionPolicy.policyRef,
          policyRevision: precisionPolicy.policyRevision,
          precision: 5,
          scale: 2,
        },
        { policyRef: precisionPolicy.policyRef, policyRevision: precisionPolicy.policyRevision },
      ),
    /missing field roundingMode/,
  );

  assert.throws(
    () =>
      normalizePrecisionPolicy(
        { ...precisionPolicy, policyRevision: "precision-policy:availability:r4" },
        { policyRef: precisionPolicy.policyRef, policyRevision: precisionPolicy.policyRevision },
      ),
    /historical policy revision/,
  );
});

test("TASK-486 keeps instant, window and UNKNOWN temporal contexts distinct", () => {
  const instant = normalizeTemporalContext({
    state: "INSTANT",
    at: "2026-09-08T12:30:00Z",
    anchor: {
      kind: "EVENT",
      anchorRef: "event:measurement-42",
      anchorRevision: "event:measurement-42:r1",
    },
  });
  const window = normalizeTemporalContext(temporalWindow);
  const unknown = normalizeTemporalContext({ state: "UNKNOWN", reason: "source omitted observation time" });

  assert.equal(instant.state, "INSTANT");
  assert.equal(window.state, "WINDOW");
  assert.equal(unknown.state, "UNKNOWN");
});

test("TASK-486 orders arbitrary fractional UTC precision chronologically without host truncation", () => {
  assert.doesNotThrow(() =>
    normalizeTemporalContext({
      ...temporalWindow,
      start: "2026-09-08T00:00:00Z",
      end: "2026-09-08T00:00:00.1Z",
    }),
  );

  assert.doesNotThrow(() =>
    normalizeTemporalContext({
      ...temporalWindow,
      start: "2026-09-08T00:00:00.0000000000000000001Z",
      end: "2026-09-08T00:00:00.0000000000000000002Z",
    }),
  );

  assert.throws(
    () =>
      normalizeTemporalContext({
        ...temporalWindow,
        start: "2026-09-08T00:00:00.1Z",
        end: "2026-09-08T00:00:00Z",
      }),
    /strictly before end/,
  );

  assert.throws(
    () =>
      normalizeTemporalContext({
        ...temporalWindow,
        start: "2026-09-08T00:00:00.1Z",
        end: "2026-09-08T00:00:00.10Z",
      }),
    /strictly before end/,
  );
});

test("TASK-486 rejects invalid UTC calendar instants instead of accepting format-only timestamps", () => {
  assert.throws(
    () =>
      normalizeTemporalContext({
        state: "INSTANT",
        at: "2026-02-30T00:00:00Z",
        anchor: {
          kind: "EVENT",
          anchorRef: "event:invalid-calendar-date",
          anchorRevision: "event:invalid-calendar-date:r1",
        },
      }),
    /valid UTC calendar instant/,
  );

  assert.throws(
    () =>
      normalizeTemporalContext({
        ...temporalWindow,
        end: "2026-09-08T24:00:00Z",
      }),
    /valid UTC calendar instant/,
  );
});

test("TASK-486 rejects ambiguous windows, temporal omission and lineage substitution", () => {
  assert.throws(
    () =>
      normalizeTemporalContext({
        state: "WINDOW",
        start: temporalWindow.start,
        end: temporalWindow.end,
        anchor: temporalWindow.anchor,
      }),
    /missing field startBoundary/,
  );

  assert.throws(
    () =>
      normalizeAnalyticalPrecisionTemporalBinding(
        {
          contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
          valueRef: unitBinding.valueRef,
          producingAnalyticalRevision: analyticalRevision,
          sourceRevision,
          unit: unitBinding.unit,
          precisionPolicy,
        },
        unitBinding,
        { policyRef: precisionPolicy.policyRef, policyRevision: precisionPolicy.policyRevision },
      ),
    /missing field temporalContext/,
  );

  assert.throws(
    () =>
      normalizeAnalyticalPrecisionTemporalBinding(
        {
          contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
          valueRef: unitBinding.valueRef,
          producingAnalyticalRevision: { ...analyticalRevision, revisionRef: "revision:availability-risk:r2" },
          sourceRevision,
          unit: unitBinding.unit,
          precisionPolicy,
          temporalContext: temporalWindow,
        },
        unitBinding,
        { policyRef: precisionPolicy.policyRef, policyRevision: precisionPolicy.policyRevision },
      ),
    /historical producing analytical revision/,
  );

  assert.throws(
    () =>
      normalizeAnalyticalPrecisionTemporalBinding(
        {
          contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
          valueRef: unitBinding.valueRef,
          producingAnalyticalRevision: analyticalRevision,
          sourceRevision,
          unit: {
            state: "KNOWN",
            unitRef: "unit:percent",
            unitRevision: "unit:percent:r1",
            dimension: { terms: [] },
          },
          precisionPolicy,
          temporalContext: temporalWindow,
        },
        unitBinding,
        { policyRef: precisionPolicy.policyRef, policyRevision: precisionPolicy.policyRevision },
      ),
    /preserve unit and dimension lineage/,
  );
});

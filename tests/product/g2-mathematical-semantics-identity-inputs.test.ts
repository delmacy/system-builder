import assert from "node:assert/strict";
import test from "node:test";
import {
  MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
  normalizeAnalyticalDefinitionRevision,
  normalizeAnalyticalInputBinding,
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

function binding() {
  return {
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    inputRef: "input:station-alpha-availability",
    producingAnalyticalRevision: analyticalRevision,
    sourceRevision,
    valueType: "NUMBER",
  } as const;
}

test("TASK-484 preserves revisioned analytical identity and exact external source ownership", () => {
  const definition = normalizeAnalyticalDefinitionRevision({
    contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION,
    ref: analyticalRevision,
    kind: "EXPRESSION",
  });
  const normalized = normalizeAnalyticalInputBinding(binding(), definition.ref);
  assert.equal(definition.ref.revisionRef, "revision:availability-risk:r1");
  assert.equal(normalized.producingAnalyticalRevision.revisionRef, definition.ref.revisionRef);
  assert.equal(normalized.sourceRevision.semanticOwner, "operations-domain");
  assert.equal(normalized.sourceRevision.revisionRef, "revision:station-alpha:r7");
  assert.equal(normalized.valueType, "NUMBER");
});

test("TASK-484 rejects latest-revision substitution and missing or ambiguous material coordinates", () => {
  const latest = { ...analyticalRevision, revisionRef: "revision:availability-risk:r2" };
  assert.throws(
    () => normalizeAnalyticalInputBinding({ ...binding(), producingAnalyticalRevision: latest }, analyticalRevision),
    /must exactly match/,
  );
  assert.throws(() => normalizeAnalyticalInputBinding({ ...binding(), sourceRevision: { ...sourceRevision, semanticOwner: " " } }, analyticalRevision), /non-empty string/);
  assert.throws(() => normalizeAnalyticalInputBinding({ ...binding(), valueType: "number" }, analyticalRevision), /must be one of/);
  assert.throws(() => normalizeAnalyticalDefinitionRevision({ contractVersion: MATHEMATICAL_SEMANTICS_CONTRACT_VERSION, ref: analyticalRevision, kind: "expression" }), /must be one of/);
});

test("TASK-484 refuses analytical-owner substitution for the source identity", () => {
  const collapsedSource = { ...analyticalRevision };
  assert.throws(
    () => normalizeAnalyticalInputBinding({ ...binding(), sourceRevision: collapsedSource }, analyticalRevision),
    /must remain independently identified/,
  );
});

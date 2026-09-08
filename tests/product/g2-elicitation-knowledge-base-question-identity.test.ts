import assert from "node:assert/strict";
import test from "node:test";
import {
  EKB_QUESTION_SEMANTIC_KIND,
  ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeQuestionDefinitionRevision,
  normalizeQuestionOccurrence,
} from "../../packages/contracts/elicitation-knowledge-base/index.js";

const owner = "capability:elicitation";
const canonicalRef = "question:asset-criticality";

function definitionRevision(revisionRef: string, text: string) {
  return normalizeQuestionDefinitionRevision({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    ref: {
      contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
      semanticOwner: owner,
      semanticKind: EKB_QUESTION_SEMANTIC_KIND,
      canonicalRef,
      definitionRef: "question:asset-criticality@definition",
      revisionOwner: owner,
      revisionDimension: "wording",
      revisionRef,
    },
    text,
  });
}

function occurrenceInput(definition = definitionRevision("r1", "Which assets are critical?")) {
  return {
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    ref: {
      occurrence: {
        contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
        semanticOwner: owner,
        semanticKind: EKB_QUESTION_SEMANTIC_KIND,
        canonicalRef,
        occurrenceRef: "occurrence:workshop-2026-09-08:asset-criticality",
      },
      producingDefinitionRevision: definition.ref,
    },
    definitionRevision: definition.ref,
    context: {
      contextRef: "workshop:2026-09-08",
      populationScope: "maintenance-operations",
      localityScope: "station:canoas",
    },
  };
}

function occurrence(definition = definitionRevision("r1", "Which assets are critical?")) {
  return normalizeQuestionOccurrence(occurrenceInput(definition));
}

test("question definition revision and occurrence have distinct immutable identities", () => {
  const definition = definitionRevision("r1", "Which assets are critical?");
  const asked = occurrence(definition);

  assert.equal(definition.ref.definitionRef, "question:asset-criticality@definition");
  assert.equal(asked.ref.occurrence.occurrenceRef, "occurrence:workshop-2026-09-08:asset-criticality");
  assert.equal(asked.ref.producingDefinitionRevision.revisionRef, "r1");
  assert.equal(asked.definitionRevision.revisionRef, "r1");
  assert.equal(asked.context.localityScope, "station:canoas");
  assert.ok(Object.isFrozen(definition));
  assert.ok(Object.isFrozen(asked));
  assert.ok(Object.isFrozen(asked.ref));
  assert.notDeepEqual(definition.ref, asked.ref);
});

test("historical occurrence remains pinned when current wording advances", () => {
  const historical = definitionRevision("r1", "Which assets are critical?");
  const current = definitionRevision("r2", "Which assets are mission critical?");
  const asked = occurrence(historical);

  assert.equal(asked.definitionRevision.revisionRef, "r1");
  assert.equal(asked.ref.producingDefinitionRevision.revisionRef, "r1");
  assert.equal(current.ref.revisionRef, "r2");
  assert.notEqual(asked.definitionRevision.revisionRef, current.ref.revisionRef);
});

test("current definition cannot be substituted into a historical occurrence identity", () => {
  const historical = definitionRevision("r1", "Which assets are critical?");
  const current = definitionRevision("r2", "Which assets are mission critical?");
  const historicalOccurrence = occurrenceInput(historical);

  assert.throws(
    () => normalizeQuestionOccurrence({ ...historicalOccurrence, definitionRevision: current.ref }),
    /must match producing revision pinned by occurrence identity/,
  );
});

test("owner, kind, canonical identity and required context fail closed", () => {
  const definition = definitionRevision("r1", "Which assets are critical?");
  const base = occurrenceInput(definition);

  assert.throws(
    () => normalizeQuestionOccurrence({ ...base, ref: { ...base.ref, occurrence: { ...base.ref.occurrence, semanticOwner: "capability:other" } } }),
    /owner must match/,
  );
  assert.throws(
    () => normalizeQuestionOccurrence({ ...base, ref: { ...base.ref, occurrence: { ...base.ref.occurrence, semanticKind: "domain-truth" } } }),
    /semanticKind/,
  );
  assert.throws(
    () => normalizeQuestionOccurrence({ ...base, ref: { ...base.ref, occurrence: { ...base.ref.occurrence, canonicalRef: "question:other" } } }),
    /canonical identity must match/,
  );
  assert.throws(() => normalizeQuestionOccurrence({ ...base, context: { ...base.context, localityScope: " " } }), /localityScope must be a non-empty string/);
});

test("equal labels cannot collapse owner-qualified revision and occurrence coordinates", () => {
  const definition = definitionRevision("shared", "shared");
  const asked = occurrence(definition);
  assert.equal(definition.ref.revisionRef, "shared");
  assert.notEqual(definition.ref.definitionRef, asked.ref.occurrence.occurrenceRef);
});

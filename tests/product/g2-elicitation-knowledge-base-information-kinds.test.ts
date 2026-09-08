import assert from "node:assert/strict";
import test from "node:test";
import {
  EKB_INFORMATION_KINDS,
  EKB_QUESTION_SEMANTIC_KIND,
  ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeInformationRecord,
} from "../../packages/contracts/elicitation-knowledge-base/index.js";

const owner = "capability:elicitation";

function questionOccurrence() {
  return {
    occurrence: {
      contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
      semanticOwner: owner,
      semanticKind: EKB_QUESTION_SEMANTIC_KIND,
      canonicalRef: "question:asset-criticality",
      occurrenceRef: "occurrence:workshop-2026-09-08:asset-criticality",
    },
    producingDefinitionRevision: {
      contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
      semanticOwner: owner,
      semanticKind: EKB_QUESTION_SEMANTIC_KIND,
      canonicalRef: "question:asset-criticality",
      definitionRef: "question:asset-criticality@definition",
      revisionOwner: owner,
      revisionDimension: "wording",
      revisionRef: "r1",
    },
  };
}

function recordInput(overrides: Record<string, unknown> = {}) {
  return {
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    recordRef: "ekb:record:1",
    questionOccurrence: questionOccurrence(),
    kind: "Claim",
    text: "Asset A is critical",
    origin: "Human",
    lineage: null,
    ...overrides,
  };
}

function authority() {
  return { ownerRef: "owner:maintenance", authorityRef: "decision-boundary:qualification:42" };
}

test("all twelve C1 information kinds remain distinct after normalization and round trip", () => {
  const normalized = EKB_INFORMATION_KINDS.map((kind, index) => normalizeInformationRecord(recordInput({ recordRef: `ekb:record:${index}`, kind })));
  assert.deepEqual(normalized.map((record) => record.kind), [...EKB_INFORMATION_KINDS]);
  const roundTripped = normalized.map((record) => normalizeInformationRecord(JSON.parse(JSON.stringify(record))));
  assert.deepEqual(roundTripped.map((record) => record.kind), [...EKB_INFORMATION_KINDS]);
  assert.equal(new Set(roundTripped.map((record) => record.kind)).size, 12);
});

test("Unknown is explicit and cannot collapse to empty, null, false or zero", () => {
  const unknown = normalizeInformationRecord(recordInput({ kind: "Unknown", text: "Value not established" }));
  assert.equal(unknown.kind, "Unknown");
  for (const text of ["", null, false, 0]) {
    assert.throws(() => normalizeInformationRecord(recordInput({ kind: "Unknown", text })), /information text must be a non-empty string/);
  }
});

test("Deferred and OutOfScope cannot collapse into undeclared resolved/not-applicable states", () => {
  assert.equal(normalizeInformationRecord(recordInput({ kind: "Deferred" })).kind, "Deferred");
  assert.equal(normalizeInformationRecord(recordInput({ kind: "OutOfScope" })).kind, "OutOfScope");
  assert.throws(() => normalizeInformationRecord(recordInput({ kind: "Resolved" })), /information kind must be one of/);
  assert.throws(() => normalizeInformationRecord(recordInput({ kind: "NotApplicable" })), /information kind must be one of/);
});

test("AI-originated material cannot promote itself from InferredCandidate", () => {
  assert.equal(normalizeInformationRecord(recordInput({ kind: "InferredCandidate", origin: "AI" })).kind, "InferredCandidate");
  assert.throws(() => normalizeInformationRecord(recordInput({ kind: "Requirement", origin: "AI" })), /must remain InferredCandidate/);
  const qualified = normalizeInformationRecord(recordInput({
    recordRef: "ekb:record:qualified",
    kind: "Requirement",
    origin: "AI",
    lineage: {
      transition: "Qualification",
      fromRecordRef: "ekb:record:ai-candidate",
      fromKind: "InferredCandidate",
      authority: authority(),
      reason: "Qualified by the owning maintenance decision boundary",
    },
  }));
  assert.equal(qualified.kind, "Requirement");
  assert.equal(qualified.lineage?.fromRecordRef, "ekb:record:ai-candidate");
  assert.equal(qualified.lineage?.authority.ownerRef, "owner:maintenance");
});

test("confidence, repetition or source-count hints cannot implicitly promote information", () => {
  for (const hint of [{ confidence: 1 }, { repetition: 50 }, { sourceCount: 99 }]) {
    assert.throws(
      () => normalizeInformationRecord({ ...recordInput({ kind: "InferredCandidate", origin: "AI" }), ...hint }),
      /information record has unexpected field/,
    );
  }
});

test("kind changes require explicit qualification and equal prose cannot substitute kind", () => {
  assert.throws(() => normalizeInformationRecord(recordInput({
    recordRef: "ekb:record:fact",
    kind: "Fact",
    text: "Asset A is critical",
    lineage: {
      transition: "Correction",
      fromRecordRef: "ekb:record:assumption",
      fromKind: "Assumption",
      authority: authority(),
      reason: "same prose, different asserted kind",
    },
  })), /kind changes require an explicit Qualification transition/);

  const qualified = normalizeInformationRecord(recordInput({
    recordRef: "ekb:record:fact-qualified",
    kind: "Fact",
    lineage: {
      transition: "Qualification",
      fromRecordRef: "ekb:record:assumption",
      fromKind: "Assumption",
      authority: authority(),
      reason: "owner-qualified evidence review",
    },
  }));
  assert.equal(qualified.lineage?.transition, "Qualification");
  assert.equal(qualified.lineage?.fromKind, "Assumption");
});

test("correction and supersession preserve prior record references rather than replacing history", () => {
  const original = normalizeInformationRecord(recordInput({ recordRef: "ekb:record:original", kind: "Claim" }));
  const corrected = normalizeInformationRecord(recordInput({
    recordRef: "ekb:record:corrected",
    kind: "Claim",
    text: "Asset A may be critical",
    lineage: {
      transition: "Correction",
      fromRecordRef: original.recordRef,
      fromKind: original.kind,
      authority: authority(),
      reason: "wording corrected without changing epistemic kind",
    },
  }));
  const superseded = normalizeInformationRecord(recordInput({
    recordRef: "ekb:record:successor",
    kind: "Claim",
    text: "Asset A is no longer classified as critical",
    lineage: {
      transition: "Supersession",
      fromRecordRef: corrected.recordRef,
      fromKind: corrected.kind,
      authority: authority(),
      reason: "new owner statement supersedes prior claim",
    },
  }));
  assert.equal(corrected.lineage?.fromRecordRef, original.recordRef);
  assert.equal(superseded.lineage?.fromRecordRef, corrected.recordRef);
  assert.equal(original.text, "Asset A is critical");
});

test("authority remains an external reference and is never inferred from EKB record content", () => {
  const qualified = normalizeInformationRecord(recordInput({
    recordRef: "ekb:record:decision",
    kind: "Decision",
    lineage: {
      transition: "Qualification",
      fromRecordRef: "ekb:record:claim",
      fromKind: "Claim",
      authority: authority(),
      reason: "external decision owner qualified the record",
    },
  }));
  assert.deepEqual(qualified.lineage?.authority, authority());
  assert.ok(Object.isFrozen(qualified));
  assert.ok(Object.isFrozen(qualified.lineage));
  assert.throws(() => normalizeInformationRecord(recordInput({
    kind: "Decision",
    lineage: {
      transition: "Qualification",
      fromRecordRef: "ekb:record:claim",
      fromKind: "Claim",
      authority: { ownerRef: "", authorityRef: "" },
      reason: "invalid authority",
    },
  })), /authority.ownerRef must be a non-empty string/);
});

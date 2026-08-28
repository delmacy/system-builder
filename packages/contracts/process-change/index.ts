import {
  isCanonicalDecisionBoundaryVerificationResult,
  type DecisionBoundaryVerificationResult,
} from "@system-builder/contracts/decision-boundary";
import { normalizeProcessRevisionIdentity, type ProcessRevisionIdentity } from "@system-builder/contracts/process-versioning";

export const PROCESS_CHANGE_CONTRACT_VERSION = "1.0.0" as const;
export const PROCESS_CHANGE_CLASSIFICATIONS = ["breaking", "non-breaking", "not-applicable"] as const;
export type ProcessChangeClassification = (typeof PROCESS_CHANGE_CLASSIFICATIONS)[number];

export type ProcessSemanticSnapshotEntry = Readonly<{
  semanticRef: string;
  evidenceRef: string;
}>;

export type ProcessSemanticChangeDiff = Readonly<{
  contractVersion: typeof PROCESS_CHANGE_CONTRACT_VERSION;
  artifactRef: string;
  fromRevisionRef: string;
  toRevisionRef: string;
  addedSemanticRefs: readonly string[];
  removedSemanticRefs: readonly string[];
  changedSemanticRefs: readonly string[];
}>;

export type ProcessSemanticChangeClassificationEvidence = Readonly<{
  contractVersion: typeof PROCESS_CHANGE_CONTRACT_VERSION;
  diffRef: string;
  artifactRef: string;
  fromRevisionRef: string;
  toRevisionRef: string;
  classification: ProcessChangeClassification;
  classifierDecisionId: string;
  classifierCategory: "deterministic" | "human-decision" | "probabilistic";
  classifierReference: Readonly<{ kind: "invariant" | "authority" | "inference"; ref: string }>;
  evidenceRefs: readonly string[];
}>;

export type ProcessSemanticChangeRationaleEvidence = Readonly<{
  contractVersion: typeof PROCESS_CHANGE_CONTRACT_VERSION;
  artifactRef: string;
  fromRevisionRef: string;
  toRevisionRef: string;
  diffRef: string;
  classificationRef: string;
  reasonRef: string;
  evidenceRefs: readonly string[];
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord, fields: readonly string[], label: string): void {
  for (const key of Object.keys(record)) {
    if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  }
  for (const key of fields) {
    if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
  }
}

function nonEmpty(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0 || /\s/.test(value.trim())) {
    throw new Error(`${field} must be a non-empty token`);
  }
  return value.trim();
}

function normalizeSnapshot(input: unknown, label: string): readonly ProcessSemanticSnapshotEntry[] {
  if (!Array.isArray(input)) throw new Error(`${label} must be an array`);

  const seen = new Set<string>();
  const normalized = input.map((value, index) => {
    const record = asRecord(value, `${label} entry ${index + 1}`);
    assertExactFields(record, ["semanticRef", "evidenceRef"], `${label} entry ${index + 1}`);
    const semanticRef = nonEmpty(record.semanticRef, "semanticRef");
    const evidenceRef = nonEmpty(record.evidenceRef, "evidenceRef");
    if (seen.has(semanticRef)) throw new Error(`${label} contains duplicate semanticRef ${semanticRef}`);
    seen.add(semanticRef);
    return Object.freeze({ semanticRef, evidenceRef });
  });

  normalized.sort((left, right) => left.semanticRef.localeCompare(right.semanticRef));
  return Object.freeze(normalized);
}

function normalizeRefList(input: unknown, label: string): readonly string[] {
  if (!Array.isArray(input) || input.length === 0) throw new Error(`${label} must be a non-empty array`);
  const refs = input.map((value, index) => nonEmpty(value, `${label}[${index}]`));
  if (new Set(refs).size !== refs.length) throw new Error(`${label} contains duplicate reference`);
  refs.sort((left, right) => left.localeCompare(right));
  return Object.freeze(refs);
}

function normalizeSemanticRefList(input: unknown, label: string): readonly string[] {
  if (!Array.isArray(input)) throw new Error(`${label} must be an array`);
  const refs = input.map((value, index) => nonEmpty(value, `${label}[${index}]`));
  if (new Set(refs).size !== refs.length) throw new Error(`${label} contains duplicate reference`);
  refs.sort((left, right) => left.localeCompare(right));
  return Object.freeze(refs);
}

function normalizeSemanticChangeDiff(input: unknown): ProcessSemanticChangeDiff {
  const record = asRecord(input, "semanticDiff");
  assertExactFields(
    record,
    [
      "contractVersion",
      "artifactRef",
      "fromRevisionRef",
      "toRevisionRef",
      "addedSemanticRefs",
      "removedSemanticRefs",
      "changedSemanticRefs",
    ],
    "semanticDiff",
  );
  if (record.contractVersion !== PROCESS_CHANGE_CONTRACT_VERSION) throw new Error("semanticDiff has unsupported contractVersion");
  return Object.freeze({
    contractVersion: PROCESS_CHANGE_CONTRACT_VERSION,
    artifactRef: nonEmpty(record.artifactRef, "semanticDiff.artifactRef"),
    fromRevisionRef: nonEmpty(record.fromRevisionRef, "semanticDiff.fromRevisionRef"),
    toRevisionRef: nonEmpty(record.toRevisionRef, "semanticDiff.toRevisionRef"),
    addedSemanticRefs: normalizeSemanticRefList(record.addedSemanticRefs, "semanticDiff.addedSemanticRefs"),
    removedSemanticRefs: normalizeSemanticRefList(record.removedSemanticRefs, "semanticDiff.removedSemanticRefs"),
    changedSemanticRefs: normalizeSemanticRefList(record.changedSemanticRefs, "semanticDiff.changedSemanticRefs"),
  });
}

function assertOrderedSameArtifactPredecessor(
  fromRevision: ProcessRevisionIdentity,
  toRevision: ProcessRevisionIdentity,
): void {
  if (fromRevision.artifactRef !== toRevision.artifactRef) {
    throw new Error("semantic diff revisions must belong to the same artifact");
  }
  if (toRevision.revisionNumber !== fromRevision.revisionNumber + 1) {
    throw new Error("semantic diff revisions must be consecutive and ordered");
  }
  if (toRevision.previousRevisionRef !== fromRevision.revisionRef) {
    throw new Error("semantic diff toRevision must reference fromRevision as its canonical predecessor");
  }
}

export function calculateProcessSemanticChangeDiff(input: unknown): ProcessSemanticChangeDiff {
  const record = asRecord(input, "process semantic change diff input");
  assertExactFields(
    record,
    ["fromRevision", "toRevision", "fromSnapshot", "toSnapshot"],
    "process semantic change diff input",
  );

  const fromRevision = normalizeProcessRevisionIdentity(record.fromRevision);
  const toRevision = normalizeProcessRevisionIdentity(record.toRevision);
  assertOrderedSameArtifactPredecessor(fromRevision, toRevision);

  const fromSnapshot = normalizeSnapshot(record.fromSnapshot, "fromSnapshot");
  const toSnapshot = normalizeSnapshot(record.toSnapshot, "toSnapshot");
  const fromByRef = new Map(fromSnapshot.map((entry) => [entry.semanticRef, entry] as const));
  const toByRef = new Map(toSnapshot.map((entry) => [entry.semanticRef, entry] as const));

  const addedSemanticRefs = toSnapshot
    .filter((entry) => !fromByRef.has(entry.semanticRef))
    .map((entry) => entry.semanticRef);
  const removedSemanticRefs = fromSnapshot
    .filter((entry) => !toByRef.has(entry.semanticRef))
    .map((entry) => entry.semanticRef);
  const changedSemanticRefs = toSnapshot
    .filter((entry) => {
      const previous = fromByRef.get(entry.semanticRef);
      return previous !== undefined && previous.evidenceRef !== entry.evidenceRef;
    })
    .map((entry) => entry.semanticRef);

  return Object.freeze({
    contractVersion: PROCESS_CHANGE_CONTRACT_VERSION,
    artifactRef: fromRevision.artifactRef,
    fromRevisionRef: fromRevision.revisionRef,
    toRevisionRef: toRevision.revisionRef,
    addedSemanticRefs: Object.freeze(addedSemanticRefs),
    removedSemanticRefs: Object.freeze(removedSemanticRefs),
    changedSemanticRefs: Object.freeze(changedSemanticRefs),
  });
}

export function normalizeProcessSemanticChangeClassificationEvidence(input: unknown): ProcessSemanticChangeClassificationEvidence {
  const record = asRecord(input, "process semantic change classification evidence");
  assertExactFields(
    record,
    ["diffRef", "semanticDiff", "classification", "classifierDecision", "evidenceRefs"],
    "process semantic change classification evidence",
  );

  const diffRef = nonEmpty(record.diffRef, "diffRef");
  const semanticDiff = normalizeSemanticChangeDiff(record.semanticDiff);
  if (!PROCESS_CHANGE_CLASSIFICATIONS.includes(record.classification as ProcessChangeClassification)) {
    throw new Error("classification must be breaking, non-breaking or not-applicable");
  }

  const classifierDecision = record.classifierDecision as DecisionBoundaryVerificationResult;
  if (!isCanonicalDecisionBoundaryVerificationResult(classifierDecision)) {
    throw new Error("classifierDecision must be a canonical Decision Boundary verification result");
  }
  if (classifierDecision.status !== "valid") {
    throw new Error("classifierDecision must be valid classification provenance");
  }

  return Object.freeze({
    contractVersion: PROCESS_CHANGE_CONTRACT_VERSION,
    diffRef,
    artifactRef: semanticDiff.artifactRef,
    fromRevisionRef: semanticDiff.fromRevisionRef,
    toRevisionRef: semanticDiff.toRevisionRef,
    classification: record.classification as ProcessChangeClassification,
    classifierDecisionId: classifierDecision.decisionId,
    classifierCategory: classifierDecision.category,
    classifierReference: Object.freeze({ ...classifierDecision.reference }),
    evidenceRefs: normalizeRefList(record.evidenceRefs, "evidenceRefs"),
  });
}

function sameSemanticDiff(left: ProcessSemanticChangeDiff, right: ProcessSemanticChangeDiff): boolean {
  return (
    left.contractVersion === right.contractVersion &&
    left.artifactRef === right.artifactRef &&
    left.fromRevisionRef === right.fromRevisionRef &&
    left.toRevisionRef === right.toRevisionRef &&
    left.addedSemanticRefs.join("\u0000") === right.addedSemanticRefs.join("\u0000") &&
    left.removedSemanticRefs.join("\u0000") === right.removedSemanticRefs.join("\u0000") &&
    left.changedSemanticRefs.join("\u0000") === right.changedSemanticRefs.join("\u0000")
  );
}

export function normalizeProcessSemanticChangeRationaleEvidence(input: unknown): ProcessSemanticChangeRationaleEvidence {
  const record = asRecord(input, "process semantic change rationale evidence");
  assertExactFields(
    record,
    ["diffRef", "semanticDiff", "classificationRef", "classificationEvidence", "reasonRef", "evidenceRefs"],
    "process semantic change rationale evidence",
  );

  const diffRef = nonEmpty(record.diffRef, "diffRef");
  const semanticDiff = normalizeSemanticChangeDiff(record.semanticDiff);
  const classificationRef = nonEmpty(record.classificationRef, "classificationRef");
  const classificationInput = asRecord(record.classificationEvidence, "classificationEvidence");
  const classificationEvidence = normalizeProcessSemanticChangeClassificationEvidence(classificationInput);
  const classificationDiff = normalizeSemanticChangeDiff(classificationInput.semanticDiff);

  if (classificationEvidence.diffRef !== diffRef) {
    throw new Error("classification evidence diffRef must match rationale diffRef");
  }
  if (!sameSemanticDiff(classificationDiff, semanticDiff)) {
    throw new Error("classification evidence must bind the exact semantic diff");
  }
  if (
    classificationEvidence.artifactRef !== semanticDiff.artifactRef ||
    classificationEvidence.fromRevisionRef !== semanticDiff.fromRevisionRef ||
    classificationEvidence.toRevisionRef !== semanticDiff.toRevisionRef
  ) {
    throw new Error("classification evidence revision endpoints must match semantic diff");
  }

  return Object.freeze({
    contractVersion: PROCESS_CHANGE_CONTRACT_VERSION,
    artifactRef: semanticDiff.artifactRef,
    fromRevisionRef: semanticDiff.fromRevisionRef,
    toRevisionRef: semanticDiff.toRevisionRef,
    diffRef,
    classificationRef,
    reasonRef: nonEmpty(record.reasonRef, "reasonRef"),
    evidenceRefs: normalizeRefList(record.evidenceRefs, "evidenceRefs"),
  });
}

import { normalizeProcessRevisionIdentity, type ProcessRevisionIdentity } from "@system-builder/contracts/process-versioning";

export const PROCESS_CHANGE_CONTRACT_VERSION = "1.0.0" as const;

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
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
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

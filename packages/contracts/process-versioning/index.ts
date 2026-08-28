export const PROCESS_VERSION_IDENTITY_VERSION = "1.0.0" as const;

export type ProcessArtifactIdentity = Readonly<{
  contractVersion: typeof PROCESS_VERSION_IDENTITY_VERSION;
  artifactRef: string;
}>;

export type ProcessRevisionIdentity = Readonly<{
  contractVersion: typeof PROCESS_VERSION_IDENTITY_VERSION;
  artifactRef: string;
  revisionRef: string;
  revisionNumber: number;
  previousRevisionRef: string | null;
}>;

export type ProcessRevisionPublicationEvidence = Readonly<{
  contractVersion: typeof PROCESS_VERSION_IDENTITY_VERSION;
  artifactRef: string;
  revisionRef: string;
  revisionNumber: number;
  previousRevisionRef: string | null;
  immutableContentRef: string;
}>;

export type PublishedRevisionGuardResult = Readonly<{
  status: "idempotent";
  revisionRef: string;
  immutableContentRef: string;
}>;

export type ProcessRevisionLifecycleState = "active" | "deprecated" | "archived";

export type ProcessRevisionLifecycleDescriptor = Readonly<{
  contractVersion: typeof PROCESS_VERSION_IDENTITY_VERSION;
  artifactRef: string;
  revisionRef: string;
  revisionNumber: number;
  previousRevisionRef: string | null;
  lifecycleState: ProcessRevisionLifecycleState;
  supersedesRevisionRef: string | null;
}>;

export type ProcessRevisionLineageResult = Readonly<{
  artifactRef: string;
  revisionRefs: readonly string[];
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

function version(value: unknown): typeof PROCESS_VERSION_IDENTITY_VERSION {
  if (value !== PROCESS_VERSION_IDENTITY_VERSION) {
    throw new Error(`unsupported process version identity contract version: ${String(value)}`);
  }
  return PROCESS_VERSION_IDENTITY_VERSION;
}

function lifecycleState(value: unknown): ProcessRevisionLifecycleState {
  if (value !== "active" && value !== "deprecated" && value !== "archived") {
    throw new Error(`unsupported process revision lifecycle state: ${String(value)}`);
  }
  return value;
}

export function normalizeProcessArtifactIdentity(input: unknown): ProcessArtifactIdentity {
  const record = asRecord(input, "process artifact identity");
  assertExactFields(record, ["contractVersion", "artifactRef"], "process artifact identity");
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    artifactRef: nonEmpty(record.artifactRef, "artifactRef"),
  });
}

export function normalizeProcessRevisionIdentity(input: unknown): ProcessRevisionIdentity {
  const record = asRecord(input, "process revision identity");
  assertExactFields(
    record,
    ["contractVersion", "artifactRef", "revisionRef", "revisionNumber", "previousRevisionRef"],
    "process revision identity",
  );
  const artifactRef = nonEmpty(record.artifactRef, "artifactRef");
  const revisionRef = nonEmpty(record.revisionRef, "revisionRef");
  if (artifactRef === revisionRef) throw new Error("artifactRef and revisionRef must be distinct");
  if (!Number.isSafeInteger(record.revisionNumber) || (record.revisionNumber as number) < 1) {
    throw new Error("revisionNumber must be a positive safe integer");
  }
  let previousRevisionRef: string | null = null;
  if (record.previousRevisionRef !== null) {
    previousRevisionRef = nonEmpty(record.previousRevisionRef, "previousRevisionRef");
    if (previousRevisionRef === revisionRef) throw new Error("previousRevisionRef must differ from revisionRef");
  }
  if ((record.revisionNumber as number) === 1 && previousRevisionRef !== null) {
    throw new Error("first revision cannot declare previousRevisionRef");
  }
  if ((record.revisionNumber as number) > 1 && previousRevisionRef === null) {
    throw new Error("successor revision must declare previousRevisionRef");
  }
  return Object.freeze({
    contractVersion: version(record.contractVersion),
    artifactRef,
    revisionRef,
    revisionNumber: record.revisionNumber as number,
    previousRevisionRef,
  });
}

export function normalizeProcessRevisionPublicationEvidence(
  input: unknown,
): ProcessRevisionPublicationEvidence {
  const record = asRecord(input, "process revision publication evidence");
  assertExactFields(
    record,
    [
      "contractVersion",
      "artifactRef",
      "revisionRef",
      "revisionNumber",
      "previousRevisionRef",
      "immutableContentRef",
    ],
    "process revision publication evidence",
  );
  const revision = normalizeProcessRevisionIdentity({
    contractVersion: record.contractVersion,
    artifactRef: record.artifactRef,
    revisionRef: record.revisionRef,
    revisionNumber: record.revisionNumber,
    previousRevisionRef: record.previousRevisionRef,
  });
  return Object.freeze({
    ...revision,
    immutableContentRef: nonEmpty(record.immutableContentRef, "immutableContentRef"),
  });
}

export function guardImmutablePublishedRevision(
  published: unknown,
  attempted: unknown,
): PublishedRevisionGuardResult {
  const canonicalPublished = normalizeProcessRevisionPublicationEvidence(published);
  const canonicalAttempted = normalizeProcessRevisionPublicationEvidence(attempted);
  const immutableFields: readonly (keyof ProcessRevisionPublicationEvidence)[] = [
    "contractVersion",
    "artifactRef",
    "revisionRef",
    "revisionNumber",
    "previousRevisionRef",
    "immutableContentRef",
  ];
  for (const field of immutableFields) {
    if (canonicalPublished[field] !== canonicalAttempted[field]) {
      throw new Error(`published revision overwrite conflict on ${field}`);
    }
  }
  return Object.freeze({
    status: "idempotent",
    revisionRef: canonicalPublished.revisionRef,
    immutableContentRef: canonicalPublished.immutableContentRef,
  });
}

export function normalizeProcessRevisionLifecycleDescriptor(
  input: unknown,
): ProcessRevisionLifecycleDescriptor {
  const record = asRecord(input, "process revision lifecycle descriptor");
  assertExactFields(
    record,
    [
      "contractVersion",
      "artifactRef",
      "revisionRef",
      "revisionNumber",
      "previousRevisionRef",
      "lifecycleState",
      "supersedesRevisionRef",
    ],
    "process revision lifecycle descriptor",
  );
  const revision = normalizeProcessRevisionIdentity({
    contractVersion: record.contractVersion,
    artifactRef: record.artifactRef,
    revisionRef: record.revisionRef,
    revisionNumber: record.revisionNumber,
    previousRevisionRef: record.previousRevisionRef,
  });
  let supersedesRevisionRef: string | null = null;
  if (record.supersedesRevisionRef !== null) {
    supersedesRevisionRef = nonEmpty(record.supersedesRevisionRef, "supersedesRevisionRef");
    if (supersedesRevisionRef === revision.revisionRef) {
      throw new Error("supersedesRevisionRef must differ from revisionRef");
    }
    if (revision.revisionNumber === 1) {
      throw new Error("first revision cannot supersede another revision");
    }
  }
  return Object.freeze({
    ...revision,
    lifecycleState: lifecycleState(record.lifecycleState),
    supersedesRevisionRef,
  });
}

export function validateProcessRevisionLineage(input: unknown): ProcessRevisionLineageResult {
  if (!Array.isArray(input) || input.length === 0) {
    throw new Error("process revision lineage must be a non-empty array");
  }

  const entries = input.map((value, index) => {
    const record = asRecord(value, `process revision lineage entry ${index + 1}`);
    assertExactFields(record, ["publication", "lifecycle"], `process revision lineage entry ${index + 1}`);
    const publication = normalizeProcessRevisionPublicationEvidence(record.publication);
    const lifecycle = normalizeProcessRevisionLifecycleDescriptor(record.lifecycle);
    const identityFields: readonly (keyof ProcessRevisionIdentity)[] = [
      "contractVersion",
      "artifactRef",
      "revisionRef",
      "revisionNumber",
      "previousRevisionRef",
    ];
    for (const field of identityFields) {
      if (publication[field] !== lifecycle[field]) {
        throw new Error(`lineage publication/lifecycle conflict on ${field}`);
      }
    }
    return { publication, lifecycle };
  }).sort((left, right) => left.publication.revisionNumber - right.publication.revisionNumber);

  const artifactRef = entries[0]!.publication.artifactRef;
  const seenRevisionRefs = new Set<string>();
  const seenContentRefs = new Map<string, string>();

  for (let index = 0; index < entries.length; index += 1) {
    const current = entries[index]!;
    const { publication, lifecycle } = current;
    if (publication.artifactRef !== artifactRef) {
      throw new Error("lineage contains cross-artifact revision");
    }
    if (seenRevisionRefs.has(publication.revisionRef)) {
      const priorContentRef = seenContentRefs.get(publication.revisionRef);
      if (priorContentRef !== publication.immutableContentRef) {
        throw new Error("lineage contains conflicting immutable publication evidence");
      }
      throw new Error("lineage contains duplicate revisionRef");
    }
    if (publication.revisionNumber !== index + 1) {
      throw new Error("lineage revision numbers must be contiguous from 1");
    }
    if (index === 0) {
      if (publication.previousRevisionRef !== null || lifecycle.supersedesRevisionRef !== null) {
        throw new Error("lineage first revision cannot reference a predecessor");
      }
    } else {
      const previous = entries[index - 1]!;
      if (publication.previousRevisionRef !== previous.publication.revisionRef) {
        throw new Error("lineage previousRevisionRef must reference the immediately preceding revision");
      }
      if (
        lifecycle.supersedesRevisionRef !== null &&
        lifecycle.supersedesRevisionRef !== previous.publication.revisionRef
      ) {
        throw new Error("lineage supersedesRevisionRef must reference the immediately preceding revision");
      }
      if (lifecycle.supersedesRevisionRef !== null && previous.lifecycle.lifecycleState === "active") {
        throw new Error("lineage cannot supersede a revision that remains active");
      }
    }
    seenRevisionRefs.add(publication.revisionRef);
    seenContentRefs.set(publication.revisionRef, publication.immutableContentRef);
  }

  return Object.freeze({
    artifactRef,
    revisionRefs: Object.freeze(entries.map((entry) => entry.publication.revisionRef)),
  });
}

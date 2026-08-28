import {
  guardImmutablePublishedRevision,
  normalizeProcessArtifactIdentity,
  normalizeProcessRevisionIdentity,
  normalizeProcessRevisionLifecycleDescriptor,
  normalizeProcessRevisionPublicationEvidence,
  type ProcessRevisionLifecycleState,
} from "@system-builder/contracts/process-versioning";

export const CATALOG_PROCESS_REVISION_ADMISSION_VERSION = "1.0.0" as const;

export type CatalogProcessRevisionAdmissionInput = Readonly<{
  artifact: unknown;
  revision: unknown;
  publication: unknown;
  lifecycle: unknown;
}>;

export type CatalogProcessRevisionAdmission = Readonly<{
  contractVersion: typeof CATALOG_PROCESS_REVISION_ADMISSION_VERSION;
  status: "admitted";
  artifactRef: string;
  revisionRef: string;
  revisionNumber: number;
  previousRevisionRef: string | null;
  immutableContentRef: string;
  lifecycleState: ProcessRevisionLifecycleState;
  supersedesRevisionRef: string | null;
}>;

export type CatalogProcessRevisionReadmission = Readonly<{
  status: "idempotent";
  revisionRef: string;
  immutableContentRef: string;
  admission: CatalogProcessRevisionAdmission;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function assertExactKeys(value: unknown, keys: readonly string[], label: string): void {
  const record = asRecord(value, label);
  for (const key of Object.keys(record)) {
    if (!keys.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  }
  for (const key of keys) {
    if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
  }
}

function assertRevisionTruthMatches(
  revision: ReturnType<typeof normalizeProcessRevisionIdentity>,
  candidate: ReturnType<
    typeof normalizeProcessRevisionPublicationEvidence | typeof normalizeProcessRevisionLifecycleDescriptor
  >,
  label: string,
): void {
  const fields = ["artifactRef", "revisionRef", "revisionNumber", "previousRevisionRef"] as const;
  for (const field of fields) {
    if (revision[field] !== candidate[field]) {
      throw new Error(`${label} conflicts with canonical revision identity on ${field}`);
    }
  }
}

export function admitCatalogProcessRevision(
  input: CatalogProcessRevisionAdmissionInput,
): CatalogProcessRevisionAdmission {
  assertExactKeys(input, ["artifact", "revision", "publication", "lifecycle"], "catalog process revision admission input");

  const artifact = normalizeProcessArtifactIdentity(input.artifact);
  const revision = normalizeProcessRevisionIdentity(input.revision);
  const publication = normalizeProcessRevisionPublicationEvidence(input.publication);
  const lifecycle = normalizeProcessRevisionLifecycleDescriptor(input.lifecycle);

  if (artifact.artifactRef !== revision.artifactRef) {
    throw new Error("catalog process revision artifact conflicts with canonical revision identity");
  }
  assertRevisionTruthMatches(revision, publication, "catalog process revision publication");
  assertRevisionTruthMatches(revision, lifecycle, "catalog process revision lifecycle");

  return Object.freeze({
    contractVersion: CATALOG_PROCESS_REVISION_ADMISSION_VERSION,
    status: "admitted",
    artifactRef: revision.artifactRef,
    revisionRef: revision.revisionRef,
    revisionNumber: revision.revisionNumber,
    previousRevisionRef: revision.previousRevisionRef,
    immutableContentRef: publication.immutableContentRef,
    lifecycleState: lifecycle.lifecycleState,
    supersedesRevisionRef: lifecycle.supersedesRevisionRef,
  });
}

export function readmitCatalogProcessRevision(
  published: CatalogProcessRevisionAdmissionInput,
  attempted: CatalogProcessRevisionAdmissionInput,
): CatalogProcessRevisionReadmission {
  const publishedAdmission = admitCatalogProcessRevision(published);
  const attemptedAdmission = admitCatalogProcessRevision(attempted);
  const immutable = guardImmutablePublishedRevision(published.publication, attempted.publication);

  if (publishedAdmission.artifactRef !== attemptedAdmission.artifactRef) {
    throw new Error("catalog process revision overwrite conflicts with canonical artifact identity");
  }
  if (publishedAdmission.revisionRef !== attemptedAdmission.revisionRef) {
    throw new Error("catalog process revision overwrite conflicts with canonical revision identity");
  }

  return Object.freeze({
    status: immutable.status,
    revisionRef: immutable.revisionRef,
    immutableContentRef: immutable.immutableContentRef,
    admission: attemptedAdmission,
  });
}

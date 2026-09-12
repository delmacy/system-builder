export const STORAGE_IDENTITY_CONTRACT_VERSION = "1.0.0" as const;

export type StorageObjectKind = "DOCUMENT" | "MEDIA" | "OBJECT";
export type StorageEvidenceCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type StorageCurrentnessState = "CURRENT" | "STALE" | "UNKNOWN";
export type ProviderCopyAvailability = "AVAILABLE" | "UNAVAILABLE" | "PARTIAL" | "UNKNOWN";
export type ProviderCopyLifecycle = "ACTIVE" | "RESIDUAL" | "DISPOSED" | "UNKNOWN";
export type CanonicalAvailability = "AVAILABLE" | "UNAVAILABLE" | "UNKNOWN" | "INCONCLUSIVE";

export type StorageCurrentness = Readonly<{
  state: StorageCurrentnessState;
  assessedAt: string;
  validUntil: string;
}>;

export type IntegrityEvidence = Readonly<{
  algorithm: string;
  digest: string;
}>;

export type ProviderCopyReference = Readonly<{
  copyRef: string;
  providerRef: string;
  providerKey: string;
  copyRevisionRef: string;
  transportAttemptRef: string | null;
  integrity: IntegrityEvidence | null;
  lifecycle: ProviderCopyLifecycle;
  availability: ProviderCopyAvailability;
  completeness: StorageEvidenceCompleteness;
  currentness: StorageCurrentness;
}>;

export type CanonicalSourceOfTruth = Readonly<{
  authorityRef: string;
  authorityRevisionRef: string;
  providerCopyRef: string | null;
}>;

export type CanonicalStorageIdentity = Readonly<{
  contractVersion: typeof STORAGE_IDENTITY_CONTRACT_VERSION;
  canonicalObjectRef: string;
  canonicalRevisionRef: string;
  objectKind: StorageObjectKind;
  sourceOfTruth: CanonicalSourceOfTruth;
  providerCopies: readonly ProviderCopyReference[];
}>;

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown, label: string): UnknownRecord => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
};

const exactFields = (record: UnknownRecord, fields: readonly string[], label: string): void => {
  for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
};

const nonEmpty = (value: unknown, label: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be a non-empty string`);
  return value.trim();
};

const timestamp = (value: unknown, label: string): string => {
  const normalized = nonEmpty(value, label);
  if (!Number.isFinite(Date.parse(normalized))) throw new Error(`${label} must be an ISO timestamp`);
  return normalized;
};

const enumValue = <T extends string>(value: unknown, allowed: readonly T[], label: string): T => {
  if (!allowed.includes(value as T)) throw new Error(`invalid ${label}`);
  return value as T;
};

function normalizeCurrentness(value: unknown): StorageCurrentness {
  const record = asRecord(value, "storage currentness");
  exactFields(record, ["state", "assessedAt", "validUntil"], "storage currentness");
  const assessedAt = timestamp(record.assessedAt, "assessedAt");
  const validUntil = timestamp(record.validUntil, "validUntil");
  if (Date.parse(validUntil) < Date.parse(assessedAt)) throw new Error("storage currentness horizon cannot end before assessment");
  return Object.freeze({
    state: enumValue(record.state, ["CURRENT", "STALE", "UNKNOWN"] as const, "storage currentness state"),
    assessedAt,
    validUntil,
  });
}

function normalizeIntegrity(value: unknown): IntegrityEvidence | null {
  if (value === null) return null;
  const record = asRecord(value, "integrity evidence");
  exactFields(record, ["algorithm", "digest"], "integrity evidence");
  return Object.freeze({ algorithm: nonEmpty(record.algorithm, "integrity algorithm"), digest: nonEmpty(record.digest, "integrity digest") });
}

function normalizeProviderCopy(value: unknown): ProviderCopyReference {
  const record = asRecord(value, "provider copy");
  exactFields(record, ["copyRef", "providerRef", "providerKey", "copyRevisionRef", "transportAttemptRef", "integrity", "lifecycle", "availability", "completeness", "currentness"], "provider copy");
  const transportAttemptRef = record.transportAttemptRef === null ? null : nonEmpty(record.transportAttemptRef, "transportAttemptRef");
  return Object.freeze({
    copyRef: nonEmpty(record.copyRef, "copyRef"),
    providerRef: nonEmpty(record.providerRef, "providerRef"),
    providerKey: nonEmpty(record.providerKey, "providerKey"),
    copyRevisionRef: nonEmpty(record.copyRevisionRef, "copyRevisionRef"),
    transportAttemptRef,
    integrity: normalizeIntegrity(record.integrity),
    lifecycle: enumValue(record.lifecycle, ["ACTIVE", "RESIDUAL", "DISPOSED", "UNKNOWN"] as const, "provider copy lifecycle"),
    availability: enumValue(record.availability, ["AVAILABLE", "UNAVAILABLE", "PARTIAL", "UNKNOWN"] as const, "provider copy availability"),
    completeness: enumValue(record.completeness, ["KNOWN", "PARTIAL", "UNKNOWN"] as const, "provider copy evidence completeness"),
    currentness: normalizeCurrentness(record.currentness),
  });
}

function normalizeSourceOfTruth(value: unknown): CanonicalSourceOfTruth {
  const record = asRecord(value, "canonical source of truth");
  exactFields(record, ["authorityRef", "authorityRevisionRef", "providerCopyRef"], "canonical source of truth");
  return Object.freeze({
    authorityRef: nonEmpty(record.authorityRef, "authorityRef"),
    authorityRevisionRef: nonEmpty(record.authorityRevisionRef, "authorityRevisionRef"),
    providerCopyRef: record.providerCopyRef === null ? null : nonEmpty(record.providerCopyRef, "providerCopyRef"),
  });
}

export function normalizeCanonicalStorageIdentity(input: unknown): CanonicalStorageIdentity {
  const record = asRecord(input, "canonical storage identity");
  exactFields(record, ["contractVersion", "canonicalObjectRef", "canonicalRevisionRef", "objectKind", "sourceOfTruth", "providerCopies"], "canonical storage identity");
  if (record.contractVersion !== STORAGE_IDENTITY_CONTRACT_VERSION) throw new Error("unsupported storage identity contract version");
  if (!Array.isArray(record.providerCopies)) throw new Error("providerCopies must be an array");
  const providerCopies = record.providerCopies.map(normalizeProviderCopy);
  const copyRefs = new Set<string>();
  for (const copy of providerCopies) {
    if (copyRefs.has(copy.copyRef)) throw new Error("provider copy identity must be unique within canonical object");
    copyRefs.add(copy.copyRef);
  }
  const sourceOfTruth = normalizeSourceOfTruth(record.sourceOfTruth);
  if (sourceOfTruth.providerCopyRef !== null && !copyRefs.has(sourceOfTruth.providerCopyRef)) {
    throw new Error("declared provider source of truth must reference an explicit provider copy");
  }
  return Object.freeze({
    contractVersion: STORAGE_IDENTITY_CONTRACT_VERSION,
    canonicalObjectRef: nonEmpty(record.canonicalObjectRef, "canonicalObjectRef"),
    canonicalRevisionRef: nonEmpty(record.canonicalRevisionRef, "canonicalRevisionRef"),
    objectKind: enumValue(record.objectKind, ["DOCUMENT", "MEDIA", "OBJECT"] as const, "storage object kind"),
    sourceOfTruth,
    providerCopies: Object.freeze(providerCopies),
  });
}

export function assessCanonicalAvailability(identity: CanonicalStorageIdentity, evaluatedAt: string): CanonicalAvailability {
  const evaluated = Date.parse(timestamp(evaluatedAt, "evaluatedAt"));
  const sourceCopyRef = identity.sourceOfTruth.providerCopyRef;
  if (sourceCopyRef === null) return "UNKNOWN";
  const sourceCopy = identity.providerCopies.find((copy) => copy.copyRef === sourceCopyRef);
  if (!sourceCopy) return "UNKNOWN";
  if (sourceCopy.completeness !== "KNOWN") return "UNKNOWN";
  if (sourceCopy.currentness.state !== "CURRENT") return "UNKNOWN";
  if (evaluated < Date.parse(sourceCopy.currentness.assessedAt) || evaluated > Date.parse(sourceCopy.currentness.validUntil)) return "UNKNOWN";
  if (sourceCopy.lifecycle === "DISPOSED" || sourceCopy.availability === "UNAVAILABLE") return "UNAVAILABLE";
  if (sourceCopy.lifecycle !== "ACTIVE" || sourceCopy.availability !== "AVAILABLE") return "INCONCLUSIVE";
  return "AVAILABLE";
}

export function identitiesShareIntegrityEvidence(left: CanonicalStorageIdentity, right: CanonicalStorageIdentity): boolean {
  const rightDigests = new Set(right.providerCopies.flatMap((copy) => copy.integrity ? [`${copy.integrity.algorithm}\u0000${copy.integrity.digest}`] : []));
  return left.providerCopies.some((copy) => copy.integrity !== null && rightDigests.has(`${copy.integrity.algorithm}\u0000${copy.integrity.digest}`));
}

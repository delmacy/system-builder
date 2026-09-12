export const MESSAGING_IDENTITY_CONTRACT_VERSION = "1.0.0" as const;

export type MessagingEvidenceCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type MessagingCurrentnessState = "CURRENT" | "STALE" | "UNKNOWN";

export type MessagingCurrentness = Readonly<{
  state: MessagingCurrentnessState;
  assessedAt: string;
  validUntil: string;
}>;

export type ProviderMessageEvidence = Readonly<{
  providerRef: string;
  providerMessageRef: string;
}>;

export type EventOccurrenceIdentity = Readonly<{
  occurrenceRef: string;
  producerRef: string;
  sourceRef: string;
  subjectRef: string;
  producingRevisionRef: string;
  lineageRootOccurrenceRef: string;
  parentOccurrenceRef: string | null;
  completeness: MessagingEvidenceCompleteness;
  currentness: MessagingCurrentness;
}>;

export type MessageIdentity = Readonly<{
  messageRef: string;
  occurrenceRef: string;
  producingRevisionRef: string;
  providerEvidence: ProviderMessageEvidence | null;
}>;

export type SubscriptionIdentity = Readonly<{
  subscriptionRef: string;
  subscriptionRevisionRef: string;
  subscriberRef: string;
  subjectRef: string;
  completeness: MessagingEvidenceCompleteness;
  currentness: MessagingCurrentness;
}>;

export type MessagingIdentityEnvelope = Readonly<{
  contractVersion: typeof MESSAGING_IDENTITY_CONTRACT_VERSION;
  occurrence: EventOccurrenceIdentity;
  message: MessageIdentity;
  subscription: SubscriptionIdentity;
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

function normalizeCurrentness(value: unknown): MessagingCurrentness {
  const record = asRecord(value, "messaging currentness");
  exactFields(record, ["state", "assessedAt", "validUntil"], "messaging currentness");
  const assessedAt = timestamp(record.assessedAt, "assessedAt");
  const validUntil = timestamp(record.validUntil, "validUntil");
  if (Date.parse(validUntil) < Date.parse(assessedAt)) throw new Error("messaging currentness horizon cannot end before assessment");
  return Object.freeze({
    state: enumValue(record.state, ["CURRENT", "STALE", "UNKNOWN"] as const, "messaging currentness state"),
    assessedAt,
    validUntil,
  });
}

function normalizeProviderEvidence(value: unknown): ProviderMessageEvidence | null {
  if (value === null) return null;
  const record = asRecord(value, "provider message evidence");
  exactFields(record, ["providerRef", "providerMessageRef"], "provider message evidence");
  return Object.freeze({
    providerRef: nonEmpty(record.providerRef, "providerRef"),
    providerMessageRef: nonEmpty(record.providerMessageRef, "providerMessageRef"),
  });
}

function normalizeOccurrence(value: unknown): EventOccurrenceIdentity {
  const record = asRecord(value, "event occurrence identity");
  exactFields(record, ["occurrenceRef", "producerRef", "sourceRef", "subjectRef", "producingRevisionRef", "lineageRootOccurrenceRef", "parentOccurrenceRef", "completeness", "currentness"], "event occurrence identity");
  const occurrenceRef = nonEmpty(record.occurrenceRef, "occurrenceRef");
  const lineageRootOccurrenceRef = nonEmpty(record.lineageRootOccurrenceRef, "lineageRootOccurrenceRef");
  const parentOccurrenceRef = record.parentOccurrenceRef === null ? null : nonEmpty(record.parentOccurrenceRef, "parentOccurrenceRef");
  if (parentOccurrenceRef === occurrenceRef) throw new Error("event occurrence cannot be its own parent");
  return Object.freeze({
    occurrenceRef,
    producerRef: nonEmpty(record.producerRef, "producerRef"),
    sourceRef: nonEmpty(record.sourceRef, "sourceRef"),
    subjectRef: nonEmpty(record.subjectRef, "subjectRef"),
    producingRevisionRef: nonEmpty(record.producingRevisionRef, "producingRevisionRef"),
    lineageRootOccurrenceRef,
    parentOccurrenceRef,
    completeness: enumValue(record.completeness, ["KNOWN", "PARTIAL", "UNKNOWN"] as const, "occurrence evidence completeness"),
    currentness: normalizeCurrentness(record.currentness),
  });
}

function normalizeMessage(value: unknown): MessageIdentity {
  const record = asRecord(value, "message identity");
  exactFields(record, ["messageRef", "occurrenceRef", "producingRevisionRef", "providerEvidence"], "message identity");
  return Object.freeze({
    messageRef: nonEmpty(record.messageRef, "messageRef"),
    occurrenceRef: nonEmpty(record.occurrenceRef, "occurrenceRef"),
    producingRevisionRef: nonEmpty(record.producingRevisionRef, "producingRevisionRef"),
    providerEvidence: normalizeProviderEvidence(record.providerEvidence),
  });
}

function normalizeSubscription(value: unknown): SubscriptionIdentity {
  const record = asRecord(value, "subscription identity");
  exactFields(record, ["subscriptionRef", "subscriptionRevisionRef", "subscriberRef", "subjectRef", "completeness", "currentness"], "subscription identity");
  return Object.freeze({
    subscriptionRef: nonEmpty(record.subscriptionRef, "subscriptionRef"),
    subscriptionRevisionRef: nonEmpty(record.subscriptionRevisionRef, "subscriptionRevisionRef"),
    subscriberRef: nonEmpty(record.subscriberRef, "subscriberRef"),
    subjectRef: nonEmpty(record.subjectRef, "subjectRef"),
    completeness: enumValue(record.completeness, ["KNOWN", "PARTIAL", "UNKNOWN"] as const, "subscription evidence completeness"),
    currentness: normalizeCurrentness(record.currentness),
  });
}

export function normalizeMessagingIdentityEnvelope(input: unknown): MessagingIdentityEnvelope {
  const record = asRecord(input, "messaging identity envelope");
  exactFields(record, ["contractVersion", "occurrence", "message", "subscription"], "messaging identity envelope");
  if (record.contractVersion !== MESSAGING_IDENTITY_CONTRACT_VERSION) throw new Error("unsupported messaging identity contract version");
  const occurrence = normalizeOccurrence(record.occurrence);
  const message = normalizeMessage(record.message);
  const subscription = normalizeSubscription(record.subscription);
  if (message.occurrenceRef !== occurrence.occurrenceRef) throw new Error("message must reference the explicit canonical occurrence");
  if (message.producingRevisionRef !== occurrence.producingRevisionRef) throw new Error("message must preserve the occurrence producing revision");
  if (subscription.subjectRef !== occurrence.subjectRef) throw new Error("subscription subject must match the addressed occurrence subject");
  return Object.freeze({ contractVersion: MESSAGING_IDENTITY_CONTRACT_VERSION, occurrence, message, subscription });
}

export function evidenceCanStrengthenMessagingCurrentness(
  completeness: MessagingEvidenceCompleteness,
  currentness: MessagingCurrentness,
  evaluatedAt: string,
): boolean {
  const evaluated = Date.parse(timestamp(evaluatedAt, "evaluatedAt"));
  return completeness === "KNOWN"
    && currentness.state === "CURRENT"
    && evaluated >= Date.parse(currentness.assessedAt)
    && evaluated <= Date.parse(currentness.validUntil);
}

export function sameCanonicalOccurrence(left: MessagingIdentityEnvelope, right: MessagingIdentityEnvelope): boolean {
  return left.occurrence.occurrenceRef === right.occurrence.occurrenceRef
    && left.occurrence.producingRevisionRef === right.occurrence.producingRevisionRef
    && left.occurrence.lineageRootOccurrenceRef === right.occurrence.lineageRootOccurrenceRef;
}

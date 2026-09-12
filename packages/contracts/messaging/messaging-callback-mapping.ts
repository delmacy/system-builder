import {
  businessEffectEvidenceIsAuthoritative,
  type BusinessEffectEvidence,
} from "./messaging-delivery-effect.js";
import type { MessagingCurrentness, MessagingEvidenceCompleteness } from "./messaging-identity.js";

export const MESSAGING_CALLBACK_MAPPING_CONTRACT_VERSION = "1.0.0" as const;

export type CallbackTransportOutcome = "ACKNOWLEDGED" | "REJECTED" | "TIMEOUT" | "UNKNOWN";
export type CallbackMappingAuthority = "AUTHORITATIVE" | "INFERRED";
export type CallbackReconciliationDisposition = "EFFECT_CONFIRMED" | "SAFE_RETRY" | "RECONCILE_BEFORE_RETRY";

export type MessagingCallbackMappingEvidence = Readonly<{
  callbackRef: string;
  occurrenceRef: string;
  messageRef: string;
  subscriptionRef: string;
  mappingRef: string;
  mappingRevisionRef: string;
  sourceSemanticRef: string;
  sourceRevisionRef: string;
  targetSemanticRef: string;
  targetRevisionRef: string;
  deliveryRef: string;
  providerCallbackRef: string | null;
  transportOutcome: CallbackTransportOutcome;
  authority: CallbackMappingAuthority;
  completeness: MessagingEvidenceCompleteness;
  currentness: MessagingCurrentness;
}>;

export type MessagingCallbackMappingEnvelope = Readonly<{
  contractVersion: typeof MESSAGING_CALLBACK_MAPPING_CONTRACT_VERSION;
  mapping: MessagingCallbackMappingEvidence;
  targetEffect: BusinessEffectEvidence;
}>;

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown, label: string): UnknownRecord => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
};

const exact = (record: UnknownRecord, fields: readonly string[], label: string): void => {
  for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
};

const nonEmpty = (value: unknown, label: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be a non-empty string`);
  return value.trim();
};

const nullableRef = (value: unknown, label: string): string | null => value === null ? null : nonEmpty(value, label);

const completeness = (value: unknown): MessagingEvidenceCompleteness => {
  if (value !== "KNOWN" && value !== "PARTIAL" && value !== "UNKNOWN") throw new Error("invalid callback mapping evidence completeness");
  return value;
};

const authority = (value: unknown): CallbackMappingAuthority => {
  if (value !== "AUTHORITATIVE" && value !== "INFERRED") throw new Error("invalid callback mapping authority");
  return value;
};

const transportOutcome = (value: unknown): CallbackTransportOutcome => {
  if (value !== "ACKNOWLEDGED" && value !== "REJECTED" && value !== "TIMEOUT" && value !== "UNKNOWN") throw new Error("invalid callback transport outcome");
  return value;
};

function normalizeCurrentness(value: unknown): MessagingCurrentness {
  const record = asRecord(value, "callback mapping currentness");
  exact(record, ["state", "assessedAt", "validUntil"], "callback mapping currentness");
  const state = record.state;
  if (state !== "CURRENT" && state !== "STALE" && state !== "UNKNOWN") throw new Error("invalid callback mapping currentness state");
  const assessedAt = nonEmpty(record.assessedAt, "currentness.assessedAt");
  const validUntil = nonEmpty(record.validUntil, "currentness.validUntil");
  if (!Number.isFinite(Date.parse(assessedAt)) || !Number.isFinite(Date.parse(validUntil))) throw new Error("callback mapping currentness timestamps must be ISO timestamps");
  if (Date.parse(validUntil) < Date.parse(assessedAt)) throw new Error("callback mapping currentness interval is invalid");
  return Object.freeze({ state, assessedAt, validUntil });
}

export function normalizeMessagingCallbackMappingEvidence(input: unknown): MessagingCallbackMappingEvidence {
  const record = asRecord(input, "messaging callback mapping evidence");
  exact(record, [
    "callbackRef", "occurrenceRef", "messageRef", "subscriptionRef", "mappingRef", "mappingRevisionRef",
    "sourceSemanticRef", "sourceRevisionRef", "targetSemanticRef", "targetRevisionRef", "deliveryRef",
    "providerCallbackRef", "transportOutcome", "authority", "completeness", "currentness",
  ], "messaging callback mapping evidence");
  return Object.freeze({
    callbackRef: nonEmpty(record.callbackRef, "callbackRef"),
    occurrenceRef: nonEmpty(record.occurrenceRef, "occurrenceRef"),
    messageRef: nonEmpty(record.messageRef, "messageRef"),
    subscriptionRef: nonEmpty(record.subscriptionRef, "subscriptionRef"),
    mappingRef: nonEmpty(record.mappingRef, "mappingRef"),
    mappingRevisionRef: nonEmpty(record.mappingRevisionRef, "mappingRevisionRef"),
    sourceSemanticRef: nonEmpty(record.sourceSemanticRef, "sourceSemanticRef"),
    sourceRevisionRef: nonEmpty(record.sourceRevisionRef, "sourceRevisionRef"),
    targetSemanticRef: nonEmpty(record.targetSemanticRef, "targetSemanticRef"),
    targetRevisionRef: nonEmpty(record.targetRevisionRef, "targetRevisionRef"),
    deliveryRef: nonEmpty(record.deliveryRef, "deliveryRef"),
    providerCallbackRef: nullableRef(record.providerCallbackRef, "providerCallbackRef"),
    transportOutcome: transportOutcome(record.transportOutcome),
    authority: authority(record.authority),
    completeness: completeness(record.completeness),
    currentness: normalizeCurrentness(record.currentness),
  });
}

const evaluatedTime = (evaluatedAt: string): number => {
  const parsed = Date.parse(nonEmpty(evaluatedAt, "evaluatedAt"));
  if (!Number.isFinite(parsed)) throw new Error("evaluatedAt must be an ISO timestamp");
  return parsed;
};

export function callbackMappingCanStrengthenCurrentness(mapping: MessagingCallbackMappingEvidence, evaluatedAt: string): boolean {
  const evaluated = evaluatedTime(evaluatedAt);
  return mapping.completeness === "KNOWN"
    && mapping.authority === "AUTHORITATIVE"
    && mapping.currentness.state === "CURRENT"
    && evaluated >= Date.parse(mapping.currentness.assessedAt)
    && evaluated <= Date.parse(mapping.currentness.validUntil);
}

export function providerCallbackRefIsCanonicalBusinessIdentity(mapping: MessagingCallbackMappingEvidence): false {
  void mapping;
  return false;
}

export function callbackRedeliveryPreservesMappingLineage(
  original: MessagingCallbackMappingEvidence,
  redelivery: MessagingCallbackMappingEvidence,
): boolean {
  return original.callbackRef === redelivery.callbackRef
    && original.occurrenceRef === redelivery.occurrenceRef
    && original.messageRef === redelivery.messageRef
    && original.subscriptionRef === redelivery.subscriptionRef
    && original.mappingRef === redelivery.mappingRef
    && original.mappingRevisionRef === redelivery.mappingRevisionRef
    && original.sourceSemanticRef === redelivery.sourceSemanticRef
    && original.sourceRevisionRef === redelivery.sourceRevisionRef
    && original.targetSemanticRef === redelivery.targetSemanticRef
    && original.targetRevisionRef === redelivery.targetRevisionRef;
}

export function reconcileMappedCallback(
  mapping: MessagingCallbackMappingEvidence,
  targetEffect: BusinessEffectEvidence,
  evaluatedAt: string,
): CallbackReconciliationDisposition {
  if (mapping.occurrenceRef !== targetEffect.occurrenceRef) throw new Error("callback mapping and target effect must reference the same canonical occurrence");
  const mappingAuthoritative = callbackMappingCanStrengthenCurrentness(mapping, evaluatedAt);
  const effectAuthoritative = businessEffectEvidenceIsAuthoritative(targetEffect, evaluatedAt);
  if (mappingAuthoritative && effectAuthoritative && targetEffect.state === "OBSERVED") return "EFFECT_CONFIRMED";
  if (
    mappingAuthoritative
    && effectAuthoritative
    && mapping.transportOutcome === "REJECTED"
    && targetEffect.state === "NOT_OBSERVED"
  ) return "SAFE_RETRY";
  return "RECONCILE_BEFORE_RETRY";
}

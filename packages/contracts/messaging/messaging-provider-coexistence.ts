import {
  normalizeProviderBindingQualification,
  type ProviderBindingQualification,
} from "../provider/qualification.js";
import type { MessagingEvidenceCompleteness } from "./messaging-identity.js";

export const MESSAGING_PROVIDER_COEXISTENCE_CONTRACT_VERSION = "1.0.0" as const;

export type MessagingProviderBindingPhase = "ACTIVE" | "DRAINING" | "HISTORICAL";

export type MessagingProviderBindingEvidence = Readonly<{
  bindingRef: string;
  substitutionEpochRef: string;
  phase: MessagingProviderBindingPhase;
  qualification: ProviderBindingQualification;
  completeness: MessagingEvidenceCompleteness;
  effectiveFrom: string;
  effectiveUntil: string | null;
}>;

export type MessagingProviderHistoricalDelivery = Readonly<{
  deliveryRef: string;
  messageRef: string;
  occurrenceRef: string;
  bindingRef: string;
  providerRealizationRef: string;
  substitutionEpochRef: string;
}>;

export type MessagingProviderCoexistenceEnvelope = Readonly<{
  contractVersion: typeof MESSAGING_PROVIDER_COEXISTENCE_CONTRACT_VERSION;
  occurrenceRef: string;
  messageRef: string;
  subscriptionRef: string;
  bindings: readonly MessagingProviderBindingEvidence[];
  historicalDeliveries: readonly MessagingProviderHistoricalDelivery[];
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

const timestamp = (value: unknown, label: string): string => {
  const normalized = nonEmpty(value, label);
  if (!Number.isFinite(Date.parse(normalized))) throw new Error(`${label} must be an ISO timestamp`);
  return normalized;
};

const nullableTimestamp = (value: unknown, label: string): string | null => value === null ? null : timestamp(value, label);

const phase = (value: unknown): MessagingProviderBindingPhase => {
  if (value !== "ACTIVE" && value !== "DRAINING" && value !== "HISTORICAL") throw new Error("invalid messaging provider binding phase");
  return value;
};

const completeness = (value: unknown): MessagingEvidenceCompleteness => {
  if (value !== "KNOWN" && value !== "PARTIAL" && value !== "UNKNOWN") throw new Error("invalid messaging provider evidence completeness");
  return value;
};

function normalizeBinding(value: unknown): MessagingProviderBindingEvidence {
  const record = asRecord(value, "messaging provider binding evidence");
  exact(record, ["bindingRef", "substitutionEpochRef", "phase", "qualification", "completeness", "effectiveFrom", "effectiveUntil"], "messaging provider binding evidence");
  const qualification = normalizeProviderBindingQualification(record.qualification);
  const effectiveFrom = timestamp(record.effectiveFrom, "effectiveFrom");
  const effectiveUntil = nullableTimestamp(record.effectiveUntil, "effectiveUntil");
  if (effectiveUntil !== null && Date.parse(effectiveUntil) < Date.parse(effectiveFrom)) throw new Error("provider binding effective interval is invalid");
  const bindingRef = nonEmpty(record.bindingRef, "bindingRef");
  if (bindingRef !== qualification.binding.canonicalRef) throw new Error("messaging bindingRef must preserve provider binding canonical identity");
  return Object.freeze({
    bindingRef,
    substitutionEpochRef: nonEmpty(record.substitutionEpochRef, "substitutionEpochRef"),
    phase: phase(record.phase),
    qualification,
    completeness: completeness(record.completeness),
    effectiveFrom,
    effectiveUntil,
  });
}

function normalizeHistoricalDelivery(value: unknown): MessagingProviderHistoricalDelivery {
  const record = asRecord(value, "messaging provider historical delivery");
  exact(record, ["deliveryRef", "messageRef", "occurrenceRef", "bindingRef", "providerRealizationRef", "substitutionEpochRef"], "messaging provider historical delivery");
  return Object.freeze({
    deliveryRef: nonEmpty(record.deliveryRef, "deliveryRef"),
    messageRef: nonEmpty(record.messageRef, "messageRef"),
    occurrenceRef: nonEmpty(record.occurrenceRef, "occurrenceRef"),
    bindingRef: nonEmpty(record.bindingRef, "bindingRef"),
    providerRealizationRef: nonEmpty(record.providerRealizationRef, "providerRealizationRef"),
    substitutionEpochRef: nonEmpty(record.substitutionEpochRef, "substitutionEpochRef"),
  });
}

export function normalizeMessagingProviderCoexistenceEnvelope(input: unknown): MessagingProviderCoexistenceEnvelope {
  const record = asRecord(input, "messaging provider coexistence envelope");
  exact(record, ["contractVersion", "occurrenceRef", "messageRef", "subscriptionRef", "bindings", "historicalDeliveries"], "messaging provider coexistence envelope");
  if (record.contractVersion !== MESSAGING_PROVIDER_COEXISTENCE_CONTRACT_VERSION) throw new Error("unsupported messaging provider coexistence contract version");
  if (!Array.isArray(record.bindings) || record.bindings.length === 0) throw new Error("provider coexistence requires at least one explicit binding");
  if (!Array.isArray(record.historicalDeliveries)) throw new Error("historicalDeliveries must be an array");
  const bindings = Object.freeze(record.bindings.map(normalizeBinding));
  const historicalDeliveries = Object.freeze(record.historicalDeliveries.map(normalizeHistoricalDelivery));
  const seen = new Set<string>();
  for (const binding of bindings) {
    const key = `${binding.bindingRef}\u0000${binding.qualification.binding.revisionRef}\u0000${binding.substitutionEpochRef}`;
    if (seen.has(key)) throw new Error("duplicate messaging provider binding evidence");
    seen.add(key);
  }
  return Object.freeze({
    contractVersion: MESSAGING_PROVIDER_COEXISTENCE_CONTRACT_VERSION,
    occurrenceRef: nonEmpty(record.occurrenceRef, "occurrenceRef"),
    messageRef: nonEmpty(record.messageRef, "messageRef"),
    subscriptionRef: nonEmpty(record.subscriptionRef, "subscriptionRef"),
    bindings,
    historicalDeliveries,
  });
}

export function providerBindingCanStrengthenAvailability(binding: MessagingProviderBindingEvidence, evaluatedAt: string): boolean {
  const evaluated = Date.parse(timestamp(evaluatedAt, "evaluatedAt"));
  const currentness = binding.qualification.currentness;
  const horizon = currentness.currentnessHorizon;
  return binding.completeness === "KNOWN"
    && binding.phase === "ACTIVE"
    && binding.qualification.disposition === "SUPPORTED"
    && binding.qualification.evidenceAuthority === "AUTHORITATIVE"
    && currentness.state === "CURRENT"
    && evaluated >= Date.parse(binding.effectiveFrom)
    && (binding.effectiveUntil === null || evaluated <= Date.parse(binding.effectiveUntil))
    && evaluated >= Date.parse(horizon.assessedAt)
    && evaluated <= Date.parse(horizon.validUntil);
}

export function providerOverlapImpliesDuplicateBusinessOccurrence(
  left: MessagingProviderCoexistenceEnvelope,
  right: MessagingProviderCoexistenceEnvelope,
): boolean {
  if (left.occurrenceRef !== right.occurrenceRef || left.messageRef !== right.messageRef) return false;
  return false;
}

export function substitutionPreservesHistoricalLineage(
  before: MessagingProviderCoexistenceEnvelope,
  after: MessagingProviderCoexistenceEnvelope,
): boolean {
  if (before.occurrenceRef !== after.occurrenceRef || before.messageRef !== after.messageRef || before.subscriptionRef !== after.subscriptionRef) return false;
  const afterHistory = new Map(after.historicalDeliveries.map((delivery) => [delivery.deliveryRef, delivery]));
  for (const prior of before.historicalDeliveries) {
    const current = afterHistory.get(prior.deliveryRef);
    if (!current) return false;
    if (current.messageRef !== prior.messageRef
      || current.occurrenceRef !== prior.occurrenceRef
      || current.bindingRef !== prior.bindingRef
      || current.providerRealizationRef !== prior.providerRealizationRef
      || current.substitutionEpochRef !== prior.substitutionEpochRef) return false;
  }
  return true;
}

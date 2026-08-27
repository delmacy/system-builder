export const OBSERVE_KNOWLEDGE_ENFORCEMENT_VERSION = "1.0.0" as const;

export type ObserveKnowledgeEnforcementEnvelope = Readonly<{
  contractVersion: typeof OBSERVE_KNOWLEDGE_ENFORCEMENT_VERSION;
  enforcementRef: string;
  classificationDecisionRef: string;
  usePolicyRef: string;
  purposeId: string;
  outcome: "allow" | "deny" | "isolate";
  reasonIds: readonly string[];
  evidenceRefs: readonly string[];
}>;

export type ObserveKnowledgeEnforcementProjection = Readonly<{
  contractVersion: typeof OBSERVE_KNOWLEDGE_ENFORCEMENT_VERSION;
  enforcementRef: string;
  classificationDecisionRef: string;
  usePolicyRef: string;
  purposeId: string;
  outcome: ObserveKnowledgeEnforcementEnvelope["outcome"];
  reasonIds: readonly string[];
  evidenceRefs: readonly string[];
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("knowledge enforcement observation envelope must be an object");
  }
  return value as UnknownRecord;
}

function asNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} must be a non-empty string`);
  return value.trim();
}

function asCanonicalStringList(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  const normalized = value.map((item, index) => asNonEmptyString(item, `${field}[${index}]`));
  if (new Set(normalized).size !== normalized.length) throw new Error(`${field} must not contain duplicates`);
  return [...normalized].sort((left, right) => left.localeCompare(right));
}

function normalizeObserveKnowledgeEnforcementEnvelope(value: unknown): ObserveKnowledgeEnforcementEnvelope {
  const record = asRecord(value);
  const allowedFields = [
    "contractVersion",
    "enforcementRef",
    "classificationDecisionRef",
    "usePolicyRef",
    "purposeId",
    "outcome",
    "reasonIds",
    "evidenceRefs",
  ] as const;
  for (const field of Object.keys(record)) {
    if (!(allowedFields as readonly string[]).includes(field)) throw new Error(`knowledge enforcement observation envelope has unexpected field ${field}`);
  }
  for (const field of allowedFields) {
    if (!(field in record)) throw new Error(`knowledge enforcement observation envelope is missing field ${field}`);
  }
  if (record.contractVersion !== OBSERVE_KNOWLEDGE_ENFORCEMENT_VERSION) {
    throw new Error(`unsupported knowledge enforcement observation version: ${String(record.contractVersion)}`);
  }
  if (record.outcome !== "allow" && record.outcome !== "deny" && record.outcome !== "isolate") {
    throw new Error(`unsupported knowledge enforcement outcome: ${String(record.outcome)}`);
  }
  return {
    contractVersion: OBSERVE_KNOWLEDGE_ENFORCEMENT_VERSION,
    enforcementRef: asNonEmptyString(record.enforcementRef, "enforcementRef"),
    classificationDecisionRef: asNonEmptyString(record.classificationDecisionRef, "classificationDecisionRef"),
    usePolicyRef: asNonEmptyString(record.usePolicyRef, "usePolicyRef"),
    purposeId: asNonEmptyString(record.purposeId, "purposeId"),
    outcome: record.outcome,
    reasonIds: asCanonicalStringList(record.reasonIds, "reasonIds"),
    evidenceRefs: asCanonicalStringList(record.evidenceRefs, "evidenceRefs"),
  };
}

export function projectKnowledgeEnforcementForObservation(value: unknown): ObserveKnowledgeEnforcementProjection {
  const envelope = normalizeObserveKnowledgeEnforcementEnvelope(value);
  return Object.freeze({
    contractVersion: OBSERVE_KNOWLEDGE_ENFORCEMENT_VERSION,
    enforcementRef: envelope.enforcementRef,
    classificationDecisionRef: envelope.classificationDecisionRef,
    usePolicyRef: envelope.usePolicyRef,
    purposeId: envelope.purposeId,
    outcome: envelope.outcome,
    reasonIds: Object.freeze([...envelope.reasonIds]),
    evidenceRefs: Object.freeze([...envelope.evidenceRefs]),
  });
}

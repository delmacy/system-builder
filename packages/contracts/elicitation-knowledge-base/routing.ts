import { ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION } from "./index.js";

export const EKB_CONTRADICTION_SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export const EKB_ROUTING_OUTCOMES = ["ROUTED", "NOT_APPLICABLE", "UNRESOLVED", "BLOCKED", "INCONCLUSIVE"] as const;

export type EKBContradictionSeverity = (typeof EKB_CONTRADICTION_SEVERITIES)[number];
export type EKBRoutingOutcome = (typeof EKB_ROUTING_OUTCOMES)[number];

export type EKBCompetingInformationReference = Readonly<{
  recordRef: string;
  qualificationRef: string;
}>;

export type EKBExternalResolutionAuthority = Readonly<{
  ownerRef: string;
  authorityRef: string;
}>;

export type EKBContradictionRecord = Readonly<{
  contractVersion: typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
  contradictionRef: string;
  subjectRef: string;
  contextRef: string;
  competingRecords: readonly EKBCompetingInformationReference[];
  severity: EKBContradictionSeverity;
  resolutionAuthority: EKBExternalResolutionAuthority | null;
  affectedGateRefs: readonly string[];
  affectedArtifactRefs: readonly string[];
  routeRef: string | null;
  dispositionRef: string | null;
  supersedesContradictionRef: string | null;
}>;

export type EKBApplicabilityContext = Readonly<{
  subjectRef: string;
  contextRef: string;
  populationScope: string;
  localityScope: string;
}>;

export type EKBRoutingRecord = Readonly<{
  contractVersion: typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
  routingRef: string;
  sourceOwnerRef: string;
  targetAuthority: EKBExternalResolutionAuthority | null;
  applicability: EKBApplicabilityContext;
  outcome: EKBRoutingOutcome;
  rationale: string | null;
  evidenceRefs: readonly string[];
  blockedGateRefs: readonly string[];
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord, fields: readonly string[], label: string): void {
  for (const key of Object.keys(record)) if (!fields.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  for (const key of fields) if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
}

function nonEmpty(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} must be a non-empty string`);
  return value.trim();
}

function nullableNonEmpty(value: unknown, field: string): string | null {
  if (value === null) return null;
  return nonEmpty(value, field);
}

function stringList(value: unknown, field: string, minimum = 0): readonly string[] {
  if (!Array.isArray(value) || value.length < minimum) throw new Error(`${field} must be an array with at least ${minimum} item(s)`);
  const normalized = value.map((entry, index) => nonEmpty(entry, `${field}[${index}]`));
  if (new Set(normalized).size !== normalized.length) throw new Error(`${field} must not contain duplicates`);
  return Object.freeze(normalized);
}

function oneOf<T extends readonly string[]>(value: unknown, allowed: T, field: string): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) throw new Error(`${field} must be one of ${allowed.join(", ")}`);
  return value as T[number];
}

function normalizeAuthority(input: unknown): EKBExternalResolutionAuthority | null {
  if (input === null) return null;
  const record = asRecord(input, "resolution authority");
  assertExactFields(record, ["ownerRef", "authorityRef"], "resolution authority");
  return Object.freeze({ ownerRef: nonEmpty(record.ownerRef, "resolutionAuthority.ownerRef"), authorityRef: nonEmpty(record.authorityRef, "resolutionAuthority.authorityRef") });
}

function normalizeCompetingReference(input: unknown): EKBCompetingInformationReference {
  const record = asRecord(input, "competing information reference");
  assertExactFields(record, ["recordRef", "qualificationRef"], "competing information reference");
  return Object.freeze({ recordRef: nonEmpty(record.recordRef, "recordRef"), qualificationRef: nonEmpty(record.qualificationRef, "qualificationRef") });
}

function normalizeApplicability(input: unknown): EKBApplicabilityContext {
  const record = asRecord(input, "applicability");
  assertExactFields(record, ["subjectRef", "contextRef", "populationScope", "localityScope"], "applicability");
  return Object.freeze({
    subjectRef: nonEmpty(record.subjectRef, "applicability.subjectRef"),
    contextRef: nonEmpty(record.contextRef, "applicability.contextRef"),
    populationScope: nonEmpty(record.populationScope, "applicability.populationScope"),
    localityScope: nonEmpty(record.localityScope, "applicability.localityScope"),
  });
}

export function normalizeEKBContradictionRecord(input: unknown): EKBContradictionRecord {
  const record = asRecord(input, "EKB contradiction record");
  assertExactFields(record, ["contractVersion", "contradictionRef", "subjectRef", "contextRef", "competingRecords", "severity", "resolutionAuthority", "affectedGateRefs", "affectedArtifactRefs", "routeRef", "dispositionRef", "supersedesContradictionRef"], "EKB contradiction record");
  if (record.contractVersion !== ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION) throw new Error(`unsupported EKB contract version: ${String(record.contractVersion)}`);
  if (!Array.isArray(record.competingRecords) || record.competingRecords.length < 2) throw new Error("competingRecords must preserve at least two separately addressable records");
  const competingRecords = Object.freeze(record.competingRecords.map(normalizeCompetingReference));
  if (new Set(competingRecords.map((entry) => entry.recordRef)).size !== competingRecords.length) throw new Error("competingRecords must reference distinct information records");
  const severity = oneOf(record.severity, EKB_CONTRADICTION_SEVERITIES, "severity");
  const resolutionAuthority = normalizeAuthority(record.resolutionAuthority);
  const routeRef = nullableNonEmpty(record.routeRef, "routeRef");
  const affectedGateRefs = stringList(record.affectedGateRefs, "affectedGateRefs");
  if ((severity === "HIGH" || severity === "CRITICAL") && resolutionAuthority === null && routeRef === null) {
    throw new Error(`${severity} contradiction requires an external resolution authority or explicit route`);
  }
  return Object.freeze({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    contradictionRef: nonEmpty(record.contradictionRef, "contradictionRef"),
    subjectRef: nonEmpty(record.subjectRef, "subjectRef"),
    contextRef: nonEmpty(record.contextRef, "contextRef"),
    competingRecords,
    severity,
    resolutionAuthority,
    affectedGateRefs,
    affectedArtifactRefs: stringList(record.affectedArtifactRefs, "affectedArtifactRefs"),
    routeRef,
    dispositionRef: nullableNonEmpty(record.dispositionRef, "dispositionRef"),
    supersedesContradictionRef: nullableNonEmpty(record.supersedesContradictionRef, "supersedesContradictionRef"),
  });
}

export function normalizeEKBRoutingRecord(input: unknown): EKBRoutingRecord {
  const record = asRecord(input, "EKB routing record");
  assertExactFields(record, ["contractVersion", "routingRef", "sourceOwnerRef", "targetAuthority", "applicability", "outcome", "rationale", "evidenceRefs", "blockedGateRefs"], "EKB routing record");
  if (record.contractVersion !== ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION) throw new Error(`unsupported EKB contract version: ${String(record.contractVersion)}`);
  const outcome = oneOf(record.outcome, EKB_ROUTING_OUTCOMES, "outcome");
  const targetAuthority = normalizeAuthority(record.targetAuthority);
  const rationale = nullableNonEmpty(record.rationale, "rationale");
  const evidenceRefs = stringList(record.evidenceRefs, "evidenceRefs");
  const blockedGateRefs = stringList(record.blockedGateRefs, "blockedGateRefs");
  if (outcome === "ROUTED" && targetAuthority === null) throw new Error("ROUTED outcome requires an external target authority");
  if (outcome === "NOT_APPLICABLE" && (rationale === null || evidenceRefs.length === 0)) throw new Error("NOT_APPLICABLE requires explicit rationale and applicability evidence");
  if (outcome === "BLOCKED" && blockedGateRefs.length === 0) throw new Error("BLOCKED outcome requires at least one blocked gate");
  if ((outcome === "UNRESOLVED" || outcome === "INCONCLUSIVE") && rationale === null) throw new Error(`${outcome} outcome requires explicit rationale`);
  return Object.freeze({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    routingRef: nonEmpty(record.routingRef, "routingRef"),
    sourceOwnerRef: nonEmpty(record.sourceOwnerRef, "sourceOwnerRef"),
    targetAuthority,
    applicability: normalizeApplicability(record.applicability),
    outcome,
    rationale,
    evidenceRefs,
    blockedGateRefs,
  });
}

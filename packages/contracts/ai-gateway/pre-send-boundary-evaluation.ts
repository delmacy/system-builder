import {
  normalizeDataKnowledgeBoundaryDescriptor,
  type DataKnowledgeBoundaryDescriptor,
} from "./data-knowledge-boundary.js";

export type PreSendBoundaryEvidence = Readonly<{
  boundaryId: string;
  dataClasses: readonly string[];
  knowledgeRefs: readonly string[];
}>;

export type PreSendBoundaryEvaluationReason = Readonly<{
  code: "boundary-mismatch" | "data-class-not-allowed" | "knowledge-ref-not-allowed" | "malformed-boundary" | "malformed-evidence";
  subject: string;
}>;

export type PreSendBoundaryEvaluation = Readonly<{
  status: "allowed" | "rejected" | "invalid";
  boundaryId: string | null;
  reasons: readonly PreSendBoundaryEvaluationReason[];
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord, allowed: readonly string[], label: string): void {
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key)) throw new Error(`${label} has unexpected field ${key}`);
  }
  for (const key of allowed) {
    if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
  }
}

function asNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} must be a non-empty string`);
  return value;
}

function normalizeStringSet(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  const normalized = value.map((item, index) => asNonEmptyString(item, `${field}[${index}]`));
  if (new Set(normalized).size !== normalized.length) throw new Error(`${field} must not contain duplicates`);
  return [...normalized].sort((left, right) => left.localeCompare(right));
}

function normalizeEvidence(value: unknown): PreSendBoundaryEvidence {
  const record = asRecord(value, "pre-send boundary evidence");
  assertExactFields(record, ["boundaryId", "dataClasses", "knowledgeRefs"], "pre-send boundary evidence");
  return {
    boundaryId: asNonEmptyString(record.boundaryId, "boundaryId"),
    dataClasses: normalizeStringSet(record.dataClasses, "dataClasses"),
    knowledgeRefs: normalizeStringSet(record.knowledgeRefs, "knowledgeRefs"),
  };
}

function invalid(code: "malformed-boundary" | "malformed-evidence", error: unknown): PreSendBoundaryEvaluation {
  return {
    status: "invalid",
    boundaryId: null,
    reasons: [{ code, subject: error instanceof Error ? error.message : String(error) }],
  };
}

export function evaluatePreSendBoundary(input: Readonly<{ boundary: unknown; evidence: unknown }>): PreSendBoundaryEvaluation {
  let boundary: DataKnowledgeBoundaryDescriptor;
  try {
    boundary = normalizeDataKnowledgeBoundaryDescriptor(input.boundary);
  } catch (error) {
    return invalid("malformed-boundary", error);
  }

  let evidence: PreSendBoundaryEvidence;
  try {
    evidence = normalizeEvidence(input.evidence);
  } catch (error) {
    return invalid("malformed-evidence", error);
  }

  const reasons: PreSendBoundaryEvaluationReason[] = [];
  if (evidence.boundaryId !== boundary.boundaryId) {
    reasons.push({ code: "boundary-mismatch", subject: evidence.boundaryId });
  }

  const allowedDataClasses = new Set(boundary.allowedDataClasses);
  for (const dataClass of evidence.dataClasses) {
    if (!allowedDataClasses.has(dataClass)) reasons.push({ code: "data-class-not-allowed", subject: dataClass });
  }

  const allowedKnowledgeRefs = new Set(boundary.allowedKnowledgeRefs);
  for (const knowledgeRef of evidence.knowledgeRefs) {
    if (!allowedKnowledgeRefs.has(knowledgeRef)) reasons.push({ code: "knowledge-ref-not-allowed", subject: knowledgeRef });
  }

  reasons.sort((left, right) => left.code.localeCompare(right.code) || left.subject.localeCompare(right.subject));
  return {
    status: reasons.length === 0 ? "allowed" : "rejected",
    boundaryId: boundary.boundaryId,
    reasons,
  };
}

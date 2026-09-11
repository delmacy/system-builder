export const DURABLE_EXECUTION_CONTRACT_VERSION = "1.0.0" as const;

export type EvidenceCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN";
export type DurableExecutionStage = "ACCEPTED" | "PROCESSED" | "CONVERGED";

export type DurableExecutionRevision = Readonly<{
  semanticOwner: string;
  revisionDimension: string;
  revisionRef: string;
}>;

export type DurableExecutionJournalEntry = Readonly<{
  executionId: string;
  producingRevision: DurableExecutionRevision;
  stage: DurableExecutionStage;
  completeness: EvidenceCompleteness;
  evidenceRef: string | null;
}>;

export type DurableExecution = Readonly<{
  contractVersion: typeof DURABLE_EXECUTION_CONTRACT_VERSION;
  executionId: string;
  producingRevision: DurableExecutionRevision;
  currentRevision: DurableExecutionRevision;
  journal: readonly DurableExecutionJournalEntry[];
  accepted: EvidenceCompleteness;
  processed: EvidenceCompleteness;
  converged: EvidenceCompleteness;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as UnknownRecord;
}

function nonEmptyString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) throw new Error(`${label} must be a non-empty string`);
  return value;
}

function completeness(value: unknown, label: string): EvidenceCompleteness {
  if (value !== "KNOWN" && value !== "PARTIAL" && value !== "UNKNOWN") throw new Error(`${label} must be KNOWN, PARTIAL or UNKNOWN`);
  return value;
}

function revision(value: unknown, label: string): DurableExecutionRevision {
  const r = asRecord(value, label);
  return Object.freeze({
    semanticOwner: nonEmptyString(r.semanticOwner, `${label}.semanticOwner`),
    revisionDimension: nonEmptyString(r.revisionDimension, `${label}.revisionDimension`),
    revisionRef: nonEmptyString(r.revisionRef, `${label}.revisionRef`),
  });
}

function sameRevision(a: DurableExecutionRevision, b: DurableExecutionRevision): boolean {
  return a.semanticOwner === b.semanticOwner && a.revisionDimension === b.revisionDimension && a.revisionRef === b.revisionRef;
}

function rank(value: EvidenceCompleteness): number {
  return value === "KNOWN" ? 2 : value === "PARTIAL" ? 1 : 0;
}

export function normalizeDurableExecution(input: unknown): DurableExecution {
  const r = asRecord(input, "durable execution");
  const expected = ["contractVersion", "executionId", "producingRevision", "currentRevision", "journal", "accepted", "processed", "converged"] as const;
  for (const key of Object.keys(r)) if (!expected.includes(key as typeof expected[number])) throw new Error(`durable execution has unexpected field ${key}`);
  for (const key of expected) if (!(key in r)) throw new Error(`durable execution is missing field ${key}`);
  if (r.contractVersion !== DURABLE_EXECUTION_CONTRACT_VERSION) throw new Error(`unsupported durable execution contract version: ${String(r.contractVersion)}`);

  const executionId = nonEmptyString(r.executionId, "executionId");
  const producingRevision = revision(r.producingRevision, "producingRevision");
  const currentRevision = revision(r.currentRevision, "currentRevision");
  const accepted = completeness(r.accepted, "accepted");
  const processed = completeness(r.processed, "processed");
  const converged = completeness(r.converged, "converged");
  if (!Array.isArray(r.journal) || r.journal.length === 0) throw new Error("journal evidence is required");

  const journal = r.journal.map((entry, index): DurableExecutionJournalEntry => {
    const e = asRecord(entry, `journal[${index}]`);
    const stage = e.stage;
    if (stage !== "ACCEPTED" && stage !== "PROCESSED" && stage !== "CONVERGED") throw new Error(`journal[${index}].stage is invalid`);
    const entryRevision = revision(e.producingRevision, `journal[${index}].producingRevision`);
    if (nonEmptyString(e.executionId, `journal[${index}].executionId`) !== executionId) throw new Error("journal execution lineage must match executionId");
    if (!sameRevision(entryRevision, producingRevision)) throw new Error("journal revision lineage must retain producing revision");
    const entryCompleteness = completeness(e.completeness, `journal[${index}].completeness`);
    const evidenceRef = e.evidenceRef === null ? null : nonEmptyString(e.evidenceRef, `journal[${index}].evidenceRef`);
    if (entryCompleteness === "KNOWN" && evidenceRef === null) throw new Error("KNOWN journal evidence requires evidenceRef");
    return Object.freeze({ executionId, producingRevision: entryRevision, stage, completeness: entryCompleteness, evidenceRef });
  });

  if (rank(processed) > rank(accepted)) throw new Error("processed cannot be stronger than accepted evidence");
  if (rank(converged) > rank(processed)) throw new Error("converged cannot be stronger than processed evidence");
  if (accepted === "KNOWN" && !journal.some((e) => e.stage === "ACCEPTED" && e.completeness === "KNOWN")) throw new Error("accepted KNOWN requires matching journal evidence");
  if (processed === "KNOWN" && !journal.some((e) => e.stage === "PROCESSED" && e.completeness === "KNOWN")) throw new Error("processed KNOWN requires matching journal evidence");
  if (converged === "KNOWN" && !journal.some((e) => e.stage === "CONVERGED" && e.completeness === "KNOWN")) throw new Error("converged KNOWN requires matching journal evidence");

  return Object.freeze({ contractVersion: DURABLE_EXECUTION_CONTRACT_VERSION, executionId, producingRevision, currentRevision, journal: Object.freeze(journal), accepted, processed, converged });
}

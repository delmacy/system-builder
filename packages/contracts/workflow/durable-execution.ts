export type DurableExecutionKnowledge = "KNOWN" | "PARTIAL" | "UNKNOWN";

export type DurableExecutionStage =
  | "ACCEPTED"
  | "PROCESSING"
  | "PROCESSED"
  | "CONVERGED"
  | "FAILED";

export interface ProducingRevisionRef {
  definitionRef: string;
  revisionRef: string;
  contractVersion: string;
}

export interface DurableExecutionIdentity {
  executionRef: string;
  producingRevision: ProducingRevisionRef;
}

export interface DurableExecutionJournalEntry {
  executionRef: string;
  producingRevision: ProducingRevisionRef;
  sequence: number;
  stage: DurableExecutionStage;
  knowledge: DurableExecutionKnowledge;
  evidenceRefs: readonly string[];
}

export interface DurableExecutionSnapshot extends DurableExecutionIdentity {
  stage: DurableExecutionStage;
  knowledge: DurableExecutionKnowledge;
  journal: readonly DurableExecutionJournalEntry[];
}

export interface DurableExecutionAssessment {
  valid: boolean;
  accepted: boolean;
  processed: boolean;
  converged: boolean;
  reasons: readonly string[];
}

const sameRevision = (left: ProducingRevisionRef, right: ProducingRevisionRef) =>
  left.definitionRef === right.definitionRef &&
  left.revisionRef === right.revisionRef &&
  left.contractVersion === right.contractVersion;

export function assessDurableExecution(
  snapshot: DurableExecutionSnapshot,
): DurableExecutionAssessment {
  const reasons: string[] = [];
  const entries = [...snapshot.journal].sort((a, b) => a.sequence - b.sequence);

  if (entries.length === 0) reasons.push("MISSING_JOURNAL_EVIDENCE");

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    if (entry.executionRef !== snapshot.executionRef) reasons.push("EXECUTION_LINEAGE_MISMATCH");
    if (!sameRevision(entry.producingRevision, snapshot.producingRevision)) reasons.push("PRODUCING_REVISION_MISMATCH");
    if (index > 0 && entry.sequence <= entries[index - 1].sequence) reasons.push("NON_MONOTONIC_JOURNAL");
  }

  const accepted = entries.some((entry) => entry.stage === "ACCEPTED");
  const processed = entries.some((entry) => entry.stage === "PROCESSED");
  const converged = entries.some((entry) => entry.stage === "CONVERGED");

  if (processed && !accepted) reasons.push("PROCESSED_WITHOUT_ACCEPTANCE");
  if (converged && !processed) reasons.push("CONVERGED_WITHOUT_PROCESSING");

  const terminalClaim = snapshot.stage === "PROCESSED" || snapshot.stage === "CONVERGED";
  if (terminalClaim && snapshot.knowledge !== "KNOWN") reasons.push("NON_KNOWN_CANNOT_STRENGTHEN_TERMINAL_STATE");
  if (snapshot.stage === "PROCESSED" && !processed) reasons.push("PROCESSED_WITHOUT_JOURNAL_EVIDENCE");
  if (snapshot.stage === "CONVERGED" && !converged) reasons.push("CONVERGED_WITHOUT_JOURNAL_EVIDENCE");

  return {
    valid: reasons.length === 0,
    accepted,
    processed,
    converged,
    reasons: [...new Set(reasons)],
  };
}

export function retainsProducingRevision(
  execution: DurableExecutionIdentity,
  candidateRevision: ProducingRevisionRef,
): boolean {
  return sameRevision(execution.producingRevision, candidateRevision);
}

import {
  normalizeCurrentnessQualification,
  normalizeDefinitionRevisionRef,
  type CurrentnessQualification,
  type DefinitionRevisionRef,
} from "../semantic-substrate/index.js";
import {
  normalizeEvidenceProvenanceExtension,
  type EvidenceProvenanceExtension,
} from "../evidence-provenance/index.js";
import {
  ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
  normalizeInformationRecord,
  type InformationRecord,
} from "./index.js";

export type EKBRecordQualification = Readonly<{
  contractVersion: typeof ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION;
  record: InformationRecord;
  semanticOwnerRevision: DefinitionRevisionRef;
  evidence: EvidenceProvenanceExtension;
  currentness: CurrentnessQualification;
  populationScope: string;
  localityScope: string;
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

function revisionKey(ref: DefinitionRevisionRef): string {
  return [ref.semanticOwner, ref.semanticKind, ref.canonicalRef, ref.definitionRef, ref.revisionOwner, ref.revisionDimension, ref.revisionRef].join("\u0000");
}

export function normalizeEKBRecordQualification(input: unknown): EKBRecordQualification {
  const record = asRecord(input, "EKB record qualification");
  assertExactFields(record, ["contractVersion", "record", "semanticOwnerRevision", "evidence", "currentness", "populationScope", "localityScope"], "EKB record qualification");
  if (record.contractVersion !== ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION) throw new Error(`unsupported EKB contract version: ${String(record.contractVersion)}`);

  const informationRecord = normalizeInformationRecord(record.record);
  const semanticOwnerRevision = normalizeDefinitionRevisionRef(record.semanticOwnerRevision);
  const evidence = normalizeEvidenceProvenanceExtension(record.evidence);
  const currentness = normalizeCurrentnessQualification(record.currentness);
  const populationScope = nonEmpty(record.populationScope, "populationScope");
  const localityScope = nonEmpty(record.localityScope, "localityScope");

  if (revisionKey(currentness.subject) !== revisionKey(semanticOwnerRevision)) {
    throw new Error("currentness subject must exactly match the qualified semantic owner revision");
  }
  if (currentness.populationScope !== populationScope) {
    throw new Error("currentness population scope must exactly match EKB qualification population scope");
  }
  if (currentness.localityScope !== localityScope) {
    throw new Error("currentness locality scope must exactly match EKB qualification locality scope");
  }

  if ((informationRecord.kind === "Fact" || informationRecord.kind === "Decision" || informationRecord.kind === "Requirement") && currentness.state !== "CURRENT") {
    throw new Error(`${informationRecord.kind} requires CURRENT qualification; ${currentness.state} cannot be silently promoted`);
  }

  return Object.freeze({
    contractVersion: ELICITATION_KNOWLEDGE_BASE_CONTRACT_VERSION,
    record: informationRecord,
    semanticOwnerRevision,
    evidence,
    currentness,
    populationScope,
    localityScope,
  });
}

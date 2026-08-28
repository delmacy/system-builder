import {
  calculateProcessSemanticChangeDiff,
  normalizeProcessSemanticChangeRationaleEvidence,
} from "@system-builder/contracts/process-change";
import { EvolutionRequestEvidence } from "./evolution-request.js";

export type EvolutionSemanticChangeAdmission = Readonly<{
  changeRef: string;
  artifactRef: string;
  fromRevisionRef: string;
  toRevisionRef: string;
}>;

export type EvolutionSemanticChangeBinding = Readonly<{
  evolutionRequestId: string;
  changeRef: string;
  artifactRef: string;
  fromRevisionRef: string;
  toRevisionRef: string;
  diffRef: string;
  classificationRef: string;
  reasonRef: string;
  evidenceRefs: readonly string[];
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("EVOLUTION_SEMANTIC_CHANGE_ADMISSION:INPUT_OBJECT_REQUIRED");
  }
  return value as UnknownRecord;
}

function assertExactFields(record: UnknownRecord, fields: readonly string[]): void {
  for (const key of Object.keys(record)) {
    if (!fields.includes(key)) {
      throw new Error(`EVOLUTION_SEMANTIC_CHANGE_ADMISSION:UNEXPECTED_FIELD:${key}`);
    }
  }
  for (const key of fields) {
    if (!(key in record)) {
      throw new Error(`EVOLUTION_SEMANTIC_CHANGE_ADMISSION:MISSING_FIELD:${key}`);
    }
  }
}

function reference(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0 || /\s/.test(value.trim())) {
    throw new Error(`EVOLUTION_SEMANTIC_CHANGE_ADMISSION:INVALID_REFERENCE:${field}`);
  }
  return value.trim();
}

export function admitEvolutionSemanticChange(input: unknown): EvolutionSemanticChangeAdmission {
  const record = asRecord(input);
  assertExactFields(record, ["changeRef", "fromRevision", "toRevision", "fromSnapshot", "toSnapshot"]);

  const changeRef = reference(record.changeRef, "changeRef");
  const semanticDiff = calculateProcessSemanticChangeDiff({
    fromRevision: record.fromRevision,
    toRevision: record.toRevision,
    fromSnapshot: record.fromSnapshot,
    toSnapshot: record.toSnapshot,
  });

  return Object.freeze({
    changeRef,
    artifactRef: semanticDiff.artifactRef,
    fromRevisionRef: semanticDiff.fromRevisionRef,
    toRevisionRef: semanticDiff.toRevisionRef,
  });
}

export function bindEvolutionSemanticChangeToRequest(input: unknown): EvolutionSemanticChangeBinding {
  const record = asRecord(input);
  assertExactFields(record, [
    "evolutionRequest",
    "changeRef",
    "fromRevision",
    "toRevision",
    "fromSnapshot",
    "toSnapshot",
    "rationaleEvidence",
  ]);

  const evolutionRequest = EvolutionRequestEvidence.validate(record.evolutionRequest);
  const admission = admitEvolutionSemanticChange({
    changeRef: record.changeRef,
    fromRevision: record.fromRevision,
    toRevision: record.toRevision,
    fromSnapshot: record.fromSnapshot,
    toSnapshot: record.toSnapshot,
  });
  const rationale = normalizeProcessSemanticChangeRationaleEvidence(record.rationaleEvidence);

  if (
    rationale.artifactRef !== admission.artifactRef ||
    rationale.fromRevisionRef !== admission.fromRevisionRef ||
    rationale.toRevisionRef !== admission.toRevisionRef
  ) {
    throw new Error("EVOLUTION_SEMANTIC_CHANGE_BINDING:REVISION_ENDPOINT_MISMATCH");
  }
  if (evolutionRequest.changeEvidenceRef !== admission.changeRef) {
    throw new Error("EVOLUTION_SEMANTIC_CHANGE_BINDING:CHANGE_REFERENCE_MISMATCH");
  }
  if (evolutionRequest.reasonRef !== rationale.reasonRef) {
    throw new Error("EVOLUTION_SEMANTIC_CHANGE_BINDING:REASON_REFERENCE_MISMATCH");
  }

  return Object.freeze({
    evolutionRequestId: evolutionRequest.evolutionRequestId,
    changeRef: admission.changeRef,
    artifactRef: admission.artifactRef,
    fromRevisionRef: admission.fromRevisionRef,
    toRevisionRef: admission.toRevisionRef,
    diffRef: rationale.diffRef,
    classificationRef: rationale.classificationRef,
    reasonRef: rationale.reasonRef,
    evidenceRefs: Object.freeze([...rationale.evidenceRefs]),
  });
}

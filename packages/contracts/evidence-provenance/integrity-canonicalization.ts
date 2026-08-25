import { canonicalJson } from "@system-builder/deterministic";
import {
  EVIDENCE_PROVENANCE_EXTENSION_VERSION,
  normalizeEvidenceProvenanceExtension,
  type EvidenceClassification,
  type EvidenceLineage,
  type EvidenceSourceReference,
  type EvidenceTransformationDescriptor,
} from "./index.js";

export type EvidenceProvenanceIntegrityInput = Readonly<{
  extensionVersion: typeof EVIDENCE_PROVENANCE_EXTENSION_VERSION;
  evidenceId: string;
  sources: readonly EvidenceSourceReference[];
  classification?: EvidenceClassification;
  transformations: readonly EvidenceTransformationDescriptor[];
  lineage: EvidenceLineage;
}>;

export function projectEvidenceProvenanceIntegrityInput(input: unknown): EvidenceProvenanceIntegrityInput {
  const normalized = normalizeEvidenceProvenanceExtension(input);
  return {
    extensionVersion: normalized.extensionVersion,
    evidenceId: normalized.evidenceId,
    sources: normalized.sources,
    ...(normalized.classification === undefined ? {} : { classification: normalized.classification }),
    transformations: normalized.transformations,
    lineage: normalized.lineage,
  };
}

export function canonicalEvidenceProvenanceIntegrityInput(input: unknown): string {
  return canonicalJson(projectEvidenceProvenanceIntegrityInput(input));
}

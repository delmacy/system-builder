import evidenceProvenanceExtensionSchema from "./evidence-provenance-extension.schema.json";

export const EVIDENCE_PROVENANCE_EXTENSION_VERSION = "1.0.0" as const;
export const EVIDENCE_PROVENANCE_EXTENSION_KEY = "system-builder.evidence-provenance" as const;

export type EvidenceSourceReference = Readonly<{
  sourceId: string;
  sourceType: string;
  capturedAt?: string;
  authorRef?: string;
}>;

export type EvidenceClassification = Readonly<{
  label: string;
  confidence?: number;
}>;

export type EvidenceTransformationDescriptor = Readonly<{
  descriptorId: string;
  descriptorVersion: string;
  tool?: Readonly<{ id: string; version?: string }>;
  provider?: Readonly<{ id: string }>;
}>;

export type EvidenceLineage = Readonly<{
  predecessorEvidenceIds: readonly string[];
}>;

/**
 * Additive provenance metadata carried through ArtifactEnvelope.extensions.
 * This contract is evidence/traceability only and never grants execution authority.
 * ArtifactEnvelope.provenance.producer and provenance.inputs remain authoritative
 * for producer and input-artifact predecessor semantics.
 */
export type EvidenceProvenanceExtension = Readonly<{
  extensionVersion: typeof EVIDENCE_PROVENANCE_EXTENSION_VERSION;
  evidenceId: string;
  sources: readonly EvidenceSourceReference[];
  classification?: EvidenceClassification;
  transformations: readonly EvidenceTransformationDescriptor[];
  lineage: EvidenceLineage;
}>;

export { evidenceProvenanceExtensionSchema };

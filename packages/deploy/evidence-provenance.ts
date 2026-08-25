export type DeployEvidenceProvenance = Readonly<{
  extensionVersion: "1.0.0";
  evidenceId: string;
  sources: readonly Readonly<{
    sourceId: string;
    sourceType: string;
    capturedAt?: string;
    authorRef?: string;
    correlationRef?: string;
    locationHint?: string;
  }>[];
  classification?: Readonly<{ label?: string; confidence?: number }>;
  transformations: readonly Readonly<{
    descriptorId: string;
    descriptorVersion: string;
    tool?: Readonly<{ id: string; version?: string }>;
    provider?: Readonly<{ id: string }>;
  }>[];
  lineage: Readonly<{ predecessorEvidenceIds: readonly string[] }>;
}>;

export function immutableDeployEvidenceProvenance(input: DeployEvidenceProvenance): DeployEvidenceProvenance {
  return Object.freeze({
    extensionVersion: input.extensionVersion,
    evidenceId: input.evidenceId,
    sources: Object.freeze(input.sources.map((source) => Object.freeze({ ...source }))),
    ...(input.classification === undefined ? {} : { classification: Object.freeze({ ...input.classification }) }),
    transformations: Object.freeze(input.transformations.map((transformation) => Object.freeze({
      descriptorId: transformation.descriptorId,
      descriptorVersion: transformation.descriptorVersion,
      ...(transformation.tool === undefined ? {} : { tool: Object.freeze({ ...transformation.tool }) }),
      ...(transformation.provider === undefined ? {} : { provider: Object.freeze({ ...transformation.provider }) }),
    }))),
    lineage: Object.freeze({ predecessorEvidenceIds: Object.freeze([...input.lineage.predecessorEvidenceIds]) }),
  });
}

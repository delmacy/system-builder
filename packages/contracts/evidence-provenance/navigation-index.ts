import { normalizeEvidenceProvenanceExtension, type EvidenceProvenanceExtension } from "./index.js";
import { normalizeEvidenceNavigationProjection, type EvidenceNavigationProjection } from "./navigation-projection.js";

export type EvidenceNavigationSourceEntry = Readonly<{
  sourceId: string;
  evidenceIds: readonly string[];
}>;

export type EvidenceNavigationIndex = Readonly<{
  projections: readonly EvidenceNavigationProjection[];
  sources: readonly EvidenceNavigationSourceEntry[];
}>;

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function fail(reason: string): never {
  throw new TypeError(`Invalid evidence navigation index: ${reason}`);
}

export function buildEvidenceNavigationIndex(records: readonly EvidenceProvenanceExtension[]): EvidenceNavigationIndex {
  if (!Array.isArray(records)) fail("expected provenance array");

  const projectionsByEvidence = new Map<string, EvidenceNavigationProjection>();
  const evidenceIdsBySource = new Map<string, Set<string>>();

  for (const record of records) {
    const provenance = normalizeEvidenceProvenanceExtension(record);
    if (projectionsByEvidence.has(provenance.evidenceId)) {
      fail(`duplicate evidenceId ${provenance.evidenceId}`);
    }

    const projection = normalizeEvidenceNavigationProjection({
      evidenceId: provenance.evidenceId,
      sourceIds: provenance.sources.map((source) => source.sourceId),
      predecessorEvidenceIds: provenance.lineage.predecessorEvidenceIds,
    });
    projectionsByEvidence.set(projection.evidenceId, projection);

    for (const sourceId of projection.sourceIds) {
      const evidenceIds = evidenceIdsBySource.get(sourceId) ?? new Set<string>();
      evidenceIds.add(projection.evidenceId);
      evidenceIdsBySource.set(sourceId, evidenceIds);
    }
  }

  const projections = [...projectionsByEvidence.values()].sort((left, right) => compareStrings(left.evidenceId, right.evidenceId));
  const sources = [...evidenceIdsBySource.entries()]
    .sort(([left], [right]) => compareStrings(left, right))
    .map(([sourceId, evidenceIds]) => ({
      sourceId,
      evidenceIds: [...evidenceIds].sort(compareStrings),
    }));

  return { projections, sources };
}

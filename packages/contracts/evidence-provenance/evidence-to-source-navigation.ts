import type { EvidenceNavigationIndex } from "./navigation-index.js";

export type EvidenceToSourceNavigationResult = Readonly<{
  evidenceId: string;
  found: boolean;
  sourceIds: readonly string[];
}>;

const URI_PATTERN = /^[A-Za-z][A-Za-z0-9+.-]*:\S+$/;

function evidenceIdAt(value: unknown): string {
  if (typeof value !== "string" || !URI_PATTERN.test(value)) {
    throw new TypeError("Invalid evidence navigation query: malformed evidenceId");
  }
  return value;
}

export function querySourcesByEvidence(
  index: EvidenceNavigationIndex,
  evidenceId: string,
): EvidenceToSourceNavigationResult {
  const normalizedEvidenceId = evidenceIdAt(evidenceId);
  const projection = index.projections.find((candidate) => candidate.evidenceId === normalizedEvidenceId);

  if (!projection) {
    return { evidenceId: normalizedEvidenceId, found: false, sourceIds: [] };
  }

  return {
    evidenceId: normalizedEvidenceId,
    found: true,
    sourceIds: [...projection.sourceIds],
  };
}

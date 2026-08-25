import type { EvidenceNavigationIndex } from "./navigation-index.js";
import { validateEvidenceNavigationIndex } from "./navigation-validation.js";

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

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function querySourcesByEvidence(
  index: EvidenceNavigationIndex,
  evidenceId: string,
): EvidenceToSourceNavigationResult {
  const normalizedEvidenceId = evidenceIdAt(evidenceId);
  validateEvidenceNavigationIndex(index);
  const projection = index.projections.find((candidate) => candidate.evidenceId === normalizedEvidenceId);

  if (!projection) {
    return { evidenceId: normalizedEvidenceId, found: false, sourceIds: [] };
  }

  return {
    evidenceId: normalizedEvidenceId,
    found: true,
    sourceIds: [...projection.sourceIds].sort(compareStrings),
  };
}

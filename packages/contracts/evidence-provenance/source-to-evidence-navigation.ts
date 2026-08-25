import type { EvidenceNavigationIndex } from "./navigation-index.js";

export type SourceToEvidenceNavigationResult = Readonly<{
  sourceId: string;
  found: boolean;
  evidenceIds: readonly string[];
}>;

const URI_PATTERN = /^[A-Za-z][A-Za-z0-9+.-]*:\S+$/;

function sourceIdAt(value: unknown): string {
  if (typeof value !== "string" || !URI_PATTERN.test(value)) {
    throw new TypeError("Invalid source navigation query: malformed sourceId");
  }
  return value;
}

export function queryEvidenceBySource(
  index: EvidenceNavigationIndex,
  sourceId: string,
): SourceToEvidenceNavigationResult {
  const normalizedSourceId = sourceIdAt(sourceId);
  const entry = index.sources.find((candidate) => candidate.sourceId === normalizedSourceId);

  if (!entry) {
    return { sourceId: normalizedSourceId, found: false, evidenceIds: [] };
  }

  return {
    sourceId: normalizedSourceId,
    found: true,
    evidenceIds: [...entry.evidenceIds],
  };
}

import type { EvidenceNavigationIndex } from "./navigation-index.js";
import { normalizeEvidenceNavigationProjection } from "./navigation-projection.js";

const URI_PATTERN = /^[A-Za-z][A-Za-z0-9+.-]*:\S+$/;

function fail(reason: string): never {
  throw new TypeError(`Invalid evidence navigation index: ${reason}`);
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function uriAt(value: unknown, path: string): string {
  if (typeof value !== "string" || !URI_PATTERN.test(value)) fail(`malformed identifier at ${path}`);
  return value;
}

export function validateEvidenceNavigationIndex(index: EvidenceNavigationIndex): void {
  if (typeof index !== "object" || index === null || !Array.isArray(index.projections) || !Array.isArray(index.sources)) {
    fail("expected projections and sources arrays");
  }

  const projectionsByEvidence = new Map<string, ReturnType<typeof normalizeEvidenceNavigationProjection>>();
  for (const projection of index.projections) {
    const normalized = normalizeEvidenceNavigationProjection(projection);
    if (projectionsByEvidence.has(normalized.evidenceId)) fail(`duplicate evidenceId ${normalized.evidenceId}`);
    projectionsByEvidence.set(normalized.evidenceId, normalized);
  }

  const expectedEvidenceBySource = new Map<string, Set<string>>();
  for (const projection of projectionsByEvidence.values()) {
    for (const sourceId of projection.sourceIds) {
      const evidenceIds = expectedEvidenceBySource.get(sourceId) ?? new Set<string>();
      evidenceIds.add(projection.evidenceId);
      expectedEvidenceBySource.set(sourceId, evidenceIds);
    }
  }

  const observedSources = new Set<string>();
  for (const entry of index.sources) {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) fail("malformed source entry");
    const sourceId = uriAt(entry.sourceId, "sources[].sourceId");
    if (observedSources.has(sourceId)) fail(`duplicate sourceId ${sourceId}`);
    observedSources.add(sourceId);
    if (!Array.isArray(entry.evidenceIds)) fail(`malformed evidenceIds for sourceId ${sourceId}`);
    const evidenceIds = entry.evidenceIds.map((evidenceId: unknown, position: number) => uriAt(evidenceId, `sources[].evidenceIds[${position}]`));
    if (new Set(evidenceIds).size !== evidenceIds.length) fail(`duplicate evidence relation for sourceId ${sourceId}`);

    const expected = [...(expectedEvidenceBySource.get(sourceId) ?? new Set<string>())].sort(compareStrings);
    const observed = [...evidenceIds].sort(compareStrings);
    if (expected.length !== observed.length || expected.some((value, position) => value !== observed[position])) {
      fail(`conflicting explicit relation for sourceId ${sourceId}`);
    }
  }

  for (const sourceId of expectedEvidenceBySource.keys()) {
    if (!observedSources.has(sourceId)) fail(`missing explicit source relation for sourceId ${sourceId}`);
  }
}

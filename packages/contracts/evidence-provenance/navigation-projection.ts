export type EvidenceNavigationProjection = Readonly<{
  evidenceId: string;
  sourceIds: readonly string[];
  predecessorEvidenceIds: readonly string[];
}>;

const URI_PATTERN = /^[A-Za-z][A-Za-z0-9+.-]*:\S+$/;

function fail(path: string, reason: string): never {
  throw new TypeError(`Invalid evidence navigation projection at ${path}: ${reason}`);
}

function uriAt(value: unknown, path: string): string {
  if (typeof value !== "string" || !URI_PATTERN.test(value)) fail(path, "malformed identifier");
  return value;
}

function normalizeUriArray(value: unknown, path: string): readonly string[] {
  if (!Array.isArray(value)) fail(path, "expected array");
  const normalized = value.map((item, index) => uriAt(item, `${path}[${index}]`));
  if (new Set(normalized).size !== normalized.length) fail(path, "duplicate identifier");
  return normalized.sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));
}

export function normalizeEvidenceNavigationProjection(input: unknown): EvidenceNavigationProjection {
  if (typeof input !== "object" || input === null || Array.isArray(input)) fail("$projection", "expected object");
  const candidate = input as Record<string, unknown>;
  const allowed = new Set(["evidenceId", "sourceIds", "predecessorEvidenceIds"]);
  const unexpected = Object.keys(candidate).filter((key) => !allowed.has(key)).sort();
  if (unexpected.length > 0) fail("$projection", `unexpected field ${unexpected[0]}`);

  return {
    evidenceId: uriAt(candidate.evidenceId, "$projection.evidenceId"),
    sourceIds: normalizeUriArray(candidate.sourceIds, "$projection.sourceIds"),
    predecessorEvidenceIds: normalizeUriArray(candidate.predecessorEvidenceIds, "$projection.predecessorEvidenceIds"),
  };
}

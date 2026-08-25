export type ReleaseEvidenceProvenance = Readonly<{
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

const URI = /^[A-Za-z][A-Za-z0-9+.-]*:\S+$/;
const TOKEN = /^\S+$/;
const LABEL = /^\S(?:[^\r\n]*\S)?$/;
const SEMVER = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;
const UTC = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+)?Z$/;

function fail(path: string, reason: string): never {
  throw new TypeError(`Invalid evidence provenance at ${path}: ${reason}`);
}
function record(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail(path, "expected object");
  return value as Record<string, unknown>;
}
function exact(value: Record<string, unknown>, allowed: readonly string[], path: string): void {
  const keys = new Set(allowed);
  const unexpected = Object.keys(value).filter((key) => !keys.has(key)).sort();
  if (unexpected[0]) fail(path, `unexpected field ${unexpected[0]}`);
}
function text(value: unknown, pattern: RegExp, path: string): string {
  if (typeof value !== "string" || !pattern.test(value)) fail(path, "malformed value");
  return value;
}
function order(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function normalizeReleaseEvidenceProvenance(input: unknown): ReleaseEvidenceProvenance {
  const candidate = record(input, "$evidenceProvenance");
  exact(candidate, ["extensionVersion", "evidenceId", "sources", "classification", "transformations", "lineage"], "$evidenceProvenance");
  if (candidate.extensionVersion !== "1.0.0") fail("$evidenceProvenance.extensionVersion", "unsupported version");
  const evidenceId = text(candidate.evidenceId, URI, "$evidenceProvenance.evidenceId");

  if (!Array.isArray(candidate.sources)) fail("$evidenceProvenance.sources", "expected array");
  const sources = candidate.sources.map((item, index) => {
    const source = record(item, `$evidenceProvenance.sources[${index}]`);
    exact(source, ["sourceId", "sourceType", "capturedAt", "authorRef", "correlationRef", "locationHint"], `$evidenceProvenance.sources[${index}]`);
    const normalized: {
      sourceId: string; sourceType: string; capturedAt?: string; authorRef?: string; correlationRef?: string; locationHint?: string;
    } = {
      sourceId: text(source.sourceId, URI, `$evidenceProvenance.sources[${index}].sourceId`),
      sourceType: text(source.sourceType, TOKEN, `$evidenceProvenance.sources[${index}].sourceType`),
    };
    if (source.capturedAt !== undefined) normalized.capturedAt = text(source.capturedAt, UTC, `$evidenceProvenance.sources[${index}].capturedAt`);
    if (source.authorRef !== undefined) normalized.authorRef = text(source.authorRef, TOKEN, `$evidenceProvenance.sources[${index}].authorRef`);
    if (source.correlationRef !== undefined) normalized.correlationRef = text(source.correlationRef, URI, `$evidenceProvenance.sources[${index}].correlationRef`);
    if (source.locationHint !== undefined) normalized.locationHint = text(source.locationHint, URI, `$evidenceProvenance.sources[${index}].locationHint`);
    return normalized;
  });
  if (new Set(sources.map((source) => source.sourceId)).size !== sources.length) fail("$evidenceProvenance.sources", "duplicate sourceId");
  sources.sort((left, right) => order(left.sourceId, right.sourceId));

  let classification: { label?: string; confidence?: number } | undefined;
  if (candidate.classification !== undefined) {
    const raw = record(candidate.classification, "$evidenceProvenance.classification");
    exact(raw, ["label", "confidence"], "$evidenceProvenance.classification");
    if (raw.label === undefined && raw.confidence === undefined) fail("$evidenceProvenance.classification", "expected label and/or confidence");
    classification = {};
    if (raw.label !== undefined) classification.label = text(raw.label, LABEL, "$evidenceProvenance.classification.label");
    if (raw.confidence !== undefined) {
      if (typeof raw.confidence !== "number" || !Number.isFinite(raw.confidence) || raw.confidence < 0 || raw.confidence > 1) {
        fail("$evidenceProvenance.classification.confidence", "expected finite number from 0 through 1");
      }
      classification.confidence = raw.confidence;
    }
  }

  if (!Array.isArray(candidate.transformations)) fail("$evidenceProvenance.transformations", "expected array");
  const transformations = candidate.transformations.map((item, index) => {
    const raw = record(item, `$evidenceProvenance.transformations[${index}]`);
    exact(raw, ["descriptorId", "descriptorVersion", "tool", "provider"], `$evidenceProvenance.transformations[${index}]`);
    const normalized: {
      descriptorId: string; descriptorVersion: string; tool?: { id: string; version?: string }; provider?: { id: string };
    } = {
      descriptorId: text(raw.descriptorId, TOKEN, `$evidenceProvenance.transformations[${index}].descriptorId`),
      descriptorVersion: text(raw.descriptorVersion, SEMVER, `$evidenceProvenance.transformations[${index}].descriptorVersion`),
    };
    if (raw.tool !== undefined) {
      const tool = record(raw.tool, `$evidenceProvenance.transformations[${index}].tool`);
      exact(tool, ["id", "version"], `$evidenceProvenance.transformations[${index}].tool`);
      normalized.tool = { id: text(tool.id, TOKEN, `$evidenceProvenance.transformations[${index}].tool.id`) };
      if (tool.version !== undefined) normalized.tool.version = text(tool.version, TOKEN, `$evidenceProvenance.transformations[${index}].tool.version`);
    }
    if (raw.provider !== undefined) {
      const provider = record(raw.provider, `$evidenceProvenance.transformations[${index}].provider`);
      exact(provider, ["id"], `$evidenceProvenance.transformations[${index}].provider`);
      normalized.provider = { id: text(provider.id, TOKEN, `$evidenceProvenance.transformations[${index}].provider.id`) };
    }
    return normalized;
  });
  const transformationKeys = transformations.map((item) => `${item.descriptorId}@${item.descriptorVersion}`);
  if (new Set(transformationKeys).size !== transformationKeys.length) fail("$evidenceProvenance.transformations", "duplicate descriptor");

  const lineage = record(candidate.lineage, "$evidenceProvenance.lineage");
  exact(lineage, ["predecessorEvidenceIds"], "$evidenceProvenance.lineage");
  if (!Array.isArray(lineage.predecessorEvidenceIds)) fail("$evidenceProvenance.lineage.predecessorEvidenceIds", "expected array");
  const predecessorEvidenceIds = lineage.predecessorEvidenceIds.map((item, index) =>
    text(item, URI, `$evidenceProvenance.lineage.predecessorEvidenceIds[${index}]`),
  );
  if (new Set(predecessorEvidenceIds).size !== predecessorEvidenceIds.length) fail("$evidenceProvenance.lineage.predecessorEvidenceIds", "duplicate predecessor evidence identifier");
  predecessorEvidenceIds.sort(order);

  return {
    extensionVersion: "1.0.0",
    evidenceId,
    sources,
    ...(classification === undefined ? {} : { classification }),
    transformations,
    lineage: { predecessorEvidenceIds },
  };
}

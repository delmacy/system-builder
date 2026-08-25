export type CompilerEvidenceSourceReference = Readonly<{
  sourceId: string;
  sourceType: string;
  capturedAt?: string;
  authorRef?: string;
  correlationRef?: string;
  locationHint?: string;
}>;

export type CompilerEvidenceClassification = Readonly<{
  label?: string;
  confidence?: number;
}>;

export type CompilerEvidenceTransformationDescriptor = Readonly<{
  descriptorId: string;
  descriptorVersion: string;
  tool?: Readonly<{ id: string; version?: string }>;
  provider?: Readonly<{ id: string }>;
}>;

export type CompilerEvidenceProvenance = Readonly<{
  extensionVersion: "1.0.0";
  evidenceId: string;
  sources: readonly CompilerEvidenceSourceReference[];
  classification?: CompilerEvidenceClassification;
  transformations: readonly CompilerEvidenceTransformationDescriptor[];
  lineage: Readonly<{ predecessorEvidenceIds: readonly string[] }>;
}>;

const URI_PATTERN = /^[A-Za-z][A-Za-z0-9+.-]*:\S+$/;
const TOKEN_PATTERN = /^\S+$/;
const LABEL_PATTERN = /^\S(?:[^\r\n]*\S)?$/;
const SEMVER_PATTERN = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;
const UTC_TIMESTAMP_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+)?Z$/;

function fail(path: string, reason: string): never {
  throw new TypeError(`Invalid evidence provenance at ${path}: ${reason}`);
}

function recordAt(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail(path, "expected object");
  return value as Record<string, unknown>;
}

function exactKeys(record: Record<string, unknown>, allowed: readonly string[], path: string): void {
  const allowedKeys = new Set(allowed);
  const unexpected = Object.keys(record).filter((key) => !allowedKeys.has(key));
  if (unexpected.length > 0) fail(path, `unexpected field ${unexpected.sort()[0]}`);
}

function stringAt(value: unknown, pattern: RegExp, path: string): string {
  if (typeof value !== "string" || !pattern.test(value)) fail(path, "malformed value");
  return value;
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeSource(value: unknown, path: string): CompilerEvidenceSourceReference {
  const source = recordAt(value, path);
  exactKeys(source, ["sourceId", "sourceType", "capturedAt", "authorRef", "correlationRef", "locationHint"], path);
  const normalized: {
    sourceId: string;
    sourceType: string;
    capturedAt?: string;
    authorRef?: string;
    correlationRef?: string;
    locationHint?: string;
  } = {
    sourceId: stringAt(source.sourceId, URI_PATTERN, `${path}.sourceId`),
    sourceType: stringAt(source.sourceType, TOKEN_PATTERN, `${path}.sourceType`),
  };
  if (source.capturedAt !== undefined) normalized.capturedAt = stringAt(source.capturedAt, UTC_TIMESTAMP_PATTERN, `${path}.capturedAt`);
  if (source.authorRef !== undefined) normalized.authorRef = stringAt(source.authorRef, TOKEN_PATTERN, `${path}.authorRef`);
  if (source.correlationRef !== undefined) normalized.correlationRef = stringAt(source.correlationRef, URI_PATTERN, `${path}.correlationRef`);
  if (source.locationHint !== undefined) normalized.locationHint = stringAt(source.locationHint, URI_PATTERN, `${path}.locationHint`);
  return normalized;
}

function normalizeClassification(value: unknown, path: string): CompilerEvidenceClassification {
  const classification = recordAt(value, path);
  exactKeys(classification, ["label", "confidence"], path);
  if (classification.label === undefined && classification.confidence === undefined) fail(path, "expected label and/or confidence");
  const normalized: { label?: string; confidence?: number } = {};
  if (classification.label !== undefined) normalized.label = stringAt(classification.label, LABEL_PATTERN, `${path}.label`);
  if (classification.confidence !== undefined) {
    if (
      typeof classification.confidence !== "number" ||
      !Number.isFinite(classification.confidence) ||
      classification.confidence < 0 ||
      classification.confidence > 1
    ) {
      fail(`${path}.confidence`, "expected finite number from 0 through 1");
    }
    normalized.confidence = classification.confidence;
  }
  return normalized;
}

function normalizeTransformation(value: unknown, path: string): CompilerEvidenceTransformationDescriptor {
  const transformation = recordAt(value, path);
  exactKeys(transformation, ["descriptorId", "descriptorVersion", "tool", "provider"], path);
  const normalized: {
    descriptorId: string;
    descriptorVersion: string;
    tool?: { id: string; version?: string };
    provider?: { id: string };
  } = {
    descriptorId: stringAt(transformation.descriptorId, TOKEN_PATTERN, `${path}.descriptorId`),
    descriptorVersion: stringAt(transformation.descriptorVersion, SEMVER_PATTERN, `${path}.descriptorVersion`),
  };
  if (transformation.tool !== undefined) {
    const tool = recordAt(transformation.tool, `${path}.tool`);
    exactKeys(tool, ["id", "version"], `${path}.tool`);
    const normalizedTool: { id: string; version?: string } = {
      id: stringAt(tool.id, TOKEN_PATTERN, `${path}.tool.id`),
    };
    if (tool.version !== undefined) normalizedTool.version = stringAt(tool.version, TOKEN_PATTERN, `${path}.tool.version`);
    normalized.tool = normalizedTool;
  }
  if (transformation.provider !== undefined) {
    const provider = recordAt(transformation.provider, `${path}.provider`);
    exactKeys(provider, ["id"], `${path}.provider`);
    normalized.provider = { id: stringAt(provider.id, TOKEN_PATTERN, `${path}.provider.id`) };
  }
  return normalized;
}

export function normalizeCompilerEvidenceProvenance(input: unknown): CompilerEvidenceProvenance {
  const candidate = recordAt(input, "$evidenceProvenance");
  exactKeys(candidate, ["extensionVersion", "evidenceId", "sources", "classification", "transformations", "lineage"], "$evidenceProvenance");
  if (candidate.extensionVersion !== "1.0.0") fail("$evidenceProvenance.extensionVersion", "unsupported version");
  const evidenceId = stringAt(candidate.evidenceId, URI_PATTERN, "$evidenceProvenance.evidenceId");

  if (!Array.isArray(candidate.sources)) fail("$evidenceProvenance.sources", "expected array");
  const sources = candidate.sources.map((source, index) => normalizeSource(source, `$evidenceProvenance.sources[${index}]`));
  const sourceIds = new Set<string>();
  for (const source of sources) {
    if (sourceIds.has(source.sourceId)) fail("$evidenceProvenance.sources", `duplicate sourceId ${source.sourceId}`);
    sourceIds.add(source.sourceId);
  }
  sources.sort((left, right) => compareStrings(left.sourceId, right.sourceId));

  if (!Array.isArray(candidate.transformations)) fail("$evidenceProvenance.transformations", "expected array");
  const transformations = candidate.transformations.map((transformation, index) =>
    normalizeTransformation(transformation, `$evidenceProvenance.transformations[${index}]`),
  );
  const transformationIds = new Set<string>();
  for (const transformation of transformations) {
    const identity = `${transformation.descriptorId}@${transformation.descriptorVersion}`;
    if (transformationIds.has(identity)) fail("$evidenceProvenance.transformations", `duplicate descriptor ${identity}`);
    transformationIds.add(identity);
  }

  const lineage = recordAt(candidate.lineage, "$evidenceProvenance.lineage");
  exactKeys(lineage, ["predecessorEvidenceIds"], "$evidenceProvenance.lineage");
  if (!Array.isArray(lineage.predecessorEvidenceIds)) fail("$evidenceProvenance.lineage.predecessorEvidenceIds", "expected array");
  const predecessorEvidenceIds = lineage.predecessorEvidenceIds.map((value, index) =>
    stringAt(value, URI_PATTERN, `$evidenceProvenance.lineage.predecessorEvidenceIds[${index}]`),
  );
  if (new Set(predecessorEvidenceIds).size !== predecessorEvidenceIds.length) {
    fail("$evidenceProvenance.lineage.predecessorEvidenceIds", "duplicate predecessor evidence identifier");
  }
  predecessorEvidenceIds.sort(compareStrings);

  const normalized: {
    extensionVersion: "1.0.0";
    evidenceId: string;
    sources: readonly CompilerEvidenceSourceReference[];
    classification?: CompilerEvidenceClassification;
    transformations: readonly CompilerEvidenceTransformationDescriptor[];
    lineage: Readonly<{ predecessorEvidenceIds: readonly string[] }>;
  } = {
    extensionVersion: "1.0.0",
    evidenceId,
    sources,
    transformations,
    lineage: { predecessorEvidenceIds },
  };
  if (candidate.classification !== undefined) {
    normalized.classification = normalizeClassification(candidate.classification, "$evidenceProvenance.classification");
  }
  return normalized;
}

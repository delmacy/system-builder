export type ReleaseArtifactInput = Readonly<{
  kind: "ReleaseArtifact";
  artifactHash: string;
  validationEvidenceRef: string;
}>;

export type PublishedReleaseStatus = "published" | "deprecated" | "archived";

export type PublishedRelease = Readonly<{
  kind: "PublishedRelease";
  releaseId: string;
  version: string;
  artifactRef: string;
  artifactHash: string;
  validationEvidenceRef: string;
  publishedAt: string;
  status: PublishedReleaseStatus;
}>;

function requireToken(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`RELEASE_INVALID_${field.toUpperCase()}`);
  return normalized;
}

function identity(releaseId: string, version: string): string {
  return `${releaseId}@${version}`;
}

function assertHash(value: string): void {
  if (!/^sha256:[a-f0-9]{64}$/.test(value)) throw new Error("RELEASE_INVALID_ARTIFACT_HASH");
}

const transitions: Readonly<Record<PublishedReleaseStatus, readonly PublishedReleaseStatus[]>> = {
  published: ["deprecated"],
  deprecated: ["archived"],
  archived: [],
};

export class ReleaseRegistry {
  readonly #records = new Map<string, PublishedRelease>();

  publish(input: Readonly<{
    releaseId: string;
    version: string;
    artifact: ReleaseArtifactInput;
    publishedAt: string;
  }>): PublishedRelease {
    if (input.artifact.kind !== "ReleaseArtifact") throw new Error("RELEASE_INVALID_ARTIFACT");
    assertHash(input.artifact.artifactHash);
    const releaseId = requireToken(input.releaseId, "release_id");
    const version = requireToken(input.version, "version");
    const key = identity(releaseId, version);
    if (this.#records.has(key)) throw new Error(`RELEASE_DUPLICATE_IDENTITY:${key}`);

    const record = Object.freeze({
      kind: "PublishedRelease" as const,
      releaseId,
      version,
      artifactRef: input.artifact.artifactHash,
      artifactHash: input.artifact.artifactHash,
      validationEvidenceRef: requireToken(input.artifact.validationEvidenceRef, "validation_evidence_ref"),
      publishedAt: requireToken(input.publishedAt, "published_at"),
      status: "published" as const,
    });
    this.#records.set(key, record);
    return record;
  }

  get(releaseId: string, version: string): PublishedRelease | undefined {
    const record = this.#records.get(identity(releaseId.trim(), version.trim()));
    return record === undefined ? undefined : Object.freeze({ ...record });
  }

  transition(releaseId: string, version: string, target: PublishedReleaseStatus): PublishedRelease {
    const key = identity(requireToken(releaseId, "release_id"), requireToken(version, "version"));
    const current = this.#records.get(key);
    if (!current) throw new Error(`RELEASE_NOT_FOUND:${key}`);
    if (!transitions[current.status].includes(target)) {
      throw new Error(`RELEASE_INVALID_TRANSITION:${current.status}->${target}`);
    }
    const next = Object.freeze({ ...current, status: target });
    this.#records.set(key, next);
    return next;
  }
}

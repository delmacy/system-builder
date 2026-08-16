export type ArtifactPayloadFile = Readonly<{
  path: string;
  content: string;
  contentHash: string;
}>;

export type ArtifactPayload = Readonly<{
  artifactHash: string;
  files: readonly ArtifactPayloadFile[];
}>;

export interface ArtifactPayloadReader {
  get(artifactHash: string): ArtifactPayload;
}

export interface ArtifactPayloadWriter {
  publish(input: Readonly<{
    artifactHash: string;
    files: readonly ArtifactPayloadFile[];
  }>): ArtifactPayload;
}

export type ArtifactPayloadRepository = ArtifactPayloadReader & ArtifactPayloadWriter;

function requireArtifactHash(value: string): string {
  const normalized = value.trim();
  if (!/^sha256:[a-f0-9]{64}$/.test(normalized)) {
    throw new Error("ARTIFACT_PAYLOAD_INVALID_ARTIFACT_HASH");
  }
  return normalized;
}

function snapshotFile(file: ArtifactPayloadFile): ArtifactPayloadFile {
  const path = file.path.trim();
  if (!path) throw new Error("ARTIFACT_PAYLOAD_INVALID_PATH");
  const contentHash = file.contentHash.trim();
  if (!contentHash) throw new Error(`ARTIFACT_PAYLOAD_INVALID_CONTENT_HASH:${path}`);
  return Object.freeze({ path, content: file.content, contentHash });
}

function snapshotPayload(artifactHash: string, files: readonly ArtifactPayloadFile[]): ArtifactPayload {
  const snapshot = files
    .map(snapshotFile)
    .sort((left, right) => left.path.localeCompare(right.path));
  return Object.freeze({
    artifactHash: requireArtifactHash(artifactHash),
    files: Object.freeze(snapshot),
  });
}

function clonePayload(payload: ArtifactPayload): ArtifactPayload {
  return snapshotPayload(payload.artifactHash, payload.files);
}

function samePayload(left: ArtifactPayload, right: ArtifactPayload): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export class InMemoryArtifactPayloadRepository implements ArtifactPayloadRepository {
  readonly #payloads = new Map<string, ArtifactPayload>();

  publish(input: Readonly<{
    artifactHash: string;
    files: readonly ArtifactPayloadFile[];
  }>): ArtifactPayload {
    const next = snapshotPayload(input.artifactHash, input.files);
    const current = this.#payloads.get(next.artifactHash);
    if (current) {
      if (!samePayload(current, next)) {
        throw new Error(`ARTIFACT_PAYLOAD_CONFLICT:${next.artifactHash}`);
      }
      return clonePayload(current);
    }
    this.#payloads.set(next.artifactHash, next);
    return clonePayload(next);
  }

  get(artifactHash: string): ArtifactPayload {
    const key = requireArtifactHash(artifactHash);
    const payload = this.#payloads.get(key);
    if (!payload) throw new Error(`ARTIFACT_PAYLOAD_NOT_FOUND:${key}`);
    return clonePayload(payload);
  }
}

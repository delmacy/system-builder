import { sha256Canonical, sha256Text } from "@system-builder/deterministic";

export type ArtifactPayloadFile = Readonly<{
  path: string;
  content: string;
  contentHash: string;
}>;

export type ArtifactPayload = Readonly<{
  artifactHash: string;
  files: readonly ArtifactPayloadFile[];
}>;

export type VerifiableReleaseArtifact = Readonly<{
  kind: "ReleaseArtifact";
  assemblyPlanRef: string;
  validationEvidenceRef: string;
  artifactHash: string;
  manifest: Readonly<{
    compilerVersion: string;
    runtimeVersion: string;
    files: readonly string[];
  }>;
  environmentSchema: readonly Readonly<{
    name: string;
    kind: "config" | "secret-reference";
    required: boolean;
  }>[];
}>;

export type VerifiedArtifactPayload = ArtifactPayload & Readonly<{ verified: true }>;

export interface ArtifactPayloadReader {
  get(artifactHash: string): ArtifactPayload;
}

export interface VerifiedArtifactPayloadReader {
  getVerified(artifact: VerifiableReleaseArtifact): VerifiedArtifactPayload;
}

export interface ArtifactPayloadWriter {
  publish(input: Readonly<{
    artifactHash: string;
    files: readonly ArtifactPayloadFile[];
  }>): ArtifactPayload;
}

export type ArtifactPayloadRepository = ArtifactPayloadReader & VerifiedArtifactPayloadReader & ArtifactPayloadWriter;

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

function verifyPayload(
  artifact: VerifiableReleaseArtifact,
  payload: ArtifactPayload,
): VerifiedArtifactPayload {
  if (artifact.kind !== "ReleaseArtifact") throw new Error("ARTIFACT_PAYLOAD_INVALID_RELEASE_ARTIFACT");
  const expectedArtifactHash = requireArtifactHash(artifact.artifactHash);
  if (payload.artifactHash !== expectedArtifactHash) {
    throw new Error("ARTIFACT_PAYLOAD_ARTIFACT_HASH_MISMATCH");
  }

  const seen = new Set<string>();
  for (const file of payload.files) {
    if (seen.has(file.path)) throw new Error(`ARTIFACT_PAYLOAD_DUPLICATE_PATH:${file.path}`);
    seen.add(file.path);
    const actualHash = sha256Text(file.content);
    if (actualHash !== file.contentHash) {
      throw new Error(`ARTIFACT_PAYLOAD_FILE_HASH_MISMATCH:${file.path}`);
    }
  }

  const manifestPaths = [...artifact.manifest.files].sort((left, right) => left.localeCompare(right));
  if (new Set(manifestPaths).size !== manifestPaths.length) {
    throw new Error("ARTIFACT_PAYLOAD_MANIFEST_MISMATCH");
  }
  const payloadPaths = payload.files.map((file) => file.path);
  if (JSON.stringify(payloadPaths) !== JSON.stringify(manifestPaths)) {
    throw new Error("ARTIFACT_PAYLOAD_MANIFEST_MISMATCH");
  }

  const canonicalArtifactPayload = {
    kind: "ReleaseArtifact" as const,
    assemblyPlanRef: artifact.assemblyPlanRef,
    validationEvidenceRef: artifact.validationEvidenceRef,
    manifest: artifact.manifest,
    environmentSchema: artifact.environmentSchema,
    fileHashes: payload.files.map((file) => ({ path: file.path, contentHash: file.contentHash })),
  };
  const actualArtifactHash = sha256Canonical(canonicalArtifactPayload);
  if (actualArtifactHash !== expectedArtifactHash) {
    throw new Error("ARTIFACT_PAYLOAD_AGGREGATE_HASH_MISMATCH");
  }

  const verified = clonePayload(payload);
  return Object.freeze({ ...verified, verified: true as const });
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

  getVerified(artifact: VerifiableReleaseArtifact): VerifiedArtifactPayload {
    return verifyPayload(artifact, this.get(artifact.artifactHash));
  }
}

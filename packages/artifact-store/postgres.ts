import { parsePostgresConnection, postgresQuery, sqlLiteral } from "@system-builder/postgres";
import {
  InMemoryArtifactPayloadRepository,
  type ArtifactPayload,
  type ArtifactPayloadFile,
  type ArtifactPayloadRepository,
  type VerifiableReleaseArtifact,
  type VerifiedArtifactPayload,
} from "./index.js";

function tableForScope(scope: string): string {
  const normalized = scope.trim().toLowerCase();
  if (!/^[a-z][a-z0-9_]{0,47}$/.test(normalized)) throw new Error("ARTIFACT_POSTGRES_SCOPE_INVALID");
  return `system_builder_artifact_${normalized}`;
}

function normalizeStoredPayload(artifactHash: string, encoded: string): ArtifactPayload {
  let value: unknown;
  try { value = JSON.parse(encoded) as unknown; } catch { throw new Error(`ARTIFACT_POSTGRES_RECORD_INVALID:${artifactHash}`); }
  if (typeof value !== "object" || value === null) throw new Error(`ARTIFACT_POSTGRES_RECORD_INVALID:${artifactHash}`);
  const payload = value as { artifactHash?: unknown; files?: unknown };
  if (payload.artifactHash !== artifactHash || !Array.isArray(payload.files)) throw new Error(`ARTIFACT_POSTGRES_RECORD_INVALID:${artifactHash}`);
  try {
    const repository = new InMemoryArtifactPayloadRepository();
    return repository.publish({ artifactHash, files: payload.files as readonly ArtifactPayloadFile[] });
  } catch {
    throw new Error(`ARTIFACT_POSTGRES_RECORD_INVALID:${artifactHash}`);
  }
}

export class PostgresArtifactPayloadRepository implements ArtifactPayloadRepository {
  readonly #connectionString: string;
  readonly #table: string;
  readonly #cache = new InMemoryArtifactPayloadRepository();
  readonly #persisted = new Set<string>();
  #pending: Promise<void> = Promise.resolve();

  private constructor(connectionString: string, table: string) { this.#connectionString = connectionString; this.#table = table; }

  static async open(connectionString: string, scope = "default"): Promise<PostgresArtifactPayloadRepository> {
    parsePostgresConnection(connectionString, "ARTIFACT");
    const repository = new PostgresArtifactPayloadRepository(connectionString, tableForScope(scope));
    await postgresQuery(connectionString, `CREATE TABLE IF NOT EXISTS ${repository.#table} (artifact_hash TEXT PRIMARY KEY, payload_json TEXT NOT NULL)`, "ARTIFACT");
    const rows = await postgresQuery(connectionString, `SELECT artifact_hash, payload_json FROM ${repository.#table} ORDER BY artifact_hash`, "ARTIFACT");
    for (const row of rows) {
      if (row.length < 2 || typeof row[0] !== "string" || typeof row[1] !== "string") throw new Error("ARTIFACT_POSTGRES_RECORD_INVALID:UNKNOWN");
      const payload = normalizeStoredPayload(row[0], row[1]);
      repository.#cache.publish(payload);
      repository.#persisted.add(payload.artifactHash);
    }
    return repository;
  }

  publish(input: Readonly<{ artifactHash: string; files: readonly ArtifactPayloadFile[] }>): ArtifactPayload {
    const payload = this.#cache.publish(input);
    if (!this.#persisted.has(payload.artifactHash)) {
      this.#persisted.add(payload.artifactHash);
      const encoded = JSON.stringify(payload);
      this.#pending = this.#pending.then(async () => {
        await postgresQuery(this.#connectionString, `INSERT INTO ${this.#table} (artifact_hash, payload_json) VALUES (${sqlLiteral(payload.artifactHash)}, ${sqlLiteral(encoded)})`, "ARTIFACT");
      });
    }
    return payload;
  }

  get(artifactHash: string): ArtifactPayload { return this.#cache.get(artifactHash); }
  getVerified(artifact: VerifiableReleaseArtifact): VerifiedArtifactPayload { return this.#cache.getVerified(artifact); }
  async flush(): Promise<void> { await this.#pending; }
  async close(): Promise<void> { await this.flush(); }
}

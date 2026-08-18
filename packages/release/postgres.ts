import { parsePostgresConnection, postgresQuery, sqlLiteral } from "@system-builder/postgres";
import type { PublishedRelease, PublishedReleaseStatus } from "./index.js";
import { InMemoryReleaseRecordStorage, type ReleaseRecordStorage } from "./storage.js";

function tableForScope(scope: string): string {
  const normalized = scope.trim().toLowerCase();
  if (!/^[a-z][a-z0-9_]{0,47}$/.test(normalized)) {
    throw new Error("RELEASE_POSTGRES_SCOPE_INVALID");
  }
  return `system_builder_release_${normalized}`;
}

function releaseIdentity(record: PublishedRelease): string {
  return `${record.releaseId}@${record.version}`;
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStatus(value: unknown): value is PublishedReleaseStatus {
  return value === "published" || value === "deprecated" || value === "archived";
}

function normalizeStoredRecord(identity: string, encoded: string): PublishedRelease {
  let value: unknown;
  try {
    value = JSON.parse(encoded) as unknown;
  } catch {
    throw new Error(`RELEASE_POSTGRES_RECORD_INVALID:${identity}`);
  }
  if (typeof value !== "object" || value === null) {
    throw new Error(`RELEASE_POSTGRES_RECORD_INVALID:${identity}`);
  }
  const record = value as Record<string, unknown>;
  if (
    record.kind !== "PublishedRelease" ||
    !nonEmptyString(record.releaseId) ||
    !nonEmptyString(record.version) ||
    !nonEmptyString(record.artifactRef) ||
    !nonEmptyString(record.artifactHash) ||
    !/^sha256:[a-f0-9]{64}$/.test(record.artifactHash) ||
    record.artifactRef !== record.artifactHash ||
    !nonEmptyString(record.validationEvidenceRef) ||
    !nonEmptyString(record.publishedAt) ||
    !isStatus(record.status)
  ) {
    throw new Error(`RELEASE_POSTGRES_RECORD_INVALID:${identity}`);
  }
  const normalized = Object.freeze({
    kind: "PublishedRelease" as const,
    releaseId: record.releaseId,
    version: record.version,
    artifactRef: record.artifactRef,
    artifactHash: record.artifactHash,
    validationEvidenceRef: record.validationEvidenceRef,
    publishedAt: record.publishedAt,
    status: record.status,
  });
  if (releaseIdentity(normalized) !== identity) {
    throw new Error(`RELEASE_POSTGRES_RECORD_INVALID:${identity}`);
  }
  return normalized;
}

export class PostgresReleaseRecordStorage implements ReleaseRecordStorage {
  readonly #connectionString: string;
  readonly #table: string;
  readonly #cache = new InMemoryReleaseRecordStorage();
  #pending: Promise<void> = Promise.resolve();

  private constructor(connectionString: string, table: string) {
    this.#connectionString = connectionString;
    this.#table = table;
  }

  static async open(connectionString: string, scope = "default"): Promise<PostgresReleaseRecordStorage> {
    parsePostgresConnection(connectionString, "RELEASE");
    const storage = new PostgresReleaseRecordStorage(connectionString, tableForScope(scope));
    await postgresQuery(
      connectionString,
      `CREATE TABLE IF NOT EXISTS ${storage.#table} (identity TEXT PRIMARY KEY, record_json TEXT NOT NULL)`,
      "RELEASE",
    );
    const rows = await postgresQuery(
      connectionString,
      `SELECT identity, record_json FROM ${storage.#table} ORDER BY identity`,
      "RELEASE",
    );
    for (const row of rows) {
      if (row.length < 2 || typeof row[0] !== "string" || typeof row[1] !== "string") {
        throw new Error("RELEASE_POSTGRES_RECORD_INVALID:UNKNOWN");
      }
      storage.#cache.set(row[0], normalizeStoredRecord(row[0], row[1]));
    }
    return storage;
  }

  has(identity: string): boolean {
    return this.#cache.has(identity);
  }

  get(identity: string): PublishedRelease | undefined {
    return this.#cache.get(identity);
  }

  set(identity: string, record: PublishedRelease): void {
    this.#cache.set(identity, record);
    const encoded = JSON.stringify(record);
    this.#pending = this.#pending.then(async () => {
      await postgresQuery(
        this.#connectionString,
        `INSERT INTO ${this.#table} (identity, record_json) VALUES (${sqlLiteral(identity)}, ${sqlLiteral(encoded)}) ` +
          `ON CONFLICT (identity) DO UPDATE SET record_json = EXCLUDED.record_json`,
        "RELEASE",
      );
    });
  }

  async flush(): Promise<void> {
    await this.#pending;
  }

  async close(): Promise<void> {
    await this.flush();
  }
}

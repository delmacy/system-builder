import { createConnection } from "node:net";
import {
  InMemoryArtifactPayloadRepository,
  type ArtifactPayload,
  type ArtifactPayloadFile,
  type ArtifactPayloadRepository,
  type VerifiableReleaseArtifact,
  type VerifiedArtifactPayload,
} from "./index.js";

type PostgresConfig = Readonly<{ host: string; port: number; user: string; database: string }>;
type PostgresRow = readonly (string | null)[];

function postgresConfig(connectionString: string): PostgresConfig {
  let url: URL;
  try { url = new URL(connectionString); } catch { throw new Error("ARTIFACT_POSTGRES_URL_INVALID"); }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") throw new Error("ARTIFACT_POSTGRES_URL_INVALID");
  const user = decodeURIComponent(url.username || "");
  const database = decodeURIComponent(url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname);
  const port = url.port ? Number(url.port) : 5432;
  if (!url.hostname || !user || !database || !Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("ARTIFACT_POSTGRES_URL_INVALID");
  }
  return Object.freeze({ host: url.hostname, port, user, database });
}

function postgresCString(value: string): Buffer { return Buffer.from(`${value}\0`, "utf8"); }
function postgresStartup(config: PostgresConfig): Buffer {
  const fields = Buffer.concat([
    postgresCString("user"), postgresCString(config.user), postgresCString("database"), postgresCString(config.database),
    postgresCString("client_encoding"), postgresCString("UTF8"), Buffer.from([0]),
  ]);
  const message = Buffer.allocUnsafe(8 + fields.length);
  message.writeInt32BE(message.length, 0); message.writeInt32BE(196608, 4); fields.copy(message, 8); return message;
}
function postgresQueryMessage(sql: string): Buffer {
  const text = Buffer.from(`${sql}\0`, "utf8"); const message = Buffer.allocUnsafe(5 + text.length);
  message[0] = 81; message.writeInt32BE(4 + text.length, 1); text.copy(message, 5); return message;
}
function postgresErrorCode(payload: Buffer): string {
  let offset = 0;
  while (offset < payload.length && payload[offset] !== 0) {
    const field = String.fromCharCode(payload[offset]!); offset += 1; const end = payload.indexOf(0, offset); if (end < 0) break;
    const value = payload.toString("utf8", offset, end); if (field === "C") return value; offset = end + 1;
  }
  return "UNKNOWN";
}
function postgresDataRow(payload: Buffer): PostgresRow {
  const count = payload.readInt16BE(0); let offset = 2; const row: (string | null)[] = [];
  for (let index = 0; index < count; index += 1) {
    const length = payload.readInt32BE(offset); offset += 4;
    if (length === -1) { row.push(null); continue; }
    row.push(payload.toString("utf8", offset, offset + length)); offset += length;
  }
  return Object.freeze(row);
}
function postgresSimpleQuery(connectionString: string, sql: string): Promise<readonly PostgresRow[]> {
  const config = postgresConfig(connectionString);
  return new Promise((resolve, reject) => {
    let settled = false; let querySent = false; let buffer = Buffer.alloc(0); const rows: PostgresRow[] = [];
    const socket = createConnection({ host: config.host, port: config.port });
    const timer = setTimeout(() => finish(new Error("ARTIFACT_POSTGRES_TIMEOUT")), 5000);
    function finish(error?: Error): void {
      if (settled) return; settled = true; clearTimeout(timer); socket.destroy();
      if (error) reject(error); else resolve(Object.freeze(rows));
    }
    socket.once("connect", () => socket.write(postgresStartup(config)));
    socket.once("error", () => finish(new Error("ARTIFACT_POSTGRES_SOCKET_FAILED")));
    socket.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length >= 5) {
        const type = String.fromCharCode(buffer[0]!); const length = buffer.readInt32BE(1); const total = 1 + length;
        if (length < 4 || buffer.length < total) return;
        const payload = buffer.subarray(5, total); buffer = buffer.subarray(total);
        if (type === "R") {
          const auth = payload.readInt32BE(0); if (auth !== 0) { finish(new Error(`ARTIFACT_POSTGRES_AUTH_UNSUPPORTED:${auth}`)); return; }
        } else if (type === "E") { finish(new Error(`ARTIFACT_POSTGRES_QUERY_FAILED:${postgresErrorCode(payload)}`)); return;
        } else if (type === "D") rows.push(postgresDataRow(payload));
        else if (type === "Z") {
          if (!querySent) { querySent = true; socket.write(postgresQueryMessage(sql)); }
          else { finish(); return; }
        }
      }
    });
  });
}

function sqlLiteral(value: string): string { return `'${value.replaceAll("'", "''")}'`; }
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
    postgresConfig(connectionString);
    const repository = new PostgresArtifactPayloadRepository(connectionString, tableForScope(scope));
    await postgresSimpleQuery(connectionString, `CREATE TABLE IF NOT EXISTS ${repository.#table} (artifact_hash TEXT PRIMARY KEY, payload_json TEXT NOT NULL)`);
    const rows = await postgresSimpleQuery(connectionString, `SELECT artifact_hash, payload_json FROM ${repository.#table} ORDER BY artifact_hash`);
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
        await postgresSimpleQuery(this.#connectionString, `INSERT INTO ${this.#table} (artifact_hash, payload_json) VALUES (${sqlLiteral(payload.artifactHash)}, ${sqlLiteral(encoded)})`);
      });
    }
    return payload;
  }

  get(artifactHash: string): ArtifactPayload { return this.#cache.get(artifactHash); }
  getVerified(artifact: VerifiableReleaseArtifact): VerifiedArtifactPayload { return this.#cache.getVerified(artifact); }
  async flush(): Promise<void> { await this.#pending; }
  async close(): Promise<void> { await this.flush(); }
}

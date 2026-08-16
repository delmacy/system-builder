import { createConnection } from "node:net";
import type { LocalMigrationPreflight } from "./migration-preflight.js";

export type MigrationApplicationFile = Readonly<{
  path: string;
  content: string;
  contentHash: string;
}>;

export type LocalMigrationApplicationMigration = Readonly<{
  capability: string;
  id: string;
  order: number;
  path: string;
  contentHash: string;
  status: "applied" | "skipped";
}>;

export type LocalMigrationApplication = Readonly<{
  kind: "LocalMigrationApplication";
  migrations: readonly LocalMigrationApplicationMigration[];
}>;

export type LocalMigrationApplicationInput = Readonly<{
  preflight: LocalMigrationPreflight;
  generatedFiles: readonly MigrationApplicationFile[];
  runtimeSecrets: Readonly<Record<string, string>>;
}>;

export type LocalMigrationApplier = (
  input: LocalMigrationApplicationInput,
) => Promise<LocalMigrationApplication>;

type PostgresConfig = Readonly<{ host: string; port: number; user: string; database: string }>;
type PostgresRow = readonly (string | null)[];

function postgresConfig(connectionString: string): PostgresConfig {
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error("POSTGRES_URL_INVALID");
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") throw new Error("POSTGRES_URL_INVALID");
  const user = decodeURIComponent(url.username || "");
  const pathname = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
  const database = decodeURIComponent(pathname);
  const port = url.port ? Number(url.port) : 5432;
  if (!url.hostname || !user || !database || !Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("POSTGRES_URL_INVALID");
  }
  return Object.freeze({ host: url.hostname, port, user, database });
}

function cString(value: string): Buffer {
  return Buffer.from(`${value}\0`, "utf8");
}

function startupMessage(config: PostgresConfig): Buffer {
  const fields = Buffer.concat([
    cString("user"),
    cString(config.user),
    cString("database"),
    cString(config.database),
    cString("client_encoding"),
    cString("UTF8"),
    Buffer.from([0]),
  ]);
  const message = Buffer.allocUnsafe(8 + fields.length);
  message.writeInt32BE(message.length, 0);
  message.writeInt32BE(196608, 4);
  fields.copy(message, 8);
  return message;
}

function queryMessage(sql: string): Buffer {
  const text = Buffer.from(`${sql}\0`, "utf8");
  const message = Buffer.allocUnsafe(5 + text.length);
  message[0] = 81;
  message.writeInt32BE(4 + text.length, 1);
  text.copy(message, 5);
  return message;
}

function postgresErrorCode(payload: Buffer): string {
  let offset = 0;
  while (offset < payload.length && payload[offset] !== 0) {
    const field = String.fromCharCode(payload[offset]!);
    offset += 1;
    const end = payload.indexOf(0, offset);
    if (end < 0) break;
    const value = payload.toString("utf8", offset, end);
    if (field === "C") return value;
    offset = end + 1;
  }
  return "UNKNOWN";
}

function dataRow(payload: Buffer): PostgresRow {
  const count = payload.readInt16BE(0);
  let offset = 2;
  const row: Array<string | null> = [];
  for (let index = 0; index < count; index += 1) {
    const length = payload.readInt32BE(offset);
    offset += 4;
    if (length === -1) {
      row.push(null);
      continue;
    }
    row.push(payload.toString("utf8", offset, offset + length));
    offset += length;
  }
  return Object.freeze(row);
}

function postgresSimpleQuery(connectionString: string, sql: string): Promise<readonly PostgresRow[]> {
  const config = postgresConfig(connectionString);
  return new Promise((resolve, reject) => {
    let settled = false;
    let querySent = false;
    let buffer = Buffer.alloc(0);
    const rows: PostgresRow[] = [];
    const socket = createConnection({ host: config.host, port: config.port });

    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      if (error) reject(error);
      else resolve(Object.freeze([...rows]));
    };
    const timer = setTimeout(() => finish(new Error("POSTGRES_TIMEOUT")), 5_000);

    socket.once("connect", () => socket.write(startupMessage(config)));
    socket.once("error", () => finish(new Error("POSTGRES_SOCKET_FAILED")));
    socket.on("data", (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length >= 5) {
        const type = String.fromCharCode(buffer[0]!);
        const length = buffer.readInt32BE(1);
        const total = 1 + length;
        if (length < 4 || buffer.length < total) return;
        const payload = buffer.subarray(5, total);
        buffer = buffer.subarray(total);

        if (type === "R") {
          const auth = payload.readInt32BE(0);
          if (auth !== 0) {
            finish(new Error(`POSTGRES_AUTH_UNSUPPORTED:${auth}`));
            return;
          }
        } else if (type === "E") {
          finish(new Error(`POSTGRES_QUERY_FAILED:${postgresErrorCode(payload)}`));
          return;
        } else if (type === "D") {
          rows.push(dataRow(payload));
        } else if (type === "Z") {
          if (!querySent) {
            querySent = true;
            socket.write(queryMessage(sql));
          } else {
            finish();
            return;
          }
        }
      }
    });
  });
}

function sqlLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

function migrationEvidence(
  migration: LocalMigrationPreflight["migrations"][number],
  status: "applied" | "skipped",
): LocalMigrationApplicationMigration {
  return Object.freeze({
    capability: migration.capability,
    id: migration.id,
    order: migration.order,
    path: migration.path,
    contentHash: migration.contentHash,
    status,
  });
}

export const applyVerifiedPostgresMigrations: LocalMigrationApplier = async (input) => {
  if (input.preflight.migrations.length === 0) {
    return Object.freeze({ kind: "LocalMigrationApplication", migrations: Object.freeze([]) });
  }

  for (const migration of input.preflight.migrations) {
    const connection = input.runtimeSecrets[migration.connectionBinding.name];
    if (typeof connection !== "string" || connection.length === 0) {
      throw new Error(`MIGRATION_CONNECTION_SECRET_MISSING:${migration.connectionBinding.name}`);
    }
  }

  const applied: LocalMigrationApplicationMigration[] = [];
  const initializedConnections = new Set<string>();
  for (const migration of input.preflight.migrations) {
    const connection = input.runtimeSecrets[migration.connectionBinding.name]!;
    const file = input.generatedFiles.find((candidate) => candidate.path === migration.path);
    if (!file || file.contentHash !== migration.contentHash) {
      throw new Error(`MIGRATION_APPLICATION_FILE_INVALID:${migration.path}`);
    }

    if (!initializedConnections.has(connection)) {
      await postgresSimpleQuery(
        connection,
        "CREATE TABLE IF NOT EXISTS _system_builder_migrations (capability TEXT NOT NULL, migration_id TEXT NOT NULL, content_hash TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (capability, migration_id))",
      );
      initializedConnections.add(connection);
    }

    const existing = await postgresSimpleQuery(
      connection,
      `SELECT content_hash FROM _system_builder_migrations WHERE capability = ${sqlLiteral(migration.capability)} AND migration_id = ${sqlLiteral(migration.id)}`,
    );
    const recordedHash = existing[0]?.[0];
    if (recordedHash !== undefined && recordedHash !== null) {
      if (recordedHash !== migration.contentHash) {
        throw new Error(`MIGRATION_APPLIED_HASH_MISMATCH:${migration.capability}:${migration.id}`);
      }
      applied.push(migrationEvidence(migration, "skipped"));
      continue;
    }

    await postgresSimpleQuery(
      connection,
      `BEGIN;\n${file.content}\nINSERT INTO _system_builder_migrations (capability, migration_id, content_hash) VALUES (${sqlLiteral(migration.capability)}, ${sqlLiteral(migration.id)}, ${sqlLiteral(migration.contentHash)});\nCOMMIT;`,
    );
    applied.push(migrationEvidence(migration, "applied"));
  }

  return Object.freeze({
    kind: "LocalMigrationApplication",
    migrations: Object.freeze(applied),
  });
};

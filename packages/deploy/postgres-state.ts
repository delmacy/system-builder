import { createConnection } from "node:net";
import type { DeploymentRecord } from "./index.js";
import { InMemoryDeploymentRecordStorage, type DeploymentRecordStorage } from "./storage.js";

type PostgresConfig = Readonly<{ host: string; port: number; user: string; database: string }>;
type PostgresRow = readonly (string | null)[];

function postgresConfig(connectionString: string): PostgresConfig {
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error("DEPLOY_POSTGRES_URL_INVALID");
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") throw new Error("DEPLOY_POSTGRES_URL_INVALID");
  const user = decodeURIComponent(url.username || "");
  const database = decodeURIComponent(url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname);
  const port = url.port ? Number(url.port) : 5432;
  if (!url.hostname || !user || !database || !Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("DEPLOY_POSTGRES_URL_INVALID");
  }
  return Object.freeze({ host: url.hostname, port, user, database });
}

function cstring(value: string): Buffer { return Buffer.from(`${value}\0`, "utf8"); }
function startup(config: PostgresConfig): Buffer {
  const fields = Buffer.concat([
    cstring("user"), cstring(config.user), cstring("database"), cstring(config.database),
    cstring("client_encoding"), cstring("UTF8"), Buffer.from([0]),
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
function errorCode(payload: Buffer): string {
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
  const row: (string | null)[] = [];
  for (let index = 0; index < count; index += 1) {
    const length = payload.readInt32BE(offset);
    offset += 4;
    if (length === -1) { row.push(null); continue; }
    row.push(payload.toString("utf8", offset, offset + length));
    offset += length;
  }
  return Object.freeze(row);
}
function simpleQuery(connectionString: string, sql: string): Promise<readonly PostgresRow[]> {
  const config = postgresConfig(connectionString);
  return new Promise((resolve, reject) => {
    let settled = false;
    let sent = false;
    let buffer = Buffer.alloc(0);
    const rows: PostgresRow[] = [];
    const socket = createConnection({ host: config.host, port: config.port });
    const timer = setTimeout(() => finish(new Error("DEPLOY_POSTGRES_TIMEOUT")), 5000);
    function finish(error?: Error): void {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      if (error) reject(error); else resolve(Object.freeze(rows));
    }
    socket.once("connect", () => socket.write(startup(config)));
    socket.once("error", () => finish(new Error("DEPLOY_POSTGRES_SOCKET_FAILED")));
    socket.on("data", (chunk) => {
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
          if (auth !== 0) { finish(new Error(`DEPLOY_POSTGRES_AUTH_UNSUPPORTED:${auth}`)); return; }
        } else if (type === "E") {
          finish(new Error(`DEPLOY_POSTGRES_QUERY_FAILED:${errorCode(payload)}`)); return;
        } else if (type === "D") rows.push(dataRow(payload));
        else if (type === "Z") {
          if (!sent) { sent = true; socket.write(queryMessage(sql)); }
          else { finish(); return; }
        }
      }
    });
  });
}

function literal(value: string): string { return `'${value.replaceAll("'", "''")}'`; }
function tables(scope: string): Readonly<{ records: string; active: string }> {
  const normalized = scope.trim().toLowerCase();
  if (!/^[a-z][a-z0-9_]{0,30}$/.test(normalized)) throw new Error("DEPLOY_POSTGRES_SCOPE_INVALID");
  return Object.freeze({ records: `system_builder_deploy_${normalized}`, active: `system_builder_deploy_active_${normalized}` });
}
function nonEmpty(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function normalizeRecord(identity: string, encoded: string): DeploymentRecord {
  let value: unknown;
  try { value = JSON.parse(encoded) as unknown; } catch { throw new Error(`DEPLOY_POSTGRES_RECORD_INVALID:${identity}`); }
  if (typeof value !== "object" || value === null) throw new Error(`DEPLOY_POSTGRES_RECORD_INVALID:${identity}`);
  const record = value as Record<string, unknown>;
  if (
    record.kind !== "DeploymentRecord" || record.deploymentId !== identity ||
    !/^sha256:[a-f0-9]{64}$/.test(identity) || !nonEmpty(record.publishedReleaseRef) ||
    !nonEmpty(record.environmentRef) || !nonEmpty(record.releaseHash) || !/^sha256:[a-f0-9]{64}$/.test(record.releaseHash) ||
    !nonEmpty(record.startedAt) || !nonEmpty(record.completedAt) ||
    (record.status !== "succeeded" && record.status !== "failed") || !Array.isArray(record.healthChecks)
  ) throw new Error(`DEPLOY_POSTGRES_RECORD_INVALID:${identity}`);
  const healthChecks = record.healthChecks.map((item) => {
    if (typeof item !== "object" || item === null) throw new Error(`DEPLOY_POSTGRES_RECORD_INVALID:${identity}`);
    const check = item as Record<string, unknown>;
    if (!nonEmpty(check.name) || (check.status !== "PASS" && check.status !== "FAIL")) throw new Error(`DEPLOY_POSTGRES_RECORD_INVALID:${identity}`);
    return Object.freeze({ name: check.name, status: check.status });
  });
  return Object.freeze({
    kind: "DeploymentRecord", deploymentId: identity, publishedReleaseRef: record.publishedReleaseRef,
    environmentRef: record.environmentRef, releaseHash: record.releaseHash, startedAt: record.startedAt,
    completedAt: record.completedAt, status: record.status, healthChecks: Object.freeze(healthChecks),
  });
}

export class PostgresDeploymentRecordStorage implements DeploymentRecordStorage {
  readonly #connectionString: string;
  readonly #recordsTable: string;
  readonly #activeTable: string;
  readonly #cache = new InMemoryDeploymentRecordStorage();
  readonly #persisted = new Set<string>();
  #pending: Promise<void> = Promise.resolve();

  private constructor(connectionString: string, names: Readonly<{ records: string; active: string }>) {
    this.#connectionString = connectionString;
    this.#recordsTable = names.records;
    this.#activeTable = names.active;
  }

  static async open(connectionString: string, scope = "default"): Promise<PostgresDeploymentRecordStorage> {
    postgresConfig(connectionString);
    const storage = new PostgresDeploymentRecordStorage(connectionString, tables(scope));
    await simpleQuery(connectionString, `CREATE TABLE IF NOT EXISTS ${storage.#recordsTable} (deployment_id TEXT PRIMARY KEY, record_json TEXT NOT NULL)`);
    await simpleQuery(connectionString, `CREATE TABLE IF NOT EXISTS ${storage.#activeTable} (environment_ref TEXT PRIMARY KEY, deployment_id TEXT NOT NULL)`);
    const recordRows = await simpleQuery(connectionString, `SELECT deployment_id, record_json FROM ${storage.#recordsTable} ORDER BY deployment_id`);
    for (const row of recordRows) {
      if (row.length < 2 || typeof row[0] !== "string" || typeof row[1] !== "string") throw new Error("DEPLOY_POSTGRES_RECORD_INVALID:UNKNOWN");
      const record = normalizeRecord(row[0], row[1]);
      storage.#cache.set(record.deploymentId, record);
      storage.#persisted.add(record.deploymentId);
    }
    const activeRows = await simpleQuery(connectionString, `SELECT environment_ref, deployment_id FROM ${storage.#activeTable} ORDER BY environment_ref`);
    for (const row of activeRows) {
      if (row.length < 2 || typeof row[0] !== "string" || typeof row[1] !== "string") throw new Error("DEPLOY_POSTGRES_ACTIVE_INVALID:UNKNOWN");
      const record = storage.#cache.get(row[1]);
      if (record === undefined || record.status !== "succeeded" || record.environmentRef !== row[0]) throw new Error(`DEPLOY_POSTGRES_ACTIVE_INVALID:${row[0]}`);
      storage.#cache.setActiveDeploymentId(row[0], row[1]);
    }
    return storage;
  }

  has(deploymentId: string): boolean { return this.#cache.has(deploymentId); }
  get(deploymentId: string): DeploymentRecord | undefined { return this.#cache.get(deploymentId); }
  values(): readonly DeploymentRecord[] { return this.#cache.values(); }
  getActiveDeploymentId(environmentRef: string): string | undefined { return this.#cache.getActiveDeploymentId(environmentRef); }

  set(deploymentId: string, record: DeploymentRecord): void {
    this.#cache.set(deploymentId, record);
    if (this.#persisted.has(deploymentId)) return;
    this.#persisted.add(deploymentId);
    const encoded = JSON.stringify(record);
    this.#pending = this.#pending.then(() => simpleQuery(this.#connectionString, `INSERT INTO ${this.#recordsTable} (deployment_id, record_json) VALUES (${literal(deploymentId)}, ${literal(encoded)})`).then(() => undefined));
  }

  setActiveDeploymentId(environmentRef: string, deploymentId: string): void {
    this.#cache.setActiveDeploymentId(environmentRef, deploymentId);
    this.#pending = this.#pending.then(() => simpleQuery(this.#connectionString,
      `INSERT INTO ${this.#activeTable} (environment_ref, deployment_id) VALUES (${literal(environmentRef)}, ${literal(deploymentId)}) ON CONFLICT (environment_ref) DO UPDATE SET deployment_id = EXCLUDED.deployment_id`).then(() => undefined));
  }

  async flush(): Promise<void> { await this.#pending; }
  async close(): Promise<void> { await this.flush(); }
}

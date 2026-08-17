import { createHash, createHmac, pbkdf2Sync, randomBytes } from "node:crypto";
import { createConnection, type Socket } from "node:net";
import { connect as createTlsConnection, type TLSSocket } from "node:tls";
import type { DeploymentRecord } from "./index.js";
import { InMemoryDeploymentRecordStorage, type AtomicDeploymentActivationResult, type DeploymentRecordStorage } from "./storage.js";

type PostgresSslMode = "disable" | "prefer" | "require";
type PostgresConfig = Readonly<{ host: string; port: number; user: string; password: string; database: string; sslMode: PostgresSslMode }>;
type PostgresRow = readonly (string | null)[];
type PostgresSocket = Socket | TLSSocket;
type ScramState = { clientFirstBare: string; clientNonce: string; serverSignature?: string };

function postgresConfig(connectionString: string): PostgresConfig {
  let url: URL;
  try { url = new URL(connectionString); } catch { throw new Error("DEPLOY_POSTGRES_URL_INVALID"); }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") throw new Error("DEPLOY_POSTGRES_URL_INVALID");
  const user = decodeURIComponent(url.username || "");
  const password = decodeURIComponent(url.password || "");
  const database = decodeURIComponent(url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname);
  const port = url.port ? Number(url.port) : 5432;
  const sslModeValue = url.searchParams.get("sslmode") ?? "disable";
  if (sslModeValue !== "disable" && sslModeValue !== "prefer" && sslModeValue !== "require") throw new Error("DEPLOY_POSTGRES_SSLMODE_INVALID");
  if (!url.hostname || !user || !database || !Number.isInteger(port) || port <= 0 || port > 65535) throw new Error("DEPLOY_POSTGRES_URL_INVALID");
  return Object.freeze({ host: url.hostname, port, user, password, database, sslMode: sslModeValue });
}

function cstring(value: string): Buffer { return Buffer.from(`${value}\0`, "utf8"); }
function startup(config: PostgresConfig): Buffer {
  const fields = Buffer.concat([cstring("user"), cstring(config.user), cstring("database"), cstring(config.database), cstring("client_encoding"), cstring("UTF8"), Buffer.from([0])]);
  const message = Buffer.allocUnsafe(8 + fields.length);
  message.writeInt32BE(message.length, 0); message.writeInt32BE(196608, 4); fields.copy(message, 8); return message;
}
function sslRequest(): Buffer { const message = Buffer.allocUnsafe(8); message.writeInt32BE(8, 0); message.writeInt32BE(80877103, 4); return message; }
function queryMessage(sql: string): Buffer {
  const text = Buffer.from(`${sql}\0`, "utf8"); const message = Buffer.allocUnsafe(5 + text.length);
  message[0] = 81; message.writeInt32BE(4 + text.length, 1); text.copy(message, 5); return message;
}
function passwordMessage(password: string): Buffer {
  const text = Buffer.from(`${password}\0`, "utf8"); const message = Buffer.allocUnsafe(5 + text.length);
  message[0] = 112; message.writeInt32BE(4 + text.length, 1); text.copy(message, 5); return message;
}
function saslInitialMessage(mechanism: string, response: string): Buffer {
  const mechanismBytes = cstring(mechanism); const responseBytes = Buffer.from(response, "utf8");
  const message = Buffer.allocUnsafe(1 + 4 + mechanismBytes.length + 4 + responseBytes.length);
  message[0] = 112; message.writeInt32BE(message.length - 1, 1); mechanismBytes.copy(message, 5);
  message.writeInt32BE(responseBytes.length, 5 + mechanismBytes.length); responseBytes.copy(message, 9 + mechanismBytes.length); return message;
}
function saslResponseMessage(response: string): Buffer {
  const responseBytes = Buffer.from(response, "utf8"); const message = Buffer.allocUnsafe(5 + responseBytes.length);
  message[0] = 112; message.writeInt32BE(4 + responseBytes.length, 1); responseBytes.copy(message, 5); return message;
}
function errorCode(payload: Buffer): string {
  let offset = 0;
  while (offset < payload.length && payload[offset] !== 0) {
    const field = String.fromCharCode(payload[offset]!); offset += 1; const end = payload.indexOf(0, offset); if (end < 0) break;
    const value = payload.toString("utf8", offset, end); if (field === "C") return value; offset = end + 1;
  }
  return "UNKNOWN";
}
function dataRow(payload: Buffer): PostgresRow {
  const count = payload.readInt16BE(0); let offset = 2; const row: (string | null)[] = [];
  for (let index = 0; index < count; index += 1) {
    const length = payload.readInt32BE(offset); offset += 4; if (length === -1) { row.push(null); continue; }
    row.push(payload.toString("utf8", offset, offset + length)); offset += length;
  }
  return Object.freeze(row);
}
function md5Password(password: string, user: string, salt: Buffer): string {
  const inner = createHash("md5").update(`${password}${user}`, "utf8").digest("hex");
  return `md5${createHash("md5").update(Buffer.concat([Buffer.from(inner, "utf8"), salt])).digest("hex")}`;
}
function scramName(value: string): string { return value.replaceAll("=", "=3D").replaceAll(",", "=2C"); }
function hmac(key: Buffer, value: string): Buffer { return createHmac("sha256", key).update(value, "utf8").digest(); }
function xor(left: Buffer, right: Buffer): Buffer {
  const result = Buffer.allocUnsafe(left.length); for (let index = 0; index < left.length; index += 1) result[index] = left[index]! ^ right[index]!; return result;
}
function scramFields(message: string): Map<string, string> {
  const result = new Map<string, string>();
  for (const item of message.split(",")) { const separator = item.indexOf("="); if (separator > 0) result.set(item.slice(0, separator), item.slice(separator + 1)); }
  return result;
}

function connectPostgres(config: PostgresConfig): Promise<PostgresSocket> {
  return new Promise((resolve, reject) => {
    let settled = false; const socket = createConnection({ host: config.host, port: config.port });
    const timer = setTimeout(() => finish(undefined, new Error("DEPLOY_POSTGRES_TIMEOUT")), 5000);
    function finish(value?: PostgresSocket, error?: Error): void {
      if (settled) return; settled = true; clearTimeout(timer);
      if (error) { socket.destroy(); reject(error); } else if (value !== undefined) resolve(value);
    }
    socket.once("error", () => finish(undefined, new Error("DEPLOY_POSTGRES_SOCKET_FAILED")));
    socket.once("connect", () => {
      if (config.sslMode === "disable") { finish(socket); return; }
      socket.write(sslRequest());
      socket.once("data", (chunk) => {
        const response = chunk[0];
        if (response === 78) { if (config.sslMode === "require") finish(undefined, new Error("DEPLOY_POSTGRES_TLS_REQUIRED")); else finish(socket); return; }
        if (response !== 83) { finish(undefined, new Error("DEPLOY_POSTGRES_TLS_NEGOTIATION_FAILED")); return; }
        const secure = createTlsConnection({ socket, servername: config.host, rejectUnauthorized: false });
        secure.once("secureConnect", () => finish(secure)); secure.once("error", () => finish(undefined, new Error("DEPLOY_POSTGRES_TLS_FAILED")));
      });
    });
  });
}

async function simpleQuery(connectionString: string, sql: string): Promise<readonly PostgresRow[]> {
  const config = postgresConfig(connectionString); const socket = await connectPostgres(config);
  return new Promise((resolve, reject) => {
    let settled = false; let sent = false; let buffer = Buffer.alloc(0); const rows: PostgresRow[] = []; let scram: ScramState | undefined;
    const timer = setTimeout(() => finish(new Error("DEPLOY_POSTGRES_TIMEOUT")), 5000);
    function finish(error?: Error): void { if (settled) return; settled = true; clearTimeout(timer); socket.destroy(); if (error) reject(error); else resolve(Object.freeze(rows)); }
    socket.once("error", () => finish(new Error("DEPLOY_POSTGRES_SOCKET_FAILED"))); socket.write(startup(config));
    socket.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length >= 5) {
        const type = String.fromCharCode(buffer[0]!); const length = buffer.readInt32BE(1); const total = 1 + length;
        if (length < 4 || buffer.length < total) return; const payload = buffer.subarray(5, total); buffer = buffer.subarray(total);
        if (type === "R") {
          if (payload.length < 4) { finish(new Error("DEPLOY_POSTGRES_AUTH_FAILED:PROTOCOL")); return; }
          const auth = payload.readInt32BE(0);
          if (auth === 0) continue;
          if (auth === 3) { if (!config.password) { finish(new Error("DEPLOY_POSTGRES_PASSWORD_REQUIRED")); return; } socket.write(passwordMessage(config.password)); continue; }
          if (auth === 5) { if (!config.password || payload.length < 8) { finish(new Error("DEPLOY_POSTGRES_PASSWORD_REQUIRED")); return; } socket.write(passwordMessage(md5Password(config.password, config.user, payload.subarray(4, 8)))); continue; }
          if (auth === 10) {
            if (!config.password) { finish(new Error("DEPLOY_POSTGRES_PASSWORD_REQUIRED")); return; }
            const mechanisms = payload.subarray(4).toString("utf8").split("\0").filter(Boolean);
            if (!mechanisms.includes("SCRAM-SHA-256")) { finish(new Error("DEPLOY_POSTGRES_AUTH_UNSUPPORTED:10")); return; }
            const clientNonce = randomBytes(18).toString("base64"); const clientFirstBare = `n=${scramName(config.user)},r=${clientNonce}`; scram = { clientFirstBare, clientNonce };
            socket.write(saslInitialMessage("SCRAM-SHA-256", `n,,${clientFirstBare}`)); continue;
          }
          if (auth === 11) {
            if (scram === undefined) { finish(new Error("DEPLOY_POSTGRES_AUTH_FAILED:SCRAM_STATE")); return; }
            const serverFirst = payload.subarray(4).toString("utf8"); const fields = scramFields(serverFirst);
            const nonce = fields.get("r"); const salt = fields.get("s"); const iterationsText = fields.get("i"); const iterations = iterationsText === undefined ? Number.NaN : Number(iterationsText);
            if (nonce === undefined || !nonce.startsWith(scram.clientNonce) || salt === undefined || !Number.isInteger(iterations) || iterations <= 0) { finish(new Error("DEPLOY_POSTGRES_AUTH_FAILED:SCRAM_CHALLENGE")); return; }
            const clientFinalWithoutProof = `c=biws,r=${nonce}`; const authMessage = `${scram.clientFirstBare},${serverFirst},${clientFinalWithoutProof}`;
            const saltedPassword = pbkdf2Sync(config.password, Buffer.from(salt, "base64"), iterations, 32, "sha256"); const clientKey = hmac(saltedPassword, "Client Key");
            const storedKey = createHash("sha256").update(clientKey).digest(); const proof = xor(clientKey, hmac(storedKey, authMessage)).toString("base64");
            scram.serverSignature = hmac(hmac(saltedPassword, "Server Key"), authMessage).toString("base64"); socket.write(saslResponseMessage(`${clientFinalWithoutProof},p=${proof}`)); continue;
          }
          if (auth === 12) {
            if (scram?.serverSignature === undefined) { finish(new Error("DEPLOY_POSTGRES_AUTH_FAILED:SCRAM_STATE")); return; }
            if (scramFields(payload.subarray(4).toString("utf8")).get("v") !== scram.serverSignature) { finish(new Error("DEPLOY_POSTGRES_AUTH_FAILED:SCRAM_SIGNATURE")); return; }
            continue;
          }
          finish(new Error(`DEPLOY_POSTGRES_AUTH_UNSUPPORTED:${auth}`)); return;
        } else if (type === "E") {
          const code = errorCode(payload); finish(new Error(`${sent ? "DEPLOY_POSTGRES_QUERY_FAILED" : "DEPLOY_POSTGRES_AUTH_FAILED"}:${code}`)); return;
        } else if (type === "D") rows.push(dataRow(payload));
        else if (type === "Z") { if (!sent) { sent = true; socket.write(queryMessage(sql)); } else { finish(); return; } }
      }
    });
  });
}

export async function executeDeployPostgresTransaction(connectionString: string, statements: readonly string[]): Promise<readonly PostgresRow[]> {
  if (statements.length === 0 || statements.some((statement) => statement.trim().length === 0)) throw new Error("DEPLOY_POSTGRES_TRANSACTION_INVALID");
  return simpleQuery(connectionString, `BEGIN;\n${statements.join(";\n")};\nCOMMIT`);
}

function literal(value: string): string { return `'${value.replaceAll("'", "''")}'`; }
function tables(scope: string): Readonly<{ records: string; active: string }> {
  const normalized = scope.trim().toLowerCase(); if (!/^[a-z][a-z0-9_]{0,30}$/.test(normalized)) throw new Error("DEPLOY_POSTGRES_SCOPE_INVALID");
  return Object.freeze({ records: `system_builder_deploy_${normalized}`, active: `system_builder_deploy_active_${normalized}` });
}
function nonEmpty(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function normalizeRecord(identity: string, encoded: string): DeploymentRecord {
  let value: unknown; try { value = JSON.parse(encoded) as unknown; } catch { throw new Error(`DEPLOY_POSTGRES_RECORD_INVALID:${identity}`); }
  if (typeof value !== "object" || value === null) throw new Error(`DEPLOY_POSTGRES_RECORD_INVALID:${identity}`); const record = value as Record<string, unknown>;
  if (record.kind !== "DeploymentRecord" || record.deploymentId !== identity || !/^sha256:[a-f0-9]{64}$/.test(identity) || !nonEmpty(record.publishedReleaseRef) || !nonEmpty(record.environmentRef) || !nonEmpty(record.releaseHash) || !/^sha256:[a-f0-9]{64}$/.test(record.releaseHash) || !nonEmpty(record.startedAt) || !nonEmpty(record.completedAt) || (record.status !== "succeeded" && record.status !== "failed") || !Array.isArray(record.healthChecks)) throw new Error(`DEPLOY_POSTGRES_RECORD_INVALID:${identity}`);
  const healthChecks = record.healthChecks.map((item) => {
    if (typeof item !== "object" || item === null) throw new Error(`DEPLOY_POSTGRES_RECORD_INVALID:${identity}`); const check = item as Record<string, unknown>;
    if (!nonEmpty(check.name) || (check.status !== "PASS" && check.status !== "FAIL")) throw new Error(`DEPLOY_POSTGRES_RECORD_INVALID:${identity}`);
    return Object.freeze({ name: check.name, status: check.status });
  });
  return Object.freeze({ kind: "DeploymentRecord", deploymentId: identity, publishedReleaseRef: record.publishedReleaseRef, environmentRef: record.environmentRef, releaseHash: record.releaseHash, startedAt: record.startedAt, completedAt: record.completedAt, status: record.status, healthChecks: Object.freeze(healthChecks) });
}

export class PostgresDeploymentRecordStorage implements DeploymentRecordStorage {
  readonly #connectionString: string; readonly #recordsTable: string; readonly #activeTable: string; readonly #cache = new InMemoryDeploymentRecordStorage(); readonly #persisted = new Set<string>(); #pending: Promise<void> = Promise.resolve();
  private constructor(connectionString: string, names: Readonly<{ records: string; active: string }>) { this.#connectionString = connectionString; this.#recordsTable = names.records; this.#activeTable = names.active; }

  static async open(connectionString: string, scope = "default"): Promise<PostgresDeploymentRecordStorage> {
    postgresConfig(connectionString); const storage = new PostgresDeploymentRecordStorage(connectionString, tables(scope));
    await executeDeployPostgresTransaction(connectionString, [
      `CREATE TABLE IF NOT EXISTS ${storage.#recordsTable} (deployment_id TEXT PRIMARY KEY, record_json TEXT NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS ${storage.#activeTable} (environment_ref TEXT PRIMARY KEY, deployment_id TEXT NOT NULL)`,
    ]);
    const recordRows = await simpleQuery(connectionString, `SELECT deployment_id, record_json FROM ${storage.#recordsTable} ORDER BY deployment_id`);
    for (const row of recordRows) {
      if (row.length < 2 || typeof row[0] !== "string" || typeof row[1] !== "string") throw new Error("DEPLOY_POSTGRES_RECORD_INVALID:UNKNOWN");
      const record = normalizeRecord(row[0], row[1]); storage.#cache.set(record.deploymentId, record); storage.#persisted.add(record.deploymentId);
    }
    const activeRows = await simpleQuery(connectionString, `SELECT environment_ref, deployment_id FROM ${storage.#activeTable} ORDER BY environment_ref`);
    for (const row of activeRows) {
      if (row.length < 2 || typeof row[0] !== "string" || typeof row[1] !== "string") throw new Error("DEPLOY_POSTGRES_ACTIVE_INVALID:UNKNOWN");
      const record = storage.#cache.get(row[1]); if (record === undefined || record.status !== "succeeded" || record.environmentRef !== row[0]) throw new Error(`DEPLOY_POSTGRES_ACTIVE_INVALID:${row[0]}`);
      storage.#cache.setActiveDeploymentId(row[0], row[1]);
    }
    return storage;
  }
  has(deploymentId: string): boolean { return this.#cache.has(deploymentId); }
  get(deploymentId: string): DeploymentRecord | undefined { return this.#cache.get(deploymentId); }
  values(): readonly DeploymentRecord[] { return this.#cache.values(); }
  getActiveDeploymentId(environmentRef: string): string | undefined { return this.#cache.getActiveDeploymentId(environmentRef); }
  set(deploymentId: string, record: DeploymentRecord): void {
    this.#cache.set(deploymentId, record); if (this.#persisted.has(deploymentId)) return; this.#persisted.add(deploymentId); const encoded = JSON.stringify(record);
    this.#pending = this.#pending.then(() => simpleQuery(this.#connectionString, `INSERT INTO ${this.#recordsTable} (deployment_id, record_json) VALUES (${literal(deploymentId)}, ${literal(encoded)})`).then(() => undefined));
  }
  setActiveDeploymentId(environmentRef: string, deploymentId: string): void {
    this.#cache.setActiveDeploymentId(environmentRef, deploymentId);
    this.#pending = this.#pending.then(() => simpleQuery(this.#connectionString, `INSERT INTO ${this.#activeTable} (environment_ref, deployment_id) VALUES (${literal(environmentRef)}, ${literal(deploymentId)}) ON CONFLICT (environment_ref) DO UPDATE SET deployment_id = EXCLUDED.deployment_id`).then(() => undefined));
  }

  async activateAtomically(record: DeploymentRecord, expectedActiveDeploymentId: string | null): Promise<AtomicDeploymentActivationResult> {
    await this.flush();
    const encoded = JSON.stringify(record);
    const expectedMatches = expectedActiveDeploymentId === null
      ? "NOT EXISTS (SELECT 1 FROM current_active)"
      : `(SELECT deployment_id FROM current_active) = ${literal(expectedActiveDeploymentId)}`;
    const rows = await simpleQuery(this.#connectionString, `
BEGIN;
LOCK TABLE ${this.#activeTable} IN SHARE ROW EXCLUSIVE MODE;
WITH current_active AS (
  SELECT deployment_id FROM ${this.#activeTable} WHERE environment_ref = ${literal(record.environmentRef)}
), existing_record AS (
  SELECT record_json FROM ${this.#recordsTable} WHERE deployment_id = ${literal(record.deploymentId)}
), record_insert AS (
  INSERT INTO ${this.#recordsTable} (deployment_id, record_json)
  VALUES (${literal(record.deploymentId)}, ${literal(encoded)})
  ON CONFLICT (deployment_id) DO NOTHING
  RETURNING deployment_id
), record_conflict AS (
  SELECT 1 FROM existing_record WHERE record_json <> ${literal(encoded)}
), activation AS (
  INSERT INTO ${this.#activeTable} (environment_ref, deployment_id)
  SELECT ${literal(record.environmentRef)}, ${literal(record.deploymentId)}
  WHERE ${literal(record.status)} = 'succeeded'
    AND NOT EXISTS (SELECT 1 FROM record_conflict)
    AND (${expectedMatches})
  ON CONFLICT (environment_ref) DO UPDATE SET deployment_id = EXCLUDED.deployment_id
  RETURNING deployment_id
)
SELECT
  CASE
    WHEN EXISTS (SELECT 1 FROM record_conflict) THEN 'conflict'
    WHEN ${literal(record.status)} = 'failed' THEN CASE WHEN EXISTS (SELECT 1 FROM current_active) THEN 'retained-active' ELSE 'rejected-no-active' END
    WHEN EXISTS (SELECT 1 FROM activation) THEN 'activated'
    ELSE 'stale-active'
  END,
  (SELECT deployment_id FROM current_active),
  CASE WHEN EXISTS (SELECT 1 FROM activation) THEN ${literal(record.deploymentId)} ELSE (SELECT deployment_id FROM current_active) END;
COMMIT`);
    const row = rows[0];
    if (rows.length !== 1 || row === undefined || row.length !== 3 || typeof row[0] !== "string") throw new Error("DEPLOY_POSTGRES_ATOMIC_RESULT_INVALID");
    if (row[1] !== null && typeof row[1] !== "string") throw new Error("DEPLOY_POSTGRES_ATOMIC_RESULT_INVALID");
    if (row[2] !== null && typeof row[2] !== "string") throw new Error("DEPLOY_POSTGRES_ATOMIC_RESULT_INVALID");
    const outcome = row[0]; const previous = row[1] ?? null; const resulting = row[2] ?? null;
    if (outcome === "conflict") throw new Error(`DEPLOYMENT_RECORD_CONFLICT:${record.deploymentId}`);
    if (outcome !== "activated" && outcome !== "retained-active" && outcome !== "rejected-no-active" && outcome !== "stale-active") throw new Error("DEPLOY_POSTGRES_ATOMIC_RESULT_INVALID");

    this.#cache.set(record.deploymentId, record); this.#persisted.add(record.deploymentId);
    if (resulting !== null) {
      let activeRecord = this.#cache.get(resulting);
      if (activeRecord === undefined) {
        const activeRows = await simpleQuery(this.#connectionString, `SELECT deployment_id, record_json FROM ${this.#recordsTable} WHERE deployment_id = ${literal(resulting)}`);
        const activeRow = activeRows[0];
        if (activeRows.length !== 1 || activeRow === undefined || activeRow.length < 2 || typeof activeRow[0] !== "string" || typeof activeRow[1] !== "string") throw new Error(`DEPLOY_POSTGRES_ACTIVE_INVALID:${record.environmentRef}`);
        activeRecord = normalizeRecord(activeRow[0], activeRow[1]);
        this.#cache.set(activeRecord.deploymentId, activeRecord); this.#persisted.add(activeRecord.deploymentId);
      }
      if (activeRecord.status !== "succeeded" || activeRecord.environmentRef !== record.environmentRef) throw new Error(`DEPLOY_POSTGRES_ACTIVE_INVALID:${record.environmentRef}`);
      this.#cache.setActiveDeploymentId(record.environmentRef, resulting);
    }
    return Object.freeze({ outcome, previousActiveDeploymentId: previous, resultingActiveDeploymentId: resulting });
  }

  async flush(): Promise<void> { await this.#pending; }
  async close(): Promise<void> { await this.flush(); }
}

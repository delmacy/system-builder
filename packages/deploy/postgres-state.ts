import { parsePostgresConnection, postgresQuery, sqlLiteral } from "@system-builder/postgres";
import type { DeploymentRecord } from "./index.js";
import { InMemoryDeploymentRecordStorage, type AtomicDeploymentActivationResult, type DeploymentRecordStorage } from "./storage.js";

type PostgresRow = readonly (string | null)[];

async function simpleQuery(connectionString: string, sql: string): Promise<readonly PostgresRow[]> {
  return postgresQuery(connectionString, sql, "DEPLOY");
}

export async function executeDeployPostgresTransaction(connectionString: string, statements: readonly string[]): Promise<readonly PostgresRow[]> {
  if (statements.length === 0 || statements.some((statement) => statement.trim().length === 0)) throw new Error("DEPLOY_POSTGRES_TRANSACTION_INVALID");
  return simpleQuery(connectionString, `BEGIN;\n${statements.join(";\n")};\nCOMMIT`);
}

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
    parsePostgresConnection(connectionString, "DEPLOY"); const storage = new PostgresDeploymentRecordStorage(connectionString, tables(scope));
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
    this.#pending = this.#pending.then(() => simpleQuery(this.#connectionString, `INSERT INTO ${this.#recordsTable} (deployment_id, record_json) VALUES (${sqlLiteral(deploymentId)}, ${sqlLiteral(encoded)})`).then(() => undefined));
  }
  setActiveDeploymentId(environmentRef: string, deploymentId: string): void {
    this.#cache.setActiveDeploymentId(environmentRef, deploymentId);
    this.#pending = this.#pending.then(() => simpleQuery(this.#connectionString, `INSERT INTO ${this.#activeTable} (environment_ref, deployment_id) VALUES (${sqlLiteral(environmentRef)}, ${sqlLiteral(deploymentId)}) ON CONFLICT (environment_ref) DO UPDATE SET deployment_id = EXCLUDED.deployment_id`).then(() => undefined));
  }

  async activateAtomically(record: DeploymentRecord, expectedActiveDeploymentId: string | null): Promise<AtomicDeploymentActivationResult> {
    await this.flush();
    const encoded = JSON.stringify(record);
    const expectedMatches = expectedActiveDeploymentId === null
      ? "NOT EXISTS (SELECT 1 FROM current_active)"
      : `(SELECT deployment_id FROM current_active) = ${sqlLiteral(expectedActiveDeploymentId)}`;
    const rows = await simpleQuery(this.#connectionString, `
BEGIN;
LOCK TABLE ${this.#activeTable} IN SHARE ROW EXCLUSIVE MODE;
WITH current_active AS (
  SELECT deployment_id FROM ${this.#activeTable} WHERE environment_ref = ${sqlLiteral(record.environmentRef)}
), existing_record AS (
  SELECT record_json FROM ${this.#recordsTable} WHERE deployment_id = ${sqlLiteral(record.deploymentId)}
), record_insert AS (
  INSERT INTO ${this.#recordsTable} (deployment_id, record_json)
  VALUES (${sqlLiteral(record.deploymentId)}, ${sqlLiteral(encoded)})
  ON CONFLICT (deployment_id) DO NOTHING
  RETURNING deployment_id
), record_conflict AS (
  SELECT 1 FROM existing_record WHERE record_json <> ${sqlLiteral(encoded)}
), activation AS (
  INSERT INTO ${this.#activeTable} (environment_ref, deployment_id)
  SELECT ${sqlLiteral(record.environmentRef)}, ${sqlLiteral(record.deploymentId)}
  WHERE ${sqlLiteral(record.status)} = 'succeeded'
    AND NOT EXISTS (SELECT 1 FROM record_conflict)
    AND (${expectedMatches})
  ON CONFLICT (environment_ref) DO UPDATE SET deployment_id = EXCLUDED.deployment_id
  RETURNING deployment_id
)
SELECT
  CASE
    WHEN EXISTS (SELECT 1 FROM record_conflict) THEN 'conflict'
    WHEN ${sqlLiteral(record.status)} = 'failed' THEN CASE WHEN EXISTS (SELECT 1 FROM current_active) THEN 'retained-active' ELSE 'rejected-no-active' END
    WHEN EXISTS (SELECT 1 FROM activation) THEN 'activated'
    ELSE 'stale-active'
  END,
  (SELECT deployment_id FROM current_active),
  CASE WHEN EXISTS (SELECT 1 FROM activation) THEN ${sqlLiteral(record.deploymentId)} ELSE (SELECT deployment_id FROM current_active) END;
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
        const activeRows = await simpleQuery(this.#connectionString, `SELECT deployment_id, record_json FROM ${this.#recordsTable} WHERE deployment_id = ${sqlLiteral(resulting)}`);
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

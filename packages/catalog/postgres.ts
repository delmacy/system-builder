import {
  parsePostgresConnection,
  postgresQuery,
  sqlLiteral,
} from "@system-builder/postgres";
import {
  SoftwareCatalogRegistry,
  catalogIdentity,
  type SoftwareCatalogRecord,
  type SoftwareCatalogRecordInput,
} from "./index.js";
import { InMemoryCatalogRecordStorage, type CatalogRecordStorage } from "./storage.js";

function tableForScope(scope: string): string {
  const normalized = scope.trim().toLowerCase();
  if (!/^[a-z][a-z0-9_]{0,47}$/.test(normalized)) {
    throw new Error("CATALOG_POSTGRES_SCOPE_INVALID");
  }
  return `system_builder_catalog_${normalized}`;
}

function normalizeStoredRecord(identity: string, encoded: string): SoftwareCatalogRecord {
  let input: SoftwareCatalogRecordInput;
  try {
    input = JSON.parse(encoded) as SoftwareCatalogRecordInput;
  } catch {
    throw new Error(`CATALOG_POSTGRES_RECORD_INVALID:${identity}`);
  }
  try {
    const record = new SoftwareCatalogRegistry().register(input);
    if (catalogIdentity(record) !== identity) throw new Error("identity mismatch");
    return record;
  } catch {
    throw new Error(`CATALOG_POSTGRES_RECORD_INVALID:${identity}`);
  }
}

export class PostgresCatalogRecordStorage implements CatalogRecordStorage {
  readonly #connectionString: string;
  readonly #table: string;
  readonly #cache = new InMemoryCatalogRecordStorage();
  #pending: Promise<void> = Promise.resolve();

  private constructor(connectionString: string, table: string) {
    this.#connectionString = connectionString;
    this.#table = table;
  }

  static async open(connectionString: string, scope = "default"): Promise<PostgresCatalogRecordStorage> {
    parsePostgresConnection(connectionString, "CATALOG");
    const storage = new PostgresCatalogRecordStorage(connectionString, tableForScope(scope));
    await postgresQuery(
      connectionString,
      `CREATE TABLE IF NOT EXISTS ${storage.#table} (identity TEXT PRIMARY KEY, record_json TEXT NOT NULL)`,
      "CATALOG",
    );
    const rows = await postgresQuery(
      connectionString,
      `SELECT identity, record_json FROM ${storage.#table} ORDER BY identity`,
      "CATALOG",
    );
    const normalizedRows = rows
      .map((row) => {
        if (row.length < 2 || typeof row[0] !== "string" || typeof row[1] !== "string") {
          throw new Error("CATALOG_POSTGRES_RECORD_INVALID:UNKNOWN");
        }
        const identity = row[0];
        const encoded = row[1];
        return [identity, normalizeStoredRecord(identity, encoded)] as const;
      })
      .sort(([left], [right]) => left.localeCompare(right));
    for (const [identity, record] of normalizedRows) storage.#cache.set(identity, record);
    return storage;
  }

  has(identity: string): boolean {
    return this.#cache.has(identity);
  }

  set(identity: string, record: SoftwareCatalogRecord): void {
    this.#cache.set(identity, record);
    const encoded = JSON.stringify(record);
    this.#pending = this.#pending.then(async () => {
      await postgresQuery(
        this.#connectionString,
        `INSERT INTO ${this.#table} (identity, record_json) VALUES (${sqlLiteral(identity)}, ${sqlLiteral(encoded)}) ` +
          `ON CONFLICT (identity) DO UPDATE SET record_json = EXCLUDED.record_json`,
        "CATALOG",
      );
    });
  }

  values(): readonly SoftwareCatalogRecord[] {
    return this.#cache.values();
  }

  async flush(): Promise<void> {
    await this.#pending;
  }

  async close(): Promise<void> {
    await this.flush();
  }
}

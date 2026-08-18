import { postgresQuery, sqlLiteral } from "@system-builder/postgres";
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
      await postgresQuery(
        connection,
        "CREATE TABLE IF NOT EXISTS _system_builder_migrations (capability TEXT NOT NULL, migration_id TEXT NOT NULL, content_hash TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (capability, migration_id))",
        "POSTGRES",
      );
      initializedConnections.add(connection);
    }

    const existing = await postgresQuery(
      connection,
      `SELECT content_hash FROM _system_builder_migrations WHERE capability = ${sqlLiteral(migration.capability)} AND migration_id = ${sqlLiteral(migration.id)}`,
      "POSTGRES",
    );
    const recordedHash = existing[0]?.[0];
    if (recordedHash !== undefined && recordedHash !== null) {
      if (recordedHash !== migration.contentHash) {
        throw new Error(`MIGRATION_APPLIED_HASH_MISMATCH:${migration.capability}:${migration.id}`);
      }
      applied.push(migrationEvidence(migration, "skipped"));
      continue;
    }

    await postgresQuery(
      connection,
      `BEGIN;\n${file.content}\nINSERT INTO _system_builder_migrations (capability, migration_id, content_hash) VALUES (${sqlLiteral(migration.capability)}, ${sqlLiteral(migration.id)}, ${sqlLiteral(migration.contentHash)});\nCOMMIT;`,
      "POSTGRES",
    );
    applied.push(migrationEvidence(migration, "applied"));
  }

  return Object.freeze({
    kind: "LocalMigrationApplication",
    migrations: Object.freeze(applied),
  });
};

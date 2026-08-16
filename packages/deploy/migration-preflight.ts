export type MigrationPreflightFile = Readonly<{
  path: string;
  content: string;
  contentHash: string;
}>;

export type LocalMigrationPreflightMigration = Readonly<{
  capability: string;
  storeKind: "sql";
  connectionBinding: Readonly<{ name: string; kind: "secret-reference" }>;
  id: string;
  order: number;
  path: string;
  contentHash: string;
}>;

export type LocalMigrationPreflight = Readonly<{
  kind: "LocalMigrationPreflight";
  migrations: readonly LocalMigrationPreflightMigration[];
}>;

function token(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`MIGRATION_PREFLIGHT_INVALID_${field.toUpperCase()}`);
  }
  return value.trim();
}

function object(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`MIGRATION_PREFLIGHT_INVALID_${field.toUpperCase()}`);
  }
  return value as Record<string, unknown>;
}

function migrationPath(value: unknown): string {
  const path = token(value, "path").replaceAll("\\", "/");
  const segments = path.split("/");
  if (
    !path.startsWith("migrations/") ||
    segments.some((segment) => segment.length === 0 || segment === "." || segment === "..")
  ) throw new Error(`MIGRATION_PREFLIGHT_INVALID_PATH:${path}`);
  return path;
}

function contentHash(value: unknown, path: string): string {
  const hash = token(value, "content_hash");
  if (!/^sha256:[a-f0-9]{64}$/.test(hash)) {
    throw new Error(`MIGRATION_PREFLIGHT_INVALID_CONTENT_HASH:${path}`);
  }
  return hash;
}

export function preflightVerifiedMigrations(files: readonly MigrationPreflightFile[]): LocalMigrationPreflight {
  const manifestFiles = files.filter((file) => file.path === "migration-manifest.json");
  const migrationFiles = files.filter((file) => file.path.startsWith("migrations/"));
  if (manifestFiles.length === 0) {
    if (migrationFiles.length > 0) throw new Error("MIGRATION_MANIFEST_MISSING");
    return Object.freeze({ kind: "LocalMigrationPreflight", migrations: Object.freeze([]) });
  }
  if (manifestFiles.length !== 1) throw new Error("MIGRATION_MANIFEST_DUPLICATE");

  let raw: unknown;
  try {
    raw = JSON.parse(manifestFiles[0]!.content);
  } catch {
    throw new Error("MIGRATION_MANIFEST_PARSE_FAILED");
  }
  const manifest = object(raw, "manifest");
  if (manifest.kind !== "RuntimeMigrationManifest" || !Array.isArray(manifest.requirements)) {
    throw new Error("MIGRATION_MANIFEST_INVALID_SHAPE");
  }

  const byPath = new Map(migrationFiles.map((file) => [file.path, file]));
  if (byPath.size !== migrationFiles.length) throw new Error("MIGRATION_FILE_DUPLICATE_PATH");
  const seenPaths = new Set<string>();
  const seenIds = new Set<string>();
  const seenOrders = new Set<string>();
  const migrations: LocalMigrationPreflightMigration[] = [];

  for (const rawRequirement of manifest.requirements) {
    const requirement = object(rawRequirement, "requirement");
    const capability = token(requirement.capability, "capability");
    if (requirement.storeKind !== "sql") throw new Error(`MIGRATION_PREFLIGHT_INVALID_STORE:${capability}`);
    const binding = object(requirement.connectionBinding, "connection_binding");
    if (Object.prototype.hasOwnProperty.call(binding, "value") || Object.prototype.hasOwnProperty.call(binding, "reference")) {
      throw new Error(`MIGRATION_PREFLIGHT_CONNECTION_MATERIAL_NOT_ALLOWED:${capability}`);
    }
    if (binding.kind !== "secret-reference") {
      throw new Error(`MIGRATION_PREFLIGHT_BINDING_KIND_INVALID:${capability}`);
    }
    const connectionBinding = Object.freeze({
      name: token(binding.name, "connection_binding_name"),
      kind: "secret-reference" as const,
    });
    if (!Array.isArray(requirement.migrations)) {
      throw new Error(`MIGRATION_PREFLIGHT_INVALID_MIGRATIONS:${capability}`);
    }

    for (const rawMigration of requirement.migrations) {
      const migration = object(rawMigration, "migration");
      const id = token(migration.id, "id");
      const order = migration.order;
      if (typeof order !== "number" || !Number.isInteger(order) || order <= 0) {
        throw new Error(`MIGRATION_PREFLIGHT_INVALID_ORDER:${capability}:${id}`);
      }
      const path = migrationPath(migration.path);
      const expectedHash = contentHash(migration.contentHash, path);
      const idKey = `${capability}:${id}`;
      const orderKey = `${capability}:${order}`;
      if (seenIds.has(idKey)) throw new Error(`MIGRATION_PREFLIGHT_DUPLICATE_ID:${idKey}`);
      if (seenOrders.has(orderKey)) throw new Error(`MIGRATION_PREFLIGHT_DUPLICATE_ORDER:${orderKey}`);
      if (seenPaths.has(path)) throw new Error(`MIGRATION_PREFLIGHT_DUPLICATE_PATH:${path}`);
      seenIds.add(idKey);
      seenOrders.add(orderKey);
      seenPaths.add(path);

      const file = byPath.get(path);
      if (!file) throw new Error(`MIGRATION_PREFLIGHT_FILE_MISSING:${path}`);
      if (file.contentHash !== expectedHash) throw new Error(`MIGRATION_PREFLIGHT_HASH_MISMATCH:${path}`);
      migrations.push(Object.freeze({
        capability,
        storeKind: "sql",
        connectionBinding,
        id,
        order,
        path,
        contentHash: expectedHash,
      }));
    }
  }

  const declaredPaths = [...seenPaths].sort((left, right) => left.localeCompare(right));
  const actualPaths = [...byPath.keys()].sort((left, right) => left.localeCompare(right));
  if (JSON.stringify(declaredPaths) !== JSON.stringify(actualPaths)) {
    const unlisted = actualPaths.find((path) => !seenPaths.has(path));
    throw new Error(`MIGRATION_PREFLIGHT_FILE_UNLISTED:${unlisted ?? "coverage"}`);
  }

  migrations.sort(
    (left, right) =>
      left.order - right.order ||
      left.capability.localeCompare(right.capability) ||
      left.id.localeCompare(right.id) ||
      left.path.localeCompare(right.path),
  );
  return Object.freeze({ kind: "LocalMigrationPreflight", migrations: Object.freeze(migrations) });
}

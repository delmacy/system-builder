export type RuntimeStateConnectionBinding = Readonly<{
  name: string;
  kind: "secret-reference";
}>;

export type RuntimeStateMigrationDescriptor = Readonly<{
  id: string;
  capability: string;
  order: number;
  path: string;
  content: string;
}>;

export type RuntimeStateRequirement = Readonly<{
  kind: "RuntimeStateRequirement";
  capability: string;
  storeKind: "sql";
  connectionBinding: RuntimeStateConnectionBinding;
  migrations: readonly RuntimeStateMigrationDescriptor[];
}>;

function requireToken(value: string, field: string): string {
  const token = value.trim();
  if (token.length === 0) throw new Error(`RUNTIME_STATE_INVALID_${field.toUpperCase()}`);
  return token;
}

function normalizeMigrationPath(value: string): string {
  const path = requireToken(value, "migration_path").replaceAll("\\", "/");
  const segments = path.split("/");
  if (
    !path.startsWith("migrations/") ||
    path.startsWith("/") ||
    segments.some((segment) => segment.length === 0 || segment === "." || segment === "..")
  ) {
    throw new Error(`RUNTIME_MIGRATION_INVALID_PATH:${value}`);
  }
  return path;
}

export function normalizeRuntimeStateRequirement(input: RuntimeStateRequirement): RuntimeStateRequirement {
  if (!input || input.kind !== "RuntimeStateRequirement") {
    throw new Error("RUNTIME_STATE_INVALID_REQUIREMENT");
  }
  const capability = requireToken(input.capability, "capability");
  if (input.storeKind !== "sql") throw new Error("RUNTIME_STATE_INVALID_STORE_KIND");

  const rawBinding = input.connectionBinding as RuntimeStateConnectionBinding & Record<string, unknown>;
  if (!rawBinding || typeof rawBinding !== "object") {
    throw new Error("RUNTIME_STATE_INVALID_CONNECTION_BINDING");
  }
  if (Object.prototype.hasOwnProperty.call(rawBinding, "value")) {
    throw new Error("RUNTIME_STATE_INLINE_VALUE_NOT_ALLOWED");
  }
  if (Object.prototype.hasOwnProperty.call(rawBinding, "reference")) {
    throw new Error("RUNTIME_STATE_REFERENCE_NOT_ALLOWED");
  }
  if (rawBinding.kind !== "secret-reference") {
    throw new Error("RUNTIME_STATE_CONNECTION_BINDING_MUST_BE_SECRET_REFERENCE");
  }
  const connectionBinding = Object.freeze({
    name: requireToken(rawBinding.name, "connection_binding_name"),
    kind: "secret-reference" as const,
  });

  if (!Array.isArray(input.migrations)) throw new Error("RUNTIME_STATE_INVALID_MIGRATIONS");
  const ids = new Set<string>();
  const orders = new Set<number>();
  const paths = new Set<string>();
  const migrations = input.migrations.map((migration) => {
    const id = requireToken(migration.id, "migration_id");
    const migrationCapability = requireToken(migration.capability, "migration_capability");
    if (migrationCapability !== capability) {
      throw new Error(`RUNTIME_MIGRATION_CAPABILITY_MISMATCH:${id}`);
    }
    if (!Number.isInteger(migration.order) || migration.order <= 0) {
      throw new Error(`RUNTIME_MIGRATION_INVALID_ORDER:${id}`);
    }
    const path = normalizeMigrationPath(migration.path);
    if (migration.content.trim().length === 0) {
      throw new Error(`RUNTIME_MIGRATION_EMPTY_CONTENT:${id}`);
    }
    if (ids.has(id)) throw new Error(`RUNTIME_MIGRATION_DUPLICATE_ID:${id}`);
    if (orders.has(migration.order)) throw new Error(`RUNTIME_MIGRATION_DUPLICATE_ORDER:${migration.order}`);
    if (paths.has(path)) throw new Error(`RUNTIME_MIGRATION_DUPLICATE_PATH:${path}`);
    ids.add(id);
    orders.add(migration.order);
    paths.add(path);
    return Object.freeze({
      id,
      capability: migrationCapability,
      order: migration.order,
      path,
      content: migration.content,
    });
  });
  migrations.sort(
    (left, right) =>
      left.order - right.order || left.id.localeCompare(right.id) || left.path.localeCompare(right.path),
  );

  return Object.freeze({
    kind: "RuntimeStateRequirement",
    capability,
    storeKind: "sql",
    connectionBinding,
    migrations: Object.freeze(migrations),
  });
}

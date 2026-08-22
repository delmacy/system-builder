export type RuntimeEntityField = Readonly<{
  name: string;
  type: string;
  required: boolean;
  referenceEntity?: string;
}>;

export type RuntimeEntityDefinition = Readonly<{
  id: string;
  table: string;
  fields: readonly RuntimeEntityField[];
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validFieldValue(type: string, value: unknown): boolean {
  if (value === null) return true;
  if (type === "string" || type === "date" || type === "datetime" || type === "reference") return typeof value === "string";
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  if (type === "boolean") return typeof value === "boolean";
  if (type === "json") return value !== undefined;
  return false;
}

export function validateRuntimeEntityPayload(
  entity: RuntimeEntityDefinition,
  payload: unknown,
  partial = false,
): Readonly<{ ok: true; value: Readonly<Record<string, unknown>> } | { ok: false; code: string; detail: string }> {
  if (!isRecord(payload)) return Object.freeze({ ok: false, code: "RUNTIME_ENTITY_INVALID_PAYLOAD", detail: entity.id });
  const fields = new Map(entity.fields.map((field) => [field.name, field]));
  for (const key of Object.keys(payload)) {
    const field = fields.get(key);
    if (!field) return Object.freeze({ ok: false, code: "RUNTIME_ENTITY_UNKNOWN_FIELD", detail: `${entity.id}:${key}` });
    if (!validFieldValue(field.type, payload[key])) {
      return Object.freeze({ ok: false, code: "RUNTIME_ENTITY_INVALID_FIELD_TYPE", detail: `${entity.id}:${key}:${field.type}` });
    }
  }
  if (!partial) {
    for (const field of entity.fields) {
      if (field.required && !(field.name in payload)) {
        return Object.freeze({ ok: false, code: "RUNTIME_ENTITY_REQUIRED_FIELD_MISSING", detail: `${entity.id}:${field.name}` });
      }
    }
  }
  return Object.freeze({ ok: true, value: Object.freeze({ ...payload }) });
}

export function renderRuntimeEntityPersistenceSupport(): string {
  return [
    "function runtimeEntityById(model, entityId) { return model.entities.find((entity) => entity.id === entityId); }",
    "function runtimeSqlLiteral(value) { return \"'\" + String(value).replaceAll(\"'\", \"''\") + \"'\"; }",
    "function runtimeJsonLiteral(value) { return runtimeSqlLiteral(JSON.stringify(value)) + \"::jsonb\"; }",
    "function runtimeEntityFieldValid(type, value) { if (value === null) return true; if (type === \"string\" || type === \"date\" || type === \"datetime\" || type === \"reference\") return typeof value === \"string\"; if (type === \"number\") return typeof value === \"number\" && Number.isFinite(value); if (type === \"boolean\") return typeof value === \"boolean\"; if (type === \"json\") return value !== undefined; return false; }",
    "function runtimeValidateEntityPayload(entity, payload, partial) {",
    "  if (!payload || typeof payload !== \"object\" || Array.isArray(payload)) return { ok: false, code: \"RUNTIME_ENTITY_INVALID_PAYLOAD\", detail: entity.id };",
    "  const fields = new Map(entity.fields.map((field) => [field.name, field]));",
    "  for (const key of Object.keys(payload)) { const field = fields.get(key); if (!field) return { ok: false, code: \"RUNTIME_ENTITY_UNKNOWN_FIELD\", detail: entity.id + \":\" + key }; if (!runtimeEntityFieldValid(field.type, payload[key])) return { ok: false, code: \"RUNTIME_ENTITY_INVALID_FIELD_TYPE\", detail: entity.id + \":\" + key + \":\" + field.type }; }",
    "  if (!partial) { for (const field of entity.fields) if (field.required && !Object.prototype.hasOwnProperty.call(payload, field.name)) return { ok: false, code: \"RUNTIME_ENTITY_REQUIRED_FIELD_MISSING\", detail: entity.id + \":\" + field.name }; }",
    "  return { ok: true, value: payload };",
    "}",
    "function runtimeEntityResult(rows) { if (!Array.isArray(rows) || rows.length === 0) return undefined; const row = rows[0]; return { id: row[0], data: JSON.parse(row[1] || \"{}\"), workflowState: JSON.parse(row[2] || \"{}\") }; }",
    "async function runtimeEntityCreate(connectionString, entity, id, payload) { const checked = runtimeValidateEntityPayload(entity, payload, false); if (!checked.ok) return checked; const rows = await postgresSimpleQuery(connectionString, \"INSERT INTO \\\"\" + entity.table + \"\\\" (\\\"id\\\", \\\"data\\\") VALUES (\" + runtimeSqlLiteral(id) + \", \" + runtimeJsonLiteral(checked.value) + \") RETURNING \\\"id\\\", \\\"data\\\"::text, \\\"workflow_state\\\"::text;\"); return { ok: true, value: runtimeEntityResult(rows) }; }",
    "async function runtimeEntityRead(connectionString, entity, id) { const rows = await postgresSimpleQuery(connectionString, \"SELECT \\\"id\\\", \\\"data\\\"::text, \\\"workflow_state\\\"::text FROM \\\"\" + entity.table + \"\\\" WHERE \\\"id\\\" = \" + runtimeSqlLiteral(id) + \";\"); const value = runtimeEntityResult(rows); return value ? { ok: true, value } : { ok: false, code: \"RUNTIME_ENTITY_NOT_FOUND\", detail: entity.id + \":\" + id }; }",
    "async function runtimeEntityUpdate(connectionString, entity, id, payload) { const checked = runtimeValidateEntityPayload(entity, payload, true); if (!checked.ok) return checked; const rows = await postgresSimpleQuery(connectionString, \"UPDATE \\\"\" + entity.table + \"\\\" SET \\\"data\\\" = \\\"data\\\" || \" + runtimeJsonLiteral(checked.value) + \" WHERE \\\"id\\\" = \" + runtimeSqlLiteral(id) + \" RETURNING \\\"id\\\", \\\"data\\\"::text, \\\"workflow_state\\\"::text;\"); const value = runtimeEntityResult(rows); return value ? { ok: true, value } : { ok: false, code: \"RUNTIME_ENTITY_NOT_FOUND\", detail: entity.id + \":\" + id }; }",
    "async function runtimeEntityDelete(connectionString, entity, id) { const rows = await postgresSimpleQuery(connectionString, \"DELETE FROM \\\"\" + entity.table + \"\\\" WHERE \\\"id\\\" = \" + runtimeSqlLiteral(id) + \" RETURNING \\\"id\\\", \\\"data\\\"::text, \\\"workflow_state\\\"::text;\"); const value = runtimeEntityResult(rows); return value ? { ok: true, value } : { ok: false, code: \"RUNTIME_ENTITY_NOT_FOUND\", detail: entity.id + \":\" + id }; }",
  ].join("\n");
}

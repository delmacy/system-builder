import { canonicalJson, sha256Canonical, sha256Text } from "@system-builder/deterministic";
import type { RuntimeStateRequirement } from "@system-builder/runtime-core";
import {
  compileSyntheticRelease,
  type CompileSyntheticInput,
  type GeneratedFile,
  type ReleaseArtifact,
  type SyntheticCompilation,
} from "./index.js";
import {
  normalizeSystemDefinitionRuntimeProjection,
  type CompilerSystemDefinitionRuntimeProjection,
} from "./runtime-projection.js";

export type RuntimeModel = Readonly<{
  kind: "RuntimeModel";
  systemDefinitionRef: string;
  entities: readonly Readonly<{
    id: string;
    table: string;
    fields: readonly Readonly<{
      name: string;
      type: string;
      required: boolean;
      referenceEntity?: string;
    }>[];
  }>[];
  actions: CompilerSystemDefinitionRuntimeProjection["actions"];
  processes: CompilerSystemDefinitionRuntimeProjection["processes"];
  environmentRequirements: NonNullable<CompilerSystemDefinitionRuntimeProjection["environmentRequirements"]>;
  jobs: NonNullable<CompilerSystemDefinitionRuntimeProjection["jobs"]>;
  events: NonNullable<CompilerSystemDefinitionRuntimeProjection["events"]>;
  files: NonNullable<CompilerSystemDefinitionRuntimeProjection["files"]>;
  integrations: NonNullable<CompilerSystemDefinitionRuntimeProjection["integrations"]>;
  authenticationProviders: NonNullable<CompilerSystemDefinitionRuntimeProjection["authenticationProviders"]>;
  identities: NonNullable<CompilerSystemDefinitionRuntimeProjection["identities"]>;
  sessionPolicy?: CompilerSystemDefinitionRuntimeProjection["sessionPolicy"];
}>;

export type CompileRuntimeModelInput = CompileSyntheticInput & Readonly<{
  systemDefinitionRuntime: CompilerSystemDefinitionRuntimeProjection;
  entityConnectionBinding?: string;
}>;

function entityTable(id: string): string {
  return `sb_entity_${sha256Text(id).slice("sha256:".length, "sha256:".length + 16)}`;
}

export function materializeRuntimeModel(
  expectedSystemDefinitionRef: string,
  projection: CompilerSystemDefinitionRuntimeProjection,
): Readonly<{ model: RuntimeModel; stateRequirement?: RuntimeStateRequirement }> {
  const normalized = normalizeSystemDefinitionRuntimeProjection(expectedSystemDefinitionRef, projection);
  const entities = normalized.entities.map((entity) => Object.freeze({
    id: entity.id,
    table: entityTable(entity.id),
    fields: Object.freeze(entity.fields.map((field) => Object.freeze({
      name: field.name,
      type: field.type,
      required: field.required === true,
      ...(field.referenceEntity === undefined ? {} : { referenceEntity: field.referenceEntity }),
    }))),
  }));
  const model: RuntimeModel = Object.freeze({
    kind: "RuntimeModel",
    systemDefinitionRef: normalized.systemDefinitionRef,
    entities: Object.freeze(entities),
    actions: normalized.actions,
    processes: normalized.processes,
    environmentRequirements: normalized.environmentRequirements ?? Object.freeze([]),
    jobs: normalized.jobs ?? Object.freeze([]),
    events: normalized.events ?? Object.freeze([]),
    files: normalized.files ?? Object.freeze([]),
    integrations: normalized.integrations ?? Object.freeze([]),
    authenticationProviders: normalized.authenticationProviders ?? Object.freeze([]),
    identities: normalized.identities ?? Object.freeze([]),
    ...(normalized.sessionPolicy === undefined ? {} : { sessionPolicy: normalized.sessionPolicy }),
  });
  if (entities.length === 0) return Object.freeze({ model });

  const migrations = entities.map((entity, index) => {
    const token = sha256Text(entity.id).slice("sha256:".length, "sha256:".length + 12);
    return Object.freeze({
      id: `runtime-entity-${token}`,
      capability: "runtime.entities",
      order: index + 1,
      path: `migrations/runtime-entities/${String(index + 1).padStart(3, "0")}-${token}.sql`,
      content: `CREATE TABLE IF NOT EXISTS "${entity.table}" ("id" text PRIMARY KEY, "data" jsonb NOT NULL DEFAULT '{}'::jsonb, "workflow_state" jsonb NOT NULL DEFAULT '{}'::jsonb);\n`,
    });
  });
  return Object.freeze({
    model,
    stateRequirement: Object.freeze({
      kind: "RuntimeStateRequirement",
      capability: "runtime.entities",
      storeKind: "sql",
      connectionBinding: Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" }),
      migrations: Object.freeze(migrations),
    }),
  });
}

function runtimeExecutionSupport(): string {
  return [
    "function runtimeEntityById(model, entityId) { return model.entities.find((entity) => entity.id === entityId); }",
    "function runtimeSqlLiteral(value) { return \"'\" + String(value).replaceAll(\"'\", \"''\") + \"'\"; }",
    "function runtimeJsonLiteral(value) { return runtimeSqlLiteral(JSON.stringify(value)) + \"::jsonb\"; }",
    "function runtimeEntityFieldValid(type, value) { if (value === null) return true; if (type === \"string\" || type === \"date\" || type === \"datetime\" || type === \"reference\") return typeof value === \"string\"; if (type === \"number\") return typeof value === \"number\" && Number.isFinite(value); if (type === \"boolean\") return typeof value === \"boolean\"; if (type === \"json\") return value !== undefined; return false; }",
    "function runtimeValidateEntityPayload(entity, payload, partial) { if (!payload || typeof payload !== \"object\" || Array.isArray(payload)) return { ok: false, code: \"RUNTIME_ENTITY_INVALID_PAYLOAD\", detail: entity.id }; const fields = new Map(entity.fields.map((field) => [field.name, field])); for (const key of Object.keys(payload)) { const field = fields.get(key); if (!field) return { ok: false, code: \"RUNTIME_ENTITY_UNKNOWN_FIELD\", detail: entity.id + \":\" + key }; if (!runtimeEntityFieldValid(field.type, payload[key])) return { ok: false, code: \"RUNTIME_ENTITY_INVALID_FIELD_TYPE\", detail: entity.id + \":\" + key + \":\" + field.type }; } if (!partial) for (const field of entity.fields) if (field.required && !Object.prototype.hasOwnProperty.call(payload, field.name)) return { ok: false, code: \"RUNTIME_ENTITY_REQUIRED_FIELD_MISSING\", detail: entity.id + \":\" + field.name }; return { ok: true, value: payload }; }",
    "function runtimeEntityResult(rows) { if (!Array.isArray(rows) || rows.length === 0) return undefined; const row = rows[0]; return { id: row[0], data: JSON.parse(row[1] || \"{}\"), workflowState: JSON.parse(row[2] || \"{}\") }; }",
    "async function runtimeEntityCreate(connectionString, entity, id, payload) { const checked = runtimeValidateEntityPayload(entity, payload, false); if (!checked.ok) return checked; const rows = await postgresSimpleQuery(connectionString, \"INSERT INTO \\\"\" + entity.table + \"\\\" (\\\"id\\\", \\\"data\\\") VALUES (\" + runtimeSqlLiteral(id) + \", \" + runtimeJsonLiteral(checked.value) + \") RETURNING \\\"id\\\", \\\"data\\\"::text, \\\"workflow_state\\\"::text;\"); return { ok: true, value: runtimeEntityResult(rows) }; }",
    "async function runtimeEntityRead(connectionString, entity, id) { const rows = await postgresSimpleQuery(connectionString, \"SELECT \\\"id\\\", \\\"data\\\"::text, \\\"workflow_state\\\"::text FROM \\\"\" + entity.table + \"\\\" WHERE \\\"id\\\" = \" + runtimeSqlLiteral(id) + \";\"); const value = runtimeEntityResult(rows); return value ? { ok: true, value } : { ok: false, code: \"RUNTIME_ENTITY_NOT_FOUND\", detail: entity.id + \":\" + id }; }",
    "async function runtimeEntityUpdate(connectionString, entity, id, payload) { const checked = runtimeValidateEntityPayload(entity, payload, true); if (!checked.ok) return checked; const rows = await postgresSimpleQuery(connectionString, \"UPDATE \\\"\" + entity.table + \"\\\" SET \\\"data\\\" = \\\"data\\\" || \" + runtimeJsonLiteral(checked.value) + \" WHERE \\\"id\\\" = \" + runtimeSqlLiteral(id) + \" RETURNING \\\"id\\\", \\\"data\\\"::text, \\\"workflow_state\\\"::text;\"); const value = runtimeEntityResult(rows); return value ? { ok: true, value } : { ok: false, code: \"RUNTIME_ENTITY_NOT_FOUND\", detail: entity.id + \":\" + id }; }",
    "async function runtimeEntityDelete(connectionString, entity, id) { const rows = await postgresSimpleQuery(connectionString, \"DELETE FROM \\\"\" + entity.table + \"\\\" WHERE \\\"id\\\" = \" + runtimeSqlLiteral(id) + \" RETURNING \\\"id\\\", \\\"data\\\"::text, \\\"workflow_state\\\"::text;\"); const value = runtimeEntityResult(rows); return value ? { ok: true, value } : { ok: false, code: \"RUNTIME_ENTITY_NOT_FOUND\", detail: entity.id + \":\" + id }; }",
    "function runtimeReadJsonBody(request) { return new Promise((resolve, reject) => { let body = \"\"; request.setEncoding(\"utf8\"); request.on(\"data\", (chunk) => { body += chunk; if (body.length > 1048576) reject(new Error(\"RUNTIME_REQUEST_BODY_TOO_LARGE\")); }); request.on(\"end\", () => { try { resolve(body.length === 0 ? {} : JSON.parse(body)); } catch { reject(new Error(\"RUNTIME_INVALID_JSON_BODY\")); } }); request.on(\"error\", reject); }); }",
    "function runtimeWriteJson(response, status, value) { response.writeHead(status, { \"content-type\": \"application/json\" }); response.end(JSON.stringify(value)); }",
    "function runtimeEntityRoute(url) { const pathname = String(url || \"\").split(\"?\", 1)[0]; const match = pathname.match(/^\\/entities\\/([^/]+)\\/([^/]+)$/); if (!match) return undefined; try { return { entityId: decodeURIComponent(match[1]), recordId: decodeURIComponent(match[2]) }; } catch { return undefined; } }",
    "async function runtimeHandleEntityRequest(request, response, model, connectionString) { const route = runtimeEntityRoute(request.url); if (!route) return false; const entity = runtimeEntityById(model, route.entityId); if (!entity) { runtimeWriteJson(response, 404, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_ENTITY_UNKNOWN\", detail: route.entityId }); return true; } try { let result; if (request.method === \"GET\") result = await runtimeEntityRead(connectionString, entity, route.recordId); else if (request.method === \"POST\") result = await runtimeEntityCreate(connectionString, entity, route.recordId, await runtimeReadJsonBody(request)); else if (request.method === \"PATCH\" || request.method === \"PUT\") result = await runtimeEntityUpdate(connectionString, entity, route.recordId, await runtimeReadJsonBody(request)); else if (request.method === \"DELETE\") result = await runtimeEntityDelete(connectionString, entity, route.recordId); else { runtimeWriteJson(response, 405, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_ENTITY_METHOD_NOT_ALLOWED\", detail: String(request.method || \"\") }); return true; } if (!result.ok) { runtimeWriteJson(response, result.code === \"RUNTIME_ENTITY_NOT_FOUND\" ? 404 : 400, { kind: \"RuntimeDiagnostic\", code: result.code, detail: result.detail }); return true; } runtimeWriteJson(response, request.method === \"POST\" ? 201 : 200, { kind: \"RuntimeEntity\", entityId: entity.id, record: result.value }); return true; } catch (error) { runtimeWriteJson(response, 503, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_ENTITY_DATABASE_FAILED\", detail: error instanceof Error ? error.message : \"ENTITY_DATABASE_FAILED\" }); return true; } }",
    "async function runtimeExecuteDeclaredAction(model, connectionString, actionId, recordId, payload) { const action = model.actions.find((candidate) => candidate.id === actionId); if (!action) return { ok: false, status: 404, code: \"RUNTIME_ACTION_UNKNOWN\", detail: actionId }; if (!action.effect) return { ok: false, status: 400, code: \"RUNTIME_ACTION_UNSUPPORTED\", detail: actionId }; const entity = runtimeEntityById(model, action.effect.entityRef); if (!entity) return { ok: false, status: 400, code: \"RUNTIME_ACTION_INVALID_TARGET\", detail: action.effect.entityRef }; let result; if (action.effect.kind === \"entity.create\") result = await runtimeEntityCreate(connectionString, entity, recordId, payload || {}); else if (action.effect.kind === \"entity.update\") result = await runtimeEntityUpdate(connectionString, entity, recordId, payload || {}); else if (action.effect.kind === \"entity.delete\") result = await runtimeEntityDelete(connectionString, entity, recordId); else return { ok: false, status: 400, code: \"RUNTIME_ACTION_UNSUPPORTED\", detail: action.effect.kind }; if (!result.ok) return { ok: false, status: result.code === \"RUNTIME_ENTITY_NOT_FOUND\" ? 404 : 400, code: result.code, detail: result.detail }; return { ok: true, status: 200, action, result }; }",
    "function runtimeActionRoute(url) { const pathname = String(url || \"\").split(\"?\", 1)[0]; const match = pathname.match(/^\\/actions\\/([^/]+)\\/([^/]+)$/); if (!match) return undefined; try { return { actionId: decodeURIComponent(match[1]), recordId: decodeURIComponent(match[2]) }; } catch { return undefined; } }",
    "async function runtimeHandleActionRequest(request, response, model, connectionString) { const route = runtimeActionRoute(request.url); if (!route) return false; if (request.method !== \"POST\") { runtimeWriteJson(response, 405, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_ACTION_METHOD_NOT_ALLOWED\", detail: String(request.method || \"\") }); return true; } try { const outcome = await runtimeExecuteDeclaredAction(model, connectionString, route.actionId, route.recordId, await runtimeReadJsonBody(request)); if (!outcome.ok) { runtimeWriteJson(response, outcome.status, { kind: \"RuntimeDiagnostic\", code: outcome.code, detail: outcome.detail }); return true; } runtimeWriteJson(response, 200, { kind: \"RuntimeAction\", actionId: outcome.action.id, effect: outcome.action.effect.kind, record: outcome.result.value }); return true; } catch (error) { runtimeWriteJson(response, 503, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_ACTION_DATABASE_FAILED\", detail: error instanceof Error ? error.message : \"ACTION_DATABASE_FAILED\" }); return true; } }",
    "function runtimeEventRoute(url) { const pathname = String(url || \"\").split(\"?\", 1)[0]; const match = pathname.match(/^\\/events\\/([^/]+)$/); if (!match) return undefined; try { return { eventId: decodeURIComponent(match[1]) }; } catch { return undefined; } }",
    "async function runtimeHandleEventRequest(request, response, model, connectionString) { const route = runtimeEventRoute(request.url); if (!route) return false; if (request.method !== \"POST\") { runtimeWriteJson(response, 405, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_EVENT_METHOD_NOT_ALLOWED\", detail: String(request.method || \"\") }); return true; } const event = model.events.find((candidate) => candidate.id === route.eventId); if (!event || !event.source || event.source.kind !== \"runtime-http\") { runtimeWriteJson(response, 404, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_EVENT_UNKNOWN\", detail: route.eventId }); return true; } try { const body = await runtimeReadJsonBody(request); if (!body || typeof body !== \"object\" || Array.isArray(body) || typeof body.recordId !== \"string\" || body.recordId.trim().length === 0 || (body.payload !== undefined && (!body.payload || typeof body.payload !== \"object\" || Array.isArray(body.payload)))) { runtimeWriteJson(response, 400, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_EVENT_INVALID_BODY\", detail: route.eventId }); return true; } const outcome = await runtimeExecuteDeclaredAction(model, connectionString, event.actionRef, body.recordId, body.payload || {}); if (!outcome.ok) { runtimeWriteJson(response, outcome.status, { kind: \"RuntimeDiagnostic\", code: outcome.code, detail: route.eventId + \":\" + outcome.detail }); return true; } runtimeWriteJson(response, 200, { kind: \"RuntimeEvent\", eventId: event.id, actionId: event.actionRef, record: outcome.result.value }); return true; } catch (error) { runtimeWriteJson(response, 400, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_EVENT_EXECUTION_FAILED\", detail: route.eventId + \":\" + (error instanceof Error ? error.message : \"EVENT_FAILED\") }); return true; } }",
    "function runtimeStartJobs(model, connectionString) { if (!Array.isArray(model.jobs) || model.jobs.length === 0) return []; return model.jobs.map((job) => { const timer = setInterval(() => { void runtimeExecuteDeclaredAction(model, connectionString, job.actionRef, job.recordId, {}).then((outcome) => { if (!outcome.ok) process.stderr.write(JSON.stringify({ kind: \"RuntimeDiagnostic\", code: outcome.code, detail: job.id + \":\" + outcome.detail }) + \"\\n\"); }).catch((error) => process.stderr.write(JSON.stringify({ kind: \"RuntimeDiagnostic\", code: \"RUNTIME_JOB_EXECUTION_FAILED\", detail: job.id + \":\" + (error instanceof Error ? error.message : \"JOB_FAILED\") }) + \"\\n\")); }, job.trigger.intervalMs); return timer; }); }",
  ].join("\n");
}

function injectRuntimeExecution(entrypoint: string): string {
  const supportMarker = "const SPEC = ";
  const setupMarker = "            const server = createServer(async (request, response) => {";
  const routeMarker = "              response.writeHead(404, { \"content-type\": \"application/json\" });";
  const shutdownMarker = "              server.close(() => process.exit(0));";
  if (!entrypoint.includes(supportMarker) || !entrypoint.includes(setupMarker) || !entrypoint.includes(routeMarker) || !entrypoint.includes(shutdownMarker)) {
    throw new Error("COMPILER_RUNTIME_ENTRYPOINT_INJECTION_POINT_MISSING");
  }
  let rendered = entrypoint.replace(supportMarker, `${runtimeExecutionSupport()}\n${supportMarker}`);
  rendered = rendered.replace(setupMarker, [
    "            let runtimeModel;",
    "            try { runtimeModel = JSON.parse(createPostgresReadFile(new URL(\"./runtime-model.json\", import.meta.url), \"utf8\")); } catch { fail(\"RUNTIME_MODEL_INVALID\", \"runtime-model.json\"); }",
    "            const entityConnectionString = process.env.DATABASE_URL;",
    "            const runtimeJobTimers = runtimeModel && entityConnectionString ? runtimeStartJobs(runtimeModel, entityConnectionString) : [];",
    setupMarker,
  ].join("\n"));
  rendered = rendered.replace(routeMarker, [
    "              if (runtimeModel && (!entityConnectionString || typeof entityConnectionString !== \"string\")) { runtimeWriteJson(response, 503, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_SECRET_UNRESOLVED\", detail: \"DATABASE_URL\" }); return; }",
    "              if (runtimeModel && await runtimeHandleEntityRequest(request, response, runtimeModel, entityConnectionString)) return;",
    "              if (runtimeModel && await runtimeHandleActionRequest(request, response, runtimeModel, entityConnectionString)) return;",
    "              if (runtimeModel && await runtimeHandleEventRequest(request, response, runtimeModel, entityConnectionString)) return;",
    routeMarker,
  ].join("\n"));
  rendered = rendered.replace(shutdownMarker, [
    "              for (const timer of runtimeJobTimers) clearInterval(timer);",
    shutdownMarker,
  ].join("\n"));
  return rendered;
}

export function compileRuntimeModelRelease(input: CompileRuntimeModelInput): SyntheticCompilation {
  const materialized = materializeRuntimeModel(input.assemblyPlan.systemDefinitionRef, input.systemDefinitionRuntime);
  const stateRequirements = [
    ...(input.stateRequirements ?? []),
    ...(materialized.stateRequirement === undefined ? [] : [materialized.stateRequirement]),
  ];
  const base = compileSyntheticRelease({ ...input, stateRequirements });
  const modelContent = canonicalJson(materialized.model);
  const runtimeModelFile: GeneratedFile = Object.freeze({ path: "runtime-model.json", content: modelContent, contentHash: sha256Text(modelContent) });
  const transformedBaseFiles = base.files.map((file) => file.path === "runtime-entry.mjs"
    ? Object.freeze({ ...file, content: injectRuntimeExecution(file.content), contentHash: sha256Text(injectRuntimeExecution(file.content)) })
    : file);
  const files = Object.freeze([...transformedBaseFiles, runtimeModelFile].sort((left, right) => left.path.localeCompare(right.path)));
  const manifest = Object.freeze({ ...base.artifact.manifest, files: Object.freeze(files.map((file) => file.path)) });
  const artifactPayload = {
    kind: "ReleaseArtifact" as const,
    assemblyPlanRef: base.artifact.assemblyPlanRef,
    validationEvidenceRef: base.artifact.validationEvidenceRef,
    manifest,
    environmentSchema: base.artifact.environmentSchema,
    fileHashes: files.map((file) => ({ path: file.path, contentHash: file.contentHash })),
  };
  const artifact: ReleaseArtifact = Object.freeze({
    kind: "ReleaseArtifact",
    assemblyPlanRef: artifactPayload.assemblyPlanRef,
    validationEvidenceRef: artifactPayload.validationEvidenceRef,
    artifactHash: sha256Canonical(artifactPayload),
    manifest,
    environmentSchema: base.artifact.environmentSchema,
  });
  return Object.freeze({ files, artifact });
}

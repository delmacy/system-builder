export type RuntimeEntityRoute = Readonly<{ entityId: string; recordId: string }>;

export function parseRuntimeEntityRoute(url: string): RuntimeEntityRoute | undefined {
  const pathname = url.split("?", 1)[0] ?? "";
  const match = pathname.match(/^\/entities\/([^/]+)\/([^/]+)$/);
  if (!match?.[1] || !match[2]) return undefined;
  try {
    const entityId = decodeURIComponent(match[1]);
    const recordId = decodeURIComponent(match[2]);
    if (entityId.length === 0 || recordId.length === 0) return undefined;
    return Object.freeze({ entityId, recordId });
  } catch {
    return undefined;
  }
}

export function renderRuntimeEntityApiSupport(): string {
  return [
    "function runtimeReadJsonBody(request) { return new Promise((resolve, reject) => { let body = \"\"; request.setEncoding(\"utf8\"); request.on(\"data\", (chunk) => { body += chunk; if (body.length > 1048576) reject(new Error(\"RUNTIME_REQUEST_BODY_TOO_LARGE\")); }); request.on(\"end\", () => { try { resolve(body.length === 0 ? {} : JSON.parse(body)); } catch { reject(new Error(\"RUNTIME_INVALID_JSON_BODY\")); } }); request.on(\"error\", reject); }); }",
    "function runtimeWriteJson(response, status, value) { response.writeHead(status, { \"content-type\": \"application/json\" }); response.end(JSON.stringify(value)); }",
    "function runtimeEntityRoute(url) { const pathname = String(url || \"\").split(\"?\", 1)[0]; const match = pathname.match(/^\\/entities\\/([^/]+)\\/([^/]+)$/); if (!match) return undefined; try { return { entityId: decodeURIComponent(match[1]), recordId: decodeURIComponent(match[2]) }; } catch { return undefined; } }",
    "async function runtimeHandleEntityRequest(request, response, model, connectionString) {",
    "  const route = runtimeEntityRoute(request.url); if (!route) return false;",
    "  const entity = runtimeEntityById(model, route.entityId); if (!entity) { runtimeWriteJson(response, 404, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_ENTITY_UNKNOWN\", detail: route.entityId }); return true; }",
    "  try {",
    "    let result;",
    "    if (request.method === \"GET\") result = await runtimeEntityRead(connectionString, entity, route.recordId);",
    "    else if (request.method === \"POST\") result = await runtimeEntityCreate(connectionString, entity, route.recordId, await runtimeReadJsonBody(request));",
    "    else if (request.method === \"PATCH\" || request.method === \"PUT\") result = await runtimeEntityUpdate(connectionString, entity, route.recordId, await runtimeReadJsonBody(request));",
    "    else if (request.method === \"DELETE\") result = await runtimeEntityDelete(connectionString, entity, route.recordId);",
    "    else { runtimeWriteJson(response, 405, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_ENTITY_METHOD_NOT_ALLOWED\", detail: String(request.method || \"\") }); return true; }",
    "    if (!result.ok) { runtimeWriteJson(response, result.code === \"RUNTIME_ENTITY_NOT_FOUND\" ? 404 : 400, { kind: \"RuntimeDiagnostic\", code: result.code, detail: result.detail }); return true; }",
    "    runtimeWriteJson(response, request.method === \"POST\" ? 201 : 200, { kind: \"RuntimeEntity\", entityId: entity.id, record: result.value }); return true;",
    "  } catch (error) { runtimeWriteJson(response, 503, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_ENTITY_DATABASE_FAILED\", detail: error instanceof Error ? error.message : \"ENTITY_DATABASE_FAILED\" }); return true; }",
    "}",
  ].join("\n");
}

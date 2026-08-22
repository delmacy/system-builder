import { sha256Canonical, sha256Text } from "@system-builder/deterministic";
import type { RuntimeStateRequirement } from "@system-builder/runtime-core";
import { compileRuntimeModelRelease, type CompileRuntimeModelInput } from "./runtime-model.js";
import type { GeneratedFile, ReleaseArtifact, SyntheticCompilation } from "./index.js";

const WORKFLOW_MIGRATION = "CREATE TABLE IF NOT EXISTS \"sb_runtime_workflow_state\" (\"process_id\" text NOT NULL, \"instance_id\" text NOT NULL, \"state\" text NOT NULL, PRIMARY KEY (\"process_id\", \"instance_id\"));\n";

function workflowStateRequirement(): RuntimeStateRequirement {
  return Object.freeze({
    kind: "RuntimeStateRequirement",
    capability: "runtime.workflows",
    storeKind: "sql",
    connectionBinding: Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" }),
    migrations: Object.freeze([Object.freeze({
      id: "runtime-workflow-state-v1",
      capability: "runtime.workflows",
      order: 1,
      path: "migrations/runtime-workflows/001-workflow-state.sql",
      content: WORKFLOW_MIGRATION,
    })]),
  });
}

function workflowExecutionSupport(): string {
  return [
    "function runtimeWorkflowRoute(url) { const pathname = String(url || \"\").split(\"?\", 1)[0]; const match = pathname.match(/^\\/workflows\\/([^/]+)\\/([^/]+)\\/([^/]+)$/); if (!match) return undefined; try { return { processId: decodeURIComponent(match[1]), instanceId: decodeURIComponent(match[2]), transitionId: decodeURIComponent(match[3]) }; } catch { return undefined; } }",
    "async function runtimeWorkflowAction(connectionString, model, actionRef, instanceId, request) { if (!actionRef) return { ok: true }; const action = model.actions.find((candidate) => candidate.id === actionRef); if (!action || !action.effect) return { ok: false, code: \"RUNTIME_WORKFLOW_ACTION_INVALID\", detail: String(actionRef) }; const entity = runtimeEntityById(model, action.effect.entityRef); if (!entity) return { ok: false, code: \"RUNTIME_WORKFLOW_ACTION_TARGET_INVALID\", detail: action.effect.entityRef }; let result; if (action.effect.kind === \"entity.create\") result = await runtimeEntityCreate(connectionString, entity, instanceId, await runtimeReadJsonBody(request)); else if (action.effect.kind === \"entity.update\") result = await runtimeEntityUpdate(connectionString, entity, instanceId, await runtimeReadJsonBody(request)); else if (action.effect.kind === \"entity.delete\") result = await runtimeEntityDelete(connectionString, entity, instanceId); else return { ok: false, code: \"RUNTIME_WORKFLOW_ACTION_INVALID\", detail: action.effect.kind }; return result.ok ? { ok: true } : result; }",
    "async function runtimeHandleWorkflowRequest(request, response, model, connectionString) { const route = runtimeWorkflowRoute(request.url); if (!route) return false; if (request.method !== \"POST\") { runtimeWriteJson(response, 405, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_WORKFLOW_METHOD_NOT_ALLOWED\", detail: String(request.method || \"\") }); return true; } const processModel = model.processes.find((candidate) => candidate.id === route.processId); if (!processModel) { runtimeWriteJson(response, 404, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_WORKFLOW_UNKNOWN_PROCESS\", detail: route.processId }); return true; } if (!processModel.initialState) { runtimeWriteJson(response, 400, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_WORKFLOW_INITIAL_STATE_MISSING\", detail: route.processId }); return true; } const transition = (processModel.transitions || []).find((candidate) => candidate.id === route.transitionId); if (!transition) { runtimeWriteJson(response, 404, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_WORKFLOW_UNKNOWN_TRANSITION\", detail: route.processId + \":\" + route.transitionId }); return true; } try { const stateRows = await postgresSimpleQuery(connectionString, \"SELECT \\\"state\\\" FROM \\\"sb_runtime_workflow_state\\\" WHERE \\\"process_id\\\" = \" + runtimeSqlLiteral(route.processId) + \" AND \\\"instance_id\\\" = \" + runtimeSqlLiteral(route.instanceId) + \";\"); const currentState = stateRows.length === 0 ? processModel.initialState : stateRows[0][0]; if (currentState !== transition.from) { runtimeWriteJson(response, 409, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_WORKFLOW_INVALID_TRANSITION\", detail: route.processId + \":\" + String(currentState) + \":\" + route.transitionId }); return true; } const actionResult = await runtimeWorkflowAction(connectionString, model, transition.actionRef, route.instanceId, request); if (!actionResult.ok) { runtimeWriteJson(response, 400, { kind: \"RuntimeDiagnostic\", code: actionResult.code, detail: actionResult.detail }); return true; } const rows = await postgresSimpleQuery(connectionString, \"INSERT INTO \\\"sb_runtime_workflow_state\\\" (\\\"process_id\\\", \\\"instance_id\\\", \\\"state\\\") VALUES (\" + runtimeSqlLiteral(route.processId) + \", \" + runtimeSqlLiteral(route.instanceId) + \", \" + runtimeSqlLiteral(transition.to) + \") ON CONFLICT (\\\"process_id\\\", \\\"instance_id\\\") DO UPDATE SET \\\"state\\\" = EXCLUDED.\\\"state\\\" RETURNING \\\"state\\\";\"); runtimeWriteJson(response, 200, { kind: \"RuntimeWorkflow\", processId: route.processId, instanceId: route.instanceId, transitionId: transition.id, from: currentState, to: rows[0]?.[0] || transition.to }); return true; } catch (error) { runtimeWriteJson(response, 503, { kind: \"RuntimeDiagnostic\", code: \"RUNTIME_WORKFLOW_DATABASE_FAILED\", detail: error instanceof Error ? error.message : \"WORKFLOW_DATABASE_FAILED\" }); return true; } }",
  ].join("\n");
}

function injectWorkflowExecution(entrypoint: string): string {
  const supportMarker = "const SPEC = ";
  const routeMarker = "              response.writeHead(404, { \"content-type\": \"application/json\" });";
  if (!entrypoint.includes(supportMarker) || !entrypoint.includes(routeMarker)) throw new Error("COMPILER_WORKFLOW_ENTRYPOINT_INJECTION_POINT_MISSING");
  let rendered = entrypoint.replace(supportMarker, `${workflowExecutionSupport()}\n${supportMarker}`);
  rendered = rendered.replace(routeMarker, [
    "              if (runtimeModel && await runtimeHandleWorkflowRequest(request, response, runtimeModel, entityConnectionString)) return;",
    routeMarker,
  ].join("\n"));
  return rendered;
}

function rehashCompilation(base: SyntheticCompilation, files: readonly GeneratedFile[]): SyntheticCompilation {
  const sorted = Object.freeze([...files].sort((left, right) => left.path.localeCompare(right.path)));
  const manifest = Object.freeze({ ...base.artifact.manifest, files: Object.freeze(sorted.map((file) => file.path)) });
  const artifactPayload = {
    kind: "ReleaseArtifact" as const,
    assemblyPlanRef: base.artifact.assemblyPlanRef,
    validationEvidenceRef: base.artifact.validationEvidenceRef,
    manifest,
    environmentSchema: base.artifact.environmentSchema,
    fileHashes: sorted.map((file) => ({ path: file.path, contentHash: file.contentHash })),
  };
  const artifact: ReleaseArtifact = Object.freeze({
    kind: "ReleaseArtifact",
    assemblyPlanRef: artifactPayload.assemblyPlanRef,
    validationEvidenceRef: artifactPayload.validationEvidenceRef,
    artifactHash: sha256Canonical(artifactPayload),
    manifest,
    environmentSchema: base.artifact.environmentSchema,
  });
  return Object.freeze({ files: sorted, artifact });
}

export function compileWorkflowRuntimeRelease(input: CompileRuntimeModelInput): SyntheticCompilation {
  const hasWorkflows = input.systemDefinitionRuntime.processes.some((process) => (process.transitions?.length ?? 0) > 0);
  const base = compileRuntimeModelRelease({
    ...input,
    stateRequirements: Object.freeze([
      ...(input.stateRequirements ?? []),
      ...(hasWorkflows ? [workflowStateRequirement()] : []),
    ]),
  });
  if (!hasWorkflows) return base;
  const files = base.files.map((file) => {
    if (file.path !== "runtime-entry.mjs") return file;
    const content = injectWorkflowExecution(file.content);
    return Object.freeze({ ...file, content, contentHash: sha256Text(content) });
  });
  return rehashCompilation(base, files);
}

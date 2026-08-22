import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { compileWorkflowRuntimeRelease } from "../../packages/compiler/workflow-runtime.js";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { runLocalProcessDeployment } from "../../packages/deploy/local-process.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { validateTraceability } from "../../packages/validation/index.js";
import { factoryAnalysis, factoryCatalogRecords, factoryRecipe } from "./fixtures/factory-e2e.js";

const databaseUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const runtimeVersion = "0.13.2";
const systemDefinitionRef = "system-definition:p13-runtime-services-e2e:1";

const definition = {
  definition: "SystemDefinition" as const,
  analysisRef: "analysis:e2e:1",
  recipeRef: "recipe:e2e:1",
  entities: [{ id: "entity:ticket", name: "Ticket", requirementRefs: ["REQ-1"], fields: [{ name: "title", type: "string" as const, required: true }] }],
  processes: [{ id: "process:ticket", name: "Ticket lifecycle", requirementRefs: ["REQ-2"], states: ["open", "closed"], initialState: "open", transitions: [{ id: "transition:close", from: "open", to: "closed", actionRef: "action:update" }] }],
  actions: [
    { id: "action:update", name: "Update ticket", requirementRefs: ["REQ-1"], effect: { kind: "entity.update" as const, entityRef: "entity:ticket" } },
    { id: "action:job-delete", name: "Delete job ticket", requirementRefs: ["REQ-1"], effect: { kind: "entity.delete" as const, entityRef: "entity:ticket" } },
  ],
  jobs: [{ id: "job:delete-ticket", name: "Delete job ticket", requirementRefs: ["REQ-1"], trigger: { kind: "interval" as const, intervalMs: 1_000 }, actionRef: "action:job-delete", recordId: "ticket-job" }],
  events: [{ id: "event:update", name: "Update ticket event", requirementRefs: ["REQ-1"], source: { kind: "runtime-http" as const }, actionRef: "action:update" }],
  files: [{ id: "files:attachments", name: "Attachments", requirementRefs: ["REQ-1"], bindingRef: "storage:files", operations: ["put", "get", "delete"] as const }],
  capabilities: [
    { id: "cap-auth", capability: "auth.basic", requirementRefs: ["REQ-1"] },
    { id: "cap-workflow", capability: "workflow.engine", requirementRefs: ["REQ-2"] },
  ],
  views: [], permissions: [], policies: [],
  integrations: [{ id: "integration:notify", contract: "http-json", direction: "outbound" as const, requirementRefs: ["REQ-1"], invocation: { kind: "http" as const, method: "POST" as const, path: "/notify", bindingRef: "service:notify" } }],
  environmentRequirements: [
    { name: "DATABASE_URL", kind: "secret-reference" as const, required: true },
    { name: "storage:files", kind: "storage" as const, required: true },
    { name: "service:notify", kind: "external-service" as const, required: true },
  ],
};

function runtimeProjection() {
  return {
    kind: "SystemDefinitionRuntimeProjection" as const,
    systemDefinitionRef,
    entities: definition.entities.map((entity) => ({ id: entity.id, fields: entity.fields.map((field) => ({ name: field.name, type: field.type, required: field.required })) })),
    actions: definition.actions.map((action) => ({ id: action.id, effect: action.effect })),
    processes: definition.processes.map((processModel) => ({ id: processModel.id, states: processModel.states, initialState: processModel.initialState, transitions: processModel.transitions })),
    environmentRequirements: definition.environmentRequirements.map((requirement) => ({ name: requirement.name, kind: requirement.kind, required: requirement.required })),
    jobs: definition.jobs.map((job) => ({ id: job.id, trigger: job.trigger, actionRef: job.actionRef, recordId: job.recordId })),
    events: definition.events.map((event) => ({ id: event.id, source: event.source, actionRef: event.actionRef })),
    files: definition.files.map((file) => ({ id: file.id, bindingRef: file.bindingRef, operations: file.operations })),
    integrations: definition.integrations.map((integration) => ({ id: integration.id, invocation: integration.invocation })),
  };
}

async function waitForStarted(child: ReturnType<typeof spawn>): Promise<number> {
  if (!child.stdout) throw new Error("P13_RUNTIME_STDOUT_UNAVAILABLE");
  child.stdout.setEncoding("utf8");
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => reject(new Error("P13_RUNTIME_START_TIMEOUT")), 10_000);
    const onData = (chunk: string) => {
      buffer += chunk;
      const newline = buffer.indexOf("\n");
      if (newline < 0) return;
      clearTimeout(timer);
      child.stdout?.off("data", onData);
      try {
        const started = JSON.parse(buffer.slice(0, newline)) as { kind?: string; port?: number };
        if (started.kind !== "RuntimeStarted" || !Number.isInteger(started.port) || Number(started.port) <= 0) throw new Error("P13_RUNTIME_START_INVALID");
        resolve(Number(started.port));
      } catch (error) { reject(error); }
    };
    child.stdout.on("data", onData);
    child.once("error", reject);
    child.once("exit", (code) => { if (code !== null && code !== 0) reject(new Error(`P13_RUNTIME_EXITED:${code}`)); });
  });
}

async function request(port: number, path: string, method: string, body?: unknown, raw = false) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    ...(body === undefined ? {} : { headers: { "content-type": raw ? "text/plain" : "application/json" }, body: raw ? String(body) : JSON.stringify(body) }),
    signal: AbortSignal.timeout(10_000),
  });
  return { status: response.status, body: await response.json() as Record<string, unknown> };
}

async function stop(child: ReturnType<typeof spawn>) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => { if (child.exitCode === null) child.kill("SIGKILL"); resolve(); }, 3_000);
    child.once("exit", () => { clearTimeout(timer); resolve(); });
  });
}

async function listen(server: Server): Promise<number> {
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("P13_INTEGRATION_SERVER_ADDRESS_INVALID");
  return address.port;
}

async function waitForStatus(port: number, path: string, expected: number): Promise<void> {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    if ((await request(port, path, "GET")).status === expected) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`P13_RUNTIME_STATUS_TIMEOUT:${expected}:${path}`);
}

test("P13 Construction B grows the real autonomous Runtime chain through jobs, events, files and integrations", { skip: databaseUrl === undefined }, async () => {
  if (!databaseUrl) throw new Error("SYSTEM_BUILDER_TEST_POSTGRES_URL_REQUIRED");

  const upstreamCalls: Array<Readonly<{ method: string; path: string; body: unknown }>> = [];
  const upstream = createServer(async (incoming, outgoing) => {
    let raw = "";
    for await (const chunk of incoming) raw += String(chunk);
    upstreamCalls.push(Object.freeze({ method: String(incoming.method || ""), path: String(incoming.url || ""), body: raw.length === 0 ? null : JSON.parse(raw) }));
    outgoing.writeHead(202, { "content-type": "application/json" });
    outgoing.end(JSON.stringify({ accepted: true }));
  });
  const upstreamPort = await listen(upstream);
  const serviceUrl = `http://127.0.0.1:${upstreamPort}`;
  const storageRoot = await mkdtemp(join(tmpdir(), "p13-runtime-services-storage-"));
  const runtimeDirectory = await mkdtemp(join(tmpdir(), "p13-runtime-services-e2e-"));
  let child: ReturnType<typeof spawn> | undefined;

  try {
    const catalog = new SoftwareCatalogRegistry();
    for (const record of factoryCatalogRecords) catalog.register(record);
    const assembly = assembleSystemDefinition(definition, systemDefinitionRef, (query) => resolveCatalogCandidates(catalog, query));
    assert.equal(assembly.ok, true);
    if (!assembly.ok) return;

    const validation = validateTraceability({ recipe: factoryRecipe, analysis: factoryAnalysis, definition, assemblyPlan: assembly.plan, assemblyPlanRef: assembly.plan.contentHash, declaredChecks: [{ id: "p13-runtime-services-e2e", status: "PASS", evidenceRefs: ["test:p13-runtime-services-e2e"] }] });
    assert.equal(validation.decision, "PASS");
    const compilation = compileWorkflowRuntimeRelease({ assemblyPlan: assembly.plan, validationEvidence: validation, compilerVersion: "0.13.2", runtimeVersion, environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }], systemDefinitionRuntime: runtimeProjection() });
    const artifacts = new InMemoryArtifactPayloadRepository();
    const payload = artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
    const publishedRelease = new ReleaseRegistry().publish({ releaseId: "p13-runtime-services-e2e", version: "1.0.0", artifact: compilation.artifact, publishedAt: "2026-08-22T22:00:00Z" });
    const databaseBinding = { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p13-runtime-database" };
    const storageBinding = { name: "storage:files", kind: "config" as const, reference: "env://P13_STORAGE_ROOT", requirementKind: "storage" as const };
    const serviceBinding = { name: "service:notify", kind: "config" as const, reference: "env://P13_SERVICE_URL", requirementKind: "external-service" as const };
    const environment: EnvironmentProfile = { kind: "EnvironmentProfile", environmentRef: "environment:p13-runtime-services-e2e", runtimeVersions: [runtimeVersion], bindings: [databaseBinding, storageBinding, serviceBinding] };
    const runtimeEnvironment = { P13_STORAGE_ROOT: storageRoot, P13_SERVICE_URL: serviceUrl, SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1", SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1" };
    const deployment = await runLocalProcessDeployment({ publishedRelease, releaseArtifact: compilation.artifact, artifactPayloadReader: artifacts, environment, secretResolver: new InMemorySecretResolver({ "secret://p13-runtime-database": databaseUrl }), processEnvironment: runtimeEnvironment, timeoutMs: 10_000 });
    assert.equal(deployment.ok, true);
    if (!deployment.ok) return;
    assert.equal(deployment.health.status, "UP");

    const durableEvidence = JSON.stringify({ definition, artifact: compilation.artifact, payload, publishedRelease, deployment: { health: deployment.health, migrationApplication: deployment.migrationApplication } });
    for (const resolved of [databaseUrl, storageRoot, serviceUrl]) assert.equal(durableEvidence.includes(resolved), false);

    for (const file of artifacts.getVerified(compilation.artifact).files) {
      const target = join(runtimeDirectory, file.path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, file.content, "utf8");
    }

    const startRuntime = async (runtimeProfile: EnvironmentProfile) => {
      const runtime = spawn(process.execPath, [join(runtimeDirectory, "runtime-entry.mjs")], { cwd: runtimeDirectory, env: { ...process.env, DATABASE_URL: databaseUrl, ...runtimeEnvironment, SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(runtimeProfile), SYSTEM_BUILDER_RUNTIME_PORT: "0" }, stdio: ["ignore", "pipe", "pipe"] });
      return { runtime, port: await waitForStarted(runtime) };
    };

    const started = await startRuntime(environment);
    child = started.runtime;
    const port = started.port;
    assert.equal((await request(port, "/entities/entity%3Aticket/ticket-main", "POST", { title: "Initial" })).status, 201);
    assert.equal((await request(port, "/actions/action%3Aupdate/ticket-main", "POST", { title: "Actioned" })).status, 200);
    const transition = await request(port, "/workflows/process%3Aticket/ticket-main/transition%3Aclose", "POST", { title: "Closed" });
    assert.deepEqual([transition.status, transition.body.from, transition.body.to], [200, "open", "closed"]);

    assert.equal((await request(port, "/entities/entity%3Aticket/ticket-event", "POST", { title: "Before event" })).status, 201);
    assert.equal((await request(port, "/events/event%3Aupdate", "POST", { recordId: "ticket-event", payload: { title: "Evented" } })).status, 200);
    const eventRecord = await request(port, "/entities/entity%3Aticket/ticket-event", "GET");
    assert.equal(((eventRecord.body.record as Record<string, unknown>).data as Record<string, unknown>).title, "Evented");
    assert.equal((await request(port, "/events/event%3Amissing", "POST", { recordId: "ticket-event" })).status, 404);

    assert.equal((await request(port, "/entities/entity%3Aticket/ticket-job", "POST", { title: "Delete me" })).status, 201);
    await waitForStatus(port, "/entities/entity%3Aticket/ticket-job", 404);

    const filePath = "/files/files%3Aattachments/folder%2Fnote.txt";
    assert.equal((await request(port, filePath, "PUT", "construction-b-file", true)).status, 200);
    assert.equal((await request(port, filePath, "GET")).body.content, "construction-b-file");
    const traversal = await request(port, "/files/files%3Aattachments/..%2Fescape.txt", "PUT", "blocked", true);
    assert.deepEqual([traversal.status, traversal.body.code], [400, "RUNTIME_FILE_PATH_INVALID"]);
    assert.equal((await request(port, filePath, "DELETE")).status, 200);
    assert.equal((await request(port, filePath, "GET")).status, 404);
    assert.equal((await request(port, "/files/files%3Amissing/note.txt", "GET")).status, 404);

    const integration = await request(port, "/integrations/integration%3Anotify", "POST", { ticketId: "ticket-main" });
    assert.deepEqual([integration.status, integration.body.status], [200, 202]);
    assert.deepEqual(upstreamCalls, [{ method: "POST", path: "/notify", body: { ticketId: "ticket-main" } }]);
    assert.equal((await request(port, "/integrations/integration%3Amissing", "POST", {})).status, 404);

    await stop(child);
    child = undefined;
    const missingEnvironment: EnvironmentProfile = { ...environment, bindings: [databaseBinding, serviceBinding] };
    const missing = await startRuntime(missingEnvironment);
    child = missing.runtime;
    const missingBinding = await request(missing.port, "/files/files%3Aattachments/note.txt", "GET");
    assert.equal(missingBinding.status, 503);
    assert.equal(JSON.stringify(missingBinding.body).includes(storageRoot), false);
    await stop(child);
    child = undefined;

    const incompatibleEnvironment: EnvironmentProfile = { ...environment, bindings: [databaseBinding, { ...storageBinding, requirementKind: "external-service" }, serviceBinding] };
    const incompatible = await startRuntime(incompatibleEnvironment);
    child = incompatible.runtime;
    const incompatibleBinding = await request(incompatible.port, "/files/files%3Aattachments/note.txt", "GET");
    assert.equal(incompatibleBinding.status, 503);
    for (const resolved of [databaseUrl, storageRoot, serviceUrl]) assert.equal(JSON.stringify(incompatibleBinding.body).includes(resolved), false);
  } finally {
    if (child) await stop(child);
    if (upstream.listening) await new Promise<void>((resolve, reject) => upstream.close((error) => error ? reject(error) : resolve()));
    await rm(runtimeDirectory, { recursive: true, force: true });
    await rm(storageRoot, { recursive: true, force: true });
  }
});

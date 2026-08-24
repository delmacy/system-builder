import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { compileAutonomousRuntimeModelBundle } from "../../packages/compiler/autonomous-runtime-model-bundle.js";
import { compileWorkflowRuntimeRelease } from "../../packages/compiler/workflow-runtime.js";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { preflightVerifiedMigrations } from "../../packages/deploy/migration-preflight.js";
import { applyVerifiedPostgresMigrations } from "../../packages/deploy/postgres-migrations.js";
import { sha256Canonical } from "../../packages/deterministic/index.js";

const databaseUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const runtimeVersion = "0.13.3";
const entityRef = "entity:offline-functional-ticket";
const updateActionRef = "action:offline-functional-update";
const jobDeleteActionRef = "action:offline-functional-job-delete";
const processRef = "process:offline-functional-ticket";
const transitionRef = "transition:offline-functional-close";
const eventRef = "event:offline-functional-update";
const fileRef = "files:offline-functional-attachments";
const integrationRef = "integration:offline-functional-notify";

function assemblyPlan() {
  const payload = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:p13:offline-functional-runtime",
    components: [],
    sourceRefs: ["source:p13:offline-functional-runtime"],
  };
  return { ...payload, contentHash: sha256Canonical(payload) };
}

function compileInput() {
  const plan = assemblyPlan();
  return {
    assemblyPlan: plan,
    validationEvidence: {
      kind: "ValidationEvidence" as const,
      assemblyPlanRef: plan.contentHash,
      decision: "PASS" as const,
      evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }),
    },
    compilerVersion: runtimeVersion,
    runtimeVersion,
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection" as const,
      systemDefinitionRef: plan.systemDefinitionRef,
      entities: [{ id: entityRef, fields: [{ name: "title", type: "string" as const, required: true }] }],
      actions: [
        { id: updateActionRef, effect: { kind: "entity.update" as const, entityRef } },
        { id: jobDeleteActionRef, effect: { kind: "entity.delete" as const, entityRef } },
      ],
      processes: [{
        id: processRef,
        states: ["open", "closed"],
        initialState: "open",
        transitions: [{ id: transitionRef, from: "open", to: "closed", actionRef: updateActionRef }],
      }],
      environmentRequirements: [
        { name: "storage:files", kind: "storage" as const, required: true },
        { name: "service:notify", kind: "external-service" as const, required: true },
      ],
      jobs: [{
        id: "job:offline-functional-delete-ticket",
        trigger: { kind: "interval" as const, intervalMs: 1_000 },
        actionRef: jobDeleteActionRef,
        recordId: "offline-functional-ticket-job",
      }],
      events: [{ id: eventRef, source: { kind: "runtime-http" as const }, actionRef: updateActionRef }],
      files: [{ id: fileRef, bindingRef: "storage:files", operations: ["put", "get", "delete"] as const }],
      integrations: [{
        id: integrationRef,
        invocation: { kind: "http" as const, method: "POST" as const, path: "/notify", bindingRef: "service:notify" },
      }],
    },
  };
}

function compileBundle() {
  return compileAutonomousRuntimeModelBundle(compileInput());
}

function compileWorkflowProof() {
  return compileWorkflowRuntimeRelease(compileInput());
}

async function materialize(
  compilation: ReturnType<typeof compileBundle> | ReturnType<typeof compileWorkflowProof>,
  prefix: string,
) {
  const directory = await mkdtemp(join(tmpdir(), prefix));
  for (const file of compilation.files) {
    const target = join(directory, file.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, file.content, "utf8");
  }
  return directory;
}

async function listen(server: Server): Promise<number> {
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("TASK_257_UPSTREAM_ADDRESS_INVALID");
  return address.port;
}

async function waitForStarted(child: ReturnType<typeof spawn>): Promise<number> {
  const stdout = child.stdout;
  if (!stdout) throw new Error("TASK_257_RUNTIME_STDOUT_UNAVAILABLE");
  stdout.setEncoding("utf8");
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => reject(new Error("TASK_257_RUNTIME_START_TIMEOUT")), 10_000);
    const onData = (chunk: string) => {
      buffer += chunk;
      const newline = buffer.indexOf("\n");
      if (newline < 0) return;
      clearTimeout(timer);
      stdout.off("data", onData);
      try {
        const started = JSON.parse(buffer.slice(0, newline)) as { kind?: string; port?: number };
        if (started.kind !== "RuntimeStarted" || !Number.isInteger(started.port) || Number(started.port) <= 0) {
          throw new Error("TASK_257_RUNTIME_START_INVALID");
        }
        resolve(Number(started.port));
      } catch (error) {
        reject(error);
      }
    };
    stdout.on("data", onData);
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code !== null && code !== 0) reject(new Error(`TASK_257_RUNTIME_EXITED:${code}`));
    });
  });
}

async function request(port: number, path: string, method: string, body?: unknown, raw = false) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    ...(body === undefined ? {} : {
      headers: { "content-type": raw ? "text/plain" : "application/json" },
      body: raw ? String(body) : JSON.stringify(body),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  return { status: response.status, body: await response.json() as Record<string, unknown> };
}

async function stop(child: ReturnType<typeof spawn>) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      if (child.exitCode === null) child.kill("SIGKILL");
      resolve();
    }, 3_000);
    child.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

async function waitForStatus(port: number, path: string, expected: number): Promise<void> {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    if ((await request(port, path, "GET")).status === expected) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`TASK_257_RUNTIME_STATUS_TIMEOUT:${expected}:${path}`);
}

async function applyMigrations(
  compilation: ReturnType<typeof compileBundle> | ReturnType<typeof compileWorkflowProof>,
  connectionString: string,
) {
  const preflight = preflightVerifiedMigrations(compilation.files);
  const application = await applyVerifiedPostgresMigrations({
    preflight,
    generatedFiles: compilation.files,
    runtimeSecrets: Object.freeze({ DATABASE_URL: connectionString }),
  });
  assert.equal(application.kind, "LocalMigrationApplication");
  assert.equal(application.migrations.length, preflight.migrations.length);
}

function runtimeEnvironment(serviceUrl: string, storageRoot: string): EnvironmentProfile {
  return {
    kind: "EnvironmentProfile",
    environmentRef: "environment:p13:offline-functional-runtime",
    runtimeVersions: [runtimeVersion],
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference", reference: "secret://runtime-database" },
      { name: "storage:files", kind: "config", reference: "env://P13_TASK_257_STORAGE_ROOT", requirementKind: "storage" },
      { name: "service:notify", kind: "config", reference: "env://P13_TASK_257_SERVICE_URL", requirementKind: "external-service" },
    ],
  };
}

function startRuntime(directory: string, environment: EnvironmentProfile, serviceUrl: string, storageRoot: string) {
  return spawn(process.execPath, [join(directory, "runtime-entry.mjs")], {
    cwd: directory,
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      P13_TASK_257_STORAGE_ROOT: storageRoot,
      P13_TASK_257_SERVICE_URL: serviceUrl,
      SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(environment),
      SYSTEM_BUILDER_RUNTIME_PORT: "0",
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

test(
  "TASK-257 composes locally loaded autonomous Runtime behavior with existing offline workflow execution",
  { skip: databaseUrl === undefined },
  async () => {
    if (!databaseUrl) throw new Error("SYSTEM_BUILDER_TEST_POSTGRES_URL_REQUIRED");

    const upstreamCalls: Array<Readonly<{ method: string; path: string; body: unknown }>> = [];
    const upstream = createServer(async (incoming, outgoing) => {
      let raw = "";
      for await (const chunk of incoming) raw += String(chunk);
      upstreamCalls.push(Object.freeze({
        method: String(incoming.method || ""),
        path: String(incoming.url || ""),
        body: raw.length === 0 ? null : JSON.parse(raw),
      }));
      outgoing.writeHead(202, { "content-type": "application/json" });
      outgoing.end(JSON.stringify({ accepted: true }));
    });
    const upstreamPort = await listen(upstream);
    const serviceUrl = `http://127.0.0.1:${upstreamPort}`;
    const storageRoot = await mkdtemp(join(tmpdir(), "system-builder-task-257-storage-"));
    const bundle = compileBundle();
    const workflowProof = compileWorkflowProof();
    const bundleDirectory = await materialize(bundle, "system-builder-task-257-runtime-");
    const workflowDirectory = await materialize(workflowProof, "system-builder-task-257-workflow-");
    const environment = runtimeEnvironment(serviceUrl, storageRoot);
    let child: ReturnType<typeof spawn> | undefined;

    try {
      await applyMigrations(bundle, databaseUrl);
      await applyMigrations(workflowProof, databaseUrl);

      child = startRuntime(bundleDirectory, environment, serviceUrl, storageRoot);
      const port = await waitForStarted(child);
      assert.equal((await request(port, `/entities/${encodeURIComponent(entityRef)}/offline-functional-ticket-main`, "POST", { title: "Initial" })).status, 201);
      assert.equal((await request(port, `/actions/${encodeURIComponent(updateActionRef)}/offline-functional-ticket-main`, "POST", { title: "Actioned" })).status, 200);

      assert.equal((await request(port, `/entities/${encodeURIComponent(entityRef)}/offline-functional-ticket-event`, "POST", { title: "Before event" })).status, 201);
      assert.equal((await request(port, `/events/${encodeURIComponent(eventRef)}`, "POST", { recordId: "offline-functional-ticket-event", payload: { title: "Evented" } })).status, 200);
      const eventRecord = await request(port, `/entities/${encodeURIComponent(entityRef)}/offline-functional-ticket-event`, "GET");
      assert.equal(((eventRecord.body.record as Record<string, unknown>).data as Record<string, unknown>).title, "Evented");

      assert.equal((await request(port, `/entities/${encodeURIComponent(entityRef)}/offline-functional-ticket-job`, "POST", { title: "Delete me" })).status, 201);
      await waitForStatus(port, `/entities/${encodeURIComponent(entityRef)}/offline-functional-ticket-job`, 404);

      const filePath = `/files/${encodeURIComponent(fileRef)}/folder%2Fnote.txt`;
      assert.equal((await request(port, filePath, "PUT", "offline-file", true)).status, 200);
      assert.equal((await request(port, filePath, "GET")).body.content, "offline-file");
      assert.equal((await request(port, filePath, "DELETE")).status, 200);

      const integration = await request(port, `/integrations/${encodeURIComponent(integrationRef)}`, "POST", { ticketId: "offline-functional-ticket-main" });
      assert.deepEqual([integration.status, integration.body.status], [200, 202]);
      assert.deepEqual(upstreamCalls, [{ method: "POST", path: "/notify", body: { ticketId: "offline-functional-ticket-main" } }]);
      await stop(child);
      child = undefined;

      child = startRuntime(workflowDirectory, environment, serviceUrl, storageRoot);
      const workflowPort = await waitForStarted(child);
      assert.equal((await request(workflowPort, `/entities/${encodeURIComponent(entityRef)}/offline-functional-ticket-workflow`, "POST", { title: "Workflow initial" })).status, 201);
      const transition = await request(
        workflowPort,
        `/workflows/${encodeURIComponent(processRef)}/offline-functional-ticket-workflow/${encodeURIComponent(transitionRef)}`,
        "POST",
        { title: "Workflow closed" },
      );
      assert.deepEqual([transition.status, transition.body.from, transition.body.to], [200, "open", "closed"]);

      const evidence = JSON.stringify({
        autonomousArtifact: bundle.artifact,
        workflowArtifact: workflowProof.artifact,
        metadata: JSON.parse(bundle.files.find((file) => file.path === "runtime-bundle.json")?.content ?? "{}"),
        model: JSON.parse(bundle.files.find((file) => file.path === "runtime-model.json")?.content ?? "{}"),
      });
      for (const resolved of [databaseUrl, storageRoot, serviceUrl]) assert.equal(evidence.includes(resolved), false);
      assert.equal(evidence.includes("builder.internal"), false);
      assert.equal(evidence.includes("observe.internal"), false);
    } finally {
      if (child) await stop(child);
      await new Promise<void>((resolve) => upstream.close(() => resolve()));
      await rm(bundleDirectory, { recursive: true, force: true });
      await rm(workflowDirectory, { recursive: true, force: true });
      await rm(storageRoot, { recursive: true, force: true });
    }
  },
);

test("TASK-257 missing external binding fails locally at use without Builder fallback or secret leakage", async () => {
  const bundle = compileBundle();
  const directory = await materialize(bundle, "system-builder-task-257-missing-binding-runtime-");
  const storageRoot = await mkdtemp(join(tmpdir(), "system-builder-task-257-missing-binding-"));
  let child: ReturnType<typeof spawn> | undefined;
  const sentinel = "resolved-secret-must-not-leak";
  try {
    const environment: EnvironmentProfile = {
      kind: "EnvironmentProfile",
      environmentRef: "environment:p13:offline-functional-runtime-missing-binding",
      runtimeVersions: [runtimeVersion],
      bindings: [
        { name: "DATABASE_URL", kind: "secret-reference", reference: "secret://runtime-database" },
        { name: "storage:files", kind: "config", reference: "env://P13_TASK_257_STORAGE_ROOT", requirementKind: "storage" },
      ],
    };
    child = spawn(process.execPath, [join(directory, "runtime-entry.mjs")], {
      cwd: directory,
      env: {
        ...process.env,
        DATABASE_URL: sentinel,
        P13_TASK_257_STORAGE_ROOT: storageRoot,
        SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(environment),
        SYSTEM_BUILDER_RUNTIME_PORT: "0",
        SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
        SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const port = await waitForStarted(child);
    const failed = await request(port, `/integrations/${encodeURIComponent(integrationRef)}`, "POST", { ticketId: "offline" });
    assert.equal(failed.status, 503);
    assert.equal(failed.body.kind, "RuntimeDiagnostic");
    assert.equal(failed.body.code, "RUNTIME_INTEGRATION_BINDING_INVALID");
    assert.equal(failed.body.detail, "service:notify");
    const evidence = JSON.stringify(failed.body);
    assert.equal(evidence.includes(sentinel), false);
    assert.equal(evidence.includes("builder"), false);
    assert.equal(evidence.includes("observe"), false);
  } finally {
    if (child) await stop(child);
    await rm(directory, { recursive: true, force: true });
    await rm(storageRoot, { recursive: true, force: true });
  }
});

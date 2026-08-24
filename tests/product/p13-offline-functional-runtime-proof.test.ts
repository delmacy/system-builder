import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { compileAutonomousRuntimeModelBundle } from "../../packages/compiler/autonomous-runtime-model-bundle.js";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { preflightVerifiedMigrations } from "../../packages/deploy/migration-preflight.js";
import { applyVerifiedPostgresMigrations } from "../../packages/deploy/postgres-migrations.js";
import { sha256Canonical } from "../../packages/deterministic/index.js";

const databaseUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const runtimeVersion = "0.13.3";

function assemblyPlan() {
  const payload = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:p13:offline-functional-runtime",
    components: [],
    sourceRefs: ["source:p13:offline-functional-runtime"],
  };
  return { ...payload, contentHash: sha256Canonical(payload) };
}

function compileBundle() {
  const plan = assemblyPlan();
  return compileAutonomousRuntimeModelBundle({
    assemblyPlan: plan,
    validationEvidence: {
      kind: "ValidationEvidence",
      assemblyPlanRef: plan.contentHash,
      decision: "PASS",
      evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }),
    },
    compilerVersion: runtimeVersion,
    runtimeVersion,
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: plan.systemDefinitionRef,
      entities: [{ id: "entity:ticket", fields: [{ name: "title", type: "string", required: true }] }],
      actions: [
        { id: "action:update", effect: { kind: "entity.update", entityRef: "entity:ticket" } },
        { id: "action:job-delete", effect: { kind: "entity.delete", entityRef: "entity:ticket" } },
      ],
      processes: [{
        id: "process:ticket",
        states: ["open", "closed"],
        initialState: "open",
        transitions: [{ id: "transition:close", from: "open", to: "closed", actionRef: "action:update" }],
      }],
      environmentRequirements: [
        { name: "storage:files", kind: "storage", required: true },
        { name: "service:notify", kind: "external-service", required: true },
      ],
      jobs: [{
        id: "job:delete-ticket",
        trigger: { kind: "interval", intervalMs: 1_000 },
        actionRef: "action:job-delete",
        recordId: "ticket-job",
      }],
      events: [{ id: "event:update", source: { kind: "runtime-http" }, actionRef: "action:update" }],
      files: [{ id: "files:attachments", bindingRef: "storage:files", operations: ["put", "get", "delete"] }],
      integrations: [{
        id: "integration:notify",
        invocation: { kind: "http", method: "POST", path: "/notify", bindingRef: "service:notify" },
      }],
    },
  });
}

async function materializeBundle() {
  const directory = await mkdtemp(join(tmpdir(), "system-builder-task-257-runtime-"));
  const bundle = compileBundle();
  for (const file of bundle.files) {
    const target = join(directory, file.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, file.content, "utf8");
  }
  return { directory, bundle };
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

async function applyBundleMigrations(bundle: ReturnType<typeof compileBundle>, connectionString: string) {
  const preflight = preflightVerifiedMigrations(bundle.files);
  const application = await applyVerifiedPostgresMigrations({
    preflight,
    generatedFiles: bundle.files,
    runtimeSecrets: Object.freeze({ DATABASE_URL: connectionString }),
  });
  assert.equal(application.kind, "LocalMigrationApplication");
  assert.equal(application.migrations.length, preflight.migrations.length);
}

test(
  "TASK-257 locally loaded autonomous bundle executes representative Runtime behavior with Builder and Observe unavailable",
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
    const { directory, bundle } = await materializeBundle();
    let child: ReturnType<typeof spawn> | undefined;

    const environment: EnvironmentProfile = {
      kind: "EnvironmentProfile",
      environmentRef: "environment:p13:offline-functional-runtime",
      runtimeVersions: [runtimeVersion],
      bindings: [
        { name: "DATABASE_URL", kind: "secret-reference", reference: "secret://runtime-database" },
        { name: "storage:files", kind: "config", reference: "env://P13_TASK_257_STORAGE_ROOT", requirementKind: "storage" },
        { name: "service:notify", kind: "config", reference: "env://P13_TASK_257_SERVICE_URL", requirementKind: "external-service" },
      ],
    };

    try {
      await applyBundleMigrations(bundle, databaseUrl);
      child = spawn(process.execPath, [join(directory, "runtime-entry.mjs")], {
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
      const port = await waitForStarted(child);

      assert.equal((await request(port, "/entities/entity%3Aticket/ticket-main", "POST", { title: "Initial" })).status, 201);
      assert.equal((await request(port, "/actions/action%3Aupdate/ticket-main", "POST", { title: "Actioned" })).status, 200);
      const transition = await request(port, "/workflows/process%3Aticket/ticket-main/transition%3Aclose", "POST", { title: "Closed" });
      assert.deepEqual([transition.status, transition.body.from, transition.body.to], [200, "open", "closed"]);

      assert.equal((await request(port, "/entities/entity%3Aticket/ticket-event", "POST", { title: "Before event" })).status, 201);
      assert.equal((await request(port, "/events/event%3Aupdate", "POST", { recordId: "ticket-event", payload: { title: "Evented" } })).status, 200);
      const eventRecord = await request(port, "/entities/entity%3Aticket/ticket-event", "GET");
      assert.equal(((eventRecord.body.record as Record<string, unknown>).data as Record<string, unknown>).title, "Evented");

      assert.equal((await request(port, "/entities/entity%3Aticket/ticket-job", "POST", { title: "Delete me" })).status, 201);
      await waitForStatus(port, "/entities/entity%3Aticket/ticket-job", 404);

      const filePath = "/files/files%3Aattachments/folder%2Fnote.txt";
      assert.equal((await request(port, filePath, "PUT", "offline-file", true)).status, 200);
      assert.equal((await request(port, filePath, "GET")).body.content, "offline-file");
      assert.equal((await request(port, filePath, "DELETE")).status, 200);

      const integration = await request(port, "/integrations/integration%3Anotify", "POST", { ticketId: "ticket-main" });
      assert.deepEqual([integration.status, integration.body.status], [200, 202]);
      assert.deepEqual(upstreamCalls, [{ method: "POST", path: "/notify", body: { ticketId: "ticket-main" } }]);

      const evidence = JSON.stringify({
        artifact: bundle.artifact,
        metadata: JSON.parse(bundle.files.find((file) => file.path === "runtime-bundle.json")?.content ?? "{}"),
        model: JSON.parse(bundle.files.find((file) => file.path === "runtime-model.json")?.content ?? "{}"),
      });
      for (const resolved of [databaseUrl, storageRoot, serviceUrl]) assert.equal(evidence.includes(resolved), false);
      assert.equal(evidence.includes("builder.internal"), false);
      assert.equal(evidence.includes("observe.internal"), false);
    } finally {
      if (child) await stop(child);
      await new Promise<void>((resolve) => upstream.close(() => resolve()));
      await rm(directory, { recursive: true, force: true });
      await rm(storageRoot, { recursive: true, force: true });
    }
  },
);

test("TASK-257 missing external binding fails locally at use without Builder fallback or secret leakage", async () => {
  const { directory } = await materializeBundle();
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
    const failed = await request(port, "/integrations/integration%3Anotify", "POST", { ticketId: "offline" });
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

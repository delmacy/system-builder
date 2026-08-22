import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { compileWorkflowRuntimeRelease } from "../../packages/compiler/workflow-runtime.js";
import { runLocalProcessDeployment } from "../../packages/deploy/local-process.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { validateTraceability } from "../../packages/validation/index.js";
import { factoryAnalysis, factoryCatalogRecords, factoryRecipe } from "./fixtures/factory-e2e.js";

const databaseUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;
const runtimeVersion = "0.13.1";
const systemDefinitionRef = "system-definition:p13-runtime-core-e2e:1";

const definition = {
  definition: "SystemDefinition" as const,
  analysisRef: "analysis:e2e:1",
  recipeRef: "recipe:e2e:1",
  entities: [{ id: "entity:ticket", name: "Ticket", requirementRefs: ["REQ-1"], fields: [{ name: "title", type: "string" as const, required: true }] }],
  processes: [{
    id: "process:ticket",
    name: "Ticket lifecycle",
    requirementRefs: ["REQ-2"],
    states: ["open", "closed"],
    initialState: "open",
    transitions: [{ id: "transition:close", from: "open", to: "closed", actionRef: "action:close" }],
  }],
  actions: [
    { id: "action:close", name: "Close ticket", requirementRefs: ["REQ-1"], effect: { kind: "entity.update" as const, entityRef: "entity:ticket" } },
    { id: "action:unsupported", name: "Unsupported", requirementRefs: ["REQ-1"] },
  ],
  capabilities: [
    { id: "cap-auth", capability: "auth.basic", requirementRefs: ["REQ-1"] },
    { id: "cap-workflow", capability: "workflow.engine", requirementRefs: ["REQ-2"] },
  ],
  views: [], permissions: [], policies: [], integrations: [],
  environmentRequirements: [{ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }],
};

function runtimeProjection() {
  return {
    kind: "SystemDefinitionRuntimeProjection" as const,
    systemDefinitionRef,
    entities: definition.entities.map((entity) => ({ id: entity.id, fields: entity.fields.map((field) => ({ name: field.name, type: field.type, required: field.required })) })),
    actions: definition.actions.map((action) => ({ id: action.id, ...("effect" in action ? { effect: action.effect } : {}) })),
    processes: definition.processes.map((processModel) => ({ id: processModel.id, states: processModel.states, initialState: processModel.initialState, transitions: processModel.transitions })),
  };
}

async function waitForStarted(child: ReturnType<typeof spawn>): Promise<number> {
  const stdout = child.stdout;
  if (!stdout) throw new Error("P13_RUNTIME_STDOUT_UNAVAILABLE");
  stdout.setEncoding("utf8");
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => reject(new Error("P13_RUNTIME_START_TIMEOUT")), 10_000);
    const onData = (chunk: string) => {
      buffer += chunk;
      const newline = buffer.indexOf("\n");
      if (newline < 0) return;
      clearTimeout(timer);
      stdout.off("data", onData);
      try {
        const started = JSON.parse(buffer.slice(0, newline)) as { kind?: string; port?: number };
        if (started.kind !== "RuntimeStarted" || typeof started.port !== "number" || !Number.isInteger(started.port) || started.port <= 0) throw new Error("P13_RUNTIME_START_INVALID");
        resolve(started.port);
      } catch (error) { reject(error); }
    };
    stdout.on("data", onData);
    child.once("error", reject);
    child.once("exit", (code) => { if (code !== null && code !== 0) reject(new Error(`P13_RUNTIME_EXITED:${code}`)); });
  });
}

async function request(port: number, path: string, method: string, body?: unknown) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    ...(body === undefined ? {} : { headers: { "content-type": "application/json" }, body: JSON.stringify(body) }),
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

test(
  "P13 Construction A grows the real factory chain through durable autonomous entity/action/workflow execution",
  { skip: databaseUrl === undefined },
  async () => {
    if (!databaseUrl) throw new Error("SYSTEM_BUILDER_TEST_POSTGRES_URL_REQUIRED");

    const catalog = new SoftwareCatalogRegistry();
    for (const record of factoryCatalogRecords) catalog.register(record);
    const assembly = assembleSystemDefinition(definition, systemDefinitionRef, (query) => resolveCatalogCandidates(catalog, query));
    assert.equal(assembly.ok, true);
    if (!assembly.ok) return;

    const validation = validateTraceability({
      recipe: factoryRecipe,
      analysis: factoryAnalysis,
      definition,
      assemblyPlan: assembly.plan,
      assemblyPlanRef: assembly.plan.contentHash,
      declaredChecks: [{ id: "p13-runtime-core-e2e", status: "PASS", evidenceRefs: ["test:p13-runtime-core-e2e"] }],
    });
    assert.equal(validation.decision, "PASS");

    const compilation = compileWorkflowRuntimeRelease({
      assemblyPlan: assembly.plan,
      validationEvidence: validation,
      compilerVersion: "0.13.1",
      runtimeVersion,
      environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
      systemDefinitionRuntime: runtimeProjection(),
    });
    const artifacts = new InMemoryArtifactPayloadRepository();
    const payload = artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
    const publishedRelease = new ReleaseRegistry().publish({ releaseId: "p13-runtime-core-e2e", version: "1.0.0", artifact: compilation.artifact, publishedAt: "2026-08-22T18:00:00Z" });
    const environment = {
      kind: "EnvironmentProfile" as const,
      environmentRef: "environment:p13-runtime-core-e2e",
      runtimeVersions: [runtimeVersion],
      bindings: [{ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p13-runtime-database" }],
    };
    const resolver = new InMemorySecretResolver({ "secret://p13-runtime-database": databaseUrl });
    const deployment = await runLocalProcessDeployment({
      publishedRelease,
      releaseArtifact: compilation.artifact,
      artifactPayloadReader: artifacts,
      environment,
      secretResolver: resolver,
      processEnvironment: { SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1", SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1" },
      timeoutMs: 10_000,
    });
    assert.equal(deployment.ok, true);
    if (!deployment.ok) return;
    assert.equal(deployment.health.status, "UP");

    const durableEvidence = JSON.stringify({ compilation: compilation.artifact, payload, publishedRelease, deployment: { health: deployment.health, migrationApplication: deployment.migrationApplication } });
    assert.equal(durableEvidence.includes(databaseUrl), false);

    const directory = await mkdtemp(join(tmpdir(), "p13-runtime-core-e2e-"));
    let child: ReturnType<typeof spawn> | undefined;
    try {
      const verified = artifacts.getVerified(compilation.artifact);
      for (const file of verified.files) {
        const target = join(directory, file.path);
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, file.content, "utf8");
      }
      const startRuntime = async () => {
        const runtime = spawn(process.execPath, [join(directory, "runtime-entry.mjs")], {
          cwd: directory,
          env: {
            ...process.env,
            DATABASE_URL: databaseUrl,
            SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(environment),
            SYSTEM_BUILDER_RUNTIME_PORT: "0",
            SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
            SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
          },
          stdio: ["ignore", "pipe", "pipe"],
        });
        return { runtime, port: await waitForStarted(runtime) };
      };

      const first = await startRuntime();
      child = first.runtime;
      const port = first.port;

      const created = await request(port, "/entities/entity%3Aticket/ticket-1", "POST", { title: "Initial" });
      assert.equal(created.status, 201);
      assert.equal((created.body.record as Record<string, unknown>).id, "ticket-1");
      assert.equal((await request(port, "/entities/entity%3Amissing/ticket-1", "GET")).status, 404);

      const action = await request(port, "/actions/action%3Aclose/ticket-1", "POST", { title: "Actioned" });
      assert.equal(action.status, 200);
      assert.equal((await request(port, "/actions/action%3Amissing/ticket-1", "POST", {})).status, 404);
      assert.equal((await request(port, "/actions/action%3Aunsupported/ticket-1", "POST", {})).status, 400);

      const transition = await request(port, "/workflows/process%3Aticket/ticket-1/transition%3Aclose", "POST", { title: "Closed" });
      assert.equal(transition.status, 200);
      assert.equal(transition.body.from, "open");
      assert.equal(transition.body.to, "closed");
      const invalid = await request(port, "/workflows/process%3Aticket/ticket-1/transition%3Aclose", "POST", { title: "Must not apply" });
      assert.equal(invalid.status, 409);
      assert.equal(invalid.body.code, "RUNTIME_WORKFLOW_INVALID_TRANSITION");
      const record = await request(port, "/entities/entity%3Aticket/ticket-1", "GET");
      assert.equal(((record.body.record as Record<string, unknown>).data as Record<string, unknown>).title, "Closed");

      await stop(child);
      child = undefined;
      const restarted = await startRuntime();
      child = restarted.runtime;
      const persistedInvalid = await request(restarted.port, "/workflows/process%3Aticket/ticket-1/transition%3Aclose", "POST", { title: "Restart must not reset" });
      assert.equal(persistedInvalid.status, 409);
      assert.equal(JSON.stringify(persistedInvalid.body).includes(databaseUrl), false);
    } finally {
      if (child) await stop(child);
      await rm(directory, { recursive: true, force: true });
    }
  },
);

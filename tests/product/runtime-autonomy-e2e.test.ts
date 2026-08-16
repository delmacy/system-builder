import assert from "node:assert/strict";
import { spawn, type ChildProcessByStdio } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Readable } from "node:stream";
import test from "node:test";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { compileSyntheticRelease, type SyntheticCompilation } from "../../packages/compiler/index.js";
import { validateTraceability } from "../../packages/validation/index.js";
import {
  factoryAnalysis,
  factoryCatalogRecords,
  factoryEnvironmentSchema,
  factoryRecipe,
  factorySystemDefinition,
} from "./fixtures/factory-e2e.js";

const environmentProfile = Object.freeze({
  kind: "EnvironmentProfile" as const,
  environmentRef: "environment:runtime-autonomy",
  runtimeVersions: Object.freeze(["0.1.0"]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://database-url" }),
    Object.freeze({ name: "LOG_LEVEL", kind: "config" as const, reference: "config://log-level" }),
  ]),
});

type RuntimeChild = ChildProcessByStdio<null, Readable, Readable>;

type StartedRuntime = Readonly<{
  child: RuntimeChild;
  directory: string;
  entrypoint: SyntheticCompilation["files"][number];
  started: Readonly<{
    kind: "RuntimeStarted";
    status: "UP";
    port: number;
    runtimeVersion: string;
    environmentRef: string;
  }>;
  stderr: () => string;
}>;

function compileActualRuntime(): SyntheticCompilation {
  const catalog = new SoftwareCatalogRegistry();
  for (const record of factoryCatalogRecords) catalog.register(record);

  const assembly = assembleSystemDefinition(
    factorySystemDefinition,
    "system-definition:runtime-autonomy:1",
    (request) => resolveCatalogCandidates(catalog, request),
  );
  assert.equal(assembly.ok, true);
  if (!assembly.ok) throw new Error("RUNTIME_AUTONOMY_ASSEMBLY_FAILED");

  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis: factoryAnalysis,
    definition: factorySystemDefinition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [
      { id: "runtime-autonomy", status: "PASS", evidenceRefs: ["test:runtime-autonomy"] },
    ],
  });
  assert.equal(validation.decision, "PASS");

  return compileSyntheticRelease({
    assemblyPlan: assembly.plan,
    validationEvidence: validation,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: factoryEnvironmentSchema,
  });
}

function firstJsonLine(stream: NodeJS.ReadableStream, timeoutMs = 3_000): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => reject(new Error("RUNTIME_AUTONOMY_START_TIMEOUT")), timeoutMs);
    stream.setEncoding("utf8");
    stream.on("data", (chunk: string) => {
      buffer += chunk;
      const newline = buffer.indexOf("\n");
      if (newline < 0) return;
      clearTimeout(timer);
      try {
        resolve(JSON.parse(buffer.slice(0, newline)) as unknown);
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function startGeneratedRuntime(
  compilation: SyntheticCompilation,
  environment: unknown,
  extraEnvironment: Readonly<Record<string, string>> = {},
): Promise<StartedRuntime> {
  const directory = mkdtempSync(join(tmpdir(), "sb-runtime-autonomy-"));
  for (const file of compilation.files) writeFileSync(join(directory, file.path), file.content, "utf8");
  const entrypoint = compilation.files.find((file) => file.path === "runtime-entry.mjs");
  assert.ok(entrypoint, "Compiler output must contain runtime-entry.mjs");

  let stderr = "";
  const child = spawn(process.execPath, [join(directory, entrypoint.path)], {
    cwd: directory,
    env: {
      ...process.env,
      SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(environment),
      SYSTEM_BUILDER_RUNTIME_PORT: "0",
      SYSTEM_BUILDER_URL: "http://127.0.0.1:1",
      OBSERVE_URL: "http://127.0.0.1:1",
      ...extraEnvironment,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk: string) => { stderr += chunk; });

  try {
    const started = await firstJsonLine(child.stdout) as StartedRuntime["started"];
    assert.equal(started.kind, "RuntimeStarted");
    assert.equal(started.status, "UP");
    assert.ok(Number.isInteger(started.port) && started.port > 0);
    return { child, directory, entrypoint, started, stderr: () => stderr };
  } catch (error) {
    child.kill("SIGKILL");
    rmSync(directory, { recursive: true, force: true });
    throw error;
  }
}

async function stopGeneratedRuntime(runtime: StartedRuntime): Promise<void> {
  if (runtime.child.exitCode === null) {
    runtime.child.kill("SIGTERM");
    const [exitCode] = await once(runtime.child, "close") as [number | null, NodeJS.Signals | null];
    assert.equal(exitCode, 0, runtime.stderr());
  }
  rmSync(runtime.directory, { recursive: true, force: true });
}

async function fetchHealth(runtime: StartedRuntime): Promise<unknown> {
  const response = await fetch(`http://127.0.0.1:${runtime.started.port}/health`);
  assert.equal(response.status, 200);
  return response.json();
}

test("actual Compiler output stays autonomous and reports stable HTTP health with Builder and Observe unavailable", async () => {
  const firstCompilation = compileActualRuntime();
  const secondCompilation = compileActualRuntime();
  assert.deepEqual(firstCompilation, secondCompilation);

  const first = await startGeneratedRuntime(firstCompilation, environmentProfile);
  const second = await startGeneratedRuntime(secondCompilation, environmentProfile);
  try {
    assert.equal(first.entrypoint.contentHash, second.entrypoint.contentHash);
    assert.equal(first.entrypoint.content, second.entrypoint.content);
    assert.equal(first.child.exitCode, null);
    assert.equal(second.child.exitCode, null);

    const firstHealth = await fetchHealth(first);
    const secondHealth = await fetchHealth(second);
    assert.deepEqual(firstHealth, secondHealth);
    assert.deepEqual(firstHealth, {
      kind: "RuntimeHealth",
      status: "UP",
      runtimeVersion: "0.1.0",
      environmentRef: "environment:runtime-autonomy",
      bindingNames: ["DATABASE_URL", "LOG_LEVEL"],
    });
  } finally {
    await stopGeneratedRuntime(first);
    await stopGeneratedRuntime(second);
  }
});

test("actual Compiler runtime fails explicitly when required external binding is missing before listening", async () => {
  const compilation = compileActualRuntime();
  const incompleteEnvironment = {
    ...environmentProfile,
    bindings: environmentProfile.bindings.filter((binding) => binding.name !== "DATABASE_URL"),
  };
  const directory = mkdtempSync(join(tmpdir(), "sb-runtime-autonomy-fail-"));
  for (const file of compilation.files) writeFileSync(join(directory, file.path), file.content, "utf8");
  const entrypoint = compilation.files.find((file) => file.path === "runtime-entry.mjs");
  assert.ok(entrypoint);
  const child = spawn(process.execPath, [join(directory, entrypoint.path)], {
    cwd: directory,
    env: {
      ...process.env,
      SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(incompleteEnvironment),
      SYSTEM_BUILDER_RUNTIME_PORT: "0",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stderr = "";
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk: string) => { stderr += chunk; });
  const [exitCode] = await once(child, "close") as [number | null, NodeJS.Signals | null];
  assert.equal(exitCode, 1);
  assert.deepEqual(JSON.parse(stderr.trim()), {
    kind: "RuntimeDiagnostic",
    code: "RUNTIME_MISSING_ENVIRONMENT_BINDING",
    detail: "DATABASE_URL",
  });
  rmSync(directory, { recursive: true, force: true });
});

test("external secret values never enter Compiler-generated, immutable or health content", async () => {
  const compilation = compileActualRuntime();
  const secretValue = "postgres://runtime-user:runtime-password@localhost/runtime";
  const immutableContent = JSON.stringify({ files: compilation.files, artifact: compilation.artifact });
  assert.equal(immutableContent.includes(secretValue), false);
  assert.equal(immutableContent.includes("secret://database-url"), false);

  const runtime = await startGeneratedRuntime(compilation, environmentProfile, { DATABASE_URL: secretValue });
  try {
    const health = JSON.stringify(await fetchHealth(runtime));
    assert.equal(health.includes(secretValue), false);
    assert.equal(health.includes("secret://database-url"), false);
  } finally {
    await stopGeneratedRuntime(runtime);
  }
});

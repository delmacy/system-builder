import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import {
  bootstrapAutonomousRuntime,
  renderAutonomousRuntimeEntrypoint,
  renderPersistentAutonomousRuntimeEntrypoint,
  type RuntimeEnvironmentRequirement,
  type RuntimeStarted,
} from "../../packages/runtime-core/index.js";

const requirements: readonly RuntimeEnvironmentRequirement[] = Object.freeze([
  Object.freeze({ name: "DATABASE_URL", kind: "secret-reference", required: true }),
  Object.freeze({ name: "LOG_LEVEL", kind: "config", required: false }),
]);

const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "environment:runtime-core-test",
  runtimeVersions: Object.freeze(["0.1.0"]),
  bindings: Object.freeze([
    Object.freeze({ name: "DATABASE_URL", kind: "secret-reference", reference: "secret://database-url" }),
    Object.freeze({ name: "LOG_LEVEL", kind: "config", reference: "config://log-level" }),
  ]),
});

function waitForJsonLine(stream: NodeJS.ReadableStream, timeoutMs = 3_000): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => reject(new Error("RUNTIME_TEST_STDOUT_TIMEOUT")), timeoutMs);
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

test("runtime bootstrap returns deterministic health for compatible external configuration", () => {
  const result = bootstrapAutonomousRuntime({ runtimeVersion: "0.1.0", environment, requirements });
  assert.deepEqual(result, {
    ok: true,
    health: {
      kind: "RuntimeHealth",
      status: "UP",
      runtimeVersion: "0.1.0",
      environmentRef: "environment:runtime-core-test",
      bindingNames: ["DATABASE_URL", "LOG_LEVEL"],
    },
  });
});

test("runtime bootstrap fails explicitly for missing binding, incompatible runtime and inline values", () => {
  assert.deepEqual(
    bootstrapAutonomousRuntime({
      runtimeVersion: "0.1.0",
      environment: { ...environment, bindings: environment.bindings.filter((binding) => binding.name !== "DATABASE_URL") },
      requirements,
    }),
    { ok: false, diagnostic: { code: "RUNTIME_MISSING_ENVIRONMENT_BINDING", detail: "DATABASE_URL" } },
  );

  assert.deepEqual(
    bootstrapAutonomousRuntime({ runtimeVersion: "9.9.9", environment, requirements }),
    { ok: false, diagnostic: { code: "RUNTIME_VERSION_INCOMPATIBLE", detail: "9.9.9" } },
  );

  const unsafe = {
    ...environment,
    bindings: environment.bindings.map((binding) =>
      binding.name === "DATABASE_URL" ? { ...binding, value: "postgres://must-not-enter-runtime-contract" } : binding,
    ),
  } as unknown as EnvironmentProfile;
  assert.deepEqual(
    bootstrapAutonomousRuntime({ runtimeVersion: "0.1.0", environment: unsafe, requirements }),
    { ok: false, diagnostic: { code: "RUNTIME_INLINE_VALUE_NOT_ALLOWED", detail: "DATABASE_URL" } },
  );
});

test("rendered autonomous entrypoint is deterministic, self-contained and starts without Builder or Observe", () => {
  const first = renderAutonomousRuntimeEntrypoint({ runtimeVersion: "0.1.0", requirements });
  const second = renderAutonomousRuntimeEntrypoint({ runtimeVersion: "0.1.0", requirements: [...requirements].reverse() });
  assert.equal(first, second);
  assert.equal(first.includes("fetch("), false);
  assert.equal(first.includes("SYSTEM_BUILDER_URL"), false);
  assert.equal(first.includes("OBSERVE_URL"), false);
  assert.equal(/^\s*import\s/m.test(first), false);

  const directory = mkdtempSync(join(tmpdir(), "sb-runtime-core-"));
  const entrypoint = join(directory, "runtime-entry.mjs");
  writeFileSync(entrypoint, first, "utf8");
  const processResult = spawnSync(process.execPath, [entrypoint], {
    encoding: "utf8",
    env: {
      ...process.env,
      SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(environment),
      SYSTEM_BUILDER_URL: "http://127.0.0.1:1",
      OBSERVE_URL: "http://127.0.0.1:1",
    },
  });

  assert.equal(processResult.status, 0, processResult.stderr);
  assert.deepEqual(JSON.parse(processResult.stdout.trim()), {
    kind: "RuntimeHealth",
    status: "UP",
    runtimeVersion: "0.1.0",
    environmentRef: "environment:runtime-core-test",
    bindingNames: ["DATABASE_URL", "LOG_LEVEL"],
  });
  rmSync(directory, { recursive: true, force: true });
});

test("persistent rendered runtime is backward compatible without explicit port request", () => {
  const source = renderPersistentAutonomousRuntimeEntrypoint({ runtimeVersion: "0.1.0", requirements });
  const directory = mkdtempSync(join(tmpdir(), "sb-runtime-persistent-compat-"));
  const entrypoint = join(directory, "runtime-entry.mjs");
  writeFileSync(entrypoint, source, "utf8");
  const processResult = spawnSync(process.execPath, [entrypoint], {
    encoding: "utf8",
    env: {
      ...process.env,
      SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(environment),
    },
  });
  assert.equal(processResult.status, 0, processResult.stderr);
  assert.deepEqual(JSON.parse(processResult.stdout.trim()), {
    kind: "RuntimeHealth",
    status: "UP",
    runtimeVersion: "0.1.0",
    environmentRef: "environment:runtime-core-test",
    bindingNames: ["DATABASE_URL", "LOG_LEVEL"],
  });
  rmSync(directory, { recursive: true, force: true });
});

test("persistent rendered runtime exposes HTTP health, remains alive and shuts down cleanly", async () => {
  const first = renderPersistentAutonomousRuntimeEntrypoint({ runtimeVersion: "0.1.0", requirements });
  const second = renderPersistentAutonomousRuntimeEntrypoint({
    runtimeVersion: "0.1.0",
    requirements: [...requirements].reverse(),
  });
  assert.equal(first, second);
  assert.equal(first.includes("SYSTEM_BUILDER_URL"), false);
  assert.equal(first.includes("OBSERVE_URL"), false);
  assert.equal(first.includes("postgres://"), false);

  const directory = mkdtempSync(join(tmpdir(), "sb-runtime-persistent-"));
  const entrypoint = join(directory, "runtime-entry.mjs");
  writeFileSync(entrypoint, first, "utf8");
  const child = spawn(process.execPath, [entrypoint], {
    cwd: directory,
    env: {
      ...process.env,
      SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(environment),
      SYSTEM_BUILDER_RUNTIME_PORT: "0",
      SYSTEM_BUILDER_URL: "http://127.0.0.1:1",
      OBSERVE_URL: "http://127.0.0.1:1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  try {
    const started = await waitForJsonLine(child.stdout) as RuntimeStarted;
    assert.equal(started.kind, "RuntimeStarted");
    assert.equal(started.status, "UP");
    assert.equal(started.runtimeVersion, "0.1.0");
    assert.equal(started.environmentRef, "environment:runtime-core-test");
    assert.ok(Number.isInteger(started.port) && started.port > 0);
    assert.equal(child.exitCode, null);

    const response = await fetch(`http://127.0.0.1:${started.port}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      kind: "RuntimeHealth",
      status: "UP",
      runtimeVersion: "0.1.0",
      environmentRef: "environment:runtime-core-test",
      bindingNames: ["DATABASE_URL", "LOG_LEVEL"],
    });

    child.kill("SIGTERM");
    const [exitCode] = await once(child, "close") as [number | null, NodeJS.Signals | null];
    assert.equal(exitCode, 0);
  } finally {
    if (child.exitCode === null) child.kill("SIGKILL");
    rmSync(directory, { recursive: true, force: true });
  }
});

test("persistent rendered runtime rejects missing required binding before listening", async () => {
  const source = renderPersistentAutonomousRuntimeEntrypoint({ runtimeVersion: "0.1.0", requirements });
  const directory = mkdtempSync(join(tmpdir(), "sb-runtime-persistent-fail-"));
  const entrypoint = join(directory, "runtime-entry.mjs");
  writeFileSync(entrypoint, source, "utf8");
  const child = spawn(process.execPath, [entrypoint], {
    cwd: directory,
    env: {
      ...process.env,
      SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify({
        ...environment,
        bindings: environment.bindings.filter((binding) => binding.name !== "DATABASE_URL"),
      }),
      SYSTEM_BUILDER_RUNTIME_PORT: "0",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stderr = "";
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk: string) => { stderr += chunk; });
  const [exitCode] = await once(child, "close") as [number | null, NodeJS.Signals | null];
  assert.equal(exitCode, 1);
  assert.match(stderr, /RUNTIME_MISSING_ENVIRONMENT_BINDING/);
  assert.equal(stderr.includes("RuntimeStarted"), false);
  rmSync(directory, { recursive: true, force: true });
});

import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import {
  bootstrapAutonomousRuntime,
  renderAutonomousRuntimeEntrypoint,
  type RuntimeEnvironmentRequirement,
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
});

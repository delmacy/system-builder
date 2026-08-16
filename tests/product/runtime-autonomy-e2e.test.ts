import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
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

function runGeneratedRuntime(
  compilation: SyntheticCompilation,
  environment: unknown,
  extraEnvironment: Readonly<Record<string, string>> = {},
) {
  const directory = mkdtempSync(join(tmpdir(), "sb-runtime-autonomy-"));
  for (const file of compilation.files) writeFileSync(join(directory, file.path), file.content, "utf8");
  const entrypoint = compilation.files.find((file) => file.path === "runtime-entry.mjs");
  assert.ok(entrypoint, "Compiler output must contain runtime-entry.mjs");

  return {
    entrypoint,
    result: spawnSync(process.execPath, [join(directory, entrypoint.path)], {
      encoding: "utf8",
      env: {
        ...process.env,
        SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(environment),
        SYSTEM_BUILDER_URL: "http://127.0.0.1:1",
        OBSERVE_URL: "http://127.0.0.1:1",
        ...extraEnvironment,
      },
    }),
  };
}

test("actual Compiler output starts autonomously and reports stable health with Builder and Observe unavailable", () => {
  const firstCompilation = compileActualRuntime();
  const secondCompilation = compileActualRuntime();
  assert.deepEqual(firstCompilation, secondCompilation);

  const first = runGeneratedRuntime(firstCompilation, environmentProfile);
  const second = runGeneratedRuntime(secondCompilation, environmentProfile);
  assert.equal(first.entrypoint.contentHash, second.entrypoint.contentHash);
  assert.equal(first.entrypoint.content, second.entrypoint.content);
  assert.equal(first.result.status, 0, first.result.stderr);
  assert.equal(second.result.status, 0, second.result.stderr);

  const firstHealth = JSON.parse(first.result.stdout.trim());
  const secondHealth = JSON.parse(second.result.stdout.trim());
  assert.deepEqual(firstHealth, secondHealth);
  assert.deepEqual(firstHealth, {
    kind: "RuntimeHealth",
    status: "UP",
    runtimeVersion: "0.1.0",
    environmentRef: "environment:runtime-autonomy",
    bindingNames: ["DATABASE_URL", "LOG_LEVEL"],
  });
});

test("actual Compiler runtime fails explicitly when required external binding is missing", () => {
  const compilation = compileActualRuntime();
  const incompleteEnvironment = {
    ...environmentProfile,
    bindings: environmentProfile.bindings.filter((binding) => binding.name !== "DATABASE_URL"),
  };
  const execution = runGeneratedRuntime(compilation, incompleteEnvironment);
  assert.notEqual(execution.result.status, 0);
  assert.deepEqual(JSON.parse(execution.result.stderr.trim()), {
    kind: "RuntimeDiagnostic",
    code: "RUNTIME_MISSING_ENVIRONMENT_BINDING",
    detail: "DATABASE_URL",
  });
});

test("external secret values never enter Compiler-generated or immutable release content", () => {
  const compilation = compileActualRuntime();
  const secretValue = "postgres://runtime-user:runtime-password@localhost/runtime";
  const immutableContent = JSON.stringify({ files: compilation.files, artifact: compilation.artifact });
  assert.equal(immutableContent.includes(secretValue), false);
  assert.equal(immutableContent.includes("secret://database-url"), false);

  const execution = runGeneratedRuntime(compilation, environmentProfile, { DATABASE_URL: secretValue });
  assert.equal(execution.result.status, 0, execution.result.stderr);
  assert.equal(execution.result.stdout.includes(secretValue), false);
  assert.equal(execution.result.stdout.includes("secret://database-url"), false);
});

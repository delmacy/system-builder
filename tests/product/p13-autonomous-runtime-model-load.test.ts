import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { compileAutonomousRuntimeModelBundle } from "../../packages/compiler/autonomous-runtime-model-bundle.js";

function compileBundle() {
  const planPayload = {
    kind: "AssemblyPlan" as const,
    systemDefinitionRef: "system-definition:p13:offline-autonomy-load",
    components: [],
    sourceRefs: ["source:p13:offline-autonomy-load"],
  };
  const plan = { ...planPayload, contentHash: sha256Canonical(planPayload) };
  return compileAutonomousRuntimeModelBundle({
    assemblyPlan: plan,
    validationEvidence: {
      kind: "ValidationEvidence",
      assemblyPlanRef: plan.contentHash,
      decision: "PASS",
      evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }),
    },
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: [
      { name: "DATABASE_URL", kind: "secret-reference", required: true },
      { name: "AUTH_BINDING", kind: "secret-reference", required: true },
    ],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: plan.systemDefinitionRef,
      entities: [
        {
          id: "entity:ticket",
          fields: [{ name: "title", type: "string", required: true }],
        },
      ],
      actions: [
        {
          id: "action:ticket:update",
          effect: { kind: "entity.update", entityRef: "entity:ticket" },
        },
      ],
      processes: [],
      environmentRequirements: [
        { name: "AUTH_BINDING", kind: "secret-reference", required: true },
      ],
      authenticationProviders: [
        { id: "auth:local", bindingRef: "AUTH_BINDING" },
      ],
      identities: [
        {
          id: "identity:user:1",
          kind: "user",
          subjectRef: "user:1",
          active: true,
          authenticationProviderRef: "auth:local",
        },
      ],
      sessionPolicy: { lifetimeSeconds: 3600 },
    },
    systemDefinitionAuthority: {
      kind: "RuntimeAuthorityProjection",
      roleBindings: [
        {
          id: "binding:operator",
          roleRef: "role:operator",
          actorRef: "identity:user:1",
        },
      ],
      permissions: [
        {
          role: "role:operator",
          resource: "entity:ticket",
          actions: ["action:ticket:update"],
        },
      ],
      policies: [],
      views: [],
    },
  });
}

const environmentProfile = JSON.stringify({
  kind: "EnvironmentProfile",
  environmentRef: "environment:test",
  runtimeVersions: ["0.1.0"],
  bindings: [
    {
      name: "AUTH_BINDING",
      kind: "secret-reference",
      reference: "secret:auth:test",
    },
    {
      name: "DATABASE_URL",
      kind: "secret-reference",
      reference: "secret:database:test",
    },
  ],
});

async function materializeBundle() {
  const directory = await mkdtemp(join(tmpdir(), "system-builder-task-255-"));
  const bundle = compileBundle();
  for (const file of bundle.files) {
    const target = join(directory, file.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, file.content, "utf8");
  }
  return { directory, bundle };
}

function runRuntime(directory: string) {
  return spawnSync(process.execPath, [join(directory, "runtime-entry.mjs")], {
    cwd: directory,
    encoding: "utf8",
    env: {
      ...process.env,
      SYSTEM_BUILDER_ENVIRONMENT_PROFILE: environmentProfile,
    },
  });
}

test("TASK-255 generated runtime loads the materialized RuntimeModel locally", async () => {
  const { directory, bundle } = await materializeBundle();
  try {
    const result = runRuntime(directory);
    assert.equal(result.status, 0, result.stderr);
    const health = JSON.parse(result.stdout.trim()) as Record<string, unknown>;
    assert.equal(health.kind, "RuntimeHealth");
    assert.equal(health.status, "UP");
    assert.equal(result.stderr, "");

    const entrypoint = bundle.files.find((file) => file.path === "runtime-entry.mjs");
    assert.ok(entrypoint);
    assert.match(entrypoint.content, /readFile\(new URL\(RUNTIME_MODEL_BUNDLE\.path, import\.meta\.url\)/);
    assert.equal(entrypoint.content.includes("builder.internal"), false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("TASK-255 missing materialized RuntimeModel fails explicitly and non-zero", async () => {
  const { directory } = await materializeBundle();
  try {
    await unlink(join(directory, "runtime-model.json"));
    const result = runRuntime(directory);
    assert.notEqual(result.status, 0);
    const diagnostic = JSON.parse(result.stderr.trim()) as Record<string, unknown>;
    assert.equal(diagnostic.kind, "RuntimeDiagnostic");
    assert.equal(diagnostic.code, "RUNTIME_MODEL_MISSING");
    assert.equal(diagnostic.detail, "runtime-model.json");
    assert.equal(result.stdout, "");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("TASK-255 corrupt materialized RuntimeModel fails before Runtime startup", async () => {
  const { directory } = await materializeBundle();
  try {
    await writeFile(join(directory, "runtime-model.json"), "{\"kind\":\"RuntimeModel\",\"corrupt\":true}", "utf8");
    const result = runRuntime(directory);
    assert.notEqual(result.status, 0);
    const diagnostic = JSON.parse(result.stderr.trim()) as Record<string, unknown>;
    assert.equal(diagnostic.kind, "RuntimeDiagnostic");
    assert.equal(diagnostic.code, "RUNTIME_MODEL_HASH_MISMATCH");
    assert.equal(diagnostic.detail, "runtime-model.json");
    assert.equal(result.stdout, "");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

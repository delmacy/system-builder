import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { sha256Canonical } from "../../packages/deterministic/index.js";
import { compileRuntimeModelRelease } from "../../packages/compiler/runtime-model.js";

const AUTH_VALUE = "p13-auth-runtime-only-value";

function compileTrustRuntime() {
  const payload = { kind: "AssemblyPlan" as const, systemDefinitionRef: "system-definition:p13:trust", components: [], sourceRefs: ["source:p13"] };
  const plan = { ...payload, contentHash: sha256Canonical(payload) };
  return compileRuntimeModelRelease({
    assemblyPlan: plan,
    validationEvidence: { kind: "ValidationEvidence", assemblyPlanRef: plan.contentHash, decision: "PASS", evidenceHash: sha256Canonical({ decision: "PASS", plan: plan.contentHash }) },
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: [{ name: "AUTH_PROVIDER", kind: "secret-reference", required: true }],
    systemDefinitionRuntime: {
      kind: "SystemDefinitionRuntimeProjection",
      systemDefinitionRef: "system-definition:p13:trust",
      entities: [], actions: [], processes: [],
      environmentRequirements: [{ name: "AUTH_PROVIDER", kind: "secret-reference", required: true }],
      authenticationProviders: [{ id: "provider:reference", bindingRef: "AUTH_PROVIDER" }],
      identities: [
        { id: "identity:active", kind: "user", subjectRef: "person:active", active: true, authenticationProviderRef: "provider:reference" },
        { id: "identity:disabled", kind: "service", subjectRef: "service:disabled", active: false, authenticationProviderRef: "provider:reference" },
      ],
      sessionPolicy: { lifetimeSeconds: 1 },
    },
  });
}

function environmentProfile() {
  return {
    kind: "EnvironmentProfile",
    environmentRef: "environment:p13:trust",
    runtimeVersions: ["0.1.0"],
    bindings: [{ name: "AUTH_PROVIDER", kind: "secret-reference", reference: "secret://AUTH_PROVIDER" }],
  };
}

test("identity/session trust surface carries controlled fail-closed diagnostics without runtime values", () => {
  const compiled = compileTrustRuntime();
  const entry = compiled.files.find((file) => file.path === "runtime-entry.mjs");
  assert.ok(entry);
  for (const code of [
    "RUNTIME_AUTH_REQUEST_INVALID",
    "RUNTIME_AUTH_INVALID_CREDENTIAL",
    "RUNTIME_AUTH_IDENTITY_UNMAPPED",
    "RUNTIME_AUTH_IDENTITY_DISABLED",
    "RUNTIME_SESSION_MISSING",
    "RUNTIME_SESSION_UNKNOWN",
    "RUNTIME_SESSION_EXPIRED",
    "RUNTIME_UNAUTHENTICATED",
    "RUNTIME_AUTH_BINDING_UNRESOLVED",
  ]) assert.equal(entry.content.includes(code), true, code);
  assert.equal(entry.content.includes("provider.bindingRef"), true);
  const durable = JSON.stringify(compiled);
  assert.equal(durable.includes(AUTH_VALUE), false);
  assert.equal(durable.includes("issued-runtime-session-value"), false);
  assert.equal(durable.includes("signing-integrity-value"), false);
});

test("missing authentication binding exits before RuntimeStarted without leaking runtime values", async () => {
  const compiled = compileTrustRuntime();
  const directory = await mkdtemp(join(tmpdir(), "p13-identity-trust-"));
  try {
    for (const file of compiled.files) {
      const target = join(directory, file.path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, file.content, "utf8");
    }
    const baseEnvironment = { ...process.env };
    delete baseEnvironment.AUTH_PROVIDER;
    const child = spawn(process.execPath, [join(directory, "runtime-entry.mjs")], {
      cwd: directory,
      env: {
        ...baseEnvironment,
        SYSTEM_BUILDER_ENVIRONMENT_PROFILE: JSON.stringify(environmentProfile()),
        SYSTEM_BUILDER_RUNTIME_PORT: "0",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => { stdout += chunk; });
    child.stderr.on("data", (chunk: string) => { stderr += chunk; });
    const exitCode = await new Promise<number | null>((resolve) => child.once("close", resolve));
    assert.equal(exitCode, 1);
    assert.equal(stdout.includes("RuntimeStarted"), false);
    assert.equal(stdout.includes(AUTH_VALUE), false);
    assert.equal(stderr.includes(AUTH_VALUE), false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

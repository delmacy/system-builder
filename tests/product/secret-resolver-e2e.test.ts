import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { startManagedLocalRuntime } from "../../packages/deploy/managed-process.js";
import { FileBackedSecretResolver, ProcessEnvironmentSecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:secret-resolver-e2e:1",
  components: [{ capability: "auth.basic", provider: "provider-auth", version: "1.0.0" }],
  sourceRefs: ["system-definition:secret-resolver-e2e:1"],
  contentHash: `sha256:${"a".repeat(64)}`,
};

const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"b".repeat(64)}`,
};

function fixture(environmentSchema: readonly { name: string; kind: "config" | "secret-reference"; required: boolean }[] = []) {
  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "0.2.0",
    runtimeVersion: "0.2.0",
    environmentSchema,
  });
  const artifacts = new InMemoryArtifactPayloadRepository();
  artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  const publishedRelease = new ReleaseRegistry().publish({
    releaseId: "secret-resolver-e2e",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-18T11:45:00Z",
  });
  const environment = {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:secret-resolver-e2e",
    runtimeVersions: ["0.2.0"],
    bindings: [] as Array<{ name: string; kind: "config" | "secret-reference"; reference: string }>,
  };
  return { compilation, artifacts, publishedRelease, environment };
}

function overriddenReader(
  artifacts: InMemoryArtifactPayloadRepository,
  artifact: ReturnType<typeof compileSyntheticRelease>["artifact"],
  runtimeEntry: string,
) {
  const verified = artifacts.getVerified(artifact);
  return {
    getVerified: () => ({
      ...verified,
      files: verified.files.map((file) => file.path === "runtime-entry.mjs" ? { ...file, content: runtimeEntry } : file),
    }),
  };
}

function runtimeEntryReporting(bindingNames: string[]) {
  return `
import http from "node:http";
const profile = JSON.parse(process.env.SYSTEM_BUILDER_ENVIRONMENT_PROFILE);
const server = http.createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ kind: "RuntimeHealth", status: "UP", runtimeVersion: "0.2.0", environmentRef: profile.environmentRef, bindingNames: ${JSON.stringify(bindingNames)} }));
    return;
  }
  response.writeHead(404); response.end();
});
server.listen(0, "127.0.0.1", () => {
  const address = server.address();
  console.log(JSON.stringify({ kind: "RuntimeStarted", status: "UP", port: address.port, runtimeVersion: "0.2.0", environmentRef: profile.environmentRef }));
});`;
}

test("TASK-130 production SecretResolver resolves symbolic refs into managed Runtime env without leaking durable evidence", async () => {
  const secretValue = "resolved-managed-runtime-secret-130";
  const otherSecret = "another-resolved-value-130";
  const { compilation, artifacts, publishedRelease, environment } = fixture([
    { name: "DB_PASSWORD", kind: "secret-reference", required: true },
    { name: "API_TOKEN", kind: "secret-reference", required: true },
    { name: "LOG_LEVEL", kind: "config", required: false },
  ]);
  environment.bindings.push(
    { name: "DB_PASSWORD", kind: "secret-reference", reference: "secret://DB_PASSWORD" },
    { name: "API_TOKEN", kind: "secret-reference", reference: "secret://API_TOKEN" },
    { name: "LOG_LEVEL", kind: "config", reference: "config://log-level" },
  );

  const provider = new FileBackedSecretResolver(
    "secret://store.env",
    `DB_PASSWORD=${secretValue}\nAPI_TOKEN=${otherSecret}`,
  );
  const entry = runtimeEntryReporting(["DB_PASSWORD", "API_TOKEN", "LOG_LEVEL"]);

  const result = await startManagedLocalRuntime({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: overriddenReader(artifacts, compilation.artifact, entry),
    environment,
    secretResolver: provider,
    processEnvironment: { SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1", SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1" },
    timeoutMs: 2_000,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;

  const snapshot = result.managed.snapshot();
  assert.equal(snapshot.state, "running");
  assert.equal(snapshot.runtimeVersion, "0.2.0");
  assert.equal(snapshot.environmentRef, "environment:secret-resolver-e2e");
  assert.equal(result.health.status, "UP");
  assert.equal((await result.managed.health()).status, "UP");

  const durableEvidence = JSON.stringify({
    publishedReleaseRef: `${publishedRelease.releaseId}@${publishedRelease.version}`,
    environmentRef: environment.environmentRef,
    releaseHash: publishedRelease.artifactHash,
    healthChecks: result.health,
    bindings: environment.bindings.map((binding) => ({ name: binding.name, kind: binding.kind, reference: binding.reference })),
  });

  assert.equal(durableEvidence.includes(secretValue), false);
  assert.equal(durableEvidence.includes(otherSecret), false);
  assert.equal(durableEvidence.includes("secret://DB_PASSWORD"), true);
  assert.equal(durableEvidence.includes("secret://API_TOKEN"), true);

  assert.equal(JSON.stringify(provider).includes(secretValue), false);
  assert.equal(JSON.stringify(provider).includes(otherSecret), false);

  const stopped = await result.managed.stop();
  assert.equal(stopped.state, "stopped");
  await assert.rejects(access(stopped.workingDirectory));
});

test("TASK-130 Runtime keeps operating with Builder and Observe unavailable", async () => {
  const secretValue = "autonomy-secret-value-130";
  const { compilation, artifacts, publishedRelease, environment } = fixture([
    { name: "AUTH_SECRET", kind: "secret-reference", required: true },
  ]);
  environment.bindings.push({ name: "AUTH_SECRET", kind: "secret-reference", reference: "secret://AUTH_SECRET" });

  const provider = new ProcessEnvironmentSecretResolver({ AUTH_SECRET: secretValue });
  const entry = runtimeEntryReporting(["AUTH_SECRET"]);
  const offlineControlPlane = { SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1", SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1" };

  const result = await startManagedLocalRuntime({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: overriddenReader(artifacts, compilation.artifact, entry),
    environment,
    secretResolver: provider,
    processEnvironment: offlineControlPlane,
    timeoutMs: 2_000,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.managed.snapshot().state, "running");
  assert.equal((await result.managed.health()).status, "UP");

  const stopped = await result.managed.stop();
  assert.equal(stopped.state, "stopped");
  await assert.rejects(access(stopped.workingDirectory));
  assert.equal(JSON.stringify(stopped).includes(secretValue), false);
});

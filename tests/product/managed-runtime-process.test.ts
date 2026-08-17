import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { startManagedLocalRuntime } from "../../packages/deploy/managed-process.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:managed-runtime:1",
  components: [{ capability: "auth.basic", provider: "provider-auth", version: "1.0.0" }],
  sourceRefs: ["system-definition:managed-runtime:1"],
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
    releaseId: "managed-runtime",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-17T20:00:00Z",
  });
  const environment = {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:managed-test",
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

test("TASK-119 managed Runtime remains alive and queryable until explicit stop", async () => {
  const { compilation, artifacts, publishedRelease, environment } = fixture();
  const artifactBefore = JSON.stringify(compilation.artifact);
  const releaseBefore = JSON.stringify(publishedRelease);

  const result = await startManagedLocalRuntime({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment,
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
    },
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  const running = result.managed.snapshot();
  assert.equal(running.state, "running");
  assert.equal(running.runtimeVersion, "0.2.0");
  assert.equal(running.environmentRef, "environment:managed-test");
  assert.equal(result.health.status, "UP");
  await access(running.workingDirectory);

  const response = await fetch(`http://127.0.0.1:${running.port}/health`);
  assert.equal(response.status, 200);
  const observed = await result.managed.health();
  assert.equal(observed.status, "UP");
  assert.equal(observed.environmentRef, environment.environmentRef);

  const stopped = await result.managed.stop();
  assert.equal(stopped.state, "stopped");
  await assert.rejects(access(running.workingDirectory));
  assert.equal(JSON.stringify(compilation.artifact), artifactBefore);
  assert.equal(JSON.stringify(publishedRelease), releaseBefore);
});

test("TASK-119 incompatible Runtime environment fails before managed lifecycle exists", async () => {
  const { compilation, artifacts, publishedRelease, environment } = fixture();
  const result = await startManagedLocalRuntime({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment: { ...environment, runtimeVersions: ["9.9.9"] },
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.diagnostic.code, "RUNTIME_INCOMPATIBLE");
  assert.equal("managed" in result, false);
});

test("TASK-120 repeated stop is idempotent and cleanup remains complete", async () => {
  const { compilation, artifacts, publishedRelease, environment } = fixture();
  const result = await startManagedLocalRuntime({ publishedRelease, releaseArtifact: compilation.artifact, artifactPayloadReader: artifacts, environment });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const directory = result.managed.snapshot().workingDirectory;
  const first = await result.managed.stop();
  const second = await result.managed.stop();
  assert.deepEqual(second, first);
  assert.equal(second.state, "stopped");
  await assert.rejects(access(directory));
});

test("TASK-120 startup failure cleans process material and redacts resolved secret", async () => {
  const secretValue = "managed-runtime-secret-value";
  const { compilation, artifacts, publishedRelease, environment } = fixture([
    { name: "MANAGED_SECRET", kind: "secret-reference", required: true },
  ]);
  environment.bindings.push({ name: "MANAGED_SECRET", kind: "secret-reference", reference: "secret://managed" });
  const invalidEntry = `console.log(process.env.MANAGED_SECRET); setInterval(() => {}, 1000);`;
  const result = await startManagedLocalRuntime({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: overriddenReader(artifacts, compilation.artifact, invalidEntry),
    environment,
    secretResolver: new InMemorySecretResolver({ "secret://managed": secretValue }),
    timeoutMs: 1_000,
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.diagnostic.code, "RUNTIME_STARTUP_INVALID");
  assert.equal(result.diagnostic.detail.includes(secretValue), false);
  assert.match(result.diagnostic.detail, /REDACTED/);
  assert.equal(JSON.stringify(result).includes(secretValue), false);
});

test("TASK-120 unexpected process exit is never reported as running", async () => {
  const { compilation, artifacts, publishedRelease, environment } = fixture();
  const entry = `
import http from "node:http";
const profile = JSON.parse(process.env.SYSTEM_BUILDER_ENVIRONMENT_PROFILE);
const server = http.createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ kind: "RuntimeHealth", status: "UP", runtimeVersion: "0.2.0", environmentRef: profile.environmentRef, bindingNames: [] }));
    return;
  }
  response.writeHead(404); response.end();
});
server.listen(0, "127.0.0.1", () => {
  const address = server.address();
  console.log(JSON.stringify({ kind: "RuntimeStarted", status: "UP", port: address.port, runtimeVersion: "0.2.0", environmentRef: profile.environmentRef }));
  setTimeout(() => process.exit(3), 100);
});`;
  const result = await startManagedLocalRuntime({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: overriddenReader(artifacts, compilation.artifact, entry),
    environment,
    timeoutMs: 1_000,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  await new Promise((resolve) => setTimeout(resolve, 250));
  assert.equal(result.managed.snapshot().state, "failed");
  const stopped = await result.managed.stop();
  assert.equal(stopped.state, "stopped");
  await assert.rejects(access(stopped.workingDirectory));
});

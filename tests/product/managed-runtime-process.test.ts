import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { startManagedLocalRuntime } from "../../packages/deploy/managed-process.js";
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

function fixture() {
  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "0.2.0",
    runtimeVersion: "0.2.0",
    environmentSchema: [],
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
    bindings: [],
  };
  return { compilation, artifacts, publishedRelease, environment };
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

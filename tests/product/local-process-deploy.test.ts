import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { runLocalProcessDeployment } from "../../packages/deploy/local-process.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:local-deploy:1",
  components: [{ capability: "auth.basic", provider: "provider-auth", version: "1.0.0" }],
  sourceRefs: ["system-definition:local-deploy:1"],
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
    environmentSchema: [
      { name: "DATABASE_URL", kind: "secret-reference", required: true },
      { name: "LOG_LEVEL", kind: "config", required: false },
    ],
  });
  const publishedRelease = new ReleaseRegistry().publish({
    releaseId: "local-runtime",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-16T03:00:00Z",
  });
  const environment = {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:local-test",
    runtimeVersions: ["0.2.0"],
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://database-url" },
      { name: "LOG_LEVEL", kind: "config" as const, reference: "config://log-level" },
    ],
  };
  return { compilation, publishedRelease, environment };
}

test("local-process Deploy adapter starts actual Compiler-generated runtime and cleans materialization", async () => {
  const { compilation, publishedRelease, environment } = fixture();
  const releaseBefore = JSON.stringify(publishedRelease);
  const artifactBefore = JSON.stringify(compilation.artifact);
  const filesBefore = JSON.stringify(compilation.files);

  const result = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    generatedFiles: compilation.files,
    environment,
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
    },
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.health.status, "UP");
  assert.equal(result.health.runtimeVersion, "0.2.0");
  assert.equal(result.health.environmentRef, "environment:local-test");
  assert.deepEqual(result.health.bindingNames, ["DATABASE_URL", "LOG_LEVEL"]);
  assert.equal(JSON.stringify(publishedRelease), releaseBefore);
  assert.equal(JSON.stringify(compilation.artifact), artifactBefore);
  assert.equal(JSON.stringify(compilation.files), filesBefore);
  await assert.rejects(access(result.workingDirectory));
});

test("local-process Deploy adapter rejects artifact/runtime mismatch before activation", async () => {
  const { compilation, publishedRelease, environment } = fixture();
  const artifactMismatch = await runLocalProcessDeployment({
    publishedRelease: { ...publishedRelease, artifactHash: `sha256:${"c".repeat(64)}` },
    releaseArtifact: compilation.artifact,
    generatedFiles: compilation.files,
    environment,
  });
  assert.equal(artifactMismatch.ok, false);
  if (artifactMismatch.ok) return;
  assert.equal(artifactMismatch.activated, false);
  assert.equal(artifactMismatch.diagnostic.code, "ARTIFACT_MISMATCH");

  const runtimeMismatch = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    generatedFiles: compilation.files,
    environment: { ...environment, runtimeVersions: ["9.9.9"] },
  });
  assert.equal(runtimeMismatch.ok, false);
  if (runtimeMismatch.ok) return;
  assert.equal(runtimeMismatch.activated, false);
  assert.equal(runtimeMismatch.diagnostic.code, "RUNTIME_INCOMPATIBLE");
});

test("local-process Deploy adapter rejects missing generated runtime entrypoint", async () => {
  const { compilation, publishedRelease, environment } = fixture();
  const result = await runLocalProcessDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    generatedFiles: compilation.files.filter((file) => file.path !== "runtime-entry.mjs"),
    environment,
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.activated, false);
  assert.equal(result.diagnostic.code, "RUNTIME_ENTRYPOINT_MISSING");
});

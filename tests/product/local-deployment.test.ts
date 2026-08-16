import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { executeLocalDeployment } from "../../packages/deploy/local-deployment.js";
import { ReleaseRegistry } from "../../packages/release/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:local-deployment:1",
  components: [{ capability: "workflow.engine", provider: "provider-workflow", version: "1.0.0" }],
  sourceRefs: ["system-definition:local-deployment:1"],
  contentHash: `sha256:${"d".repeat(64)}`,
};

const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"e".repeat(64)}`,
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
    releaseId: "local-deployment",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-16T03:10:00Z",
  });
  const environment = {
    kind: "EnvironmentProfile" as const,
    environmentRef: "environment:local",
    runtimeVersions: ["0.2.0"],
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://database-url" },
      { name: "LOG_LEVEL", kind: "config" as const, reference: "config://log-level" },
    ],
  };
  return { compilation, publishedRelease, environment };
}

const times = {
  startedAt: "2026-08-16T03:10:01Z",
  completedAt: "2026-08-16T03:10:02Z",
};

test("local deployment records observed RuntimeHealth as deterministic success", async () => {
  const { compilation, publishedRelease, environment } = fixture();
  const first = await executeLocalDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    generatedFiles: compilation.files,
    environment,
    ...times,
  });
  const second = await executeLocalDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    generatedFiles: compilation.files,
    environment,
    ...times,
  });

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  if (!first.ok || !second.ok) return;
  assert.equal(first.record.status, "succeeded");
  assert.deepEqual(first.record.healthChecks, [{ name: "runtime-health", status: "PASS" }]);
  assert.deepEqual(first.record, second.record);
  assert.match(first.record.deploymentId, /^sha256:[a-f0-9]{64}$/);
  assert.equal(first.execution.ok, true);
  if (first.execution.ok) await assert.rejects(access(first.execution.workingDirectory));
  assert.equal(JSON.stringify(first.record).includes("secret://database-url"), false);
});

test("local deployment records activated runtime failure and cleanup", async () => {
  const { compilation, publishedRelease, environment } = fixture();
  const result = await executeLocalDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    generatedFiles: compilation.files,
    environment: {
      ...environment,
      bindings: environment.bindings.filter((binding) => binding.name !== "DATABASE_URL"),
    },
    ...times,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.record.status, "failed");
  assert.deepEqual(result.record.healthChecks, [{ name: "runtime-health", status: "FAIL" }]);
  assert.equal(result.execution.ok, false);
  if (result.execution.ok) return;
  assert.equal(result.execution.activated, true);
  assert.equal(result.execution.diagnostic.code, "RUNTIME_PROCESS_FAILED");
  assert.match(result.execution.diagnostic.detail, /RUNTIME_MISSING_ENVIRONMENT_BINDING/);
  if (result.execution.workingDirectory) await assert.rejects(access(result.execution.workingDirectory));
});

test("local deployment preserves preflight failure as diagnostic without false record", async () => {
  const { compilation, publishedRelease, environment } = fixture();
  const result = await executeLocalDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    generatedFiles: compilation.files,
    environment: { ...environment, runtimeVersions: ["9.9.9"] },
    ...times,
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.activated, false);
  assert.equal(result.diagnostic.code, "RUNTIME_INCOMPATIBLE");
});

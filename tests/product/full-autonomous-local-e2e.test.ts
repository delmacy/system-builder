import assert from "node:assert/strict";
import test from "node:test";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { executeLocalDeployment } from "../../packages/deploy/local-deployment.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { validateTraceability } from "../../packages/validation/index.js";
import {
  factoryAnalysis,
  factoryCatalogRecords,
  factoryEnvironmentSchema,
  factoryRecipe,
  factorySystemDefinition,
} from "./fixtures/factory-e2e.js";

async function executeAutonomousLocalVertical(options?: Readonly<{ omitDatabaseBinding?: boolean }>) {
  const catalog = new SoftwareCatalogRegistry();
  for (const record of factoryCatalogRecords) catalog.register(record);

  const assembly = assembleSystemDefinition(
    factorySystemDefinition,
    "system-definition:autonomous-local:1",
    (request) => resolveCatalogCandidates(catalog, request),
  );
  if (!assembly.ok) return { stage: "assembly" as const, assembly };

  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis: factoryAnalysis,
    definition: factorySystemDefinition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: "autonomous-local-e2e", status: "PASS", evidenceRefs: ["test:autonomous-local-e2e"] }],
  });
  if (validation.decision !== "PASS") return { stage: "validation" as const, assembly, validation };

  const compilation = compileSyntheticRelease({
    assemblyPlan: assembly.plan,
    validationEvidence: validation,
    compilerVersion: "0.2.0",
    runtimeVersion: "0.2.0",
    environmentSchema: factoryEnvironmentSchema,
  });

  const releases = new ReleaseRegistry();
  const publishedRelease = releases.publish({
    releaseId: "autonomous-local-system",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-16T03:20:00Z",
  });

  const bindings = [
    { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://database-url" },
    { name: "LOG_LEVEL", kind: "config" as const, reference: "config://log-level" },
  ].filter((binding) => !(options?.omitDatabaseBinding && binding.name === "DATABASE_URL"));

  const deployment = await executeLocalDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    generatedFiles: compilation.files,
    environment: {
      kind: "EnvironmentProfile",
      environmentRef: "environment:autonomous-local",
      runtimeVersions: ["0.2.0"],
      bindings,
    },
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
      DEPLOY_TEST_RESOLVED_SECRET: "postgres://runtime-only-secret",
    },
    startedAt: "2026-08-16T03:20:01Z",
    completedAt: "2026-08-16T03:20:02Z",
  });

  return {
    stage: "deployment" as const,
    assembly,
    validation,
    compilation,
    publishedRelease,
    deployment,
  };
}

test("full autonomous local vertical reaches RuntimeHealth and deterministic DeploymentRecord twice", async () => {
  const first = await executeAutonomousLocalVertical();
  const second = await executeAutonomousLocalVertical();

  assert.equal(first.stage, "deployment");
  assert.equal(second.stage, "deployment");
  if (first.stage !== "deployment" || second.stage !== "deployment") return;
  assert.equal(first.deployment.ok, true);
  assert.equal(second.deployment.ok, true);
  if (!first.deployment.ok || !second.deployment.ok) return;

  assert.equal(first.assembly.plan.contentHash, second.assembly.plan.contentHash);
  assert.equal(first.validation.evidenceHash, second.validation.evidenceHash);
  assert.equal(first.compilation.artifact.artifactHash, second.compilation.artifact.artifactHash);
  assert.deepEqual(first.publishedRelease, second.publishedRelease);
  assert.deepEqual(first.deployment.record, second.deployment.record);
  assert.equal(first.deployment.record.status, "succeeded");
  assert.deepEqual(first.deployment.record.healthChecks, [{ name: "runtime-health", status: "PASS" }]);
  assert.equal(first.deployment.execution.ok, true);
  if (!first.deployment.execution.ok) return;
  assert.equal(first.deployment.execution.health.status, "UP");
  assert.equal(first.deployment.execution.health.runtimeVersion, "0.2.0");
  assert.equal(first.deployment.execution.health.environmentRef, "environment:autonomous-local");
});

test("full autonomous local vertical keeps runtime-only secret value outside immutable/evidence content", async () => {
  const result = await executeAutonomousLocalVertical();
  assert.equal(result.stage, "deployment");
  if (result.stage !== "deployment") return;
  assert.equal(result.deployment.ok, true);
  if (!result.deployment.ok) return;

  const durableContent = JSON.stringify({
    files: result.compilation.files,
    artifact: result.compilation.artifact,
    release: result.publishedRelease,
    record: result.deployment.record,
  });
  assert.equal(durableContent.includes("postgres://runtime-only-secret"), false);
  assert.equal(durableContent.includes("secret://database-url"), false);
});

test("full autonomous local vertical records required-binding runtime failure without false success", async () => {
  const result = await executeAutonomousLocalVertical({ omitDatabaseBinding: true });
  assert.equal(result.stage, "deployment");
  if (result.stage !== "deployment") return;
  assert.equal(result.deployment.ok, true);
  if (!result.deployment.ok) return;

  assert.equal(result.deployment.record.status, "failed");
  assert.deepEqual(result.deployment.record.healthChecks, [{ name: "runtime-health", status: "FAIL" }]);
  assert.equal(result.deployment.execution.ok, false);
  if (result.deployment.execution.ok) return;
  assert.equal(result.deployment.execution.activated, true);
  assert.match(result.deployment.execution.diagnostic.detail, /RUNTIME_MISSING_ENVIRONMENT_BINDING/);
});

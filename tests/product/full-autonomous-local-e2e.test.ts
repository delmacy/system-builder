import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryArtifactPayloadRepository } from "../../packages/artifact-store/index.js";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { executeLocalDeployment } from "../../packages/deploy/local-deployment.js";
import { InMemorySecretResolver } from "../../packages/deploy/secret-resolver.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { validateTraceability } from "../../packages/validation/index.js";
import {
  factoryAnalysis,
  factoryCatalogRecords,
  factoryEnvironmentSchema,
  factoryRecipe,
  factorySystemDefinition,
} from "./fixtures/factory-e2e.js";

const resolvedSecretValue = "postgres://runtime-only-secret";

async function executeAutonomousLocalVertical(options?: Readonly<{ omitDatabaseBinding?: boolean; unresolvedSecret?: boolean }>) {
  const catalog = new SoftwareCatalogRegistry();
  for (const record of factoryCatalogRecords) catalog.register(record);
  const assembly = assembleSystemDefinition(factorySystemDefinition, "system-definition:autonomous-local:1", (request) => resolveCatalogCandidates(catalog, request));
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

  const compilation = compileSyntheticRelease({ assemblyPlan: assembly.plan, validationEvidence: validation, compilerVersion: "0.2.0", runtimeVersion: "0.2.0", environmentSchema: factoryEnvironmentSchema });
  const artifacts = new InMemoryArtifactPayloadRepository();
  const artifactPayload = artifacts.publish({ artifactHash: compilation.artifact.artifactHash, files: compilation.files });
  const publishedRelease = new ReleaseRegistry().publish({ releaseId: "autonomous-local-system", version: "1.0.0", artifact: compilation.artifact, publishedAt: "2026-08-16T03:20:00Z" });
  const bindings = [
    { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://database-url" },
    { name: "LOG_LEVEL", kind: "config" as const, reference: "config://log-level" },
  ].filter((binding) => !(options?.omitDatabaseBinding && binding.name === "DATABASE_URL"));
  const environment = { kind: "EnvironmentProfile" as const, environmentRef: "environment:autonomous-local", runtimeVersions: ["0.2.0"], bindings };
  const secretResolver = new InMemorySecretResolver(
    options?.unresolvedSecret ? {} : { "secret://database-url": resolvedSecretValue },
  );

  const deployment = await executeLocalDeployment({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    artifactPayloadReader: artifacts,
    environment,
    secretResolver,
    processEnvironment: {
      SYSTEM_BUILDER_BUILDER_URL: "http://127.0.0.1:1",
      SYSTEM_BUILDER_OBSERVE_URL: "http://127.0.0.1:1",
    },
    startedAt: "2026-08-16T03:20:01Z",
    completedAt: "2026-08-16T03:20:02Z",
  });

  return { stage: "deployment" as const, assembly, validation, compilation, artifactPayload, publishedRelease, environment, deployment };
}

test("full autonomous local vertical reaches verified secret resolution and deterministic DeploymentRecord without unrelated state", async () => {
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
  assert.deepEqual(first.artifactPayload, second.artifactPayload);
  assert.deepEqual(first.publishedRelease, second.publishedRelease);
  assert.deepEqual(first.deployment.record, second.deployment.record);
  assert.equal(first.deployment.record.status, "succeeded");
  assert.deepEqual(first.deployment.record.healthChecks, [{ name: "runtime-health", status: "PASS" }]);
  assert.equal(first.deployment.execution.ok, true);
  assert.equal(second.deployment.execution.ok, true);
  if (!first.deployment.execution.ok || !second.deployment.execution.ok) return;
  assert.match(first.deployment.execution.stdout, /"kind":"RuntimeStarted"/);
  assert.equal(first.deployment.execution.exitCode, 0);
  assert.equal(first.deployment.execution.health.status, "UP");
  assert.equal(first.deployment.execution.health.runtimeVersion, "0.2.0");
  assert.equal(first.deployment.execution.health.environmentRef, "environment:autonomous-local");
  assert.equal(first.deployment.execution.state, undefined);
  assert.equal(second.deployment.execution.state, undefined);
});

test("full autonomous local vertical keeps resolved secret outside immutable evidence and runtime responses", async () => {
  const result = await executeAutonomousLocalVertical();
  assert.equal(result.stage, "deployment");
  if (result.stage !== "deployment") return;
  assert.equal(result.deployment.ok, true);
  if (!result.deployment.ok || !result.deployment.execution.ok) return;

  const durableContent = JSON.stringify({
    payload: result.artifactPayload,
    artifact: result.compilation.artifact,
    release: result.publishedRelease,
    record: result.deployment.record,
  });
  const runtimeResponses = JSON.stringify({
    health: result.deployment.execution.health,
    state: result.deployment.execution.state,
    stdout: result.deployment.execution.stdout,
    stderr: result.deployment.execution.stderr,
  });
  assert.equal(durableContent.includes(resolvedSecretValue), false);
  assert.equal(runtimeResponses.includes(resolvedSecretValue), false);
  assert.equal(durableContent.includes("secret://database-url"), false);
  assert.equal(JSON.stringify(result.environment).includes("secret://database-url"), true);
});

test("full autonomous local vertical fails unresolved symbolic secret before activation", async () => {
  const result = await executeAutonomousLocalVertical({ unresolvedSecret: true });
  assert.equal(result.stage, "deployment");
  if (result.stage !== "deployment") return;
  assert.equal(result.deployment.ok, false);
  if (result.deployment.ok) return;
  assert.equal(result.deployment.activated, false);
  assert.equal(result.deployment.diagnostic.code, "SECRET_RESOLUTION_FAILED");
  assert.match(result.deployment.diagnostic.detail, /SECRET_REFERENCE_NOT_FOUND:secret:\/\/database-url/);
  assert.equal(result.deployment.diagnostic.detail.includes(resolvedSecretValue), false);
});

test("full autonomous local vertical records required-binding persistent runtime failure without false success", async () => {
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

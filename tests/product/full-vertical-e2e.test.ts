import assert from "node:assert/strict";
import test from "node:test";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { dryRunDeploy } from "../../packages/deploy/index.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import { validateTraceability } from "../../packages/validation/index.js";
import {
  factoryAnalysis,
  factoryCatalogRecords,
  factoryEnvironmentSchema,
  factoryRecipe,
  factorySystemDefinition,
} from "./fixtures/factory-e2e.js";

function executeFullVertical(acceptancePass = true) {
  const catalog = new SoftwareCatalogRegistry();
  for (const record of factoryCatalogRecords) catalog.register(record);

  const assembly = assembleSystemDefinition(
    factorySystemDefinition,
    "system-definition:e2e:1",
    (request) => resolveCatalogCandidates(catalog, request),
  );
  if (!assembly.ok) return { stage: "assembly" as const, assembly };

  const validation = validateTraceability({
    recipe: factoryRecipe,
    analysis: factoryAnalysis,
    definition: factorySystemDefinition,
    assemblyPlan: assembly.plan,
    assemblyPlanRef: assembly.plan.contentHash,
    declaredChecks: [{ id: "full-vertical", status: "PASS", evidenceRefs: ["test:full-vertical"] }],
  });
  if (validation.decision !== "PASS") return { stage: "validation" as const, assembly, validation };

  const compilation = compileSyntheticRelease({
    assemblyPlan: assembly.plan,
    validationEvidence: validation,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: factoryEnvironmentSchema,
  });

  const releases = new ReleaseRegistry();
  const publishedRelease = releases.publish({
    releaseId: "synthetic-system",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-16T00:00:00Z",
  });

  const deployment = dryRunDeploy({
    publishedRelease,
    releaseArtifact: compilation.artifact,
    environment: {
      kind: "EnvironmentProfile",
      environmentRef: "environment:test",
      runtimeVersions: ["0.1.0"],
      bindings: [
        { name: "DATABASE_URL", kind: "secret-reference", reference: "secret://database-url" },
        { name: "LOG_LEVEL", kind: "config", reference: "config://log-level" },
      ],
    },
    acceptanceChecks: [{ name: "runtime-health", pass: acceptancePass }],
    startedAt: "2026-08-16T00:00:01Z",
    completedAt: "2026-08-16T00:00:02Z",
  });

  return { stage: "deployment" as const, assembly, validation, compilation, publishedRelease, deployment };
}

test("full vertical reaches deterministic DeploymentRecord through actual factory APIs", () => {
  const first = executeFullVertical();
  const second = executeFullVertical();
  assert.equal(first.stage, "deployment");
  assert.equal(second.stage, "deployment");
  if (first.stage !== "deployment" || second.stage !== "deployment") return;
  assert.equal(first.assembly.plan.contentHash, second.assembly.plan.contentHash);
  assert.equal(first.validation.evidenceHash, second.validation.evidenceHash);
  assert.equal(first.compilation.artifact.artifactHash, second.compilation.artifact.artifactHash);
  assert.deepEqual(first.publishedRelease, second.publishedRelease);
  assert.equal(first.deployment.ok, true);
  assert.equal(second.deployment.ok, true);
  if (!first.deployment.ok || !second.deployment.ok) return;
  assert.deepEqual(first.deployment.record, second.deployment.record);
  assert.equal(first.deployment.record.status, "succeeded");
});

test("full vertical records controlled acceptance failure instead of successful deployment", () => {
  const result = executeFullVertical(false);
  assert.equal(result.stage, "deployment");
  if (result.stage !== "deployment") return;
  assert.equal(result.deployment.ok, true);
  if (!result.deployment.ok) return;
  assert.equal(result.deployment.record.status, "failed");
  assert.deepEqual(result.deployment.record.healthChecks, [{ name: "runtime-health", status: "FAIL" }]);
});

test("full vertical keeps secret values out of ReleaseArtifact and PublishedRelease", () => {
  const result = executeFullVertical();
  assert.equal(result.stage, "deployment");
  if (result.stage !== "deployment") return;
  const immutableMetadata = JSON.stringify({ artifact: result.compilation.artifact, release: result.publishedRelease });
  assert.equal(immutableMetadata.includes("secret://database-url"), false);
  assert.equal(immutableMetadata.includes("postgres://"), false);
  assert.equal(result.deployment.ok, true);
  if (!result.deployment.ok) return;
  assert.ok(result.deployment.bindings.some((binding) => binding.reference === "secret://database-url"));
});

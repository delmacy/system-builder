import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { normalizeEvidenceProvenanceExtension } from "../../packages/contracts/evidence-provenance/index.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { dryRunDeploy } from "../../packages/deploy/index.js";
import { preflightVerifiedMigrations } from "../../packages/deploy/migration-preflight.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import type { RuntimeStateRequirement } from "../../packages/runtime-core/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:p14-migration-preflight:1",
  components: [{ capability: "workflow.engine", provider: "provider-runtime", version: "1.0.0" }],
  sourceRefs: ["system-definition:p14-migration-preflight:1"],
  contentHash: `sha256:${"9".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"a".repeat(64)}`,
};
const provenance = {
  extensionVersion: "1.0.0" as const,
  evidenceId: "urn:evidence:p14:migration-preflight",
  sources: [{ sourceId: "urn:source:p14:migration-input", sourceType: "artifact" }],
  transformations: [{ descriptorId: "runtime.migration-certification", descriptorVersion: "1.0.0" }],
  lineage: { predecessorEvidenceIds: ["urn:evidence:p14:migration-parent"] },
};
const environmentSchema = [
  { name: "DATABASE_URL", kind: "secret-reference" as const, required: true },
];
const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "env:p14-migration-preflight",
  runtimeVersions: Object.freeze(["14.0.0"]),
  bindings: Object.freeze([
    { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p14-migration/database" },
  ]),
});

function stateRequirement(): RuntimeStateRequirement {
  return {
    kind: "RuntimeStateRequirement",
    capability: "state.p14-migration-preflight",
    storeKind: "sql",
    connectionBinding: { name: "DATABASE_URL", kind: "secret-reference" },
    migrations: [
      {
        id: "p14-migration-preflight-v1",
        capability: "state.p14-migration-preflight",
        order: 1,
        path: "migrations/001-p14-migration-preflight.sql",
        content: "CREATE TABLE p14_migration_preflight (id INTEGER PRIMARY KEY);",
      },
    ],
  };
}

function execute() {
  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "14.0.0",
    runtimeVersion: "14.0.0",
    environmentSchema,
    stateRequirements: [stateRequirement()],
    evidenceProvenance: provenance,
  });
  const migrationPreflight = preflightVerifiedMigrations(compilation.files);
  const release = new ReleaseRegistry().publish({
    releaseId: "release:p14-migration-preflight",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-25T15:05:00Z",
  });
  const deployment = dryRunDeploy({
    publishedRelease: release,
    releaseArtifact: {
      kind: "ReleaseArtifact",
      artifactHash: compilation.artifact.artifactHash,
      manifest: { runtimeVersion: compilation.artifact.manifest.runtimeVersion },
      environmentSchema: compilation.artifact.environmentSchema,
    },
    environment,
    acceptanceChecks: [{ name: "health", pass: true }],
    startedAt: "2026-08-25T15:05:01Z",
    completedAt: "2026-08-25T15:05:02Z",
  });
  assert.equal(deployment.ok, true);
  if (!deployment.ok) throw new Error("expected deployment success");
  return { compilation, migrationPreflight, release, deployment: deployment.record };
}

test("actual migration preflight preserves canonical provenance through Compiler -> Release -> Deploy", () => {
  const result = execute();
  const expected = normalizeEvidenceProvenanceExtension(provenance);

  assert.equal(result.migrationPreflight.kind, "LocalMigrationPreflight");
  assert.equal(result.migrationPreflight.migrations.length, 1);
  assert.deepEqual(result.migrationPreflight.migrations[0]?.connectionBinding, {
    name: "DATABASE_URL",
    kind: "secret-reference",
  });
  assert.equal("value" in (result.migrationPreflight.migrations[0]?.connectionBinding ?? {}), false);
  assert.deepEqual(result.compilation.artifact.evidenceProvenance, expected);
  assert.deepEqual(result.release.evidenceProvenance, expected);
  assert.deepEqual(result.deployment.evidenceProvenance, expected);
});

test("equivalent migration preflight and downstream preservation are deterministic", () => {
  const first = execute();
  const second = execute();

  assert.deepEqual(first.migrationPreflight, second.migrationPreflight);
  assert.equal(first.compilation.artifact.artifactHash, second.compilation.artifact.artifactHash);
  assert.equal(first.release.artifactHash, second.release.artifactHash);
  assert.equal(first.deployment.deploymentId, second.deployment.deploymentId);
  assert.deepEqual(first.deployment.evidenceProvenance, second.deployment.evidenceProvenance);
});

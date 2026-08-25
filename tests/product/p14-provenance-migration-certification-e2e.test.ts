import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import {
  normalizeEvidenceProvenanceExtension,
  type EvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";
import { computeEvidenceProvenanceIntegrity } from "../../packages/contracts/evidence-provenance/integrity-digest.js";
import { verifyEvidenceProvenanceIntegrity } from "../../packages/contracts/evidence-provenance/integrity-verify.js";
import { buildEvidenceNavigationIndex } from "../../packages/contracts/evidence-provenance/navigation-index.js";
import { queryEvidenceBySource } from "../../packages/contracts/evidence-provenance/source-to-evidence-navigation.js";
import { querySourcesByEvidence } from "../../packages/contracts/evidence-provenance/evidence-to-source-navigation.js";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { dryRunDeploy } from "../../packages/deploy/index.js";
import { preflightVerifiedMigrations } from "../../packages/deploy/migration-preflight.js";
import { ReleaseRegistry } from "../../packages/release/index.js";
import type { RuntimeStateRequirement } from "../../packages/runtime-core/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:p14-migration-certification-e2e:1",
  components: [],
  sourceRefs: ["system-definition:p14-migration-certification-e2e:1"],
  contentHash: `sha256:${"1".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"2".repeat(64)}`,
};
const provenance = {
  extensionVersion: "1.0.0" as const,
  evidenceId: "urn:evidence:p14:migration-certification-e2e",
  sources: [{ sourceId: "urn:source:p14:migration-certification-e2e", sourceType: "artifact" }],
  transformations: [{ descriptorId: "migration.certification.e2e", descriptorVersion: "1.0.0" }],
  lineage: { predecessorEvidenceIds: ["urn:evidence:p14:migration-parent"] },
};
const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "env:p14-migration-certification-e2e",
  runtimeVersions: Object.freeze(["14.0.0"]),
  bindings: Object.freeze([
    { name: "DATABASE_URL", kind: "secret-reference" as const, reference: "secret://p14-certification/database" },
  ]),
});

function stateRequirement(): RuntimeStateRequirement {
  return {
    kind: "RuntimeStateRequirement",
    capability: "state.p14-migration-certification-e2e",
    storeKind: "sql",
    connectionBinding: { name: "DATABASE_URL", kind: "secret-reference" },
    migrations: [{
      id: "p14-migration-certification-e2e-v1",
      capability: "state.p14-migration-certification-e2e",
      order: 1,
      path: "migrations/001-p14-migration-certification-e2e.sql",
      content: "CREATE TABLE p14_migration_certification_e2e (id INTEGER PRIMARY KEY);",
    }],
  };
}

function withIntegrity(input: unknown): EvidenceProvenanceExtension {
  const normalized = normalizeEvidenceProvenanceExtension(input);
  return normalizeEvidenceProvenanceExtension({
    ...normalized,
    integrity: computeEvidenceProvenanceIntegrity(normalized),
  });
}

function compile(includeProvenance = true) {
  return compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "14.0.0",
    runtimeVersion: "14.0.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }],
    stateRequirements: [stateRequirement()],
    ...(includeProvenance ? { evidenceProvenance: provenance } : {}),
  });
}

test("migration certification composes Compiler, preflight, Release/Deploy, serialization, integrity and navigation", () => {
  const compilation = compile();
  const preflight = preflightVerifiedMigrations(compilation.files);
  assert.equal(preflight.migrations.length, 1);

  const release = new ReleaseRegistry().publish({
    releaseId: "release:p14-migration-certification-e2e",
    version: "1.0.0",
    artifact: compilation.artifact,
    publishedAt: "2026-08-25T15:55:00Z",
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
    startedAt: "2026-08-25T15:55:01Z",
    completedAt: "2026-08-25T15:55:02Z",
  });
  assert.equal(deployment.ok, true);
  if (!deployment.ok) throw new Error("expected deployment success");

  assert.deepEqual(release.evidenceProvenance, compilation.artifact.evidenceProvenance);
  assert.deepEqual(deployment.record.evidenceProvenance, compilation.artifact.evidenceProvenance);

  const portable = withIntegrity(deployment.record.evidenceProvenance);
  const restored = normalizeEvidenceProvenanceExtension(JSON.parse(JSON.stringify(portable)) as unknown);
  assert.equal(verifyEvidenceProvenanceIntegrity(restored).status, "verified");
  const navigation = buildEvidenceNavigationIndex([restored]);
  assert.deepEqual(queryEvidenceBySource(navigation, "urn:source:p14:migration-certification-e2e").evidenceIds, [restored.evidenceId]);
  assert.deepEqual(querySourcesByEvidence(navigation, restored.evidenceId).sourceIds, ["urn:source:p14:migration-certification-e2e"]);
  assert.equal(JSON.stringify(restored).includes("secret://"), false);
});

test("invalid migration material fails closed before a preservation success can be produced", () => {
  const compilation = compile();
  const migration = compilation.files.find((file) => file.path.startsWith("migrations/"));
  assert.ok(migration);
  const tampered = compilation.files.map((file) =>
    file.path === migration.path ? { ...file, contentHash: `sha256:${"f".repeat(64)}` } : file,
  );
  assert.throws(() => preflightVerifiedMigrations(tampered), /MIGRATION_PREFLIGHT_HASH_MISMATCH/);
});

test("historical migration-bearing compilation without provenance remains valid", () => {
  const compilation = compile(false);
  assert.equal("evidenceProvenance" in compilation.artifact, false);
  assert.equal(preflightVerifiedMigrations(compilation.files).migrations.length, 1);
});

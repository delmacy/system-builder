import assert from "node:assert/strict";
import test from "node:test";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { preflightVerifiedMigrations } from "../../packages/deploy/migration-preflight.js";
import type { RuntimeStateRequirement } from "../../packages/runtime-core/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:p14-migration-fail-closed:1",
  components: [],
  sourceRefs: ["system-definition:p14-migration-fail-closed:1"],
  contentHash: `sha256:${"b".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"c".repeat(64)}`,
};
const provenance = {
  extensionVersion: "1.0.0" as const,
  evidenceId: "urn:evidence:p14:migration-fail-closed",
  sources: [{ sourceId: "urn:source:p14:migration-fail-closed", sourceType: "artifact" }],
  transformations: [{ descriptorId: "runtime.migration-certification", descriptorVersion: "1.0.0" }],
  lineage: { predecessorEvidenceIds: [] },
};

function stateRequirement(): RuntimeStateRequirement {
  return {
    kind: "RuntimeStateRequirement",
    capability: "state.p14-migration-fail-closed",
    storeKind: "sql",
    connectionBinding: { name: "DATABASE_URL", kind: "secret-reference" },
    migrations: [{
      id: "p14-migration-fail-closed-v1",
      capability: "state.p14-migration-fail-closed",
      order: 1,
      path: "migrations/001-p14-migration-fail-closed.sql",
      content: "CREATE TABLE p14_migration_fail_closed (id INTEGER PRIMARY KEY);",
    }],
  };
}

function compilation() {
  return compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "14.0.0",
    runtimeVersion: "14.0.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }],
    stateRequirements: [stateRequirement()],
    evidenceProvenance: provenance,
  });
}

test("tampered migration hash fails before provenance preservation can be claimed", () => {
  const compiled = compilation();
  const migration = compiled.files.find((file) => file.path.startsWith("migrations/"));
  assert.ok(migration);

  const tampered = compiled.files.map((file) =>
    file.path === migration.path
      ? { ...file, contentHash: `sha256:${"f".repeat(64)}` }
      : file,
  );

  assert.throws(
    () => preflightVerifiedMigrations(tampered),
    new RegExp(`MIGRATION_PREFLIGHT_HASH_MISMATCH:${migration.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
  );
  assert.deepEqual(compiled.artifact.evidenceProvenance?.evidenceId, provenance.evidenceId);
});

test("missing Compiler-declared migration file fails closed and does not yield a preflight result", () => {
  const compiled = compilation();
  const migration = compiled.files.find((file) => file.path.startsWith("migrations/"));
  assert.ok(migration);
  const missing = compiled.files.filter((file) => file.path !== migration.path);

  assert.throws(
    () => preflightVerifiedMigrations(missing),
    new RegExp(`MIGRATION_PREFLIGHT_FILE_MISSING:${migration.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
  );
});

test("provenance metadata cannot bypass migration coverage validation", () => {
  const compiled = compilation();
  const extraPath = "migrations/999-unlisted.sql";
  const withUnlistedMigration = [
    ...compiled.files,
    { path: extraPath, content: "SELECT 1;", contentHash: `sha256:${"d".repeat(64)}` },
  ];

  assert.throws(
    () => preflightVerifiedMigrations(withUnlistedMigration),
    /MIGRATION_PREFLIGHT_FILE_UNLISTED:migrations\/999-unlisted\.sql/,
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import { normalizeEvidenceProvenanceExtension } from "../../packages/contracts/evidence-provenance/index.js";
import type { RuntimeStateRequirement } from "../../packages/runtime-core/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:p14-migration-certification:1",
  components: [{ capability: "workflow.engine", provider: "provider-runtime", version: "1.0.0" }],
  sourceRefs: ["system-definition:p14-migration-certification:1"],
  contentHash: `sha256:${"7".repeat(64)}`,
};

const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"8".repeat(64)}`,
};

const environmentSchema = [
  { name: "DATABASE_URL", kind: "secret-reference" as const, required: true },
];

const provenance = {
  extensionVersion: "1.0.0" as const,
  evidenceId: "urn:evidence:p14:migration-certification",
  sources: [
    { sourceId: "urn:source:p14:document", sourceType: "document", capturedAt: "2026-08-25T15:00:00Z" },
  ],
  transformations: [
    { descriptorId: "compiler.runtime-migration", descriptorVersion: "1.0.0", tool: { id: "system-builder.compiler", version: "14.0.0" } },
  ],
  lineage: { predecessorEvidenceIds: ["urn:evidence:p14:predecessor"] },
};

function stateRequirement(): RuntimeStateRequirement {
  return {
    kind: "RuntimeStateRequirement",
    capability: "state.p14-certification",
    storeKind: "sql",
    connectionBinding: { name: "DATABASE_URL", kind: "secret-reference" },
    migrations: [
      {
        id: "p14-certification-v1",
        capability: "state.p14-certification",
        order: 1,
        path: "migrations/001-p14-certification.sql",
        content: "CREATE TABLE p14_certification (id INTEGER PRIMARY KEY);",
      },
    ],
  };
}

function compile(includeProvenance: boolean) {
  return compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "14.0.0",
    runtimeVersion: "14.0.0",
    environmentSchema,
    stateRequirements: [stateRequirement()],
    ...(includeProvenance ? { evidenceProvenance: provenance } : {}),
  });
}

test("actual Compiler output carries Runtime migrations and canonical provenance together", () => {
  const compilation = compile(true);
  const expectedProvenance = normalizeEvidenceProvenanceExtension(provenance);
  const migrationManifest = compilation.files.find((file) => file.path === "migration-manifest.json");
  const migrationFile = compilation.files.find((file) => file.path === "migrations/001-p14-certification.sql");

  assert.ok(migrationManifest);
  assert.ok(migrationFile);
  assert.deepEqual(compilation.artifact.evidenceProvenance, expectedProvenance);

  const parsedManifest = JSON.parse(migrationManifest.content) as {
    kind: string;
    requirements: Array<{ capability: string; connectionBinding: { name: string; kind: string }; migrations: Array<{ id: string; path: string; contentHash: string }> }>;
  };
  assert.equal(parsedManifest.kind, "RuntimeMigrationManifest");
  assert.equal(parsedManifest.requirements[0]?.capability, "state.p14-certification");
  assert.deepEqual(parsedManifest.requirements[0]?.connectionBinding, { name: "DATABASE_URL", kind: "secret-reference" });
  assert.equal(parsedManifest.requirements[0]?.migrations[0]?.id, "p14-certification-v1");
  assert.equal(parsedManifest.requirements[0]?.migrations[0]?.path, migrationFile.path);
  assert.equal(parsedManifest.requirements[0]?.migrations[0]?.contentHash, migrationFile.contentHash);
  assert.equal(JSON.stringify(compilation).includes("secret://"), false);
});

test("equivalent migration plus provenance compilation is deterministic", () => {
  const first = compile(true);
  const second = compile(true);

  assert.equal(first.artifact.artifactHash, second.artifact.artifactHash);
  assert.deepEqual(first.artifact.evidenceProvenance, second.artifact.evidenceProvenance);
  assert.deepEqual(first.files, second.files);
});

test("historical migration-bearing compilation without provenance remains valid", () => {
  const compilation = compile(false);

  assert.equal("evidenceProvenance" in compilation.artifact, false);
  assert.ok(compilation.files.some((file) => file.path === "migration-manifest.json"));
  assert.ok(compilation.files.some((file) => file.path === "migrations/001-p14-certification.sql"));
});

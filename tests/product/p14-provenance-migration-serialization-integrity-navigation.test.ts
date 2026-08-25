import assert from "node:assert/strict";
import test from "node:test";
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
import { preflightVerifiedMigrations } from "../../packages/deploy/migration-preflight.js";
import type { RuntimeStateRequirement } from "../../packages/runtime-core/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:p14-migration-serialization:1",
  components: [],
  sourceRefs: ["system-definition:p14-migration-serialization:1"],
  contentHash: `sha256:${"d".repeat(64)}`,
};
const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"e".repeat(64)}`,
};
const compilerProvenance = {
  extensionVersion: "1.0.0" as const,
  evidenceId: "urn:evidence:p14:migration-serialization",
  sources: [
    { sourceId: "urn:source:p14:zeta", sourceType: "document" },
    { sourceId: "urn:source:p14:alpha", sourceType: "artifact" },
  ],
  transformations: [{ descriptorId: "migration.certification", descriptorVersion: "1.0.0" }],
  lineage: { predecessorEvidenceIds: ["urn:evidence:p14:migration-parent"] },
};

function stateRequirement(): RuntimeStateRequirement {
  return {
    kind: "RuntimeStateRequirement",
    capability: "state.p14-migration-serialization",
    storeKind: "sql",
    connectionBinding: { name: "DATABASE_URL", kind: "secret-reference" },
    migrations: [{
      id: "p14-migration-serialization-v1",
      capability: "state.p14-migration-serialization",
      order: 1,
      path: "migrations/001-p14-migration-serialization.sql",
      content: "CREATE TABLE p14_migration_serialization (id INTEGER PRIMARY KEY);",
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

function certify() {
  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "14.0.0",
    runtimeVersion: "14.0.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference" as const, required: true }],
    stateRequirements: [stateRequirement()],
    evidenceProvenance: compilerProvenance,
  });
  const preflight = preflightVerifiedMigrations(compilation.files);
  assert.equal(preflight.migrations.length, 1);

  const portable = withIntegrity(compilation.artifact.evidenceProvenance);
  const restored = normalizeEvidenceProvenanceExtension(
    JSON.parse(JSON.stringify(portable)) as unknown,
  );
  const integrity = verifyEvidenceProvenanceIntegrity(restored);
  const navigation = buildEvidenceNavigationIndex([restored]);
  const sourceToEvidence = queryEvidenceBySource(navigation, "urn:source:p14:alpha");
  const evidenceToSource = querySourcesByEvidence(navigation, restored.evidenceId);
  return { portable, preflight, restored, integrity, sourceToEvidence, evidenceToSource };
}

test("successful migration preflight plus JSON round-trip preserves integrity and navigation", () => {
  const result = certify();

  assert.equal(result.integrity.status, "verified");
  assert.deepEqual(result.restored, result.portable);
  assert.deepEqual(result.sourceToEvidence, {
    sourceId: "urn:source:p14:alpha",
    found: true,
    evidenceIds: ["urn:evidence:p14:migration-serialization"],
  });
  assert.deepEqual(result.evidenceToSource, {
    evidenceId: "urn:evidence:p14:migration-serialization",
    found: true,
    sourceIds: ["urn:source:p14:alpha", "urn:source:p14:zeta"],
  });
});

test("equivalent migration plus serialization certification is deterministic", () => {
  const first = certify();
  const second = certify();

  assert.deepEqual(first.preflight, second.preflight);
  assert.deepEqual(first.restored, second.restored);
  assert.deepEqual(first.integrity, second.integrity);
  assert.deepEqual(first.sourceToEvidence, second.sourceToEvidence);
  assert.deepEqual(first.evidenceToSource, second.evidenceToSource);
  assert.equal(JSON.stringify(first.restored).includes("secret://"), false);
});

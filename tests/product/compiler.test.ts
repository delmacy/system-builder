import assert from "node:assert/strict";
import test from "node:test";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:fixture:1",
  components: [
    { capability: "workflow.engine", provider: "provider-a", version: "1.0.0" },
    { capability: "auth.basic", provider: "provider-auth", version: "1.0.0", dependencies: ["storage.session"] },
  ],
  sourceRefs: ["system-definition:fixture:1", "catalog:workflow.engine:provider-a:1.0.0"],
  contentHash: `sha256:${"a".repeat(64)}`,
};

const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"b".repeat(64)}`,
};

test("compiler emits reproducible synthetic ReleaseArtifact with runnable runtime entrypoint", () => {
  const input = {
    assemblyPlan,
    validationEvidence,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: [
      { name: "DATABASE_URL", kind: "secret-reference" as const, required: true },
      { name: "LOG_LEVEL", kind: "config" as const, required: false },
    ],
  };
  const first = compileSyntheticRelease(input);
  const second = compileSyntheticRelease({
    ...input,
    assemblyPlan: {
      ...assemblyPlan,
      components: [...assemblyPlan.components].reverse(),
      sourceRefs: [...assemblyPlan.sourceRefs].reverse(),
    },
    environmentSchema: [...input.environmentSchema].reverse(),
  });

  assert.deepEqual(first, second);
  assert.match(first.artifact.artifactHash, /^sha256:[a-f0-9]{64}$/);
  assert.equal(first.artifact.assemblyPlanRef, assemblyPlan.contentHash);
  assert.equal(first.artifact.validationEvidenceRef, validationEvidence.evidenceHash);
  assert.deepEqual(first.artifact.manifest.files, [
    "assembly-plan.json",
    "environment-schema.json",
    "runtime-entry.mjs",
    "runtime-manifest.json",
  ]);

  const runtimeEntry = first.files.find((file) => file.path === "runtime-entry.mjs");
  const runtimeManifest = first.files.find((file) => file.path === "runtime-manifest.json");
  assert.ok(runtimeEntry);
  assert.ok(runtimeManifest);
  assert.match(runtimeEntry.contentHash, /^sha256:[a-f0-9]{64}$/);
  assert.match(runtimeEntry.content, /RuntimeHealth/);
  assert.deepEqual(JSON.parse(runtimeManifest.content), {
    runtimeVersion: "0.1.0",
    entrypoint: "runtime-entry.mjs",
    components: [
      { capability: "auth.basic", provider: "provider-auth", version: "1.0.0" },
      { capability: "workflow.engine", provider: "provider-a", version: "1.0.0" },
    ],
  });
});

test("compiler rejects failing or mismatched validation evidence", () => {
  assert.throws(
    () => compileSyntheticRelease({
      assemblyPlan,
      validationEvidence: { ...validationEvidence, decision: "FAIL" },
      compilerVersion: "0.1.0",
      runtimeVersion: "0.1.0",
    }),
    /COMPILER_VALIDATION_FAILED/,
  );

  assert.throws(
    () => compileSyntheticRelease({
      assemblyPlan,
      validationEvidence: { ...validationEvidence, assemblyPlanRef: `sha256:${"c".repeat(64)}` },
      compilerVersion: "0.1.0",
      runtimeVersion: "0.1.0",
    }),
    /COMPILER_VALIDATION_ASSEMBLY_MISMATCH/,
  );
});

test("compiler rejects embedded environment values and never emits secret values", () => {
  assert.throws(
    () => compileSyntheticRelease({
      assemblyPlan,
      validationEvidence,
      compilerVersion: "0.1.0",
      runtimeVersion: "0.1.0",
      environmentSchema: [
        { name: "DATABASE_URL", kind: "secret-reference", required: true, value: "postgres://secret" },
      ] as unknown as readonly { name: string; kind: "secret-reference"; required: boolean }[],
    }),
    /COMPILER_SECRET_VALUE_NOT_ALLOWED/,
  );

  const compilation = compileSyntheticRelease({
    assemblyPlan,
    validationEvidence,
    compilerVersion: "0.1.0",
    runtimeVersion: "0.1.0",
    environmentSchema: [{ name: "DATABASE_URL", kind: "secret-reference", required: true }],
  });
  const immutableContent = JSON.stringify(compilation);
  assert.equal(immutableContent.includes("postgres://secret"), false);
  assert.equal(immutableContent.includes("secret://database-url"), false);
});

test("compiler rejects invalid AssemblyPlan identity", () => {
  assert.throws(
    () => compileSyntheticRelease({
      assemblyPlan: { ...assemblyPlan, contentHash: "not-a-hash" },
      validationEvidence,
      compilerVersion: "0.1.0",
      runtimeVersion: "0.1.0",
    }),
    /COMPILER_INVALID_ASSEMBLY_PLAN_HASH/,
  );
});

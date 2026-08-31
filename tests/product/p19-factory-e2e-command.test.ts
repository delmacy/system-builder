import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { FACTORY_JOURNEY_CONTRACT_VERSION } from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";

const revision = { contractVersion: PROCESS_VERSION_IDENTITY_VERSION, artifactRef: "process:orders", revisionRef: "process-revision:orders:v1", revisionNumber: 1, previousRevisionRef: null };
const analysis = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis", identityRef: "analysis:orders:v1" };
const definitionIdentity = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition", identityRef: "system-definition:orders:v1" };
const processEndpoint = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision", processRevision: revision };

function deterministicInput() {
  return {
    journeyBinding: {
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      journey: { contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION, stages: [
        { kind: "approved-process", identityRef: revision.revisionRef, provenanceRef: revision.artifactRef },
        { kind: "analysis-definition", identityRef: analysis.identityRef, provenanceRef: revision.revisionRef },
        { kind: "capability-assembly", identityRef: "assembly:pending", provenanceRef: definitionIdentity.identityRef },
        { kind: "validation", identityRef: "validation:pending", provenanceRef: "assembly:pending" },
        { kind: "compiler-release", identityRef: "release:pending", provenanceRef: "validation:pending" },
        { kind: "deployment", identityRef: "deployment:pending", provenanceRef: "release:pending" },
      ] },
      lineage: { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, processRevision: processEndpoint, analysis, systemDefinition: definitionIdentity, hops: [
        { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision-to-analysis", from: processEndpoint, to: analysis },
        { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis-to-system-definition", from: analysis, to: definitionIdentity },
      ] },
    },
    definition: { definition: "SystemDefinition", analysisRef: analysis.identityRef, recipeRef: revision.revisionRef, capabilities: [{ id: "orders", capability: "orders", requirementRefs: ["REQ-1"] }] },
    catalogEntries: [{ capability: "orders", provider: "builtin", version: "1.0.0" }],
    recipeTraceability: { modules: [{ requirementIds: ["REQ-1"] }], rules: [], responsibilities: [], exceptions: [] },
    analysisTraceability: { findings: [{ recipeRequirementRefs: ["REQ-1"] }] },
    definitionTraceability: { entities: [], processes: [], actions: [], capabilities: [{ capability: "orders", requirementRefs: ["REQ-1"] }], views: [], policies: [], integrations: [] },
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    releaseId: "orders-system",
    releaseVersion: "0.0.1",
    publishedAt: "2026-08-31T14:10:00.000Z",
    environment: { kind: "EnvironmentProfile", environmentRef: "environment:p19:e2e", runtimeVersions: ["1.0.0"], bindings: [] },
    acceptanceChecks: [{ name: "factory-e2e", pass: true }],
    startedAt: "2026-08-31T14:11:00.000Z",
    completedAt: "2026-08-31T14:12:00.000Z",
  };
}

function runCommand(inputPath: string) {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  return spawnSync(npm, ["run", "--silent", "factory:e2e", "--", "--input", inputPath], { cwd: process.cwd(), encoding: "utf8" });
}

test("repository factory E2E command delegates to the canonical primitive and emits deterministic machine-readable output", () => {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-command-"));
  try {
    const inputPath = join(directory, "input.json");
    writeFileSync(inputPath, JSON.stringify(deterministicInput()), "utf8");
    const first = runCommand(inputPath);
    const second = runCommand(inputPath);
    assert.equal(first.status, 0, first.stderr);
    assert.equal(second.status, 0, second.stderr);
    assert.equal(first.stdout, second.stdout);
    const envelope = JSON.parse(first.stdout.trim()) as { ok: boolean; result: { binding: { references: { systemDefinitionRef: string } } } };
    assert.equal(envelope.ok, true);
    assert.equal(envelope.result.binding.references.systemDefinitionRef, definitionIdentity.identityRef);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("repository factory E2E command rejects malformed input with bounded deterministic error and non-zero exit", () => {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-command-invalid-"));
  try {
    const inputPath = join(directory, "invalid.json");
    writeFileSync(inputPath, "{}", "utf8");
    const result = runCommand(inputPath);
    assert.notEqual(result.status, 0);
    const envelope = JSON.parse(result.stderr.trim()) as { ok: boolean; error: { code: string; message: string } };
    assert.equal(envelope.ok, false);
    assert.equal(envelope.error.code, "FACTORY_E2E_COMMAND_FAILED");
    assert.match(envelope.error.message, /catalogEntries/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("WBS 19.1.3 growing proof audits the complete supported command lineage, repeatability and fail-closed predecessors", () => {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-growing-proof-"));
  try {
    const clean = deterministicInput();
    const cleanPath = join(directory, "clean.json");
    writeFileSync(cleanPath, JSON.stringify(clean), "utf8");

    const first = runCommand(cleanPath);
    const second = runCommand(cleanPath);
    assert.equal(first.status, 0, first.stderr);
    assert.equal(second.status, 0, second.stderr);
    assert.equal(first.stdout, second.stdout, "clean supported invocations must be byte-for-byte deterministic");

    const success = JSON.parse(first.stdout.trim()) as {
      ok: boolean;
      result: {
        binding: {
          input: { journey: { stages: ReadonlyArray<{ kind: string; identityRef: string; provenanceRef: string }> } };
          references: {
            systemDefinitionRef: string;
            assemblyPlanRef: string;
            validationEvidenceRef: string;
            releaseArtifactRef: string;
            publishedReleaseRef: string;
            deploymentRef: string;
          };
        };
        deploymentRecord: { publishedReleaseRef: string };
      };
    };
    assert.equal(success.ok, true);
    assert.equal(success.result.binding.references.systemDefinitionRef, definitionIdentity.identityRef);
    assert.deepEqual(success.result.binding.input.journey.stages.map((stage) => stage.kind), [
      "approved-process",
      "analysis-definition",
      "capability-assembly",
      "validation",
      "compiler-release",
      "deployment",
    ]);
    const stages = success.result.binding.input.journey.stages;
    const references = success.result.binding.references;
    assert.equal(stages[0]?.identityRef, revision.revisionRef);
    assert.equal(stages[1]?.identityRef, analysis.identityRef);
    assert.equal(stages[2]?.identityRef, references.assemblyPlanRef);
    assert.equal(stages[3]?.identityRef, references.validationEvidenceRef);
    assert.equal(stages[4]?.identityRef, references.publishedReleaseRef);
    assert.equal(stages[5]?.identityRef, references.deploymentRef);
    assert.equal(stages[2]?.provenanceRef, references.systemDefinitionRef);
    assert.equal(stages[3]?.provenanceRef, references.assemblyPlanRef);
    assert.equal(stages[4]?.provenanceRef, references.validationEvidenceRef);
    assert.equal(stages[5]?.provenanceRef, success.result.deploymentRecord.publishedReleaseRef);
    assert.equal(success.result.deploymentRecord.publishedReleaseRef, "orders-system@0.0.1");
    assert.notEqual(references.releaseArtifactRef, "");

    const invalidCases: ReadonlyArray<Readonly<{ name: string; payload: unknown; expected: RegExp }>> = [
      {
        name: "missing predecessor",
        payload: {
          ...clean,
          journeyBinding: {
            ...clean.journeyBinding,
            journey: {
              ...clean.journeyBinding.journey,
              stages: clean.journeyBinding.journey.stages.map((stage, index) => index === 2 ? { ...stage, provenanceRef: "" } : stage),
            },
          },
        },
        expected: /stages\[2\]\.provenanceRef must be a non-empty string/,
      },
      {
        name: "stale or incompatible predecessor",
        payload: {
          ...clean,
          journeyBinding: {
            ...clean.journeyBinding,
            journey: {
              ...clean.journeyBinding.journey,
              stages: clean.journeyBinding.journey.stages.map((stage, index) => index === 2 ? { ...stage, provenanceRef: "system-definition:orders:v0" } : stage),
            },
          },
        },
        expected: /capability-assembly predecessor does not match canonical system-definition identity/,
      },
      {
        name: "substituted cross-system predecessor",
        payload: {
          ...clean,
          journeyBinding: {
            ...clean.journeyBinding,
            journey: {
              ...clean.journeyBinding.journey,
              stages: clean.journeyBinding.journey.stages.map((stage, index) => index === 0 ? { ...stage, identityRef: "process-revision:billing:v1" } : stage),
            },
          },
        },
        expected: /approved-process stage does not match canonical process artifact\/revision identity/,
      },
      {
        name: "lineage-broken predecessor",
        payload: {
          ...clean,
          journeyBinding: {
            ...clean.journeyBinding,
            lineage: {
              ...clean.journeyBinding.lineage,
              hops: [
                clean.journeyBinding.lineage.hops[0],
                { ...clean.journeyBinding.lineage.hops[1], from: { ...analysis, identityRef: "analysis:billing:v1" } },
              ],
            },
          },
        },
        expected: /analysis-to-definition hop does not match declared endpoints/,
      },
    ];

    for (const scenario of invalidCases) {
      const inputPath = join(directory, `${scenario.name.replaceAll(" ", "-")}.json`);
      writeFileSync(inputPath, JSON.stringify(scenario.payload), "utf8");
      const rejected = runCommand(inputPath);
      assert.notEqual(rejected.status, 0, `${scenario.name} must fail closed`);
      assert.equal(rejected.stdout, "", `${scenario.name} must not emit partial success evidence`);
      const failure = JSON.parse(rejected.stderr.trim()) as { ok: boolean; error: { code: string; message: string } };
      assert.equal(failure.ok, false);
      assert.equal(failure.error.code, "FACTORY_E2E_COMMAND_FAILED");
      assert.match(failure.error.message, scenario.expected, scenario.name);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
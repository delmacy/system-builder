import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  FACTORY_JOURNEY_STAGE_KINDS,
  FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
} from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { executeCanonicalFactoryE2E } from "../../scripts/factory-e2e-command.js";
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";

const revision = { contractVersion: PROCESS_VERSION_IDENTITY_VERSION, artifactRef: "process:orders", revisionRef: "process-revision:orders:v1", revisionNumber: 1, previousRevisionRef: null };
const analysis = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis", identityRef: "analysis:orders:v1" };
const definitionIdentity = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition", identityRef: "system-definition:orders:v1" };
const processEndpoint = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision", processRevision: revision };

function factoryTransport() {
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
    environment: { kind: "EnvironmentProfile", environmentRef: "environment:p19:bootstrap", runtimeVersions: ["1.0.0"], bindings: [] },
    acceptanceChecks: [{ name: "factory-bootstrap", pass: true }],
    startedAt: "2026-08-31T14:11:00.000Z",
    completedAt: "2026-08-31T14:12:00.000Z",
  };
}

function bootstrapInput(inputPath: string) {
  return {
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.7.0", npmVersion: "11.5.1", factoryE2EAvailable: true },
    config: { inputPath },
    factoryInput: factoryTransport(),
  };
}

function runCommand(inputPath: string) {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  return spawnSync(npm, ["run", "--silent", "factory:bootstrap", "--", "--input", inputPath], { cwd: process.cwd(), encoding: "utf8" });
}

test("TASK-435 validates before a single canonical delegation", () => {
  let calls = 0;
  const input = bootstrapInput("./bootstrap-input.json");
  const result = executeFactoryOperatorBootstrap(input, (factoryInput) => {
    calls += 1;
    assert.equal(factoryInput.releaseId, "orders-system");
    return executeCanonicalFactoryE2E(factoryInput);
  });
  assert.equal(calls, 1);
  assert.equal(result.ok, true);

  const invalid = { ...input, prerequisites: { ...input.prerequisites, factoryE2EAvailable: false } };
  assert.throws(() => executeFactoryOperatorBootstrap(invalid, (factoryInput) => {
    calls += 1;
    return executeCanonicalFactoryE2E(factoryInput);
  }), /factoryE2EAvailable must be true/);
  assert.equal(calls, 1, "invalid prerequisites must fail before canonical invocation");
});

test("TASK-435 supported command is deterministic and leaves no filesystem side effects", () => {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-bootstrap-"));
  try {
    const inputPath = join(directory, "bootstrap.json");
    const serialized = JSON.stringify(bootstrapInput(inputPath));
    writeFileSync(inputPath, serialized, "utf8");
    const beforeEntries = readdirSync(directory);

    const first = runCommand(inputPath);
    const second = runCommand(inputPath);
    assert.equal(first.status, 0, first.stderr);
    assert.equal(second.status, 0, second.stderr);
    assert.equal(first.stdout, second.stdout);
    assert.equal(readFileSync(inputPath, "utf8"), serialized, "bootstrap must not mutate authoritative input");
    assert.deepEqual(readdirSync(directory), beforeEntries, "bootstrap must not persist side-effect artifacts");

    const envelope = JSON.parse(first.stdout.trim()) as {
      ok: boolean;
      bootstrap: { references: { systemDefinitionRef: string } };
      progress: { status: string; stages: Array<{ ordinal: number; kind: string; status: string; identityRef: string; provenanceRef: string }>; references: { systemDefinitionRef: string; deploymentRef: string } };
      result: { binding: { references: { systemDefinitionRef: string; deploymentRef: string }; input: { journey: { stages: Array<{ kind: string; identityRef: string; provenanceRef: string }> } } } };
    };
    assert.equal(envelope.ok, true);
    assert.equal(envelope.bootstrap.references.systemDefinitionRef, definitionIdentity.identityRef);
    assert.equal(envelope.result.binding.references.systemDefinitionRef, definitionIdentity.identityRef);
    assert.equal(envelope.progress.status, "succeeded");
    assert.deepEqual(envelope.progress.stages.map((stage) => stage.kind), FACTORY_JOURNEY_STAGE_KINDS);
    assert.deepEqual(envelope.progress.stages.map((stage) => stage.ordinal), [1, 2, 3, 4, 5, 6]);
    assert.ok(envelope.progress.stages.every((stage) => stage.status === "completed"));
    assert.deepEqual(
      envelope.progress.stages.map(({ kind, identityRef, provenanceRef }) => ({ kind, identityRef, provenanceRef })),
      envelope.result.binding.input.journey.stages,
      "operator progress must reuse canonical journey stage identity/provenance",
    );
    assert.deepEqual(envelope.progress.references, envelope.result.binding.references);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("TASK-435 rejects absent capability and malformed configuration before success evidence", () => {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-bootstrap-invalid-"));
  try {
    const inputPath = join(directory, "bootstrap.json");
    const absentCapability = bootstrapInput(inputPath);
    absentCapability.prerequisites.factoryE2EAvailable = false;
    writeFileSync(inputPath, JSON.stringify(absentCapability), "utf8");

    const result = runCommand(inputPath);
    assert.notEqual(result.status, 0);
    assert.equal(result.stdout, "");
    const envelope = JSON.parse(result.stderr.trim()) as { ok: boolean; error: { code: string; message: string } };
    assert.equal(envelope.ok, false);
    assert.equal(envelope.error.code, "FACTORY_OPERATOR_BOOTSTRAP_FAILED");
    assert.match(envelope.error.message, /factoryE2EAvailable must be true/);

    const malformed = bootstrapInput(inputPath);
    Object.assign(malformed.config, { apiToken: "must-not-be-accepted" });
    writeFileSync(inputPath, JSON.stringify(malformed), "utf8");
    const rejected = runCommand(inputPath);
    assert.notEqual(rejected.status, 0);
    assert.equal(rejected.stdout, "");
    assert.match(rejected.stderr, /config has unexpected field apiToken/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("TASK-436 stale predecessor rejection never emits downstream completion evidence", () => {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-bootstrap-stale-"));
  try {
    const inputPath = join(directory, "bootstrap.json");
    const stale = bootstrapInput(inputPath);
    stale.factoryInput.journeyBinding.journey.stages[2]!.provenanceRef = "system-definition:orders:stale";
    writeFileSync(inputPath, JSON.stringify(stale), "utf8");

    const rejected = runCommand(inputPath);
    assert.notEqual(rejected.status, 0);
    assert.equal(rejected.stdout, "", "rejected predecessor must not emit a success/progress envelope");
    assert.doesNotMatch(rejected.stderr, /\"status\":\"completed\"/);
    assert.match(rejected.stderr, /capability-assembly predecessor does not match canonical system-definition identity/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

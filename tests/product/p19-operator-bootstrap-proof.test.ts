import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
} from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { executeCanonicalFactoryE2E } from "../../scripts/factory-e2e-command.js";
import { executeFactoryOperatorBootstrap } from "../../scripts/factory-operator-bootstrap-command.js";

const root = resolve(process.cwd());
const cli = join(root, "scripts/factory-operator-bootstrap.ts");

function factoryInput() {
  const revision = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process-revision:orders:v1",
    revisionNumber: 1,
    previousRevisionRef: null,
  };
  const analysis = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis", identityRef: "analysis:orders:v1" } as const;
  const definitionIdentity = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition", identityRef: "system-definition:orders:v1" } as const;
  const processRevision = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision", processRevision: revision } as const;
  return {
    journeyBinding: {
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      journey: {
        contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
        stages: [
          { kind: "approved-process", identityRef: revision.revisionRef, provenanceRef: revision.artifactRef },
          { kind: "analysis-definition", identityRef: analysis.identityRef, provenanceRef: revision.revisionRef },
          { kind: "capability-assembly", identityRef: "assembly:pending", provenanceRef: definitionIdentity.identityRef },
          { kind: "validation", identityRef: "validation:pending", provenanceRef: "assembly:pending" },
          { kind: "compiler-release", identityRef: "release:pending", provenanceRef: "validation:pending" },
          { kind: "deployment", identityRef: "deployment:pending", provenanceRef: "release:pending" },
        ],
      },
      lineage: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        processRevision,
        analysis,
        systemDefinition: definitionIdentity,
        hops: [
          { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision-to-analysis", from: processRevision, to: analysis },
          { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis-to-system-definition", from: analysis, to: definitionIdentity },
        ],
      },
    },
    definition: {
      definition: "SystemDefinition",
      analysisRef: analysis.identityRef,
      recipeRef: revision.revisionRef,
      capabilities: [{ id: "orders", capability: "orders", requirementRefs: ["REQ-1"] }],
    },
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
    acceptanceChecks: [{ name: "factory-e2e", pass: true }],
    startedAt: "2026-08-31T14:11:00.000Z",
    completedAt: "2026-08-31T14:12:00.000Z",
  };
}

function bootstrapInput(inputPath: string) {
  return {
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.0.0", npmVersion: "11.0.0", factoryE2EAvailable: true },
    config: { inputPath },
    factoryInput: factoryInput(),
  };
}

function run(raw: unknown) {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-proof-"));
  try {
    const inputPath = join(directory, "bootstrap.json");
    writeFileSync(inputPath, JSON.stringify(raw), "utf8");
    return spawnSync(process.execPath, ["--import", "tsx", cli, "--input", inputPath], { cwd: root, encoding: "utf8" });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("TASK-438 supported bootstrap delegates exactly once and remains deterministic", () => {
  const raw = bootstrapInput("fixture://operator-bootstrap-proof");
  let calls = 0;
  const first = executeFactoryOperatorBootstrap(raw, (input) => {
    calls += 1;
    return executeCanonicalFactoryE2E(input);
  });
  const second = executeFactoryOperatorBootstrap(raw);
  assert.equal(calls, 1);
  assert.deepEqual(first, second);
  assert.equal(first.progress.status, "succeeded");
  assert.equal(first.progress.stages.length, 6);
});

test("TASK-438 supported command fails closed for missing prerequisite and unknown protected config", () => {
  const missing = bootstrapInput("fixture://missing-prerequisite");
  missing.prerequisites.factoryE2EAvailable = false as true;
  const missingResult = run(missing);
  assert.notEqual(missingResult.status, 0);
  assert.equal(missingResult.stdout, "");
  assert.match(missingResult.stderr, /MISSING_PREREQUISITE/);
  assert.doesNotMatch(missingResult.stderr, /"status":"completed"|"status":"succeeded"/);

  const secret = "never-echo-this-secret";
  const malformed = bootstrapInput("fixture://unknown-config") as ReturnType<typeof bootstrapInput> & { config: { inputPath: string; apiToken?: string } };
  malformed.config.apiToken = secret;
  const malformedResult = run(malformed);
  assert.notEqual(malformedResult.status, 0);
  assert.equal(malformedResult.stdout, "");
  assert.match(malformedResult.stderr, /INVALID_OPERATOR_INPUT/);
  assert.doesNotMatch(malformedResult.stderr, new RegExp(secret));
});

test("TASK-438 missing capability is actionable and produces no partial success", () => {
  const unavailable = bootstrapInput("fixture://missing-capability");
  unavailable.factoryInput.catalogEntries = [];
  const result = run(unavailable);
  assert.notEqual(result.status, 0);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /UNAVAILABLE_CAPABILITY/);
  assert.doesNotMatch(result.stderr, /"status":"completed"|"status":"succeeded"/);
});

test("TASK-438 stale and substituted predecessor identities remain fail-closed through the supported command", () => {
  const stale = bootstrapInput("fixture://stale");
  stale.factoryInput.journeyBinding.journey.stages[2]!.provenanceRef = "system-definition:orders:stale";
  const staleResult = run(stale);
  assert.notEqual(staleResult.status, 0);
  assert.equal(staleResult.stdout, "");
  assert.match(staleResult.stderr, /CANONICAL_E2E_REJECTED/);

  const substituted = bootstrapInput("fixture://substituted");
  substituted.factoryInput.journeyBinding.journey.stages[0]!.identityRef = "process-revision:other:v1";
  const substitutedResult = run(substituted);
  assert.notEqual(substitutedResult.status, 0);
  assert.equal(substitutedResult.stdout, "");
  assert.match(substitutedResult.stderr, /CANONICAL_E2E_REJECTED/);
});

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
  validateFactoryOperatorBootstrap,
} from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";

const repositoryRoot = resolve(process.cwd());
const cliPath = join(repositoryRoot, "scripts/factory-operator-bootstrap.ts");

function factoryInput(): Record<string, unknown> {
  const revision = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process-revision:orders:v1",
    revisionNumber: 1,
    previousRevisionRef: null,
  };
  const analysis = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "analysis",
    identityRef: "analysis:orders:v1",
  };
  const systemDefinition = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition",
    identityRef: "system-definition:orders:v1",
  };
  const processRevision = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision",
    processRevision: revision,
  };

  return {
    journeyBinding: {
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      journey: {
        contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
        stages: [
          { kind: "approved-process", identityRef: revision.revisionRef, provenanceRef: revision.artifactRef },
          { kind: "analysis-definition", identityRef: analysis.identityRef, provenanceRef: revision.revisionRef },
          { kind: "capability-assembly", identityRef: "assembly:pending", provenanceRef: systemDefinition.identityRef },
          { kind: "validation", identityRef: "validation:pending", provenanceRef: "assembly:pending" },
          { kind: "compiler-release", identityRef: "release:pending", provenanceRef: "validation:pending" },
          { kind: "deployment", identityRef: "deployment:pending", provenanceRef: "release:pending" },
        ],
      },
      lineage: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        processRevision,
        analysis,
        systemDefinition,
        hops: [
          {
            contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
            kind: "process-revision-to-analysis",
            from: processRevision,
            to: analysis,
          },
          {
            contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
            kind: "analysis-to-system-definition",
            from: analysis,
            to: systemDefinition,
          },
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
    definitionTraceability: {
      entities: [],
      processes: [],
      actions: [],
      capabilities: [{ capability: "orders", requirementRefs: ["REQ-1"] }],
      views: [],
      policies: [],
      integrations: [],
    },
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    releaseId: "orders-system",
    releaseVersion: "0.0.1",
    publishedAt: "2026-08-31T14:10:00.000Z",
    environment: {
      kind: "EnvironmentProfile",
      environmentRef: "environment:p19:bootstrap",
      runtimeVersions: ["1.0.0"],
      bindings: [],
    },
    acceptanceChecks: [{ name: "factory-e2e", pass: true }],
    startedAt: "2026-08-31T14:11:00.000Z",
    completedAt: "2026-08-31T14:12:00.000Z",
  };
}

function bootstrapInput(inputPath: string): Record<string, unknown> {
  return {
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.0.0", npmVersion: "11.0.0", factoryE2EAvailable: true },
    config: { inputPath },
    factoryInput: factoryInput(),
  };
}

function runCommand(inputPath: string) {
  return spawnSync(process.execPath, ["--import", "tsx", cliPath, "--input", inputPath], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
}

test("TASK-434 operator bootstrap validates declared prerequisites without executing the journey", () => {
  const raw = bootstrapInput("fixture://operator-bootstrap");
  const transportFactoryInput = raw.factoryInput as Record<string, unknown>;
  const catalogEntries = transportFactoryInput.catalogEntries;
  assert.ok(Array.isArray(catalogEntries));
  const materializedFactoryInput = { ...transportFactoryInput, catalog: { transportProof: true } };
  delete materializedFactoryInput.catalogEntries;
  const parsed = validateFactoryOperatorBootstrap({ ...raw, factoryInput: materializedFactoryInput });
  assert.equal(parsed.contractVersion, FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION);
  assert.equal(parsed.ok, true);
  assert.match(parsed.references.processRevisionRef, /.+/);
  assert.match(parsed.references.systemDefinitionRef, /.+/);
});

test("TASK-435 factory:bootstrap is a supported thin command over the bootstrap entrypoint", () => {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-bootstrap-"));
  try {
    const inputPath = join(directory, "bootstrap.json");
    writeFileSync(inputPath, JSON.stringify(bootstrapInput(inputPath)), "utf8");

    const direct = execFileSync(process.execPath, ["--import", "tsx", cliPath, "--input", inputPath], {
      cwd: repositoryRoot,
      encoding: "utf8",
    });
    const viaNpm = execFileSync("npm", ["run", "--silent", "factory:bootstrap", "--", "--input", inputPath], {
      cwd: repositoryRoot,
      encoding: "utf8",
    });

    assert.deepEqual(JSON.parse(String(viaNpm)), JSON.parse(String(direct)));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("TASK-436 operator bootstrap emits deterministic evidence derived from canonical completed stages", () => {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-bootstrap-progress-"));
  try {
    const inputPath = join(directory, "bootstrap.json");
    writeFileSync(inputPath, JSON.stringify(bootstrapInput(inputPath)), "utf8");

    const first = runCommand(inputPath);
    const second = runCommand(inputPath);
    assert.equal(first.status, 0);
    assert.equal(second.status, 0);
    assert.equal(String(first.stderr), "");
    assert.equal(String(second.stderr), "");
    assert.equal(String(first.stdout), String(second.stdout), "same clean input must produce byte-identical operator evidence");

    const envelope = JSON.parse(String(first.stdout)) as {
      ok: boolean;
      progress: { status: string; stages: Array<{ kind: string; status: string; identityRef: string; provenanceRef: string }> };
    };
    assert.equal(envelope.ok, true);
    assert.equal(envelope.progress.status, "succeeded");
    assert.deepEqual(
      envelope.progress.stages.map(({ kind, status }) => ({ kind, status })),
      [
        { kind: "approved-process", status: "completed" },
        { kind: "analysis-definition", status: "completed" },
        { kind: "capability-assembly", status: "completed" },
        { kind: "validation", status: "completed" },
        { kind: "compiler-release", status: "completed" },
        { kind: "deployment", status: "completed" },
      ],
    );
    for (const stage of envelope.progress.stages) {
      assert.match(stage.identityRef, /.+/);
      assert.match(stage.provenanceRef, /.+/);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("TASK-436 stale predecessor rejection never emits downstream completion evidence", () => {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-bootstrap-stale-"));
  try {
    const inputPath = join(directory, "bootstrap.json");
    const stale = bootstrapInput(inputPath);
    const rawFactoryInput = stale.factoryInput as { journeyBinding: { journey: { stages: Array<{ provenanceRef: string }> } } };
    rawFactoryInput.journeyBinding.journey.stages[2]!.provenanceRef = "system-definition:orders:stale";
    writeFileSync(inputPath, JSON.stringify(stale), "utf8");

    const rejected = runCommand(inputPath);
    assert.notEqual(rejected.status, 0);
    assert.equal(String(rejected.stdout), "", "rejected predecessor must not emit a success/progress envelope");
    assert.doesNotMatch(String(rejected.stderr), /"status":"completed"/);
    assert.match(String(rejected.stderr), /capability-assembly predecessor does not match canonical system-definition identity/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

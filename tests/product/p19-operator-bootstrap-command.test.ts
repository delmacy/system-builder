import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import {
  FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
  validateFactoryOperatorBootstrap,
} from "../../packages/contracts/factory-boundary/index.js";

const repositoryRoot = resolve(process.cwd());
const cliPath = join(repositoryRoot, "scripts/factory-operator-bootstrap.ts");
const fixturePath = join(repositoryRoot, "tests/fixtures/p19/factory-e2e-success.json");

function factoryInput(): Record<string, unknown> {
  return JSON.parse(readFileSync(fixturePath, "utf8")) as Record<string, unknown>;
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
  const parsed = validateFactoryOperatorBootstrap(bootstrapInput("fixture://operator-bootstrap"));
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
        { kind: "process-model", status: "completed" },
        { kind: "system-definition", status: "completed" },
        { kind: "capability-assembly", status: "completed" },
        { kind: "validation", status: "completed" },
        { kind: "release", status: "completed" },
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
    assert.doesNotMatch(String(rejected.stderr), /\"status\":\"completed\"/);
    assert.match(String(rejected.stderr), /capability-assembly predecessor does not match canonical system-definition identity/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

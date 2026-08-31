import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import {
  parseFactoryOperatorBootstrapInput,
  type FactoryOperatorBootstrapInput,
} from "../../packages/core/src/index.ts";

const repositoryRoot = resolve(import.meta.dirname, "../..");
const cliPath = join(repositoryRoot, "tooling/factory/operator-bootstrap-cli.ts");
const fixturePath = join(repositoryRoot, "tests/fixtures/p19/factory-e2e-success.json");

type CommandResult = ReturnType<typeof spawnSync>;

function fixture(): FactoryOperatorBootstrapInput["factoryInput"] {
  return JSON.parse(readFileSync(fixturePath, "utf8")) as FactoryOperatorBootstrapInput["factoryInput"];
}

function bootstrapInput(inputPath: string): FactoryOperatorBootstrapInput {
  return {
    schemaVersion: "system-builder.factory-operator-bootstrap/v1",
    factoryInput: fixture(),
    sourceRef: inputPath,
  };
}

function runCommand(inputPath: string): CommandResult {
  return spawnSync(process.execPath, ["--import", "tsx", cliPath, inputPath], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
}

test("TASK-434 operator bootstrap contract validates prerequisites without duplicating factory orchestration", () => {
  const input = bootstrapInput("fixture://operator-bootstrap");
  const parsed = parseFactoryOperatorBootstrapInput(input);

  assert.equal(parsed.schemaVersion, "system-builder.factory-operator-bootstrap/v1");
  assert.equal(parsed.factoryInput.schemaVersion, "system-builder.factory-e2e-input/v1");
  assert.equal(parsed.factoryInput.journeyBinding.schemaVersion, "system-builder.factory-journey-binding/v1");
});

test("TASK-434 operator bootstrap rejects missing canonical predecessor identity", () => {
  const input = bootstrapInput("fixture://operator-bootstrap");
  input.factoryInput.journeyBinding.journey.systemDefinitionRef = "";

  assert.throws(
    () => parseFactoryOperatorBootstrapInput(input),
    /systemDefinitionRef must be a non-empty string/,
  );
});

test("TASK-435 factory:bootstrap is a supported thin command over the canonical factory:e2e executor", () => {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-bootstrap-"));
  try {
    const inputPath = join(directory, "bootstrap.json");
    writeFileSync(inputPath, JSON.stringify(bootstrapInput(inputPath)), "utf8");

    const direct = execFileSync(process.execPath, ["--import", "tsx", cliPath, inputPath], {
      cwd: repositoryRoot,
      encoding: "utf8",
    });
    const viaNpm = execFileSync("npm", ["run", "--silent", "factory:bootstrap", "--", inputPath], {
      cwd: repositoryRoot,
      encoding: "utf8",
    });

    assert.deepEqual(JSON.parse(viaNpm), JSON.parse(direct));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("TASK-435 factory:bootstrap fails closed before delegation for invalid bootstrap input", () => {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-bootstrap-invalid-"));
  try {
    const inputPath = join(directory, "bootstrap.json");
    const invalid = bootstrapInput(inputPath);
    invalid.factoryInput.journeyBinding.journey.systemDefinitionRef = "";
    writeFileSync(inputPath, JSON.stringify(invalid), "utf8");

    const rejected = runCommand(inputPath);
    assert.notEqual(rejected.status, 0);
    assert.equal(rejected.stdout, "");
    assert.match(rejected.stderr, /systemDefinitionRef must be a non-empty string/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("TASK-436 operator bootstrap emits deterministic maintainer progress/result evidence from canonical stages", () => {
  const directory = mkdtempSync(join(tmpdir(), "system-builder-p19-bootstrap-progress-"));
  try {
    const inputPath = join(directory, "bootstrap.json");
    writeFileSync(inputPath, JSON.stringify(bootstrapInput(inputPath)), "utf8");

    const first = runCommand(inputPath);
    const second = runCommand(inputPath);
    assert.equal(first.status, 0);
    assert.equal(second.status, 0);
    assert.equal(first.stderr, "");
    assert.equal(second.stderr, "");
    assert.equal(first.stdout, second.stdout, "same clean input must produce byte-identical operator evidence");

    const envelope = JSON.parse(first.stdout) as {
      schemaVersion: string;
      status: string;
      sourceRef: string;
      progress: Array<{ stage: string; status: string; outputRef: string }>;
      result: { factoryJourneyRef: string; releaseRef: string; deploymentRef: string };
    };
    assert.equal(envelope.schemaVersion, "system-builder.factory-operator-bootstrap-result/v1");
    assert.equal(envelope.status, "completed");
    assert.equal(envelope.sourceRef, inputPath);
    assert.deepEqual(
      envelope.progress.map(({ stage, status }) => ({ stage, status })),
      [
        { stage: "process-model", status: "completed" },
        { stage: "system-definition", status: "completed" },
        { stage: "capability-assembly", status: "completed" },
        { stage: "validation", status: "completed" },
        { stage: "release", status: "completed" },
        { stage: "deployment", status: "completed" },
      ],
    );
    assert.equal(envelope.result.factoryJourneyRef, envelope.progress[5]!.outputRef);
    assert.equal(envelope.result.releaseRef, envelope.progress[4]!.outputRef);
    assert.equal(envelope.result.deploymentRef, envelope.progress[5]!.outputRef);
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
    assert.doesNotMatch(rejected.stderr, /"status":"completed"/);
    assert.match(rejected.stderr, /capability-assembly predecessor does not match canonical system-definition identity/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
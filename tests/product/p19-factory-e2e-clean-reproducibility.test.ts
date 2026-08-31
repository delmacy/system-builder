import assert from "node:assert/strict";
import { copyFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const fixturePath = resolve("packages/contracts/factory-boundary/fixtures/factory-e2e.clean.json");

type CommandEnvelope = Readonly<{
  ok: boolean;
  result: Readonly<{
    binding: Readonly<{
      input: Readonly<{
        journey: Readonly<{
          stages: readonly Readonly<{ kind: string; identityRef: string; provenanceRef: string }>[];
        }>;
      }>;
      references: Readonly<Record<string, string>>;
    }>;
    deploymentRecord: Readonly<{ publishedReleaseRef: string }>;
  }>;
}>;

function runCleanInvocation(directory: string): CommandEnvelope {
  const inputPath = join(directory, "factory-e2e.clean.json");
  copyFileSync(fixturePath, inputPath);
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(
    npm,
    ["run", "--silent", "factory:e2e", "--", "--input", inputPath],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  return JSON.parse(result.stdout.trim()) as CommandEnvelope;
}

test("independent clean factory E2E invocations reproduce exact canonical identity and provenance", () => {
  const firstDirectory = mkdtempSync(join(tmpdir(), "system-builder-p19-clean-a-"));
  const secondDirectory = mkdtempSync(join(tmpdir(), "system-builder-p19-clean-b-"));
  try {
    const first = runCleanInvocation(firstDirectory);
    const second = runCleanInvocation(secondDirectory);

    assert.equal(first.ok, true);
    assert.equal(second.ok, true);
    assert.deepEqual(first.result.binding.references, second.result.binding.references);
    assert.deepEqual(first.result.binding.input.journey.stages, second.result.binding.input.journey.stages);
    assert.equal(first.result.deploymentRecord.publishedReleaseRef, "orders-system@0.0.1");
    assert.equal(second.result.deploymentRecord.publishedReleaseRef, "orders-system@0.0.1");
    assert.equal(
      first.result.binding.input.journey.stages[5]?.provenanceRef,
      first.result.deploymentRecord.publishedReleaseRef,
    );
    assert.equal(
      second.result.binding.input.journey.stages[5]?.provenanceRef,
      second.result.deploymentRecord.publishedReleaseRef,
    );
  } finally {
    rmSync(firstDirectory, { recursive: true, force: true });
    rmSync(secondDirectory, { recursive: true, force: true });
  }
});

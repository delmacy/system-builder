import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";

describe("AgentFactory Windows child process isolation", () => {
  it("keeps direct git and GitHub CLI subprocesses hidden", () => {
    const source = readFileSync(resolve(process.cwd(), "tooling/agent-harness/src/git-workflow.ts"), "utf8");

    assert.match(source, /spawnSync\(executable, \["--version"\], \{[^}]*windowsHide: true[^}]*\}\)/s);
    assert.match(source, /spawnSync\(executable, \["auth", "status"\], \{[^}]*windowsHide: true[^}]*\}\)/s);
    assert.match(source, /spawnSync\("git", args, \{[^}]*windowsHide: true[^}]*\}\)/s);
    assert.match(source, /execFileSync\(executable, args, \{[^}]*windowsHide: true[^}]*\}\)/s);
  });
});

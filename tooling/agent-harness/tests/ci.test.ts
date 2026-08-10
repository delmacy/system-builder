import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import YAML from "yaml";

describe("pull request CI", () => {
  it("runs only locked install and deterministic verification", () => {
    const source = readFileSync(".github/workflows/ci.yml", "utf8");
    const workflow = YAML.parse(source) as {
      permissions: { contents: string };
      jobs: { validate: { steps: Array<{ run?: string }> } };
    };
    const commands = workflow.jobs.validate.steps.flatMap((step) => step.run ? [step.run] : []);
    assert.deepEqual(commands, ["npm ci", "npm run verify"]);
    assert.equal(workflow.permissions.contents, "read");
    assert.doesNotMatch(source, /opencode|agent runner|model provider|openrouter/i);
  });
});

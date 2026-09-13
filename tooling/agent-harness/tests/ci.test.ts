import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import YAML from "yaml";

type WorkflowStep = {
  name?: string;
  run?: string;
  uses?: string;
  with?: Record<string, unknown>;
  env?: Record<string, string>;
};

describe("pull request CI", () => {
  it("binds deterministic verification to the exact PR head", () => {
    const source = readFileSync(".github/workflows/ci.yml", "utf8");
    const workflow = YAML.parse(source) as {
      permissions: { contents: string };
      jobs: { "exact-head": { steps: WorkflowStep[] } };
    };
    const steps = workflow.jobs["exact-head"].steps;

    const checkout = steps.find((step) => step.name === "Checkout exact PR head");
    assert.ok(checkout);
    assert.equal(checkout.uses, "actions/checkout@v7");
    assert.equal(checkout.with?.["fetch-depth"], 0);
    assert.equal(checkout.with?.["persist-credentials"], false);
    assert.equal(checkout.with?.ref, "${{ github.event.pull_request.head.sha }}");

    const identity = steps.find((step) => step.name === "Assert exact PR head identity");
    assert.ok(identity);
    assert.equal(identity.env?.EXPECTED_SHA, "${{ github.event.pull_request.head.sha }}");
    assert.equal(identity.run, 'test "$(git rev-parse HEAD)" = "$EXPECTED_SHA"');

    const commands = steps.flatMap((step) => step.run ? [step.run] : []);
    assert.deepEqual(commands, [
      'test "$(git rev-parse HEAD)" = "$EXPECTED_SHA"',
      "npm ci",
      "npm run verify",
    ]);
    assert.equal(workflow.permissions.contents, "read");
    assert.doesNotMatch(source, /opencode|agent runner|model provider|openrouter/i);
  });
});

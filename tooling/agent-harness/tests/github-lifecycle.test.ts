import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateGitHubLifecycle, type GitHubLifecycleInput } from "../src/github-lifecycle.js";
import { deriveGitHubLifecycleObservation } from "../src/orchestrator-runtime.js";

const commit = "a".repeat(40);
const base: GitHubLifecycleInput = {
  prNumber: 20,
  state: "OPEN",
  branch: "task/020",
  baseBranch: "main",
  headCommit: commit,
  expectedBranch: "task/020",
  expectedBaseBranch: "main",
  expectedHeadCommit: commit,
  requiredChecks: ["validate"],
  checks: [{ name: "validate", status: "SUCCESS" }],
  validation: "PASS",
  review: "APPROVED",
  reviewRequired: true,
};

describe("AgentFactory GitHub lifecycle", () => {
  it("is eligible only with matching identity, named checks, validation and review", () => {
    const first = evaluateGitHubLifecycle(base);
    const repeated = evaluateGitHubLifecycle({ ...base, checks: [...base.checks] });
    assert.equal(first.decision, "ELIGIBLE");
    assert.deepEqual(repeated, first);
  });

  it("blocks a missing or failed required check with stable reasons", () => {
    assert.deepEqual(evaluateGitHubLifecycle({ ...base, checks: [] }).reason_codes, ["CHECK_MISSING"]);
    assert.deepEqual(
      evaluateGitHubLifecycle({ ...base, checks: [{ name: "validate", status: "FAILURE" }] }).reason_codes,
      ["CHECK_FAILED"],
    );
  });

  it("keeps a pending required check pending", () => {
    const receipt = evaluateGitHubLifecycle({ ...base, checks: [{ name: "validate", status: "PENDING" }] });
    assert.equal(receipt.decision, "PENDING");
    assert.deepEqual(receipt.reason_codes, ["CHECK_PENDING"]);
  });

  it("blocks branch, base or head identity mismatch", () => {
    for (const changed of [
      { branch: "task/other" },
      { baseBranch: "develop" },
      { headCommit: "b".repeat(40) },
    ]) {
      assert.deepEqual(evaluateGitHubLifecycle({ ...base, ...changed }).reason_codes, ["IDENTITY_MISMATCH"]);
    }
  });

  it("requires approval when independent validation requests review", () => {
    const receipt = evaluateGitHubLifecycle({ ...base, validation: "REVIEW_REQUIRED", review: "NONE" });
    assert.equal(receipt.decision, "REVIEW_REQUIRED");
    assert.deepEqual(receipt.reason_codes, ["VALIDATION_REVIEW_REQUIRED", "REVIEW_MISSING"]);
  });

  it("fails closed for unknown observations and closed unmerged PRs", () => {
    assert.deepEqual(evaluateGitHubLifecycle({ ...base, state: "UNKNOWN" }).reason_codes, ["PR_UNKNOWN"]);
    assert.deepEqual(evaluateGitHubLifecycle({ ...base, state: "CLOSED" }).reason_codes, ["PR_CLOSED"]);
    assert.deepEqual(evaluateGitHubLifecycle({ ...base, review: "UNKNOWN" }).reason_codes, ["REVIEW_UNKNOWN"]);
  });

  it("binds the hardened receipt to the orchestrator observation", () => {
    const observation = deriveGitHubLifecycleObservation({
      number: 20,
      url: "https://example.test/pull/20",
      state: "OPEN",
      headRefName: "task/020",
      baseRefName: "main",
      headRefOid: commit,
      reviewDecision: "APPROVED",
      mergeCommit: null,
      statusCheckRollup: [{ name: "validate", status: "COMPLETED", conclusion: "SUCCESS" }],
    }, {
      branch: "task/020",
      baseBranch: "main",
      headCommit: commit,
      requiredChecks: ["validate"],
      validation: "PASS",
      reviewRequired: true,
    });
    assert.equal(observation.ci, "SUCCESS");
    assert.equal(observation.lifecycle?.decision, "ELIGIBLE");
  });
});

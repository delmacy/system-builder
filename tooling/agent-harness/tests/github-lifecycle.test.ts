import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateGitHubLifecycle, type GitHubLifecycleInput } from "../src/github-lifecycle.js";
import { deriveGitHubLifecycleObservation, deriveStateGitHubLifecycleObservation } from "../src/orchestrator-runtime.js";

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

  it("binds state-closure observations to the recorded branch, main and commit", () => {
    const pr = {
      number: 21,
      url: "https://example.test/pull/21",
      state: "OPEN",
      headRefName: "state/task-020-close",
      baseRefName: "main",
      headRefOid: commit,
      reviewDecision: "APPROVED",
      mergeCommit: null,
      statusCheckRollup: [{ name: "validate", status: "COMPLETED", conclusion: "SUCCESS" }],
    };
    const expected = { branch: "state/task-020-close", headCommit: commit, requiredChecks: ["validate"], reviewRequired: true };
    const accepted = deriveStateGitHubLifecycleObservation(pr, expected);
    assert.equal(accepted.lifecycle?.decision, "ELIGIBLE");
    assert.equal(accepted.ci, "SUCCESS");

    for (const mismatch of [
      { headRefName: "state/task-999-close" },
      { baseRefName: "develop" },
      { headRefOid: "b".repeat(40) },
    ]) {
      const rejected = deriveStateGitHubLifecycleObservation({ ...pr, ...mismatch }, expected);
      assert.equal(rejected.lifecycle?.decision, "BLOCKED");
      assert.deepEqual(rejected.lifecycle?.reason_codes, ["IDENTITY_MISMATCH"]);
      assert.equal(rejected.ci, "FAILURE");
    }
  });

  it("keeps state-closure named checks and review fail closed", () => {
    const pr = {
      number: 21,
      url: "https://example.test/pull/21",
      state: "OPEN",
      headRefName: "state/task-020-close",
      baseRefName: "main",
      headRefOid: commit,
      reviewDecision: "",
      mergeCommit: null,
      statusCheckRollup: [],
    };
    const observation = deriveStateGitHubLifecycleObservation(pr, {
      branch: "state/task-020-close", headCommit: commit, requiredChecks: ["validate"], reviewRequired: true,
    });
    assert.equal(observation.lifecycle?.decision, "BLOCKED");
    assert.deepEqual(observation.lifecycle?.reason_codes, ["CHECK_MISSING", "REVIEW_MISSING"]);
  });

  it("accepts valid durable approval in lieu of a missing GitHub review", () => {
    const receipt = evaluateGitHubLifecycle({ ...base, review: "NONE", humanApproval: { decision: "VALID", approval_id: `HAPR-${"b".repeat(64)}`, reason_codes: [] } });
    assert.equal(receipt.decision, "ELIGIBLE");
    assert.equal(receipt.review, "NONE");
    assert.equal(receipt.approval_channel, "DURABLE_HUMAN_APPROVAL");
  });

  it("never lets durable approval override required CI", () => {
    const receipt = evaluateGitHubLifecycle({ ...base, review: "NONE", checks: [], humanApproval: { decision: "VALID", approval_id: `HAPR-${"b".repeat(64)}`, reason_codes: [] } });
    assert.equal(receipt.decision, "BLOCKED");
    assert.ok(receipt.reason_codes.includes("CHECK_MISSING"));
  });

  it("does not infer approval for a historical merge", () => {
    const receipt = evaluateGitHubLifecycle({ ...base, state: "MERGED", review: "NONE" });
    assert.equal(receipt.decision, "REVIEW_REQUIRED");
    assert.equal(receipt.approval_channel, "NONE");
  });
});

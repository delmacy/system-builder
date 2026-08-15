import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { evaluateGitHubLifecycle, type GitHubLifecycleInput } from "../src/github-lifecycle.js";
import { evaluateStoredHumanApproval } from "../src/human-approval.js";

const commit = "a".repeat(40);
const policy = {
  schema_version: 1 as const,
  policy_version: "1.1.0",
  mode: "DEVELOPMENT_TRUSTED" as const,
  repository: "delmacy/system-builder",
  max_age_seconds: 604800,
  receipt_directory_env: "SYSTEM_BUILDER_HUMAN_APPROVAL_DIR",
  authorized_approvers: [],
};

function rootWithPolicy(): string {
  const root = mkdtempSync(join(tmpdir(), "development-trusted-"));
  const directory = join(root, "tooling/agent-harness/policies");
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "HUMAN_APPROVAL.json"), JSON.stringify(policy));
  return root;
}

function authority(risk: "low" | "medium" | "high", architectureImpact: boolean) {
  return evaluateStoredHumanApproval(rootWithPolicy(), {
    repository: "delmacy/system-builder",
    taskId: "TASK-044",
    risk,
    architectureImpact,
    prNumber: 130,
    baseRef: "main",
    headRef: "task/044-development-trusted-authority-mode",
    headSha: commit,
    observedAt: "2026-08-15T06:00:00.000Z",
  });
}

function lifecycle(humanApproval: ReturnType<typeof authority>, changes: Partial<GitHubLifecycleInput> = {}) {
  const base: GitHubLifecycleInput = {
    prNumber: 130,
    state: "MERGED",
    branch: "task/044-development-trusted-authority-mode",
    baseBranch: "main",
    headCommit: commit,
    expectedBranch: "task/044-development-trusted-authority-mode",
    expectedBaseBranch: "main",
    expectedHeadCommit: commit,
    requiredChecks: ["validate"],
    checks: [{ name: "validate", status: "SUCCESS" }],
    validation: "PASS",
    review: "NONE",
    reviewRequired: true,
    humanApproval,
  };
  return evaluateGitHubLifecycle({ ...base, ...changes });
}

describe("development trusted authority", () => {
  it("trusts low and medium non-architecture work without a receipt store", () => {
    assert.equal(authority("low", false).decision, "DEVELOPMENT_TRUSTED");
    assert.equal(authority("medium", false).decision, "DEVELOPMENT_TRUSTED");
  });

  it("does not trust high-risk or architecture-impact work", () => {
    assert.equal(authority("high", false).decision, "MISSING");
    assert.equal(authority("medium", true).decision, "MISSING");
  });

  it("records a distinct development authority channel and permits historical merged PR closure", () => {
    const receipt = lifecycle(authority("medium", false));
    assert.equal(receipt.decision, "ELIGIBLE");
    assert.equal(receipt.approval_channel, "DEVELOPMENT_TRUSTED");
    assert.equal(receipt.human_approval?.decision, "DEVELOPMENT_TRUSTED");
    assert.equal(receipt.human_approval?.approval_id, null);
  });

  it("never lets development trust override missing or failed required CI", () => {
    assert.equal(lifecycle(authority("medium", false), { checks: [] }).decision, "BLOCKED");
    assert.equal(lifecycle(authority("medium", false), { checks: [{ name: "validate", status: "FAILURE" }] }).decision, "BLOCKED");
  });

  it("never lets development trust override failed validation, identity mismatch or requested changes", () => {
    assert.equal(lifecycle(authority("medium", false), { validation: "FAIL" }).decision, "BLOCKED");
    assert.equal(lifecycle(authority("medium", false), { headCommit: "b".repeat(40) }).decision, "BLOCKED");
    assert.equal(lifecycle(authority("medium", false), { review: "CHANGES_REQUESTED" }).decision, "BLOCKED");
  });

  it("keeps protected work at the review gate", () => {
    const high = lifecycle(authority("high", false));
    const architecture = lifecycle(authority("medium", true));
    assert.equal(high.decision, "REVIEW_REQUIRED");
    assert.equal(architecture.decision, "REVIEW_REQUIRED");
    assert.equal(high.approval_channel, "NONE");
    assert.equal(architecture.approval_channel, "NONE");
  });
});

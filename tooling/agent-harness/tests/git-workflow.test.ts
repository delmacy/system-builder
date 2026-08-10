import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  assertGitHubCli,
  assertGitManagedCloseReady,
  branchTask,
  buildPullRequestBody,
  buildPushArgs,
  commitStateTask,
  commitTask,
  createStateTaskBranch,
  pushStateTask,
  readGitRecord,
  readStateRecord,
  taskBranchName,
  taskGitStatus,
} from "../src/git-workflow.js";
import { prepareTask, verifyTask } from "../src/harness.js";
import { loadTasks } from "../src/task.js";

describe("Git task workflow", () => {
  it("derives a safe deterministic branch from task ID and title", () => {
    const fixture = createRepository();
    const task = loadTasks(fixture.root).find((item) => item.metadata.id === "TASK-010");
    assert.ok(task);
    assert.equal(taskBranchName(task), "task/010-create-example-output");
  });

  it("rejects a dirty main and refuses task branch creation outside main", () => {
    const dirty = createRepository();
    writeFileSync(join(dirty.root, "dirty.txt"), "dirty\n");
    assert.throws(() => branchTask("TASK-010", dirty.root), /Working tree must be clean/);

    const wrongBranch = createRepository();
    git(wrongBranch.root, ["switch", "-c", "dev"]);
    assert.throws(() => branchTask("TASK-010", wrongBranch.root), /must run from main/);
  });

  it("creates and records a task branch without overwriting refs", () => {
    const fixture = createRepository();
    const record = branchTask("TASK-010", fixture.root);
    assert.equal(record.branch, "task/010-create-example-output");
    assert.equal(git(fixture.root, ["branch", "--show-current"]), record.branch);
    assert.deepEqual(readGitRecord("TASK-010", fixture.root), record);
    git(fixture.root, ["switch", "main"]);
    assert.throws(() => branchTask("TASK-010", fixture.root), /Refusing to overwrite/);
  });

  it("refuses a task branch that exists only on the remote", () => {
    const fixture = createRepository();
    const peer = join(fixture.root, "..", "remote-branch-peer");
    git(join(fixture.root, ".."), ["clone", fixture.remote, peer]);
    git(peer, ["switch", "-c", "task/010-create-example-output", "origin/main"]);
    git(peer, ["push", "origin", "task/010-create-example-output"]);
    assert.throws(() => branchTask("TASK-010", fixture.root), /Refusing to overwrite/);
  });

  it("detects ahead state against the task remote", () => {
    const fixture = createRepository();
    const record = branchTask("TASK-010", fixture.root);
    writeFileSync(join(fixture.root, "first.txt"), "first\n");
    git(fixture.root, ["add", "first.txt"]);
    git(fixture.root, ["commit", "-m", "first"]);
    git(fixture.root, ["push", "--set-upstream", "origin", record.branch]);
    writeFileSync(join(fixture.root, "second.txt"), "second\n");
    git(fixture.root, ["add", "second.txt"]);
    git(fixture.root, ["commit", "-m", "second"]);
    const status = taskGitStatus("TASK-010", fixture.root);
    assert.equal(status.aheadOfOrigin, 1);
    assert.equal(status.behindOrigin, 0);
  });

  it("detects behind state after another checkout advances the remote", () => {
    const fixture = createRepository();
    const record = branchTask("TASK-010", fixture.root);
    writeFileSync(join(fixture.root, "first.txt"), "first\n");
    git(fixture.root, ["add", "first.txt"]);
    git(fixture.root, ["commit", "-m", "first"]);
    git(fixture.root, ["push", "--set-upstream", "origin", record.branch]);

    const peer = join(fixture.root, "..", "peer");
    git(join(fixture.root, ".."), ["clone", fixture.remote, peer]);
    git(peer, ["config", "user.name", "Peer"]);
    git(peer, ["config", "user.email", "peer@example.invalid"]);
    git(peer, ["switch", record.branch]);
    writeFileSync(join(peer, "remote.txt"), "remote\n");
    git(peer, ["add", "remote.txt"]);
    git(peer, ["commit", "-m", "remote"]);
    git(peer, ["push", "origin", record.branch]);
    git(fixture.root, ["fetch", "origin", record.branch]);

    const status = taskGitStatus("TASK-010", fixture.root);
    assert.equal(status.aheadOfOrigin, 0);
    assert.equal(status.behindOrigin, 1);
  });

  it("commits exactly the verified change with the standard message", () => {
    const fixture = createRepository();
    branchTask("TASK-010", fixture.root);
    prepareTask("TASK-010", fixture.root);
    mkdirSync(join(fixture.root, "docs"), { recursive: true });
    writeFileSync(join(fixture.root, "docs/out.md"), "verified output\n");
    verifyTask("TASK-010", fixture.root);
    const commit = commitTask("TASK-010", fixture.root);
    assert.equal(commit, git(fixture.root, ["rev-parse", "HEAD"]));
    assert.equal(git(fixture.root, ["log", "-1", "--format=%s"]), "TASK-010: create example output");
    assert.equal(git(fixture.root, ["show", "--format=", "--name-only", "HEAD"]), "docs/out.md");
    assert.equal(readGitRecord("TASK-010", fixture.root)?.commit, commit);
  });

  it("rejects changes made after verification", () => {
    const fixture = createRepository();
    branchTask("TASK-010", fixture.root);
    prepareTask("TASK-010", fixture.root);
    mkdirSync(join(fixture.root, "docs"), { recursive: true });
    writeFileSync(join(fixture.root, "docs/out.md"), "verified output\n");
    verifyTask("TASK-010", fixture.root);
    writeFileSync(join(fixture.root, "docs/out.md"), "changed after verify\n");
    assert.throws(() => commitTask("TASK-010", fixture.root), /content changed after verification/);
  });

  it("rejects commit on main and a modified Task Pack", () => {
    const onMain = createRepository();
    branchTask("TASK-010", onMain.root);
    prepareTask("TASK-010", onMain.root);
    mkdirSync(join(onMain.root, "docs"), { recursive: true });
    writeFileSync(join(onMain.root, "docs/out.md"), "verified output\n");
    verifyTask("TASK-010", onMain.root);
    git(onMain.root, ["switch", "main"]);
    assert.throws(() => commitTask("TASK-010", onMain.root), /forbidden on main/);

    const changedPack = createRepository();
    branchTask("TASK-010", changedPack.root);
    prepareTask("TASK-010", changedPack.root);
    mkdirSync(join(changedPack.root, "docs"), { recursive: true });
    writeFileSync(join(changedPack.root, "docs/out.md"), "verified output\n");
    verifyTask("TASK-010", changedPack.root);
    writeFileSync(join(changedPack.root, ".agent/context/TASK-010/TASK_PACK.md"), "tampered\n");
    assert.throws(() => commitTask("TASK-010", changedPack.root), /Task Pack changed/);
  });

  it("never constructs force-push arguments", () => {
    for (const args of [buildPushArgs("task/010-example", false), buildPushArgs("task/010-example", true)]) {
      assert.equal(args.some((arg) => arg === "--force" || arg === "-f" || arg === "--force-with-lease"), false);
    }
  });

  it("keeps executor output inside the declared task scope", () => {
    const fixture = createRepository();
    branchTask("TASK-010", fixture.root);
    prepareTask("TASK-010", fixture.root);
    mkdirSync(join(fixture.root, "docs"), { recursive: true });
    writeFileSync(join(fixture.root, "docs/out.md"), "allowed\n");
    writeFileSync(join(fixture.root, "outside.txt"), "not allowed\n");
    assert.throws(() => verifyTask("TASK-010", fixture.root), /Outside allowed paths.*outside\.txt/s);
  });

  it("delivers exactly the durable closure files on a dedicated state branch", () => {
    const fixture = createRepository();
    const taskPath = join(fixture.root, "specs/tasks/TASK-010.md");
    writeFileSync(taskPath, taskSource("TASK-010", "Create Example Output", "completed", 10, ["TASK-000"], ["specs/tasks/TASK-010.md"]));
    mkdirSync(join(fixture.root, "docs/evidence/tasks"), { recursive: true });
    mkdirSync(join(fixture.root, "docs/current"), { recursive: true });
    writeFileSync(join(fixture.root, "docs/evidence/tasks/TASK-010.json"), "{}\n");
    writeFileSync(join(fixture.root, "docs/current/TASK_LEDGER.json"), "{}\n");

    const state = createStateTaskBranch("TASK-010", fixture.root);
    assert.equal(state.branch, "state/task-010-close");
    const commit = commitStateTask("TASK-010", fixture.root);
    assert.equal(commit, git(fixture.root, ["rev-parse", "HEAD"]));
    assert.deepEqual(git(fixture.root, ["show", "--format=", "--name-only", "HEAD"]).split(/\r?\n/).sort(), [
      "docs/current/TASK_LEDGER.json",
      "docs/evidence/tasks/TASK-010.json",
      "specs/tasks/TASK-010.md",
    ]);
    assert.equal(pushStateTask("TASK-010", fixture.root), commit);
    assert.equal(readStateRecord("TASK-010", fixture.root)?.pushed, true);
  });

  it("rejects Git-managed closure from the task branch", () => {
    const fixture = createRepository();
    branchTask("TASK-010", fixture.root);
    const task = loadTasks(fixture.root).find((item) => item.metadata.id === "TASK-010");
    assert.ok(task);
    assert.throws(() => assertGitManagedCloseReady(task, {
      taskId: "TASK-010",
      baseCommit: "a".repeat(40),
      headCommit: "a".repeat(40),
      changedFiles: [],
      taskHash: "hash",
      status: "passed",
    }, fixture.root, "definitely-not-gh"), /must run from main after merge/);
  });

  it("generates an auditable PR body", () => {
    const fixture = createRepository();
    const task = loadTasks(fixture.root).find((item) => item.metadata.id === "TASK-010");
    assert.ok(task);
    const body = buildPullRequestBody(task, {
      version: 1,
      taskId: "TASK-010",
      branch: "task/010-create-example-output",
      baseBranch: "main",
      baseCommit: "a".repeat(40),
      remote: "origin",
      createdAt: "2026-08-10T00:00:00.000Z",
      commit: "b".repeat(40),
    }, {
      taskId: "TASK-010",
      baseCommit: "a".repeat(40),
      headCommit: "a".repeat(40),
      changedFiles: ["docs/out.md"],
      taskHash: "hash",
      packHash: "pack",
      status: "passed",
    });
    assert.match(body, /TASK-010/);
    assert.match(body, /docs\/out\.md/);
    assert.match(body, /git --version/);
    assert.match(body, /Automatic merge is disabled/);
  });

  it("fails clearly when GitHub CLI is unavailable", () => {
    assert.throws(
      () => assertGitHubCli("definitely-not-a-real-gh-executable", process.cwd(), "task/010-example"),
      /GitHub CLI is unavailable.*open manually/s,
    );
  });
});

function createRepository(): { root: string; remote: string } {
  const container = mkdtempSync(join(tmpdir(), "sb-git-workflow-"));
  const root = join(container, "work");
  const remote = join(container, "remote.git");
  mkdirSync(root);
  git(container, ["init", "--bare", remote]);
  git(root, ["init", "-b", "main"]);
  git(root, ["config", "user.name", "Harness Test"]);
  git(root, ["config", "user.email", "harness@example.invalid"]);
  mkdirSync(join(root, "specs/tasks"), { recursive: true });
  writeFileSync(join(root, "specs/tasks/TASK-000.md"), taskSource("TASK-000", "Foundation", "completed", 0, [], ["README.md"]));
  writeFileSync(join(root, "specs/tasks/TASK-010.md"), taskSource("TASK-010", "Create Example Output", "ready", 10, ["TASK-000"], ["specs/tasks/TASK-010.md"]));
  writeFileSync(join(root, "README.md"), "fixture\n");
  writeFileSync(join(root, ".gitignore"), ".agent/\n");
  git(root, ["add", "."]);
  git(root, ["commit", "-m", "fixture"]);
  git(root, ["remote", "add", "origin", remote]);
  git(root, ["push", "--set-upstream", "origin", "main"]);
  return { root, remote };
}

function taskSource(id: string, title: string, status: string, priority: number, dependencies: string[], context: string[]): string {
  const dependencyYaml = dependencies.length ? dependencies.map((item) => `\n  - ${item}`).join("") : " []";
  const contextYaml = context.map((item) => `\n  - ${item}`).join("");
  return `---
id: ${id}
title: ${title}
status: ${status}
priority: ${priority}
milestone: M-TEST
model_tier: free
risk: low
architecture_impact: false
executor_preference: any
depends_on:${dependencyYaml}
context_paths:${contextYaml}
allowed_paths:
  - docs/out.md
forbidden_paths:
  - .agent/**
max_files: 1
validation:
  - git --version
---

# ${id}

## Objective

Create deterministic output.

## Context

Test fixture.

## Current behavior

No output exists.

## Required change

Create the output.

## Inputs / contracts

The task.

## Outputs / contracts

One file.

## Acceptance criteria

The output exists.

## Non-goals

Anything else.

## Evidence expected

Validation receipt.

## Escalation

Stop on ambiguity.
`;
}

function git(root: string, args: string[]): string {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

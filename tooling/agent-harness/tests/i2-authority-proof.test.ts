import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, it } from "node:test";
import {
  proveFreshI2AuthorityReconciliation,
  task040FreshAuthorities,
  type FreshI2AuthorityExpectation,
} from "../src/i2-authority-proof.js";

const repoRoot = resolve(process.cwd());

function copyEvidence(root: string): void {
  const source = "docs/evidence/agentfactory/TASK-040";
  const destination = join(root, source);
  mkdirSync(destination, { recursive: true });
  for (const name of ["attempt-2-61371a1d2ff4b8b6849231d3d911fd4eb47d4fa9b95655b7567bb16413273abb.json",
    "attempt-2-f9128af638de659fb20dfa71c0722efbe09da2281e9e434d18bb9ed6a0b73a10.json",
    "governance-resolution.json", "ledger.json", "readiness.json", "manifest.json"]) {
    writeFileSync(join(destination, name), readFileSync(join(repoRoot, source, name)));
  }
  mkdirSync(join(root, "docs/evidence/tasks"), { recursive: true });
  mkdirSync(join(root, "docs/current"), { recursive: true });
  writeFileSync(join(root, "docs/evidence/tasks/TASK-040.json"), readFileSync(join(repoRoot, "docs/evidence/tasks/TASK-040.json")));
  writeFileSync(join(root, "docs/current/TASK_LEDGER.json"), readFileSync(join(repoRoot, "docs/current/TASK_LEDGER.json")));
}

function expectation(overrides: Partial<FreshI2AuthorityExpectation> = {}): FreshI2AuthorityExpectation {
  return { ...task040FreshAuthorities, ...overrides };
}

function failureIds(receipt: ReturnType<typeof proveFreshI2AuthorityReconciliation>): string[] {
  return receipt.checks.filter((check) => check.status === "FAIL").map((check) => check.id).sort();
}

describe("fresh real I2 authority reconciliation proof", () => {
  it("GO: reconciles the integrated TASK-040 repository files with the real PR closures", () => {
    const receipt = proveFreshI2AuthorityReconciliation({ root: repoRoot, expected: task040FreshAuthorities });
    assert.equal(receipt.decision, "GO");
    assert.equal(failureIds(receipt).length, 0);
    assert.equal(receipt.task_id, "TASK-040");
    assert.equal(receipt.work_package_id, "WP-I2-06");
    assert.equal(receipt.implementation_head, "97c2c8fd53b010078e46494a13b6c3f39647e48e");
    assert.equal(receipt.final_evidence_id, "AFEV-61371a1d2ff4b8b6849231d3d911fd4eb47d4fa9b95655b7567bb16413273abb");
    assert.equal(receipt.bundle_id, "AFCLOSE-2f4d08641b2aa6951fd12132349dfae21a35300586d04198cc8f2b894edec623");
    assert.equal(receipt.selected_task_id, null);
    assert.equal(receipt.facts.lifecycle.approval_channel, "DURABLE_HUMAN_APPROVAL");
    assert.equal(receipt.facts.causal_ledger.accepted, true);
    assert.equal(receipt.facts.causal_ledger.state, "DONE");
    assert.deepEqual(receipt.facts.readiness.current_ready, ["TASK-004"]);
    assert.equal(receipt.facts.governance.decision, "RESOLVED");
    assert.ok(receipt.facts.attempted_history.attempt_receipt_id.startsWith("AFATT-"));
  });

  it("proves reruns are byte-identical and never select or execute TASK-004", () => {
    const before = JSON.stringify(proveFreshI2AuthorityReconciliation({ root: repoRoot }));
    const after = JSON.stringify(proveFreshI2AuthorityReconciliation({ root: repoRoot }));
    assert.equal(after, before);
    const parse = (value: string): { decision: string; selected_task_id: null } => JSON.parse(value);
    assert.equal(parse(before).decision, "GO");
    assert.equal(parse(before).selected_task_id, null);
    assert.equal(parse(after).selected_task_id, null);
  });

  it("proves the proof reader performs no repository writes", () => {
    const git = (args: string[]): string => execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();
    const before = git(["status", "--porcelain"]);
    const receipt = proveFreshI2AuthorityReconciliation({ root: repoRoot });
    const after = git(["status", "--porcelain"]);
    assert.equal(after, before);
    assert.equal(receipt.decision, "GO");
  });

  it("NO-GO: a missing manifest file is fail-closed with a deterministic diagnostic", () => {
    const root = mkdtempSync(join(tmpdir(), "i2-proof-missing-"));
    copyEvidence(root);
    writeFileSync(join(root, "docs/evidence/agentfactory/TASK-040/ledger.json"), "");
    const receipt = proveFreshI2AuthorityReconciliation({ root });
    assert.equal(receipt.decision, "NO-GO");
    assert.ok(failureIds(receipt).includes("FILE_HASHES"));
  });

  it("NO-GO: a mutated evidence file is fail-closed", () => {
    const root = mkdtempSync(join(tmpdir(), "i2-proof-mutated-"));
    copyEvidence(root);
    const manifest = JSON.parse(readFileSync(join(root, "docs/evidence/agentfactory/TASK-040/manifest.json"), "utf8"));
    manifest.final_evidence_id = "AFEV-" + "a".repeat(64);
    writeFileSync(join(root, "docs/evidence/agentfactory/TASK-040/manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    const receipt = proveFreshI2AuthorityReconciliation({ root });
    assert.equal(receipt.decision, "NO-GO");
    assert.ok(failureIds(receipt).includes("MANIFEST_IDENTITY"));
  });

  it("NO-GO: wrong source identity is fail-closed", () => {
    const root = mkdtempSync(join(tmpdir(), "i2-proof-source-"));
    copyEvidence(root);
    const receipt = proveFreshI2AuthorityReconciliation({ root, expected: expectation({ source_commit: "b".repeat(40) }) });
    assert.equal(receipt.decision, "NO-GO");
    assert.ok(failureIds(receipt).includes("MANIFEST_IDENTITY"));
  });

  it("NO-GO: wrong task identity is fail-closed", () => {
    const root = mkdtempSync(join(tmpdir(), "i2-proof-wrong-task-"));
    copyEvidence(root);
    const manifest = JSON.parse(readFileSync(join(root, "docs/evidence/agentfactory/TASK-040/manifest.json"), "utf8"));
    manifest.task_id = "TASK-999";
    writeFileSync(join(root, "docs/evidence/agentfactory/TASK-040/manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    const receipt = proveFreshI2AuthorityReconciliation({ root });
    assert.equal(receipt.decision, "NO-GO");
    assert.ok(failureIds(receipt).includes("MANIFEST_IDENTITY"));
  });

  it("NO-GO: wrong implementation head/PR identity is fail-closed", () => {
    const root = mkdtempSync(join(tmpdir(), "i2-proof-wrong-implementation-"));
    copyEvidence(root);
    const manifest = JSON.parse(readFileSync(join(root, "docs/evidence/agentfactory/TASK-040/manifest.json"), "utf8"));
    manifest.implementation_head = "b".repeat(40);
    manifest.implementation_pr.head_commit = "b".repeat(40);
    writeFileSync(join(root, "docs/evidence/agentfactory/TASK-040/manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    const receipt = proveFreshI2AuthorityReconciliation({ root });
    assert.equal(receipt.decision, "NO-GO");
    assert.ok(failureIds(receipt).includes("MANIFEST_IDENTITY"));
  });

  it("NO-GO: wrong state PR/head/merge identity is fail-closed", () => {
    const root = mkdtempSync(join(tmpdir(), "i2-proof-wrong-state-"));
    copyEvidence(root);
    const receipt = proveFreshI2AuthorityReconciliation({
      root,
      expected: expectation({
        state_pr: {
          ...task040FreshAuthorities.state_pr,
          head_commit: "c".repeat(40),
          merge_commit: "d".repeat(40),
        },
      }),
    });
    assert.equal(receipt.decision, "NO-GO");
    assert.ok(failureIds(receipt).includes("STATE_PR_BINDING"));
  });

  it("NO-GO: a non-eligible lifecycle is fail-closed", () => {
    const root = mkdtempSync(join(tmpdir(), "i2-proof-lifecycle-"));
    copyEvidence(root);
    const manifest = JSON.parse(readFileSync(join(root, "docs/evidence/agentfactory/TASK-040/manifest.json"), "utf8"));
    manifest.implementation_pr.decision = "PENDING";
    manifest.implementation_pr.reason_codes = ["REVIEW_REQUIRED"];
    writeFileSync(join(root, "docs/evidence/agentfactory/TASK-040/manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    const receipt = proveFreshI2AuthorityReconciliation({ root });
    assert.equal(receipt.decision, "NO-GO");
    assert.ok(failureIds(receipt).includes("IMPLEMENTATION_LIFECYCLE"));
  });

  it("NO-GO: a rejected or divergent causal ledger is fail-closed", () => {
    const root = mkdtempSync(join(tmpdir(), "i2-proof-ledger-"));
    copyEvidence(root);
    const ledger = JSON.parse(readFileSync(join(root, "docs/evidence/agentfactory/TASK-040/ledger.json"), "utf8"));
    ledger.accepted = false;
    ledger.reason_codes = ["EVIDENCE_CAUSALITY_INVALID"];
    writeFileSync(join(root, "docs/evidence/agentfactory/TASK-040/ledger.json"), `${JSON.stringify(ledger, null, 2)}\n`);
    const receipt = proveFreshI2AuthorityReconciliation({ root });
    assert.equal(receipt.decision, "NO-GO");
    assert.ok(failureIds(receipt).includes("CAUSAL_LEDGER"));
  });

  it("NO-GO: inconsistent readiness is fail-closed", () => {
    const root = mkdtempSync(join(tmpdir(), "i2-proof-readiness-"));
    copyEvidence(root);
    const readiness = JSON.parse(readFileSync(join(root, "docs/evidence/agentfactory/TASK-040/readiness.json"), "utf8"));
    readiness.current_ready = ["TASK-040", "TASK-004"];
    writeFileSync(join(root, "docs/evidence/agentfactory/TASK-040/readiness.json"), `${JSON.stringify(readiness, null, 2)}\n`);
    const receipt = proveFreshI2AuthorityReconciliation({ root });
    assert.equal(receipt.decision, "NO-GO");
    assert.ok(failureIds(receipt).includes("READINESS"));
  });

  it("NO-GO: premature bootstrap state is fail-closed", () => {
    const root = mkdtempSync(join(tmpdir(), "i2-proof-bootstrap-"));
    copyEvidence(root);
    const ledger = JSON.parse(readFileSync(join(root, "docs/current/TASK_LEDGER.json"), "utf8"));
    ledger.completed = ledger.completed.filter((task: string) => task !== "TASK-040");
    writeFileSync(join(root, "docs/current/TASK_LEDGER.json"), `${JSON.stringify(ledger, null, 2)}\n`);
    const receipt = proveFreshI2AuthorityReconciliation({ root });
    assert.equal(receipt.decision, "NO-GO");
    assert.ok(failureIds(receipt).includes("BOOTSTRAP_RECONCILIATION"));
  });

  it("fails closed and records exact diagnostics on a completely missing bundle", () => {
    const root = mkdtempSync(join(tmpdir(), "i2-proof-missing-bundle-"));
    mkdirSync(join(root, "docs/current"), { recursive: true });
    mkdirSync(join(root, "docs/evidence/tasks"), { recursive: true });
    writeFileSync(join(root, "docs/current/TASK_LEDGER.json"), "{}");
    const receipt = proveFreshI2AuthorityReconciliation({ root });
    assert.equal(receipt.decision, "NO-GO");
    assert.ok(failureIds(receipt).length > 4);
    assert.equal(receipt.selected_task_id, null);
  });
});
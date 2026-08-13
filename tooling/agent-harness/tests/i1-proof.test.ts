import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { buildPostHardeningI1Proof, buildRepresentativeI1Proof, i1ProofReceiptSchema, postHardeningI1ProofReceiptSchema, writeI1Proof, writePostHardeningI1Proof } from "../src/i1-proof.js";

describe("AgentFactory I1 end-to-end proof", () => {
  it("proves the complete happy path through DONE and successor READY", () => {
    const proof = buildRepresentativeI1Proof();
    assert.equal(proof.route, "SELECTED");
    assert.deepEqual(proof.opencode, { noninteractive: true, bounded: true, argument_order: "PROMPT_MODEL_FILE" });
    assert.equal(proof.execution, "SUCCEEDED");
    assert.equal(proof.validation, "PASS");
    assert.equal(proof.github_lifecycle, "ELIGIBLE");
    assert.equal(proof.final_state, "DONE");
    assert.deepEqual(proof.newly_ready, ["TASK-901"]);
    assert.deepEqual(i1ProofReceiptSchema.parse(proof), proof);
  });

  it("proves controlled failure stops and preserves authoritative state", () => {
    assert.deepEqual(buildRepresentativeI1Proof().failure, {
      execution: "BLOCKED",
      validation: "FAIL",
      evidence_rejected: true,
      ledger_rejected: true,
      task_preserved: true,
      graph_preserved: true,
    });
  });

  it("is deterministic, append-only and refuses divergent proof content", () => {
    const first = buildRepresentativeI1Proof();
    assert.deepEqual(buildRepresentativeI1Proof(), first);
    const root = mkdtempSync(join(tmpdir(), "sb-i1-proof-"));
    const path = writeI1Proof(first, root);
    assert.equal(writeI1Proof(first, root), path);
    writeFileSync(path, "tampered\n");
    assert.throws(() => writeI1Proof(first, root), /OVERWRITE_REFUSED/);
    assert.equal(readFileSync(path, "utf8"), "tampered\n");
  });

  it("matches the committed deterministic proof artifact", () => {
    const committed = JSON.parse(readFileSync(join(process.cwd(), "docs/evidence/agentfactory/i1/I1PROOF-974820449e4976808d8fec2846083b9d20f2ee6a9587d74dce0cc70e9481fce7.json"), "utf8"));
    assert.deepEqual(committed, buildRepresentativeI1Proof());
  });

  it("proves the integrated post-hardening success, durable failure and state identity gate", () => {
    const proof = buildPostHardeningI1Proof();
    assert.equal(proof.happy_path.final_state, "DONE");
    assert.match(proof.happy_path.causal_attempt_receipt, /^AFATT-/);
    assert.deepEqual(proof.failure, {
      status: "BLOCKED", receipt_id: proof.failure.receipt_id, failure_category: "EXECUTION_SCOPE_VIOLATION",
      ledger_transition_accepted: true, done_rejected: true, task_preserved: true, graph_preserved: true,
    });
    assert.deepEqual(proof.state_lifecycle, { raw_state: "MERGED", decision: "BLOCKED", identity_mismatch: true });
    assert.deepEqual(postHardeningI1ProofReceiptSchema.parse(proof), proof);
  });

  it("persists a distinct deterministic post-hardening proof append-only", () => {
    const proof = buildPostHardeningI1Proof();
    assert.deepEqual(buildPostHardeningI1Proof(), proof);
    const root = mkdtempSync(join(tmpdir(), "sb-i1-proof2-"));
    const path = writePostHardeningI1Proof(proof, root);
    assert.equal(writePostHardeningI1Proof(proof, root), path);
    writeFileSync(path, "tampered\n");
    assert.throws(() => writePostHardeningI1Proof(proof, root), /OVERWRITE_REFUSED/);
  });

  it("matches the committed post-hardening proof artifact without changing the historical proof", () => {
    const committed = JSON.parse(readFileSync(join(process.cwd(), "docs/evidence/agentfactory/i1/I1PROOF2-d54db8d48d1bcde14ea357875c9184b7dec6b2524d39fa37c76fe05f4664bd9f.json"), "utf8"));
    assert.deepEqual(committed, buildPostHardeningI1Proof());
    const historical = JSON.parse(readFileSync(join(process.cwd(), "docs/evidence/agentfactory/i1/I1PROOF-974820449e4976808d8fec2846083b9d20f2ee6a9587d74dce0cc70e9481fce7.json"), "utf8"));
    assert.deepEqual(historical, buildRepresentativeI1Proof());
  });
});

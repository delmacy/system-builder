import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { buildRepresentativeI1Proof, i1ProofReceiptSchema, writeI1Proof } from "../src/i1-proof.js";

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
});

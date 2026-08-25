import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateDeterministicInvariantControl } from "../../../packages/contracts/decision-boundary/index.js";
import { projectAuthorityClosureDecisionBoundary } from "../src/authority-closure.js";
import { evaluateGitHubLifecycle } from "../src/github-lifecycle.js";
import { validationGateReceiptSchema } from "../src/validation-engine.js";

const source = "a".repeat(40);
const head = "b".repeat(40);

function lifecycle(eligible = true) {
  return evaluateGitHubLifecycle({
    prNumber: 360,
    state: eligible ? "MERGED" : "OPEN",
    branch: "sprint/P15-DECISION-BOUNDARY-ENFORCEMENT-01",
    baseBranch: "main",
    headCommit: head,
    expectedBranch: "sprint/P15-DECISION-BOUNDARY-ENFORCEMENT-01",
    expectedBaseBranch: "main",
    expectedHeadCommit: head,
    requiredChecks: ["Deterministic CI", "Heavy Product Tests"],
    checks: eligible
      ? [
          { name: "Deterministic CI", status: "SUCCESS" },
          { name: "Heavy Product Tests", status: "SUCCESS" },
        ]
      : [
          { name: "Deterministic CI", status: "PENDING" },
          { name: "Heavy Product Tests", status: "SUCCESS" },
        ],
    validation: "PASS",
    review: eligible ? "APPROVED" : "NONE",
    reviewRequired: true,
  });
}

function validation(failed = false) {
  return validationGateReceiptSchema.parse({
    schema_version: 1,
    task_id: "TASK-307",
    work_package_id: "WP-P15-DECISION-BOUNDARY",
    source_commit: source,
    changed_files: ["tooling/agent-harness/src/authority-closure.ts"],
    commands: [{
      command: "npm run verify",
      status: failed ? "FAIL" : "PASS",
      exit_code: failed ? 1 : 0,
      stdout: failed ? "" : "ok",
      stderr: failed ? "failed" : "",
    }],
    evaluator_changes: [],
    missing_evaluators: [],
    content_stable: true,
    decision: failed ? "FAIL" : "PASS",
    reason_codes: failed ? ["COMMAND_FAILED"] : [],
  });
}

function projection() {
  return projectAuthorityClosureDecisionBoundary({
    decisionId: "authority-closure:TASK-307",
    implementationInvariantRef: "authority-closure:implementation-lifecycle-eligible",
    validationInvariantRef: "authority-closure:validation-commands-pass",
    implementationLifecycle: lifecycle(),
    validation: validation(),
  });
}

describe("TASK-307 authority closure deterministic decision boundary", () => {
  it("projects the real eligibility and validation invariants as deterministic without changing their receipts", () => {
    const implementationLifecycle = lifecycle();
    const validationReceipt = validation();
    const value = projectAuthorityClosureDecisionBoundary({
      decisionId: "authority-closure:TASK-307",
      implementationInvariantRef: "authority-closure:implementation-lifecycle-eligible",
      validationInvariantRef: "authority-closure:validation-commands-pass",
      implementationLifecycle,
      validation: validationReceipt,
    });

    assert.deepEqual(value.implementationLifecycle, implementationLifecycle);
    assert.deepEqual(value.validationReceipt, validationReceipt);
    assert.equal(value.implementationEligibility.descriptor.category, "deterministic");
    assert.equal(value.implementationEligibility.metadata.invariantRef, "authority-closure:implementation-lifecycle-eligible");
    assert.equal(value.implementationEligibility.control.status, "compatible");
    assert.equal(value.validation.descriptor.category, "deterministic");
    assert.equal(value.validation.metadata.invariantRef, "authority-closure:validation-commands-pass");
    assert.equal(value.validation.control.status, "compatible");
  });

  it("rejects probabilistic substitution because no closure gate is invented", () => {
    const value = projection();
    const probabilistic = evaluateDeterministicInvariantControl({
      descriptor: { boundaryVersion: "1.0.0", decisionId: "probabilistic-closure-substitute", category: "probabilistic" },
      metadata: {
        inferenceRef: "closure-guess",
        inferenceContext: { confidence: 1, modelRef: "model:test", contextRef: "context:test" },
      },
      invariantRef: value.validation.metadata.invariantRef,
    });
    assert.equal(probabilistic.status, "rejected");
    if (probabilistic.status === "rejected") assert.match(probabilistic.diagnostic, /explicit compatible gate/);
  });

  it("preserves fail-closed lifecycle and validation preconditions", () => {
    assert.throws(() => projectAuthorityClosureDecisionBoundary({
      decisionId: "authority-closure:TASK-307:pending",
      implementationInvariantRef: "authority-closure:implementation-lifecycle-eligible",
      validationInvariantRef: "authority-closure:validation-commands-pass",
      implementationLifecycle: lifecycle(false),
      validation: validation(),
    }), /AUTHORITY_CLOSURE_IMPLEMENTATION_NOT_ELIGIBLE/);

    assert.throws(() => projectAuthorityClosureDecisionBoundary({
      decisionId: "authority-closure:TASK-307:failed",
      implementationInvariantRef: "authority-closure:implementation-lifecycle-eligible",
      validationInvariantRef: "authority-closure:validation-commands-pass",
      implementationLifecycle: lifecycle(),
      validation: validation(true),
    }), /AUTHORITY_CLOSURE_VALIDATION_FAILED/);
  });

  it("fails explicitly for malformed or coercive projection inputs", () => {
    assert.throws(() => projectAuthorityClosureDecisionBoundary({
      decisionId: "bad id",
      implementationInvariantRef: "authority-closure:implementation-lifecycle-eligible",
      validationInvariantRef: "authority-closure:validation-commands-pass",
      implementationLifecycle: lifecycle(),
      validation: validation(),
    }));
    assert.throws(() => projectAuthorityClosureDecisionBoundary({
      decisionId: "authority-closure:TASK-307",
      implementationInvariantRef: "authority-closure:implementation-lifecycle-eligible",
      validationInvariantRef: "authority-closure:validation-commands-pass",
      implementationLifecycle: lifecycle(),
      validation: validation(),
      category: "probabilistic",
    }));
  });
});

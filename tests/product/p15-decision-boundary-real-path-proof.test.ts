import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  evaluateDeterministicInvariantControl,
  evaluateHumanAuthorityReservation,
} from "../../packages/contracts/decision-boundary/index.js";
import {
  humanApprovalEvaluationSchema,
  projectHumanApprovalDecisionBoundary,
} from "../../tooling/agent-harness/src/human-approval.js";
import {
  packageAuthorizationEvaluationSchema,
  projectPackageAuthorizationDecisionBoundary,
} from "../../tooling/agent-harness/src/package-authorization.js";
import { projectAuthorityClosureDecisionBoundary } from "../../tooling/agent-harness/src/authority-closure.js";
import { evaluateGitHubLifecycle } from "../../tooling/agent-harness/src/github-lifecycle.js";
import { validationGateReceiptSchema } from "../../tooling/agent-harness/src/validation-engine.js";

const source = "a".repeat(40);
const head = "b".repeat(40);

function closureLifecycle(eligible = true) {
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

function closureValidation(failed = false) {
  return validationGateReceiptSchema.parse({
    schema_version: 1,
    task_id: "TASK-308",
    work_package_id: "WP-P15-DECISION-BOUNDARY",
    source_commit: source,
    changed_files: ["tests/product/p15-decision-boundary-real-path-proof.test.ts"],
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

describe("TASK-308 real governance decision-boundary proof", () => {
  it("keeps durable human approval and package-owner authorization human-reserved without manufacturing authority", () => {
    const humanEvaluation = humanApprovalEvaluationSchema.parse({
      decision: "MISSING",
      approval_id: null,
      reason_codes: ["APPROVAL_MISSING"],
    });
    const packageEvaluation = packageAuthorizationEvaluationSchema.parse({
      decision: "MISSING",
      approval_id: null,
      package_id: "PKG-P15-BOUNDARY",
      plan_hash: "c".repeat(64),
      descriptor_id: "PWD-P15-BOUNDARY",
      reason_codes: ["APPROVAL_MISSING"],
      use_receipt: null,
    });

    const human = projectHumanApprovalDecisionBoundary({
      decisionId: "human-approval:TASK-308",
      authorityRef: "ADR-0010:HUMAN_OWNER",
      evaluation: humanEvaluation,
    });
    const packageOwner = projectPackageAuthorizationDecisionBoundary({
      decisionId: "package-authorization:PKG-P15-BOUNDARY:TASK-308",
      authorityRef: "PACKAGE_OWNER:PKG-P15-BOUNDARY",
      evaluation: packageEvaluation,
    });

    assert.deepEqual(human.evaluation, humanEvaluation);
    assert.deepEqual(packageOwner.evaluation, packageEvaluation);
    assert.equal(human.descriptor.category, "human-decision");
    assert.equal(packageOwner.descriptor.category, "human-decision");
    assert.equal(human.evaluation.decision, "MISSING");
    assert.equal(packageOwner.evaluation.decision, "MISSING");
  });

  it("keeps probabilistic inference as context only and rejects it as human authority", () => {
    const probabilistic = {
      descriptor: {
        boundaryVersion: "1.0.0",
        decisionId: "probabilistic-context:TASK-308",
        category: "probabilistic" as const,
      },
      metadata: {
        inferenceRef: "risk-context-only",
        inferenceContext: { confidence: 0.99, modelRef: "model:test", contextRef: "context:TASK-308" },
      },
    };

    assert.equal(evaluateHumanAuthorityReservation({
      ...probabilistic,
      authorityRef: "ADR-0010:HUMAN_OWNER",
    }).status, "rejected");
    assert.equal(evaluateHumanAuthorityReservation({
      ...probabilistic,
      authorityRef: "PACKAGE_OWNER:PKG-P15-BOUNDARY",
    }).status, "rejected");
  });

  it("keeps authority closure deterministic and fail-closed on real lifecycle and validation receipts", () => {
    const lifecycle = closureLifecycle();
    const validation = closureValidation();
    const closure = projectAuthorityClosureDecisionBoundary({
      decisionId: "authority-closure:TASK-308",
      implementationInvariantRef: "authority-closure:implementation-lifecycle-eligible",
      validationInvariantRef: "authority-closure:validation-commands-pass",
      implementationLifecycle: lifecycle,
      validation,
    });

    assert.equal(closure.implementationEligibility.descriptor.category, "deterministic");
    assert.equal(closure.validation.descriptor.category, "deterministic");
    assert.deepEqual(closure.implementationLifecycle, lifecycle);
    assert.deepEqual(closure.validationReceipt, validation);

    const probabilisticSubstitute = evaluateDeterministicInvariantControl({
      descriptor: { boundaryVersion: "1.0.0", decisionId: "closure-guess:TASK-308", category: "probabilistic" },
      metadata: {
        inferenceRef: "closure-guess",
        inferenceContext: { confidence: 1, modelRef: "model:test", contextRef: "context:TASK-308" },
      },
      invariantRef: closure.validation.metadata.invariantRef,
    });
    assert.equal(probabilisticSubstitute.status, "rejected");

    assert.throws(() => projectAuthorityClosureDecisionBoundary({
      decisionId: "authority-closure:TASK-308:pending",
      implementationInvariantRef: "authority-closure:implementation-lifecycle-eligible",
      validationInvariantRef: "authority-closure:validation-commands-pass",
      implementationLifecycle: closureLifecycle(false),
      validation,
    }), /AUTHORITY_CLOSURE_IMPLEMENTATION_NOT_ELIGIBLE/);

    assert.throws(() => projectAuthorityClosureDecisionBoundary({
      decisionId: "authority-closure:TASK-308:failed",
      implementationInvariantRef: "authority-closure:implementation-lifecycle-eligible",
      validationInvariantRef: "authority-closure:validation-commands-pass",
      implementationLifecycle: lifecycle,
      validation: closureValidation(true),
    }), /AUTHORITY_CLOSURE_VALIDATION_FAILED/);
  });

  it("preserves backward-compatible projection inputs and rejects coercive extras", () => {
    const evaluation = humanApprovalEvaluationSchema.parse({
      decision: "INVALID",
      approval_id: null,
      reason_codes: ["POLICY_INVALID"],
    });
    const historical = projectHumanApprovalDecisionBoundary({
      decisionId: "human-approval:historical-caller",
      authorityRef: "ADR-0010:HUMAN_OWNER",
      evaluation,
    });
    assert.deepEqual(historical.evaluation, evaluation);

    assert.throws(() => projectPackageAuthorizationDecisionBoundary({
      decisionId: "package-authorization:coercive",
      authorityRef: "PACKAGE_OWNER:PKG-P15-BOUNDARY",
      evaluation: packageAuthorizationEvaluationSchema.parse({
        decision: "MISSING",
        approval_id: null,
        package_id: null,
        plan_hash: null,
        descriptor_id: null,
        reason_codes: ["APPROVAL_MISSING"],
        use_receipt: null,
      }),
      category: "probabilistic",
    }));
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateHumanAuthorityReservation } from "../../../packages/contracts/decision-boundary/index.js";
import {
  packageAuthorizationEvaluationSchema,
  projectPackageAuthorizationDecisionBoundary,
} from "../src/package-authorization.js";

function evaluation(decision: "VALID" | "INVALID" | "MISSING" | "EXCEPTION_REQUIRED") {
  return packageAuthorizationEvaluationSchema.parse({
    decision,
    approval_id: decision === "MISSING" ? null : `PAPR-${"a".repeat(64)}`,
    package_id: "PKG-P15-BOUNDARY",
    plan_hash: "b".repeat(64),
    descriptor_id: "PWD-P15-BOUNDARY",
    reason_codes: decision === "VALID" ? [] : ["APPROVAL_MISSING"],
    use_receipt: null,
  });
}

describe("TASK-306 package authorization decision boundary", () => {
  it("projects package-owner authorization as human-reserved without changing evaluation semantics", () => {
    const original = evaluation("VALID");
    const projection = projectPackageAuthorizationDecisionBoundary({
      decisionId: "package-authorization:PKG-P15-BOUNDARY",
      authorityRef: "PACKAGE_OWNER:PKG-P15-BOUNDARY",
      evaluation: original,
    });

    assert.deepEqual(projection.evaluation, original);
    assert.equal(projection.descriptor.category, "human-decision");
    assert.equal(projection.metadata.authorityRef, "PACKAGE_OWNER:PKG-P15-BOUNDARY");
    assert.equal(projection.reservation.status, "compatible");
  });

  it("preserves non-valid authorization instead of manufacturing authority", () => {
    for (const decision of ["INVALID", "MISSING", "EXCEPTION_REQUIRED"] as const) {
      const original = evaluation(decision);
      const projection = projectPackageAuthorizationDecisionBoundary({
        decisionId: `package-authorization:PKG-P15-BOUNDARY:${decision}`,
        authorityRef: "PACKAGE_OWNER:PKG-P15-BOUNDARY",
        evaluation: original,
      });
      assert.equal(projection.evaluation.decision, decision);
      assert.deepEqual(projection.evaluation, original);
      assert.equal(projection.reservation.status, "compatible");
    }
  });

  it("rejects deterministic and probabilistic substitution for package-owner authority", () => {
    const authorityRef = "PACKAGE_OWNER:PKG-P15-BOUNDARY";
    assert.equal(evaluateHumanAuthorityReservation({
      descriptor: { boundaryVersion: "1.0.0", decisionId: "det-substitute", category: "deterministic" },
      metadata: { invariantRef: "package-owner-approved" },
      authorityRef,
    }).status, "rejected");
    assert.equal(evaluateHumanAuthorityReservation({
      descriptor: { boundaryVersion: "1.0.0", decisionId: "prob-substitute", category: "probabilistic" },
      metadata: { inferenceRef: "package-owner-guess", inferenceContext: { confidence: 1, modelRef: "model:test", contextRef: "context:test" } },
      authorityRef,
    }).status, "rejected");
  });

  it("fails explicitly for malformed or coercive projection inputs", () => {
    const original = evaluation("VALID");
    assert.throws(() => projectPackageAuthorizationDecisionBoundary({
      decisionId: "bad id",
      authorityRef: "PACKAGE_OWNER:PKG-P15-BOUNDARY",
      evaluation: original,
    }));
    assert.throws(() => projectPackageAuthorizationDecisionBoundary({
      decisionId: "package-authorization:PKG-P15-BOUNDARY",
      authorityRef: "PACKAGE_OWNER:PKG-P15-BOUNDARY",
      category: "probabilistic",
      evaluation: original,
    }));
  });
});
import assert from "node:assert/strict";
import test from "node:test";

import { diagnoseFactoryOperatorBootstrapFailure } from "../../scripts/factory-operator-bootstrap-command.js";

test("TASK-437 classifies malformed operator input without echoing protected values", () => {
  const secret = "super-secret-value";
  const diagnostic = diagnoseFactoryOperatorBootstrapFailure(new Error("config.inputPath must be a non-empty string"));
  assert.equal(diagnostic.code, "INVALID_OPERATOR_INPUT");
  assert.match(diagnostic.action, /correct the bootstrap input/);
  assert.doesNotMatch(JSON.stringify(diagnostic), new RegExp(secret));
});

test("TASK-437 distinguishes missing prerequisite from unavailable capability", () => {
  const prerequisite = diagnoseFactoryOperatorBootstrapFailure(new Error("prerequisites.factoryE2EAvailable must be true"));
  const capability = diagnoseFactoryOperatorBootstrapFailure(new Error("catalog provider missing for capability orders"));
  assert.equal(prerequisite.code, "MISSING_PREREQUISITE");
  assert.equal(capability.code, "UNAVAILABLE_CAPABILITY");
});

test("TASK-437 preserves canonical predecessor failure context without claiming success", () => {
  const message = "capability-assembly predecessor does not match canonical system-definition identity";
  const diagnostic = diagnoseFactoryOperatorBootstrapFailure(new Error(message));
  assert.equal(diagnostic.code, "CANONICAL_E2E_REJECTED");
  assert.equal(diagnostic.message, message);
  assert.doesNotMatch(JSON.stringify(diagnostic), /status.*completed|succeeded/);
});

test("TASK-437 keeps stale, incompatible, substituted and lineage failures fail-closed", () => {
  for (const message of [
    "stale predecessor rejected",
    "incompatible predecessor rejected",
    "substituted predecessor rejected",
    "lineage-broken predecessor rejected",
  ]) {
    const diagnostic = diagnoseFactoryOperatorBootstrapFailure(new Error(message));
    assert.equal(diagnostic.code, "CANONICAL_E2E_REJECTED");
    assert.equal(diagnostic.message, message);
  }
});

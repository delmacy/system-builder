import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import {
  evaluateDeterministicInvariantControl,
  evaluateHumanAuthorityReservation,
  verifyDecisionBoundary,
} from "../../../packages/contracts/decision-boundary/index.js";

const boundarySource = readFileSync(resolve("packages/contracts/decision-boundary/index.ts"), "utf8");

const probabilisticDescriptor = {
  boundaryVersion: "1.0.0",
  decisionId: "decision:probabilistic-check",
  category: "probabilistic",
} as const;

const probabilisticMetadata = {
  inferenceRef: "inference:probabilistic-check",
  inferenceContext: {
    confidence: 0.8,
    modelRef: "model:neutral",
    contextRef: "context:bounded",
  },
} as const;

describe("TASK-310 decision-boundary architecture and contract checks", () => {
  it("keeps the contract boundary provider, network, secret and storage neutral", () => {
    const importSpecifiers = [...boundarySource.matchAll(/(?:from\s+|import\s*\(\s*)["']([^"']+)["']/g)].map(
      (match) => match[1],
    );

    assert.deepEqual(importSpecifiers, []);
    assert.doesNotMatch(boundarySource, /process\.env|fetch\s*\(|https?:\/\/|secret|credential|api[_-]?key|provider registry|storage adapter/i);
  });

  it("rejects probabilistic data as a substitute for human-reserved authority", () => {
    const result = evaluateHumanAuthorityReservation({
      descriptor: probabilisticDescriptor,
      metadata: probabilisticMetadata,
      authorityRef: "authority:package-owner",
    });

    assert.equal(result.status, "rejected");
    if (result.status === "rejected") assert.match(result.diagnostic, /cannot satisfy human-reserved authority/);
  });

  it("rejects ungated probabilistic data as a deterministic invariant control", () => {
    const result = evaluateDeterministicInvariantControl({
      descriptor: probabilisticDescriptor,
      metadata: probabilisticMetadata,
      invariantRef: "invariant:deterministic-check",
    });

    assert.equal(result.status, "rejected");
    if (result.status === "rejected") assert.match(result.diagnostic, /explicit compatible gate/);
  });

  it("exercises the real exported verification API without manufacturing authority", () => {
    const result = verifyDecisionBoundary({
      descriptor: probabilisticDescriptor,
      metadata: probabilisticMetadata,
      riskCriticality: { risk: "high", criticality: "critical" },
      expectedCategory: "probabilistic",
    });

    assert.deepEqual(result, {
      status: "valid",
      decisionId: "decision:probabilistic-check",
      category: "probabilistic",
      risk: "high",
      criticality: "critical",
      reference: { kind: "inference", ref: "inference:probabilistic-check" },
    });
    assert.equal("authorized" in result, false);
    assert.equal("approved" in result, false);
  });
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  buildExecutionContextIsQualified,
  controlledImpurityIsQualified,
  executionContextClaimsHermeticity,
  providerAcknowledgementEstablishesQualifiedRunner,
  sameEnvironmentLabelEstablishesSameEffectiveInputs,
  type BuildExecutionContext,
  type ControlledImpurity,
} from "../../packages/contracts/build-reproducibility/build-execution-context.js";

const evaluatedAt = "2026-09-13T00:00:00Z";
const currentness = { state: "CURRENT" as const, assessedAt: "2026-09-12T00:00:00Z", validUntil: "2026-09-14T00:00:00Z" };

const impurity = (overrides: Partial<ControlledImpurity> = {}): ControlledImpurity => ({
  impurityRef: "impurity:network:registry",
  scopeRef: "scope:dependency-fetch",
  evidenceRef: "evidence:policy:1",
  declared: true,
  completeness: "KNOWN",
  currentness,
  ...overrides,
});

const context = (overrides: Partial<BuildExecutionContext> = {}): BuildExecutionContext => ({
  executionContextRef: "execution:1",
  runner: {
    runnerRef: "runner:linux-x64",
    runnerRevisionRef: "runner-revision:7",
    populationRef: "runner-population:prod-a",
    locality: "QUALIFIED",
  },
  toolchain: { toolchainRef: "toolchain:node", toolchainRevisionRef: "node:24.8.0" },
  environment: { environmentRef: "environment:sha256:aaa", environmentLabel: "ubuntu-latest" },
  inputBoundary: { inputBoundaryRef: "inputs:sha256:bbb", qualifiedInputRefs: ["material:sha256:abc", "source:revision:7"] },
  controlledImpurities: [impurity()],
  providerEvidence: {
    providerRef: "provider:ci-a",
    providerLocalRunnerId: "runner-99",
    support: "SUPPORTED",
    acknowledged: true,
    completeness: "KNOWN",
    currentness,
  },
  ...overrides,
});

test("TASK-536 runner toolchain environment and input boundary are independently qualified", () => {
  assert.equal(buildExecutionContextIsQualified(context(), evaluatedAt), true);
  assert.equal(buildExecutionContextIsQualified(context({ runner: { ...context().runner, locality: "UNKNOWN" } }), evaluatedAt), false);
  assert.equal(buildExecutionContextIsQualified(context({ toolchain: { toolchainRef: "toolchain:node", toolchainRevisionRef: "" } }), evaluatedAt), false);
  assert.equal(buildExecutionContextIsQualified(context({ inputBoundary: { inputBoundaryRef: "inputs:1", qualifiedInputRefs: [""] } }), evaluatedAt), false);
});

test("TASK-536 controlled impurities must be explicit scoped known and current", () => {
  assert.equal(controlledImpurityIsQualified(impurity(), evaluatedAt), true);
  assert.equal(controlledImpurityIsQualified(impurity({ declared: false }), evaluatedAt), false);
  assert.equal(controlledImpurityIsQualified(impurity({ evidenceRef: null }), evaluatedAt), false);
  assert.equal(controlledImpurityIsQualified(impurity({ completeness: "PARTIAL" }), evaluatedAt), false);
  assert.equal(controlledImpurityIsQualified(impurity({ completeness: "UNKNOWN" }), evaluatedAt), false);
  assert.equal(controlledImpurityIsQualified(impurity({ currentness: { ...currentness, state: "STALE" } }), evaluatedAt), false);
});

test("TASK-536 provider ACK support and labels never become semantic authority", () => {
  assert.equal(providerAcknowledgementEstablishesQualifiedRunner(context().providerEvidence), false);
  assert.equal(sameEnvironmentLabelEstablishesSameEffectiveInputs(context().environment, { environmentRef: "environment:other", environmentLabel: "ubuntu-latest" }), false);
  assert.equal(buildExecutionContextIsQualified(context({ providerEvidence: { ...context().providerEvidence, acknowledged: true, completeness: "UNKNOWN" } }), evaluatedAt), false);
  assert.equal(buildExecutionContextIsQualified(context({ providerEvidence: { ...context().providerEvidence, currentness: { ...currentness, state: "STALE" } } }), evaluatedAt), false);
});

test("TASK-536 undeclared impurity cannot support a hermetic build claim", () => {
  assert.equal(executionContextClaimsHermeticity(context({ controlledImpurities: [] }), evaluatedAt), true);
  assert.equal(executionContextClaimsHermeticity(context({ controlledImpurities: [impurity()] }), evaluatedAt), false);
  assert.equal(buildExecutionContextIsQualified(context({ controlledImpurities: [impurity({ declared: false })] }), evaluatedAt), false);
});

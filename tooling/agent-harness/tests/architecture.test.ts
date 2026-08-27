import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { analyzeArchitecture } from "../src/architecture.js";

describe("architecture dependency gates", () => {
  it("rejects a Runtime to Builder authoring import", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-architecture-"));
    const directory = join(root, "packages/runtime-core/src");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "bad.ts"), 'import "@system-builder/mirror";\n');
    assert.deepEqual(analyzeArchitecture(root), [
      {
        file: "packages/runtime-core/src/bad.ts",
        rule: "runtime-does-not-import-builder-authoring",
        importPath: "@system-builder/mirror",
      },
    ]);
  });

  it("allows Runtime to consume public contracts", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-architecture-"));
    const directory = join(root, "packages/runtime-core/src");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "good.ts"), 'import "@system-builder/contracts";\n');
    assert.deepEqual(analyzeArchitecture(root), []);
  });

  it("rejects relative cross-package imports and package cycles", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-architecture-"));
    const alpha = join(root, "packages/alpha/src");
    const beta = join(root, "packages/beta/src");
    mkdirSync(alpha, { recursive: true });
    mkdirSync(beta, { recursive: true });
    writeFileSync(join(alpha, "index.ts"), 'import "@system-builder/beta";\nimport "../../beta/src/internal";\n');
    writeFileSync(join(beta, "index.ts"), 'import "@system-builder/alpha";\n');
    const violations = analyzeArchitecture(root);
    assert.ok(violations.some((item) => item.rule === "suite-modules-use-public-package-imports"));
    assert.ok(violations.some((item) => item.rule === "no-circular-package-dependencies"));
  });

  it("rejects caller-supplied AI Gateway observation permission booleans", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-architecture-"));
    const directory = join(root, "packages/contracts/ai-gateway");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "bad-observation.ts"), `
export type UsageObservationPermissions = Readonly<{
  quality: boolean;
  failure: boolean;
  cost: boolean;
}>;
export type Envelope = Readonly<{
  permissionPolicyId: string;
  permissions: UsageObservationPermissions;
}>;
`);
    assert.ok(analyzeArchitecture(root).some((item) => item.rule === "ai-gateway-observation-permissions-must-be-policy-derived"));
  });

  it("rejects metadata permission booleans without policy linkage", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-architecture-"));
    const directory = join(root, "packages/contracts/ai-gateway");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "bad-metadata.ts"), "export type MetadataEnvelope = { metadataPermitted: boolean; metadata: unknown };\n");
    assert.ok(analyzeArchitecture(root).some((item) => item.rule === "ai-gateway-permission-claims-require-policy-linkage"));
  });

  it("rejects observation authority inferred from budget quota metric names", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-architecture-"));
    const directory = join(root, "packages/contracts/ai-gateway");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "bad-quota-authority.ts"), `
type UsageObservationMeasurement = "quality" | "failure" | "cost";
function permittedMeasurements(rules: { budgetQuotas: Array<{ metric: string }> }): readonly UsageObservationMeasurement[] {
  return rules.budgetQuotas
    .map((rule) => rule.metric)
    .filter((metric): metric is UsageObservationMeasurement => metric === "failure");
}
`);
    assert.ok(analyzeArchitecture(root).some((item) => item.rule === "ai-gateway-observation-authority-must-not-be-inferred-from-budget-metrics"));
  });

  it("allows explicit policy-derived AI Gateway observation permission contracts", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-architecture-"));
    const directory = join(root, "packages/contracts/ai-gateway");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "good-observation.ts"), `
export type ObservationPermissionRule = Readonly<{
  ruleId: string;
  permittedMeasurements: readonly ("quality" | "failure" | "cost")[];
}>;
export type Evaluation = Readonly<{
  policyId: string;
  permittedObservationMeasurements: readonly string[];
}>;
`);
    assert.deepEqual(analyzeArchitecture(root), []);
  });

  it("rejects Knowledge Boundary final decision actors without canonical human Decision Boundary verification", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-architecture-"));
    const directory = join(root, "packages/contracts/knowledge-boundary");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "bad-classification.ts"), `
export type KnowledgeClassificationDecision = Readonly<{
  mode: "assisted";
  decisionActorRef: string;
  decisionRef: string;
  proposalRef: string;
}>;
export function normalizeKnowledgeClassificationDecision(input: unknown) { return input; }
`);
    assert.ok(analyzeArchitecture(root).some((item) => item.rule === "knowledge-classification-human-authority-must-use-decision-boundary"));
  });

  it("allows Knowledge Boundary decisions linked to canonical human Decision Boundary verification", () => {
    const root = mkdtempSync(join(tmpdir(), "sb-architecture-"));
    const directory = join(root, "packages/contracts/knowledge-boundary");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "good-classification.ts"), `
import { verifyDecisionBoundary } from "../decision-boundary/index.js";
export type KnowledgeClassificationDecision = Readonly<{ decisionActorRef: string }>;
export function normalizeKnowledgeClassificationDecision(input: unknown) {
  return verifyDecisionBoundary({ descriptor: input, metadata: input, riskCriticality: input, expectedCategory: "human-decision" });
}
`);
    assert.deepEqual(analyzeArchitecture(root), []);
  });
});

import assert from "node:assert/strict";
import test from "node:test";
import publishedSchema from "../../packages/contracts/system-definition/system-definition.schema.json";
import minimalSystemDefinition from "../../packages/contracts/system-definition/fixtures/valid/minimal.system-definition.json";
import { systemDefinitionSchema } from "../../packages/contracts/system-definition/index.js";
import { projectCriticalDecisionAuditEvidence } from "../../packages/contracts/decision-boundary/critical-decision-audit.js";
import { verifyDecisionBoundary, type DecisionBoundaryVerificationResult } from "../../packages/contracts/decision-boundary/index.js";

type Schema = Readonly<{ required?: readonly string[]; properties?: Readonly<Record<string, unknown>> }>;
const published = publishedSchema as Schema;
const imported = systemDefinitionSchema as Schema;
const fixture = minimalSystemDefinition as Readonly<Record<string, unknown>>;
const critical = { risk: "high", criticality: "critical" } as const;

const decisionCases = [
  {
    descriptor: { boundaryVersion: "1.0.0", decisionId: "decision:pre-m16-deterministic", category: "deterministic" } as const,
    metadata: { invariantRef: "invariant:pre-m16-safe" } as const,
  },
  {
    descriptor: { boundaryVersion: "1.0.0", decisionId: "decision:pre-m16-human", category: "human-decision" } as const,
    metadata: { authorityRef: "authority:pre-m16-owner" } as const,
  },
  {
    descriptor: { boundaryVersion: "1.0.0", decisionId: "decision:pre-m16-probabilistic", category: "probabilistic" } as const,
    metadata: {
      inferenceRef: "inference:pre-m16-risk",
      inferenceContext: { confidence: 0.8, modelRef: "model:pre-m16", contextRef: "context:pre-m16" },
    } as const,
  },
] as const;

test("pre-M16 growing proof keeps canonical publication and imported SystemDefinition contract identical", () => {
  assert.deepEqual(imported, published);
  for (const extension of ["authenticationProviders", "identities", "sessionPolicy", "roleBindings", "views", "permissions", "policies"]) {
    assert.ok(published.properties?.[extension], extension);
  }
  for (const required of published.required ?? []) {
    assert.equal(Object.hasOwn(fixture, required), true, `representative SystemDefinition fixture must retain ${required}`);
  }
});

test("pre-M16 growing proof preserves all decision categories without creating authority", () => {
  for (const entry of decisionCases) {
    const verification = verifyDecisionBoundary({ descriptor: entry.descriptor, metadata: entry.metadata, riskCriticality: critical });
    assert.equal(verification.status, "valid");
    const audit = projectCriticalDecisionAuditEvidence({
      descriptor: entry.descriptor,
      metadata: entry.metadata,
      riskCriticality: critical,
      verificationResult: verification,
    });
    assert.equal(audit.category, entry.descriptor.category);
    assert.equal(audit.verificationStatus, "valid");
    assert.equal("approved" in audit, false);
    assert.equal("authorized" in audit, false);
    assert.equal("executionAuthority" in audit, false);
  }
});

test("pre-M16 growing proof fails closed for a caller-forged valid critical verification", () => {
  const human = decisionCases[1];
  const canonical = verifyDecisionBoundary({ descriptor: human.descriptor, metadata: human.metadata, riskCriticality: critical });
  assert.equal(canonical.status, "valid");
  if (canonical.status !== "valid") return;

  const forged: DecisionBoundaryVerificationResult = {
    status: "valid",
    decisionId: canonical.decisionId,
    category: canonical.category,
    risk: canonical.risk,
    criticality: canonical.criticality,
    reference: { ...canonical.reference },
  };
  assert.throws(
    () => projectCriticalDecisionAuditEvidence({ descriptor: human.descriptor, metadata: human.metadata, riskCriticality: critical, verificationResult: forged }),
    /not established by canonical verification boundary/,
  );
});

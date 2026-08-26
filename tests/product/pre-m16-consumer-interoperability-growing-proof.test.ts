import assert from "node:assert/strict";
import test from "node:test";
import canonicalSchema from "../../packages/contracts/system-definition/system-definition.schema.json";
import {
  SYSTEM_DEFINITION_SCHEMA_ID,
  systemDefinitionSchema,
} from "../../packages/contracts/system-definition/index.js";
import { projectCriticalDecisionAuditEvidence } from "../../packages/contracts/decision-boundary/critical-decision-audit.js";
import {
  isCanonicalDecisionBoundaryVerificationResult,
  verifyDecisionBoundary,
  type DecisionBoundaryVerificationResult,
} from "../../packages/contracts/decision-boundary/index.js";
import { normalizeRuntimeAuthorityProjection } from "../../packages/compiler/authority-projection.js";
import { materializeRuntimeModel } from "../../packages/compiler/runtime-model.js";
import { normalizeSystemDefinitionRuntimeProjection } from "../../packages/compiler/runtime-projection.js";

type SchemaWithProperties = Readonly<{ $id?: string; properties: Readonly<Record<string, unknown>> }>;

const definition = {
  entities: [{ id: "entity:ticket", fields: [{ name: "title", type: "string" as const }] }],
  actions: [{ id: "action:edit", effect: { kind: "entity.update" as const, entityRef: "entity:ticket" } }],
  processes: [],
  environmentRequirements: [{ name: "AUTH_SECRET", kind: "secret-reference" as const, required: true }],
  authenticationProviders: [{ id: "provider:local", bindingRef: "AUTH_SECRET" }],
  identities: [{ id: "identity:alice", kind: "user" as const, subjectRef: "subject:alice", active: true, authenticationProviderRef: "provider:local" }],
  sessionPolicy: { lifetimeSeconds: 900 },
  roleBindings: [{ id: "binding:alice-agent", roleRef: "role:agent", actorRef: "identity:alice" }],
  permissions: [{ role: "role:agent", resource: "entity:ticket", actions: ["action:edit"], policyRefs: ["policy:owned"] }],
  policies: [{ id: "policy:owned", statement: "documentation only", structured: { effect: "allow" as const, roleRefs: ["role:agent"], resourceRefs: ["entity:ticket"], actionRefs: ["action:edit"], contextEquals: { ownership: true } } }],
  views: [{ id: "view:ticket", kind: "form" as const, binding: { entityRef: "entity:ticket", fieldRefs: ["title"], actionRefs: ["action:edit"] } }],
};

const critical = { risk: "high", criticality: "critical" } as const;

test("PRE-M16 integrated consumer proof preserves canonical schema, Compiler projection and audit trust boundaries", () => {
  const published = canonicalSchema as SchemaWithProperties;
  const imported = systemDefinitionSchema as SchemaWithProperties;
  assert.equal(published.$id, SYSTEM_DEFINITION_SCHEMA_ID);
  assert.equal(imported.$id, SYSTEM_DEFINITION_SCHEMA_ID);

  const runtimeProjection = normalizeSystemDefinitionRuntimeProjection("system:pre-m16-integrated", {
    kind: "SystemDefinitionRuntimeProjection",
    systemDefinitionRef: "system:pre-m16-integrated",
    entities: definition.entities,
    actions: definition.actions,
    processes: definition.processes,
    environmentRequirements: definition.environmentRequirements,
    authenticationProviders: definition.authenticationProviders,
    identities: definition.identities,
    sessionPolicy: definition.sessionPolicy,
  });
  const authorityProjection = normalizeRuntimeAuthorityProjection({
    entities: definition.entities,
    actions: definition.actions,
    identities: definition.identities,
    roleBindings: definition.roleBindings,
    permissions: definition.permissions,
    policies: definition.policies,
    views: definition.views,
  });
  const model = materializeRuntimeModel("system:pre-m16-integrated", runtimeProjection, authorityProjection).model;
  assert.equal(model.identities[0]?.id, "identity:alice");
  assert.equal(model.permissions?.[0]?.actions[0], "action:edit");
  assert.equal(model.views?.[0]?.binding?.entityRef, "entity:ticket");

  const descriptor = { boundaryVersion: "1.0.0", decisionId: "decision:pre-m16-integrated-human", category: "human-decision" } as const;
  const metadata = { authorityRef: "authority:pre-m16-owner" } as const;
  const verification = verifyDecisionBoundary({ descriptor, metadata, riskCriticality: critical });
  assert.equal(verification.status, "valid");
  assert.equal(isCanonicalDecisionBoundaryVerificationResult(verification), true);

  const audit = projectCriticalDecisionAuditEvidence({ descriptor, metadata, riskCriticality: critical, verificationResult: verification });
  assert.equal(audit.verificationStatus, "valid");
  assert.equal(audit.category, "human-decision");
  assert.equal("approved" in audit, false);
  assert.equal("authorized" in audit, false);
  assert.equal("executionAuthority" in audit, false);

  const reconstructed = JSON.parse(JSON.stringify(verification)) as DecisionBoundaryVerificationResult;
  assert.equal(isCanonicalDecisionBoundaryVerificationResult(reconstructed), false);
  assert.throws(
    () => projectCriticalDecisionAuditEvidence({ descriptor, metadata, riskCriticality: critical, verificationResult: reconstructed }),
    /not established by canonical verification boundary/,
  );
});

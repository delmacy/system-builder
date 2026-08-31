import assert from "node:assert/strict";
import test from "node:test";
import { composeFactoryJourney } from "../../packages/assembly/factory-composition.js";
import {
  resolveFactoryJourneyCapabilities,
  SoftwareCatalogRegistry,
} from "../../packages/catalog/index.js";
import { FACTORY_JOURNEY_CONTRACT_VERSION } from "../../packages/contracts/factory-boundary/journey.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { composeFactoryAssemblyValidation } from "../../packages/validation/factory-composition.js";

const revision = {
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef: "process:orders",
  revisionRef: "process-revision:orders:v1",
  revisionNumber: 1,
  previousRevisionRef: null,
};
const analysisIdentity = {
  contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
  kind: "analysis" as const,
  identityRef: "analysis:orders:v1",
};
const canonicalSystemDefinitionRef = "system-definition:orders:v1";

function binding(systemDefinitionRef = canonicalSystemDefinitionRef) {
  const process = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision" as const,
    processRevision: revision,
  };
  const definitionIdentity = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "system-definition" as const,
    identityRef: systemDefinitionRef,
  };
  return {
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    journey: {
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      stages: [
        {
          kind: "approved-process",
          identityRef: revision.revisionRef,
          provenanceRef: revision.artifactRef,
        },
        {
          kind: "analysis-definition",
          identityRef: analysisIdentity.identityRef,
          provenanceRef: revision.revisionRef,
        },
        {
          kind: "capability-assembly",
          identityRef: "assembly:pending",
          provenanceRef: systemDefinitionRef,
        },
        {
          kind: "validation",
          identityRef: "validation:pending",
          provenanceRef: "assembly:pending",
        },
        {
          kind: "compiler-release",
          identityRef: "release:pending",
          provenanceRef: "validation:pending",
        },
        {
          kind: "deployment",
          identityRef: "deployment:pending",
          provenanceRef: "release:pending",
        },
      ],
    },
    lineage: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      processRevision: process,
      analysis: analysisIdentity,
      systemDefinition: definitionIdentity,
      hops: [
        {
          contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
          kind: "process-revision-to-analysis" as const,
          from: process,
          to: analysisIdentity,
        },
        {
          contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
          kind: "analysis-to-system-definition" as const,
          from: analysisIdentity,
          to: definitionIdentity,
        },
      ] as const,
    },
  };
}

function catalog() {
  const registry = new SoftwareCatalogRegistry();
  registry.register({ capability: "orders", provider: "builtin", version: "1.0.0" });
  return registry;
}

const systemDefinition = {
  definition: "SystemDefinition" as const,
  analysisRef: analysisIdentity.identityRef,
  recipeRef: revision.revisionRef,
  capabilities: [{ id: "orders", capability: "orders", requirementRefs: ["REQ-1"] }],
};

const recipeTraceability = {
  modules: [{ requirementIds: ["REQ-1"] }],
  rules: [],
  responsibilities: [],
  exceptions: [],
};
const analysisTraceability = {
  findings: [{ recipeRequirementRefs: ["REQ-1"] }],
};
const definitionTraceability = {
  entities: [],
  processes: [],
  actions: [],
  capabilities: [{ capability: "orders", requirementRefs: ["REQ-1"] }],
  views: [],
  policies: [],
  integrations: [],
};

function canonicalComposition() {
  const registry = catalog();
  const journeyBinding = binding();
  const upstream = resolveFactoryJourneyCapabilities(registry, journeyBinding, systemDefinition);
  assert.equal(upstream.systemDefinitionRef, canonicalSystemDefinitionRef);

  const assembled = composeFactoryJourney({
    journeyBinding,
    definition: systemDefinition,
    catalog: registry,
  });
  assert.equal(assembled.assembly.ok, true);
  if (!assembled.assembly.ok) throw new Error("expected canonical assembly plan");

  const validation = composeFactoryAssemblyValidation({
    journeyBinding,
    recipe: recipeTraceability,
    analysis: analysisTraceability,
    definition: definitionTraceability,
    assemblyPlan: assembled.assembly.plan,
  });
  return { plan: assembled.assembly.plan, validation };
}

test("factory assembly validation derives exact validation predecessor from the canonical assembly plan", () => {
  const result = canonicalComposition();
  assert.equal(result.plan.systemDefinitionRef, canonicalSystemDefinitionRef);
  assert.equal(result.validation.assemblyPlanRef, result.plan.contentHash);
  assert.equal(result.validation.validationEvidence.assemblyPlanRef, result.plan.contentHash);
  assert.equal(result.validation.validationEvidence.decision, "PASS");
});

test("factory assembly validation is deterministic for repeated canonical composition", () => {
  assert.deepEqual(canonicalComposition(), canonicalComposition());
});

test("factory assembly validation rejects a stale system definition predecessor", () => {
  const { plan } = canonicalComposition();
  assert.throws(
    () => composeFactoryAssemblyValidation({
      journeyBinding: binding(),
      recipe: recipeTraceability,
      analysis: analysisTraceability,
      definition: definitionTraceability,
      assemblyPlan: { ...plan, systemDefinitionRef: "system-definition:stale" },
    }),
    /FACTORY_VALIDATION_SYSTEM_DEFINITION_MISMATCH/,
  );
});

test("factory assembly validation rejects substituted assembly provenance", () => {
  const { plan } = canonicalComposition();
  assert.throws(
    () => composeFactoryAssemblyValidation({
      journeyBinding: binding(),
      recipe: recipeTraceability,
      analysis: analysisTraceability,
      definition: definitionTraceability,
      assemblyPlan: {
        ...plan,
        sourceRefs: ["system-definition:substituted", ...plan.sourceRefs.slice(1)],
      },
    }),
    /FACTORY_VALIDATION_ASSEMBLY_PROVENANCE_MISMATCH/,
  );
});

test("factory assembly validation rejects a missing assembly identity hash", () => {
  const { plan } = canonicalComposition();
  assert.throws(
    () => composeFactoryAssemblyValidation({
      journeyBinding: binding(),
      recipe: recipeTraceability,
      analysis: analysisTraceability,
      definition: definitionTraceability,
      assemblyPlan: { ...plan, contentHash: "" },
    }),
    /FACTORY_VALIDATION_INVALID_ASSEMBLY_PLAN_HASH/,
  );
});

test("factory assembly validation fails closed for a cross-system canonical binding", () => {
  const { plan } = canonicalComposition();
  assert.throws(
    () => composeFactoryAssemblyValidation({
      journeyBinding: binding("system-definition:other:v1"),
      recipe: recipeTraceability,
      analysis: analysisTraceability,
      definition: definitionTraceability,
      assemblyPlan: plan,
    }),
    /FACTORY_VALIDATION_SYSTEM_DEFINITION_MISMATCH/,
  );
});

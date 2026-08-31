import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveFactoryJourneyCapabilities,
  SoftwareCatalogRegistry,
} from "../../packages/catalog/index.js";
import { FACTORY_JOURNEY_CONTRACT_VERSION } from "../../packages/contracts/factory-boundary/journey.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";

const revision = {
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef: "process:orders",
  revisionRef: "process-revision:orders:v1",
  revisionNumber: 1,
  previousRevisionRef: null,
};
const process = {
  contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
  kind: "process-revision" as const,
  processRevision: revision,
};
const analysis = {
  contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
  kind: "analysis" as const,
  identityRef: "analysis:orders:v1",
};
const definitionIdentity = {
  contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
  kind: "system-definition" as const,
  identityRef: "system-definition:orders:v1",
};
const lineage = {
  contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
  processRevision: process,
  analysis,
  systemDefinition: definitionIdentity,
  hops: [
    {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "process-revision-to-analysis" as const,
      from: process,
      to: analysis,
    },
    {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "analysis-to-system-definition" as const,
      from: analysis,
      to: definitionIdentity,
    },
  ] as const,
};

function binding(capabilityProvenance = definitionIdentity.identityRef) {
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
          identityRef: analysis.identityRef,
          provenanceRef: revision.revisionRef,
        },
        {
          kind: "capability-assembly",
          identityRef: "assembly:pending",
          provenanceRef: capabilityProvenance,
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
    lineage,
  };
}

function catalog() {
  const registry = new SoftwareCatalogRegistry();
  registry.register({ capability: "orders", provider: "builtin-b", version: "1.0.0" });
  registry.register({ capability: "orders", provider: "builtin-a", version: "1.0.0" });
  return registry;
}

const definition = {
  definition: "SystemDefinition" as const,
  analysisRef: analysis.identityRef,
  recipeRef: revision.revisionRef,
  capabilities: [
    { id: "orders", capability: "orders", requirementRefs: ["REQ-1"] },
  ],
};

test("factory capability resolution carries exact canonical upstream identities into existing catalog resolution", () => {
  const result = resolveFactoryJourneyCapabilities(catalog(), binding(), definition);

  assert.equal(result.processRevisionRef, revision.revisionRef);
  assert.equal(result.analysisRef, analysis.identityRef);
  assert.equal(result.systemDefinitionRef, definitionIdentity.identityRef);
  assert.deepEqual(
    result.resolutions[0]?.candidates.map((candidate) => candidate.provider),
    ["builtin-a", "builtin-b"],
  );
});

test("factory capability resolution is deterministic for repeated canonical input", () => {
  const registry = catalog();
  const first = resolveFactoryJourneyCapabilities(registry, binding(), definition);
  const second = resolveFactoryJourneyCapabilities(registry, binding(), definition);
  assert.deepEqual(first, second);
});

test("factory capability resolution rejects a stale process revision reference", () => {
  assert.throws(
    () =>
      resolveFactoryJourneyCapabilities(catalog(), binding(), {
        ...definition,
        recipeRef: "process-revision:orders:stale",
      }),
    /FACTORY_CAPABILITY_PROCESS_IDENTITY_MISMATCH/,
  );
});

test("factory capability resolution rejects a substituted analysis reference", () => {
  assert.throws(
    () =>
      resolveFactoryJourneyCapabilities(catalog(), binding(), {
        ...definition,
        analysisRef: "analysis:hand-authored",
      }),
    /FACTORY_CAPABILITY_ANALYSIS_IDENTITY_MISMATCH/,
  );
});

test("factory capability resolution fails closed when a declared capability is absent", () => {
  assert.throws(
    () =>
      resolveFactoryJourneyCapabilities(catalog(), binding(), {
        ...definition,
        capabilities: [
          { id: "missing", capability: "missing-capability", requirementRefs: ["REQ-X"] },
        ],
      }),
    /FACTORY_CAPABILITY_RESOLUTION_FAILED:CAPABILITY_NOT_FOUND:missing-capability/,
  );
});

test("factory capability resolution rejects lineage whose capability stage is bound to another definition", () => {
  assert.throws(
    () => resolveFactoryJourneyCapabilities(catalog(), binding("system-definition:other"), definition),
    /canonical system-definition identity/,
  );
});

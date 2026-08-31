import assert from "node:assert/strict";
import test from "node:test";
import { composeFactoryJourney } from "../../packages/assembly/factory-composition.js";
import { SoftwareCatalogRegistry } from "../../packages/catalog/index.js";
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
const process = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision" as const, processRevision: revision };
const analysis = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis" as const, identityRef: "analysis:orders:v1" };
const definition = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition" as const, identityRef: "system-definition:orders:v1" };
const lineage = {
  contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
  processRevision: process,
  analysis,
  systemDefinition: definition,
  hops: [
    { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision-to-analysis" as const, from: process, to: analysis },
    { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis-to-system-definition" as const, from: analysis, to: definition },
  ] as const,
};

function binding(definitionRef = definition.identityRef) {
  return {
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    journey: {
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      stages: [
        { kind: "approved-process", identityRef: revision.revisionRef, provenanceRef: revision.artifactRef },
        { kind: "analysis-definition", identityRef: analysis.identityRef, provenanceRef: revision.revisionRef },
        { kind: "capability-assembly", identityRef: "assembly:pending", provenanceRef: definitionRef },
        { kind: "validation", identityRef: "validation:pending", provenanceRef: "assembly:pending" },
        { kind: "compiler-release", identityRef: "release:pending", provenanceRef: "validation:pending" },
        { kind: "deployment", identityRef: "deployment:pending", provenanceRef: "release:pending" },
      ],
    },
    lineage,
  };
}

function catalog() {
  const registry = new SoftwareCatalogRegistry();
  registry.register({ capability: "orders", provider: "builtin", version: "1.0.0" });
  return registry;
}

const assemblyDefinition = {
  definition: "SystemDefinition" as const,
  analysisRef: analysis.identityRef,
  recipeRef: revision.revisionRef,
  capabilities: [{ id: "orders", capability: "orders", requirementRefs: [] }],
};

test("factory composition carries canonical definition identity through existing catalog and assembly APIs", () => {
  const result = composeFactoryJourney({ journeyBinding: binding(), definition: assemblyDefinition, catalog: catalog() });
  assert.equal(result.assembly.ok, true);
  if (!result.assembly.ok) return;
  assert.equal(result.assembly.plan.systemDefinitionRef, definition.identityRef);
  assert.equal(result.assembly.plan.components[0]?.provider, "builtin");
  assert.equal(result.binding.lineage.systemDefinition.identityRef, definition.identityRef);
});

test("factory composition fails closed for incompatible predecessor identity", () => {
  assert.throws(
    () => composeFactoryJourney({ journeyBinding: binding("system-definition:stale"), definition: assemblyDefinition, catalog: catalog() }),
    /canonical system-definition identity/,
  );
});

test("factory composition rejects a hand-authored analysis identity instead of treating it as authority", () => {
  assert.throws(
    () => composeFactoryJourney({
      journeyBinding: binding(),
      definition: { ...assemblyDefinition, analysisRef: "analysis:hand-authored" },
      catalog: catalog(),
    }),
    /FACTORY_COMPOSITION_ANALYSIS_IDENTITY_MISMATCH/,
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
  validateFactoryOperatorBootstrap,
} from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";

const revision = {
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef: "process:orders",
  revisionRef: "process-revision:orders:v1",
  revisionNumber: 1,
  previousRevisionRef: null,
};
const analysis = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis", identityRef: "analysis:orders:v1" };
const definitionIdentity = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition", identityRef: "system-definition:orders:v1" };
const processEndpoint = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision", processRevision: revision };

function canonicalFactoryInput() {
  return {
    journeyBinding: {
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      journey: {
        contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
        stages: [
          { kind: "approved-process", identityRef: revision.revisionRef, provenanceRef: revision.artifactRef },
          { kind: "analysis-definition", identityRef: analysis.identityRef, provenanceRef: revision.revisionRef },
          { kind: "capability-assembly", identityRef: "assembly:pending", provenanceRef: definitionIdentity.identityRef },
          { kind: "validation", identityRef: "validation:pending", provenanceRef: "assembly:pending" },
          { kind: "compiler-release", identityRef: "release:pending", provenanceRef: "validation:pending" },
          { kind: "deployment", identityRef: "deployment:pending", provenanceRef: "release:pending" },
        ],
      },
      lineage: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        processRevision: processEndpoint,
        analysis,
        systemDefinition: definitionIdentity,
        hops: [
          { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision-to-analysis", from: processEndpoint, to: analysis },
          { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis-to-system-definition", from: analysis, to: definitionIdentity },
        ],
      },
    },
    definition: {},
    catalog: [],
    recipeTraceability: {},
    analysisTraceability: {},
    definitionTraceability: {},
    compilerVersion: "1.0.0",
    runtimeVersion: "1.0.0",
    releaseId: "orders-system",
    releaseVersion: "0.0.1",
    publishedAt: "2026-08-31T14:10:00.000Z",
    environment: {},
    acceptanceChecks: [],
    startedAt: "2026-08-31T14:11:00.000Z",
    completedAt: "2026-08-31T14:12:00.000Z",
  };
}

function validBootstrapInput() {
  return {
    contractVersion: FACTORY_OPERATOR_BOOTSTRAP_CONTRACT_VERSION,
    prerequisites: { nodeVersion: "24.7.0", npmVersion: "11.5.1", factoryE2EAvailable: true },
    config: { inputPath: "./factory-input.json" },
    factoryInput: canonicalFactoryInput(),
  };
}

test("TASK-434 validates declared bootstrap prerequisites and canonical factory identity deterministically", () => {
  const input = validBootstrapInput();
  const before = JSON.stringify(input);
  const first = validateFactoryOperatorBootstrap(input);
  const second = validateFactoryOperatorBootstrap(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before, "contract validation must not mutate caller input");
  assert.deepEqual(first.references, {
    processRevisionRef: revision.revisionRef,
    analysisRef: analysis.identityRef,
    systemDefinitionRef: definitionIdentity.identityRef,
  });
  assert.deepEqual(first.config, { inputPath: "./factory-input.json" });
  assert.equal(JSON.stringify(first).includes("definitionTraceability"), false, "result must not echo canonical input payloads");
});

test("TASK-434 fails closed for absent capability, malformed/unknown configuration and protected-value injection", () => {
  const base = validBootstrapInput();

  assert.throws(
    () => validateFactoryOperatorBootstrap({ ...base, prerequisites: { ...base.prerequisites, factoryE2EAvailable: false } }),
    /factoryE2EAvailable must be true/,
  );
  assert.throws(
    () => validateFactoryOperatorBootstrap({ ...base, config: { inputPath: "./factory-input.json", apiToken: "super-secret" } }),
    /config has unexpected field apiToken/,
  );
  assert.throws(
    () => validateFactoryOperatorBootstrap({ ...base, config: { inputPath: "" } }),
    /config\.inputPath must be a non-empty string/,
  );
  assert.throws(
    () => validateFactoryOperatorBootstrap({ ...base, unexpected: true }),
    /bootstrap input has unexpected field unexpected/,
  );
});

test("TASK-434 rejects stale or substituted canonical predecessor before any journey execution surface exists", () => {
  const base = validBootstrapInput();
  const staleFactoryInput = canonicalFactoryInput();
  staleFactoryInput.journeyBinding.journey.stages[2] = {
    ...staleFactoryInput.journeyBinding.journey.stages[2]!,
    provenanceRef: "system-definition:orders:v0",
  };

  assert.throws(
    () => validateFactoryOperatorBootstrap({ ...base, factoryInput: staleFactoryInput }),
    /capability-assembly predecessor does not match canonical system-definition identity/,
  );

  const substitutedFactoryInput = canonicalFactoryInput();
  substitutedFactoryInput.journeyBinding.journey.stages[0] = {
    ...substitutedFactoryInput.journeyBinding.journey.stages[0]!,
    identityRef: "process-revision:billing:v1",
  };
  assert.throws(
    () => validateFactoryOperatorBootstrap({ ...base, factoryInput: substitutedFactoryInput }),
    /approved-process stage does not match canonical process artifact\/revision identity/,
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import { composeFactoryJourney } from "../../packages/assembly/factory-composition.js";
import { SoftwareCatalogRegistry } from "../../packages/catalog/index.js";
import { invokeFactoryE2E, FACTORY_JOURNEY_CONTRACT_VERSION } from "../../packages/contracts/factory-boundary/index.js";
import { PROCESS_SYSTEM_LINEAGE_VERSION } from "../../packages/contracts/process-versioning/lineage.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";
import { composeFactoryCompilerReleaseArtifact } from "../../packages/compiler/factory-composition.js";
import { dryRunDeploy } from "../../packages/deploy/index.js";
import { previewFactoryPublishedRelease } from "../../packages/release/factory-preview.js";
import { composeFactoryAssemblyValidation } from "../../packages/validation/factory-composition.js";

const revision = { contractVersion: PROCESS_VERSION_IDENTITY_VERSION, artifactRef: "process:orders", revisionRef: "process-revision:orders:v1", revisionNumber: 1, previousRevisionRef: null };
const analysis = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis" as const, identityRef: "analysis:orders:v1" };
const definitionIdentity = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition" as const, identityRef: "system-definition:orders:v1" };
const processEndpoint = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision" as const, processRevision: revision };
const journeyBinding = {
  contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
  journey: { contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION, stages: [
    { kind: "approved-process", identityRef: revision.revisionRef, provenanceRef: revision.artifactRef },
    { kind: "analysis-definition", identityRef: analysis.identityRef, provenanceRef: revision.revisionRef },
    { kind: "capability-assembly", identityRef: "assembly:pending", provenanceRef: definitionIdentity.identityRef },
    { kind: "validation", identityRef: "validation:pending", provenanceRef: "assembly:pending" },
    { kind: "compiler-release", identityRef: "release:pending", provenanceRef: "validation:pending" },
    { kind: "deployment", identityRef: "deployment:pending", provenanceRef: "release:pending" },
  ] },
  lineage: { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, processRevision: processEndpoint, analysis, systemDefinition: definitionIdentity, hops: [
    { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision-to-analysis" as const, from: processEndpoint, to: analysis },
    { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis-to-system-definition" as const, from: analysis, to: definitionIdentity },
  ] as const },
};
const definition = { definition: "SystemDefinition" as const, analysisRef: analysis.identityRef, recipeRef: revision.revisionRef, capabilities: [{ id: "orders", capability: "orders", requirementRefs: ["REQ-1"] }] };
const recipeTraceability = { modules: [{ requirementIds: ["REQ-1"] }], rules: [], responsibilities: [], exceptions: [] };
const analysisTraceability = { findings: [{ recipeRequirementRefs: ["REQ-1"] }] };
const definitionTraceability = { entities: [], processes: [], actions: [], capabilities: [{ capability: "orders", requirementRefs: ["REQ-1"] }], views: [], policies: [], integrations: [] };
const environment = { kind: "EnvironmentProfile" as const, environmentRef: "environment:p19:e2e", runtimeVersions: ["1.0.0"], bindings: [] };

function catalog() { const registry = new SoftwareCatalogRegistry(); registry.register({ capability: "orders", provider: "builtin", version: "1.0.0" }); return registry; }
function input() { return { journeyBinding, definition, catalog: catalog(), recipeTraceability, analysisTraceability, definitionTraceability, compilerVersion: "1.0.0", runtimeVersion: "1.0.0", releaseId: "orders-system", releaseVersion: "0.0.1", publishedAt: "2026-08-31T14:10:00.000Z", environment, acceptanceChecks: [{ name: "factory-e2e", pass: true }], startedAt: "2026-08-31T14:11:00.000Z", completedAt: "2026-08-31T14:12:00.000Z" }; }

const operations = {
  assemble: (request: Readonly<Record<string, unknown>>) => composeFactoryJourney(request as Parameters<typeof composeFactoryJourney>[0]),
  validate: (request: Readonly<Record<string, unknown>>) => composeFactoryAssemblyValidation(request as Parameters<typeof composeFactoryAssemblyValidation>[0]),
  compile: (request: Readonly<Record<string, unknown>>) => composeFactoryCompilerReleaseArtifact(request as Parameters<typeof composeFactoryCompilerReleaseArtifact>[0]),
  previewRelease: (request: Readonly<Record<string, unknown>>) => previewFactoryPublishedRelease(request as Parameters<typeof previewFactoryPublishedRelease>[0]),
  dryRunDeployment: (request: Readonly<Record<string, unknown>>) => {
    const published = request.publishedRelease as ReturnType<typeof previewFactoryPublishedRelease>;
    const artifact = request.releaseArtifact as ReturnType<typeof composeFactoryCompilerReleaseArtifact>["compilation"]["artifact"];
    return dryRunDeploy({
      publishedRelease: { kind: published.kind, releaseId: published.releaseId, version: published.version, artifactRef: published.artifactRef, artifactHash: published.artifactHash, validationEvidenceRef: published.validationEvidenceRef, publishedAt: published.publishedAt, status: published.status },
      releaseArtifact: { kind: artifact.kind, artifactHash: artifact.artifactHash, manifest: { runtimeVersion: artifact.manifest.runtimeVersion }, environmentSchema: artifact.environmentSchema },
      environment: request.environment as typeof environment,
      acceptanceChecks: request.acceptanceChecks as readonly { name: string; pass: boolean }[],
      startedAt: request.startedAt as string,
      completedAt: request.completedAt as string,
    });
  },
};

function captureFailure(action: () => unknown): string {
  try {
    action();
  } catch (error) {
    assert.ok(error instanceof Error);
    return error.message;
  }
  assert.fail("expected factory E2E invocation to fail closed");
}

test("factory E2E primitive invokes the real composed path and returns auditable deterministic lineage", () => {
  const first = invokeFactoryE2E(input(), operations);
  const second = invokeFactoryE2E(input(), operations);
  assert.deepEqual(first, second);
  assert.equal(first.binding.references.systemDefinitionRef, definitionIdentity.identityRef);
  assert.equal(first.binding.references.publishedReleaseRef, "orders-system");
  assert.equal((first.deploymentRecord as { publishedReleaseRef: string }).publishedReleaseRef, "orders-system@0.0.1");
});

test("factory E2E boundary rejects missing, stale, cross-system and lineage-broken predecessors deterministically before successor operations", () => {
  const cases: ReadonlyArray<Readonly<{ name: string; binding: unknown; expected: RegExp }>> = [
    {
      name: "missing canonical predecessor",
      binding: {
        ...journeyBinding,
        journey: {
          ...journeyBinding.journey,
          stages: journeyBinding.journey.stages.map((stage, index) => index === 2 ? { ...stage, provenanceRef: "" } : stage),
        },
      },
      expected: /stages\[2\]\.provenanceRef must be a non-empty string/,
    },
    {
      name: "stale or incompatible predecessor",
      binding: {
        ...journeyBinding,
        journey: {
          ...journeyBinding.journey,
          stages: journeyBinding.journey.stages.map((stage, index) => index === 2 ? { ...stage, provenanceRef: "system-definition:orders:v0" } : stage),
        },
      },
      expected: /capability-assembly predecessor does not match canonical system-definition identity/,
    },
    {
      name: "cross-system substituted predecessor",
      binding: {
        ...journeyBinding,
        journey: {
          ...journeyBinding.journey,
          stages: journeyBinding.journey.stages.map((stage, index) => index === 0 ? { ...stage, identityRef: "process-revision:billing:v1" } : stage),
        },
      },
      expected: /approved-process stage does not match canonical process artifact\/revision identity/,
    },
    {
      name: "lineage-broken predecessor",
      binding: {
        ...journeyBinding,
        lineage: {
          ...journeyBinding.lineage,
          hops: [
            journeyBinding.lineage.hops[0],
            {
              ...journeyBinding.lineage.hops[1],
              from: { ...analysis, identityRef: "analysis:billing:v1" },
            },
          ],
        },
      },
      expected: /analysis-to-definition hop does not match declared endpoints/,
    },
  ];

  for (const scenario of cases) {
    let successorCalls = 0;
    const guarded: typeof operations = {
      assemble: (request) => { successorCalls += 1; return operations.assemble(request); },
      validate: (request) => { successorCalls += 1; return operations.validate(request); },
      compile: (request) => { successorCalls += 1; return operations.compile(request); },
      previewRelease: (request) => { successorCalls += 1; return operations.previewRelease(request); },
      dryRunDeployment: (request) => { successorCalls += 1; return operations.dryRunDeployment(request); },
    };

    const first = captureFailure(() => invokeFactoryE2E({ ...input(), journeyBinding: scenario.binding }, guarded));
    const second = captureFailure(() => invokeFactoryE2E({ ...input(), journeyBinding: scenario.binding }, guarded));
    assert.match(first, scenario.expected, scenario.name);
    assert.equal(second, first, `${scenario.name} must preserve deterministic failure semantics`);
    assert.equal(successorCalls, 0, `${scenario.name} must not invoke successor operations`);
  }
});

test("factory E2E primitive fails closed for substituted canonical analysis identity before side effects", () => {
  let downstreamCalls = 0;
  const guarded = { ...operations, validate: (request: Readonly<Record<string, unknown>>) => { downstreamCalls += 1; return operations.validate(request); } };
  assert.throws(() => invokeFactoryE2E({ ...input(), definition: { ...definition, analysisRef: "analysis:substituted" } }, guarded), /FACTORY_COMPOSITION_ANALYSIS_IDENTITY_MISMATCH/);
  assert.equal(downstreamCalls, 0);
});

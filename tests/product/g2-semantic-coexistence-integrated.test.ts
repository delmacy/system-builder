import assert from "node:assert/strict";
import test from "node:test";

import {
  PROCESS_VERSION_IDENTITY_VERSION,
  normalizeProcessRevisionIdentity,
} from "../../packages/contracts/process-versioning/index.js";
import {
  EVIDENCE_PROVENANCE_EXTENSION_VERSION,
  normalizeEvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";
import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  normalizeFactoryJourneyEnvelope,
} from "../../packages/contracts/factory-boundary/index.js";
import {
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeCurrentnessQualification,
  normalizeDefinitionRevisionRef,
  normalizeTypedSemanticGraph,
} from "../../packages/contracts/semantic-substrate/index.js";

const processRevisionInput = {
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef: "process:orders",
  revisionRef: "process:orders:r2",
  revisionNumber: 2,
  previousRevisionRef: "process:orders:r1",
} as const;

const evidenceInput = {
  extensionVersion: EVIDENCE_PROVENANCE_EXTENSION_VERSION,
  evidenceId: "urn:system-builder:evidence:orders-observation",
  sources: [
    {
      sourceId: "shared-provider-value",
      sourceType: "provider-event",
      capturedAt: "2026-09-07T21:10:00Z",
      correlationRef: "urn:provider:event:orders:42",
    },
  ],
  classification: { label: "observed", confidence: 0.4 },
  transformations: [
    {
      descriptorId: "provider-normalization",
      descriptorVersion: "1.0.0",
      provider: { id: "shared-provider-value" },
    },
  ],
  lineage: { predecessorEvidenceIds: ["urn:system-builder:evidence:orders-prior"] },
} as const;

const factoryJourneyInput = {
  contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
  stages: [
    { kind: "approved-process", identityRef: "process:orders:r2", provenanceRef: "process:orders" },
    { kind: "analysis-definition", identityRef: "analysis:orders:r2", provenanceRef: "process:orders:r2" },
    { kind: "capability-assembly", identityRef: "assembly:orders:r2", provenanceRef: "system-definition:orders:r2" },
    { kind: "validation", identityRef: "validation:orders:r2", provenanceRef: "assembly:orders:r2" },
    { kind: "compiler-release", identityRef: "release:orders:r2", provenanceRef: "validation:orders:r2" },
    { kind: "deployment", identityRef: "deployment:orders:r2", provenanceRef: "release:orders:r2" },
  ],
} as const;

const processSemantic = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "process-versioning",
  semanticKind: "process-definition",
  canonicalRef: processRevisionInput.artifactRef,
  definitionRef: processRevisionInput.artifactRef,
  revisionOwner: "process-versioning",
  revisionDimension: "process-revision",
  revisionRef: processRevisionInput.revisionRef,
} as const;

const evidenceSemantic = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "evidence-provenance",
  semanticKind: "evidence-record",
  canonicalRef: evidenceInput.evidenceId,
  definitionRef: evidenceInput.evidenceId,
  revisionOwner: "evidence-provenance",
  revisionDimension: "evidence-capture",
  revisionRef: "urn:system-builder:evidence:capture:1",
} as const;

const factorySemantic = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "factory-boundary",
  semanticKind: "factory-journey",
  canonicalRef: "factory-journey:orders:r2",
  definitionRef: "factory-journey:orders",
  revisionOwner: "factory-boundary",
  revisionDimension: "factory-journey",
  revisionRef: "r2",
} as const;

function currentness(
  subject: typeof processSemantic | typeof evidenceSemantic | typeof factorySemantic,
  state: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT",
  localityScope: string,
) {
  return {
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    subject,
    revisionVector: [
      {
        revisionOwner: subject.revisionOwner,
        revisionDimension: subject.revisionDimension,
        revisionRef: subject.revisionRef,
      },
    ],
    temporal: {
      occurredAt: null,
      observedAt: "2026-09-07T21:20:00Z",
      evaluatedAt: "2026-09-07T21:21:00Z",
      effectiveFrom: null,
      effectiveUntil: null,
      reconciledAt: null,
    },
    populationScope: subject.canonicalRef,
    localityScope,
    currentnessHorizon: {
      assessedAt: "2026-09-07T21:21:00Z",
      validUntil: "2026-09-07T22:21:00Z",
    },
    state,
    reason: `${subject.semanticOwner} qualification is ${state.toLowerCase()}`,
  } as const;
}

function composeIntegratedView(input: {
  processSemantic?: unknown;
  evidenceSemantic?: unknown;
  factorySemantic?: unknown;
  evidenceCurrentnessState?: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT";
  factoryCurrentnessState?: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT";
}) {
  const processRevision = normalizeProcessRevisionIdentity(processRevisionInput);
  const evidence = normalizeEvidenceProvenanceExtension(evidenceInput);
  const factoryJourney = normalizeFactoryJourneyEnvelope(factoryJourneyInput);

  const process = normalizeDefinitionRevisionRef(input.processSemantic ?? processSemantic);
  const evidenceRef = normalizeDefinitionRevisionRef(input.evidenceSemantic ?? evidenceSemantic);
  const factory = normalizeDefinitionRevisionRef(input.factorySemantic ?? factorySemantic);

  if (process.semanticOwner !== "process-versioning" || process.canonicalRef !== processRevision.artifactRef || process.revisionRef !== processRevision.revisionRef) {
    throw new Error("process semantic qualification must preserve process-versioning identity and revision");
  }
  if (evidenceRef.semanticOwner !== "evidence-provenance" || evidenceRef.canonicalRef !== evidence.evidenceId) {
    throw new Error("evidence semantic qualification must preserve evidence-provenance identity");
  }
  if (factory.semanticOwner !== "factory-boundary") {
    throw new Error("factory semantic qualification must preserve factory-boundary ownership");
  }

  const evidenceCurrentness = normalizeCurrentnessQualification(
    currentness(evidenceSemantic, input.evidenceCurrentnessState ?? "UNKNOWN", "provider:remote"),
  );
  const factoryCurrentness = normalizeCurrentnessQualification(
    currentness(factorySemantic, input.factoryCurrentnessState ?? "STALE", "station:alpha"),
  );

  const graph = normalizeTypedSemanticGraph({
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    nodes: [
      { ref: process, metadata: { authority: "process-versioning" } },
      { ref: evidenceRef, metadata: { authority: "evidence-provenance" } },
      { ref: factory, metadata: { authority: "factory-boundary" } },
    ],
    relations: [
      {
        relationKind: "derives_from",
        source: evidenceRef,
        target: process,
        metadata: { meaning: "evidence observes process context; no truth promotion" },
      },
      {
        relationKind: "depends_on",
        source: factory,
        target: process,
        metadata: { meaning: "factory consumes approved process; no reverse authority" },
      },
    ],
  });

  return Object.freeze({ processRevision, evidence, factoryJourney, process, evidenceRef, factory, evidenceCurrentness, factoryCurrentness, graph });
}

test("three historical G1 owners remain independently interpretable while G2 adds qualification", () => {
  const view = composeIntegratedView({});

  assert.equal(view.processRevision.artifactRef, "process:orders");
  assert.equal(view.processRevision.revisionRef, "process:orders:r2");
  assert.equal(view.evidence.evidenceId, "urn:system-builder:evidence:orders-observation");
  assert.equal(view.evidence.classification?.label, "observed");
  assert.equal(view.evidence.classification?.confidence, 0.4);
  assert.deepEqual(view.evidence.lineage.predecessorEvidenceIds, ["urn:system-builder:evidence:orders-prior"]);
  assert.equal(view.factoryJourney.stages[4]!.identityRef, "release:orders:r2");
  assert.equal(view.factoryJourney.stages[5]!.provenanceRef, "release:orders:r2");

  assert.equal(view.process.canonicalRef, view.processRevision.artifactRef);
  assert.equal(view.evidenceRef.canonicalRef, view.evidence.evidenceId);
  assert.equal(view.factory.semanticOwner, "factory-boundary");
  assert.deepEqual(view.graph.nodes.map((node) => node.ref.semanticOwner), ["evidence-provenance", "factory-boundary", "process-versioning"]);
});

test("provenance, truth, currentness and authority remain distinct across owners and localities", () => {
  const view = composeIntegratedView({ evidenceCurrentnessState: "UNKNOWN", factoryCurrentnessState: "STALE" });

  assert.equal(view.evidence.classification?.label, "observed");
  assert.equal(view.evidence.classification?.confidence, 0.4);
  assert.equal(view.evidenceCurrentness.state, "UNKNOWN");
  assert.equal(view.evidenceCurrentness.localityScope, "provider:remote");
  assert.equal(view.factoryCurrentness.state, "STALE");
  assert.equal(view.factoryCurrentness.localityScope, "station:alpha");

  for (const ref of [view.process, view.evidenceRef, view.factory]) {
    assert.equal("truth" in ref, false);
    assert.equal("authority" in ref, false);
    assert.equal("executionAuthority" in ref, false);
  }
  assert.equal(view.factoryJourney.stages[5]!.identityRef, "deployment:orders:r2");
});

test("equal external/provider values do not collapse owner-qualified canonical or revision identity", () => {
  const view = composeIntegratedView({});
  const external = view.evidence.sources[0]!.sourceId;
  const provider = view.evidence.transformations[0]!.provider!.id;

  assert.equal(external, provider);
  assert.notEqual(external, view.evidence.evidenceId);
  assert.notEqual(view.evidenceRef.revisionRef, view.evidenceRef.canonicalRef);
  assert.notEqual(view.evidenceRef.semanticOwner, view.process.semanticOwner);
  assert.notEqual(view.factory.semanticOwner, view.process.semanticOwner);
});

test("owner and revision substitution fail closed without rewriting canonical G1 keys", () => {
  assert.throws(
    () => composeIntegratedView({ processSemantic: { ...processSemantic, semanticOwner: "factory-boundary" } }),
    /must preserve process-versioning identity and revision/,
  );
  assert.throws(
    () => composeIntegratedView({ processSemantic: { ...processSemantic, revisionRef: "process:orders:r3" } }),
    /must preserve process-versioning identity and revision/,
  );
  assert.throws(
    () => composeIntegratedView({ evidenceSemantic: { ...evidenceSemantic, semanticOwner: "provider" } }),
    /must preserve evidence-provenance identity/,
  );

  const canonicalProcess = normalizeProcessRevisionIdentity(processRevisionInput);
  const canonicalEvidence = normalizeEvidenceProvenanceExtension(evidenceInput);
  assert.equal(canonicalProcess.revisionRef, "process:orders:r2");
  assert.equal(canonicalEvidence.evidenceId, "urn:system-builder:evidence:orders-observation");
});

test("typed edges are directional and do not imply reverse authority", () => {
  const view = composeIntegratedView({});
  const edges = view.graph.relations.map((edge) => `${edge.source.semanticOwner}:${edge.relationKind}:${edge.target.semanticOwner}`);

  assert.deepEqual(edges, [
    "evidence-provenance:derives_from:process-versioning",
    "factory-boundary:depends_on:process-versioning",
  ]);
  assert.equal(edges.includes("process-versioning:depends_on:factory-boundary"), false);
  assert.equal(edges.includes("process-versioning:derives_from:evidence-provenance"), false);
});

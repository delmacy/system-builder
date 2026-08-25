import assert from "node:assert/strict";
import test from "node:test";
import { compileSyntheticRelease } from "../../packages/compiler/index.js";
import {
  normalizeEvidenceProvenanceExtension,
  type EvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";

const assemblyPlan = {
  kind: "AssemblyPlan" as const,
  systemDefinitionRef: "system-definition:p14-provenance:1",
  components: [{ capability: "workflow.engine", provider: "provider-a", version: "1.0.0" }],
  sourceRefs: ["system-definition:p14-provenance:1"],
  contentHash: `sha256:${"a".repeat(64)}`,
};

const validationEvidence = {
  kind: "ValidationEvidence" as const,
  assemblyPlanRef: assemblyPlan.contentHash,
  decision: "PASS" as const,
  evidenceHash: `sha256:${"b".repeat(64)}`,
};

const baseInput = {
  assemblyPlan,
  validationEvidence,
  compilerVersion: "14.0.0",
  runtimeVersion: "14.0.0",
};

const provenance: EvidenceProvenanceExtension = {
  extensionVersion: "1.0.0",
  evidenceId: "urn:evidence:compiler-output",
  sources: [
    {
      sourceId: "urn:source:zeta",
      sourceType: "document",
      correlationRef: "urn:correlation:batch-7",
      locationHint: "https://example.invalid/evidence/zeta",
    },
    {
      sourceId: "urn:source:alpha",
      sourceType: "artifact",
      capturedAt: "2026-08-25T05:00:00Z",
      authorRef: "actor:planner",
    },
  ],
  classification: { label: "verified", confidence: 0.98 },
  transformations: [
    {
      descriptorId: "compiler.release",
      descriptorVersion: "1.0.0",
      tool: { id: "system-builder.compiler", version: "14.0.0" },
    },
  ],
  lineage: {
    predecessorEvidenceIds: ["urn:evidence:validation", "urn:evidence:assembly"],
  },
};

test("compiler propagates canonical normalized evidence provenance deterministically", () => {
  const first = compileSyntheticRelease({ ...baseInput, evidenceProvenance: provenance });
  const second = compileSyntheticRelease({
    ...baseInput,
    evidenceProvenance: {
      ...provenance,
      sources: [...provenance.sources].reverse(),
      lineage: { predecessorEvidenceIds: [...provenance.lineage.predecessorEvidenceIds].reverse() },
    },
  });

  assert.deepEqual(first, second);
  assert.deepEqual(first.artifact.evidenceProvenance, normalizeEvidenceProvenanceExtension(provenance));
  assert.deepEqual(first.artifact.evidenceProvenance?.sources.map((source) => source.sourceId), [
    "urn:source:alpha",
    "urn:source:zeta",
  ]);
  assert.deepEqual(first.artifact.evidenceProvenance?.lineage.predecessorEvidenceIds, [
    "urn:evidence:assembly",
    "urn:evidence:validation",
  ]);
  assert.equal(first.artifact.evidenceProvenance?.classification?.confidence, 0.98);
  assert.match(first.artifact.artifactHash, /^sha256:[a-f0-9]{64}$/);
});

test("compiler preserves historical ReleaseArtifact shape when provenance is absent", () => {
  const first = compileSyntheticRelease(baseInput);
  const second = compileSyntheticRelease(baseInput);

  assert.deepEqual(first, second);
  assert.equal("evidenceProvenance" in first.artifact, false);
  assert.equal(JSON.stringify(first).includes("evidenceProvenance"), false);
});

test("compiler rejects malformed explicit evidence provenance", () => {
  const unsupportedVersion = {
    ...provenance,
    extensionVersion: "2.0.0",
  } as unknown as EvidenceProvenanceExtension;
  assert.throws(
    () => compileSyntheticRelease({ ...baseInput, evidenceProvenance: unsupportedVersion }),
    /unsupported version/,
  );

  const unexpectedSensitiveField = {
    ...provenance,
    sources: [
      {
        sourceId: "urn:source:unsafe",
        sourceType: "document",
        credential: "do-not-propagate",
      },
    ],
  } as unknown as EvidenceProvenanceExtension;
  assert.throws(
    () => compileSyntheticRelease({ ...baseInput, evidenceProvenance: unexpectedSensitiveField }),
    /unexpected field credential/,
  );
});

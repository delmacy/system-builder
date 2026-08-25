import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeEvidenceProvenanceExtension,
  type EvidenceProvenanceExtension,
} from "../../packages/contracts/evidence-provenance/index.js";
import { computeEvidenceProvenanceIntegrity } from "../../packages/contracts/evidence-provenance/integrity-digest.js";
import { verifyEvidenceProvenanceIntegrity } from "../../packages/contracts/evidence-provenance/integrity-verify.js";
import { buildEvidenceNavigationIndex } from "../../packages/contracts/evidence-provenance/navigation-index.js";
import { queryEvidenceBySource } from "../../packages/contracts/evidence-provenance/source-to-evidence-navigation.js";
import { querySourcesByEvidence } from "../../packages/contracts/evidence-provenance/evidence-to-source-navigation.js";

const caseSourceId = "urn:system-builder:source:case-42";
const artifactSourceId = "urn:system-builder:source:artifact-17";
const parentEvidenceId = "urn:system-builder:evidence:stage-a";
const childEvidenceId = "urn:system-builder:evidence:stage-b";
const storageHint = "s3://private-bucket/private-key";
const providerId = "provider-x";
const secretReference = "secret://p14/navigation-proof";

function attachIntegrity(input: EvidenceProvenanceExtension): EvidenceProvenanceExtension {
  return normalizeEvidenceProvenanceExtension({
    ...input,
    integrity: computeEvidenceProvenanceIntegrity(input),
  });
}

function representativeLineage(): readonly EvidenceProvenanceExtension[] {
  const parent: EvidenceProvenanceExtension = {
    extensionVersion: "1.0.0",
    evidenceId: parentEvidenceId,
    sources: [{ sourceId: caseSourceId, sourceType: "external.case-file" }],
    transformations: [],
    lineage: { predecessorEvidenceIds: [] },
  };
  const child: EvidenceProvenanceExtension = {
    extensionVersion: "1.0.0",
    evidenceId: childEvidenceId,
    sources: [{
      sourceId: artifactSourceId,
      sourceType: "artifact",
      locationHint: storageHint,
    }],
    transformations: [{
      descriptorId: "compiler.release",
      descriptorVersion: "1.0.0",
      provider: { id: providerId },
    }],
    lineage: { predecessorEvidenceIds: [parentEvidenceId] },
  };
  return [attachIntegrity(parent), attachIntegrity(child)];
}

test("P14 growing proof navigates representative provenance bidirectionally", () => {
  const records = representativeLineage();
  const index = buildEvidenceNavigationIndex(records);

  assert.deepEqual(queryEvidenceBySource(index, caseSourceId), {
    sourceId: caseSourceId,
    found: true,
    evidenceIds: [parentEvidenceId],
  });
  assert.deepEqual(queryEvidenceBySource(index, artifactSourceId), {
    sourceId: artifactSourceId,
    found: true,
    evidenceIds: [childEvidenceId],
  });
  assert.deepEqual(querySourcesByEvidence(index, childEvidenceId), {
    evidenceId: childEvidenceId,
    found: true,
    sourceIds: [artifactSourceId],
  });
  assert.deepEqual(index.projections.find((projection) => projection.evidenceId === childEvidenceId)?.predecessorEvidenceIds, [parentEvidenceId]);
});

test("P14 growing proof is deterministic across equivalent reordered input and serialization", () => {
  const records = representativeLineage();
  const forward = buildEvidenceNavigationIndex(records);
  const reversed = buildEvidenceNavigationIndex([...records].reverse());

  assert.deepEqual(reversed, forward);
  assert.deepEqual(JSON.parse(JSON.stringify(forward)), forward);
});

test("P14 growing proof preserves integrity compatibility without leaking non-navigation metadata", () => {
  const records = representativeLineage();
  for (const record of records) {
    assert.equal(verifyEvidenceProvenanceIntegrity(record).status, "verified");
  }

  const index = buildEvidenceNavigationIndex(records);
  const serialized = JSON.stringify(index);
  for (const forbidden of [storageHint, providerId, secretReference]) {
    assert.equal(serialized.includes(forbidden), false);
  }
});

test("P14 growing proof keeps missing and conflicting cases fail-closed", () => {
  const records = representativeLineage();
  const index = buildEvidenceNavigationIndex(records);
  const missingSource = "urn:system-builder:source:missing";
  const missingEvidence = "urn:system-builder:evidence:missing";

  assert.deepEqual(queryEvidenceBySource(index, missingSource), {
    sourceId: missingSource,
    found: false,
    evidenceIds: [],
  });
  assert.deepEqual(querySourcesByEvidence(index, missingEvidence), {
    evidenceId: missingEvidence,
    found: false,
    sourceIds: [],
  });
  assert.throws(() => buildEvidenceNavigationIndex([records[0]!, records[0]!]), /duplicate evidenceId/);
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  PROCESS_VERSION_IDENTITY_VERSION,
  guardImmutablePublishedRevision,
  normalizeProcessArtifactIdentity,
  normalizeProcessRevisionIdentity,
  normalizeProcessRevisionLifecycleDescriptor,
  normalizeProcessRevisionPublicationEvidence,
  validateProcessRevisionLineage,
} from "../../packages/contracts/process-versioning/index.js";

const artifactRef = "process:orders";

function publication(
  revisionNumber: number,
  revisionRef: string,
  previousRevisionRef: string | null,
  immutableContentRef: string,
  artifact = artifactRef,
) {
  return normalizeProcessRevisionPublicationEvidence({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: artifact,
    revisionRef,
    revisionNumber,
    previousRevisionRef,
    immutableContentRef,
  });
}

function lifecycle(
  revisionNumber: number,
  revisionRef: string,
  previousRevisionRef: string | null,
  lifecycleState: "active" | "deprecated" | "archived",
  supersedesRevisionRef: string | null,
  artifact = artifactRef,
) {
  return normalizeProcessRevisionLifecycleDescriptor({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: artifact,
    revisionRef,
    revisionNumber,
    previousRevisionRef,
    lifecycleState,
    supersedesRevisionRef,
  });
}

test("WBS 18.1 growing proof composes stable artifact identity through multiple immutable revisions and lifecycle", () => {
  const artifact = normalizeProcessArtifactIdentity({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef,
  });
  const revision1 = normalizeProcessRevisionIdentity({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: artifact.artifactRef,
    revisionRef: `${artifact.artifactRef}@1`,
    revisionNumber: 1,
    previousRevisionRef: null,
  });
  const revision2 = normalizeProcessRevisionIdentity({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: artifact.artifactRef,
    revisionRef: `${artifact.artifactRef}@2`,
    revisionNumber: 2,
    previousRevisionRef: revision1.revisionRef,
  });
  const revision3 = normalizeProcessRevisionIdentity({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: artifact.artifactRef,
    revisionRef: `${artifact.artifactRef}@3`,
    revisionNumber: 3,
    previousRevisionRef: revision2.revisionRef,
  });

  assert.equal(revision1.artifactRef, artifact.artifactRef);
  assert.equal(revision2.artifactRef, artifact.artifactRef);
  assert.equal(revision3.artifactRef, artifact.artifactRef);
  assert.notEqual(revision1.revisionRef, revision2.revisionRef);
  assert.notEqual(revision2.revisionRef, revision3.revisionRef);

  const published1 = publication(1, revision1.revisionRef, null, "sha256:orders-v1");
  const published2 = publication(2, revision2.revisionRef, revision1.revisionRef, "sha256:orders-v2");
  const published3 = publication(3, revision3.revisionRef, revision2.revisionRef, "sha256:orders-v3");

  assert.deepEqual(guardImmutablePublishedRevision(published2, { ...published2 }), {
    status: "idempotent",
    revisionRef: revision2.revisionRef,
    immutableContentRef: "sha256:orders-v2",
  });
  assert.throws(
    () => guardImmutablePublishedRevision(published2, { ...published2, immutableContentRef: "sha256:orders-v2-mutated" }),
    /overwrite conflict on immutableContentRef/,
  );

  const lineage = [
    { publication: published1, lifecycle: lifecycle(1, revision1.revisionRef, null, "deprecated", null) },
    {
      publication: published2,
      lifecycle: lifecycle(2, revision2.revisionRef, revision1.revisionRef, "archived", revision1.revisionRef),
    },
    {
      publication: published3,
      lifecycle: lifecycle(3, revision3.revisionRef, revision2.revisionRef, "active", revision2.revisionRef),
    },
  ];

  assert.deepEqual(validateProcessRevisionLineage(lineage), {
    artifactRef,
    revisionRefs: [revision1.revisionRef, revision2.revisionRef, revision3.revisionRef],
  });
});

test("WBS 18.1 growing proof fails closed on malformed cross-artifact cyclic/contradictory lineage", () => {
  const first = publication(1, "process:orders@1", null, "sha256:orders-v1");

  assert.throws(
    () => validateProcessRevisionLineage([
      { publication: first, lifecycle: lifecycle(1, "process:orders@1", null, "archived", null) },
      {
        publication: publication(2, "process:payments@2", "process:orders@1", "sha256:payments-v2", "process:payments"),
        lifecycle: lifecycle(2, "process:payments@2", "process:orders@1", "active", "process:orders@1", "process:payments"),
      },
    ]),
    /cross-artifact revision/,
  );

  assert.throws(
    () => validateProcessRevisionLineage([
      { publication: first, lifecycle: lifecycle(1, "process:orders@1", null, "archived", null) },
      {
        publication: publication(2, "process:orders@2", "process:orders@1", "sha256:orders-v2"),
        lifecycle: lifecycle(2, "process:orders@2", "process:orders@1", "active", "process:orders@3"),
      },
      {
        publication: publication(3, "process:orders@3", "process:orders@2", "sha256:orders-v3"),
        lifecycle: lifecycle(3, "process:orders@3", "process:orders@2", "active", "process:orders@2"),
      },
    ]),
    /supersedesRevisionRef must reference the immediately preceding revision/,
  );

  assert.throws(
    () => validateProcessRevisionLineage([
      { publication: first, lifecycle: lifecycle(1, "process:orders@1", null, "active", null) },
      {
        publication: publication(2, "process:orders@2", "process:orders@1", "sha256:orders-v2"),
        lifecycle: lifecycle(2, "process:orders@2", "process:orders@1", "active", "process:orders@1"),
      },
    ]),
    /cannot supersede a revision that remains active/,
  );

  assert.throws(
    () => validateProcessRevisionLineage([{
      publication: first,
      lifecycle: lifecycle(1, "process:orders@1", null, "active", null),
      semanticClassification: "breaking",
    }]),
    /unexpected field semanticClassification/,
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  PROCESS_VERSION_IDENTITY_VERSION,
  guardImmutablePublishedRevision,
  normalizeProcessArtifactIdentity,
  normalizeProcessRevisionIdentity,
  normalizeProcessRevisionLifecycleDescriptor,
  normalizeProcessRevisionPublicationEvidence,
} from "../../packages/contracts/process-versioning/index.js";

test("process version identity keeps stable artifact and immutable revision identities distinct", () => {
  const artifact = normalizeProcessArtifactIdentity({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: " process:orders ",
  });
  const revision = normalizeProcessRevisionIdentity({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: " process:orders ",
    revisionRef: " process:orders@1 ",
    revisionNumber: 1,
    previousRevisionRef: null,
  });

  assert.deepEqual(artifact, {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
  });
  assert.equal(revision.artifactRef, artifact.artifactRef);
  assert.notEqual(revision.revisionRef, artifact.artifactRef);
  assert.equal(revision.revisionNumber, 1);
});

test("process revision normalization is deterministic and payload-minimal", () => {
  const input = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process:orders@2",
    revisionNumber: 2,
    previousRevisionRef: " process:orders@1 ",
  } as const;
  assert.deepEqual(normalizeProcessRevisionIdentity(input), normalizeProcessRevisionIdentity({ ...input }));
  assert.deepEqual(Object.keys(normalizeProcessRevisionIdentity(input)), [
    "contractVersion",
    "artifactRef",
    "revisionRef",
    "revisionNumber",
    "previousRevisionRef",
  ]);
});

test("process revision identity fails closed on extra state and invalid lineage", () => {
  assert.throws(
    () => normalizeProcessRevisionIdentity({
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: "process:orders",
      revisionRef: "process:orders@1",
      revisionNumber: 1,
      previousRevisionRef: null,
      payload: { secret: true },
    }),
    /unexpected field payload/,
  );
  assert.throws(
    () => normalizeProcessRevisionIdentity({
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: "process:orders",
      revisionRef: "process:orders@2",
      revisionNumber: 2,
      previousRevisionRef: null,
    }),
    /successor revision must declare previousRevisionRef/,
  );
  assert.throws(
    () => normalizeProcessRevisionIdentity({
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: "same",
      revisionRef: "same",
      revisionNumber: 1,
      previousRevisionRef: null,
    }),
    /must be distinct/,
  );
});

test("Git metadata cannot replace canonical business identity fields", () => {
  assert.throws(
    () => normalizeProcessRevisionIdentity({
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      gitSha: "abc123",
      revisionNumber: 1,
      previousRevisionRef: null,
    }),
    /unexpected field gitSha|missing field artifactRef/,
  );
});

test("published revision guard recognizes identical publication deterministically as idempotent", () => {
  const publication = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process:orders@2",
    revisionNumber: 2,
    previousRevisionRef: "process:orders@1",
    immutableContentRef: "sha256:orders-v2",
  } as const;

  assert.deepEqual(
    normalizeProcessRevisionPublicationEvidence(publication),
    normalizeProcessRevisionPublicationEvidence({ ...publication }),
  );
  assert.deepEqual(guardImmutablePublishedRevision(publication, { ...publication }), {
    status: "idempotent",
    revisionRef: "process:orders@2",
    immutableContentRef: "sha256:orders-v2",
  });
});

test("published revision guard rejects conflicting immutable content overwrite", () => {
  const published = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process:orders@2",
    revisionNumber: 2,
    previousRevisionRef: "process:orders@1",
    immutableContentRef: "sha256:orders-v2",
  } as const;

  assert.throws(
    () => guardImmutablePublishedRevision(published, {
      ...published,
      immutableContentRef: "sha256:mutated-orders-v2",
    }),
    /overwrite conflict on immutableContentRef/,
  );
});

test("published revision guard rejects conflicting immutable revision identity", () => {
  const published = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process:orders@2",
    revisionNumber: 2,
    previousRevisionRef: "process:orders@1",
    immutableContentRef: "sha256:orders-v2",
  } as const;

  assert.throws(
    () => guardImmutablePublishedRevision(published, {
      ...published,
      previousRevisionRef: "process:orders@0",
    }),
    /overwrite conflict on previousRevisionRef/,
  );
});

test("publication evidence is payload-minimal and rejects Git or payload injection", () => {
  assert.throws(
    () => normalizeProcessRevisionPublicationEvidence({
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: "process:orders",
      revisionRef: "process:orders@1",
      revisionNumber: 1,
      previousRevisionRef: null,
      immutableContentRef: "sha256:orders-v1",
      gitSha: "abc123",
    }),
    /unexpected field gitSha/,
  );
  assert.throws(
    () => normalizeProcessRevisionPublicationEvidence({
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: "process:orders",
      revisionRef: "process:orders@1",
      revisionNumber: 1,
      previousRevisionRef: null,
      immutableContentRef: "sha256:orders-v1",
      payload: { secret: true },
    }),
    /unexpected field payload/,
  );
});

test("revision lifecycle descriptor preserves identity and explicit supersession", () => {
  const descriptor = normalizeProcessRevisionLifecycleDescriptor({
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: " process:orders ",
    revisionRef: " process:orders@2 ",
    revisionNumber: 2,
    previousRevisionRef: " process:orders@1 ",
    lifecycleState: "active",
    supersedesRevisionRef: " process:orders@1 ",
  });

  assert.deepEqual(descriptor, {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process:orders@2",
    revisionNumber: 2,
    previousRevisionRef: "process:orders@1",
    lifecycleState: "active",
    supersedesRevisionRef: "process:orders@1",
  });
});

test("deprecated and archived states retain immutable revision history without semantic classification", () => {
  const base = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process:orders@2",
    revisionNumber: 2,
    previousRevisionRef: "process:orders@1",
    supersedesRevisionRef: "process:orders@1",
  } as const;

  const deprecated = normalizeProcessRevisionLifecycleDescriptor({ ...base, lifecycleState: "deprecated" });
  const archived = normalizeProcessRevisionLifecycleDescriptor({ ...base, lifecycleState: "archived" });

  assert.equal(deprecated.revisionRef, archived.revisionRef);
  assert.equal(deprecated.previousRevisionRef, archived.previousRevisionRef);
  assert.equal(deprecated.supersedesRevisionRef, archived.supersedesRevisionRef);
  assert.equal("semanticClassification" in deprecated, false);
  assert.equal("semanticClassification" in archived, false);
});

test("revision lifecycle fails closed on self-supersession contradictory state and injected classification", () => {
  const base = {
    contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
    artifactRef: "process:orders",
    revisionRef: "process:orders@2",
    revisionNumber: 2,
    previousRevisionRef: "process:orders@1",
  } as const;

  assert.throws(
    () => normalizeProcessRevisionLifecycleDescriptor({
      ...base,
      lifecycleState: "active",
      supersedesRevisionRef: "process:orders@2",
    }),
    /supersedesRevisionRef must differ from revisionRef/,
  );
  assert.throws(
    () => normalizeProcessRevisionLifecycleDescriptor({
      ...base,
      lifecycleState: "deleted",
      supersedesRevisionRef: "process:orders@1",
    }),
    /unsupported process revision lifecycle state/,
  );
  assert.throws(
    () => normalizeProcessRevisionLifecycleDescriptor({
      ...base,
      lifecycleState: "deprecated",
      supersedesRevisionRef: "process:orders@1",
      semanticClassification: "breaking",
    }),
    /unexpected field semanticClassification/,
  );
  assert.throws(
    () => normalizeProcessRevisionLifecycleDescriptor({
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: "process:orders",
      revisionRef: "process:orders@1",
      revisionNumber: 1,
      previousRevisionRef: null,
      lifecycleState: "active",
      supersedesRevisionRef: "process:orders@0",
    }),
    /first revision cannot supersede another revision/,
  );
});

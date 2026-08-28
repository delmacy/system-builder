import assert from "node:assert/strict";
import test from "node:test";
import {
  PROCESS_VERSION_IDENTITY_VERSION,
  normalizeProcessArtifactIdentity,
  normalizeProcessRevisionIdentity,
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

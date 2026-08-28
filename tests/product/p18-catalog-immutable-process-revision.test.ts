import assert from "node:assert/strict";
import test from "node:test";

import { readmitCatalogProcessRevision } from "../../packages/catalog/index.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";

function input() {
  return {
    artifact: {
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: "process:customer-onboarding",
    },
    revision: {
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: "process:customer-onboarding",
      revisionRef: "process-revision:customer-onboarding:2",
      revisionNumber: 2,
      previousRevisionRef: "process-revision:customer-onboarding:1",
    },
    publication: {
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: "process:customer-onboarding",
      revisionRef: "process-revision:customer-onboarding:2",
      revisionNumber: 2,
      previousRevisionRef: "process-revision:customer-onboarding:1",
      immutableContentRef: "content:sha256:revision-2",
    },
    lifecycle: {
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef: "process:customer-onboarding",
      revisionRef: "process-revision:customer-onboarding:2",
      revisionNumber: 2,
      previousRevisionRef: "process-revision:customer-onboarding:1",
      lifecycleState: "active",
      supersedesRevisionRef: "process-revision:customer-onboarding:1",
    },
  } as const;
}

test("TASK-396 exact published revision replay is deterministic and idempotent", () => {
  const published = input();
  assert.deepEqual(readmitCatalogProcessRevision(published, input()), {
    status: "idempotent",
    revisionRef: "process-revision:customer-onboarding:2",
    immutableContentRef: "content:sha256:revision-2",
    admission: {
      contractVersion: "1.0.0",
      status: "admitted",
      artifactRef: "process:customer-onboarding",
      revisionRef: "process-revision:customer-onboarding:2",
      revisionNumber: 2,
      previousRevisionRef: "process-revision:customer-onboarding:1",
      immutableContentRef: "content:sha256:revision-2",
      lifecycleState: "active",
      supersedesRevisionRef: "process-revision:customer-onboarding:1",
    },
  });
});

test("TASK-396 conflicting immutable publication overwrite fails closed through canonical guard", () => {
  const published = input();
  const conflicts = [
    [{ publication: { ...input().publication, immutableContentRef: "content:sha256:changed" } }, /overwrite conflict on immutableContentRef/],
    [{ publication: { ...input().publication, previousRevisionRef: "process-revision:customer-onboarding:0" }, revision: { ...input().revision, previousRevisionRef: "process-revision:customer-onboarding:0" }, lifecycle: { ...input().lifecycle, previousRevisionRef: "process-revision:customer-onboarding:0" } }, /overwrite conflict on previousRevisionRef/],
    [{ publication: { ...input().publication, revisionNumber: 3 }, revision: { ...input().revision, revisionNumber: 3 }, lifecycle: { ...input().lifecycle, revisionNumber: 3 } }, /overwrite conflict on revisionNumber/],
    [{ publication: { ...input().publication, revisionRef: "process-revision:customer-onboarding:3" }, revision: { ...input().revision, revisionRef: "process-revision:customer-onboarding:3" }, lifecycle: { ...input().lifecycle, revisionRef: "process-revision:customer-onboarding:3" } }, /overwrite conflict on revisionRef/],
    [{ artifact: { ...input().artifact, artifactRef: "process:other" }, publication: { ...input().publication, artifactRef: "process:other" }, revision: { ...input().revision, artifactRef: "process:other" }, lifecycle: { ...input().lifecycle, artifactRef: "process:other" } }, /overwrite conflict on artifactRef/],
  ] as const;

  for (const [changes, expected] of conflicts) {
    assert.throws(
      () => readmitCatalogProcessRevision(published, { ...input(), ...changes } as never),
      expected,
    );
  }
});

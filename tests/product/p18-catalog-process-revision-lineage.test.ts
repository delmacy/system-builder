import assert from "node:assert/strict";
import test from "node:test";

import { projectCatalogProcessRevisionLineage } from "../../packages/catalog/index.js";
import { PROCESS_VERSION_IDENTITY_VERSION } from "../../packages/contracts/process-versioning/index.js";

function entry(
  revisionNumber: number,
  lifecycleState: "active" | "deprecated" | "archived",
  supersedesRevisionRef: string | null,
  artifactRef = "process:customer-onboarding",
) {
  const revisionRef = `process-revision:customer-onboarding:${revisionNumber}`;
  const previousRevisionRef =
    revisionNumber === 1 ? null : `process-revision:customer-onboarding:${revisionNumber - 1}`;
  return {
    artifact: {
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef,
    },
    revision: {
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef,
      revisionRef,
      revisionNumber,
      previousRevisionRef,
    },
    publication: {
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef,
      revisionRef,
      revisionNumber,
      previousRevisionRef,
      immutableContentRef: `content:sha256:revision-${revisionNumber}`,
    },
    lifecycle: {
      contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
      artifactRef,
      revisionRef,
      revisionNumber,
      previousRevisionRef,
      lifecycleState,
      supersedesRevisionRef,
    },
  } as const;
}

const ordered = () => [
  entry(1, "deprecated", null),
  entry(2, "archived", "process-revision:customer-onboarding:1"),
  entry(3, "active", "process-revision:customer-onboarding:2"),
] as const;

test("TASK-397 projects canonical contiguous lineage and lifecycle deterministically", () => {
  const expected = {
    artifactRef: "process:customer-onboarding",
    revisions: [
      {
        revisionRef: "process-revision:customer-onboarding:1",
        revisionNumber: 1,
        previousRevisionRef: null,
        lifecycleState: "deprecated",
        supersedesRevisionRef: null,
      },
      {
        revisionRef: "process-revision:customer-onboarding:2",
        revisionNumber: 2,
        previousRevisionRef: "process-revision:customer-onboarding:1",
        lifecycleState: "archived",
        supersedesRevisionRef: "process-revision:customer-onboarding:1",
      },
      {
        revisionRef: "process-revision:customer-onboarding:3",
        revisionNumber: 3,
        previousRevisionRef: "process-revision:customer-onboarding:2",
        lifecycleState: "active",
        supersedesRevisionRef: "process-revision:customer-onboarding:2",
      },
    ],
  };

  assert.deepEqual(projectCatalogProcessRevisionLineage(ordered()), expected);
  assert.deepEqual(
    projectCatalogProcessRevisionLineage([ordered()[2], ordered()[0], ordered()[1]]),
    expected,
  );
});

test("TASK-397 canonical lineage failures remain fail-closed at catalog consumer", () => {
  const crossArtifact = ordered().map((value) => ({ ...value }));
  crossArtifact[1] = entry(2, "archived", "process-revision:customer-onboarding:1", "process:other") as never;
  assert.throws(
    () => projectCatalogProcessRevisionLineage(crossArtifact),
    /cross-artifact revision/,
  );

  assert.throws(
    () => projectCatalogProcessRevisionLineage([ordered()[0], ordered()[0]]),
    /duplicate revisionRef/,
  );

  const forgedPredecessor = ordered().map((value) => ({ ...value }));
  forgedPredecessor[1] = {
    ...ordered()[1],
    revision: { ...ordered()[1].revision, previousRevisionRef: "process-revision:customer-onboarding:99" },
    publication: { ...ordered()[1].publication, previousRevisionRef: "process-revision:customer-onboarding:99" },
    lifecycle: { ...ordered()[1].lifecycle, previousRevisionRef: "process-revision:customer-onboarding:99" },
  } as never;
  assert.throws(
    () => projectCatalogProcessRevisionLineage(forgedPredecessor),
    /previousRevisionRef must reference the immediately preceding revision/,
  );

  const contradictorySupersession = ordered().map((value) => ({ ...value }));
  contradictorySupersession[1] = {
    ...ordered()[1],
    lifecycle: {
      ...ordered()[1].lifecycle,
      supersedesRevisionRef: "process-revision:customer-onboarding:99",
    },
  } as never;
  assert.throws(
    () => projectCatalogProcessRevisionLineage(contradictorySupersession),
    /supersedesRevisionRef must reference the immediately preceding revision/,
  );
});

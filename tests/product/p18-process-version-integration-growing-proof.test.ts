import assert from "node:assert/strict";
import test from "node:test";

import {
  SoftwareCatalogRegistry,
  admitCatalogProcessRevision,
  projectCatalogProcessRevisionLineage,
  readmitCatalogProcessRevision,
} from "../../packages/catalog/index.js";

const CONTRACT_VERSION = "1.0.0" as const;
const ARTIFACT_REF = "process:customer-onboarding";

function entry(
  revisionNumber: number,
  lifecycleState: "active" | "deprecated" | "archived",
  supersedesRevisionRef: string | null,
  artifactRef = ARTIFACT_REF,
) {
  const revisionRef = `process-revision:customer-onboarding:${revisionNumber}`;
  const previousRevisionRef =
    revisionNumber === 1 ? null : `process-revision:customer-onboarding:${revisionNumber - 1}`;

  return {
    artifact: { contractVersion: CONTRACT_VERSION, artifactRef },
    revision: {
      contractVersion: CONTRACT_VERSION,
      artifactRef,
      revisionRef,
      revisionNumber,
      previousRevisionRef,
    },
    publication: {
      contractVersion: CONTRACT_VERSION,
      artifactRef,
      revisionRef,
      revisionNumber,
      previousRevisionRef,
      immutableContentRef: `content:sha256:revision-${revisionNumber}`,
    },
    lifecycle: {
      contractVersion: CONTRACT_VERSION,
      artifactRef,
      revisionRef,
      revisionNumber,
      previousRevisionRef,
      lifecycleState,
      supersedesRevisionRef,
    },
  } as const;
}

function lineage() {
  return [
    entry(1, "deprecated", null),
    entry(2, "archived", "process-revision:customer-onboarding:1"),
    entry(3, "active", "process-revision:customer-onboarding:2"),
  ] as const;
}

test("TASK-398 composes admission, immutable replay and lineage through the catalog public seam", () => {
  const revisions = lineage();
  const admitted = revisions.map((revision) => admitCatalogProcessRevision(revision));

  assert.deepEqual(
    admitted.map(({ revisionRef, revisionNumber, lifecycleState }) => ({
      revisionRef,
      revisionNumber,
      lifecycleState,
    })),
    [
      { revisionRef: "process-revision:customer-onboarding:1", revisionNumber: 1, lifecycleState: "deprecated" },
      { revisionRef: "process-revision:customer-onboarding:2", revisionNumber: 2, lifecycleState: "archived" },
      { revisionRef: "process-revision:customer-onboarding:3", revisionNumber: 3, lifecycleState: "active" },
    ],
  );

  assert.equal(readmitCatalogProcessRevision(revisions[2], revisions[2]).status, "idempotent");
  assert.deepEqual(
    projectCatalogProcessRevisionLineage([revisions[2], revisions[0], revisions[1]]).revisions.map(
      ({ revisionRef, previousRevisionRef, lifecycleState, supersedesRevisionRef }) => ({
        revisionRef,
        previousRevisionRef,
        lifecycleState,
        supersedesRevisionRef,
      }),
    ),
    [
      {
        revisionRef: "process-revision:customer-onboarding:1",
        previousRevisionRef: null,
        lifecycleState: "deprecated",
        supersedesRevisionRef: null,
      },
      {
        revisionRef: "process-revision:customer-onboarding:2",
        previousRevisionRef: "process-revision:customer-onboarding:1",
        lifecycleState: "archived",
        supersedesRevisionRef: "process-revision:customer-onboarding:1",
      },
      {
        revisionRef: "process-revision:customer-onboarding:3",
        previousRevisionRef: "process-revision:customer-onboarding:2",
        lifecycleState: "active",
        supersedesRevisionRef: "process-revision:customer-onboarding:2",
      },
    ],
  );
});

test("TASK-398 keeps process business revisions distinct from software SemVer and rejects injected truth", () => {
  const registry = new SoftwareCatalogRegistry();
  const software = registry.register({ capability: "workflow-engine", provider: "reference-provider", version: "9.4.2" });
  const revision = entry(3, "active", "process-revision:customer-onboarding:2");
  const admission = admitCatalogProcessRevision(revision);

  assert.equal(software.version, "9.4.2");
  assert.equal(admission.revisionNumber, 3);
  assert.equal("version" in admission, false);
  assert.equal("gitSha" in admission, false);
  assert.equal("payload" in admission, false);

  assert.throws(
    () => admitCatalogProcessRevision({ ...revision, payload: { semanticChange: "breaking" } } as never),
    /unexpected field payload/,
  );
  assert.throws(
    () => admitCatalogProcessRevision({
      ...revision,
      publication: { ...revision.publication, content: { injected: true } },
    } as never),
    /unexpected field content/,
  );
  assert.throws(
    () => admitCatalogProcessRevision({ ...revision, version: "9.4.2" } as never),
    /unexpected field version/,
  );
});

test("TASK-398 immutable overwrite resistance cannot be bypassed by coherent caller rewrites", () => {
  const published = entry(3, "active", "process-revision:customer-onboarding:2");
  const conflictingContent = {
    ...published,
    publication: { ...published.publication, immutableContentRef: "content:sha256:forged" },
  };
  assert.throws(
    () => readmitCatalogProcessRevision(published, conflictingContent),
    /overwrite conflict on immutableContentRef/,
  );

  const conflictingPredecessor = {
    ...published,
    revision: { ...published.revision, previousRevisionRef: "process-revision:customer-onboarding:99" },
    publication: { ...published.publication, previousRevisionRef: "process-revision:customer-onboarding:99" },
    lifecycle: { ...published.lifecycle, previousRevisionRef: "process-revision:customer-onboarding:99" },
  };
  assert.throws(
    () => readmitCatalogProcessRevision(published, conflictingPredecessor),
    /overwrite conflict on previousRevisionRef/,
  );
});

test("TASK-398 canonical lineage bypass attempts fail closed through the representative consumer", () => {
  const revisions = lineage();

  const crossArtifact = revisions.map((value) => ({ ...value }));
  crossArtifact[1] = entry(2, "archived", "process-revision:customer-onboarding:1", "process:other") as never;
  assert.throws(() => projectCatalogProcessRevisionLineage(crossArtifact), /cross-artifact revision/);

  assert.throws(
    () => projectCatalogProcessRevisionLineage([revisions[0], revisions[0]]),
    /duplicate revisionRef/,
  );

  const forgedPredecessor = revisions.map((value) => ({ ...value }));
  forgedPredecessor[1] = {
    ...revisions[1],
    revision: { ...revisions[1].revision, previousRevisionRef: "process-revision:customer-onboarding:99" },
    publication: { ...revisions[1].publication, previousRevisionRef: "process-revision:customer-onboarding:99" },
    lifecycle: { ...revisions[1].lifecycle, previousRevisionRef: "process-revision:customer-onboarding:99" },
  } as never;
  assert.throws(
    () => projectCatalogProcessRevisionLineage(forgedPredecessor),
    /previousRevisionRef must reference the immediately preceding revision/,
  );

  const contradictorySupersession = revisions.map((value) => ({ ...value }));
  contradictorySupersession[1] = {
    ...revisions[1],
    lifecycle: { ...revisions[1].lifecycle, supersedesRevisionRef: "process-revision:customer-onboarding:99" },
  } as never;
  assert.throws(
    () => projectCatalogProcessRevisionLineage(contradictorySupersession),
    /supersedesRevisionRef must reference the immediately preceding revision/,
  );
});

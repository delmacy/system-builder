import assert from "node:assert/strict";
import test from "node:test";

import {
  CATALOG_PROCESS_REVISION_ADMISSION_VERSION,
  SoftwareCatalogRegistry,
  admitCatalogProcessRevision,
} from "../../packages/catalog/index.js";
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

test("TASK-395 admits canonical process revision truth as payload-minimal catalog references", () => {
  assert.deepEqual(admitCatalogProcessRevision(input()), {
    contractVersion: CATALOG_PROCESS_REVISION_ADMISSION_VERSION,
    status: "admitted",
    artifactRef: "process:customer-onboarding",
    revisionRef: "process-revision:customer-onboarding:2",
    revisionNumber: 2,
    previousRevisionRef: "process-revision:customer-onboarding:1",
    immutableContentRef: "content:sha256:revision-2",
    lifecycleState: "active",
    supersedesRevisionRef: "process-revision:customer-onboarding:1",
  });
});

test("TASK-395 rejects malformed, injected and inconsistent process revision truth", () => {
  const base = input();
  assert.throws(
    () => admitCatalogProcessRevision({ ...base, payload: "secret" } as never),
    /unexpected field payload/,
  );
  assert.throws(
    () => admitCatalogProcessRevision({
      ...base,
      publication: { ...base.publication, content: "secret" },
    } as never),
    /unexpected field content/,
  );
  assert.throws(
    () => admitCatalogProcessRevision({
      ...base,
      artifact: { ...base.artifact, artifactRef: "process:other" },
    }),
    /artifact conflicts with canonical revision identity/,
  );
  assert.throws(
    () => admitCatalogProcessRevision({
      ...base,
      lifecycle: { ...base.lifecycle, revisionNumber: 3 },
    }),
    /lifecycle conflicts with canonical revision identity on revisionNumber/,
  );
});

test("TASK-395 keeps process business revision identity distinct from software catalog SemVer", () => {
  const registry = new SoftwareCatalogRegistry();
  const software = registry.register({
    capability: "workflow-engine",
    provider: "reference-provider",
    version: "2.4.0",
  });
  const admission = admitCatalogProcessRevision(input());

  assert.equal(software.version, "2.4.0");
  assert.equal(registry.list()[0]?.version, "2.4.0");
  assert.equal(admission.revisionNumber, 2);
  assert.equal(admission.revisionRef, "process-revision:customer-onboarding:2");
  assert.equal("version" in admission, false);

  assert.throws(
    () => admitCatalogProcessRevision({ ...input(), version: "2.4.0" } as never),
    /unexpected field version/,
  );
});

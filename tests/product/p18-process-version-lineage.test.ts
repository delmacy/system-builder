import assert from "node:assert/strict";
import test from "node:test";
import {
  PROCESS_VERSION_IDENTITY_VERSION,
  validateProcessRevisionLineage,
} from "../../packages/contracts/process-versioning/index.js";

const publication = (
  revisionNumber: number,
  revisionRef: string,
  previousRevisionRef: string | null,
  immutableContentRef: string,
  artifactRef = "process:orders",
) => ({
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef,
  revisionRef,
  revisionNumber,
  previousRevisionRef,
  immutableContentRef,
});

const lifecycle = (
  revisionNumber: number,
  revisionRef: string,
  previousRevisionRef: string | null,
  lifecycleState: "active" | "deprecated" | "archived",
  supersedesRevisionRef: string | null,
  artifactRef = "process:orders",
) => ({
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef,
  revisionRef,
  revisionNumber,
  previousRevisionRef,
  lifecycleState,
  supersedesRevisionRef,
});

test("revision lineage composes same-artifact immutable publication and lifecycle deterministically", () => {
  const lineage = [
    {
      publication: publication(1, "process:orders@1", null, "sha256:orders-v1"),
      lifecycle: lifecycle(1, "process:orders@1", null, "deprecated", null),
    },
    {
      publication: publication(2, "process:orders@2", "process:orders@1", "sha256:orders-v2"),
      lifecycle: lifecycle(2, "process:orders@2", "process:orders@1", "archived", "process:orders@1"),
    },
    {
      publication: publication(3, "process:orders@3", "process:orders@2", "sha256:orders-v3"),
      lifecycle: lifecycle(3, "process:orders@3", "process:orders@2", "active", "process:orders@2"),
    },
  ];

  assert.deepEqual(validateProcessRevisionLineage(lineage), {
    artifactRef: "process:orders",
    revisionRefs: ["process:orders@1", "process:orders@2", "process:orders@3"],
  });
  assert.deepEqual(validateProcessRevisionLineage([...lineage].reverse()), validateProcessRevisionLineage(lineage));
  assert.equal("semanticClassification" in validateProcessRevisionLineage(lineage), false);
});

test("revision lineage fails closed on cross-artifact composition and forged predecessor", () => {
  assert.throws(
    () => validateProcessRevisionLineage([
      {
        publication: publication(1, "process:orders@1", null, "sha256:orders-v1"),
        lifecycle: lifecycle(1, "process:orders@1", null, "archived", null),
      },
      {
        publication: publication(2, "process:payments@2", "process:orders@1", "sha256:payments-v2", "process:payments"),
        lifecycle: lifecycle(2, "process:payments@2", "process:orders@1", "active", "process:orders@1", "process:payments"),
      },
    ]),
    /cross-artifact revision/,
  );

  assert.throws(
    () => validateProcessRevisionLineage([
      {
        publication: publication(1, "process:orders@1", null, "sha256:orders-v1"),
        lifecycle: lifecycle(1, "process:orders@1", null, "archived", null),
      },
      {
        publication: publication(2, "process:orders@2", "process:orders@0", "sha256:orders-v2"),
        lifecycle: lifecycle(2, "process:orders@2", "process:orders@0", "active", "process:orders@0"),
      },
    ]),
    /immediately preceding revision/,
  );
});

test("revision lineage fails closed on conflicting immutable evidence, cyclic supersession and contradictory lifecycle", () => {
  assert.throws(
    () => validateProcessRevisionLineage([
      {
        publication: publication(1, "process:orders@1", null, "sha256:orders-v1"),
        lifecycle: lifecycle(1, "process:orders@1", null, "archived", null),
      },
      {
        publication: publication(1, "process:orders@1", null, "sha256:forged-v1"),
        lifecycle: lifecycle(1, "process:orders@1", null, "archived", null),
      },
    ]),
    /conflicting immutable publication evidence/,
  );

  assert.throws(
    () => validateProcessRevisionLineage([
      {
        publication: publication(1, "process:orders@1", null, "sha256:orders-v1"),
        lifecycle: lifecycle(1, "process:orders@1", null, "archived", null),
      },
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
      {
        publication: publication(1, "process:orders@1", null, "sha256:orders-v1"),
        lifecycle: lifecycle(1, "process:orders@1", null, "active", null),
      },
      {
        publication: publication(2, "process:orders@2", "process:orders@1", "sha256:orders-v2"),
        lifecycle: lifecycle(2, "process:orders@2", "process:orders@1", "active", "process:orders@1"),
      },
    ]),
    /cannot supersede a revision that remains active/,
  );
});

test("revision lineage rejects injected payload and semantic classification", () => {
  assert.throws(
    () => validateProcessRevisionLineage([{
      publication: publication(1, "process:orders@1", null, "sha256:orders-v1"),
      lifecycle: lifecycle(1, "process:orders@1", null, "active", null),
      payload: { secret: true },
    }]),
    /unexpected field payload/,
  );

  assert.throws(
    () => validateProcessRevisionLineage([{
      publication: publication(1, "process:orders@1", null, "sha256:orders-v1"),
      lifecycle: {
        ...lifecycle(1, "process:orders@1", null, "active", null),
        semanticClassification: "breaking",
      },
    }]),
    /unexpected field semanticClassification/,
  );
});

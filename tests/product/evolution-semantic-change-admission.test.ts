import assert from "node:assert/strict";
import test from "node:test";
import { admitEvolutionSemanticChange } from "../../packages/support-evolution/index.js";

const fromRevision = {
  contractVersion: "1.0.0" as const,
  artifactRef: "process:billing",
  revisionRef: "process:billing:r1",
  revisionNumber: 1,
  previousRevisionRef: null,
};

const toRevision = {
  contractVersion: "1.0.0" as const,
  artifactRef: "process:billing",
  revisionRef: "process:billing:r2",
  revisionNumber: 2,
  previousRevisionRef: "process:billing:r1",
};

const fromSnapshot = [
  { semanticRef: "rule:invoice-due-date", evidenceRef: "evidence:rule:v1" },
];

const toSnapshot = [
  { semanticRef: "rule:invoice-due-date", evidenceRef: "evidence:rule:v2" },
  { semanticRef: "rule:late-fee", evidenceRef: "evidence:late-fee:v1" },
];

test("evolution semantic-change admission consumes canonical revision/change truth and emits references only", () => {
  const left = admitEvolutionSemanticChange({
    changeRef: "change:billing:r1-r2",
    fromRevision,
    toRevision,
    fromSnapshot,
    toSnapshot,
  });
  const right = admitEvolutionSemanticChange({
    changeRef: "change:billing:r1-r2",
    fromRevision,
    toRevision,
    fromSnapshot: [...fromSnapshot].reverse(),
    toSnapshot: [...toSnapshot].reverse(),
  });

  assert.deepEqual(left, right);
  assert.deepEqual(left, {
    changeRef: "change:billing:r1-r2",
    artifactRef: "process:billing",
    fromRevisionRef: "process:billing:r1",
    toRevisionRef: "process:billing:r2",
  });
  assert.equal(Object.isFrozen(left), true);
  assert.equal("classification" in left, false);
  assert.equal("outcome" in left, false);
  assert.equal("payload" in left, false);
});

test("evolution semantic-change admission fails closed for malformed canonical inputs and caller injection", () => {
  assert.throws(
    () => admitEvolutionSemanticChange({
      changeRef: "change:billing:r1-r2",
      fromRevision,
      toRevision: { ...toRevision, previousRevisionRef: "process:billing:forged" },
      fromSnapshot,
      toSnapshot,
    }),
    /canonical predecessor/,
  );

  assert.throws(
    () => admitEvolutionSemanticChange({
      changeRef: "change:billing:r1-r2",
      fromRevision,
      toRevision,
      fromSnapshot,
      toSnapshot,
      approval: true,
    }),
    /UNEXPECTED_FIELD:approval/,
  );

  assert.throws(
    () => admitEvolutionSemanticChange({
      changeRef: "change:billing:r1-r2",
      fromRevision,
      toRevision,
      fromSnapshot: [
        { semanticRef: "rule:invoice-due-date", evidenceRef: "evidence:one" },
        { semanticRef: "rule:invoice-due-date", evidenceRef: "evidence:two" },
      ],
      toSnapshot,
    }),
    /duplicate semanticRef/,
  );
});

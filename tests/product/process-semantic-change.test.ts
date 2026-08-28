import assert from "node:assert/strict";
import test from "node:test";

import { calculateProcessSemanticChangeDiff } from "@system-builder/contracts/process-change";

const revision = (revisionRef: string, revisionNumber: number, previousRevisionRef: string | null, artifactRef = "process:order") => ({
  contractVersion: "1.0.0" as const,
  artifactRef,
  revisionRef,
  revisionNumber,
  previousRevisionRef,
});

test("process semantic change diff is deterministic and payload-minimal", () => {
  const input = {
    fromRevision: revision("rev-1", 1, null),
    toRevision: revision("rev-2", 2, "rev-1"),
    fromSnapshot: [
      { semanticRef: "rule:b", evidenceRef: "evidence:b1" },
      { semanticRef: "rule:a", evidenceRef: "evidence:a1" },
      { semanticRef: "rule:c", evidenceRef: "evidence:c1" },
    ],
    toSnapshot: [
      { semanticRef: "rule:d", evidenceRef: "evidence:d1" },
      { semanticRef: "rule:b", evidenceRef: "evidence:b2" },
      { semanticRef: "rule:a", evidenceRef: "evidence:a1" },
    ],
  };

  assert.deepEqual(calculateProcessSemanticChangeDiff(input), {
    contractVersion: "1.0.0",
    artifactRef: "process:order",
    fromRevisionRef: "rev-1",
    toRevisionRef: "rev-2",
    addedSemanticRefs: ["rule:d"],
    removedSemanticRefs: ["rule:c"],
    changedSemanticRefs: ["rule:b"],
  });

  assert.deepEqual(
    calculateProcessSemanticChangeDiff({
      ...input,
      fromSnapshot: [...input.fromSnapshot].reverse(),
      toSnapshot: [...input.toSnapshot].reverse(),
    }),
    calculateProcessSemanticChangeDiff(input),
  );
});

test("process semantic change diff rejects forged, reversed, duplicate and injected inputs", () => {
  const base = {
    fromRevision: revision("rev-1", 1, null),
    toRevision: revision("rev-2", 2, "rev-1"),
    fromSnapshot: [{ semanticRef: "rule:a", evidenceRef: "evidence:a1" }],
    toSnapshot: [{ semanticRef: "rule:a", evidenceRef: "evidence:a2" }],
  };

  assert.throws(
    () => calculateProcessSemanticChangeDiff({ ...base, toRevision: revision("rev-2", 2, "rev-1", "process:other") }),
    /same artifact/,
  );
  assert.throws(
    () => calculateProcessSemanticChangeDiff({ ...base, fromRevision: revision("rev-2", 2, "rev-1"), toRevision: revision("rev-1", 1, null) }),
    /consecutive and ordered/,
  );
  assert.throws(
    () => calculateProcessSemanticChangeDiff({ ...base, toRevision: revision("rev-2", 2, "forged") }),
    /canonical predecessor/,
  );
  assert.throws(
    () => calculateProcessSemanticChangeDiff({ ...base, toSnapshot: [base.toSnapshot[0], base.toSnapshot[0]] }),
    /duplicate semanticRef/,
  );
  assert.throws(
    () => calculateProcessSemanticChangeDiff({ ...base, toSnapshot: [{ semanticRef: "rule:a", evidenceRef: "evidence:a2", payload: { secret: true } }] }),
    /unexpected field payload/,
  );
  assert.throws(
    () => calculateProcessSemanticChangeDiff({ ...base, gitSha: "deadbeef" }),
    /unexpected field gitSha/,
  );
});

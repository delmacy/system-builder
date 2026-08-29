import assert from "node:assert/strict";
import test from "node:test";
import {
  PROCESS_SYSTEM_LINEAGE_VERSION,
  PROCESS_VERSION_IDENTITY_VERSION,
  normalizeProcessSystemLineageEndpoint,
  normalizeProcessSystemLineageHop,
} from "../../packages/contracts/process-versioning/index.js";

const processRevision = {
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef: "process:orders",
  revisionRef: "process:orders@2",
  revisionNumber: 2,
  previousRevisionRef: "process:orders@1",
} as const;

test("process-system lineage endpoint reuses canonical process revision identity and normalizes refs", () => {
  const process = normalizeProcessSystemLineageEndpoint({
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision",
    processRevision,
  });
  const analysis = normalizeProcessSystemLineageEndpoint({
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "analysis",
    identityRef: " analysis:orders-v2 ",
  });

  assert.equal(process.kind, "process-revision");
  if (process.kind !== "process-revision") assert.fail("expected process revision endpoint");
  assert.deepEqual(process.processRevision, processRevision);
  assert.deepEqual(analysis, {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "analysis",
    identityRef: "analysis:orders-v2",
  });
});

test("process-system lineage hop is explicit and deterministic", () => {
  const hop = {
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision-to-analysis",
    from: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "process-revision",
      processRevision,
    },
    to: {
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "analysis",
      identityRef: "analysis:orders-v2",
    },
  } as const;

  assert.deepEqual(normalizeProcessSystemLineageHop(hop), normalizeProcessSystemLineageHop({ ...hop }));
});

test("lineage endpoints fail closed on extra state and Git-only authority substitution", () => {
  assert.throws(
    () => normalizeProcessSystemLineageEndpoint({
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "analysis",
      identityRef: "analysis:orders-v2",
      payload: { hidden: true },
    }),
    /unexpected field payload/,
  );

  assert.throws(
    () => normalizeProcessSystemLineageEndpoint({
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "release",
      gitSha: "abc123",
    }),
    /unexpected field gitSha|missing field identityRef/,
  );
});

test("lineage hops reject invalid or ambiguous endpoint ordering", () => {
  assert.throws(
    () => normalizeProcessSystemLineageHop({
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "process-revision-to-analysis",
      from: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "analysis",
        identityRef: "analysis:orders-v2",
      },
      to: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "system-definition",
        identityRef: "definition:orders-v2",
      },
    }),
    /requires process-revision -> analysis/,
  );

  assert.throws(
    () => normalizeProcessSystemLineageHop({
      contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
      kind: "analysis-to-analysis",
      from: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "analysis",
        identityRef: "analysis:orders-v2",
      },
      to: {
        contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
        kind: "analysis",
        identityRef: "analysis:orders-v2",
      },
    }),
    /unsupported process-system lineage hop kind/,
  );
});

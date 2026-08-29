import assert from "node:assert/strict";
import test from "node:test";
import {
  PROCESS_SYSTEM_LINEAGE_VERSION,
  PROCESS_VERSION_IDENTITY_VERSION,
  normalizeProcessAnalysisDefinitionLineage,
} from "../../packages/contracts/process-versioning/index.js";

const processRevision = {
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef: "process:orders",
  revisionRef: "process:orders@2",
  revisionNumber: 2,
  previousRevisionRef: "process:orders@1",
} as const;

const process = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision", processRevision } as const;
const analysis = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis", identityRef: "analysis:orders-v2" } as const;
const definition = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "system-definition", identityRef: "definition:orders-v2" } as const;
const hops = [
  { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "process-revision-to-analysis", from: process, to: analysis },
  { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, kind: "analysis-to-system-definition", from: analysis, to: definition },
] as const;

const valid = { contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION, processRevision: process, analysis, systemDefinition: definition, hops } as const;

test("process revision composes deterministically through analysis to system definition", () => {
  assert.deepEqual(normalizeProcessAnalysisDefinitionLineage(valid), normalizeProcessAnalysisDefinitionLineage({ ...valid }));
});

test("process-analysis-definition lineage fails closed on substituted process revision", () => {
  const substituted = {
    ...process,
    processRevision: { ...processRevision, artifactRef: "process:billing", revisionRef: "process:billing@2" },
  };
  assert.throws(() => normalizeProcessAnalysisDefinitionLineage({
    ...valid,
    processRevision: substituted,
  }), /process-to-analysis hop does not match declared endpoints/);
});

test("process-analysis-definition lineage rejects missing, reversed and cross-linked hops", () => {
  assert.throws(() => normalizeProcessAnalysisDefinitionLineage({ ...valid, hops: [hops[0]] }), /exactly two ordered hops/);
  assert.throws(() => normalizeProcessAnalysisDefinitionLineage({ ...valid, hops: [hops[1], hops[0]] }), /out of order/);
  const otherAnalysis = { ...analysis, identityRef: "analysis:billing-v2" };
  assert.throws(() => normalizeProcessAnalysisDefinitionLineage({
    ...valid,
    hops: [hops[0], { ...hops[1], from: otherAnalysis }],
  }), /analysis-to-definition hop does not match declared endpoints/);
});

test("process-analysis-definition lineage rejects conflicting endpoint identity and extra state", () => {
  assert.throws(() => normalizeProcessAnalysisDefinitionLineage({ ...valid, extra: true }), /unexpected field extra/);
  assert.throws(() => normalizeProcessAnalysisDefinitionLineage({
    ...valid,
    systemDefinition: { ...definition, identityRef: analysis.identityRef },
    hops: [hops[0], { ...hops[1], to: { ...definition, identityRef: analysis.identityRef } }],
  }), /identities must be distinct/);
});

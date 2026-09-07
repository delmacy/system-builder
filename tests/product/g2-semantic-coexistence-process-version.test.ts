import assert from "node:assert/strict";
import test from "node:test";

import {
  PROCESS_VERSION_IDENTITY_VERSION,
  normalizeProcessRevisionIdentity,
  validateProcessRevisionLineage,
} from "../../packages/contracts/process-versioning/index.js";
import {
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeCurrentnessQualification,
  normalizeDefinitionRevisionRef,
} from "../../packages/contracts/semantic-substrate/index.js";

function bindProcessRevisionToSemantic(input: {
  processRevision: unknown;
  semanticRevision: unknown;
  currentness: unknown;
}) {
  const processRevision = normalizeProcessRevisionIdentity(input.processRevision);
  const semanticRevision = normalizeDefinitionRevisionRef(input.semanticRevision);
  const currentness = normalizeCurrentnessQualification(input.currentness);

  if (semanticRevision.semanticOwner !== "process-versioning") {
    throw new Error("semantic process revision must remain owned by process-versioning");
  }
  if (semanticRevision.semanticKind !== "process-definition") {
    throw new Error("semantic process revision must use process-definition kind");
  }
  if (semanticRevision.canonicalRef !== processRevision.artifactRef) {
    throw new Error("semantic canonicalRef must preserve process artifactRef");
  }
  if (semanticRevision.revisionOwner !== "process-versioning") {
    throw new Error("semantic revision owner must remain process-versioning");
  }
  if (semanticRevision.revisionDimension !== "process-revision") {
    throw new Error("semantic revision dimension must remain process-revision");
  }
  if (semanticRevision.revisionRef !== processRevision.revisionRef) {
    throw new Error("semantic revisionRef must preserve process revisionRef");
  }
  if (JSON.stringify(currentness.subject) !== JSON.stringify(semanticRevision)) {
    throw new Error("currentness subject must exactly match the bound semantic revision");
  }

  return Object.freeze({ processRevision, semanticRevision, currentness });
}

const processRevision = {
  contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
  artifactRef: "process:order-fulfillment",
  revisionRef: "process:order-fulfillment:r2",
  revisionNumber: 2,
  previousRevisionRef: "process:order-fulfillment:r1",
} as const;

const semanticRevision = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "process-versioning",
  semanticKind: "process-definition",
  canonicalRef: processRevision.artifactRef,
  definitionRef: processRevision.artifactRef,
  revisionOwner: "process-versioning",
  revisionDimension: "process-revision",
  revisionRef: processRevision.revisionRef,
} as const;

function currentness(state: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT") {
  return {
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    subject: semanticRevision,
    revisionVector: [
      {
        revisionOwner: "process-versioning",
        revisionDimension: "process-revision",
        revisionRef: processRevision.revisionRef,
      },
    ],
    temporal: {
      occurredAt: null,
      observedAt: "2026-09-07T20:00:00Z",
      evaluatedAt: "2026-09-07T20:01:00Z",
      effectiveFrom: null,
      effectiveUntil: null,
      reconciledAt: null,
    },
    populationScope: "process:order-fulfillment",
    localityScope: "station:alpha",
    currentnessHorizon: {
      assessedAt: "2026-09-07T20:01:00Z",
      validUntil: "2026-09-07T21:01:00Z",
    },
    state,
    reason: `semantic qualification is ${state.toLowerCase()}`,
  } as const;
}

test("process-versioning remains canonical while semantic revision/currentness qualify it additively", () => {
  const bound = bindProcessRevisionToSemantic({
    processRevision,
    semanticRevision,
    currentness: currentness("CURRENT"),
  });

  assert.equal(bound.processRevision.artifactRef, "process:order-fulfillment");
  assert.equal(bound.processRevision.revisionRef, "process:order-fulfillment:r2");
  assert.equal(bound.semanticRevision.semanticOwner, "process-versioning");
  assert.equal(bound.semanticRevision.revisionRef, bound.processRevision.revisionRef);
  assert.equal(bound.currentness.state, "CURRENT");
});

test("revision substitution and semantic owner mismatch fail closed", () => {
  assert.throws(
    () =>
      bindProcessRevisionToSemantic({
        processRevision,
        semanticRevision: { ...semanticRevision, revisionRef: "process:order-fulfillment:r3" },
        currentness: currentness("CURRENT"),
      }),
    /semantic revisionRef must preserve process revisionRef/,
  );

  assert.throws(
    () =>
      bindProcessRevisionToSemantic({
        processRevision,
        semanticRevision: { ...semanticRevision, semanticOwner: "catalog" },
        currentness: {
          ...currentness("CURRENT"),
          subject: { ...semanticRevision, semanticOwner: "catalog" },
        },
      }),
    /semantic process revision must remain owned by process-versioning/,
  );
});

test("stale and unknown semantic currentness cannot rewrite historical process revision truth", () => {
  const historicalLineage = validateProcessRevisionLineage([
    {
      publication: {
        contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
        artifactRef: processRevision.artifactRef,
        revisionRef: "process:order-fulfillment:r1",
        revisionNumber: 1,
        previousRevisionRef: null,
        immutableContentRef: "sha256:r1",
      },
      lifecycle: {
        contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
        artifactRef: processRevision.artifactRef,
        revisionRef: "process:order-fulfillment:r1",
        revisionNumber: 1,
        previousRevisionRef: null,
        lifecycleState: "archived",
        supersedesRevisionRef: null,
      },
    },
    {
      publication: {
        contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
        artifactRef: processRevision.artifactRef,
        revisionRef: processRevision.revisionRef,
        revisionNumber: processRevision.revisionNumber,
        previousRevisionRef: processRevision.previousRevisionRef,
        immutableContentRef: "sha256:r2",
      },
      lifecycle: {
        contractVersion: PROCESS_VERSION_IDENTITY_VERSION,
        artifactRef: processRevision.artifactRef,
        revisionRef: processRevision.revisionRef,
        revisionNumber: processRevision.revisionNumber,
        previousRevisionRef: processRevision.previousRevisionRef,
        lifecycleState: "active",
        supersedesRevisionRef: "process:order-fulfillment:r1",
      },
    },
  ]);

  const stale = bindProcessRevisionToSemantic({ processRevision, semanticRevision, currentness: currentness("STALE") });
  const unknown = bindProcessRevisionToSemantic({ processRevision, semanticRevision, currentness: currentness("UNKNOWN") });

  assert.deepEqual(historicalLineage.revisionRefs, ["process:order-fulfillment:r1", "process:order-fulfillment:r2"]);
  assert.equal(stale.processRevision.revisionRef, processRevision.revisionRef);
  assert.equal(unknown.processRevision.revisionRef, processRevision.revisionRef);
  assert.equal(stale.currentness.state, "STALE");
  assert.equal(unknown.currentness.state, "UNKNOWN");
});

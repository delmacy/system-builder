import assert from "node:assert/strict";
import test from "node:test";
import {
  FACTORY_JOURNEY_CONTRACT_VERSION,
  FACTORY_JOURNEY_STAGE_KINDS,
  normalizeFactoryJourneyEnvelope,
} from "../../packages/contracts/factory-boundary/index.js";

const canonicalStages = FACTORY_JOURNEY_STAGE_KINDS.map((kind) => ({
  kind,
  identityRef: `identity:${kind}`,
  provenanceRef: `provenance:${kind}`,
}));

test("factory journey normalization preserves canonical deterministic stage order", () => {
  const normalized = normalizeFactoryJourneyEnvelope({
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    stages: canonicalStages.map((stage) => ({ ...stage })),
  });

  assert.deepEqual(normalized.stages.map((stage) => stage.kind), FACTORY_JOURNEY_STAGE_KINDS);
  assert.deepEqual(
    normalized,
    normalizeFactoryJourneyEnvelope({
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      stages: canonicalStages.map((stage) => ({ ...stage })),
    }),
  );
});

test("factory journey carries identity and provenance only", () => {
  const normalized = normalizeFactoryJourneyEnvelope({
    contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
    stages: canonicalStages,
  });

  for (const stage of normalized.stages) {
    assert.deepEqual(Object.keys(stage), ["kind", "identityRef", "provenanceRef"]);
  }
});

test("factory journey fails closed on reordered unknown or extra stage state", () => {
  const reordered = canonicalStages.map((stage) => ({ ...stage }));
  [reordered[0], reordered[1]] = [reordered[1]!, reordered[0]!];
  assert.throws(
    () => normalizeFactoryJourneyEnvelope({ contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION, stages: reordered }),
    /must be approved-process/,
  );

  const unknown = canonicalStages.map((stage) => ({ ...stage }));
  unknown[2] = { ...unknown[2]!, kind: "unknown" as never };
  assert.throws(
    () => normalizeFactoryJourneyEnvelope({ contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION, stages: unknown }),
    /must be capability-assembly/,
  );

  assert.throws(
    () => normalizeFactoryJourneyEnvelope({
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      stages: canonicalStages.map((stage, index) => index === 0 ? { ...stage, payload: { unauthorized: true } } : stage),
    }),
    /unexpected field payload/,
  );
});

test("factory journey rejects incomplete lineage and non-canonical authority metadata", () => {
  assert.throws(
    () => normalizeFactoryJourneyEnvelope({
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      stages: canonicalStages.slice(0, -1),
    }),
    /exactly 6 ordered stages/,
  );

  assert.throws(
    () => normalizeFactoryJourneyEnvelope({
      contractVersion: FACTORY_JOURNEY_CONTRACT_VERSION,
      stages: canonicalStages,
      gitSha: "abc123",
    }),
    /unexpected field gitSha/,
  );
});

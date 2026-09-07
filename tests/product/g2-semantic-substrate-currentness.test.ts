import assert from "node:assert/strict";
import test from "node:test";
import {
  SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  normalizeCurrentnessQualification,
  normalizeTemporalCoordinates,
} from "../../packages/contracts/semantic-substrate/index.js";

const subject = {
  contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
  semanticOwner: "capability:orders",
  semanticKind: "process",
  canonicalRef: "orders.fulfillment",
  definitionRef: "orders.fulfillment@definition-1",
  revisionOwner: "team-a",
  revisionDimension: "schema",
  revisionRef: "7",
} as const;

const temporal = {
  occurredAt: "2026-09-01T10:00:00Z",
  observedAt: "2026-09-01T10:01:00Z",
  evaluatedAt: "2026-09-01T10:02:00Z",
  effectiveFrom: "2026-09-01T00:00:00Z",
  effectiveUntil: "2026-09-30T23:59:59Z",
  reconciledAt: null,
} as const;

function qualification(state: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT") {
  return {
    contractVersion: SEMANTIC_SUBSTRATE_CONTRACT_VERSION,
    subject,
    revisionVector: [{ revisionOwner: "team-a", revisionDimension: "schema", revisionRef: "7" }],
    temporal,
    populationScope: "tenant:acme",
    localityScope: "region:br-south",
    currentnessHorizon: { assessedAt: "2026-09-01T10:02:00Z", validUntil: "2026-09-01T11:02:00Z" },
    state,
    reason: `explicit ${state.toLowerCase()} qualification`,
  } as const;
}

test("temporal roles remain distinct and invalid effective ranges fail closed", () => {
  const normalized = normalizeTemporalCoordinates(temporal);
  assert.equal(normalized.occurredAt, temporal.occurredAt);
  assert.equal(normalized.observedAt, temporal.observedAt);
  assert.equal(normalized.evaluatedAt, temporal.evaluatedAt);
  assert.ok(Object.isFrozen(normalized));
  assert.throws(() => normalizeTemporalCoordinates({ ...temporal, effectiveFrom: "2026-10-01T00:00:00Z" }), /effectiveUntil must not precede effectiveFrom/);
  assert.throws(() => normalizeTemporalCoordinates({ occurredAt: null, observedAt: null, evaluatedAt: null, effectiveFrom: null, effectiveUntil: null, reconciledAt: null }), /at least one explicit role/);
});

test("unknown and insufficient currentness stay explicit and never default to current", () => {
  for (const state of ["UNKNOWN", "INSUFFICIENT"] as const) {
    const normalized = normalizeCurrentnessQualification(qualification(state));
    assert.equal(normalized.state, state);
    assert.notEqual(normalized.state, "CURRENT");
    assert.equal(normalized.subject.revisionRef, "7");
  }
});

test("currentness is revision, population and locality scoped without rewriting historical subject evidence", () => {
  const original = structuredClone(subject);
  const normalized = normalizeCurrentnessQualification(qualification("STALE"));
  assert.equal(normalized.state, "STALE");
  assert.equal(normalized.populationScope, "tenant:acme");
  assert.equal(normalized.localityScope, "region:br-south");
  assert.deepEqual(subject, original);
  assert.deepEqual(normalized.subject, subject);
  assert.ok(Object.isFrozen(normalized.subject));
  assert.ok(Object.isFrozen(normalized.currentnessHorizon));
  assert.ok(Object.isFrozen(normalized));
});

test("missing scope, invalid horizon and ambiguous state fail closed", () => {
  assert.throws(() => normalizeCurrentnessQualification({ ...qualification("CURRENT"), populationScope: "" }), /populationScope/);
  assert.throws(() => normalizeCurrentnessQualification({ ...qualification("CURRENT"), localityScope: "" }), /localityScope/);
  assert.throws(() => normalizeCurrentnessQualification({ ...qualification("CURRENT"), currentnessHorizon: { assessedAt: "2026-09-01T12:00:00Z", validUntil: "2026-09-01T11:00:00Z" } }), /validUntil must not precede assessedAt/);
  assert.throws(() => normalizeCurrentnessQualification({ ...qualification("CURRENT"), state: "PASS" }), /currentness state/);
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  assessFiniteFlow,
  type DrainageAssumptions,
  type FiniteFlowPopulationIdentity,
} from "../../packages/contracts/finite-flow/finite-flow";
import type { UnitReference } from "../../packages/contracts/mathematical-semantics/index";

const rateUnit: UnitReference = {
  state: "KNOWN",
  unitRef: "items-per-second",
  unitRevision: "1",
  dimension: { terms: [{ axis: "item", exponent: 1 }, { axis: "time", exponent: -1 }] },
};
const unknownUnit: UnitReference = { state: "UNKNOWN", reason: "telemetry omitted unit" };
const identity: FiniteFlowPopulationIdentity = { queueRef: "queue:orders", populationRef: "tenant:1:orders", scopeRef: "tenant:1" };
const assumptions = (overrides: Partial<DrainageAssumptions> = {}): DrainageAssumptions => ({
  horizonMs: 10_000,
  arrival: { value: 5, unit: rateUnit, populationRef: identity.populationRef, scopeRef: identity.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  service: { value: 10, unit: rateUnit, populationRef: identity.populationRef, scopeRef: identity.scopeRef, windowMs: 1000, knowledge: "KNOWN" },
  backlog: { populationRef: identity.populationRef, scopeRef: identity.scopeRef, items: 20, knowledge: "KNOWN", telemetryComplete: true },
  replay: { requestedItems: 2, maximumReplayItems: 5, deduplicationBoundItems: 5 },
  ...overrides,
});

test("proves finite drainage only from units population time and declared assumptions", () => {
  const result = assessFiniteFlow(identity, assumptions());
  assert.equal(result.valid, true);
  assert.equal(result.drainable, true);
  assert.equal(result.residualItemsUpperBound, 0);
  assert.equal(result.admission, "BACKPRESSURE");
});

test("rejects unitless capacity evidence", () => {
  const result = assessFiniteFlow(identity, assumptions({ arrival: { ...assumptions().arrival, unit: unknownUnit } }));
  assert.equal(result.drainable, false);
  assert.equal(result.admission, "CLOSED");
  assert.ok(result.reasons.includes("ARRIVAL_UNIT_NOT_KNOWN"));
});

test("aggregate capacity cannot be strengthened into local population capacity", () => {
  const result = assessFiniteFlow(identity, assumptions({ service: { ...assumptions().service, populationRef: "all-tenants" } }));
  assert.equal(result.drainable, false);
  assert.ok(result.reasons.includes("SERVICE_POPULATION_OR_SCOPE_MISMATCH"));
});

test("missing telemetry never means zero backlog", () => {
  const result = assessFiniteFlow(identity, assumptions({ backlog: { ...assumptions().backlog, items: 0, telemetryComplete: false } }));
  assert.equal(result.drainable, false);
  assert.equal(result.admission, "CLOSED");
  assert.ok(result.reasons.includes("BACKLOG_TELEMETRY_INCOMPLETE"));
});

test("replay cannot create work beyond the declared deduplication bound", () => {
  const result = assessFiniteFlow(identity, assumptions({ replay: { requestedItems: 8, maximumReplayItems: 8, deduplicationBoundItems: 5 } }));
  assert.equal(result.drainable, false);
  assert.ok(result.reasons.includes("REPLAY_EXCEEDS_DEDUPLICATION_BOUND"));
});

test("UNKNOWN capacity or drainage evidence cannot strengthen to healthy or drained", () => {
  const unknownCapacity = assessFiniteFlow(identity, assumptions({ service: { ...assumptions().service, knowledge: "UNKNOWN" } }));
  assert.equal(unknownCapacity.drainable, false);
  assert.equal(unknownCapacity.admission, "CLOSED");
  assert.ok(unknownCapacity.reasons.includes("SERVICE_CAPACITY_NOT_KNOWN"));

  const partialBacklog = assessFiniteFlow(identity, assumptions({ backlog: { ...assumptions().backlog, knowledge: "PARTIAL" } }));
  assert.equal(partialBacklog.drainable, false);
  assert.equal(partialBacklog.admission, "CLOSED");
  assert.ok(partialBacklog.reasons.includes("BACKLOG_NOT_KNOWN"));
});

test("declared horizon must actually drain the residual population", () => {
  const result = assessFiniteFlow(identity, assumptions({ horizonMs: 1000, backlog: { ...assumptions().backlog, items: 20 } }));
  assert.equal(result.drainable, false);
  assert.equal(result.residualItemsUpperBound, 17);
  assert.ok(result.reasons.includes("DECLARED_HORIZON_DOES_NOT_DRAIN_POPULATION"));
});

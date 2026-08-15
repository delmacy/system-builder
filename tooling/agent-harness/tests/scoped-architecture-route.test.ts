import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { executionRouteSchema } from "../src/execution-contracts.js";

const valid = {
  risk: "MEDIUM" as const,
  model_tier: "T3" as const,
  executor: "opencode" as const,
  model: null,
  architecture_impact: true,
  authority_ref: "DEVSCOPE:M1-SPRINT-01",
  decision: "SELECTED" as const,
  rationale_code: "PREAUTHORIZED_ARCHITECTURE" as const,
};

describe("scoped architecture execution route", () => {
  it("accepts an exact low/medium T3 route bound to a development authority scope", () => {
    assert.deepEqual(executionRouteSchema.parse(valid), valid);
  });

  it("rejects architecture automation without its exact scope authority", () => {
    const { authority_ref: _authority, ...withoutAuthority } = valid;
    assert.equal(executionRouteSchema.safeParse(withoutAuthority).success, false);
    assert.equal(executionRouteSchema.safeParse({ ...valid, authority_ref: "not-a-scope" }).success, false);
  });

  it("rejects high and critical automatic architecture even with a scope reference", () => {
    assert.equal(executionRouteSchema.safeParse({ ...valid, risk: "HIGH" }).success, false);
    assert.equal(executionRouteSchema.safeParse({ ...valid, risk: "CRITICAL" }).success, false);
  });

  it("rejects misuse of development scope authority on routine or non-T3 routes", () => {
    assert.equal(executionRouteSchema.safeParse({ ...valid, architecture_impact: false }).success, false);
    assert.equal(executionRouteSchema.safeParse({ ...valid, model_tier: "T2" }).success, false);
    assert.equal(executionRouteSchema.safeParse({ ...valid, rationale_code: "BOUNDED_MODERATE_RISK" }).success, false);
  });
});

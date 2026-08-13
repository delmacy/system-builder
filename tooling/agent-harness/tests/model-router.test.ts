import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { executionRouteSchema } from "../src/execution-contracts.js";
import { routeTask, type ModelRouterConfig } from "../src/model-router.js";
import type { TaskMetadata } from "../src/task.js";

const configuration: ModelRouterConfig = {
  deterministic_enabled: true,
  tiers: {
    T1: { executor: "opencode", model: "provider/cheap" },
    T2: { executor: "opencode", model: "provider/reasoning" },
    T3: { executor: "codex", model: "provider/architecture" },
  },
};

describe("AgentFactory model router", () => {
  it("routes deterministic work to T0 without a model or LLM executor", () => {
    const route = routeTask(task(), "DETERMINISTIC", configuration);
    assert.deepEqual(route, {
      risk: "LOW",
      model_tier: "T0",
      executor: "deterministic",
      model: null,
      architecture_impact: false,
      decision: "SELECTED",
      rationale_code: "DETERMINISTIC_OPERATION",
    });
    assert.equal(executionRouteSchema.safeParse(route).success, true);
  });

  it("selects explicitly configured T1/T2 routes deterministically", () => {
    const free = routeTask(task(), "IMPLEMENTATION", configuration);
    const cheap = routeTask(task({ model_tier: "cheap", risk: "medium" }), "IMPLEMENTATION", configuration);
    assert.equal(free.model_tier, "T1");
    assert.equal(free.model, "provider/cheap");
    assert.equal(cheap.model_tier, "T2");
    assert.equal(cheap.model, "provider/reasoning");
    assert.deepEqual(routeTask(task(), "IMPLEMENTATION", configuration), free);
  });

  it("escalates architecture and high-risk work instead of routing downward", () => {
    const architecture = routeTask(task({ model_tier: "architecture", architecture_impact: true }), "IMPLEMENTATION", configuration);
    assert.equal(architecture.decision, "ESCALATION_REQUIRED");
    assert.equal(architecture.model_tier, "HUMAN_GATE");
    assert.equal(architecture.executor, "human");
    assert.equal(architecture.rationale_code, "ARCHITECTURE_REVIEW");

    const high = routeTask(task({ model_tier: "cheap", risk: "high" }), "IMPLEMENTATION", configuration);
    assert.equal(high.decision, "ESCALATION_REQUIRED");
    assert.equal(high.rationale_code, "HIGH_RISK_REVIEW");
  });

  it("blocks missing and incompatible configuration without fallback", () => {
    const missing = routeTask(task(), "IMPLEMENTATION", { deterministic_enabled: true, tiers: {} });
    assert.equal(missing.decision, "BLOCKED");
    assert.equal(missing.rationale_code, "UNSUPPORTED_ROUTE");
    const incompatible = routeTask(task({ executor_preference: "codex" }), "IMPLEMENTATION", configuration);
    assert.equal(incompatible.decision, "BLOCKED");
    assert.equal(incompatible.model, null);
  });

  it("blocks deterministic work when its explicit executor is disabled", () => {
    const route = routeTask(task(), "DETERMINISTIC", { ...configuration, deterministic_enabled: false });
    assert.equal(route.decision, "BLOCKED");
    assert.equal(route.rationale_code, "UNSUPPORTED_ROUTE");
  });

  it("rejects malformed configuration rather than guessing", () => {
    assert.throws(() => routeTask(task(), "IMPLEMENTATION", {
      deterministic_enabled: true,
      tiers: { T1: { executor: "opencode", model: "" } },
    }));
  });
});

function task(overrides: Partial<TaskMetadata> = {}): TaskMetadata {
  return {
    id: "TASK-100",
    title: "Fixture",
    status: "ready",
    priority: 1,
    milestone: "I1",
    model_tier: "free",
    risk: "low",
    architecture_impact: false,
    executor_preference: "opencode",
    depends_on: [],
    context_paths: ["AGENTS.md"],
    allowed_paths: ["tooling/**"],
    forbidden_paths: [],
    max_files: 1,
    validation: ["npm run verify"],
    ...overrides,
  };
}

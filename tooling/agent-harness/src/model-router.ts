import { z } from "zod";
import { executionRouteSchema, type ExecutionRoute } from "./execution-contracts.js";
import type { TaskMetadata } from "./task.js";

const configuredRouteSchema = z.object({
  executor: z.enum(["opencode", "codex"]),
  model: z.string().trim().min(1),
}).strict();

export const modelRouterConfigSchema = z.object({
  deterministic_enabled: z.boolean(),
  tiers: z.object({
    T1: configuredRouteSchema.optional(),
    T2: configuredRouteSchema.optional(),
    T3: configuredRouteSchema.optional(),
  }).strict(),
}).strict();

export type ModelRouterConfig = z.infer<typeof modelRouterConfigSchema>;
export type RoutingOperation = "DETERMINISTIC" | "IMPLEMENTATION";

export function routeTask(
  task: TaskMetadata,
  operation: RoutingOperation,
  configuration: ModelRouterConfig,
): ExecutionRoute {
  const config = modelRouterConfigSchema.parse(configuration);
  const risk = task.risk.toUpperCase() as ExecutionRoute["risk"];
  if (task.architecture_impact || task.model_tier === "architecture") {
    return executionRouteSchema.parse({
      risk,
      model_tier: "HUMAN_GATE",
      executor: "human",
      model: null,
      architecture_impact: task.architecture_impact,
      decision: "ESCALATION_REQUIRED",
      rationale_code: "ARCHITECTURE_REVIEW",
    });
  }
  if (task.risk === "high") {
    return executionRouteSchema.parse({
      risk,
      model_tier: "HUMAN_GATE",
      executor: "human",
      model: null,
      architecture_impact: false,
      decision: "ESCALATION_REQUIRED",
      rationale_code: "HIGH_RISK_REVIEW",
    });
  }
  if (operation === "DETERMINISTIC") {
    return config.deterministic_enabled
      ? executionRouteSchema.parse({
        risk,
        model_tier: "T0",
        executor: "deterministic",
        model: null,
        architecture_impact: false,
        decision: "SELECTED",
        rationale_code: "DETERMINISTIC_OPERATION",
      })
      : blockedRoute(risk);
  }
  const tier = task.model_tier === "free" ? "T1" : "T2";
  const configured = config.tiers[tier];
  if (!configured || !executorCompatible(task, configured.executor)) return blockedRoute(risk);
  return executionRouteSchema.parse({
    risk,
    model_tier: tier,
    executor: configured.executor,
    model: configured.model,
    architecture_impact: false,
    decision: "SELECTED",
    rationale_code: tier === "T1" ? "BOUNDED_LOW_RISK" : "BOUNDED_MODERATE_RISK",
  });
}

function executorCompatible(task: TaskMetadata, executor: "opencode" | "codex"): boolean {
  return task.executor_preference === "any" || task.executor_preference === executor;
}

function blockedRoute(risk: ExecutionRoute["risk"]): ExecutionRoute {
  return executionRouteSchema.parse({
    risk,
    model_tier: "HUMAN_GATE",
    executor: "human",
    model: null,
    architecture_impact: false,
    decision: "BLOCKED",
    rationale_code: "UNSUPPORTED_ROUTE",
  });
}

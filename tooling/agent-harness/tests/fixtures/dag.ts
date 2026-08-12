import type { DagGraph } from "../../src/dag.js";
import type { DependencyGate } from "../../src/execution-contracts.js";

export function gate(
  id: string,
  predecessor: string,
  successor: string,
  type: DependencyGate["type"] = "REQUIRES",
  status: DependencyGate["status"] = "SATISFIED",
): DependencyGate {
  return {
    schema_version: 1,
    id,
    predecessor_id: predecessor,
    successor_id: successor,
    type,
    status,
    evidence_refs: status === "SATISFIED" ? [`receipt:${id}`] : [],
  };
}

export const representativeDag: DagGraph = {
  schema_version: 1,
  external_nodes: [{ id: "TASK-012", state: "DONE" }],
  nodes: [
    { id: "WP-I1-03", state: "BLOCKED", dependency_gates: [gate("GATE-02-03", "WP-I1-02", "WP-I1-03")] },
    { id: "WP-I1-01", state: "DONE", dependency_gates: [gate("GATE-TASK-012", "TASK-012", "WP-I1-01", "CONTRACT_REQUIRES")] },
    { id: "WP-I1-04", state: "BLOCKED", dependency_gates: [gate("GATE-01-04", "WP-I1-01", "WP-I1-04", "INFORMS", "UNSATISFIED")] },
    { id: "WP-I1-02", state: "BLOCKED", dependency_gates: [gate("GATE-01-02", "WP-I1-01", "WP-I1-02")] },
    { id: "WP-I1-05", state: "BLOCKED", dependency_gates: [gate("GATE-01-05", "WP-I1-01", "WP-I1-05", "VALIDATION_REQUIRES", "UNSATISFIED")] },
  ],
};

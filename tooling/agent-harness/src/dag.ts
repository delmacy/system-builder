import { z } from "zod";
import {
  dependencyGateSchema,
  executionStateSchema,
  type DependencyGate,
  type ExecutionState,
} from "./execution-contracts.js";

const nodeIdSchema = z.string().regex(/^(?:TASK-[0-9]{3}(?:-[A-Z0-9-]+)?|WP-[A-Z0-9-]+)$/);

export const dagNodeSchema = z.object({
  id: nodeIdSchema,
  state: executionStateSchema,
  dependency_gates: z.array(dependencyGateSchema),
}).strict();

export const dagExternalNodeSchema = z.object({
  id: nodeIdSchema,
  state: executionStateSchema,
}).strict();

export const dagGraphSchema = z.object({
  schema_version: z.literal(1),
  nodes: z.array(dagNodeSchema).min(1),
  external_nodes: z.array(dagExternalNodeSchema),
}).strict();

export type DagNode = z.infer<typeof dagNodeSchema>;
export type DagExternalNode = z.infer<typeof dagExternalNodeSchema>;
export type DagGraph = z.infer<typeof dagGraphSchema>;

export type DagDiagnostic = {
  code: "DUPLICATE_NODE" | "NODE_COLLISION" | "GATE_SUCCESSOR_MISMATCH" | "MISSING_PREDECESSOR" | "CYCLE";
  node_id: string;
  gate_id: string | null;
  predecessor_id: string | null;
  message: string;
};

export type ReadinessBlocker = {
  code: "GATE_UNSATISFIED" | "PREDECESSOR_NOT_DONE" | "NODE_STATE_NOT_SCHEDULABLE";
  gate_id: string | null;
  predecessor_id: string | null;
  gate_type: DependencyGate["type"] | null;
  message: string;
};

export type NodeReadiness = {
  id: string;
  readiness: "READY" | "BLOCKED" | "TERMINAL";
  blockers: ReadinessBlocker[];
};

export type DagEvaluation = {
  schema_version: 1;
  topological_order: string[];
  ready: string[];
  nodes: NodeReadiness[];
};

export class DagValidationError extends Error {
  constructor(readonly diagnostics: DagDiagnostic[]) {
    super(diagnostics.map((diagnostic) => diagnostic.message).join("; "));
    this.name = "DagValidationError";
  }
}

export function validateDag(input: unknown): DagGraph {
  const graph = dagGraphSchema.parse(input);
  const diagnostics = structuralDiagnostics(graph);
  if (diagnostics.length > 0) throw new DagValidationError(diagnostics);
  const cycle = findCycle(graph);
  if (cycle) {
    throw new DagValidationError([{
      code: "CYCLE",
      node_id: cycle[0] ?? "unknown",
      gate_id: null,
      predecessor_id: null,
      message: `Dependency cycle: ${cycle.join(" -> ")}`,
    }]);
  }
  return graph;
}

export function topologicalOrder(input: unknown): string[] {
  const graph = validateDag(input);
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  const indegree = new Map(graph.nodes.map((node) => [node.id, 0]));
  const successors = new Map(graph.nodes.map((node) => [node.id, [] as string[]]));
  for (const node of graph.nodes) {
    for (const gate of node.dependency_gates) {
      if (!nodeIds.has(gate.predecessor_id)) continue;
      indegree.set(node.id, (indegree.get(node.id) ?? 0) + 1);
      successors.get(gate.predecessor_id)?.push(node.id);
    }
  }
  for (const values of successors.values()) values.sort();
  const available = [...indegree.entries()]
    .filter(([, count]) => count === 0)
    .map(([id]) => id)
    .sort();
  const order: string[] = [];
  while (available.length > 0) {
    const id = available.shift();
    if (!id) break;
    order.push(id);
    for (const successor of successors.get(id) ?? []) {
      const next = (indegree.get(successor) ?? 0) - 1;
      indegree.set(successor, next);
      if (next === 0) insertSorted(available, successor);
    }
  }
  return order;
}

export function evaluateDagReadiness(input: unknown): DagEvaluation {
  const graph = validateDag(input);
  const order = topologicalOrder(graph);
  const states = new Map<string, ExecutionState>([
    ...graph.external_nodes.map((node) => [node.id, node.state] as const),
    ...graph.nodes.map((node) => [node.id, node.state] as const),
  ]);
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  const nodes = order.map((id): NodeReadiness => evaluateNode(byId.get(id)!, states));
  return {
    schema_version: 1,
    topological_order: order,
    ready: nodes.filter((node) => node.readiness === "READY").map((node) => node.id),
    nodes,
  };
}

function structuralDiagnostics(graph: DagGraph): DagDiagnostic[] {
  const diagnostics: DagDiagnostic[] = [];
  const nodeCounts = countIds(graph.nodes);
  const externalCounts = countIds(graph.external_nodes);
  const knownIds = new Set([...nodeCounts.keys(), ...externalCounts.keys()]);
  for (const [id, count] of [...nodeCounts.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    if (count > 1) diagnostics.push({
      code: "DUPLICATE_NODE", node_id: id, gate_id: null, predecessor_id: null,
      message: `Duplicate DAG node: ${id}`,
    });
  }
  for (const [id, count] of [...externalCounts.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    if (count > 1) diagnostics.push({
      code: "DUPLICATE_NODE", node_id: id, gate_id: null, predecessor_id: null,
      message: `Duplicate external DAG node: ${id}`,
    });
    if (nodeCounts.has(id)) diagnostics.push({
      code: "NODE_COLLISION", node_id: id, gate_id: null, predecessor_id: id,
      message: `DAG node is also declared external: ${id}`,
    });
  }
  for (const node of [...graph.nodes].sort((left, right) => left.id.localeCompare(right.id))) {
    for (const gate of [...node.dependency_gates].sort((left, right) => left.id.localeCompare(right.id))) {
      if (gate.successor_id !== node.id) diagnostics.push({
        code: "GATE_SUCCESSOR_MISMATCH", node_id: node.id, gate_id: gate.id,
        predecessor_id: gate.predecessor_id,
        message: `${node.id}: gate ${gate.id} identifies successor ${gate.successor_id}`,
      });
      if (!knownIds.has(gate.predecessor_id)) diagnostics.push({
        code: "MISSING_PREDECESSOR", node_id: node.id, gate_id: gate.id,
        predecessor_id: gate.predecessor_id,
        message: `${node.id}: gate ${gate.id} references missing predecessor ${gate.predecessor_id}`,
      });
    }
  }
  return diagnostics;
}

function findCycle(graph: DagGraph): string[] | undefined {
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  const predecessors = new Map(graph.nodes.map((node) => [
    node.id,
    node.dependency_gates
      .map((gate) => gate.predecessor_id)
      .filter((id) => nodeIds.has(id))
      .sort(),
  ]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];
  const visit = (id: string): string[] | undefined => {
    const cycleStart = stack.indexOf(id);
    if (cycleStart >= 0) return [...stack.slice(cycleStart), id];
    if (visited.has(id)) return undefined;
    visiting.add(id);
    stack.push(id);
    for (const predecessor of predecessors.get(id) ?? []) {
      if (!visiting.has(predecessor) && visited.has(predecessor)) continue;
      const cycle = visit(predecessor);
      if (cycle) return cycle;
    }
    stack.pop();
    visiting.delete(id);
    visited.add(id);
    return undefined;
  };
  for (const id of [...nodeIds].sort()) {
    const cycle = visit(id);
    if (cycle) return cycle;
  }
  return undefined;
}

function evaluateNode(node: DagNode, states: Map<string, ExecutionState>): NodeReadiness {
  if (!["DRAFT", "READY", "BLOCKED"].includes(node.state)) {
    return {
      id: node.id,
      readiness: "TERMINAL",
      blockers: [{
        code: "NODE_STATE_NOT_SCHEDULABLE",
        gate_id: null,
        predecessor_id: null,
        gate_type: null,
        message: `${node.id} is ${node.state}, not a schedulable state`,
      }],
    };
  }
  const blockers: ReadinessBlocker[] = [];
  for (const gate of [...node.dependency_gates].sort((left, right) => left.id.localeCompare(right.id))) {
    if (gate.type === "INFORMS" || gate.status === "WAIVED") continue;
    if (gate.status !== "SATISFIED") {
      blockers.push({
        code: "GATE_UNSATISFIED",
        gate_id: gate.id,
        predecessor_id: gate.predecessor_id,
        gate_type: gate.type,
        message: `${node.id}: gate ${gate.id} from ${gate.predecessor_id} is ${gate.status}`,
      });
      continue;
    }
    if (gate.type === "REQUIRES" && states.get(gate.predecessor_id) !== "DONE") {
      blockers.push({
        code: "PREDECESSOR_NOT_DONE",
        gate_id: gate.id,
        predecessor_id: gate.predecessor_id,
        gate_type: gate.type,
        message: `${node.id}: required predecessor ${gate.predecessor_id} is ${states.get(gate.predecessor_id)}`,
      });
    }
  }
  return { id: node.id, readiness: blockers.length === 0 ? "READY" : "BLOCKED", blockers };
}

function countIds(nodes: Array<{ id: string }>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const node of nodes) counts.set(node.id, (counts.get(node.id) ?? 0) + 1);
  return counts;
}

function insertSorted(values: string[], value: string): void {
  const index = values.findIndex((candidate) => candidate.localeCompare(value) > 0);
  if (index < 0) values.push(value);
  else values.splice(index, 0, value);
}

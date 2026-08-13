import { z } from "zod";
import { dagGraphSchema, evaluateDagReadiness, type DagEvaluation, type DagGraph } from "./dag.js";
import { agentFactoryEvidenceEnvelopeSchema } from "./evidence-writer.js";
import { ledgerApplicationReceiptSchema } from "./ledger-engine.js";

const blockerSchema = z.object({
  code: z.enum(["GATE_UNSATISFIED", "PREDECESSOR_NOT_DONE", "NODE_STATE_NOT_SCHEDULABLE"]),
  gate_id: z.string().nullable(),
  predecessor_id: z.string().nullable(),
  gate_type: z.enum(["REQUIRES", "TOOL_REQUIRES", "VALIDATION_REQUIRES", "CONTRACT_REQUIRES", "INFORMS"]).nullable(),
  message: z.string().min(1),
}).strict();

const evaluationSchema = z.object({
  schema_version: z.literal(1),
  topological_order: z.array(z.string()),
  ready: z.array(z.string()),
  nodes: z.array(z.object({
    id: z.string(),
    readiness: z.enum(["READY", "BLOCKED", "TERMINAL"]),
    blockers: z.array(blockerSchema),
  }).strict()),
}).strict();

export const readinessRecomputationReceiptSchema = z.object({
  schema_version: z.literal(1),
  graph: dagGraphSchema,
  evaluation: evaluationSchema,
  previous_ready: z.array(z.string()),
  current_ready: z.array(z.string()),
  newly_ready: z.array(z.string()),
  changed_nodes: z.array(z.string()),
  changed_gates: z.array(z.string()),
}).strict();

export type ReadinessRecomputationReceipt = z.infer<typeof readinessRecomputationReceiptSchema>;

export function recomputeSuccessorReadiness(input: {
  graph: DagGraph;
  ledgerReceipt: unknown;
  evidence: unknown;
  evidenceRef: string;
}): ReadinessRecomputationReceipt {
  const graph = dagGraphSchema.parse(input.graph);
  const previous = evaluateDagReadiness(graph);
  const ledger = ledgerApplicationReceiptSchema.parse(input.ledgerReceipt);
  const evidence = agentFactoryEvidenceEnvelopeSchema.parse(input.evidence);
  const evidenceRef = z.string().min(1).parse(input.evidenceRef);

  if (!ledger.accepted) throw new Error("READINESS_LEDGER_NOT_ACCEPTED");
  const task = ledger.authoritative_task;
  const finalAttempt = ledger.attempts.at(-1);
  if (!finalAttempt || finalAttempt.status !== "ACCEPTED"
    || finalAttempt.evidence_receipt_id !== evidence.receipt_id
    || finalAttempt.evidence_ref !== evidenceRef
    || !ledger.transition.evidence_refs.includes(evidenceRef)) {
    throw new Error("READINESS_EVIDENCE_RECEIPT_MISMATCH");
  }
  if (task.task_id !== evidence.result.task_id || task.work_package_id !== evidence.result.work_package_id
    || ledger.transition.task_id !== task.task_id || ledger.transition.to !== task.state) {
    throw new Error("READINESS_IDENTITY_MISMATCH");
  }
  if (task.state === "DONE" && evidence.result.status !== "DONE") {
    throw new Error("READINESS_DONE_EVIDENCE_MISMATCH");
  }

  const next = structuredClone(graph);
  const matchingNode = next.nodes.find((node) => node.id === task.task_id)
    ?? next.nodes.find((node) => node.id === task.work_package_id);
  if (!matchingNode) throw new Error("READINESS_TASK_NODE_MISSING");
  const changedNodes = matchingNode.state === task.state ? [] : [matchingNode.id];
  matchingNode.state = task.state;

  const declaredGates = new Set(evidence.result.dependency_gates_satisfied);
  const changedGates: string[] = [];
  for (const node of next.nodes) {
    for (const gate of node.dependency_gates) {
      if (!declaredGates.has(gate.id)
        || ![task.task_id, task.work_package_id].includes(gate.predecessor_id)
        || gate.status === "SATISFIED") continue;
      gate.status = "SATISFIED";
      gate.evidence_refs = [...new Set([...gate.evidence_refs, evidenceRef])].sort();
      delete gate.waiver;
      changedGates.push(gate.id);
    }
  }

  const normalizedGraph = dagGraphSchema.parse(next);
  const evaluation = evaluateDagReadiness(normalizedGraph);
  return readinessRecomputationReceiptSchema.parse({
    schema_version: 1,
    graph: normalizedGraph,
    evaluation,
    previous_ready: previous.ready,
    current_ready: evaluation.ready,
    newly_ready: difference(evaluation.ready, previous.ready),
    changed_nodes: changedNodes.sort(),
    changed_gates: [...new Set(changedGates)].sort(),
  });
}

function difference(current: DagEvaluation["ready"], previous: DagEvaluation["ready"]): string[] {
  const existing = new Set(previous);
  return current.filter((id) => !existing.has(id)).sort();
}

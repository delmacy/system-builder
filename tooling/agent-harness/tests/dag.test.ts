import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DagValidationError,
  evaluateDagReadiness,
  topologicalOrder,
  validateDag,
  type DagGraph,
} from "../src/dag.js";
import { gate, representativeDag } from "./fixtures/dag.js";

describe("AgentFactory DAG and READY evaluator", () => {
  it("returns the same stable topological and READY order for equivalent input orderings", () => {
    const reversed = { ...representativeDag, nodes: [...representativeDag.nodes].reverse() };
    assert.deepEqual(topologicalOrder(representativeDag), ["WP-I1-01", "WP-I1-02", "WP-I1-03", "WP-I1-04", "WP-I1-05"]);
    assert.deepEqual(evaluateDagReadiness(representativeDag), evaluateDagReadiness(reversed));
    assert.deepEqual(evaluateDagReadiness(representativeDag).ready, ["WP-I1-02", "WP-I1-04"]);
  });

  it("keeps independent nodes READY when an unrelated mandatory gate is blocked", () => {
    const result = evaluateDagReadiness(representativeDag);
    const blocked = result.nodes.find((node) => node.id === "WP-I1-05");
    assert.equal(blocked?.readiness, "BLOCKED");
    assert.deepEqual(blocked?.blockers, [{
      code: "GATE_UNSATISFIED",
      gate_id: "GATE-01-05",
      predecessor_id: "WP-I1-01",
      gate_type: "VALIDATION_REQUIRES",
      message: "WP-I1-05: gate GATE-01-05 from WP-I1-01 is UNSATISFIED",
    }]);
    assert.ok(result.ready.includes("WP-I1-04"));
  });

  it("does not let a satisfied REQUIRES gate bypass predecessor completion", () => {
    const graph: DagGraph = {
      schema_version: 1,
      external_nodes: [],
      nodes: [
        { id: "WP-I1-01", state: "RUNNING", dependency_gates: [] },
        { id: "WP-I1-02", state: "BLOCKED", dependency_gates: [gate("GATE-01-02", "WP-I1-01", "WP-I1-02")] },
      ],
    };
    const successor = evaluateDagReadiness(graph).nodes.find((node) => node.id === "WP-I1-02");
    assert.equal(successor?.readiness, "BLOCKED");
    assert.equal(successor?.blockers[0]?.code, "PREDECESSOR_NOT_DONE");
    assert.equal(successor?.blockers[0]?.predecessor_id, "WP-I1-01");
  });

  it("lets explicit CONTRACT_REQUIRES evidence and INFORMS edges avoid full predecessor blocking", () => {
    const result = evaluateDagReadiness(representativeDag);
    assert.equal(result.nodes.find((node) => node.id === "WP-I1-04")?.readiness, "READY");
    const contractGraph: DagGraph = {
      schema_version: 1,
      external_nodes: [{ id: "TASK-012", state: "RUNNING" }],
      nodes: [{
        id: "WP-I1-01",
        state: "BLOCKED",
        dependency_gates: [gate("GATE-TASK-012", "TASK-012", "WP-I1-01", "CONTRACT_REQUIRES")],
      }],
    };
    assert.deepEqual(evaluateDagReadiness(contractGraph).ready, ["WP-I1-01"]);
  });

  it("rejects a missing predecessor with an exact machine-readable diagnostic", () => {
    const graph: DagGraph = {
      schema_version: 1,
      external_nodes: [],
      nodes: [{ id: "WP-I1-02", state: "BLOCKED", dependency_gates: [gate("GATE-MISSING", "WP-I1-01", "WP-I1-02")] }],
    };
    assert.throws(
      () => validateDag(graph),
      (error: unknown) => error instanceof DagValidationError
        && error.diagnostics[0]?.code === "MISSING_PREDECESSOR"
        && error.diagnostics[0]?.predecessor_id === "WP-I1-01",
    );
  });

  it("rejects dependency cycles with a deterministic path", () => {
    const graph: DagGraph = {
      schema_version: 1,
      external_nodes: [],
      nodes: [
        { id: "WP-I1-02", state: "BLOCKED", dependency_gates: [gate("GATE-01-02", "WP-I1-01", "WP-I1-02")] },
        { id: "WP-I1-01", state: "BLOCKED", dependency_gates: [gate("GATE-02-01", "WP-I1-02", "WP-I1-01")] },
      ],
    };
    assert.throws(
      () => validateDag(graph),
      (error: unknown) => error instanceof DagValidationError
        && error.diagnostics[0]?.code === "CYCLE"
        && error.diagnostics[0]?.message === "Dependency cycle: WP-I1-01 -> WP-I1-02 -> WP-I1-01",
    );
  });

  it("rejects duplicate nodes and gates whose successor does not own them", () => {
    const duplicate = { ...representativeDag, nodes: [...representativeDag.nodes, representativeDag.nodes[0]] };
    assert.throws(() => validateDag(duplicate), (error: unknown) => (
      error instanceof DagValidationError && error.diagnostics.some((diagnostic) => diagnostic.code === "DUPLICATE_NODE")
    ));
    const mismatch = structuredClone(representativeDag);
    mismatch.nodes[0]!.dependency_gates[0]!.successor_id = "WP-I1-04";
    assert.throws(() => validateDag(mismatch), (error: unknown) => (
      error instanceof DagValidationError
        && error.diagnostics.some((diagnostic) => diagnostic.code === "GATE_SUCCESSOR_MISMATCH")
    ));
  });
});

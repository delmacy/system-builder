import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  dependencyGateSchema,
  executionResultSchema,
  executionRouteSchema,
  executorAdapterResultSchema,
  executorRequestSchema,
  stateTransitionSchema,
  taskRecordSchema,
} from "../src/execution-contracts.js";
import {
  satisfiedDependencyGate,
  validAdapterResult,
  validExecutionResult,
  validExecutorRequest,
  validStateTransition,
  validTaskRecord,
} from "./fixtures/execution-contracts.js";

describe("AgentFactory execution contracts", () => {
  it("accepts the complete I1 task, gate, request, adapter result, evidence and transition fixtures", () => {
    assert.deepEqual(taskRecordSchema.parse(validTaskRecord), validTaskRecord);
    assert.deepEqual(dependencyGateSchema.parse(satisfiedDependencyGate), satisfiedDependencyGate);
    assert.deepEqual(executorRequestSchema.parse(validExecutorRequest), validExecutorRequest);
    assert.deepEqual(executorAdapterResultSchema.parse(validAdapterResult), validAdapterResult);
    assert.deepEqual(executionResultSchema.parse(validExecutionResult), validExecutionResult);
    assert.deepEqual(stateTransitionSchema.parse(validStateTransition), validStateTransition);
  });

  it("rejects unknown contract versions, states and fields", () => {
    assert.equal(taskRecordSchema.safeParse({ ...validTaskRecord, schema_version: 2 }).success, false);
    assert.equal(taskRecordSchema.safeParse({ ...validTaskRecord, state: "COMPLETE" }).success, false);
    assert.equal(taskRecordSchema.safeParse({ ...validTaskRecord, invented: true }).success, false);
  });

  it("fails closed when mandatory task and request traceability is missing or unsafe", () => {
    const orphanTask = Object.fromEntries(
      Object.entries(validTaskRecord).filter(([key]) => key !== "work_package_id"),
    );
    assert.equal(taskRecordSchema.safeParse(orphanTask).success, false);
    assert.equal(taskRecordSchema.safeParse({ ...validTaskRecord, acceptance_ids: [] }).success, false);
    assert.equal(executorRequestSchema.safeParse({
      ...validExecutorRequest,
      task_pack_path: "../undeclared/TASK_PACK.md",
    }).success, false);
  });

  it("requires satisfied and waived gates to carry explicit authority evidence", () => {
    assert.equal(dependencyGateSchema.safeParse({
      ...satisfiedDependencyGate,
      evidence_refs: [],
    }).success, false);
    assert.equal(dependencyGateSchema.safeParse({
      ...satisfiedDependencyGate,
      status: "WAIVED",
    }).success, false);
    assert.equal(dependencyGateSchema.safeParse({
      ...satisfiedDependencyGate,
      status: "WAIVED",
      evidence_refs: [],
      waiver: {
        authority: "maintainer",
        rationale: "accepted exception",
        risk_acceptance: "bounded",
        evidence_ref: "EVIDENCE-GATE-WAIVER",
      },
    }).success, true);
  });

  it("prevents critical, architecture and deterministic routes from silently routing downward", () => {
    assert.equal(executionRouteSchema.safeParse({
      ...validTaskRecord.route,
      risk: "CRITICAL",
    }).success, false);
    assert.equal(executionRouteSchema.safeParse({
      ...validTaskRecord.route,
      architecture_impact: true,
    }).success, false);
    assert.equal(executionRouteSchema.safeParse({
      ...validTaskRecord.route,
      model_tier: "T0",
    }).success, false);
  });

  it("does not permit failed adapter output or incomplete evidence to claim success", () => {
    assert.equal(executorAdapterResultSchema.safeParse({
      ...validAdapterResult,
      status: "FAILED",
    }).success, false);
    assert.equal(executionResultSchema.safeParse({
      ...validExecutionResult,
      tests: [{ command: "npm run verify", status: "FAIL", evidence: "exit 1" }],
    }).success, false);
    assert.equal(executionResultSchema.safeParse({
      ...validExecutionResult,
      dependency_gates_blocked: ["GATE-UNSATISFIED"],
    }).success, false);
  });

  it("requires evidence-backed transitions between distinct known states", () => {
    assert.equal(stateTransitionSchema.safeParse({
      ...validStateTransition,
      to: validStateTransition.from,
    }).success, false);
    assert.equal(stateTransitionSchema.safeParse({
      ...validStateTransition,
      evidence_refs: [],
    }).success, false);
  });
});

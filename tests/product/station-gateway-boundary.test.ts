import assert from "node:assert/strict";
import test from "node:test";
import { StationGateway, type StationCorePort } from "../../apps/station-gateway/index.js";
import {
  STATION_CORE_PROTOCOL_VERSION,
  type StationCommand,
  type StationProjection,
  type StationQuery,
  type StationSubscription,
} from "../../packages/contracts/station-core/index.js";

const session = { sessionRef: "session:1", stationRef: "station:a", coreRef: "core:local" };
const context = { coreRef: "core:local", organizationRef: "org:acme", systemRef: "system:erp" };

class FakeCorePort implements StationCorePort {
  queryCalls = 0;
  commandCalls = 0;
  eventCalls = 0;
  canonicalRevision = "workflow-revision:12";

  query(query: StationQuery): StationProjection {
    this.queryCalls += 1;
    return {
      requestRef: query.requestRef,
      context: query.context,
      projectionRef: query.projectionRef,
      projectionRevisionRef: "projection-revision:7",
      sourceRef: query.resourceRef,
      sourceRevisionRef: this.canonicalRevision,
      sourceAuthorityRef: "workflow-authority:canonical",
      currentness: "CURRENT",
      completeness: "KNOWN",
      payload: { name: "Approval" },
    };
  }

  command(command: StationCommand) {
    this.commandCalls += 1;
    this.canonicalRevision = "workflow-revision:13";
    return {
      commandRef: command.commandRef,
      status: "ACCEPTED" as const,
      resultingRevisionRef: this.canonicalRevision,
      evidenceRefs: ["evidence:command:1"],
      diagnostic: null,
    };
  }

  events(subscription: StationSubscription) {
    this.eventCalls += 1;
    return [{
      subscriptionRef: subscription.subscriptionRef,
      eventRef: "event:13",
      sequence: 13,
      kind: "WorkflowRenamed",
      subjectRef: subscription.resourceRef,
      subjectRevisionRef: this.canonicalRevision,
      occurredAt: "2026-09-23T14:00:00.000Z",
      payload: { name: "Approval v2" },
    }];
  }
}

function gateway(port = new FakeCorePort()) {
  return {
    port,
    value: new StationGateway(
      { coreRef: "core:local", coreVersion: "0.1.0", capabilityRefs: ["workflow"] },
      port,
    ),
  };
}

test("Gateway negotiates Station protocol without inventing business authority", () => {
  const { value } = gateway();
  const result = value.handshake({
    stationRef: "station:a",
    stationVersion: "0.1.0",
    supportedProtocolVersions: [STATION_CORE_PROTOCOL_VERSION],
  });
  assert.equal(result.ok, true);
  if (result.ok) assert.deepEqual(result.hello.capabilityRefs, ["workflow"]);

  const rejected = value.handshake({
    stationRef: "station:old",
    stationVersion: "0.0.1",
    supportedProtocolVersions: ["0.9.0"],
  });
  assert.equal(rejected.ok, false);
  if (!rejected.ok) assert.equal(rejected.diagnostic.code, "STATION_PROTOCOL_UNSUPPORTED");
});

test("Gateway routes projection reads through the injected Core port", async () => {
  const { value, port } = gateway();
  const result = await value.query({
    requestRef: "query:1",
    session,
    context,
    resourceRef: "workflow:42",
    projectionRef: "projection:workflow:42",
    parameters: {},
  });
  assert.equal(result.ok, true);
  assert.equal(port.queryCalls, 1);
  if (result.ok) {
    assert.equal(result.value.sourceRevisionRef, "workflow-revision:12");
    assert.equal(result.value.sourceAuthorityRef, "workflow-authority:canonical");
  }
});

test("Gateway delegates canonical command effects instead of storing domain state", async () => {
  const { value, port } = gateway();
  const result = await value.command({
    commandRef: "command:1",
    session,
    context,
    actorRef: "identity:alice",
    actorRevisionRef: "identity-revision:3",
    actionRef: "workflow.rename",
    targetRef: "workflow:42",
    expectedRevisionRef: "workflow-revision:12",
    payload: { name: "Approval v2" },
  });
  assert.equal(result.ok, true);
  assert.equal(port.commandCalls, 1);
  assert.equal(port.canonicalRevision, "workflow-revision:13");
  assert.equal(Object.prototype.hasOwnProperty.call(value, "canonicalRevision"), false);
});

test("Gateway validates context before a request reaches the Core port", async () => {
  const { value, port } = gateway();
  const result = await value.query({
    requestRef: "query:wrong-core",
    session: { ...session, coreRef: "core:other" },
    context: { ...context, coreRef: "core:other" },
    resourceRef: "workflow:42",
    projectionRef: "projection:workflow:42",
    parameters: {},
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.diagnostic.code, "STATION_CONTEXT_INVALID");
  assert.equal(port.queryCalls, 0);
});

test("Gateway validates replay ordering returned by the Core port", async () => {
  const port: StationCorePort = {
    query: () => { throw new Error("not used"); },
    command: () => { throw new Error("not used"); },
    events: (subscription) => [
      {
        subscriptionRef: subscription.subscriptionRef,
        eventRef: "event:12",
        sequence: 12,
        kind: "WorkflowChanged",
        subjectRef: subscription.resourceRef,
        subjectRevisionRef: "workflow-revision:12",
        occurredAt: "2026-09-23T14:00:00.000Z",
        payload: {},
      },
      {
        subscriptionRef: subscription.subscriptionRef,
        eventRef: "event:duplicate",
        sequence: 12,
        kind: "WorkflowChanged",
        subjectRef: subscription.resourceRef,
        subjectRevisionRef: "workflow-revision:12",
        occurredAt: "2026-09-23T14:00:01.000Z",
        payload: {},
      },
    ],
  };
  const value = new StationGateway({ coreRef: "core:local", coreVersion: "0.1.0" }, port);
  const result = await value.subscribe({
    subscriptionRef: "subscription:1",
    session,
    context,
    resourceRef: "workflow:42",
    afterSequence: 11,
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.diagnostic.code, "STATION_CORE_REJECTED");
    assert.equal(result.diagnostic.reconcileRequired, true);
  }
});

test("Gateway maps Core transport failure to a retryable diagnostic", async () => {
  const port: StationCorePort = {
    query: () => { throw new Error("core offline"); },
    command: () => { throw new Error("core offline"); },
    events: () => { throw new Error("core offline"); },
  };
  const value = new StationGateway({ coreRef: "core:local", coreVersion: "0.1.0" }, port);
  const result = await value.query({
    requestRef: "query:offline",
    session,
    context,
    resourceRef: "workflow:42",
    projectionRef: "projection:workflow:42",
    parameters: {},
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.diagnostic.code, "STATION_CORE_UNAVAILABLE");
    assert.equal(result.diagnostic.retryable, true);
  }
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  StationClient,
  type StationTransport,
  type StationTransportResult,
} from "../../packages/station-sdk/index.js";
import {
  STATION_CORE_PROTOCOL_VERSION,
  type StationCommand,
  type StationCommandReceipt,
  type StationEvent,
  type StationHandshakeResult,
  type StationProjection,
  type StationQuery,
  type StationSubscription,
} from "../../packages/contracts/station-core/index.js";

const session = { sessionRef: "session:1", stationRef: "station:a", coreRef: "core:local" };
const context = { coreRef: "core:local", organizationRef: "org:acme", systemRef: "system:erp" };

class InMemoryTransport implements StationTransport {
  handshakes = 0;
  queries = 0;
  commands = 0;
  subscriptions = 0;

  handshake(): StationHandshakeResult {
    this.handshakes += 1;
    return {
      ok: true,
      hello: {
        coreRef: "core:local",
        coreVersion: "0.1.0",
        protocolVersion: STATION_CORE_PROTOCOL_VERSION,
        capabilityRefs: ["workflow"],
      },
    };
  }

  query(query: StationQuery): StationTransportResult<StationProjection> {
    this.queries += 1;
    return {
      ok: true,
      value: {
        requestRef: query.requestRef,
        context: query.context,
        projectionRef: query.projectionRef,
        projectionRevisionRef: "projection-revision:1",
        sourceRef: query.resourceRef,
        sourceRevisionRef: "workflow-revision:7",
        sourceAuthorityRef: "workflow-authority:canonical",
        currentness: "CURRENT",
        completeness: "KNOWN",
        payload: { name: "Approval" },
      },
    };
  }

  command(command: StationCommand): StationTransportResult<StationCommandReceipt> {
    this.commands += 1;
    return {
      ok: true,
      value: {
        commandRef: command.commandRef,
        status: "ACCEPTED",
        resultingRevisionRef: "workflow-revision:8",
        evidenceRefs: ["evidence:1"],
        diagnostic: null,
      },
    };
  }

  subscribe(subscription: StationSubscription): StationTransportResult<readonly StationEvent[]> {
    this.subscriptions += 1;
    return {
      ok: true,
      value: [{
        subscriptionRef: subscription.subscriptionRef,
        eventRef: "event:8",
        sequence: 8,
        kind: "WorkflowChanged",
        subjectRef: subscription.resourceRef,
        subjectRevisionRef: "workflow-revision:8",
        occurredAt: "2026-09-23T14:00:00.000Z",
        payload: {},
      }],
    };
  }
}

test("Station SDK exposes one transport-neutral client contract", async () => {
  const transport = new InMemoryTransport();
  const client = new StationClient({ stationRef: "station:a", stationVersion: "0.1.0" }, transport);
  const handshake = await client.handshake();
  assert.equal(handshake.ok, true);
  assert.equal(transport.handshakes, 1);
  assert.deepEqual(client.hello.supportedProtocolVersions, [STATION_CORE_PROTOCOL_VERSION]);
});

test("SDK validates and forwards query, command and replay envelopes", async () => {
  const transport = new InMemoryTransport();
  const client = new StationClient({ stationRef: "station:a", stationVersion: "0.1.0" }, transport);

  const query = await client.query({
    requestRef: "query:1",
    session,
    context,
    resourceRef: "workflow:42",
    projectionRef: "projection:workflow:42",
    parameters: {},
  });
  assert.equal(query.ok, true);
  assert.equal(transport.queries, 1);

  const command = await client.command({
    commandRef: "command:1",
    session,
    context,
    actorRef: "identity:alice",
    actorRevisionRef: "identity-revision:3",
    actionRef: "workflow.rename",
    targetRef: "workflow:42",
    expectedRevisionRef: "workflow-revision:7",
    payload: { name: "Approval v2" },
  });
  assert.equal(command.ok, true);
  assert.equal(transport.commands, 1);

  const replay = await client.subscribe({
    subscriptionRef: "subscription:1",
    session,
    context,
    resourceRef: "workflow:42",
    afterSequence: 7,
  });
  assert.equal(replay.ok, true);
  assert.equal(transport.subscriptions, 1);
  if (replay.ok) assert.deepEqual(replay.value.map((event) => event.sequence), [8]);
});

test("SDK preserves diagnostics rather than converting failure into success", async () => {
  const transport: StationTransport = {
    handshake: () => ({
      ok: false,
      diagnostic: {
        code: "STATION_PROTOCOL_UNSUPPORTED",
        detail: "unsupported",
        retryable: false,
        reconcileRequired: true,
      },
    }),
    query: () => ({
      ok: false,
      diagnostic: {
        code: "STATION_CORE_UNAVAILABLE",
        detail: "offline",
        retryable: true,
        reconcileRequired: false,
      },
    }),
    command: () => { throw new Error("not used"); },
    subscribe: () => { throw new Error("not used"); },
  };
  const client = new StationClient({ stationRef: "station:a", stationVersion: "0.1.0" }, transport);
  const handshake = await client.handshake();
  assert.equal(handshake.ok, false);
  if (!handshake.ok) assert.equal(handshake.diagnostic.code, "STATION_PROTOCOL_UNSUPPORTED");

  const query = await client.query({
    requestRef: "query:offline",
    session,
    context,
    resourceRef: "workflow:42",
    projectionRef: "projection:workflow:42",
    parameters: {},
  });
  assert.equal(query.ok, false);
  if (!query.ok) {
    assert.equal(query.diagnostic.code, "STATION_CORE_UNAVAILABLE");
    assert.equal(query.diagnostic.retryable, true);
  }
});

test("SDK rejects invalid Core output instead of strengthening it", async () => {
  const transport = new InMemoryTransport();
  transport.query = (query: StationQuery) => ({
    ok: true,
    value: {
      requestRef: "query:wrong",
      context: query.context,
      projectionRef: query.projectionRef,
      projectionRevisionRef: "projection-revision:1",
      sourceRef: query.resourceRef,
      sourceRevisionRef: "workflow-revision:7",
      sourceAuthorityRef: "workflow-authority:canonical",
      currentness: "CURRENT",
      completeness: "KNOWN",
      payload: {},
    },
  });
  const client = new StationClient({ stationRef: "station:a", stationVersion: "0.1.0" }, transport);
  await assert.rejects(
    client.query({
      requestRef: "query:expected",
      session,
      context,
      resourceRef: "workflow:42",
      projectionRef: "projection:workflow:42",
      parameters: {},
    }),
    /request ref does not match/,
  );
});

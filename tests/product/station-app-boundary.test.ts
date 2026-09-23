import assert from "node:assert/strict";
import test from "node:test";
import { StationApplication } from "../../apps/station/index.js";
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
  type StationProjection,
  type StationQuery,
  type StationSubscription,
} from "../../packages/contracts/station-core/index.js";

class FakeTransport implements StationTransport {
  canonicalRevision = "workflow-revision:1";
  queryCount = 0;
  commandCount = 0;

  handshake() {
    return {
      ok: true as const,
      hello: {
        coreRef: "core:local",
        coreVersion: "0.1.0",
        protocolVersion: STATION_CORE_PROTOCOL_VERSION,
        capabilityRefs: ["workflow"],
      },
    };
  }

  query(query: StationQuery): StationTransportResult<StationProjection> {
    this.queryCount += 1;
    return {
      ok: true,
      value: {
        requestRef: query.requestRef,
        context: query.context,
        projectionRef: query.projectionRef,
        projectionRevisionRef: "projection-revision:1",
        sourceRef: query.resourceRef,
        sourceRevisionRef: this.canonicalRevision,
        sourceAuthorityRef: "workflow-authority:canonical",
        currentness: "CURRENT",
        completeness: "KNOWN",
        payload: { name: "Approval" },
      },
    };
  }

  command(command: StationCommand): StationTransportResult<StationCommandReceipt> {
    this.commandCount += 1;
    this.canonicalRevision = "workflow-revision:2";
    return {
      ok: true,
      value: {
        commandRef: command.commandRef,
        status: "ACCEPTED",
        resultingRevisionRef: this.canonicalRevision,
        evidenceRefs: ["evidence:command:1"],
        diagnostic: null,
      },
    };
  }

  subscribe(subscription: StationSubscription): StationTransportResult<readonly StationEvent[]> {
    return {
      ok: true,
      value: [{
        subscriptionRef: subscription.subscriptionRef,
        eventRef: "event:2",
        sequence: 2,
        kind: "WorkflowChanged",
        subjectRef: subscription.resourceRef,
        subjectRevisionRef: this.canonicalRevision,
        occurredAt: "2026-09-23T14:00:00.000Z",
        payload: {},
      }],
    };
  }
}

function fixture() {
  const transport = new FakeTransport();
  const client = new StationClient({ stationRef: "station:a", stationVersion: "0.1.0" }, transport);
  const station = new StationApplication(client);
  return { transport, station };
}

test("Station connects and keeps only disposable session/context state", async () => {
  const { station } = fixture();
  const handshake = await station.connect({
    sessionRef: "session:1",
    stationRef: "station:a",
    coreRef: "core:local",
  });
  assert.equal(handshake.ok, true);
  const connectedState = station.state;
  assert.deepEqual(connectedState, {
    connected: true,
    coreRef: "core:local",
    sessionRef: "session:1",
    context: { coreRef: "core:local" },
  });

  station.setContext({
    coreRef: "core:local",
    organizationRef: "org:acme",
    systemRef: "system:erp",
    environmentRef: "env:dev",
  });
  const contextualState = station.state;
  assert.equal(contextualState.context?.systemRef, "system:erp");
});

test("Station issues reads and effects only through StationClient", async () => {
  const { station, transport } = fixture();
  await station.connect({ sessionRef: "session:1", stationRef: "station:a", coreRef: "core:local" });
  station.setContext({ coreRef: "core:local", organizationRef: "org:acme", systemRef: "system:erp" });

  const query = await station.query({
    requestRef: "query:1",
    resourceRef: "workflow:42",
    projectionRef: "projection:workflow:42",
    parameters: {},
  });
  assert.equal(query.ok, true);
  assert.equal(transport.queryCount, 1);

  const command = await station.command({
    commandRef: "command:1",
    actorRef: "identity:alice",
    actorRevisionRef: "identity-revision:3",
    actionRef: "workflow.rename",
    targetRef: "workflow:42",
    expectedRevisionRef: "workflow-revision:1",
    payload: { name: "Approval v2" },
  });
  assert.equal(command.ok, true);
  assert.equal(transport.commandCount, 1);
  assert.equal(transport.canonicalRevision, "workflow-revision:2");
});

test("disconnecting or discarding Station state does not roll back remote canonical state", async () => {
  const { station, transport } = fixture();
  await station.connect({ sessionRef: "session:1", stationRef: "station:a", coreRef: "core:local" });
  await station.command({
    commandRef: "command:1",
    actorRef: "identity:alice",
    actorRevisionRef: "identity-revision:3",
    actionRef: "workflow.rename",
    targetRef: "workflow:42",
    expectedRevisionRef: "workflow-revision:1",
    payload: { name: "Approval v2" },
  });
  station.disconnect();
  assert.deepEqual(station.state, { connected: false, coreRef: null, sessionRef: null, context: null });
  assert.equal(transport.canonicalRevision, "workflow-revision:2");
  await assert.rejects(
    station.query({
      requestRef: "query:after-disconnect",
      resourceRef: "workflow:42",
      projectionRef: "projection:workflow:42",
      parameters: {},
    }),
    /not connected/,
  );
});

test("Station refuses cross-Core context or a session for another Station", async () => {
  const { station } = fixture();
  await assert.rejects(
    station.connect({ sessionRef: "session:bad", stationRef: "station:other", coreRef: "core:local" }),
    /does not belong/,
  );

  await station.connect({ sessionRef: "session:1", stationRef: "station:a", coreRef: "core:local" });
  assert.throws(
    () => station.setContext({ coreRef: "core:other", systemRef: "system:erp" }),
    /must remain on the connected Core/,
  );
});

test("Station can request event replay without owning the event stream", async () => {
  const { station } = fixture();
  await station.connect({ sessionRef: "session:1", stationRef: "station:a", coreRef: "core:local" });
  const replay = await station.replay({
    subscriptionRef: "subscription:workflow:42",
    resourceRef: "workflow:42",
    afterSequence: 1,
  });
  assert.equal(replay.ok, true);
  if (replay.ok) assert.deepEqual(replay.value.map((event) => event.sequence), [2]);
});

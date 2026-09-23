import assert from "node:assert/strict";
import test from "node:test";

import { StationApplication } from "../../apps/station/index.js";
import { StationGateway, type StationCorePort } from "../../apps/station-gateway/index.js";
import {
  STATION_CORE_PROTOCOL_VERSION,
  type StationCommand,
  type StationCommandReceipt,
  type StationDiagnostic,
  type StationEvent,
  type StationProjection,
  type StationQuery,
  type StationSubscription,
} from "../../packages/contracts/station-core/index.js";
import {
  StationClient,
  type StationTransport,
  type StationTransportResult,
} from "../../packages/station-sdk/index.js";

type CanonicalWorkflowState = Readonly<{
  ref: string;
  revision: number;
  name: string;
}>;

class InMemoryCorePort implements StationCorePort {
  #workflow: CanonicalWorkflowState = Object.freeze({
    ref: "workflow:42",
    revision: 7,
    name: "Approval",
  });

  #eventSequence = 0;
  #events: StationEvent[] = [];

  get snapshot(): CanonicalWorkflowState {
    return this.#workflow;
  }

  query(query: StationQuery): StationProjection {
    if (query.resourceRef !== this.#workflow.ref) throw new Error("resource not found");
    return {
      requestRef: query.requestRef,
      context: query.context,
      projectionRef: query.projectionRef,
      projectionRevisionRef: `projection-revision:${this.#workflow.revision}`,
      sourceRef: this.#workflow.ref,
      sourceRevisionRef: this.#revisionRef(),
      sourceAuthorityRef: "workflow-authority:canonical",
      currentness: "CURRENT",
      completeness: "KNOWN",
      payload: Object.freeze({ name: this.#workflow.name }),
    };
  }

  command(command: StationCommand): StationCommandReceipt {
    if (command.targetRef !== this.#workflow.ref) {
      return this.#rejected(command.commandRef, "target not found", false);
    }
    if (command.actionRef !== "workflow.rename") {
      return this.#rejected(command.commandRef, "unsupported action", false);
    }
    if (command.expectedRevisionRef !== this.#revisionRef()) {
      return this.#rejected(command.commandRef, "revision conflict", true);
    }

    const name = command.payload.name;
    if (typeof name !== "string" || name.trim().length === 0) {
      return this.#rejected(command.commandRef, "name must be non-empty", false);
    }

    this.#advance(name.trim(), "WorkflowRenamed");
    return {
      commandRef: command.commandRef,
      status: "ACCEPTED",
      resultingRevisionRef: this.#revisionRef(),
      evidenceRefs: [`evidence:${command.commandRef}`],
      diagnostic: null,
    };
  }

  events(subscription: StationSubscription): readonly StationEvent[] {
    const after = subscription.afterSequence ?? -1;
    return this.#events
      .filter((event) => event.subjectRef === subscription.resourceRef && event.sequence > after)
      .map((event) => Object.freeze({ ...event, subscriptionRef: subscription.subscriptionRef }));
  }

  advanceWhileStationIsDisconnected(name: string): void {
    this.#advance(name, "WorkflowChangedByCore");
  }

  #advance(name: string, kind: string): void {
    this.#workflow = Object.freeze({
      ...this.#workflow,
      revision: this.#workflow.revision + 1,
      name,
    });
    this.#eventSequence += 1;
    this.#events.push(Object.freeze({
      subscriptionRef: "core:event-stream",
      eventRef: `event:${this.#eventSequence}`,
      sequence: this.#eventSequence,
      kind,
      subjectRef: this.#workflow.ref,
      subjectRevisionRef: this.#revisionRef(),
      occurredAt: `2026-09-23T14:00:0${this.#eventSequence}.000Z`,
      payload: Object.freeze({ name: this.#workflow.name }),
    }));
  }

  #revisionRef(): string {
    return `workflow-revision:${this.#workflow.revision}`;
  }

  #rejected(commandRef: string, detail: string, reconcileRequired: boolean): StationCommandReceipt {
    const diagnostic: StationDiagnostic = {
      code: "STATION_CORE_REJECTED",
      detail,
      retryable: false,
      reconcileRequired,
    };
    return {
      commandRef,
      status: "REJECTED",
      resultingRevisionRef: null,
      evidenceRefs: [],
      diagnostic,
    };
  }
}

class GatewayTransport implements StationTransport {
  readonly #gateway: StationGateway;

  constructor(gateway: StationGateway) {
    this.#gateway = gateway;
  }

  handshake(hello: Parameters<StationTransport["handshake"]>[0]) {
    return this.#gateway.handshake(hello);
  }

  query(query: StationQuery): Promise<StationTransportResult<StationProjection>> {
    return this.#gateway.query(query);
  }

  command(command: StationCommand): Promise<StationTransportResult<StationCommandReceipt>> {
    return this.#gateway.command(command);
  }

  subscribe(subscription: StationSubscription): Promise<StationTransportResult<readonly StationEvent[]>> {
    return this.#gateway.subscribe(subscription);
  }
}

function system(options: Readonly<{ protocolVersions?: readonly string[] }> = {}) {
  const core = new InMemoryCorePort();
  const gateway = new StationGateway(
    {
      coreRef: "core:local",
      coreVersion: "0.1.0",
      capabilityRefs: ["workflow"],
    },
    core,
  );
  const client = new StationClient(
    {
      stationRef: "station:desktop-a",
      stationVersion: "0.1.0",
      supportedProtocolVersions: options.protocolVersions,
    },
    new GatewayTransport(gateway),
  );
  const station = new StationApplication(client);
  return { core, gateway, client, station };
}

const context = Object.freeze({
  coreRef: "core:local",
  organizationRef: "org:acme",
  systemRef: "system:erp",
  environmentRef: "env:dev",
  workspaceRef: "workspace:workflow",
});

test("Station -> SDK -> Gateway -> Core port completes a full query, command and event journey", async () => {
  const { core, station } = system();

  const handshake = await station.connect({
    sessionRef: "session:1",
    stationRef: "station:desktop-a",
    coreRef: "core:local",
  });
  assert.equal(handshake.ok, true);
  station.setContext(context);

  const initial = await station.query({
    requestRef: "query:initial",
    resourceRef: "workflow:42",
    projectionRef: "projection:workflow:42",
    parameters: {},
  });
  assert.equal(initial.ok, true);
  if (!initial.ok) return;
  assert.equal(initial.value.sourceRevisionRef, "workflow-revision:7");
  assert.deepEqual(initial.value.payload, { name: "Approval" });
  assert.equal(core.snapshot.name, "Approval");

  const command = await station.command({
    commandRef: "command:rename:1",
    actorRef: "identity:alice",
    actorRevisionRef: "identity-revision:3",
    actionRef: "workflow.rename",
    targetRef: "workflow:42",
    expectedRevisionRef: initial.value.sourceRevisionRef,
    payload: { name: "Approval v2" },
  });
  assert.equal(command.ok, true);
  if (!command.ok) return;
  assert.equal(command.value.status, "ACCEPTED");
  assert.equal(command.value.resultingRevisionRef, "workflow-revision:8");
  assert.equal(core.snapshot.name, "Approval v2");

  const events = await station.replay({
    subscriptionRef: "subscription:workflow:42",
    resourceRef: "workflow:42",
    afterSequence: null,
  });
  assert.equal(events.ok, true);
  if (events.ok) {
    assert.deepEqual(events.value.map((event) => event.sequence), [1]);
    assert.equal(events.value[0]?.subjectRevisionRef, "workflow-revision:8");
  }

  assert.equal(Object.prototype.hasOwnProperty.call(station, "workflow"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(station, "canonicalRevision"), false);
});

test("Station disconnect does not stop Core state evolution and reconnect replays only events after the cursor", async () => {
  const { core, station } = system();

  await station.connect({
    sessionRef: "session:before-disconnect",
    stationRef: "station:desktop-a",
    coreRef: "core:local",
  });
  station.setContext(context);

  const first = await station.command({
    commandRef: "command:before-disconnect",
    actorRef: "identity:alice",
    actorRevisionRef: "identity-revision:3",
    actionRef: "workflow.rename",
    targetRef: "workflow:42",
    expectedRevisionRef: "workflow-revision:7",
    payload: { name: "Approval v2" },
  });
  assert.equal(first.ok, true);
  assert.equal(core.snapshot.revision, 8);

  station.disconnect();
  assert.equal(station.state.connected, false);

  core.advanceWhileStationIsDisconnected("Approval v3");
  assert.equal(core.snapshot.revision, 9);
  assert.equal(core.snapshot.name, "Approval v3");

  const reconnect = await station.connect({
    sessionRef: "session:after-reconnect",
    stationRef: "station:desktop-a",
    coreRef: "core:local",
  });
  assert.equal(reconnect.ok, true);
  station.setContext(context);

  const replay = await station.replay({
    subscriptionRef: "subscription:workflow:42:reconnect",
    resourceRef: "workflow:42",
    afterSequence: 1,
  });
  assert.equal(replay.ok, true);
  if (replay.ok) {
    assert.deepEqual(replay.value.map((event) => event.sequence), [2]);
    assert.equal(replay.value[0]?.kind, "WorkflowChangedByCore");
    assert.equal(replay.value[0]?.subjectRevisionRef, "workflow-revision:9");
  }
});

test("incompatible Station protocol fails closed and establishes no connected Station state", async () => {
  const { station } = system({ protocolVersions: ["0.9.0"] });
  const result = await station.connect({
    sessionRef: "session:legacy",
    stationRef: "station:desktop-a",
    coreRef: "core:local",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.diagnostic.code, "STATION_PROTOCOL_UNSUPPORTED");
    assert.equal(result.diagnostic.reconcileRequired, true);
  }
  assert.equal(station.state.connected, false);
  assert.equal(station.state.context, null);
});

test("malformed cross-Core context is rejected by the Station before it can redirect canonical work", async () => {
  const { station, core } = system();
  await station.connect({
    sessionRef: "session:context",
    stationRef: "station:desktop-a",
    coreRef: "core:local",
  });

  assert.throws(
    () => station.setContext({ ...context, coreRef: "core:other" }),
    /context must remain on the connected Core/,
  );
  assert.equal(core.snapshot.revision, 7);
});

test("stale command revision is rejected by Core and no Station layer strengthens it into success", async () => {
  const { station, core } = system();
  await station.connect({
    sessionRef: "session:stale",
    stationRef: "station:desktop-a",
    coreRef: "core:local",
  });
  station.setContext(context);

  const result = await station.command({
    commandRef: "command:stale",
    actorRef: "identity:alice",
    actorRevisionRef: "identity-revision:3",
    actionRef: "workflow.rename",
    targetRef: "workflow:42",
    expectedRevisionRef: "workflow-revision:6",
    payload: { name: "Should not apply" },
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.status, "REJECTED");
  assert.equal(result.value.resultingRevisionRef, null);
  assert.equal(result.value.diagnostic?.code, "STATION_CORE_REJECTED");
  assert.equal(result.value.diagnostic?.reconcileRequired, true);
  assert.equal(core.snapshot.revision, 7);
  assert.equal(core.snapshot.name, "Approval");
});

test("replay cursor cannot duplicate or strengthen already-consumed events", async () => {
  const { station } = system();
  await station.connect({
    sessionRef: "session:replay",
    stationRef: "station:desktop-a",
    coreRef: "core:local",
  });
  station.setContext(context);

  await station.command({
    commandRef: "command:event:1",
    actorRef: "identity:alice",
    actorRevisionRef: "identity-revision:3",
    actionRef: "workflow.rename",
    targetRef: "workflow:42",
    expectedRevisionRef: "workflow-revision:7",
    payload: { name: "Approval v2" },
  });
  await station.command({
    commandRef: "command:event:2",
    actorRef: "identity:alice",
    actorRevisionRef: "identity-revision:3",
    actionRef: "workflow.rename",
    targetRef: "workflow:42",
    expectedRevisionRef: "workflow-revision:8",
    payload: { name: "Approval v3" },
  });

  const firstReplay = await station.replay({
    subscriptionRef: "subscription:cursor:1",
    resourceRef: "workflow:42",
    afterSequence: null,
  });
  assert.equal(firstReplay.ok, true);
  if (!firstReplay.ok) return;
  assert.deepEqual(firstReplay.value.map((event) => event.sequence), [1, 2]);

  const resumed = await station.replay({
    subscriptionRef: "subscription:cursor:2",
    resourceRef: "workflow:42",
    afterSequence: 1,
  });
  assert.equal(resumed.ok, true);
  if (resumed.ok) assert.deepEqual(resumed.value.map((event) => event.sequence), [2]);
});

test("supported version constant remains the negotiated Construction-A protocol", () => {
  assert.equal(STATION_CORE_PROTOCOL_VERSION, "1.0.0");
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  STATION_CORE_PROTOCOL_VERSION,
  assertMonotonicStationEvents,
  negotiateStationProtocol,
  normalizeStationCommand,
  normalizeStationCommandReceipt,
  normalizeStationContext,
  normalizeStationProjection,
  normalizeStationQuery,
  stationProjectionEstablishesCanonicalTruth,
  type StationEvent,
} from "../../packages/contracts/station-core/index.js";

const session = { sessionRef: "session:1", stationRef: "station:desktop-a", coreRef: "core:local" };
const context = { coreRef: "core:local", organizationRef: "org:acme", systemRef: "system:erp", environmentRef: "env:dev" };

test("negotiates only an explicitly compatible Station/Core protocol", () => {
  const accepted = negotiateStationProtocol({
    hello: { stationRef: "station:desktop-a", stationVersion: "0.1.0", supportedProtocolVersions: ["0.9.0", STATION_CORE_PROTOCOL_VERSION] },
    coreRef: "core:local",
    coreVersion: "0.1.0",
    capabilityRefs: ["workflow", "deploy"],
  });
  assert.equal(accepted.ok, true);
  if (accepted.ok) {
    assert.equal(accepted.hello.protocolVersion, STATION_CORE_PROTOCOL_VERSION);
    assert.deepEqual(accepted.hello.capabilityRefs, ["deploy", "workflow"]);
  }

  const rejected = negotiateStationProtocol({
    hello: { stationRef: "station:old", stationVersion: "0.0.1", supportedProtocolVersions: ["0.9.0"] },
    coreRef: "core:local",
    coreVersion: "0.1.0",
  });
  assert.equal(rejected.ok, false);
  if (!rejected.ok) assert.equal(rejected.diagnostic.code, "STATION_PROTOCOL_UNSUPPORTED");
});

test("context and session cannot silently cross Core boundaries", () => {
  assert.deepEqual(normalizeStationContext(context), context);
  assert.throws(
    () => normalizeStationQuery({
      requestRef: "query:1",
      session,
      context: { ...context, coreRef: "core:other" },
      resourceRef: "workflow:42",
      projectionRef: "projection:workflow:42",
      parameters: {},
    }),
    /session core must match context core/,
  );
  assert.throws(() => normalizeStationContext({ ...context, injectedAuthority: "admin" }), /unexpected field/);
});

test("projection remains revision-qualified presentation rather than canonical truth", () => {
  const query = normalizeStationQuery({
    requestRef: "query:1",
    session,
    context,
    resourceRef: "workflow:42",
    projectionRef: "projection:workflow:42",
    parameters: { include: "summary" },
  });
  const projection = normalizeStationProjection({
    requestRef: "query:1",
    context,
    projectionRef: "projection:workflow:42",
    projectionRevisionRef: "projection-revision:7",
    sourceRef: "workflow:42",
    sourceRevisionRef: "workflow-revision:12",
    sourceAuthorityRef: "workflow-authority:canonical",
    currentness: "STALE",
    completeness: "PARTIAL",
    payload: { name: "Approval" },
  }, query);
  assert.equal(projection.sourceRevisionRef, "workflow-revision:12");
  assert.equal(projection.currentness, "STALE");
  assert.equal(stationProjectionEstablishesCanonicalTruth(projection), false);

  assert.throws(
    () => normalizeStationProjection({ ...projection, projectionRef: "workflow:42" }, query),
    /identity must remain distinct/,
  );
  assert.throws(
    () => normalizeStationProjection({ ...projection, requestRef: "query:other" }, query),
    /request ref does not match/,
  );
});

test("command carries actor, context, target and optimistic revision references without granting authority", () => {
  const command = normalizeStationCommand({
    commandRef: "command:rename:1",
    session,
    context,
    actorRef: "identity:alice",
    actorRevisionRef: "identity-revision:3",
    actionRef: "workflow.rename",
    targetRef: "workflow:42",
    expectedRevisionRef: "workflow-revision:12",
    payload: { name: "Approval v2" },
  });
  assert.equal(command.expectedRevisionRef, "workflow-revision:12");
  assert.equal(command.actorRevisionRef, "identity-revision:3");

  const accepted = normalizeStationCommandReceipt({
    commandRef: command.commandRef,
    status: "ACCEPTED",
    resultingRevisionRef: "workflow-revision:13",
    evidenceRefs: ["evidence:rename:1"],
    diagnostic: null,
  }, command.commandRef);
  assert.equal(accepted.status, "ACCEPTED");

  assert.throws(
    () => normalizeStationCommandReceipt({
      commandRef: command.commandRef,
      status: "REJECTED",
      resultingRevisionRef: "workflow-revision:13",
      evidenceRefs: [],
      diagnostic: null,
    }),
    /rejected command requires a diagnostic|non-accepted command cannot claim/,
  );
});

test("events are subscription-scoped and monotonic for reconnect replay", () => {
  const events: readonly StationEvent[] = [
    {
      subscriptionRef: "subscription:workflow:42",
      eventRef: "event:11",
      sequence: 11,
      kind: "WorkflowRenamed",
      subjectRef: "workflow:42",
      subjectRevisionRef: "workflow-revision:13",
      occurredAt: "2026-09-23T13:00:00.000Z",
      payload: { name: "Approval v2" },
    },
    {
      subscriptionRef: "subscription:workflow:42",
      eventRef: "event:12",
      sequence: 12,
      kind: "WorkflowValidated",
      subjectRef: "workflow:42",
      subjectRevisionRef: "workflow-revision:13",
      occurredAt: "2026-09-23T13:00:01.000Z",
      payload: { valid: true },
    },
  ];
  assert.deepEqual(assertMonotonicStationEvents(events, "subscription:workflow:42", 10).map((event) => event.sequence), [11, 12]);
  assert.throws(
    () => assertMonotonicStationEvents([events[0]!, { ...events[1]!, sequence: 11 }], "subscription:workflow:42", 10),
    /increase monotonically/,
  );
  assert.throws(
    () => assertMonotonicStationEvents(events, "subscription:other", 10),
    /does not match expected subscription/,
  );
});

test("malformed envelopes fail deterministically instead of accepting UI-supplied authority", () => {
  assert.throws(
    () => normalizeStationCommand({
      commandRef: "command:1",
      session,
      context,
      actorRef: "identity:alice",
      actorRevisionRef: "identity-revision:3",
      actionRef: "workflow.rename",
      targetRef: "workflow:42",
      expectedRevisionRef: null,
      payload: {},
      authorized: true,
    }),
    /unexpected field authorized/,
  );
});

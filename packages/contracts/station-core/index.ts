export const STATION_CORE_PROTOCOL_VERSION = "1.0.0" as const;

export type StationCoreProtocolVersion = typeof STATION_CORE_PROTOCOL_VERSION;
export type StationProjectionCurrentness = "CURRENT" | "STALE" | "UNKNOWN";
export type StationProjectionCompleteness = "KNOWN" | "PARTIAL" | "UNKNOWN" | "INCONCLUSIVE";
export type StationCommandStatus = "ACCEPTED" | "REJECTED" | "UNKNOWN";

export type StationDiagnosticCode =
  | "STATION_PROTOCOL_UNSUPPORTED"
  | "STATION_PROTOCOL_INVALID"
  | "STATION_CONTEXT_INVALID"
  | "STATION_QUERY_INVALID"
  | "STATION_COMMAND_INVALID"
  | "STATION_EVENT_INVALID"
  | "STATION_CORE_REJECTED"
  | "STATION_CORE_UNAVAILABLE";

export type StationDiagnostic = Readonly<{
  code: StationDiagnosticCode;
  detail: string;
  retryable: boolean;
  reconcileRequired: boolean;
}>;

export type StationHello = Readonly<{
  stationRef: string;
  stationVersion: string;
  supportedProtocolVersions: readonly string[];
}>;

export type CoreHello = Readonly<{
  coreRef: string;
  coreVersion: string;
  protocolVersion: StationCoreProtocolVersion;
  capabilityRefs: readonly string[];
}>;

export type StationHandshakeResult =
  | Readonly<{ ok: true; hello: CoreHello }>
  | Readonly<{ ok: false; diagnostic: StationDiagnostic }>;

export type StationSessionRef = Readonly<{
  sessionRef: string;
  stationRef: string;
  coreRef: string;
}>;

export type StationContext = Readonly<{
  coreRef: string;
  organizationRef?: string;
  systemRef?: string;
  environmentRef?: string;
  workspaceRef?: string;
}>;

export type StationQuery = Readonly<{
  requestRef: string;
  session: StationSessionRef;
  context: StationContext;
  resourceRef: string;
  projectionRef: string;
  parameters: Readonly<Record<string, unknown>>;
}>;

export type StationProjection = Readonly<{
  requestRef: string;
  context: StationContext;
  projectionRef: string;
  projectionRevisionRef: string;
  sourceRef: string;
  sourceRevisionRef: string;
  sourceAuthorityRef: string;
  currentness: StationProjectionCurrentness;
  completeness: StationProjectionCompleteness;
  payload: Readonly<Record<string, unknown>>;
}>;

export type StationCommand = Readonly<{
  commandRef: string;
  session: StationSessionRef;
  context: StationContext;
  actorRef: string;
  actorRevisionRef: string;
  actionRef: string;
  targetRef: string;
  expectedRevisionRef: string | null;
  payload: Readonly<Record<string, unknown>>;
}>;

export type StationCommandReceipt = Readonly<{
  commandRef: string;
  status: StationCommandStatus;
  resultingRevisionRef: string | null;
  evidenceRefs: readonly string[];
  diagnostic: StationDiagnostic | null;
}>;

export type StationSubscription = Readonly<{
  subscriptionRef: string;
  session: StationSessionRef;
  context: StationContext;
  resourceRef: string;
  afterSequence: number | null;
}>;

export type StationEvent = Readonly<{
  subscriptionRef: string;
  eventRef: string;
  sequence: number;
  kind: string;
  subjectRef: string;
  subjectRevisionRef: string;
  occurredAt: string;
  payload: Readonly<Record<string, unknown>>;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function exact(record: UnknownRecord, required: readonly string[], optional: readonly string[], label: string): void {
  const permitted = new Set([...required, ...optional]);
  for (const key of Object.keys(record)) {
    if (!permitted.has(key)) throw new Error(`${label} has unexpected field ${key}`);
  }
  for (const key of required) {
    if (!(key in record)) throw new Error(`${label} is missing field ${key}`);
  }
}

function token(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be a non-empty string`);
  return value.trim();
}

function nullableToken(value: unknown, label: string): string | null {
  if (value === null) return null;
  return token(value, label);
}

function stringList(value: unknown, label: string, allowEmpty = false): readonly string[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  const normalized = [...new Set(value.map((item) => token(item, label)))].sort((left, right) => left.localeCompare(right));
  if (!allowEmpty && normalized.length === 0) throw new Error(`${label} must not be empty`);
  return Object.freeze(normalized);
}

function readonlyPayload(value: unknown, label: string): Readonly<Record<string, unknown>> {
  const record = asRecord(value, label);
  return Object.freeze({ ...record });
}

function nonNegativeInteger(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw new Error(`${label} must be a non-negative safe integer`);
  return value as number;
}

function diagnostic(code: StationDiagnosticCode, detail: string, retryable: boolean, reconcileRequired: boolean): StationDiagnostic {
  return Object.freeze({ code, detail, retryable, reconcileRequired });
}

export function normalizeStationDiagnostic(input: unknown): StationDiagnostic {
  const record = asRecord(input, "station diagnostic");
  exact(record, ["code", "detail", "retryable", "reconcileRequired"], [], "station diagnostic");
  const codes: readonly StationDiagnosticCode[] = [
    "STATION_PROTOCOL_UNSUPPORTED",
    "STATION_PROTOCOL_INVALID",
    "STATION_CONTEXT_INVALID",
    "STATION_QUERY_INVALID",
    "STATION_COMMAND_INVALID",
    "STATION_EVENT_INVALID",
    "STATION_CORE_REJECTED",
    "STATION_CORE_UNAVAILABLE",
  ];
  if (!codes.includes(record.code as StationDiagnosticCode)) throw new Error("invalid station diagnostic code");
  if (typeof record.retryable !== "boolean" || typeof record.reconcileRequired !== "boolean") {
    throw new Error("station diagnostic retry flags must be boolean");
  }
  return diagnostic(record.code as StationDiagnosticCode, token(record.detail, "diagnostic detail"), record.retryable, record.reconcileRequired);
}

export function normalizeStationHello(input: unknown): StationHello {
  const record = asRecord(input, "station hello");
  exact(record, ["stationRef", "stationVersion", "supportedProtocolVersions"], [], "station hello");
  return Object.freeze({
    stationRef: token(record.stationRef, "station ref"),
    stationVersion: token(record.stationVersion, "station version"),
    supportedProtocolVersions: stringList(record.supportedProtocolVersions, "supported protocol versions"),
  });
}

export function negotiateStationProtocol(input: Readonly<{
  hello: unknown;
  coreRef: string;
  coreVersion: string;
  capabilityRefs?: readonly string[];
}>): StationHandshakeResult {
  let hello: StationHello;
  try {
    hello = normalizeStationHello(input.hello);
  } catch (error) {
    return Object.freeze({
      ok: false,
      diagnostic: diagnostic(
        "STATION_PROTOCOL_INVALID",
        error instanceof Error ? error.message : "invalid station hello",
        false,
        false,
      ),
    });
  }
  if (!hello.supportedProtocolVersions.includes(STATION_CORE_PROTOCOL_VERSION)) {
    return Object.freeze({
      ok: false,
      diagnostic: diagnostic(
        "STATION_PROTOCOL_UNSUPPORTED",
        `no compatible Station protocol; Core requires ${STATION_CORE_PROTOCOL_VERSION}`,
        false,
        true,
      ),
    });
  }
  return Object.freeze({
    ok: true,
    hello: Object.freeze({
      coreRef: token(input.coreRef, "core ref"),
      coreVersion: token(input.coreVersion, "core version"),
      protocolVersion: STATION_CORE_PROTOCOL_VERSION,
      capabilityRefs: stringList(input.capabilityRefs ?? [], "capability refs", true),
    }),
  });
}

export function normalizeStationSessionRef(input: unknown): StationSessionRef {
  const record = asRecord(input, "station session");
  exact(record, ["sessionRef", "stationRef", "coreRef"], [], "station session");
  return Object.freeze({
    sessionRef: token(record.sessionRef, "session ref"),
    stationRef: token(record.stationRef, "station ref"),
    coreRef: token(record.coreRef, "core ref"),
  });
}

export function normalizeStationContext(input: unknown): StationContext {
  const record = asRecord(input, "station context");
  exact(record, ["coreRef"], ["organizationRef", "systemRef", "environmentRef", "workspaceRef"], "station context");
  const organizationRef = record.organizationRef === undefined ? undefined : token(record.organizationRef, "organization ref");
  const systemRef = record.systemRef === undefined ? undefined : token(record.systemRef, "system ref");
  const environmentRef = record.environmentRef === undefined ? undefined : token(record.environmentRef, "environment ref");
  const workspaceRef = record.workspaceRef === undefined ? undefined : token(record.workspaceRef, "workspace ref");
  return Object.freeze({
    coreRef: token(record.coreRef, "core ref"),
    ...(organizationRef === undefined ? {} : { organizationRef }),
    ...(systemRef === undefined ? {} : { systemRef }),
    ...(environmentRef === undefined ? {} : { environmentRef }),
    ...(workspaceRef === undefined ? {} : { workspaceRef }),
  });
}

function sessionMatchesContext(session: StationSessionRef, context: StationContext): void {
  if (session.coreRef !== context.coreRef) throw new Error("station session core must match context core");
}

export function normalizeStationQuery(input: unknown): StationQuery {
  const record = asRecord(input, "station query");
  exact(record, ["requestRef", "session", "context", "resourceRef", "projectionRef", "parameters"], [], "station query");
  const session = normalizeStationSessionRef(record.session);
  const context = normalizeStationContext(record.context);
  sessionMatchesContext(session, context);
  return Object.freeze({
    requestRef: token(record.requestRef, "query request ref"),
    session,
    context,
    resourceRef: token(record.resourceRef, "query resource ref"),
    projectionRef: token(record.projectionRef, "query projection ref"),
    parameters: readonlyPayload(record.parameters, "query parameters"),
  });
}

function projectionCurrentness(value: unknown): StationProjectionCurrentness {
  if (value !== "CURRENT" && value !== "STALE" && value !== "UNKNOWN") throw new Error("invalid projection currentness");
  return value;
}

function projectionCompleteness(value: unknown): StationProjectionCompleteness {
  if (value !== "KNOWN" && value !== "PARTIAL" && value !== "UNKNOWN" && value !== "INCONCLUSIVE") {
    throw new Error("invalid projection completeness");
  }
  return value;
}

export function normalizeStationProjection(input: unknown, expectedQuery?: StationQuery): StationProjection {
  const record = asRecord(input, "station projection");
  exact(
    record,
    ["requestRef", "context", "projectionRef", "projectionRevisionRef", "sourceRef", "sourceRevisionRef", "sourceAuthorityRef", "currentness", "completeness", "payload"],
    [],
    "station projection",
  );
  const context = normalizeStationContext(record.context);
  const projectionRef = token(record.projectionRef, "projection ref");
  const sourceRef = token(record.sourceRef, "projection source ref");
  if (projectionRef === sourceRef) throw new Error("station projection identity must remain distinct from canonical source identity");
  const normalized = Object.freeze({
    requestRef: token(record.requestRef, "projection request ref"),
    context,
    projectionRef,
    projectionRevisionRef: token(record.projectionRevisionRef, "projection revision ref"),
    sourceRef,
    sourceRevisionRef: token(record.sourceRevisionRef, "source revision ref"),
    sourceAuthorityRef: token(record.sourceAuthorityRef, "source authority ref"),
    currentness: projectionCurrentness(record.currentness),
    completeness: projectionCompleteness(record.completeness),
    payload: readonlyPayload(record.payload, "projection payload"),
  });
  if (expectedQuery !== undefined) {
    if (normalized.requestRef !== expectedQuery.requestRef) throw new Error("projection request ref does not match query");
    if (normalized.projectionRef !== expectedQuery.projectionRef) throw new Error("projection ref does not match query");
    if (JSON.stringify(normalized.context) !== JSON.stringify(expectedQuery.context)) throw new Error("projection context does not match query context");
  }
  return normalized;
}

export function stationProjectionEstablishesCanonicalTruth(projection: StationProjection): false {
  void projection;
  return false;
}

export function normalizeStationCommand(input: unknown): StationCommand {
  const record = asRecord(input, "station command");
  exact(
    record,
    ["commandRef", "session", "context", "actorRef", "actorRevisionRef", "actionRef", "targetRef", "expectedRevisionRef", "payload"],
    [],
    "station command",
  );
  const session = normalizeStationSessionRef(record.session);
  const context = normalizeStationContext(record.context);
  sessionMatchesContext(session, context);
  return Object.freeze({
    commandRef: token(record.commandRef, "command ref"),
    session,
    context,
    actorRef: token(record.actorRef, "command actor ref"),
    actorRevisionRef: token(record.actorRevisionRef, "command actor revision ref"),
    actionRef: token(record.actionRef, "command action ref"),
    targetRef: token(record.targetRef, "command target ref"),
    expectedRevisionRef: nullableToken(record.expectedRevisionRef, "expected revision ref"),
    payload: readonlyPayload(record.payload, "command payload"),
  });
}

export function normalizeStationCommandReceipt(input: unknown, expectedCommandRef?: string): StationCommandReceipt {
  const record = asRecord(input, "station command receipt");
  exact(record, ["commandRef", "status", "resultingRevisionRef", "evidenceRefs", "diagnostic"], [], "station command receipt");
  if (record.status !== "ACCEPTED" && record.status !== "REJECTED" && record.status !== "UNKNOWN") {
    throw new Error("invalid station command status");
  }
  const commandRef = token(record.commandRef, "receipt command ref");
  if (expectedCommandRef !== undefined && commandRef !== token(expectedCommandRef, "expected command ref")) {
    throw new Error("receipt command ref does not match expected command");
  }
  const resultingRevisionRef = nullableToken(record.resultingRevisionRef, "resulting revision ref");
  const receiptDiagnostic = record.diagnostic === null ? null : normalizeStationDiagnostic(record.diagnostic);
  if (record.status === "ACCEPTED" && receiptDiagnostic !== null) throw new Error("accepted command cannot carry a rejection diagnostic");
  if (record.status === "REJECTED" && receiptDiagnostic === null) throw new Error("rejected command requires a diagnostic");
  if (record.status !== "ACCEPTED" && resultingRevisionRef !== null) throw new Error("non-accepted command cannot claim a resulting revision");
  return Object.freeze({
    commandRef,
    status: record.status,
    resultingRevisionRef,
    evidenceRefs: stringList(record.evidenceRefs, "receipt evidence refs", true),
    diagnostic: receiptDiagnostic,
  });
}

export function normalizeStationSubscription(input: unknown): StationSubscription {
  const record = asRecord(input, "station subscription");
  exact(record, ["subscriptionRef", "session", "context", "resourceRef", "afterSequence"], [], "station subscription");
  const session = normalizeStationSessionRef(record.session);
  const context = normalizeStationContext(record.context);
  sessionMatchesContext(session, context);
  return Object.freeze({
    subscriptionRef: token(record.subscriptionRef, "subscription ref"),
    session,
    context,
    resourceRef: token(record.resourceRef, "subscription resource ref"),
    afterSequence: record.afterSequence === null ? null : nonNegativeInteger(record.afterSequence, "subscription after sequence"),
  });
}

export function normalizeStationEvent(input: unknown, expectedSubscriptionRef?: string): StationEvent {
  const record = asRecord(input, "station event");
  exact(
    record,
    ["subscriptionRef", "eventRef", "sequence", "kind", "subjectRef", "subjectRevisionRef", "occurredAt", "payload"],
    [],
    "station event",
  );
  const subscriptionRef = token(record.subscriptionRef, "event subscription ref");
  if (expectedSubscriptionRef !== undefined && subscriptionRef !== token(expectedSubscriptionRef, "expected subscription ref")) {
    throw new Error("event subscription ref does not match expected subscription");
  }
  const occurredAt = token(record.occurredAt, "event occurred at");
  if (!Number.isFinite(Date.parse(occurredAt))) throw new Error("event occurredAt must be an ISO-compatible timestamp");
  return Object.freeze({
    subscriptionRef,
    eventRef: token(record.eventRef, "event ref"),
    sequence: nonNegativeInteger(record.sequence, "event sequence"),
    kind: token(record.kind, "event kind"),
    subjectRef: token(record.subjectRef, "event subject ref"),
    subjectRevisionRef: token(record.subjectRevisionRef, "event subject revision ref"),
    occurredAt,
    payload: readonlyPayload(record.payload, "event payload"),
  });
}

export function assertMonotonicStationEvents(
  events: readonly StationEvent[],
  subscriptionRef: string,
  afterSequence: number | null = null,
): readonly StationEvent[] {
  const expectedSubscriptionRef = token(subscriptionRef, "subscription ref");
  let previous = afterSequence === null ? -1 : nonNegativeInteger(afterSequence, "after sequence");
  const normalized = events.map((event) => normalizeStationEvent(event, expectedSubscriptionRef));
  for (const event of normalized) {
    if (event.sequence <= previous) throw new Error("station event sequence must increase monotonically without replay duplicates");
    previous = event.sequence;
  }
  return Object.freeze(normalized);
}

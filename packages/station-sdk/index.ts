import {
  STATION_CORE_PROTOCOL_VERSION,
  normalizeStationCommand,
  normalizeStationCommandReceipt,
  normalizeStationDiagnostic,
  normalizeStationProjection,
  normalizeStationQuery,
  normalizeStationSubscription,
  assertMonotonicStationEvents,
  type StationCommand,
  type StationCommandReceipt,
  type StationDiagnostic,
  type StationEvent,
  type StationHandshakeResult,
  type StationHello,
  type StationProjection,
  type StationQuery,
  type StationSubscription,
} from "@system-builder/contracts/station-core";

export type StationTransportResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; diagnostic: StationDiagnostic }>;

export interface StationTransport {
  handshake(hello: StationHello): StationHandshakeResult | Promise<StationHandshakeResult>;
  query(query: StationQuery): StationTransportResult<StationProjection> | Promise<StationTransportResult<StationProjection>>;
  command(command: StationCommand): StationTransportResult<StationCommandReceipt> | Promise<StationTransportResult<StationCommandReceipt>>;
  subscribe(subscription: StationSubscription): StationTransportResult<readonly StationEvent[]> | Promise<StationTransportResult<readonly StationEvent[]>>;
}

export type StationClientOptions = Readonly<{
  stationRef: string;
  stationVersion: string;
  supportedProtocolVersions?: readonly string[];
}>;

function token(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`${label} must be a non-empty string`);
  return normalized;
}

function protocolVersions(values: readonly string[] | undefined): readonly string[] {
  const normalized = [...new Set(values ?? [STATION_CORE_PROTOCOL_VERSION])]
    .map((value) => token(value, "protocol version"))
    .sort((left, right) => left.localeCompare(right));
  if (normalized.length === 0) throw new Error("at least one Station protocol version is required");
  return Object.freeze(normalized);
}

function failure<T>(diagnostic: StationDiagnostic): StationTransportResult<T> {
  return Object.freeze({ ok: false, diagnostic: normalizeStationDiagnostic(diagnostic) });
}

function success<T>(value: T): StationTransportResult<T> {
  return Object.freeze({ ok: true, value });
}

export class StationClient {
  readonly #transport: StationTransport;
  readonly #hello: StationHello;

  constructor(options: StationClientOptions, transport: StationTransport) {
    this.#transport = transport;
    this.#hello = Object.freeze({
      stationRef: token(options.stationRef, "station ref"),
      stationVersion: token(options.stationVersion, "station version"),
      supportedProtocolVersions: protocolVersions(options.supportedProtocolVersions),
    });
  }

  get hello(): StationHello {
    return this.#hello;
  }

  async handshake(): Promise<StationHandshakeResult> {
    const result = await this.#transport.handshake(this.#hello);
    if (result.ok) return result;
    return Object.freeze({ ok: false, diagnostic: normalizeStationDiagnostic(result.diagnostic) });
  }

  async query(input: StationQuery): Promise<StationTransportResult<StationProjection>> {
    const query = normalizeStationQuery(input);
    const result = await this.#transport.query(query);
    if (!result.ok) return failure(result.diagnostic);
    return success(normalizeStationProjection(result.value, query));
  }

  async command(input: StationCommand): Promise<StationTransportResult<StationCommandReceipt>> {
    const command = normalizeStationCommand(input);
    const result = await this.#transport.command(command);
    if (!result.ok) return failure(result.diagnostic);
    return success(normalizeStationCommandReceipt(result.value, command.commandRef));
  }

  async subscribe(input: StationSubscription): Promise<StationTransportResult<readonly StationEvent[]>> {
    const subscription = normalizeStationSubscription(input);
    const result = await this.#transport.subscribe(subscription);
    if (!result.ok) return failure(result.diagnostic);
    return success(assertMonotonicStationEvents(result.value, subscription.subscriptionRef, subscription.afterSequence));
  }
}

import {
  assertMonotonicStationEvents,
  negotiateStationProtocol,
  normalizeStationCommand,
  normalizeStationCommandReceipt,
  normalizeStationDiagnostic,
  normalizeStationProjection,
  normalizeStationQuery,
  normalizeStationSubscription,
  type StationCommand,
  type StationCommandReceipt,
  type StationDiagnostic,
  type StationEvent,
  type StationHandshakeResult,
  type StationProjection,
  type StationQuery,
  type StationSubscription,
} from "@system-builder/contracts/station-core";

export interface StationCorePort {
  query(query: StationQuery): StationProjection | Promise<StationProjection>;
  command(command: StationCommand): StationCommandReceipt | Promise<StationCommandReceipt>;
  events(subscription: StationSubscription): readonly StationEvent[] | Promise<readonly StationEvent[]>;
}

export type StationGatewayResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; diagnostic: StationDiagnostic }>;

export type StationGatewayOptions = Readonly<{
  coreRef: string;
  coreVersion: string;
  capabilityRefs?: readonly string[];
}>;

function token(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`${label} must be a non-empty string`);
  return normalized;
}

function diagnostic(
  code: StationDiagnostic["code"],
  detail: string,
  retryable: boolean,
  reconcileRequired: boolean,
): StationDiagnostic {
  return normalizeStationDiagnostic({ code, detail, retryable, reconcileRequired });
}

function failure<T>(value: StationDiagnostic): StationGatewayResult<T> {
  return Object.freeze({ ok: false, diagnostic: value });
}

function success<T>(value: T): StationGatewayResult<T> {
  return Object.freeze({ ok: true, value });
}

export class StationGateway {
  readonly #coreRef: string;
  readonly #coreVersion: string;
  readonly #capabilityRefs: readonly string[];
  readonly #port: StationCorePort;

  constructor(options: StationGatewayOptions, port: StationCorePort) {
    this.#coreRef = token(options.coreRef, "core ref");
    this.#coreVersion = token(options.coreVersion, "core version");
    this.#capabilityRefs = Object.freeze(
      [...new Set(options.capabilityRefs ?? [])]
        .map((value) => token(value, "capability ref"))
        .sort((left, right) => left.localeCompare(right)),
    );
    this.#port = port;
  }

  handshake(hello: unknown): StationHandshakeResult {
    return negotiateStationProtocol({
      hello,
      coreRef: this.#coreRef,
      coreVersion: this.#coreVersion,
      capabilityRefs: this.#capabilityRefs,
    });
  }

  async query(input: unknown): Promise<StationGatewayResult<StationProjection>> {
    let query: StationQuery;
    try {
      query = normalizeStationQuery(input);
    } catch (error) {
      return failure(diagnostic(
        "STATION_QUERY_INVALID",
        error instanceof Error ? error.message : "invalid Station query",
        false,
        false,
      ));
    }
    const contextFailure = this.#contextFailure(query.context.coreRef);
    if (contextFailure !== null) return failure(contextFailure);

    let projection: StationProjection;
    try {
      projection = await this.#port.query(query);
    } catch (error) {
      return failure(diagnostic(
        "STATION_CORE_UNAVAILABLE",
        error instanceof Error ? error.message : "Core query failed",
        true,
        false,
      ));
    }
    try {
      return success(normalizeStationProjection(projection, query));
    } catch (error) {
      return failure(diagnostic(
        "STATION_CORE_REJECTED",
        error instanceof Error ? error.message : "Core returned an invalid projection",
        false,
        true,
      ));
    }
  }

  async command(input: unknown): Promise<StationGatewayResult<StationCommandReceipt>> {
    let command: StationCommand;
    try {
      command = normalizeStationCommand(input);
    } catch (error) {
      return failure(diagnostic(
        "STATION_COMMAND_INVALID",
        error instanceof Error ? error.message : "invalid Station command",
        false,
        false,
      ));
    }
    const contextFailure = this.#contextFailure(command.context.coreRef);
    if (contextFailure !== null) return failure(contextFailure);

    let receipt: StationCommandReceipt;
    try {
      receipt = await this.#port.command(command);
    } catch (error) {
      return failure(diagnostic(
        "STATION_CORE_UNAVAILABLE",
        error instanceof Error ? error.message : "Core command failed",
        true,
        false,
      ));
    }
    try {
      return success(normalizeStationCommandReceipt(receipt, command.commandRef));
    } catch (error) {
      return failure(diagnostic(
        "STATION_CORE_REJECTED",
        error instanceof Error ? error.message : "Core returned an invalid command receipt",
        false,
        true,
      ));
    }
  }

  async subscribe(input: unknown): Promise<StationGatewayResult<readonly StationEvent[]>> {
    let subscription: StationSubscription;
    try {
      subscription = normalizeStationSubscription(input);
    } catch (error) {
      return failure(diagnostic(
        "STATION_EVENT_INVALID",
        error instanceof Error ? error.message : "invalid Station subscription",
        false,
        false,
      ));
    }
    const contextFailure = this.#contextFailure(subscription.context.coreRef);
    if (contextFailure !== null) return failure(contextFailure);

    let events: readonly StationEvent[];
    try {
      events = await this.#port.events(subscription);
    } catch (error) {
      return failure(diagnostic(
        "STATION_CORE_UNAVAILABLE",
        error instanceof Error ? error.message : "Core event read failed",
        true,
        false,
      ));
    }
    try {
      return success(assertMonotonicStationEvents(events, subscription.subscriptionRef, subscription.afterSequence));
    } catch (error) {
      return failure(diagnostic(
        "STATION_CORE_REJECTED",
        error instanceof Error ? error.message : "Core returned invalid event replay",
        false,
        true,
      ));
    }
  }

  #contextFailure(coreRef: string): StationDiagnostic | null {
    if (coreRef === this.#coreRef) return null;
    return diagnostic(
      "STATION_CONTEXT_INVALID",
      `Station context targets ${coreRef}; Gateway serves ${this.#coreRef}`,
      false,
      true,
    );
  }
}

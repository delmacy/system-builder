import { StationClient } from "@system-builder/station-sdk";

type StationQueryInput = Parameters<StationClient["query"]>[0];
type StationCommandInput = Parameters<StationClient["command"]>[0];
type StationSubscriptionInput = Parameters<StationClient["subscribe"]>[0];
type StationSessionRef = StationQueryInput["session"];
type StationContext = StationQueryInput["context"];
type StationHandshakeResult = Awaited<ReturnType<StationClient["handshake"]>>;
type StationQueryResult = Awaited<ReturnType<StationClient["query"]>>;
type StationCommandResult = Awaited<ReturnType<StationClient["command"]>>;
type StationSubscriptionResult = Awaited<ReturnType<StationClient["subscribe"]>>;

export type StationApplicationState = Readonly<{
  connected: boolean;
  coreRef: string | null;
  sessionRef: string | null;
  context: StationContext | null;
}>;

export class StationApplication {
  readonly #client: StationClient;
  #session: StationSessionRef | null = null;
  #context: StationContext | null = null;
  #coreRef: string | null = null;

  constructor(client: StationClient) {
    this.#client = client;
  }

  get state(): StationApplicationState {
    return Object.freeze({
      connected: this.#session !== null && this.#coreRef !== null,
      coreRef: this.#coreRef,
      sessionRef: this.#session?.sessionRef ?? null,
      context: this.#context === null ? null : Object.freeze({ ...this.#context }),
    });
  }

  async connect(session: StationSessionRef): Promise<StationHandshakeResult> {
    const result = await this.#client.handshake();
    if (!result.ok) {
      this.disconnect();
      return result;
    }
    if (session.stationRef !== this.#client.hello.stationRef) {
      this.disconnect();
      throw new Error("Station session does not belong to this Station client");
    }
    if (session.coreRef !== result.hello.coreRef) {
      this.disconnect();
      throw new Error("Station session Core does not match negotiated Core");
    }
    this.#session = Object.freeze({ ...session });
    this.#coreRef = result.hello.coreRef;
    this.#context = Object.freeze({ coreRef: result.hello.coreRef });
    return result;
  }

  setContext(context: StationContext): StationApplicationState {
    const session = this.#requireSession();
    if (context.coreRef !== session.coreRef || context.coreRef !== this.#coreRef) {
      throw new Error("Station context must remain on the connected Core");
    }
    this.#context = Object.freeze({ ...context });
    return this.state;
  }

  async query(input: Omit<StationQueryInput, "session" | "context">): Promise<StationQueryResult> {
    const { session, context } = this.#requireScope();
    return this.#client.query({ ...input, session, context });
  }

  async command(input: Omit<StationCommandInput, "session" | "context">): Promise<StationCommandResult> {
    const { session, context } = this.#requireScope();
    return this.#client.command({ ...input, session, context });
  }

  async replay(input: Omit<StationSubscriptionInput, "session" | "context">): Promise<StationSubscriptionResult> {
    const { session, context } = this.#requireScope();
    return this.#client.subscribe({ ...input, session, context });
  }

  disconnect(): void {
    this.#session = null;
    this.#context = null;
    this.#coreRef = null;
  }

  #requireSession(): StationSessionRef {
    if (this.#session === null || this.#coreRef === null) throw new Error("Station is not connected");
    return this.#session;
  }

  #requireScope(): Readonly<{ session: StationSessionRef; context: StationContext }> {
    const session = this.#requireSession();
    if (this.#context === null) throw new Error("Station context is not established");
    return Object.freeze({ session, context: this.#context });
  }
}

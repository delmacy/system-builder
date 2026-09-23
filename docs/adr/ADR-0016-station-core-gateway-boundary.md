# ADR-0016 — Station, Station Gateway and Core boundary

Status: Accepted

Date: 2026-09-23

## Context

The repository already contains the System Builder's canonical domain contracts and execution logic across `packages/**`, but it does not yet expose a dedicated operator application boundary. The next product phase requires an installable Station that can present and control one or more System Builder Cores without becoming a second owner of canonical state or business logic.

The Station must remain replaceable and disposable. A lost or closed Station must not stop Core work or published client runtimes. Local and remote operation must use the same semantic protocol. The Station may render, cache and compose user experience state, but it must not independently authorize, persist canonical domain truth, execute provider effects or bypass domain eligibility.

A general external API and a persistent operator Station have different interaction requirements. External APIs commonly use bounded request/response operations, while a Station needs protocol negotiation, session/context establishment, projections, commands, receipts, event subscriptions, reconnect/resume and compatibility handling.

This decision is L4 because it introduces a new suite/application boundary and a formal interaction path between the operator experience and the existing Builder capabilities.

## Decision

### 1. Three explicit responsibilities

- **Core** owns canonical System Builder state, authority, orchestration and execution. Existing domain packages remain the semantic owners until separately refactored.
- **Station Gateway** is the exclusive protocol boundary for Stations. It may authenticate/establish Station sessions, negotiate protocol versions, resolve context, route queries and commands, compose projections, manage subscriptions and translate transport concerns. It owns no business truth and grants no authority by itself.
- **Station** is a thin interaction client. It renders Shell/Desktops/Apps/Tools, captures user intent, sends queries/commands and consumes projections/events. It owns only disposable/local presentation state.

Invariant:

```text
Station -> Station Gateway -> Core/domain owners
```

The Station must never import Core/domain implementation internals as an execution shortcut.

### 2. Dedicated Station protocol, shared ingress allowed

The Station protocol is distinct from public service APIs and agent protocols. Infrastructure such as TLS termination, rate limiting, logging, tracing and routing may be shared by a common ingress, but Station session/query/command/event semantics remain isolated behind the Station Gateway.

### 3. Transport-agnostic contract

The public Station/Core contract must not bind the architecture to REST, WebSocket, SSE, IPC or another transport. A local Complete installation and a remote Station use the same semantic protocol even if transport implementations differ.

The initial contract family is expected to cover:

- protocol handshake and compatibility;
- Station/Core identity references;
- Station session and context;
- query/projection envelopes;
- command/receipt envelopes;
- event/subscription envelopes;
- deterministic diagnostics.

### 4. Same monorepo, separate application boundaries

The initial implementation remains in `delmacy/system-builder`.

- executable application boundaries: `apps/station/**` and `apps/station-gateway/**`;
- shared protocol: `packages/contracts/station-core/**`;
- reusable client binding: `packages/station-sdk/**`.

Physical extraction to separate repositories/processes is deferred until release cadence, security, organizational or distribution pressure justifies it.

### 5. No new canonical owner in the Gateway

The Gateway can aggregate projections from multiple semantic owners, but an aggregate never becomes canonical truth by presentation. Existing Generated Experience rules continue to apply: projection != source truth; visibility != authority != domain eligibility.

### 6. Runtime autonomy is unchanged

Station failure or Station Gateway failure must not become a dependency of published client runtimes. Builder/Core unavailability still must not stop already-published autonomous runtimes.

## Consequences

- Station work can begin without embedding Core internals in the UI.
- Core and Station can evolve against a versioned protocol.
- Local and remote installations share one architecture.
- Multiple Stations can connect to one Core, and later one Station may connect to/federate across multiple Cores without changing domain ownership.
- The Gateway may initially run in the same process/container as other Core-facing infrastructure while preserving a separable code boundary.
- A future API Gateway or Agent Gateway may share ingress infrastructure but does not replace the Station Gateway.

## Non-goals

This ADR does not choose daedalOS/Tauri/Electron, define final desktop UX, create provider-specific APIs, introduce Core federation, choose a network transport, split repositories, or move existing semantic ownership.

## Required first proof

The first construction increment must prove, without UI-heavy work:

```text
Station client
  -> handshake
  -> establish context
  -> query projection
  -> submit one command
  -> receive command receipt
  -> receive/replay one event
  -> disconnect/reconnect without becoming canonical authority
```

The proof may use an in-memory Core port. It must demonstrate that the Station and Gateway remain consumers/coordinators of public contracts rather than owners of domain truth.

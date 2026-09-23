# STATION-WP-01 — Station/Core protocol and application-boundary foundation

Date: 2026-09-23
Planning base: `main@ebb35401990d4fcebabf1008ebf5db878a26dbba`
Architecture authority: ADR-0016
Status: PLANNING & MATERIALIZATION / CONSTRUCTION A COMMITTED

## Goal

Create the smallest stable boundary that allows an installable Station to communicate with System Builder Core capabilities exclusively through a Station Gateway, without moving canonical domain ownership into the Station or Gateway.

## Predecessor/readiness gates

- G2-WP-13 closure PR #898 is integrated and its closure conditions are satisfied.
- ADR-0016 accepts the Station/Core/Gateway topology.
- Existing `identity-authorization`, `generated-experience`, semantic-substrate and domain contracts remain authoritative inputs.
- No existing package is reclassified as the Station itself.

## Construction A — protocol + thin boundaries — COMMITTED

Materialized as `STATION-CONSTRUCTION-A-01`, TASK-583..587.

Goal: define the transport-agnostic protocol, create Station Gateway and Station SDK/application scaffolds, and prove one end-to-end in-memory vertical slice.

Exit proof:

```text
Station -> SDK -> Station Gateway -> injected Core port
  handshake
  context
  query/projection
  command/receipt
  event/replay
```

with deterministic compatibility/diagnostic behavior and no Core-internal import shortcut.

## Construction B — real Core adapter + session/event transport — FORECAST

After Construction A integration and fresh-main revalidation, connect the Gateway to selected existing Core/domain public contracts and add one real transport/session implementation. Keep business authorization and domain eligibility in their owners.

## Construction C — optional desktop runtime foundation — FORECAST CANDIDATE

Promote only if fresh evidence shows it is required to close the package goal. Candidate scope includes process/window lifecycle and tool-host primitives, not a full daedalOS fork or broad UI catalog.

## Package Integration & Review

Regress protocol compatibility, dependency direction, authority boundaries, reconnect/replay semantics, local-vs-remote equivalence and runtime-autonomy invariants. Missing product capability must return to construction rather than being hidden in review.

## Documentation & Closure

Reconcile repository memory, contracts, ADR links and successor readiness. No new product behavior.

## Non-goals

No daedalOS/Tauri selection, no final installer, no provider-specific UI, no Core federation, no API Gateway unification, no database migration, no runtime dependency on Station/Gateway, no repository split.

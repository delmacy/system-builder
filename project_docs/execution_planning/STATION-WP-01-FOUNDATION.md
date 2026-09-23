# STATION-WP-01 — Station/Core protocol and application-boundary foundation

Date: 2026-09-23
Planning base: `main@ebb35401990d4fcebabf1008ebf5db878a26dbba`
Architecture authority: ADR-0016
Status: PAUSED AFTER CONSTRUCTION A / CONSTRUCTION B DEFERRED

## Goal

Create the smallest stable boundary that allows an installable Station to communicate with System Builder Core capabilities exclusively through a Station Gateway, without moving canonical domain ownership into the Station or Gateway.

## Integrated outcome

Construction A / TASK-583..587 integrated through PR #901 at `main@e0602eb51b1c8a4cee5bf4b89c0a1cfba26e9258`.

Proven path:

```text
Station -> SDK -> Station Gateway -> injected Core port
  handshake
  context
  query/projection
  command/receipt
  event/replay
  disconnect/reconnect
```

The in-memory proof preserves Core-side canonical ownership and Station non-authority.

## Construction B — real Core adapter + session/event transport — DEFERRED FORECAST

This forecast remains valid but is intentionally deferred by repository-owner sequencing dated 2026-09-23. Visual Station work is prioritized first.

No real transport, Core adapter or session persistence work is authorized by this package while deferred.

## Construction C — optional desktop runtime foundation — SUPERSEDED AS FORECAST LOCATION

Visual desktop/windowing work is now planned independently under `STATION-VISUAL-WP-01` and ADR-0017 rather than being hidden inside this package.

## Package state

This package is not canonically closed. It has no active Sprint. Its remaining connectivity work may resume only through fresh-main revalidation and explicit successor materialization after the visual priority allows it.

## Preserved boundaries

Station does not own canonical truth. Gateway does not own business semantics. Published client runtime autonomy remains independent from Station/Core availability.

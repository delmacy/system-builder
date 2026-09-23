# Next Work — STATION-WP-01 Construction A

Date: 2026-09-23

## Integrated predecessor

G2-WP-13 Documentation & Closure PR #898 integrated at `main@ebb35401990d4fcebabf1008ebf5db878a26dbba`. Its exact head passed Deterministic CI #2186, Heavy Product Tests #1877/#1879 and Merge Candidate CI #416. Generation 2 is canonically closed.

## Planning authority

ADR-0016 and `STATION-WP-01-FOUNDATION.md` define the new Core/Station/Station Gateway boundary. The post-WP13 Architecture Assurance program is separately materialized and does not authorize any conformance claim.

## Next committed Sprint

`STATION-CONSTRUCTION-A-01`

1. TASK-583 — Station/Core protocol contract.
2. TASK-584 — Station Gateway scaffold/Core port.
3. TASK-585 — Station SDK.
4. TASK-586 — thin Station app scaffold.
5. TASK-587 — full in-memory vertical-slice proof.

## Required exit

A Station can negotiate protocol compatibility, establish context, query a projection, submit a command, receive a receipt, receive/replay events after reconnect and remain non-authoritative.

## Boundary

No heavy desktop UI, daedalOS fork, real transport, provider-specific behavior, Core federation, repository split or client-runtime dependency on Station/Gateway.

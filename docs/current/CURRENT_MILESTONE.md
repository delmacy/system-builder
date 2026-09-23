# Current Execution Milestone — Station Foundation Planning & Materialization

Date: 2026-09-23

## Predecessor state

Generation 2 / G2-WP-01..G2-WP-13 is canonically closed. G2-WP-13 closure PR #898 is integrated at `ebb35401990d4fcebabf1008ebf5db878a26dbba`; closure head CI evidence satisfied the recorded gate.

## Architecture decision

ADR-0016 establishes:

```text
Station -> Station Gateway -> Core/domain owners
```

Station owns interaction/presentation only. Station Gateway owns Station protocol/session/routing/composition only. Canonical state, authorization, domain eligibility and effects remain Core/domain responsibilities.

## Current executable gate

After this Planning & Materialization Sprint integrates, execute `STATION-CONSTRUCTION-A-01` on fresh `main` in dependency order:

`TASK-583 -> TASK-584 + TASK-585 -> TASK-586 -> TASK-587`

The final proof is an in-memory end-to-end slice covering handshake, context, projection query, command receipt, event/replay and reconnect.

## Assurance lane

The mandatory post-WP13 Architecture Assurance program is generated and AA-WP-01 is materialized but not the active Sprint. No architecture-standard conformance claim is authorized.

## Boundary

Do not select/implement daedalOS, Tauri/Electron, final installer, real network transport, federation or provider-specific UI in Construction A. Do not import Core/domain internals into Station as a shortcut.

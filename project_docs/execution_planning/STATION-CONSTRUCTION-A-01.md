# STATION Construction A — protocol and thin application boundaries

Sprint ID: `STATION-CONSTRUCTION-A-01`
Status: COMMITTED
Base after planning integration: fresh `main`
Branch: `sprint/STATION-CONSTRUCTION-A-01`

## Sprint goal

Prove the Station architecture with a versioned transport-agnostic protocol and minimal Station/Gateway/SDK boundaries before any heavy desktop/UI implementation.

## Committed TASK chain

1. TASK-583 — Station/Core protocol contract.
2. TASK-584 — Station Gateway scaffold and Core-port boundary.
3. TASK-585 — Station SDK scaffold.
4. TASK-586 — Station application scaffold.
5. TASK-587 — cumulative vertical-slice proof.

## Growing proof

The Sprint must end with a deterministic in-memory proof that a Station can negotiate a supported protocol, establish context, query a projection, submit a command, receive a receipt, consume/replay an event and reconnect without owning canonical state.

## Final validation

`npm run verify`

## Stop/escalation conditions

Stop for explicit architecture/change control if implementation requires:
- moving canonical business authority/state into Station or Gateway;
- importing private Core/domain implementation into Station;
- selecting a mandatory network transport as an architecture invariant;
- changing Builder/Runtime autonomy;
- splitting repositories;
- introducing provider-specific semantics into the generic Station protocol.

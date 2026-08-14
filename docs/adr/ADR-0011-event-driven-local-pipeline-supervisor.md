# ADR-0011 — Event-driven local pipeline supervision

Status: Accepted

## Context

ADR-0008 deliberately made each local orchestrator invocation bounded and resumable from repository/GitHub evidence. TASK-028 composes those invocations into an authorized sequential pipeline, but no operational layer persists pipeline wakeups, delivers callbacks, recovers lost callbacks or classifies transient retries. Keeping a process alive to poll GitHub/OpenCode would waste desktop resources and make process memory an accidental authority.

The I2 candidate has not started. CHG-AF-2026-08-13-01 adds a bounded pre-run reliability slice of WP-AF-16 without authorizing I3, task parallelism, a database, a public webhook service or a new executor.

## Decision

Introduce a local `AgentFactorySupervisor` as an operational composition over `SequentialPipelineCoordinator` and `LocalTaskOrchestrator`.

- Event/callback is the primary continuation mechanism. Heartbeat is a finite watchdog/recovery invocation, never the primary scheduler and never a continuous polling loop.
- Every iteration starts with `observe -> reconcile -> determine next safe action` from durable facts. Callback payloads are untrusted wake hints containing only pipeline/event identity and reason.
- The authoritative local runtime history is an ignored, per-pipeline sequence of atomically published event records under `.agent/runtime/`. Each record contains the resulting pipeline projection and outbox intent, so state transition plus durable event is one logical append. Current state is replayable; process memory is disposable.
- Callback delivery happens only after its event file is durably published. Missing delivery/acknowledgement remains observable for heartbeat recovery.
- A short-lived expiring per-pipeline lease uses portable filesystem create/rename semantics instead of Unix-only `flock`. Callback/heartbeat races yield one owner; the loser reobserves and performs no external action. Expired leases are recoverable and permanent locks are forbidden.
- Retry classification is explicit. Transient executor/provider/network/rate-limit/5xx/callback failures may use bounded configurable exponential backoff. Deterministic validation, scope, architecture, contract, authority, evidence and DAG failures never retry automatically.
- A small per-provider circuit breaker uses `CLOSED`, `OPEN` and `HALF_OPEN` with configured threshold/cooldown. It prevents repeated dispatch against an unavailable provider but does not replace task governance.
- External idempotency remains owned by the existing branch/PR/evidence/ledger/orchestrator guards. The supervisor records operation identity and never treats a callback/event as proof that an external action succeeded.
- The first transport is a local replaceable callback boundary. A future GitHub webhook may implement the same wake contract, but no public listener is introduced now. GitHub state remains recoverable through bounded heartbeat observation.
- OpenCode's current adapter contract remains unchanged. A bounded wrapper may initially wait for its child process, persist completion/failure, emit an event and terminate; background execution requires a later independently governed contract only if demonstrated necessary.

## Event and persistence boundary

An `AgentFactoryEvent` binds schema version, event ID/type, pipeline/task, source, previous/current state, occurrence time, correlation/causation/attempt identity, payload reference and resulting operational projection. Event IDs are content-derived from canonical semantic fields. Large payloads are referenced.

Terminal/attention states (`BLOCKED`, `FAILED`, `NEEDS_DECISION`, `RETRY_EXHAUSTED`, `COMPLETE`) still emit durable events and request a callback. A duplicate callback replays the same durable state and produces `NO_OP`.

Runtime files are operational state, ignored by Git and never sufficient to claim verified, merged, approved or DONE. Repository evidence, Git/GitHub observations, validation receipts, signed approval and ledger remain authoritative for those claims.

## Consequences

- Desktop invocations release resources at external waits and resume after restart without chat/process memory.
- Lost callbacks increase latency only until heartbeat recovery; they do not lose state.
- Filesystem durability is intentionally local/single-machine and sequential. Multi-host consensus, task parallelism and high-availability storage remain out of scope.
- Supervisor configuration and event contracts become controlled versioned interfaces and require evaluator coverage.

## Rollback

Disable supervisor commands and continue invoking the existing task/sequential orchestration manually. Preserve runtime event files as diagnostic evidence; do not reinterpret them as repository completion authority.

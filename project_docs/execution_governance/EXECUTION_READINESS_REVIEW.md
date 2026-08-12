# Execution Readiness Review

This is the final governance gate before autonomous/near-autonomous construction is enabled.

## A. Scope and traceability
- [ ] Target increment/sprint Goal references approved scope.
- [ ] Near-horizon requirements have RTM links.
- [ ] Tasks are linked to WPs and acceptance evidence.
- [ ] No orphan executable work exists.

## B. Dependency/schedule readiness
- [ ] Task DAG is machine-readable and acyclic.
- [ ] Blocking gates are explicit and mechanically evaluable where practical.
- [ ] READY queue can be generated without architectural invention.
- [ ] Capacity/WIP constraints are configured.

## C. Task contract readiness
- [ ] DoR/DoD enforced.
- [ ] Task Pack schema contains allowed/forbidden paths.
- [ ] Authoritative context/contracts can be pinned.
- [ ] Stop/escalation conditions exist.

## D. Quality
- [ ] Deterministic CI validates executor output independently.
- [ ] Contract/schema/integration checks exist for applicable first-horizon work.
- [ ] Executor cannot silently weaken required evaluator controls.
- [ ] Evidence protocol is machine-readable.

## E. Risk/security/governance
- [ ] Risk classification drives routing/gates.
- [ ] Agent authority/RACI is enforced by pipeline permissions where possible.
- [ ] Change discoveries cannot become implicit scope.
- [ ] Secrets/permissions follow least privilege.
- [ ] Retry/time/cost bounds exist.
- [ ] Destructive/security/architecture gates fail closed.

## F. Operational loop
- [ ] OpenCode adapter is healthy for noninteractive execution.
- [ ] Branch/PR strategy is automated or explicitly bounded.
- [ ] Execution result updates task/evidence/gate state.
- [ ] DAG readiness is recomputed after accepted evidence.
- [ ] Failure produces BLOCKED/FAILED/NEEDS_DECISION without corrupting state.
- [ ] Integration/debt review trigger is configured.

## Decision
- **GO** — all mandatory first-horizon controls are implemented and tested.
- **CONDITIONAL GO** — only explicitly accepted non-critical gaps remain, with owners/follow-up.
- **NO-GO** — any mandatory traceability, quality, authority, security, DAG or evidence control is absent.

## Current planning status
The governance specifications in this package are defined. This document does **not** claim GO yet: enforcement must now be implemented/tested in AgentFactory/harness/CI before autonomous execution is released.

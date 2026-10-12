# SB04 Design candidate service WP1 — proposed prerequisite
Mainc2de4529c234d82897570dde5f7ebde524fc3b9e; WP16 Planning#1111 integrated, TASK718 remains blocked.
Goal exact candidate retention/owner revision/result lookup/restart proof, not business approval or publication.
Admission Addendum017/ADR0018 proposed. Only TASK719 documentation Planning is committed; code awaits
explicit owner acceptance and execution authorization. WP16 execution intent is recorded, readiness retained.

## Cadence and dependency graph
WP15 actual candidate API -> explicit owner acceptance -> service Construction A -> B -> Review -> Closure
-> WP16 readiness revalidation -> TASK718 A -> WP16 B/Review/Closure after independent gates.
| Sprint | Outcome | Exit |
|---|---|---|
| Planning TASK719 | Concrete ADR/public operation proposal, bounded scope/dependencies and prepared first A | Own CI; proposal remains unaccepted |
| A TASK720 prepared/draft | Public candidate contracts, domain validation, repository/auth ports and commands | Accepted ADR0018/Addendum017, fresh task/path revalidation, real predecessor tests |
| B forecast | PostgreSQL transaction+command ledger, authenticated Gateway HTTP ingress | Actual A/actual provider, concurrent/restart/denied/idempotency/lost-response proof |
| C conditional | Indispensable admitted owner-service gap only | Fresh B evidence; otherwise skip |
| Integration and Review forecast | Independent full owner chain, schema/trust/debt/compatibility audit | Full own gates and explicit O1–O4 disposition |
| Documentation and Closure forecast | Operations/contracts/risks/WBS/scheduler/releaseable local profile | Own CI/merge; no wider production security claim |

Five standard upstream sprints, separate from already-planned WP16. No calendar promise or future IDs.
DB provider chosen PostgreSQL using existing adapter, additive namespaced tables only; no provisioning/reset.
Initial auth local profile explicit+server-verified, never silently allow-all; production identity separate.
First A exact allowed paths must be revalidated against actual existing authority/contract interfaces
before promotion; shared validation extraction cannot be invented while the ADR is merely proposed.

## Growing proof, constraints and stop
Use actual WP15 module API to create/edit/materialize input, full schema/metadata preservation; don't
hand-author successful downstream records. Positive transaction/exact query plus process restart proves
durability; two-writer stale/denied/malformed/idempotency/lost-receipt cases prove failure atomicity.
All95 browser predecessors remain. Service does not claim business approval or upstream resolution.
Each construction npm run verify, station:build where frontend boundaries affected and actual heavy
HTTP/PostgreSQL tests/classification. Every triggered exact-head/current-base/heavy/handoff/browser gate PASS.
One branch/commit per TASK/PR per sprint; NEXT_WORK sole scheduler. No undeclared L3/L4/forbidden paths.
Do not implement until ADR acceptance; acceptance does not waive actual readiness/tests or authorize
broad owner changes. Missing functionality returns to construction, not hidden in Review/Closure.

## Accepted execution update — 2026-10-12 UTC
Owner explicitly accepts ADR0018/Addendum017 and authorizes complete Design prerequisite followed by WP16, including eligible Review/Closure. A promoted from validated #1112 base e23a4c9e1d6a899287b7b9ec6428954b70974e7f. Future sprints remain forecast until independent predecessor gates.

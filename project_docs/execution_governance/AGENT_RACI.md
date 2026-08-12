# Agent RACI / Authority Matrix

Roles are logical; one implementation/model may temporarily perform several roles, but incompatible approval authority must remain separated where required.

| Activity | Planner | Architect | Coding Executor | Reviewer | CI/Validator | Human |
|---|---|---|---|---|---|---|
| Read approved scope/DAG | R | C | C | C | I | I |
| Decompose approved WP | R | C | I | C | I | A for material ambiguity |
| Select READY work | R | I | I | I | C | I |
| Change architecture/ADR | C | R | N | C | I | A when gated |
| Implement bounded task | I | C | R | I | I | I |
| Modify acceptance/evaluator | C | C | N by default | R | C | A when material |
| Verify tests/contracts | I | C | I | R | R | I |
| Approve destructive migration | I | C | N | C | C | A |
| Approve security/trust change | I | R | N | C | C | A where policy requires |
| Approve scope change | C | C | N | I | I | A |
| Update execution evidence | C | I | R | C | R | I |
| Recompute DAG readiness | R | C | N | C | C | I |

Legend: R = Responsible, A = Accountable/approval authority, C = Consulted, I = Informed, N = Not authorized.

## Core constraints
- Coding agents cannot self-authorize scope expansion.
- Coding agents cannot silently weaken their evaluator.
- Planner cannot mark an unsatisfied mandatory gate READY.
- Architecture ambiguity is escalated rather than inferred by a cheap executor.
- Human approval is reserved for material irreversible/high-risk decisions, not routine mechanical work.

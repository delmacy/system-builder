# P13-RUNTIME-AUTHORITY-GENERATED-INTERACTION-01 — Construction B

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: P13-PACKAGE-02
Milestone: M13
Primary WBS: 13.2.2-13.2.3
Planning base: `039edb5ba9bab61dadbfe845e6cafb26dbb61933`
Execution branch: `sprint/P13-RUNTIME-AUTHORITY-GENERATED-INTERACTION-01`
Authority: `project_docs/execution_planning/P13-PACKAGE-02.construction-b-l3-change-control.md`

## Sprint goal
Materialize deterministic Runtime authorization and generated interaction on top of integrated identity/session actor context: explicit membership/role linkage, fail-closed permission/policy decisions, deterministic generated view/form bindings, and a representative allowed/denied action + generated interaction proof without Builder dependence.

## Committed tasks and dependency order
1. TASK-240 — bounded additive authorization/generated-interaction descriptors in SystemDefinition (L3)
2. TASK-241 — Compiler projection + reference validation
3. TASK-242 — RuntimeModel authorization/view materialization
4. TASK-243 — explicit actor membership/role resolution
5. TASK-244 — deterministic permission evaluator + auditable decision
6. TASK-245 — bounded structured policy evaluation where explicitly declared
7. TASK-246 — deterministic generated view/form binding materialization
8. TASK-247 — authority-gated representative action and generated interaction execution
9. TASK-248 — fail-closed/security regression + growing end-to-end proof

## Boundaries
- Authentication != authorization; successful auth grants nothing by itself.
- No role/membership/view binding inference by names, ordering, provider or defaults.
- Existing free-text policy statements remain descriptive and never execute.
- Only additive/backward-compatible SystemDefinition semantics authorized by the accepted bounded L3 envelope.
- Runtime normal operation must not consult Builder/Observe.
- No EnvironmentProfile schema change, new bounded context, ownership/topology change or other L4 change.
- No TD-P13-01..04 absorption; no TASK-221..230 recreation; no P13-PACKAGE-03.

## Execution gate
This Sprint is materialized only. Product execution begins only after this planning/materialization change is reviewed, exact-head CI/Heavy gates pass, and the PR is integrated into `main`. Execute TASK-240..248 in dependency order with one authoritative commit per TASK.

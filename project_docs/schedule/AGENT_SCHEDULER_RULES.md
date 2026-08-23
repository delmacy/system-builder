# Agent Scheduler Rules

This document defines scheduler/AgentFactory behavior if that automation is used. It is not the current default executor and does not supersede `AGENTS.md`, `SPRINT_GENERATION_POLICY.md`, `SPRINT_MODE.md`, current repository memory, or committed TASK authority.

The current normal operating model is local-first Sprint execution. AgentFactory/scheduler automation is optional infrastructure that must obey the same repository-first gates.

A scheduler must:

1. read current repository memory plus machine-readable Work Packages/DAG;
2. evaluate predecessor, architecture, contract, readiness and human-decision gates;
3. distinguish planning eligibility (`READY`/candidate/forecast) from commitment authority;
4. exclude `BLOCKED`, unresolved `RESEARCH`, unapproved forecast and otherwise ineligible nodes;
5. rank eligible candidates by milestone value, critical path, risk reduction and integration benefit;
6. respect execution, review, CI and integration capacity;
7. propose/materialize only what repository policy permits, never silently promoting forecast work;
8. pin the active Sprint, TASK specs, contracts and context supplied to the executor;
9. execute only committed TASKs in dependency order when explicitly acting as an authorized executor;
10. ingest actual evidence after execution/integration and recompute successor readiness;
11. preserve package review, documentation/closure and fresh-main revalidation boundaries;
12. stop on undeclared L3/L4 change, architecture ambiguity, security/governance weakening, forbidden-path requirement or other repository-defined escalation.

The scheduler must never infer missing architecture, relax a gate, convert authentication into authorization, absorb unrelated technical debt, or treat a READY/FORECAST node as execution authority.

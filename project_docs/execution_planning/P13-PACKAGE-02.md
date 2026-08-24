# P13-PACKAGE-02 — Autonomous Runtime Identity, Authority & Generated Experience

Status: ACTIVE / CONSTRUCTION B MATERIALIZED
Milestone: M13
Primary WBS: 13.2.1-13.2.3
Predecessor: P13-PACKAGE-01 CLOSED

## Package goal
Make the autonomous client runtime actor-aware and usable: authenticate/session-bind identities, enforce materialized roles/permissions/policies, and render generated views/forms/interactions without consulting Builder during normal operation.

## Construction A
`P13-RUNTIME-IDENTITY-SESSION-01` / TASK-231..239 is INTEGRATED by PR #250; WBS 13.2.1 SATISFIED.

## Construction B authority
Bounded L3 change control is ACCEPTED/INTEGRATED by PR #253 at `039edb5ba9bab61dadbfe845e6cafb26dbb61933`, exact authority head `00b8be57c4036243035e2f6bd8547a644b1e33d0`, Deterministic CI #618 PASS, Heavy Product Tests #41 PASS. No L4 requirement was found.

## Construction B — Authorization and generated interaction
Sprint: `P13-RUNTIME-AUTHORITY-GENERATED-INTERACTION-01`
Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Tasks: TASK-240..248
Primary WBS: 13.2.2-13.2.3

Goal: explicit actor/membership-role resolution -> deterministic permission/policy allow/deny -> deterministic generated view/form binding -> representative authority-gated action and generated interaction, all fail-closed and autonomous.

## Boundaries
Authentication != authorization; free-text policy is non-executable; no inferred privilege/binding; no provider-specific IAM/UI framework; no new bounded context/ownership/topology; TD-P13-01..04 remain outside scope; P13-PACKAGE-03 remains NOT STARTED.

Construction C remains FORECAST / CONDITIONAL. Package Integration & Review and Documentation & Closure remain FORECAST.

# M0 — Engineering Bootstrap and Legacy Rebaseline

## Objective

Make System Builder safe to develop with fresh agent sessions and inexpensive execution models before product implementation begins.

## Deliverables

- canonical documentation/ADR structure;
- evidence-backed `gestaotecnica` inventory;
- proposed/implemented monorepo scaffold;
- compact task contract;
- local context builder;
- task selection/preparation/verification/closure commands or equivalent scripts;
- model routing policy;
- path/scope enforcement;
- architecture dependency gates;
- baseline lint/typecheck/unit test harness;
- project-state update convention;
- executable roadmap for subsequent milestones.

## Constraints

- local-first;
- no RAG/vector DB;
- no agent dashboard;
- no mandatory GitHub Actions orchestration;
- no product feature implementation beyond what is necessary to prove harness/scaffold;
- no bulk legacy copy.

## Exit gate

A fresh agent can receive one prepared task context, modify only allowed paths, run deterministic validation, produce evidence and update state without needing prior chat history.

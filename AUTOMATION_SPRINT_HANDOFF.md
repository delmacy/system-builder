# Automation Sprint Handoff

status: RUNNING
worker_slot: :30
started_at: 2026-08-25T12:35:04-03:00
updated_at: 2026-08-25T12:35:04-03:00
lease_until: 2026-08-25T13:00:04-03:00
observed_main_sha: cbf0f8c42201793e9310e21c6835fc7b18d14aee
active_branch: sprint/P14-EVIDENCE-MIGRATION-CERTIFICATION-01
active_pr: none
active_head_sha: cbf0f8c42201793e9310e21c6835fc7b18d14aee
current_step: Construction C materialization integrated by PR #350; reconstructing authority and preparing TASK-293 execution only.

last_completed_step: PR #350 planning/materialization exact head bf8befb06c3fd0bb97402d114f9c5bc698d8b747 had exact-head Deterministic CI and Heavy Product Tests PASS with no blocking reviews/threads and was squash-merged as cbf0f8c42201793e9310e21c6835fc7b18d14aee. Construction C P14-EVIDENCE-MIGRATION-CERTIFICATION-01 is COMMITTED / MATERIALIZED / NOT EXECUTED with TASK-293..297. TASK-293 is first eligible.
next_authorized_step: Create/revalidate sprint/P14-EVIDENCE-MIGRATION-CERTIFICATION-01 from merge-main cbf0f8c42201793e9310e21c6835fc7b18d14aee and execute only TASK-293 within its exact test-only allowed paths. Validate via exact-head GitHub CI before advancing to TASK-294.

## Boundaries
Do not invent migration framework/topology, database mutation, Runtime Audit Trail replacement, authorization semantics, provider/storage coupling, ADR-0009 reinterpretation or TD-P13-01..04 absorption. Preserve one authoritative commit per TASK and dependency order.

## resume_prompt
Retome `delmacy/system-builder` em main `cbf0f8c42201793e9310e21c6835fc7b18d14aee`. PR #350 materializou e integrou Construction C `P14-EVIDENCE-MIGRATION-CERTIFICATION-01`; TASK-293..297 estão COMMITTED/MATERIALIZED/NOT EXECUTED. Execute somente TASK-293 primeiro, test-only, usando o Compiler real com migration bundle + evidence provenance; preserve contratos existentes e passe os gates antes de TASK-294.

## Operational model-selection instruction
All TASKs are executed with strong models. `model_tier` is retained only for task-schema compatibility and is not execution routing.

# Automation Sprint Handoff

status: RUNNING
worker_slot: :50
started_at: 2026-08-25T08:52:46-03:00
updated_at: 2026-08-25T08:52:46-03:00
lease_until: 2026-08-25T09:17:46-03:00
observed_main_sha: 1a3ef00cde54fb53a1c7825f67edb31f3ad86105
active_branch: sprint/P14-EVIDENCE-INTEGRITY-FOUNDATION-01
active_pr: 344
active_head_sha: 1dccbe9396eb9bcee424c84b3926ab53ba1f9e9f
current_step: TASK-284 exact-head gates confirmed PASS; reconstructing authority and executing only TASK-285.

last_completed_step: TASK-284=1dccbe9396eb9bcee424c84b3926ab53ba1f9e9f passed Deterministic CI #753 and Heavy Product Tests #180 on exact head.
next_authorized_step: Execute only TASK-285 in dependency order, preserve one authoritative commit, run exact-head Deterministic CI and Heavy Product Tests; do not execute TASK-286 before TASK-285 gates pass.

resume_prompt: Retome delmacy/system-builder do fresh main 1a3ef00cde54fb53a1c7825f67edb31f3ad86105 e da Sprint branch sprint/P14-EVIDENCE-INTEGRITY-FOUNDATION-01 / draft PR #344. TASK-280..284 estão concluídas; TASK-284=1dccbe9396eb9bcee424c84b3926ab53ba1f9e9f com CI #753 PASS e Heavy #180 PASS. Execute somente TASK-285 conforme specs/tasks/TASK-285-P14-PROVENANCE-SERIALIZATION-PRESERVATION.md; não avance TASK-286 antes dos gates exact-head da TASK-285. Construction B/C permanecem forecast. Não reinterpretar ADR-0009, não transformar provenance/integrity em autorização, não introduzir provider/storage topology não materializada, não substituir Runtime Audit Trail e não absorver TD-P13-01..04.

## Boundaries
Construction A only: TASK-280..286 in dependency order. Construction B/C remain forecast and must not execute. Do not reopen P14-PACKAGE-01; do not replace Runtime Audit Trail, convert provenance/integrity into authorization, introduce unmaterialized provider/storage topology, change ADR-0009 core meaning, or absorb/re-rank TD-P13-01..04.

## Operational model-selection instruction
All TASKs are executed with strong models. `model_tier` is retained only for task-schema compatibility and is not execution routing.

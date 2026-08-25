# Automation Sprint Handoff

status: READY
worker_slot: :50
started_at: 2026-08-25T08:52:46-03:00
updated_at: 2026-08-25T08:55:30-03:00
lease_until: 2026-08-25T08:55:30-03:00
observed_main_sha: 1a3ef00cde54fb53a1c7825f67edb31f3ad86105
active_branch: sprint/P14-EVIDENCE-INTEGRITY-FOUNDATION-01
active_pr: 344
active_head_sha: f0f91c5aabbd90bacbfa9277641ea78dcfd50cba
current_step: TASK-285 authoritative commit created; exact-head Deterministic CI #754 and Heavy Product Tests #181 are in progress. Lease released.

last_completed_step: TASK-284=1dccbe9396eb9bcee424c84b3926ab53ba1f9e9f passed Deterministic CI #753 and Heavy Product Tests #180. TASK-285 was executed as one authoritative commit f0f91c5aabbd90bacbfa9277641ea78dcfd50cba, adding bounded JSON serialization/deserialization preservation proof for normalized integrity metadata, verification equivalence, backward-compatible absence, and no hidden provider/authority data. PR #344 remains OPEN / MERGEABLE / DRAFT on that exact head.
next_authorized_step: Revalidate Deterministic CI #754 and Heavy Product Tests #181 on exact head f0f91c5aabbd90bacbfa9277641ea78dcfd50cba. If both PASS and no blocker/head drift exists, preserve TASK-285 as authoritative and execute only TASK-286 in dependency order. If either gate fails, inspect logs and correct only within TASK-285 allowed scope; preserve one authoritative TASK-285 commit before rerunning gates.

resume_prompt: Retome delmacy/system-builder do fresh main 1a3ef00cde54fb53a1c7825f67edb31f3ad86105 e da Sprint branch sprint/P14-EVIDENCE-INTEGRITY-FOUNDATION-01 / draft PR #344, head exato f0f91c5aabbd90bacbfa9277641ea78dcfd50cba. TASK-280..284 estão concluídas; TASK-284=1dccbe9396eb9bcee424c84b3926ab53ba1f9e9f com CI #753 PASS e Heavy #180 PASS. TASK-285=f0f91c5aabbd90bacbfa9277641ea78dcfd50cba adiciona somente tests/product/evidence-provenance-integrity-serialization.test.ts e tem CI #754 + Heavy #181 em andamento. Se ambos PASS no mesmo head e sem blocker, execute somente TASK-286; não avance se qualquer gate da 285 falhar. PR #344 permanece draft até TASK-280..286 + Sprint report + gates finais. Construction B/C permanecem forecast. Não reinterpretar ADR-0009, não transformar provenance/integrity em autorização, não introduzir provider/storage topology não materializada, não substituir Runtime Audit Trail e não absorver TD-P13-01..04.

## Boundaries
Construction A only: TASK-280..286 in dependency order. Construction B/C remain forecast and must not execute. Do not reopen P14-PACKAGE-01; do not replace Runtime Audit Trail, convert provenance/integrity into authorization, introduce unmaterialized provider/storage topology, change ADR-0009 core meaning, or absorb/re-rank TD-P13-01..04.

## Operational model-selection instruction
All TASKs are executed with strong models. `model_tier` is retained only for task-schema compatibility and is not execution routing.

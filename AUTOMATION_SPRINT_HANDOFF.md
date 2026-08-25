# Automation Sprint Handoff

status: READY
worker_slot: :30
started_at: 2026-08-25T08:32:38-03:00
updated_at: 2026-08-25T08:35:00-03:00
lease_until: 2026-08-25T08:35:00-03:00
observed_main_sha: 1a3ef00cde54fb53a1c7825f67edb31f3ad86105
active_branch: sprint/P14-EVIDENCE-INTEGRITY-FOUNDATION-01
active_pr: 344
active_head_sha: 1dccbe9396eb9bcee424c84b3926ab53ba1f9e9f
current_step: TASK-284 authoritative commit created; exact-head Deterministic CI #753 and Heavy Product Tests #180 are in progress. Lease released.

last_completed_step: TASK-283=a94b921d563d8c6131d96b43f904b1d2432b1307 passed Deterministic CI #752 and Heavy #179. TASK-284 was executed as one authoritative commit 1dccbe9396eb9bcee424c84b3926ab53ba1f9e9f, adding focused product proof that historical ArtifactEnvelope remains unchanged without integrity, optional evidence integrity round-trips through the existing extensions boundary, and malformed integrity is rejected by the owning evidence-provenance contract. PR #344 remains OPEN / MERGEABLE / DRAFT on that exact head.
next_authorized_step: Revalidate Deterministic CI #753 and Heavy Product Tests #180 on exact head 1dccbe9396eb9bcee424c84b3926ab53ba1f9e9f. If both PASS and no blocker/head drift exists, preserve TASK-284 as authoritative and execute only TASK-285 in dependency order. If either gate fails, inspect logs and correct only within TASK-284 allowed scope; recompact TASK-284 to one authoritative commit before rerunning gates. Do not execute TASK-286 before TASK-285 exact-head gates pass.

resume_prompt: Retome delmacy/system-builder do fresh main 1a3ef00cde54fb53a1c7825f67edb31f3ad86105 e da Sprint branch sprint/P14-EVIDENCE-INTEGRITY-FOUNDATION-01 / draft PR #344, head exato 1dccbe9396eb9bcee424c84b3926ab53ba1f9e9f. Planning P14-PACKAGE-02 está integrado. TASK-280=2d6c5ee042939ac41e59fa8f27a641257e87c5ef (CI #743 PASS, Heavy #170 PASS), TASK-281=81f02cbe5d572fe6836595664541b3924452f222 (CI #746 PASS, Heavy #173 PASS), TASK-282=55a99d67e1deae51bb41ef4092e707ad4ad3d735 (CI #749 PASS, Heavy #176 PASS), TASK-283=a94b921d563d8c6131d96b43f904b1d2432b1307 (CI #752 PASS, Heavy #179 PASS), TASK-284=1dccbe9396eb9bcee424c84b3926ab53ba1f9e9f com CI #753 e Heavy #180 em andamento. Se ambos PASS no mesmo head e sem blocker, execute somente TASK-285; não avance para TASK-286 antes dos gates da 285. PR #344 permanece draft até TASK-280..286 + Sprint report + gates finais. Construction B/C permanecem forecast. Não reinterpretar ADR-0009, não transformar provenance/integrity em autorização, não introduzir provider/storage topology não materializada, não substituir Runtime Audit Trail e não absorver TD-P13-01..04.

## Boundaries
Construction A only: TASK-280..286 in dependency order. Construction B/C remain forecast and must not execute. Do not reopen P14-PACKAGE-01; do not replace Runtime Audit Trail, convert provenance/integrity into authorization, introduce unmaterialized provider/storage topology, change ADR-0009 core meaning, or absorb/re-rank TD-P13-01..04.

## Operational model-selection instruction
All TASKs are executed with strong models. `model_tier` is retained only for task-schema compatibility and is not execution routing.

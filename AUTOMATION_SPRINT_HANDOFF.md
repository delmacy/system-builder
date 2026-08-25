# Automation Sprint Handoff

status: RUNNING
worker_slot: :50
started_at: 2026-08-25T07:53:01-03:00
updated_at: 2026-08-25T07:58:00-03:00
lease_until: 2026-08-25T08:23:00-03:00
observed_main_sha: 1a3ef00cde54fb53a1c7825f67edb31f3ad86105
active_branch: sprint/P14-EVIDENCE-INTEGRITY-FOUNDATION-01
active_pr: 344
active_head_sha: 0ac7ec19beb3bb40006aa37ccee2a69c8caa00a3
current_step: TASK-280 exact-head validation on draft Sprint PR #344; Deterministic CI #741 and Heavy Product Tests #168 are in progress.

last_completed_step: Planning & Materialization PR #343 head 9f67257b22481d46a78ce0a56f5f317ef02bad78 passed Deterministic CI #740 and Heavy Product Tests #167 with no blocking comments and was squash-merged as main 1a3ef00cde54fb53a1c7825f67edb31f3ad86105. Planning head and merge-main share tree 111933ffeaf612670a06e5bab310ebdfd7417512. Created sprint/P14-EVIDENCE-INTEGRITY-FOUNDATION-01 from fresh main and implemented TASK-280 as one authoritative commit 0ac7ec19beb3bb40006aa37ccee2a69c8caa00a3, changing only packages/contracts/evidence-provenance/** and tests/product/** within TASK bounds. Opened draft Sprint PR #344 for exact-head CI.
next_authorized_step: Revalidate CI #741 / Heavy #168 on exact head 0ac7ec19beb3bb40006aa37ccee2a69c8caa00a3. If both pass and no blocker exists, preserve TASK-280 commit and execute TASK-281 only, in dependency order, on the same Sprint branch. If a gate fails, diagnose and correct only within TASK-280 scope before continuing.

## Boundaries
Construction A only: TASK-280..286 in dependency order. Construction B/C remain forecast and must not execute. Do not reopen P14-PACKAGE-01; do not replace Runtime Audit Trail, convert provenance/integrity into authorization, introduce unmaterialized provider/storage topology, change ADR-0009 core meaning, or absorb/re-rank TD-P13-01..04.

## Operational model-selection instruction
All TASKs are executed with strong models. `model_tier` is retained only for task-schema compatibility and is not execution routing.

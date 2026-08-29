# Automation Sprint Handoff

machine_state: NEXT_30
next_worker: :30
claimed_by: null
claim_until: null
sequence: 27
updated_at: 2026-08-29T14:10:00Z
active_pr: 493
active_branch: hotfix/handoff-v2-test-reconciliation
active_head_sha: 8f4845a0bf28067c94213f50ef2f43ae822a27d8
deterministic_ci: failure
heavy_product_tests: success
last_event: WORKER_HANDOFF
reason: null

## Authority

Only next_worker selects who may work. Claims, CI, PR metadata and reasons are advisory context and must never create a permanent queue lock.

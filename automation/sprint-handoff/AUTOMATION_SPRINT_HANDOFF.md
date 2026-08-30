# Automation Sprint Handoff

machine_state: NEXT_50
next_worker: :50
claimed_by: null
claim_until: null
sequence: 90
updated_at: 2026-08-30T03:36:15Z
active_pr: null
active_branch: null
active_head_sha: null
deterministic_ci: failure
heavy_product_tests: success
last_event: WORKER_HANDOFF
reason: null

## Authority

Only next_worker selects who may work. Claims, CI, PR metadata and reasons are advisory context and must never create a permanent queue lock.

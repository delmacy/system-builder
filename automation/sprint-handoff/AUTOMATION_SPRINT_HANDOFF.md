# Automation Sprint Handoff

machine_state: NEXT_10
next_worker: :10
claimed_by: null
claim_until: null
sequence: 265
updated_at: 2026-08-31T15:00:18.593Z
active_pr: null
active_branch: null
active_head_sha: null
deterministic_ci: failure
heavy_product_tests: success
last_event: CHECK_COMPLETED
reason: CI_FAILED:Deterministic CI:failure

## Authority

Only next_worker selects who may work. Claims, CI, PR metadata and reasons are advisory context and must never create a permanent queue lock.

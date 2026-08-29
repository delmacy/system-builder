# Automation Sprint Handoff

machine_state: NEXT_10
next_worker: :10
claimed_by: null
claim_until: null
sequence: 19
updated_at: 2026-08-29T12:47:00Z
active_pr: null
active_branch: null
active_head_sha: null
deterministic_ci: pending
heavy_product_tests: pending
last_event: STATE_V2_MIGRATION
reason: SIMPLIFIED_NEXT_WORKER_TOKEN

## Authority

Only `next_worker` selects who may work. Claims, CI, PR metadata, checks, reasons and legacy phase/owner fields are advisory context and must never create a permanent queue lock.
